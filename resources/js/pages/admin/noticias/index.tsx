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

type Noticia = { id: number; title: string; slug: string; published_at: string | null; is_visible: boolean; };

export default function NoticiasIndex({ noticias }: { noticias: Noticia[] }) {
    const { flash } = usePage<{ flash: { success?: string } }>().props;
    const [deleteId, setDeleteId] = useState<number | null>(null);

    return (
        <AdminLayout breadcrumbs={[{ title: 'Dashboard', href: '/admin' }, { title: 'Noticias', href: '/admin/noticias' }]}>
            <Head title="Admin — Noticias" />
            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Noticias</h1>
                    <Button asChild><Link href="/admin/noticias/create"><Plus className="mr-1 size-4" />Nueva noticia</Link></Button>
                </div>
                {flash?.success && <div className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700">{flash.success}</div>}
                <div className="rounded-lg border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Título</TableHead>
                                <TableHead>Slug</TableHead>
                                <TableHead>Publicación</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {noticias.map((n) => (
                                <TableRow key={n.id}>
                                    <TableCell className="font-medium">{n.title}</TableCell>
                                    <TableCell className="text-xs text-muted-foreground">{n.slug}</TableCell>
                                    <TableCell>{n.published_at ? new Date(n.published_at).toLocaleDateString('es-CL') : '—'}</TableCell>
                                    <TableCell><Badge variant={n.is_visible ? 'default' : 'secondary'}>{n.is_visible ? 'Publicada' : 'Borrador'}</Badge></TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" asChild>
                                                <Link href={`/admin/noticias/${n.id}/edit`}><Pencil className="size-4" /></Link>
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => setDeleteId(n.id)}>
                                                <Trash2 className="size-4 text-destructive" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {noticias.length === 0 && (
                                <TableRow><TableCell colSpan={5} className="py-8 text-center text-muted-foreground">No hay noticias.</TableCell></TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
            <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader><AlertDialogTitle>¿Eliminar noticia?</AlertDialogTitle><AlertDialogDescription>Esta acción no se puede deshacer.</AlertDialogDescription></AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => { router.delete(`/admin/noticias/${deleteId}`, { onFinish: () => setDeleteId(null) }); }} className="bg-destructive text-white hover:bg-destructive/90">Eliminar</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AdminLayout>
    );
}
