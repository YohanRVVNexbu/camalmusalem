import { Head, Link, router, usePage } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AdminLayout from '@/layouts/admin-layout';

type Version = {
    id: number;
    trim_name: string;
    model_year: number;
    powertrain_type: string;
    drivetrain: string;
    transmission_type: string | null;
    msrp_clp: number | null;
    is_active: boolean;
    model: { id: number; name: string; brand: { name: string } };
};

type ModelLite = { id: number; name: string; brand_id: number };

const POWERTRAIN_LABELS: Record<string, string> = {
    gasoline: 'Gasolina', diesel: 'Diésel', hybrid: 'Híbrido', phev: 'PHEV', bev: 'Eléctrico',
};

export default function VersionsIndex({
    versions, models, filters,
}: {
    versions: Version[];
    models: ModelLite[];
    filters: { model_id?: number };
}) {
    const { flash } = usePage<{ flash: { success?: string; error?: string } }>().props;
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [search, setSearch] = useState('');

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return versions;
        return versions.filter((v) =>
            v.trim_name.toLowerCase().includes(q) ||
            v.model.name.toLowerCase().includes(q)
        );
    }, [versions, search]);

    const onModelFilter = (value: string) => {
        router.get('/admin/vehicle-versions', value === 'all' ? {} : { model_id: value }, {
            preserveState: true, replace: true,
        });
    };

    return (
        <AdminLayout breadcrumbs={[
            { title: 'Dashboard', href: '/admin' },
            { title: 'Versiones', href: '/admin/vehicle-versions' },
        ]}>
            <Head title="Admin — Versiones" />
            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Versiones</h1>
                        <p className="text-sm text-muted-foreground">Ficha técnica completa por trim: motor, dimensiones, equipamiento, colores.</p>
                    </div>
                    <div className="flex gap-2">
                        <Button asChild variant="secondary">
                            <Link href="/admin/vehicle-versions/bulk-import">
                                Importar lista de precios
                            </Link>
                        </Button>
                        <Button asChild>
                            <Link href="/admin/vehicle-versions/create"><Plus className="mr-1 size-4" />Nueva versión</Link>
                        </Button>
                    </div>
                </div>

                {flash?.success && <div className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700">{flash.success}</div>}

                <div className="flex items-center gap-3">
                    <Input
                        placeholder="Buscar por trim o modelo…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="max-w-sm"
                    />
                    <Select value={filters.model_id ? String(filters.model_id) : 'all'} onValueChange={onModelFilter}>
                        <SelectTrigger className="w-56"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos los modelos</SelectItem>
                            {models.map((m) => (
                                <SelectItem key={m.id} value={String(m.id)}>{m.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="rounded-lg border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Modelo · Trim</TableHead>
                                <TableHead>Año</TableHead>
                                <TableHead>Propulsión</TableHead>
                                <TableHead>Tracción</TableHead>
                                <TableHead>Transmisión</TableHead>
                                <TableHead>Precio lista</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filtered.map((v) => (
                                <TableRow key={v.id}>
                                    <TableCell className="font-medium">
                                        <div>{v.model.brand.name} {v.model.name}</div>
                                        <div className="text-xs text-muted-foreground">{v.trim_name}</div>
                                    </TableCell>
                                    <TableCell>{v.model_year}</TableCell>
                                    <TableCell><Badge variant="outline">{POWERTRAIN_LABELS[v.powertrain_type] ?? v.powertrain_type}</Badge></TableCell>
                                    <TableCell className="uppercase text-xs">{v.drivetrain}</TableCell>
                                    <TableCell className="text-xs">{v.transmission_type ?? '—'}</TableCell>
                                    <TableCell>{v.msrp_clp ? `$${v.msrp_clp.toLocaleString('es-CL')}` : '—'}</TableCell>
                                    <TableCell>
                                        <Badge variant={v.is_active ? 'default' : 'secondary'}>{v.is_active ? 'Activa' : 'Inactiva'}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" asChild>
                                                <Link href={`/admin/vehicle-versions/${v.id}/edit`}><Pencil className="size-4" /></Link>
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => setDeleteId(v.id)}>
                                                <Trash2 className="size-4 text-destructive" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {filtered.length === 0 && (
                                <TableRow><TableCell colSpan={8} className="py-8 text-center text-muted-foreground">Sin resultados.</TableCell></TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar versión?</AlertDialogTitle>
                        <AlertDialogDescription>Se eliminará toda la ficha técnica asociada (motor, dimensiones, equipamiento, colores).</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => router.delete(`/admin/vehicle-versions/${deleteId}`, { onFinish: () => setDeleteId(null) })}
                            className="bg-destructive text-white hover:bg-destructive/90"
                        >Eliminar</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AdminLayout>
    );
}
