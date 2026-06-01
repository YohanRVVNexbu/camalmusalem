import { Head, Link, router, usePage } from '@inertiajs/react';
import { Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { ImportExportBar } from '@/components/admin/import-export-bar';
import { Input } from '@/components/ui/input';
import { formatCLP } from '@/lib/format';
import { useMemo, useState } from 'react';
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AdminLayout from '@/layouts/admin-layout';

type Seminuevo = { id: number; brand: string; model: string; vu_code: string | null; year: number; km: number; price: string; fuel: string | null; transmission: string | null; is_visible: boolean; };

export default function SeminuevosIndex({ seminuevos }: { seminuevos: Seminuevo[] }) {
    const { flash } = usePage<{ flash: { success?: string } }>().props;
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [query, setQuery] = useState('');

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return seminuevos;
        return seminuevos.filter((s) =>
            `${s.brand} ${s.model} ${s.vu_code ?? ''} ${s.year}`.toLowerCase().includes(q),
        );
    }, [seminuevos, query]);

    return (
        <AdminLayout breadcrumbs={[{ title: 'Dashboard', href: '/admin' }, { title: 'Seminuevos', href: '/admin/seminuevos' }]}>
            <Head title="Admin — Seminuevos" />
            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Seminuevos</h1>
                    <div className="flex gap-2">
                        <ImportExportBar
                            entityLabel="seminuevos"
                            exportUrl="/admin/seminuevos/export"
                            importUrl="/admin/seminuevos/import"
                            templateUrl="/admin/seminuevos/template"
                        />
                        <Button asChild><Link href="/admin/seminuevos/create"><Plus className="mr-1 size-4" />Nuevo seminuevo</Link></Button>
                    </div>
                </div>
                {flash?.success && <div className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700">{flash.success}</div>}
                <div className="relative max-w-sm">
                    <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Buscar por VU, marca, modelo o año…"
                        className="pl-9"
                    />
                </div>
                <div className="rounded-lg border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>VU</TableHead>
                                <TableHead>Vehículo</TableHead>
                                <TableHead>Año</TableHead>
                                <TableHead>Km</TableHead>
                                <TableHead>Precio</TableHead>
                                <TableHead>Combustible</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filtered.map((s) => (
                                <TableRow key={s.id}>
                                    <TableCell>
                                        {s.vu_code
                                            ? <Badge variant="outline" className="font-mono">{s.vu_code}</Badge>
                                            : <span className="text-muted-foreground">—</span>}
                                    </TableCell>
                                    <TableCell className="font-medium">{s.brand} {s.model}</TableCell>
                                    <TableCell>{s.year}</TableCell>
                                    <TableCell>{s.km.toLocaleString('es-CL')} km</TableCell>
                                    <TableCell>{formatCLP(s.price)}</TableCell>
                                    <TableCell>{s.fuel ?? '—'}</TableCell>
                                    <TableCell><Badge variant={s.is_visible ? 'default' : 'secondary'}>{s.is_visible ? 'Visible' : 'Oculto'}</Badge></TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" asChild>
                                                <Link href={`/admin/seminuevos/${s.id}/edit`}><Pencil className="size-4" /></Link>
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => setDeleteId(s.id)}>
                                                <Trash2 className="size-4 text-destructive" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {filtered.length === 0 && (
                                <TableRow><TableCell colSpan={8} className="py-8 text-center text-muted-foreground">{query ? 'No se encontraron seminuevos para tu búsqueda.' : 'No hay seminuevos.'}</TableCell></TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
            <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader><AlertDialogTitle>¿Eliminar seminuevo?</AlertDialogTitle><AlertDialogDescription>Esta acción no se puede deshacer.</AlertDialogDescription></AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => { router.delete(`/admin/seminuevos/${deleteId}`, { onFinish: () => setDeleteId(null) }); }} className="bg-destructive text-white hover:bg-destructive/90">Eliminar</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AdminLayout>
    );
}
