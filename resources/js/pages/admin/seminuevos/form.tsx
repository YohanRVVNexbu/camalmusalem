import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import AdminLayout from '@/layouts/admin-layout';

type Seminuevo = {
    id?: number; brand: string; model: string; year: number; km: number; price: string;
    fuel: string | null; transmission: string | null; traction: string | null;
    doors: number; seats: number; color: string | null; description: string | null;
    gallery: string[]; is_visible: boolean; order: number;
};

export default function SeminuevoForm({ seminuevo }: { seminuevo: Seminuevo | null }) {
    const { flash } = usePage<{ flash: { success?: string } }>().props;
    const isEdit = !!seminuevo?.id;

    const [data, setData] = useState<Seminuevo>(seminuevo ?? {
        brand: 'Toyota', model: '', year: new Date().getFullYear(), km: 0, price: '',
        fuel: null, transmission: null, traction: null, doors: 5, seats: 5,
        color: null, description: null, gallery: [], is_visible: true, order: 0,
    });
    const [newGallery, setNewGallery] = useState<File[]>([]);
    const [removeGallery, setRemoveGallery] = useState<string[]>([]);
    const [processing, setProcessing] = useState(false);

    const set = (field: keyof Seminuevo, val: any) => setData({ ...data, [field]: val });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        const formData = new FormData();
        const fields: (keyof Seminuevo)[] = ['brand','model','year','km','price','fuel','transmission','traction','doors','seats','color','description','is_visible','order'];
        fields.forEach((f) => formData.append(f as string, String(data[f] ?? '')));
        formData.set('is_visible', data.is_visible ? '1' : '0');
        newGallery.forEach((f) => formData.append('gallery_new[]', f));
        removeGallery.forEach((u) => formData.append('gallery_remove[]', u));
        if (isEdit) formData.append('_method', 'PUT');

        router.post(isEdit ? `/admin/seminuevos/${seminuevo!.id}` : '/admin/seminuevos', formData, {
            forceFormData: true, onFinish: () => setProcessing(false),
        });
    };

    return (
        <AdminLayout breadcrumbs={[{ title: 'Dashboard', href: '/admin' }, { title: 'Seminuevos', href: '/admin/seminuevos' }, { title: isEdit ? 'Editar' : 'Crear', href: '#' }]}>
            <Head title={`Admin — ${isEdit ? 'Editar' : 'Crear'} seminuevo`} />
            <div className="flex flex-col gap-4 p-4">
                <h1 className="text-2xl font-semibold">{isEdit ? `Editar: ${seminuevo!.brand} ${seminuevo!.model}` : 'Nuevo seminuevo'}</h1>
                {flash?.success && <div className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700">{flash.success}</div>}

                <form onSubmit={submit} className="flex flex-col gap-6 max-w-3xl">
                    <div className="flex items-center space-x-3">
                        <Checkbox checked={data.is_visible} onCheckedChange={(v) => set('is_visible', !!v)} />
                        <Label>Visible en el sitio</Label>
                    </div>
                    <Separator />
                    <div className="grid grid-cols-3 gap-4">
                        <div className="grid gap-2">
                            <Label>Marca *</Label>
                            <Input value={data.brand} onChange={(e) => set('brand', e.target.value)} required />
                        </div>
                        <div className="grid gap-2 col-span-2">
                            <Label>Modelo *</Label>
                            <Input value={data.model} onChange={(e) => set('model', e.target.value)} required />
                        </div>
                        <div className="grid gap-2">
                            <Label>Año *</Label>
                            <Input type="number" value={data.year} onChange={(e) => set('year', Number(e.target.value))} required min={1990} max={2030} />
                        </div>
                        <div className="grid gap-2">
                            <Label>Km *</Label>
                            <Input type="number" value={data.km} onChange={(e) => set('km', Number(e.target.value))} required min={0} />
                        </div>
                        <div className="grid gap-2">
                            <Label>Precio *</Label>
                            <Input value={data.price} onChange={(e) => set('price', e.target.value)} placeholder="$ 15.000.000" required />
                        </div>
                        <div className="grid gap-2">
                            <Label>Combustible</Label>
                            <Input value={data.fuel ?? ''} onChange={(e) => set('fuel', e.target.value)} placeholder="Gasolina, Diésel, Híbrido…" />
                        </div>
                        <div className="grid gap-2">
                            <Label>Transmisión</Label>
                            <Input value={data.transmission ?? ''} onChange={(e) => set('transmission', e.target.value)} placeholder="Automática, Manual…" />
                        </div>
                        <div className="grid gap-2">
                            <Label>Tracción</Label>
                            <Input value={data.traction ?? ''} onChange={(e) => set('traction', e.target.value)} placeholder="4x2, 4x4…" />
                        </div>
                        <div className="grid gap-2">
                            <Label>Color</Label>
                            <Input value={data.color ?? ''} onChange={(e) => set('color', e.target.value)} />
                        </div>
                        <div className="grid gap-2">
                            <Label>Puertas</Label>
                            <Input type="number" value={data.doors} onChange={(e) => set('doors', Number(e.target.value))} min={2} max={6} />
                        </div>
                        <div className="grid gap-2">
                            <Label>Asientos</Label>
                            <Input type="number" value={data.seats} onChange={(e) => set('seats', Number(e.target.value))} min={2} max={9} />
                        </div>
                        <div className="grid gap-2">
                            <Label>Orden</Label>
                            <Input type="number" value={data.order} onChange={(e) => set('order', Number(e.target.value))} />
                        </div>
                        <div className="grid gap-2 col-span-3">
                            <Label>Descripción</Label>
                            <Textarea value={data.description ?? ''} onChange={(e) => set('description', e.target.value)} rows={3} />
                        </div>
                    </div>

                    {/* Galería */}
                    <div className="grid gap-2">
                        <Label>Galería de fotos</Label>
                        {(data.gallery ?? []).length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {data.gallery.map((url) => (
                                    <div key={url} className="relative">
                                        <img src={url} className="h-24 w-32 rounded-lg object-cover" alt="" />
                                        <button type="button" onClick={() => {
                                            setRemoveGallery([...removeGallery, url]);
                                            setData({ ...data, gallery: data.gallery.filter((u) => u !== url) });
                                        }} className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-destructive text-white text-xs">✕</button>
                                    </div>
                                ))}
                            </div>
                        )}
                        <Input type="file" accept="image/*" multiple onChange={(e) => setNewGallery(Array.from(e.target.files ?? []))} />
                    </div>

                    <div className="flex gap-3">
                        <Button type="submit" disabled={processing}>{processing ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear seminuevo'}</Button>
                        <Button variant="outline" asChild><Link href="/admin/seminuevos">Cancelar</Link></Button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
