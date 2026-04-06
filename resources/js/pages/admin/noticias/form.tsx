import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import AdminLayout from '@/layouts/admin-layout';

type Noticia = {
    id?: number; title: string; excerpt: string | null; content: string | null;
    image: string | null; published_at: string | null; is_visible: boolean; order: number;
};

export default function NoticiaForm({ noticia }: { noticia: Noticia | null }) {
    const { flash } = usePage<{ flash: { success?: string } }>().props;
    const isEdit = !!noticia?.id;

    const [data, setData] = useState<Noticia>(noticia ?? {
        title: '', excerpt: null, content: null, image: null,
        published_at: new Date().toISOString().slice(0, 16), is_visible: true, order: 0,
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [processing, setProcessing] = useState(false);

    const set = (field: keyof Noticia, val: any) => setData({ ...data, [field]: val });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('excerpt', data.excerpt ?? '');
        formData.append('content', data.content ?? '');
        formData.append('published_at', data.published_at ?? '');
        formData.append('is_visible', data.is_visible ? '1' : '0');
        formData.append('order', String(data.order));
        if (imageFile) formData.append('image', imageFile);
        if (isEdit) formData.append('_method', 'PUT');

        router.post(isEdit ? `/admin/noticias/${noticia!.id}` : '/admin/noticias', formData, {
            forceFormData: true, onFinish: () => setProcessing(false),
        });
    };

    return (
        <AdminLayout breadcrumbs={[{ title: 'Dashboard', href: '/admin' }, { title: 'Noticias', href: '/admin/noticias' }, { title: isEdit ? 'Editar' : 'Crear', href: '#' }]}>
            <Head title={`Admin — ${isEdit ? 'Editar' : 'Crear'} noticia`} />
            <div className="flex flex-col gap-4 p-4">
                <h1 className="text-2xl font-semibold">{isEdit ? `Editar: ${noticia!.title}` : 'Nueva noticia'}</h1>
                {flash?.success && <div className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700">{flash.success}</div>}

                <form onSubmit={submit} className="flex flex-col gap-6 max-w-3xl">
                    <div className="flex items-center space-x-3">
                        <Checkbox checked={data.is_visible} onCheckedChange={(v) => set('is_visible', !!v)} />
                        <Label>Publicada (visible en el sitio)</Label>
                    </div>
                    <Separator />
                    <div className="grid gap-2">
                        <Label>Título *</Label>
                        <Input value={data.title} onChange={(e) => set('title', e.target.value)} required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label>Fecha de publicación</Label>
                            <Input type="datetime-local" value={data.published_at ?? ''} onChange={(e) => set('published_at', e.target.value)} />
                        </div>
                        <div className="grid gap-2">
                            <Label>Orden</Label>
                            <Input type="number" value={data.order} onChange={(e) => set('order', Number(e.target.value))} />
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label>Extracto / resumen</Label>
                        <Textarea value={data.excerpt ?? ''} onChange={(e) => set('excerpt', e.target.value)} rows={3} placeholder="Breve descripción que aparece en el listado…" />
                    </div>
                    <div className="grid gap-2">
                        <Label>Contenido (HTML permitido)</Label>
                        <Textarea value={data.content ?? ''} onChange={(e) => set('content', e.target.value)} rows={12} className="font-mono text-sm" />
                    </div>
                    <div className="grid gap-2">
                        <Label>Imagen de portada</Label>
                        {data.image && !imageFile && (
                            <img src={data.image} className="h-40 w-full rounded-lg object-cover" alt="" />
                        )}
                        <Input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] ?? null)} />
                    </div>
                    <div className="flex gap-3">
                        <Button type="submit" disabled={processing}>{processing ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear noticia'}</Button>
                        <Button variant="outline" asChild><Link href="/admin/noticias">Cancelar</Link></Button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
