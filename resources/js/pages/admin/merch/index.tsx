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
import { ImportExportBar } from '@/components/admin/import-export-bar';
import AdminLayout from '@/layouts/admin-layout';

type MerchItem = {
    id: number;
    sku: string | null;
    name: string;
    category: string;
    subcategory: string | null;
    size: string | null;
    price: string | null;
    status: string;
    is_visible: boolean;
    order: number;
};

export default function MerchIndex({ merch }: { merch: MerchItem[] }) {
    const { flash } = usePage<{ flash: { success?: string } }>().props;
    const [deleteId, setDeleteId] = useState<number | null>(null);

    return (
        <AdminLayout breadcrumbs={[{ title: 'Dashboard', href: '/admin' }, { title: 'Merch', href: '/admin/merch' }]}>
            <Head title="Admin — Merch" />
            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Merch</h1>
                        <p className="text-sm text-muted-foreground">Productos de merchandising Toyota Musalem.</p>
                    </div>
                    <div className="flex gap-2">
                        <ImportExportBar
                            entityLabel="merch"
                            exportUrl="/admin/merch/export"
                            importUrl="/admin/merch/import"
                            templateUrl="/admin/merch/template"
                        />
                        <Button asChild>
                            <Link href="/admin/merch/create"><Plus className="mr-1 size-4" />Nuevo merch</Link>
                        </Button>
                    </div>
                </div>

                {flash?.success && (
                    <div className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700">{flash.success}</div>
                )}

                <div className="rounded-lg border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nombre</TableHead>
                                <TableHead>SKU</TableHead>
                                <TableHead>Categoría</TableHead>
                                <TableHead>Talla</TableHead>
                                <TableHead>Precio</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead>Visible</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {merch.map((m) => (
                                <TableRow key={m.id}>
                                    <TableCell className="font-medium">{m.name}</TableCell>
                                    <TableCell className="text-xs text-muted-foreground">{m.sku ?? '—'}</TableCell>
                                    <TableCell>
                                        <span>{m.category}</span>
                                        {m.subcategory && <span className="ml-1 text-xs text-muted-foreground">/ {m.subcategory}</span>}
                                    </TableCell>
                                    <TableCell>{m.size ?? '—'}</TableCell>
                                    <TableCell>{m.price ?? '—'}</TableCell>
                                    <TableCell>
                                        <Badge variant={m.status === 'disponible' ? 'default' : 'secondary'}>{m.status}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={m.is_visible ? 'default' : 'secondary'}>{m.is_visible ? 'Visible' : 'Oculto'}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" asChild>
                                                <Link href={`/admin/merch/${m.id}/edit`}><Pencil className="size-4" /></Link>
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => setDeleteId(m.id)}>
                                                <Trash2 className="size-4 text-destructive" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {merch.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={8} className="py-8 text-center text-muted-foreground">No hay merch.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar merch?</AlertDialogTitle>
                        <AlertDialogDescription>Esta acción no se puede deshacer.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => router.delete(`/admin/merch/${deleteId}`, { onFinish: () => setDeleteId(null) })}
                            className="bg-destructive text-white hover:bg-destructive/90"
                        >Eliminar</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AdminLayout>
    );
}
