import { Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowLeft, FileSpreadsheet, Upload } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AdminLayout from '@/layouts/admin-layout';
import { formatCLP } from '@/lib/format';

type Branch = { id: number; name: string };

type PreviewRow = {
    excel_row: number;
    linea: string;
    version: string;
    material: string;
    precio: number | null;
    action: 'create' | 'update' | 'skip';
};

type PreviewData = {
    rows: PreviewRow[];
    stats: { create: number; update: number; skip: number };
};

export default function VehicleVersionsBulkImport() {
    const { props } = usePage<{ branches: Branch[]; errors?: Record<string, string> }>();
    const branches = props.branches ?? [];
    const errors = props.errors ?? {};

    const [selectedBranches, setSelectedBranches] = useState<number[]>([]);
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<PreviewData | null>(null);
    const [loadingPreview, setLoadingPreview] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [previewError, setPreviewError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const canPreview = !!file;
    const canSubmit = !!file && selectedBranches.length > 0 && !!preview && preview.stats.create + preview.stats.update > 0;

    const toggleBranch = (id: number) => {
        setSelectedBranches((prev) => (prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0] ?? null;
        setFile(f);
        setPreview(null);
        setPreviewError(null);
    };

    const fetchPreview = async () => {
        if (!file) return;
        setLoadingPreview(true);
        setPreviewError(null);

        const fd = new FormData();
        fd.append('file', file);

        // Para CSRF Laravel acepta:
        //   - `X-CSRF-TOKEN` con el token del meta tag (renderizado en app.blade.php)
        //   - `X-XSRF-TOKEN` con el valor URL-decoded de la cookie XSRF-TOKEN
        // Probamos meta primero y caemos a la cookie como fallback. Así nunca
        // más nos quedamos con un token vacío que dispara 419.
        const metaCsrf = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content ?? '';
        const cookieCsrf = (() => {
            const m = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]+)/);
            return m ? decodeURIComponent(m[1]) : '';
        })();

        const headers: Record<string, string> = { Accept: 'application/json' };
        if (metaCsrf) headers['X-CSRF-TOKEN'] = metaCsrf;
        if (cookieCsrf) headers['X-XSRF-TOKEN'] = cookieCsrf;

        try {
            const res = await fetch('/admin/vehicle-versions/bulk-import/preview', {
                method: 'POST',
                body: fd,
                headers,
                credentials: 'same-origin',
            });
            if (res.status === 419) {
                throw new Error('La sesión expiró. Recarga la página y volvé a intentar.');
            }
            if (!res.ok) throw new Error(`Error ${res.status}`);
            const data = (await res.json()) as PreviewData;
            setPreview(data);
        } catch (err) {
            setPreviewError(err instanceof Error ? err.message : 'No se pudo leer el archivo.');
        } finally {
            setLoadingPreview(false);
        }
    };

    const submit = () => {
        if (!file || selectedBranches.length === 0) return;
        setSubmitting(true);
        const fd = new FormData();
        fd.append('file', file);
        selectedBranches.forEach((id) => fd.append('branch_ids[]', String(id)));
        router.post('/admin/vehicle-versions/bulk-import', fd, {
            forceFormData: true,
            onFinish: () => setSubmitting(false),
        });
    };

    const visibleRows = useMemo(() => preview?.rows.slice(0, 100) ?? [], [preview]);

    return (
        <AdminLayout
            breadcrumbs={[
                { title: 'Dashboard', href: '/admin' },
                { title: 'Versiones', href: '/admin/vehicle-versions' },
                { title: 'Importar lista de precios', href: '/admin/vehicle-versions/bulk-import' },
            ]}
        >
            <Head title="Admin — Importar lista de precios" />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Importar lista de precios</h1>
                        <p className="text-sm text-muted-foreground">
                            Sube el Excel "Lista de Precios sugeridos" de Toyota. Las versiones existentes solo actualizan precio
                            y bonos; las nuevas se crean con datos básicos para completar a mano después.
                        </p>
                    </div>
                    <Button asChild variant="outline">
                        <Link href="/admin/vehicle-versions">
                            <ArrowLeft className="mr-1 size-4" />
                            Volver
                        </Link>
                    </Button>
                </div>

                {/* Paso 1: sucursales */}
                <section className="rounded-lg border bg-card p-5">
                    <header className="mb-3 flex items-center gap-2">
                        <span className="inline-flex size-6 items-center justify-center rounded-full bg-foreground text-xs font-semibold text-background">
                            1
                        </span>
                        <h2 className="text-base font-semibold">Selecciona la sucursal o sucursales</h2>
                    </header>
                    <p className="mb-3 text-sm text-muted-foreground">
                        Indica en qué sucursales estarán disponibles los vehículos importados. Puedes elegir una o ambas.
                    </p>
                    <div className="flex flex-wrap gap-3">
                        {branches.map((b) => (
                            <label
                                key={b.id}
                                className={`flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm transition ${
                                    selectedBranches.includes(b.id)
                                        ? 'border-foreground bg-foreground text-background'
                                        : 'border-input hover:bg-accent'
                                }`}
                            >
                                <Checkbox
                                    checked={selectedBranches.includes(b.id)}
                                    onCheckedChange={() => toggleBranch(b.id)}
                                    className="data-[state=checked]:bg-background data-[state=checked]:text-foreground"
                                />
                                {b.name}
                            </label>
                        ))}
                    </div>
                    {errors['branch_ids'] && (
                        <p className="mt-2 text-sm text-red-600">{errors['branch_ids']}</p>
                    )}
                </section>

                {/* Paso 2: archivo */}
                <section className="rounded-lg border bg-card p-5">
                    <header className="mb-3 flex items-center gap-2">
                        <span className="inline-flex size-6 items-center justify-center rounded-full bg-foreground text-xs font-semibold text-background">
                            2
                        </span>
                        <h2 className="text-base font-semibold">Sube el Excel</h2>
                    </header>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <div className="flex-1">
                            <Label htmlFor="file" className="sr-only">
                                Archivo
                            </Label>
                            <Input
                                id="file"
                                ref={fileInputRef}
                                type="file"
                                accept=".xlsx,.xls"
                                onChange={handleFileChange}
                            />
                            {file && (
                                <p className="mt-1 text-xs text-muted-foreground">
                                    <FileSpreadsheet className="mr-1 inline size-3" />
                                    {file.name} — {(file.size / 1024).toFixed(0)} KB
                                </p>
                            )}
                            {errors['file'] && <p className="mt-2 text-sm text-red-600">{errors['file']}</p>}
                        </div>
                        <Button onClick={fetchPreview} disabled={!canPreview || loadingPreview} variant="secondary">
                            {loadingPreview ? 'Analizando…' : 'Previsualizar'}
                        </Button>
                    </div>
                    {previewError && <p className="mt-2 text-sm text-red-600">{previewError}</p>}
                </section>

                {/* Paso 3: preview + confirmar */}
                {preview && (
                    <section className="rounded-lg border bg-card p-5">
                        <header className="mb-3 flex items-center gap-2">
                            <span className="inline-flex size-6 items-center justify-center rounded-full bg-foreground text-xs font-semibold text-background">
                                3
                            </span>
                            <h2 className="text-base font-semibold">Revisa y confirma</h2>
                        </header>

                        <div className="mb-4 flex flex-wrap gap-3 text-sm">
                            <div className="rounded-md bg-green-50 px-3 py-2 text-green-800">
                                <strong>{preview.stats.create}</strong> versiones nuevas se crearán
                            </div>
                            <div className="rounded-md bg-blue-50 px-3 py-2 text-blue-800">
                                <strong>{preview.stats.update}</strong> existentes actualizan precio
                            </div>
                            {preview.stats.skip > 0 && (
                                <div className="rounded-md bg-yellow-50 px-3 py-2 text-yellow-800">
                                    <strong>{preview.stats.skip}</strong> filas se ignorarán (datos faltantes)
                                </div>
                            )}
                        </div>

                        <div className="max-h-96 overflow-y-auto rounded-md border">
                            <Table>
                                <TableHeader className="sticky top-0 bg-card">
                                    <TableRow>
                                        <TableHead className="w-16">Fila</TableHead>
                                        <TableHead className="w-24">Acción</TableHead>
                                        <TableHead>Modelo</TableHead>
                                        <TableHead>Versión</TableHead>
                                        <TableHead>Material</TableHead>
                                        <TableHead className="text-right">Precio</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {visibleRows.map((r) => (
                                        <TableRow key={r.excel_row}>
                                            <TableCell className="text-xs text-muted-foreground">{r.excel_row}</TableCell>
                                            <TableCell>
                                                {r.action === 'create' && (
                                                    <Badge className="bg-green-600">Crear</Badge>
                                                )}
                                                {r.action === 'update' && (
                                                    <Badge className="bg-blue-600">Actualizar</Badge>
                                                )}
                                                {r.action === 'skip' && <Badge variant="outline">Ignorar</Badge>}
                                            </TableCell>
                                            <TableCell className="font-medium">{r.linea || <span className="text-muted-foreground">—</span>}</TableCell>
                                            <TableCell className="text-sm">{r.version || <span className="text-muted-foreground">—</span>}</TableCell>
                                            <TableCell className="font-mono text-xs">{r.material || '—'}</TableCell>
                                            <TableCell className="text-right text-sm">{formatCLP(r.precio)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            {preview.rows.length > 100 && (
                                <p className="border-t bg-muted/30 p-2 text-center text-xs text-muted-foreground">
                                    Mostrando 100 de {preview.rows.length} filas. Se importarán todas al confirmar.
                                </p>
                            )}
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                            <p className="text-xs text-muted-foreground">
                                {selectedBranches.length === 0
                                    ? '⚠ Selecciona al menos una sucursal en el paso 1 para poder importar.'
                                    : `Las versiones quedarán disponibles en ${selectedBranches.length} sucursal(es).`}
                            </p>
                            <Button onClick={submit} disabled={!canSubmit || submitting}>
                                <Upload className="mr-1 size-4" />
                                {submitting ? 'Importando…' : 'Confirmar importación'}
                            </Button>
                        </div>
                    </section>
                )}
            </div>
        </AdminLayout>
    );
}
