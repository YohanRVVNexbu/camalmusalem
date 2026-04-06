import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import AdminLayout from '@/layouts/admin-layout';

type Accesorio = { id?: number; name: string; description: string | null; price: string | null; category: string; images: string[]; is_visible: boolean; order: number; };

export default function AccesorioForm({ accesorio }: { accesorio: Accesorio | null }) {
    const { flash } = usePage<{ flash: { success?: string } }>().props;
    const isEdit = !!accesorio?.id;

    const [data, setData] = useState<Accesorio>(accesorio ?? {
        name: '', description: null, price: null, category: 'General', images: [], is_visible: true, order: 0,
    });
    const [newImages, setNewImages] = useState<File[]>([]);
    const [removeImages, setRemoveImages] = useState<string[]>([]);
    const [processing, setProcessing] = useState(false);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('description', data.description ?? '');
        formData.append('price', data.price ?? '');
        formData.append('category', data.category);
        formData.append('is_visible', data.is_visible ? '1' : '0');
        formData.append('order', String(data.order));
        newImages.forEach((f) => formData.append('images_new[]', f));
        removeImages.forEach((u) => formData.append('images_remove[]', u));
        if (isEdit) formData.append('_method', 'PUT');

        router.post(isEdit ? `/admin/accesorios/${accesorio!.id}` : '/admin/accesorios', formData, {
            forceFormData: true, onFinish: () => setProcessing(false),
        });
    };

    return (
        <AdminLayout breadcrumbs={[{ title: 'Dashboard', href: '/admin' }, { title: 'Accesorios', href: '/admin/accesorios' }, { title: isEdit ? 'Editar' : 'Crear', href: '#' }]}>
            <Head title={`Admin — ${isEdit ? 'Editar' : 'Crear'} accesorio`} />
            <div className="flex flex-col gap-4 p-4">
                <h1 className="text-2xl font-semibold">{isEdit ? `Editar: ${accesorio!.name}` : 'Nuevo accesorio'}</h1>
                {flash?.success && <div className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700">{flash.success}</div>}
                <form onSubmit={submit} className="flex flex-col gap-6 max-w-2xl">
                    <div className="flex items-center space-x-3">
                        <Checkbox checked={data.is_visible} onCheckedChange={(v) => setData({ ...data, is_visible: !!v })} />
                        <Label>Visible en el sitio</Label>
                    </div>
                    <Separator />
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2 col-span-2">
                            <Label>Nombre *</Label>
                            <Input value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} required />
                        </div>
                        <div className="grid gap-2">
                            <Label>Categoría</Label>
                            <Input value={data.category} onChange={(e) => setData({ ...data, category: e.target.value })} placeholder="Ropa, Accesorios, Juguetes, Hogar…" />
                        </div>
                        <div className="grid gap-2">
                            <Label>Precio</Label>
                            <Input value={data.price ?? ''} onChange={(e) => setData({ ...data, price: e.target.value })} placeholder="$ 15.000" />
                        </div>
                        <div className="grid gap-2">
                            <Label>Orden</Label>
                            <Input type="number" value={data.order} onChange={(e) => setData({ ...data, order: Number(e.target.value) })} />
                        </div>
                        <div className="grid gap-2 col-span-2">
                            <Label>Descripción</Label>
                            <Textarea value={data.description ?? ''} onChange={(e) => setData({ ...data, description: e.target.value })} rows={4} />
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label>Imágenes</Label>
                        {(data.images ?? []).length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {data.images.map((url) => (
                                    <div key={url} className="relative">
                                        <img src={url} className="h-24 w-32 rounded-lg object-cover" alt="" />
                                        <button type="button" onClick={() => {
                                            setRemoveImages([...removeImages, url]);
                                            setData({ ...data, images: data.images.filter((u) => u !== url) });
                                        }} className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-destructive text-white text-xs">✕</button>
                                    </div>
                                ))}
                            </div>
                        )}
                        <Input type="file" accept="image/*" multiple onChange={(e) => setNewImages(Array.from(e.target.files ?? []))} />
                    </div>
                    <div className="flex gap-3">
                        <Button type="submit" disabled={processing}>{processing ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear accesorio'}</Button>
                        <Button variant="outline" asChild><Link href="/admin/accesorios">Cancelar</Link></Button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
