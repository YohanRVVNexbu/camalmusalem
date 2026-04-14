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

type Brand = {
    id: number;
    name: string;
    slug: string;
    logo_path: string | null;
    is_active: boolean;
    models_count: number;
};

export default function BrandsIndex({ brands }: { brands: Brand[] }) {
    const { flash } = usePage<{ flash: { success?: string; error?: string } }>().props;
    const [deleteId, setDeleteId] = useState<number | null>(null);

    return (
        <AdminLayout breadcrumbs={[
            { title: 'Dashboard', href: '/admin' },
            { title: 'Marcas', href: '/admin/brands' },
        ]}>
            <Head title="Admin — Marcas" />
            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Marcas</h1>
                        <p className="text-sm text-muted-foreground">Marcas de vehículos disponibles en el catálogo.</p>
                    </div>
                    <Button asChild>
                        <Link href="/admin/brands/create"><Plus className="mr-1 size-4" />Nueva marca</Link>
                    </Button>
                </div>

                {flash?.success && <div className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700">{flash.success}</div>}
                {flash?.error && <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{flash.error}</div>}

                <div className="rounded-lg border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-20">Logo</TableHead>
                                <TableHead>Nombre</TableHead>
                                <TableHead>Modelos</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {brands.map((b) => (
                                <TableRow key={b.id}>
                                    <TableCell>
                                        {b.logo_path ? (
                                            <img src={b.logo_path} className="h-8 w-auto object-contain" alt={b.name} />
                                        ) : (
                                            <span className="text-xs text-muted-foreground">—</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="font-medium">{b.name}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{b.models_count} modelos</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={b.is_active ? 'default' : 'secondary'}>
                                            {b.is_active ? 'Activa' : 'Inactiva'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" asChild>
                                                <Link href={`/admin/brands/${b.id}/edit`}><Pencil className="size-4" /></Link>
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => setDeleteId(b.id)} disabled={b.models_count > 0}>
                                                <Trash2 className="size-4 text-destructive" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {brands.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                                        No hay marcas. Crea la primera.
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
                        <AlertDialogTitle>¿Eliminar marca?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer. Si la marca tiene modelos asociados, no se podrá eliminar.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => router.delete(`/admin/brands/${deleteId}`, { onFinish: () => setDeleteId(null) })}
                            className="bg-destructive text-white hover:bg-destructive/90"
                        >Eliminar</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AdminLayout>
    );
}
