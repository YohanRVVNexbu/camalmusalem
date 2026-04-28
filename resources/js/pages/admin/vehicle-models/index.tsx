import { Head, Link, router, usePage } from '@inertiajs/react';
import { Layers, Pencil, Plus, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ImportExportBar } from '@/components/admin/import-export-bar';
import AdminLayout from '@/layouts/admin-layout';

type VehicleModel = {
    id: number;
    name: string;
    slug: string;
    brand: { id: number; name: string };
    body_type: string | null;
    segment: string | null;
    hero_image: string | null;
    is_active: boolean;
    display_order: number;
    versions_count: number;
};

export default function VehicleModelsIndex({
    models, bodyTypes,
}: {
    models: VehicleModel[];
    bodyTypes: Record<string, string>;
}) {
    const { flash } = usePage<{ flash: { success?: string; error?: string } }>().props;
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [search, setSearch] = useState('');

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return models;
        return models.filter((m) =>
            m.name.toLowerCase().includes(q) ||
            m.brand.name.toLowerCase().includes(q)
        );
    }, [models, search]);

    return (
        <AdminLayout breadcrumbs={[
            { title: 'Dashboard', href: '/admin' },
            { title: 'Vehículos nuevos', href: '/admin/vehicle-models' },
        ]}>
            <Head title="Admin — Vehículos nuevos" />
            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Vehículos nuevos</h1>
                        <p className="text-sm text-muted-foreground">Modelos del catálogo. Haz clic en <strong>Versiones</strong> de cada modelo para editar fichas técnicas y precios.</p>
                    </div>
                    <div className="flex gap-2">
                        <ImportExportBar
                            entityLabel="lista de precios"
                            exportUrl="/admin/vehicle-versions/precios/export"
                            importUrl="/admin/vehicle-versions/precios/import"
                            templateUrl="/admin/vehicle-versions/precios/export"
                            label="Precios"
                        />
                        <ImportExportBar
                            entityLabel="catálogo completo"
                            exportUrl="/admin/vehicle-versions/export"
                            importUrl="/admin/vehicle-versions/import"
                            templateUrl="/admin/vehicle-versions/template"
                            label="Catálogo"
                        />
                        <Button asChild>
                            <Link href="/admin/vehicle-models/create"><Plus className="mr-1 size-4" />Nuevo modelo</Link>
                        </Button>
                    </div>
                </div>

                {flash?.success && <div className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700">{flash.success}</div>}
                {flash?.error && <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{flash.error}</div>}

                <div className="flex items-center gap-3">
                    <Input
                        placeholder="Buscar por nombre o marca…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="max-w-sm"
                    />
                    <span className="text-sm text-muted-foreground">{filtered.length} de {models.length}</span>
                </div>

                <div className="rounded-lg border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-20">Imagen</TableHead>
                                <TableHead>Modelo</TableHead>
                                <TableHead>Marca</TableHead>
                                <TableHead>Tipo</TableHead>
                                <TableHead>Versiones</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filtered.map((m) => (
                                <TableRow key={m.id}>
                                    <TableCell>
                                        {m.hero_image ? (
                                            <img src={m.hero_image} className="h-10 w-16 rounded object-cover" alt="" />
                                        ) : (
                                            <span className="text-xs text-muted-foreground">—</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        {m.name}
                                        {m.segment && <div className="text-xs text-muted-foreground">{m.segment}</div>}
                                    </TableCell>
                                    <TableCell>{m.brand.name}</TableCell>
                                    <TableCell>
                                        {m.body_type ? <Badge variant="outline">{bodyTypes[m.body_type] ?? m.body_type}</Badge> : '—'}
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="outline" size="sm" asChild className="gap-1.5 h-7 text-xs">
                                            <Link href={`/admin/vehicle-versions?model_id=${m.id}`}>
                                                <Layers className="size-3" />
                                                {m.versions_count} {m.versions_count === 1 ? 'versión' : 'versiones'}
                                            </Link>
                                        </Button>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={m.is_active ? 'default' : 'secondary'}>{m.is_active ? 'Activo' : 'Inactivo'}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" asChild>
                                                <Link href={`/admin/vehicle-models/${m.id}/edit`}><Pencil className="size-4" /></Link>
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => setDeleteId(m.id)} disabled={m.versions_count > 0}>
                                                <Trash2 className="size-4 text-destructive" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {filtered.length === 0 && (
                                <TableRow><TableCell colSpan={7} className="py-8 text-center text-muted-foreground">Sin resultados.</TableCell></TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar modelo?</AlertDialogTitle>
                        <AlertDialogDescription>Si tiene versiones asociadas, no se podrá eliminar.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => router.delete(`/admin/vehicle-models/${deleteId}`, { onFinish: () => setDeleteId(null) })}
                            className="bg-destructive text-white hover:bg-destructive/90"
                        >Eliminar</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AdminLayout>
    );
}
