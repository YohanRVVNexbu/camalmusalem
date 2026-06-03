import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { uploadImageBase64 } from '@/lib/image-upload';
import AdminLayout from '@/layouts/admin-layout';

type MerchItem = {
    id?: number;
    sku: string | null;
    name: string;
    description: string | null;
    description_tech: string | null;
    comentarios: string | null;
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

    // Normalizamos `images` a []: si el merch viene de DB con images=null, el
    // spread `[...d.images, url]` en handlePickImages reventaba la página
    // (pantalla en blanco) al subir la primera foto.
    const [data, setData] = useState<MerchItem>(merch
        ? { ...merch, images: merch.images ?? [] }
        : {
            sku: null, name: '', description: null, description_tech: null, comentarios: null,
            category: 'merch', subcategory: null, size: null,
            price: null, price_offer: null, status: 'disponible',
            branch: null, images: [], is_visible: true, order: 0,
        });
    const [uploadingCount, setUploadingCount] = useState(0);
    const [processing, setProcessing] = useState(false);

    const set = (field: keyof MerchItem) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setData({ ...data, [field]: e.target.value });

    const handlePickImages = async (files: File[]) => {
        if (files.length === 0) return;
        setUploadingCount((c) => c + files.length);
        for (const file of files) {
            try {
                const url = await uploadImageBase64(file, `merch/${merch?.id ?? 'new'}`);
                setData((d) => ({ ...d, images: [...(d.images ?? []), url] }));
            } catch (err) {
                console.error('Falló subir imagen de merch:', err);
                toast.error('No se pudo subir una imagen. ' + (err instanceof Error ? err.message : ''));
            } finally {
                setUploadingCount((c) => c - 1);
            }
        }
    };

    const removeImage = (url: string) => {
        setData({ ...data, images: (data.images ?? []).filter((u) => u !== url) });
    };

    const moveImage = (i: number, dir: -1 | 1) => {
        const arr = [...(data.images ?? [])];
        const j = i + dir;
        if (j < 0 || j >= arr.length) return;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        setData({ ...data, images: arr });
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        const payload = {
            sku: data.sku ?? '',
            name: data.name,
            description: data.description ?? '',
            description_tech: data.description_tech ?? '',
            comentarios: data.comentarios ?? '',
            category: data.category,
            subcategory: data.subcategory ?? '',
            size: data.size ?? '',
            price: data.price ?? '',
            price_offer: data.price_offer ?? '',
            status: data.status,
            branch: data.branch ?? '',
            is_visible: data.is_visible ? '1' : '0',
            order: data.order,
            images: data.images,
        };
        if (isEdit) {
            router.put(`/admin/merch/${merch!.id}`, payload, { onFinish: () => setProcessing(false) });
        } else {
            router.post('/admin/merch', payload, { onFinish: () => setProcessing(false) });
        }
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
                        <div className="col-span-4 grid gap-2">
                            <Label>Comentarios <span className="text-muted-foreground text-xs">(nota manual; aparece en la ficha del producto)</span></Label>
                            <Textarea value={data.comentarios ?? ''} onChange={set('comentarios')} rows={3} placeholder="Ej: Edición limitada, stock por sucursal…" />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label>Imágenes <span className="text-xs text-muted-foreground">(la primera es la portada; usa las flechas para reordenar)</span></Label>
                        {(data.images ?? []).length > 0 && (
                            <div className="flex flex-wrap gap-3">
                                {data.images.map((url, i) => (
                                    <div key={url} className="flex flex-col items-center gap-1">
                                        <div className={`relative ${i === 0 ? 'ring-2 ring-primary' : ''} rounded-lg`}>
                                            <img src={url} className="h-24 w-32 rounded-lg object-cover" alt="" />
                                            {i === 0 && (
                                                <span className="absolute left-1 top-1 rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold uppercase leading-none text-primary-foreground">Portada</span>
                                            )}
                                            <button
                                                type="button"
                                                onClick={() => removeImage(url)}
                                                className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-destructive text-white text-xs"
                                            >✕</button>
                                        </div>
                                        <div className="flex w-32 items-stretch gap-1">
                                            <button type="button" onClick={() => moveImage(i, -1)} disabled={i === 0} className="flex flex-1 items-center justify-center rounded-md border bg-background py-1 text-base leading-none hover:bg-muted disabled:opacity-30" title="Mover a la izquierda">←</button>
                                            <button type="button" onClick={() => moveImage(i, 1)} disabled={i === data.images.length - 1} className="flex flex-1 items-center justify-center rounded-md border bg-background py-1 text-base leading-none hover:bg-muted disabled:opacity-30" title="Mover a la derecha">→</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        <Input
                            type="file"
                            accept="image/*"
                            multiple
                            disabled={uploadingCount > 0}
                            onChange={(e) => {
                                const files = Array.from(e.target.files ?? []);
                                handlePickImages(files);
                                e.target.value = '';
                            }}
                        />
                        {uploadingCount > 0 && <p className="text-xs text-muted-foreground">Subiendo {uploadingCount} imagen{uploadingCount === 1 ? '' : 'es'}…</p>}
                    </div>

                    <div className="flex gap-3">
                        <Button type="submit" disabled={processing || uploadingCount > 0}>{processing ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear merch'}</Button>
                        <Button variant="outline" asChild><Link href="/admin/merch">Cancelar</Link></Button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
