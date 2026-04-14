import { Head, Link, router, usePage } from '@inertiajs/react';
import { Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AdminLayout from '@/layouts/admin-layout';

type Feature = {
    id: number;
    code: string;
    name_es: string;
    name_en: string | null;
    category: string;
    data_type: string;
    unit: string | null;
    is_active: boolean;
    display_order: number;
};

export default function FeaturesIndex({
    features, categories,
}: {
    features: Feature[];
    categories: Record<string, string>;
}) {
    const { flash } = usePage<{ flash: { success?: string; error?: string } }>().props;
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<string>('all');

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        return features.filter((f) => {
            if (categoryFilter !== 'all' && f.category !== categoryFilter) return false;
            if (!q) return true;
            return (
                f.name_es.toLowerCase().includes(q) ||
                f.code.toLowerCase().includes(q) ||
                (f.name_en ?? '').toLowerCase().includes(q)
            );
        });
    }, [features, search, categoryFilter]);

    return (
        <AdminLayout breadcrumbs={[
            { title: 'Dashboard', href: '/admin' },
            { title: 'Equipamiento', href: '/admin/features' },
        ]}>
            <Head title="Admin — Equipamiento" />
            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Equipamiento</h1>
                        <p className="text-sm text-muted-foreground">Catálogo de características/equipamiento disponible para asignar a versiones.</p>
                    </div>
                    <Button asChild>
                        <Link href="/admin/features/create"><Plus className="mr-1 size-4" />Nuevo equipamiento</Link>
                    </Button>
                </div>

                {flash?.success && <div className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700">{flash.success}</div>}

                <div className="flex gap-3 items-center">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-2 top-2.5 size-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar por nombre o código…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-8"
                        />
                    </div>
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                        <SelectTrigger className="w-56"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todas las categorías</SelectItem>
                            {Object.entries(categories).map(([code, label]) => (
                                <SelectItem key={code} value={code}>{label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <span className="text-sm text-muted-foreground">{filtered.length} de {features.length}</span>
                </div>

                <div className="rounded-lg border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nombre</TableHead>
                                <TableHead>Código</TableHead>
                                <TableHead>Categoría</TableHead>
                                <TableHead>Tipo</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filtered.map((f) => (
                                <TableRow key={f.id}>
                                    <TableCell className="font-medium">{f.name_es}</TableCell>
                                    <TableCell className="text-xs text-muted-foreground font-mono">{f.code}</TableCell>
                                    <TableCell><Badge variant="outline">{categories[f.category] ?? f.category}</Badge></TableCell>
                                    <TableCell className="text-xs">{f.data_type}{f.unit ? ` (${f.unit})` : ''}</TableCell>
                                    <TableCell>
                                        <Badge variant={f.is_active ? 'default' : 'secondary'}>{f.is_active ? 'Activa' : 'Inactiva'}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" asChild>
                                                <Link href={`/admin/features/${f.id}/edit`}><Pencil className="size-4" /></Link>
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => setDeleteId(f.id)}>
                                                <Trash2 className="size-4 text-destructive" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {filtered.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                                        Sin resultados.
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
                        <AlertDialogTitle>¿Eliminar equipamiento?</AlertDialogTitle>
                        <AlertDialogDescription>Se quitará de todas las versiones que lo tenían asignado.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => router.delete(`/admin/features/${deleteId}`, { onFinish: () => setDeleteId(null) })}
                            className="bg-destructive text-white hover:bg-destructive/90"
                        >Eliminar</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AdminLayout>
    );
}
