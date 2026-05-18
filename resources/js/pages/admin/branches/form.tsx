import { Head, Link, router, usePage } from '@inertiajs/react';
import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AdminLayout from '@/layouts/admin-layout';
import { BranchMapPicker } from '@/components/admin/branch-map-picker';
import fallback1 from '@images/seminuevos/visitanos_1.png?format=webp';
import fallback2 from '@images/seminuevos/visitanos_2.png?format=webp';

const FALLBACK_IMAGES = [fallback1, fallback2];

type Branch = {
    id?: number;
    name: string;
    address: string | null;
    city: string | null;
    maps_url: string | null;
    latitude: number | null;
    longitude: number | null;
    phone: string | null;
    phone_sucursal: string | null;
    phone_repuestos: string | null;
    phones_servicio_tecnico: string[] | null;
    image_path: string | null;
    salesforce_dealer_id: string | null;
    is_active: boolean;
    display_order: number;
};

export default function BranchForm({ branch, fallbackPosition = 0 }: { branch: Branch | null; fallbackPosition?: number }) {
    const { flash } = usePage<{ flash: { success?: string } }>().props;
    const isEdit = !!branch?.id;

    const [data, setData] = useState<Branch>(branch ?? {
        name: '', address: null, city: null, maps_url: null,
        latitude: null, longitude: null,
        phone: null, phone_sucursal: null, phone_repuestos: null,
        phones_servicio_tecnico: [], image_path: null,
        salesforce_dealer_id: null,
        is_active: true, display_order: 0,
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [processing, setProcessing] = useState(false);

    const set = (field: keyof Branch, val: any) => setData({ ...data, [field]: val });

    const handleMapPick = (lat: number, lng: number) => {
        setData({
            ...data,
            latitude: lat,
            longitude: lng,
            // El maps_url se sincroniza automáticamente con el punto del mapa.
            maps_url: `https://www.google.com/maps?q=${lat},${lng}`,
        });
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        const fd = new FormData();
        Object.entries(data).forEach(([k, v]) => {
            if (k === 'image_path') return;
            if (Array.isArray(v)) {
                v.forEach((item, i) => fd.append(`${k}[${i}]`, String(item)));
            } else if (v !== null && v !== undefined) {
                fd.append(k, typeof v === 'boolean' ? (v ? '1' : '0') : String(v));
            }
        });
        if (imageFile) fd.append('image', imageFile);

        if (isEdit) {
            fd.append('_method', 'PUT');
            router.post(`/admin/branches/${branch!.id}`, fd, { forceFormData: true, onFinish: () => setProcessing(false) });
        } else {
            router.post('/admin/branches', fd, { forceFormData: true, onFinish: () => setProcessing(false) });
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
                        <Label>Ubicación en el mapa</Label>
                        <BranchMapPicker
                            latitude={data.latitude}
                            longitude={data.longitude}
                            onChange={handleMapPick}
                            searchHint={[data.address, data.city].filter(Boolean).join(', ')}
                        />
                        {data.latitude != null && data.longitude != null && (
                            <p className="text-xs text-muted-foreground">
                                Coordenadas: <strong>{data.latitude.toFixed(6)}, {data.longitude.toFixed(6)}</strong>
                                {' · '}
                                <a
                                    href={data.maps_url ?? `https://www.google.com/maps?q=${data.latitude},${data.longitude}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="underline hover:no-underline"
                                >
                                    Abrir en Google Maps
                                </a>
                            </p>
                        )}
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
                        <Label>Imagen de la sucursal</Label>
                        {(() => {
                            const fallback = FALLBACK_IMAGES[fallbackPosition % FALLBACK_IMAGES.length];
                            if (imageFile) {
                                return (
                                    <div className="relative">
                                        <img src={URL.createObjectURL(imageFile)} className="h-40 w-full rounded-lg object-cover ring-2 ring-primary" alt="" />
                                        <span className="absolute bottom-2 left-2 rounded bg-primary/80 px-2 py-0.5 text-xs text-white">Nueva imagen</span>
                                    </div>
                                );
                            }
                            if (data.image_path) {
                                return <img src={data.image_path} className="h-40 w-full rounded-lg object-cover" alt="" />;
                            }
                            return (
                                <div className="relative">
                                    <img src={fallback} className="h-40 w-full rounded-lg object-cover" alt="" />
                                    <span className="absolute bottom-2 left-2 rounded bg-black/60 px-2 py-0.5 text-xs text-white">Default</span>
                                </div>
                            );
                        })()}
                        <Input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] ?? null)} />
                        <p className="text-xs text-muted-foreground">Aparece en la sección "Visítanos en nuestras sucursales" del sitio público. Si no subes una imagen, se mostrará la imagen default.</p>
                    </div>

                    <div className="grid gap-2 rounded-lg border p-4">
                        <Label>Salesforce Dealer ID</Label>
                        <Input
                            type="text"
                            value={data.salesforce_dealer_id ?? ''}
                            onChange={(e) => set('salesforce_dealer_id', e.target.value || null)}
                            placeholder="Ej: 100068"
                        />
                        <p className="text-xs text-muted-foreground">
                            ID SAP Toyota que identifica esta sucursal en Salesforce. Es el valor del
                            parámetro <code>id-seller</code> en el endpoint{' '}
                            <code>/dealers/&#123;id-seller&#125;/quote</code>. Si lo dejas vacío, las
                            cotizaciones para esta sucursal no se sincronizarán automáticamente con
                            Salesforce (se guardan localmente igual).
                        </p>
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
