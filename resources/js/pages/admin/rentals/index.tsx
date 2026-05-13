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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AdminLayout from '@/layouts/admin-layout';
import { formatCLP } from '@/lib/format';

type Rental = {
    id: number;
    name: string | null;
    vehicle_model: string | null;
    card_image: string | null;
    price_day: string | null;
    branches: string[];
    is_active: boolean;
    display_order: number;
};

export default function RentalsIndex({ rentals }: { rentals: Rental[] }) {
    const { flash } = usePage<{ flash: { success?: string; error?: string } }>().props;
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [search, setSearch] = useState('');

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return rentals;
        return rentals.filter((r) =>
            (r.name ?? '').toLowerCase().includes(q) ||
            (r.vehicle_model ?? '').toLowerCase().includes(q)
        );
    }, [rentals, search]);

    return (
        <AdminLayout breadcrumbs={[
            { title: 'Dashboard', href: '/admin' },
            { title: 'Arriendos', href: '/admin/rentals' },
        ]}>
            <Head title="Admin — Arriendos" />
            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Arriendos KINTO</h1>
                        <p className="text-sm text-muted-foreground">Vehículos disponibles para arriendo. Podés enlazar cada uno a un vehículo del catálogo de nuevos.</p>
                    </div>
                    <Button asChild>
                        <Link href="/admin/rentals/create"><Plus className="mr-1 size-4" />Nuevo arriendo</Link>
                    </Button>
                </div>

                {flash?.success && <div className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700">{flash.success}</div>}
                {flash?.error && <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{flash.error}</div>}

                <div className="flex items-center gap-3">
                    <Input
                        placeholder="Buscar por nombre o vehículo…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="max-w-sm"
                    />
                    <span className="text-sm text-muted-foreground">{filtered.length} de {rentals.length}</span>
                </div>

                <div className="rounded-lg border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-20">Imagen</TableHead>
                                <TableHead>Nombre</TableHead>
                                <TableHead>Vehículo base</TableHead>
                                <TableHead>Precio / día</TableHead>
                                <TableHead>Sucursales</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filtered.map((r) => (
                                <TableRow key={r.id}>
                                    <TableCell>
                                        {r.card_image ? (
                                            <img src={r.card_image} className="h-10 w-16 rounded object-cover" alt="" />
                                        ) : (
                                            <span className="text-xs text-muted-foreground">—</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="font-medium">{r.name || '—'}</TableCell>
                                    <TableCell>{r.vehicle_model || <span className="text-muted-foreground text-xs">Sin enlazar</span>}</TableCell>
                                    <TableCell>{r.price_day ? formatCLP(r.price_day) : '—'}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1">
                                            {r.branches.length === 0 ? (
                                                <span className="text-xs text-muted-foreground">—</span>
                                            ) : (
                                                r.branches.map((b) => <Badge key={b} variant="outline" className="text-xs">{b}</Badge>)
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={r.is_active ? 'default' : 'secondary'}>{r.is_active ? 'Activo' : 'Inactivo'}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" asChild>
                                                <Link href={`/admin/rentals/${r.id}/edit`}><Pencil className="size-4" /></Link>
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => setDeleteId(r.id)}>
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
                        <AlertDialogTitle>¿Eliminar arriendo?</AlertDialogTitle>
                        <AlertDialogDescription>Esta acción no se puede deshacer.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => router.delete(`/admin/rentals/${deleteId}`, { onFinish: () => setDeleteId(null) })}
                            className="bg-destructive text-white hover:bg-destructive/90"
                        >Eliminar</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AdminLayout>
    );
}
