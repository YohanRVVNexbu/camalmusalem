import { Head, Link, router, usePage } from '@inertiajs/react';
import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AdminLayout from '@/layouts/admin-layout';

type Branch = {
    id?: number;
    name: string;
    address: string | null;
    city: string | null;
    maps_url: string | null;
    phone: string | null;
    phone_sucursal: string | null;
    phone_repuestos: string | null;
    phones_servicio_tecnico: string[] | null;
    is_active: boolean;
    display_order: number;
};

export default function BranchForm({ branch }: { branch: Branch | null }) {
    const { flash } = usePage<{ flash: { success?: string } }>().props;
    const isEdit = !!branch?.id;

    const [data, setData] = useState<Branch>(branch ?? {
        name: '', address: null, city: null, maps_url: null, phone: null,
        phone_sucursal: null, phone_repuestos: null, phones_servicio_tecnico: [],
        is_active: true, display_order: 0,
    });
    const [processing, setProcessing] = useState(false);

    const set = (field: keyof Branch, val: any) => setData({ ...data, [field]: val });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        const payload = { ...data, is_active: data.is_active ? 1 : 0 };
        if (isEdit) {
            router.put(`/admin/branches/${branch!.id}`, payload as any, { onFinish: () => setProcessing(false) });
        } else {
            router.post('/admin/branches', payload as any, { onFinish: () => setProcessing(false) });
        }
    };

    return (
        <AdminLayout breadcrumbs={[
            { title: 'Dashboard', href: '/admin' },
            { title: 'Sucursales', href: '/admin/branches' },
            { title: isEdit ? 'Editar' : 'Crear', href: '#' },
        ]}>
            <Head title={`Admin — ${isEdit ? 'Editar' : 'Crear'} sucursal`} />
            <div className="flex flex-col gap-4 p-4 max-w-2xl">
                <h1 className="text-2xl font-semibold">{isEdit ? `Editar: ${branch!.name}` : 'Nueva sucursal'}</h1>

                {flash?.success && (
                    <div className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700">{flash.success}</div>
                )}

                <form onSubmit={submit} className="flex flex-col gap-4">
                    <div className="grid gap-2">
                        <Label>Nombre *</Label>
                        <Input value={data.name} onChange={(e) => set('name', e.target.value)} placeholder="Ej: Sucursal La Serena" required />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label>Ciudad</Label>
                            <Input value={data.city ?? ''} onChange={(e) => set('city', e.target.value || null)} placeholder="Ej: La Serena" />
                        </div>
                        <div className="grid gap-2">
                            <Label>Teléfono</Label>
                            <Input value={data.phone ?? ''} onChange={(e) => set('phone', e.target.value || null)} placeholder="Ej: +56 51 2 345 678" />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label>Dirección</Label>
                        <Input value={data.address ?? ''} onChange={(e) => set('address', e.target.value || null)} placeholder="Ej: Av. Francisco de Aguirre #070" />
                    </div>

                    <div className="grid gap-2">
                        <Label>URL de Google Maps</Label>
                        <Input value={data.maps_url ?? ''} onChange={(e) => set('maps_url', e.target.value || null)} placeholder="https://www.google.com/maps/..." />
                        <p className="text-xs text-muted-foreground">Pega el link de Google Maps para que al hacer click en la sucursal se abra en una pestaña nueva.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label>Teléfono sucursal</Label>
                            <Input value={data.phone_sucursal ?? ''} onChange={(e) => set('phone_sucursal', e.target.value || null)} placeholder="Ej: (51) 2 543 775" />
                        </div>
                        <div className="grid gap-2">
                            <Label>Teléfono repuestos</Label>
                            <Input value={data.phone_repuestos ?? ''} onChange={(e) => set('phone_repuestos', e.target.value || null)} placeholder="Ej: (51) 2 543 776" />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <div className="flex items-center justify-between">
                            <Label>Teléfonos servicio técnico</Label>
                            <Button type="button" variant="outline" size="sm" onClick={() => set('phones_servicio_tecnico', [...(data.phones_servicio_tecnico ?? []), ''])}>
                                <Plus className="mr-1 size-3" /> Agregar
                            </Button>
                        </div>
                        {(data.phones_servicio_tecnico ?? []).length === 0 && (
                            <p className="text-xs text-muted-foreground">Sin teléfonos de servicio técnico. Puedes agregar uno o varios.</p>
                        )}
                        {(data.phones_servicio_tecnico ?? []).map((tel, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <Input
                                    value={tel}
                                    onChange={(e) => {
                                        const next = [...(data.phones_servicio_tecnico ?? [])];
                                        next[i] = e.target.value;
                                        set('phones_servicio_tecnico', next);
                                    }}
                                    placeholder="Ej: (51) 2 544 710"
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => set('phones_servicio_tecnico', (data.phones_servicio_tecnico ?? []).filter((_, j) => j !== i))}
                                >
                                    <Trash2 className="size-4 text-destructive" />
                                </Button>
                            </div>
                        ))}
                    </div>

                    <div className="grid gap-2">
                        <Label>Orden</Label>
                        <Input type="number" value={data.display_order} onChange={(e) => set('display_order', Number(e.target.value))} />
                    </div>

                    <div className="flex items-center gap-3">
                        <Checkbox id="is_active" checked={data.is_active} onCheckedChange={(v) => set('is_active', !!v)} />
                        <Label htmlFor="is_active">Activa</Label>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear sucursal'}
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/admin/branches">Cancelar</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
