import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import AdminLayout from '@/layouts/admin-layout';

type MerchItem = {
    id?: number;
    sku: string | null;
    name: string;
    description: string | null;
    description_tech: string | null;
    category: string;
    subcategory: string | null;
    size: string | null;
    price: string | null;
    price_offer: string | null;
    status: string;
    branch: string | null;
    images: string[];
    is_visible: boolean;
    order: number;
};

export default function MerchForm({ merch }: { merch: MerchItem | null }) {
    const { flash } = usePage<{ flash: { success?: string } }>().props;
    const isEdit = !!merch?.id;

    const [data, setData] = useState<MerchItem>(merch ?? {
        sku: null, name: '', description: null, description_tech: null,
        category: 'merch', subcategory: null, size: null,
        price: null, price_offer: null, status: 'disponible',
        branch: null, images: [], is_visible: true, order: 0,
    });
    const [newImages, setNewImages] = useState<File[]>([]);
    const [removeImages, setRemoveImages] = useState<string[]>([]);
    const [processing, setProcessing] = useState(false);

    const set = (field: keyof MerchItem) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setData({ ...data, [field]: e.target.value });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        const fd = new FormData();
        fd.append('sku', data.sku ?? '');
        fd.append('name', data.name);
        fd.append('description', data.description ?? '');
        fd.append('description_tech', data.description_tech ?? '');
        fd.append('category', data.category);
        fd.append('subcategory', data.subcategory ?? '');
        fd.append('size', data.size ?? '');
        fd.append('price', data.price ?? '');
        fd.append('price_offer', data.price_offer ?? '');
        fd.append('status', data.status);
        fd.append('branch', data.branch ?? '');
        fd.append('is_visible', data.is_visible ? '1' : '0');
        fd.append('order', String(data.order));
        newImages.forEach((f) => fd.append('images_new[]', f));
        removeImages.forEach((u) => fd.append('images_remove[]', u));
        if (isEdit) fd.append('_method', 'PUT');

        router.post(isEdit ? `/admin/merch/${merch!.id}` : '/admin/merch', fd, {
            forceFormData: true,
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <AdminLayout breadcrumbs={[
            { title: 'Dashboard', href: '/admin' },
            { title: 'Merch', href: '/admin/merch' },
            { title: isEdit ? 'Editar' : 'Crear', href: '#' },
        ]}>
            <Head title={`Admin — ${isEdit ? 'Editar' : 'Crear'} merch`} />
            <div className="flex flex-col gap-4 p-4">
                <h1 className="text-2xl font-semibold">{isEdit ? `Editar: ${merch!.name}` : 'Nuevo merch'}</h1>
                {flash?.success && (
                    <div className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700">{flash.success}</div>
                )}

                <form onSubmit={submit} className="flex flex-col gap-6">
                    <div className="flex items-center space-x-3">
                        <Checkbox checked={data.is_visible} onCheckedChange={(v) => setData({ ...data, is_visible: !!v })} />
                        <Label>Publicado</Label>
                    </div>
                    <Separator />

                    <div className="grid grid-cols-4 gap-4">
                        <div className="col-span-4 grid gap-2">
                            <Label>Nombre *</Label>
                            <Input value={data.name} onChange={set('name')} required />
                        </div>
                        <div className="grid gap-2">
                            <Label>SKU</Label>
                            <Input value={data.sku ?? ''} onChange={set('sku')} placeholder="45532" />
                        </div>
                        <div className="grid gap-2">
                            <Label>Categoría</Label>
                            <Input value={data.category} onChange={set('category')} placeholder="merch, accesorio…" />
                        </div>
                        <div className="grid gap-2">
                            <Label>Subcategoría</Label>
                            <Input value={data.subcategory ?? ''} onChange={set('subcategory')} placeholder="GR, Lifestyle…" />
                        </div>
                        <div className="grid gap-2">
                            <Label>Talla</Label>
                            <Input value={data.size ?? ''} onChange={set('size')} placeholder="S - XL, Única…" />
                        </div>
                        <div className="grid gap-2">
                            <Label>Precio</Label>
                            <Input value={data.price ?? ''} onChange={set('price')} placeholder="$ 35.000" />
                        </div>
                        <div className="grid gap-2">
                            <Label>Precio Oferta</Label>
                            <Input value={data.price_offer ?? ''} onChange={set('price_offer')} placeholder="$ 25.000" />
                        </div>
                        <div className="grid gap-2">
                            <Label>Estado</Label>
                            <Select value={data.status} onValueChange={(v) => setData({ ...data, status: v })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="disponible">Disponible</SelectItem>
                                    <SelectItem value="a pedido">A pedido</SelectItem>
                                    <SelectItem value="agotado">Agotado</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label>Sucursal</Label>
                            <Input value={data.branch ?? ''} onChange={set('branch')} placeholder="La Serena, Ovalle…" />
                        </div>
                        <div className="grid gap-2">
                            <Label>Orden</Label>
                            <Input type="number" value={data.order} onChange={(e) => setData({ ...data, order: Number(e.target.value) })} />
                        </div>
                        <div className="col-span-4 grid gap-2">
                            <Label>Descripción corta</Label>
                            <Textarea value={data.description ?? ''} onChange={set('description')} rows={3} />
                        </div>
                        <div className="col-span-4 grid gap-2">
                            <Label>Descripción técnica</Label>
                            <Textarea value={data.description_tech ?? ''} onChange={set('description_tech')} rows={3} />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label>Imágenes</Label>
                        {(data.images ?? []).length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {data.images.map((url) => (
                                    <div key={url} className="relative">
                                        <img src={url} className="h-24 w-32 rounded-lg object-cover" alt="" />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setRemoveImages([...removeImages, url]);
                                                setData({ ...data, images: data.images.filter((u) => u !== url) });
                                            }}
                                            className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-destructive text-white text-xs"
                                        >✕</button>
                                    </div>
                                ))}
                            </div>
                        )}
                        <Input type="file" accept="image/*" multiple onChange={(e) => setNewImages(Array.from(e.target.files ?? []))} />
                    </div>

                    <div className="flex gap-3">
                        <Button type="submit" disabled={processing}>{processing ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear merch'}</Button>
                        <Button variant="outline" asChild><Link href="/admin/merch">Cancelar</Link></Button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
