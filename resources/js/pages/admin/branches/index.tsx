import { Head, Link, router, usePage } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AdminLayout from '@/layouts/admin-layout';

type Branch = {
    id: number;
    name: string;
    address: string | null;
    city: string | null;
    maps_url: string | null;
    phone: string | null;
    is_active: boolean;
    display_order: number;
};

export default function BranchesIndex({ branches }: { branches: Branch[] }) {
    const { flash } = usePage<{ flash: { success?: string; error?: string } }>().props;
    const [deleteId, setDeleteId] = useState<number | null>(null);

    return (
        <AdminLayout breadcrumbs={[
            { title: 'Dashboard', href: '/admin' },
            { title: 'Sucursales', href: '/admin/branches' },
        ]}>
            <Head title="Admin — Sucursales" />
            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Sucursales</h1>
                        <p className="text-sm text-muted-foreground">Puntos de venta con dirección y link a Google Maps. Se asignan a cada seminuevo.</p>
                    </div>
                    <Button asChild>
                        <Link href="/admin/branches/create"><Plus className="mr-1 size-4" />Nueva sucursal</Link>
                    </Button>
                </div>

                {flash?.success && <div className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700">{flash.success}</div>}
                {flash?.error && <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{flash.error}</div>}

                <div className="rounded-lg border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nombre</TableHead>
                                <TableHead>Ciudad</TableHead>
                                <TableHead>Dirección</TableHead>
                                <TableHead>Maps</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {branches.map((b) => (
                                <TableRow key={b.id}>
                                    <TableCell className="font-medium">{b.name}</TableCell>
                                    <TableCell>{b.city ?? '—'}</TableCell>
                                    <TableCell className="text-xs text-muted-foreground">{b.address ?? '—'}</TableCell>
                                    <TableCell>
                                        {b.maps_url ? (
                                            <a href={b.maps_url} target="_blank" rel="noopener noreferrer" className="text-xs underline">
                                                Ver en Maps
                                            </a>
                                        ) : '—'}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={b.is_active ? 'default' : 'secondary'}>{b.is_active ? 'Activa' : 'Inactiva'}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" asChild>
                                                <Link href={`/admin/branches/${b.id}/edit`}><Pencil className="size-4" /></Link>
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => setDeleteId(b.id)}>
                                                <Trash2 className="size-4 text-destructive" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {branches.length === 0 && (
                                <TableRow><TableCell colSpan={6} className="py-8 text-center text-muted-foreground">Sin sucursales aún.</TableCell></TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar sucursal?</AlertDialogTitle>
                        <AlertDialogDescription>Si la sucursal tiene seminuevos asignados, no se podrá eliminar.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => router.delete(`/admin/branches/${deleteId}`, { onFinish: () => setDeleteId(null) })}
                            className="bg-destructive text-white hover:bg-destructive/90"
                        >Eliminar</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AdminLayout>
    );
}
