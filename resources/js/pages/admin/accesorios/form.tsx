import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { formatCLP } from '@/lib/format';
import { uploadImageBase64 } from '@/lib/image-upload';
import AdminLayout from '@/layouts/admin-layout';

type Accesorio = { id?: number; name: string; description: string | null; comentarios: string | null; price: string | null; category: string; images: string[]; is_visible: boolean; order: number; };

export default function AccesorioForm({ accesorio }: { accesorio: Accesorio | null }) {
    const { flash } = usePage<{ flash: { success?: string } }>().props;
    const isEdit = !!accesorio?.id;

    // Normaliza images a []: si viene de DB como null, el spread reventaba
    // la página (pantalla en blanco) al subir la primera foto.
    const [data, setData] = useState<Accesorio>(accesorio
        ? { ...accesorio, images: accesorio.images ?? [] }
        : { name: '', description: null, comentarios: null, price: null, category: 'General', images: [], is_visible: true, order: 0 });
    const [uploadingCount, setUploadingCount] = useState(0);
    const [processing, setProcessing] = useState(false);

    // Sube cada imagen vía Base64 (JSON) al momento de elegirla. Así el form
    // principal no necesita multipart y el WAF no rechaza con 403.
    const handlePickImages = async (files: File[]) => {
        if (files.length === 0) return;
        setUploadingCount((c) => c + files.length);
        for (const file of files) {
            try {
                const url = await uploadImageBase64(file, `accesorios/${accesorio?.id ?? 'new'}`);
                setData((d) => ({ ...d, images: [...(d.images ?? []), url] }));
            } catch (err) {
                console.error('Falló subir imagen de accesorio:', err);
                toast.error('No se pudo subir una imagen. ' + (err instanceof Error ? err.message : ''));
            } finally {
                setUploadingCount((c) => c - 1);
            }
        }
    };

    const removeImage = (url: string) => {
        setData({ ...data, images: (data.images ?? []).filter((u) => u !== url) });
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        const payload = {
            name: data.name,
            description: data.description ?? '',
            comentarios: data.comentarios ?? '',
            price: data.price ?? '',
            category: data.category,
            is_visible: data.is_visible ? '1' : '0',
            order: data.order,
            images: data.images,
        };
        if (isEdit) {
            router.put(`/admin/accesorios/${accesorio!.id}`, payload, { onFinish: () => setProcessing(false) });
        } else {
            router.post('/admin/accesorios', payload, { onFinish: () => setProcessing(false) });
        }
    };

    return (
        <AdminLayout breadcrumbs={[{ title: 'Dashboard', href: '/admin' }, { title: 'Accesorios', href: '/admin/accesorios' }, { title: isEdit ? 'Editar' : 'Crear', href: '#' }]}>
            <Head title={`Admin — ${isEdit ? 'Editar' : 'Crear'} accesorio`} />
            <div className="flex flex-col gap-4 p-4">
                <h1 className="text-2xl font-semibold">{isEdit ? `Editar: ${accesorio!.name}` : 'Nuevo accesorio'}</h1>
                {flash?.success && <div className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700">{flash.success}</div>}
                <form onSubmit={submit} className="flex flex-col gap-6">
                    <div className="flex items-center space-x-3">
                        <Checkbox checked={data.is_visible} onCheckedChange={(v) => setData({ ...data, is_visible: !!v })} />
                        <Label>Publicado</Label>
                    </div>
                    <Separator />
                    <div className="grid grid-cols-3 gap-4">
                        <div className="grid gap-2 col-span-3">
                            <Label>Nombre *</Label>
                            <Input value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} required />
                        </div>
                        <div className="grid gap-2">
                            <Label>Categoría</Label>
                            <Input value={data.category} onChange={(e) => setData({ ...data, category: e.target.value })} placeholder="Ropa, Accesorios, Juguetes, Hogar…" />
                        </div>
                        <div className="grid gap-2">
                            <Label>Precio</Label>
                            <Input
                                value={formatCLP(data.price)}
                                onChange={(e) => setData({ ...data, price: e.target.value.replace(/[^0-9]/g, '') || null })}
                                placeholder="$ 15.000"
                                inputMode="numeric"
                            />
                            <p className="text-xs text-muted-foreground">Ingresa sólo el número; el formato $ y los puntos se aplican automáticamente.</p>
                        </div>
                        <div className="grid gap-2">
                            <Label>Orden</Label>
                            <Input type="number" value={data.order} onChange={(e) => setData({ ...data, order: Number(e.target.value) })} />
                        </div>
                        <div className="grid gap-2 col-span-3">
                            <Label>Descripción</Label>
                            <Textarea value={data.description ?? ''} onChange={(e) => setData({ ...data, description: e.target.value })} rows={4} />
                        </div>
                        <div className="md:col-span-2 grid gap-2">
                            <Label>Comentarios <span className="text-muted-foreground text-xs">(nota manual; aparece en la ficha del producto)</span></Label>
                            <Textarea value={data.comentarios ?? ''} onChange={(e) => setData({ ...data, comentarios: e.target.value })} rows={3} placeholder="Ej: Disponible solo por encargo, consultar tiempos de entrega…" />
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label>Imágenes</Label>
                        {(data.images ?? []).length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {data.images.map((url) => (
                                    <div key={url} className="relative">
                                        <img src={url} className="h-24 w-32 rounded-lg object-cover" alt="" />
                                        <button type="button" onClick={() => removeImage(url)} className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-destructive text-white text-xs">✕</button>
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
                        <Button type="submit" disabled={processing || uploadingCount > 0}>{processing ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear accesorio'}</Button>
                        <Button variant="outline" asChild><Link href="/admin/accesorios">Cancelar</Link></Button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
