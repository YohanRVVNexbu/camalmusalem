import { Head, Link, router, usePage } from '@inertiajs/react';
import { Pencil, Plus, Trash2, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AdminLayout from '@/layouts/admin-layout';

type Vehicle = {
    id: number;
    name: string;
    full_name: string | null;
    type: string | null;
    fuel: string | null;
    is_visible: boolean;
    order: number;
    versions: any[] | null;
};

export default function VehiclesIndex({ vehicles }: { vehicles: Vehicle[] }) {
    const { flash } = usePage<{ flash: { success?: string; error?: string } }>().props;
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const handleDelete = () => {
        if (deleteId) {
            router.delete(`/admin/vehicles/${deleteId}`, { onFinish: () => setDeleteId(null) });
        }
    };

    return (
        <AdminLayout breadcrumbs={[{ title: 'Dashboard', href: '/admin' }, { title: 'Vehículos', href: '/admin/vehicles' }]}>
            <Head title="Admin — Vehículos nuevos" />
            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Vehículos nuevos</h1>
                    <Button asChild>
                        <Link href="/admin/vehicles/create"><Plus className="mr-1 size-4" />Nuevo vehículo</Link>
                    </Button>
                </div>

                {flash?.success && (
                    <div className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700">
                        {flash.success}
                    </div>
                )}

                <div className="rounded-lg border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nombre</TableHead>
                                <TableHead>Tipo</TableHead>
                                <TableHead>Combustible</TableHead>
                                <TableHead>Versiones</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead>Orden</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {vehicles.map((v) => (
                                <TableRow key={v.id}>
                                    <TableCell className="font-medium">
                                        <div>{v.name}</div>
                                        {v.full_name && <div className="text-xs text-muted-foreground">{v.full_name}</div>}
                                    </TableCell>
                                    <TableCell>{v.type ?? '—'}</TableCell>
                                    <TableCell>{v.fuel ?? '—'}</TableCell>
                                    <TableCell>{v.versions?.length ?? 0}</TableCell>
                                    <TableCell>
                                        <Badge variant={v.is_visible ? 'default' : 'secondary'}>
                                            {v.is_visible ? 'Visible' : 'Oculto'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{v.order}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" asChild>
                                                <Link href={`/admin/vehicles/${v.id}/edit`}>
                                                    <Pencil className="size-4" />
                                                </Link>
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => setDeleteId(v.id)}>
                                                <Trash2 className="size-4 text-destructive" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {vehicles.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                                        No hay vehículos registrados.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar vehículo?</AlertDialogTitle>
                        <AlertDialogDescription>Esta acción no se puede deshacer.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-white hover:bg-destructive/90">
                            Eliminar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AdminLayout>
    );
}
