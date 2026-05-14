import { Head, router, usePage } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AdminLayout from '@/layouts/admin-layout';

type Service = { id: number; name: string; slug: string; is_active: boolean; display_order: number };
type VehicleModel = { id: number; name: string; is_active: boolean; display_order: number };

type TabKey = 'services' | 'models';

export default function FormularioMantencionIndex({
    services,
    vehicleModels,
}: {
    services: Service[];
    vehicleModels: VehicleModel[];
}) {
    const { flash } = usePage<{ flash: { success?: string; error?: string } }>().props;
    const [tab, setTab] = useState<TabKey>('services');

    return (
        <AdminLayout breadcrumbs={[
            { title: 'Dashboard', href: '/admin' },
            { title: 'Formulario Mantención', href: '/admin/formulario-mantencion' },
        ]}>
            <Head title="Admin — Formulario Mantención" />
            <div className="flex flex-col gap-4 p-4">
                <div>
                    <h1 className="text-2xl font-semibold">Formulario Mantención</h1>
                    <p className="text-sm text-muted-foreground">
                        Servicios y modelos de vehículo que aparecen en el formulario de agendamiento de mantención.
                    </p>
                </div>

                {flash?.success && <div className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700">{flash.success}</div>}
                {flash?.error && <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{flash.error}</div>}

                {/* Tabs */}
                <div className="flex gap-1 border-b">
                    <TabButton active={tab === 'services'} onClick={() => setTab('services')}>
                        Servicios <span className="ml-1 text-xs opacity-60">({services.length})</span>
                    </TabButton>
                    <TabButton active={tab === 'models'} onClick={() => setTab('models')}>
                        Modelos de vehículo <span className="ml-1 text-xs opacity-60">({vehicleModels.length})</span>
                    </TabButton>
                </div>

                {tab === 'services' ? <ServicesTab items={services} /> : <ModelsTab items={vehicleModels} />}
            </div>
        </AdminLayout>
    );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`relative -mb-px border-b-2 px-4 py-2 text-sm transition ${
                active
                    ? 'border-primary font-medium text-foreground'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
        >
            {children}
        </button>
    );
}

// ─── Servicios ────────────────────────────────────────────────────────────────

function ServicesTab({ items }: { items: Service[] }) {
    const [editing, setEditing] = useState<Service | null>(null);
    const [creating, setCreating] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    return (
        <div className="flex flex-col gap-3">
            <div className="flex justify-end">
                <Button onClick={() => setCreating(true)}>
                    <Plus className="mr-1 size-4" /> Nuevo servicio
                </Button>
            </div>

            <div className="rounded-lg border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nombre</TableHead>
                            <TableHead>Orden</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {items.map((s) => (
                            <TableRow key={s.id}>
                                <TableCell className="font-medium">{s.name}</TableCell>
                                <TableCell>{s.display_order}</TableCell>
                                <TableCell>
                                    <Badge variant={s.is_active ? 'default' : 'secondary'}>{s.is_active ? 'Activo' : 'Inactivo'}</Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button variant="ghost" size="icon" onClick={() => setEditing(s)}>
                                            <Pencil className="size-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => setDeleteId(s.id)}>
                                            <Trash2 className="size-4 text-destructive" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                        {items.length === 0 && (
                            <TableRow><TableCell colSpan={4} className="py-8 text-center text-muted-foreground">Sin servicios aún.</TableCell></TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <ItemDialog
                open={creating}
                onClose={() => setCreating(false)}
                title="Nuevo servicio"
                onSubmit={(values) => router.post('/admin/formulario-mantencion/services', values, { onSuccess: () => setCreating(false), preserveScroll: true })}
            />
            {editing && (
                <ItemDialog
                    open
                    onClose={() => setEditing(null)}
                    title="Editar servicio"
                    initial={editing}
                    onSubmit={(values) => router.put(`/admin/formulario-mantencion/services/${editing.id}`, values, { onSuccess: () => setEditing(null), preserveScroll: true })}
                />
            )}
            {deleteId !== null && (
                <DeleteDialog
                    open
                    onClose={() => setDeleteId(null)}
                    onConfirm={() => router.delete(`/admin/formulario-mantencion/services/${deleteId}`, { onFinish: () => setDeleteId(null), preserveScroll: true })}
                    label="servicio"
                />
            )}
        </div>
    );
}

// ─── Modelos ──────────────────────────────────────────────────────────────────

function ModelsTab({ items }: { items: VehicleModel[] }) {
    const [editing, setEditing] = useState<VehicleModel | null>(null);
    const [creating, setCreating] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    return (
        <div className="flex flex-col gap-3">
            <div className="flex justify-end">
                <Button onClick={() => setCreating(true)}>
                    <Plus className="mr-1 size-4" /> Nuevo modelo
                </Button>
            </div>

            <div className="rounded-lg border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nombre</TableHead>
                            <TableHead>Orden</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {items.map((m) => (
                            <TableRow key={m.id}>
                                <TableCell className="font-medium">{m.name}</TableCell>
                                <TableCell>{m.display_order}</TableCell>
                                <TableCell>
                                    <Badge variant={m.is_active ? 'default' : 'secondary'}>{m.is_active ? 'Activo' : 'Inactivo'}</Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button variant="ghost" size="icon" onClick={() => setEditing(m)}>
                                            <Pencil className="size-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => setDeleteId(m.id)}>
                                            <Trash2 className="size-4 text-destructive" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                        {items.length === 0 && (
                            <TableRow><TableCell colSpan={4} className="py-8 text-center text-muted-foreground">Sin modelos aún.</TableCell></TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <ItemDialog
                open={creating}
                onClose={() => setCreating(false)}
                title="Nuevo modelo"
                onSubmit={(values) => router.post('/admin/formulario-mantencion/vehicle-models', values, { onSuccess: () => setCreating(false), preserveScroll: true })}
            />
            {editing && (
                <ItemDialog
                    open
                    onClose={() => setEditing(null)}
                    title="Editar modelo"
                    initial={editing}
                    onSubmit={(values) => router.put(`/admin/formulario-mantencion/vehicle-models/${editing.id}`, values, { onSuccess: () => setEditing(null), preserveScroll: true })}
                />
            )}
            {deleteId !== null && (
                <DeleteDialog
                    open
                    onClose={() => setDeleteId(null)}
                    onConfirm={() => router.delete(`/admin/formulario-mantencion/vehicle-models/${deleteId}`, { onFinish: () => setDeleteId(null), preserveScroll: true })}
                    label="modelo"
                />
            )}
        </div>
    );
}

// ─── Modales reusables ────────────────────────────────────────────────────────

type ItemFormValues = { name: string; is_active: number; display_order: number };

function ItemDialog({
    open,
    onClose,
    title,
    initial,
    onSubmit,
}: {
    open: boolean;
    onClose: () => void;
    title: string;
    initial?: { name: string; is_active: boolean; display_order: number } | null;
    onSubmit: (values: ItemFormValues) => void;
}) {
    const [name, setName] = useState('');
    const [isActive, setIsActive] = useState(true);
    const [order, setOrder] = useState(0);

    // Resetea el formulario cuando se abre el diálogo (con o sin `initial`).
    useEffect(() => {
        if (open) {
            setName(initial?.name ?? '');
            setIsActive(initial?.is_active ?? true);
            setOrder(initial?.display_order ?? 0);
        }
    }, [open, initial]);

    return (
        <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        onSubmit({ name, is_active: isActive ? 1 : 0, display_order: order });
                    }}
                    className="flex flex-col gap-4"
                >
                    <div className="grid gap-2">
                        <Label>Nombre *</Label>
                        <Input value={name} onChange={(e) => setName(e.target.value)} required autoFocus />
                    </div>
                    <div className="grid gap-2">
                        <Label>Orden</Label>
                        <Input type="number" value={order} onChange={(e) => setOrder(Number(e.target.value))} />
                    </div>
                    <div className="flex items-center gap-3">
                        <Checkbox id="active" checked={isActive} onCheckedChange={(v) => setIsActive(!!v)} />
                        <Label htmlFor="active">Activo</Label>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
                        <Button type="submit">Guardar</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function DeleteDialog({
    open,
    onClose,
    onConfirm,
    label,
}: {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    label: string;
}) {
    return (
        <AlertDialog open={open} onOpenChange={(o) => !o && onClose()}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>¿Eliminar {label}?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Dejará de aparecer en el formulario de agendamiento de mantención.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={onConfirm} className="bg-destructive text-white hover:bg-destructive/90">
                        Eliminar
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

