import { Head, Link, router, usePage } from '@inertiajs/react';
import { Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { ImportExportBar } from '@/components/admin/import-export-bar';
import { CrossReferenceSync } from '@/components/admin/cross-reference-sync';
import { Input } from '@/components/ui/input';
import { useMemo, useState } from 'react';
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AdminLayout from '@/layouts/admin-layout';

type Accesorio = { id: number; name: string; price: string | null; category: string; is_visible: boolean; order: number; images: string[] | null; };

export default function AccesoriosIndex({ accesorios }: { accesorios: Accesorio[] }) {
    const { flash } = usePage<{ flash: { success?: string; error?: string } }>().props;
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [query, setQuery] = useState('');

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return accesorios;
        return accesorios.filter((a) => `${a.name} ${a.category}`.toLowerCase().includes(q));
    }, [accesorios, query]);

    return (
        <AdminLayout breadcrumbs={[{ title: 'Dashboard', href: '/admin' }, { title: 'Accesorios', href: '/admin/accesorios' }]}>
            <Head title="Admin — Accesorios" />
            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Accesorios</h1>
                    <div className="flex gap-2">
                        <CrossReferenceSync />
                        <ImportExportBar
                            entityLabel="accesorios"
                            exportUrl="/admin/accesorios/export"
                            importUrl="/admin/accesorios/import"
                            templateUrl="/admin/accesorios/template"
                        />
                        <Button asChild><Link href="/admin/accesorios/create"><Plus className="mr-1 size-4" />Nuevo accesorio</Link></Button>
                    </div>
                </div>
                {flash?.success && <div className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700">{flash.success}</div>}
                {flash?.error && <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{flash.error}</div>}
                <div className="relative max-w-sm">
                    <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar por nombre o categoría…" className="pl-9" />
                </div>
                <div className="rounded-lg border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nombre</TableHead>
                                <TableHead>Categoría</TableHead>
                                <TableHead>Precio</TableHead>
                                <TableHead>Fotos</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead>Orden</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filtered.map((a) => (
                                <TableRow key={a.id}>
                                    <TableCell className="font-medium">{a.name}</TableCell>
                                    <TableCell>{a.category}</TableCell>
                                    <TableCell>{a.price ?? '—'}</TableCell>
                                    <TableCell>
                                        {(a.images?.length ?? 0) > 0
                                            ? <Badge variant="outline" className="border-green-300 bg-green-50 text-green-700">{a.images!.length} foto{a.images!.length === 1 ? '' : 's'}</Badge>
                                            : <Badge variant="outline" className="border-red-300 bg-red-50 text-red-700">Sin fotos</Badge>}
                                    </TableCell>
                                    <TableCell><Badge variant={a.is_visible ? 'default' : 'secondary'}>{a.is_visible ? 'Visible' : 'Oculto'}</Badge></TableCell>
                                    <TableCell>{a.order}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" asChild>
                                                <Link href={`/admin/accesorios/${a.id}/edit`}><Pencil className="size-4" /></Link>
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => setDeleteId(a.id)}>
                                                <Trash2 className="size-4 text-destructive" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {filtered.length === 0 && (
                                <TableRow><TableCell colSpan={7} className="py-8 text-center text-muted-foreground">{query ? 'No se encontraron accesorios para tu búsqueda.' : 'No hay accesorios.'}</TableCell></TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
            <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader><AlertDialogTitle>¿Eliminar accesorio?</AlertDialogTitle><AlertDialogDescription>Esta acción no se puede deshacer.</AlertDialogDescription></AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => { router.delete(`/admin/accesorios/${deleteId}`, { onFinish: () => setDeleteId(null) }); }} className="bg-destructive text-white hover:bg-destructive/90">Eliminar</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AdminLayout>
    );
}
