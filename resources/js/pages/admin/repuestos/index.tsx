import { Head, Link, router, usePage } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { ImportExportBar } from '@/components/admin/import-export-bar';
import { useState } from 'react';
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AdminLayout from '@/layouts/admin-layout';

type Repuesto = {
    id: number; name: string; sku: string | null; price: string | null;
    category: string; stock_la_serena: boolean; stock_ovalle: boolean; is_visible: boolean; order: number;
};

export default function RepuestosIndex({ repuestos }: { repuestos: Repuesto[] }) {
    const { flash } = usePage<{ flash: { success?: string } }>().props;
    const [deleteId, setDeleteId] = useState<number | null>(null);

    return (
        <AdminLayout breadcrumbs={[{ title: 'Dashboard', href: '/admin' }, { title: 'Repuestos', href: '/admin/repuestos' }]}>
            <Head title="Admin — Repuestos" />
            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Repuestos</h1>
                    <div className="flex gap-2">
                        <ImportExportBar
                            entityLabel="repuestos"
                            exportUrl="/admin/repuestos/export"
                            importUrl="/admin/repuestos/import"
                            templateUrl="/admin/repuestos/template"
                        />
                        <Button asChild><Link href="/admin/repuestos/create"><Plus className="mr-1 size-4" />Nuevo repuesto</Link></Button>
                    </div>
                </div>
                {flash?.success && <div className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700">{flash.success}</div>}
                <div className="rounded-lg border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nombre</TableHead>
                                <TableHead>SKU</TableHead>
                                <TableHead>Categoría</TableHead>
                                <TableHead>Precio</TableHead>
                                <TableHead>Stock</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {repuestos.map((r) => (
                                <TableRow key={r.id}>
                                    <TableCell className="font-medium">{r.name}</TableCell>
                                    <TableCell className="text-xs text-muted-foreground">{r.sku ?? '—'}</TableCell>
                                    <TableCell>{r.category}</TableCell>
                                    <TableCell>{r.price ?? '—'}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-1 flex-wrap">
                                            {r.stock_la_serena && <Badge variant="outline" className="text-xs">La Serena</Badge>}
                                            {r.stock_ovalle && <Badge variant="outline" className="text-xs">Ovalle</Badge>}
                                        </div>
                                    </TableCell>
                                    <TableCell><Badge variant={r.is_visible ? 'default' : 'secondary'}>{r.is_visible ? 'Visible' : 'Oculto'}</Badge></TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" asChild>
                                                <Link href={`/admin/repuestos/${r.id}/edit`}><Pencil className="size-4" /></Link>
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => setDeleteId(r.id)}>
                                                <Trash2 className="size-4 text-destructive" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {repuestos.length === 0 && (
                                <TableRow><TableCell colSpan={7} className="py-8 text-center text-muted-foreground">No hay repuestos.</TableCell></TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
            <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar repuesto?</AlertDialogTitle>
                        <AlertDialogDescription>Esta acción no se puede deshacer.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => { router.delete(`/admin/repuestos/${deleteId}`, { onFinish: () => setDeleteId(null) }); }} className="bg-destructive text-white hover:bg-destructive/90">Eliminar</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AdminLayout>
    );
}
