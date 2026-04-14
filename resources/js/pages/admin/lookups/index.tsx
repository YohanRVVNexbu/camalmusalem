import { Head, router, usePage } from '@inertiajs/react';
import { Pencil, Plus, Save, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AdminLayout from '@/layouts/admin-layout';

type Item = {
    id: number;
    code: string;
    name_es: string;
    name_en: string | null;
    display_order: number;
    is_active: boolean;
};

type Group = {
    key: string;
    label: string;
    description: string;
    refs: string;
    items: Item[];
};

type Draft = {
    code: string;
    name_es: string;
    name_en: string;
    display_order: number;
    is_active: boolean;
};

const emptyDraft = (order = 0): Draft => ({
    code: '',
    name_es: '',
    name_en: '',
    display_order: order,
    is_active: true,
});

export default function LookupsIndex({ groups }: { groups: Group[] }) {
    const { flash } = usePage<{ flash: { success?: string; error?: string } }>().props;
    const [activeTab, setActiveTab] = useState<string>(groups[0]?.key ?? '');
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editDraft, setEditDraft] = useState<Draft>(emptyDraft());
    const [newDraft, setNewDraft] = useState<Draft>(emptyDraft());
    const [deleteInfo, setDeleteInfo] = useState<{ type: string; id: number } | null>(null);

    const active = groups.find((g) => g.key === activeTab) ?? groups[0];
    if (!active) return null;

    const startEdit = (item: Item) => {
        setEditingId(item.id);
        setEditDraft({
            code: item.code,
            name_es: item.name_es,
            name_en: item.name_en ?? '',
            display_order: item.display_order,
            is_active: item.is_active,
        });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditDraft(emptyDraft());
    };

    const saveEdit = (item: Item) => {
        router.put(`/admin/lookups/${active.key}/${item.id}`, {
            ...editDraft,
            is_active: editDraft.is_active ? 1 : 0,
        } as any, {
            preserveScroll: true,
            onSuccess: () => {
                setEditingId(null);
                setEditDraft(emptyDraft());
            },
        });
    };

    const saveNew = () => {
        if (!newDraft.name_es) return;
        router.post(`/admin/lookups/${active.key}`, {
            ...newDraft,
            is_active: newDraft.is_active ? 1 : 0,
        } as any, {
            preserveScroll: true,
            onSuccess: () => setNewDraft(emptyDraft(active.items.length)),
        });
    };

    return (
        <AdminLayout breadcrumbs={[
            { title: 'Dashboard', href: '/admin' },
            { title: 'Listas editables', href: '/admin/lookups' },
        ]}>
            <Head title="Admin — Listas editables" />
            <div className="flex flex-col gap-4 p-4">
                <div>
                    <h1 className="text-2xl font-semibold">Listas editables</h1>
                    <p className="text-sm text-muted-foreground">
                        Opciones reutilizables de los formularios del catálogo. Agrega, renombra o desactiva valores sin tocar código.
                    </p>
                </div>

                {flash?.success && <div className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700">{flash.success}</div>}
                {flash?.error && <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{flash.error}</div>}

                {/* Tabs */}
                <div className="flex flex-wrap gap-1 border-b pb-2">
                    {groups.map((g) => (
                        <Button
                            key={g.key}
                            type="button"
                            variant={activeTab === g.key ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => { setActiveTab(g.key); cancelEdit(); setNewDraft(emptyDraft(g.items.length)); }}
                        >
                            {g.label}
                            <Badge variant="secondary" className="ml-2">{g.items.length}</Badge>
                        </Button>
                    ))}
                </div>

                <div className="rounded-lg border bg-muted/20 p-3 text-sm">
                    <p>{active.description}</p>
                    <p className="mt-1 text-xs text-muted-foreground font-mono">Referencia en BD: {active.refs}</p>
                </div>

                <div className="rounded-lg border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-20">Orden</TableHead>
                                <TableHead>Nombre</TableHead>
                                <TableHead>Código</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead className="text-right w-32">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {active.items.map((item) => (
                                <TableRow key={item.id}>
                                    {editingId === item.id ? (
                                        <>
                                            <TableCell>
                                                <Input
                                                    type="number"
                                                    value={editDraft.display_order}
                                                    onChange={(e) => setEditDraft({ ...editDraft, display_order: Number(e.target.value) })}
                                                    className="w-16"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    value={editDraft.name_es}
                                                    onChange={(e) => setEditDraft({ ...editDraft, name_es: e.target.value })}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    value={editDraft.code}
                                                    onChange={(e) => setEditDraft({ ...editDraft, code: e.target.value })}
                                                    className="font-mono text-xs"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <label className="flex items-center gap-2">
                                                    <Checkbox
                                                        checked={editDraft.is_active}
                                                        onCheckedChange={(v) => setEditDraft({ ...editDraft, is_active: !!v })}
                                                    />
                                                    <span className="text-xs">Activa</span>
                                                </label>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-1">
                                                    <Button variant="ghost" size="icon" onClick={() => saveEdit(item)}>
                                                        <Save className="size-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" onClick={cancelEdit}>
                                                        <X className="size-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </>
                                    ) : (
                                        <>
                                            <TableCell className="text-muted-foreground">{item.display_order}</TableCell>
                                            <TableCell className="font-medium">{item.name_es}</TableCell>
                                            <TableCell className="text-xs text-muted-foreground font-mono">{item.code}</TableCell>
                                            <TableCell>
                                                <Badge variant={item.is_active ? 'default' : 'secondary'}>
                                                    {item.is_active ? 'Activa' : 'Inactiva'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-1">
                                                    <Button variant="ghost" size="icon" onClick={() => startEdit(item)}>
                                                        <Pencil className="size-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" onClick={() => setDeleteInfo({ type: active.key, id: item.id })}>
                                                        <Trash2 className="size-4 text-destructive" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </>
                                    )}
                                </TableRow>
                            ))}
                            {/* Nueva fila */}
                            <TableRow className="bg-muted/30">
                                <TableCell>
                                    <Input
                                        type="number"
                                        value={newDraft.display_order}
                                        onChange={(e) => setNewDraft({ ...newDraft, display_order: Number(e.target.value) })}
                                        className="w-16"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Input
                                        placeholder="Nombre nuevo"
                                        value={newDraft.name_es}
                                        onChange={(e) => setNewDraft({ ...newDraft, name_es: e.target.value })}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Input
                                        placeholder="auto-generado"
                                        value={newDraft.code}
                                        onChange={(e) => setNewDraft({ ...newDraft, code: e.target.value })}
                                        className="font-mono text-xs"
                                    />
                                </TableCell>
                                <TableCell>
                                    <label className="flex items-center gap-2">
                                        <Checkbox
                                            checked={newDraft.is_active}
                                            onCheckedChange={(v) => setNewDraft({ ...newDraft, is_active: !!v })}
                                        />
                                        <span className="text-xs">Activa</span>
                                    </label>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button size="sm" onClick={saveNew} disabled={!newDraft.name_es.trim()}>
                                        <Plus className="mr-1 size-3" /> Agregar
                                    </Button>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </div>

            <AlertDialog open={deleteInfo !== null} onOpenChange={() => setDeleteInfo(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar elemento?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Si hay vehículos usando este valor, seguirán mostrando el valor pero ya no podrá seleccionarse en nuevos registros. Considera desactivarlo en lugar de eliminarlo.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                if (deleteInfo) {
                                    router.delete(`/admin/lookups/${deleteInfo.type}/${deleteInfo.id}`, {
                                        preserveScroll: true,
                                        onFinish: () => setDeleteInfo(null),
                                    });
                                }
                            }}
                            className="bg-destructive text-white hover:bg-destructive/90"
                        >Eliminar</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AdminLayout>
    );
}
