import { Head, Link, router, usePage } from '@inertiajs/react';
import { X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import AdminLayout from '@/layouts/admin-layout';

type VehicleLite = {
    id: number;
    name: string;
    brand_name: string | null;
    description: string | null;
    hero_image: string | null;
};

type BranchLite = { id: number; name: string; city: string };

type Rental = {
    id?: number;
    vehicle_model_id: number | null;
    name: string | null;
    description: string | null;
    card_image: string | null;
    price_hour: string | null;
    price_day: string | null;
    price_week: string | null;
    price_month: string | null;
    is_active: boolean;
    display_order: number;
    branch_ids: number[];
};

const empty: Rental = {
    vehicle_model_id: null, name: '', description: '', card_image: null,
    price_hour: '', price_day: '', price_week: '', price_month: '',
    is_active: true, display_order: 0, branch_ids: [],
};

export default function RentalForm({
    rental, vehicle_models, branches,
}: {
    rental: Rental | null;
    vehicle_models: VehicleLite[];
    branches: BranchLite[];
}) {
    const { flash } = usePage<{ flash: { success?: string } }>().props;
    const isEdit = !!rental?.id;

    const [data, setData] = useState<Rental>(rental ?? empty);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [removeImage, setRemoveImage] = useState(false);
    const [processing, setProcessing] = useState(false);

    const selectedVehicle = useMemo(
        () => vehicle_models.find((v) => v.id === data.vehicle_model_id) ?? null,
        [data.vehicle_model_id, vehicle_models],
    );

    // When a vehicle is picked and the override fields are empty, prefill them
    // visually for the admin. The empty fields stay empty in `data` (they will
    // fall back to the vehicle on the public side).
    const namePlaceholder = selectedVehicle ? `${selectedVehicle.brand_name ?? ''} ${selectedVehicle.name}`.trim() : 'Nombre del arriendo';
    const descPlaceholder = selectedVehicle?.description ?? 'Descripción del arriendo (opcional, override del vehículo)';

    const pickVehicle = (id: string) => {
        const vid = id === 'none' ? null : Number(id);
        const vehicle = vehicle_models.find((v) => v.id === vid) ?? null;
        // On create, autofill name/description from the picked vehicle so the
        // admin can tweak from there. On edit we don't touch existing values.
        if (!isEdit && vehicle) {
            setData({
                ...data,
                vehicle_model_id: vid,
                name: data.name || `${vehicle.brand_name ?? ''} ${vehicle.name}`.trim(),
                description: data.description || vehicle.description || '',
            });
        } else {
            setData({ ...data, vehicle_model_id: vid });
        }
    };

    const toggleBranch = (id: number, checked: boolean) => {
        setData({
            ...data,
            branch_ids: checked
                ? [...data.branch_ids, id]
                : data.branch_ids.filter((b) => b !== id),
        });
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        const fd = new FormData();
        fd.append('vehicle_model_id', data.vehicle_model_id ? String(data.vehicle_model_id) : '');
        fd.append('name', data.name ?? '');
        fd.append('description', data.description ?? '');
        fd.append('price_hour', data.price_hour ?? '');
        fd.append('price_day', data.price_day ?? '');
        fd.append('price_week', data.price_week ?? '');
        fd.append('price_month', data.price_month ?? '');
        fd.append('is_active', data.is_active ? '1' : '0');
        fd.append('display_order', String(data.display_order));
        data.branch_ids.forEach((id) => fd.append('branch_ids[]', String(id)));

        if (imageFile) fd.append('card_image', imageFile);
        if (removeImage && !imageFile) fd.append('card_image_remove', '1');
        if (isEdit) fd.append('_method', 'PUT');

        router.post(
            isEdit ? `/admin/rentals/${rental!.id}` : '/admin/rentals',
            fd,
            { forceFormData: true, onFinish: () => setProcessing(false) },
        );
    };

    return (
        <AdminLayout breadcrumbs={[
            { title: 'Dashboard', href: '/admin' },
            { title: 'Arriendos', href: '/admin/rentals' },
            { title: isEdit ? 'Editar' : 'Crear', href: '#' },
        ]}>
            <Head title={`Admin — ${isEdit ? 'Editar' : 'Crear'} arriendo`} />
            <div className="flex flex-col gap-4 p-4 max-w-5xl">
                <h1 className="text-2xl font-semibold">{isEdit ? `Editar arriendo` : 'Nuevo arriendo'}</h1>

                {flash?.success && (
                    <div className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700">{flash.success}</div>
                )}

                <form onSubmit={submit} className="flex flex-col gap-6">
                    {/* Vehículo base */}
                    <section className="rounded-lg border p-4 flex flex-col gap-3">
                        <h2 className="text-lg font-semibold">Vehículo base</h2>
                        <p className="text-xs text-muted-foreground">Elegí un vehículo del catálogo de nuevos. Los campos del arriendo van a usar los datos del vehículo cuando los dejes en blanco.</p>
                        <div className="grid gap-2">
                            <Label>Vehículo</Label>
                            <Select
                                value={data.vehicle_model_id ? String(data.vehicle_model_id) : 'none'}
                                onValueChange={pickVehicle}
                            >
                                <SelectTrigger><SelectValue placeholder="— Ninguno —" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">— Ninguno —</SelectItem>
                                    {vehicle_models.map((v) => (
                                        <SelectItem key={v.id} value={String(v.id)}>
                                            {v.brand_name} {v.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        {selectedVehicle && (
                            <div className="flex items-start gap-3 rounded-md border bg-muted/30 p-3">
                                {selectedVehicle.hero_image && (
                                    <img src={selectedVehicle.hero_image} className="h-20 w-32 rounded object-cover" alt="" />
                                )}
                                <div className="text-xs text-muted-foreground">
                                    <p className="font-medium text-foreground">{selectedVehicle.brand_name} {selectedVehicle.name}</p>
                                    {selectedVehicle.description && <p className="mt-1">{selectedVehicle.description}</p>}
                                </div>
                            </div>
                        )}
                    </section>

                    {/* Datos del arriendo (overrides) */}
                    <section className="rounded-lg border p-4 flex flex-col gap-4">
                        <h2 className="text-lg font-semibold">Datos del arriendo</h2>
                        <p className="text-xs text-muted-foreground">Si dejas un campo vacío, se mostrará el del vehículo base.</p>

                        <div className="grid gap-2">
                            <Label>Nombre {selectedVehicle && '(override)'}</Label>
                            <Input
                                value={data.name ?? ''}
                                onChange={(e) => setData({ ...data, name: e.target.value })}
                                placeholder={namePlaceholder}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label>Descripción {selectedVehicle && '(override)'}</Label>
                            <Textarea
                                rows={3}
                                value={data.description ?? ''}
                                onChange={(e) => setData({ ...data, description: e.target.value })}
                                placeholder={descPlaceholder}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label>Imagen card {selectedVehicle && '(override)'}</Label>
                            {imageFile ? (
                                <div className="relative w-fit">
                                    <img src={URL.createObjectURL(imageFile)} className="h-32 w-auto rounded-lg object-cover ring-2 ring-primary" alt="" />
                                    <button type="button" onClick={() => setImageFile(null)} className="absolute -right-2 -top-2 flex size-6 items-center justify-center rounded-full bg-destructive text-white">
                                        <X className="size-3.5" />
                                    </button>
                                </div>
                            ) : data.card_image && !removeImage ? (
                                <div className="relative w-fit">
                                    <img src={data.card_image} className="h-32 w-auto rounded-lg object-cover" alt="" />
                                    <button type="button" onClick={() => setRemoveImage(true)} className="absolute -right-2 -top-2 flex size-6 items-center justify-center rounded-full bg-destructive text-white">
                                        <X className="size-3.5" />
                                    </button>
                                </div>
                            ) : selectedVehicle?.hero_image && !data.card_image ? (
                                <div className="relative w-fit opacity-70">
                                    <img src={selectedVehicle.hero_image} className="h-32 w-auto rounded-lg object-cover" alt="" />
                                    <span className="absolute bottom-1 left-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] text-white">Heredada del vehículo</span>
                                </div>
                            ) : null}
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={(e) => { setImageFile(e.target.files?.[0] ?? null); setRemoveImage(false); }}
                            />
                        </div>
                    </section>

                    {/* Precios */}
                    <section className="rounded-lg border p-4 flex flex-col gap-4">
                        <h2 className="text-lg font-semibold">Precios</h2>
                        <p className="text-xs text-muted-foreground">Indica al menos uno. Los vacíos no se muestran.</p>
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                            <div className="grid gap-2">
                                <Label>Por hora</Label>
                                <Input value={data.price_hour ?? ''} onChange={(e) => setData({ ...data, price_hour: e.target.value })} placeholder="$ 18.300" />
                            </div>
                            <div className="grid gap-2">
                                <Label>Por día</Label>
                                <Input value={data.price_day ?? ''} onChange={(e) => setData({ ...data, price_day: e.target.value })} placeholder="$ 89.000" />
                            </div>
                            <div className="grid gap-2">
                                <Label>Por semana</Label>
                                <Input value={data.price_week ?? ''} onChange={(e) => setData({ ...data, price_week: e.target.value })} placeholder="$ 450.000" />
                            </div>
                            <div className="grid gap-2">
                                <Label>Por mes</Label>
                                <Input value={data.price_month ?? ''} onChange={(e) => setData({ ...data, price_month: e.target.value })} placeholder="$ 1.500.000" />
                            </div>
                        </div>
                    </section>

                    {/* Sucursales */}
                    <section className="rounded-lg border p-4 flex flex-col gap-3">
                        <h2 className="text-lg font-semibold">Sucursales disponibles</h2>
                        <p className="text-xs text-muted-foreground">Marca las sucursales donde el vehículo está disponible para arriendo.</p>
                        <div className="flex flex-wrap gap-4">
                            {branches.map((b) => (
                                <label key={b.id} className="flex items-center gap-2 rounded-md border px-3 py-2 cursor-pointer">
                                    <Checkbox
                                        checked={data.branch_ids.includes(b.id)}
                                        onCheckedChange={(v) => toggleBranch(b.id, !!v)}
                                    />
                                    <span className="text-sm">{b.name}</span>
                                    <span className="text-xs text-muted-foreground">({b.city})</span>
                                </label>
                            ))}
                        </div>
                    </section>

                    <Separator />

                    {/* Meta */}
                    <div className="grid grid-cols-2 gap-4 max-w-md">
                        <div className="grid gap-2">
                            <Label>Orden de visualización</Label>
                            <Input type="number" value={data.display_order} onChange={(e) => setData({ ...data, display_order: Number(e.target.value) })} />
                        </div>
                        <div className="flex items-end gap-3 pb-2">
                            <Checkbox id="is_active" checked={data.is_active} onCheckedChange={(v) => setData({ ...data, is_active: !!v })} />
                            <Label htmlFor="is_active">Activo</Label>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear arriendo'}
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/admin/rentals">Cancelar</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
