import { Head, Link, router, usePage } from '@inertiajs/react';
import { X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { uploadImageBase64 } from '@/lib/image-upload';
import AdminLayout from '@/layouts/admin-layout';

type Brand = {
    id?: number;
    name: string;
    slug?: string;
    logo_path: string | null;
    is_active: boolean;
};

export default function BrandForm({ brand }: { brand: Brand | null }) {
    const { flash } = usePage<{ flash: { success?: string } }>().props;
    const isEdit = !!brand?.id;

    const [data, setData] = useState<Brand>(brand ?? {
        name: '', logo_path: null, is_active: true,
    });
    const [uploadingLogo, setUploadingLogo] = useState(false);
    const [processing, setProcessing] = useState(false);

    const handlePickLogo = async (file: File | null) => {
        if (!file) return;
        setUploadingLogo(true);
        try {
            const url = await uploadImageBase64(file, 'brands', data.logo_path);
            setData({ ...data, logo_path: url });
        } catch (err) {
            toast.error('No se pudo subir el logo. ' + (err instanceof Error ? err.message : ''));
        } finally {
            setUploadingLogo(false);
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        const payload = {
            name: data.name,
            is_active: data.is_active ? '1' : '0',
            logo_path: data.logo_path ?? '',
        };
        if (isEdit) {
            router.put(`/admin/brands/${brand!.id}`, payload, { onFinish: () => setProcessing(false) });
        } else {
            router.post('/admin/brands', payload, { onFinish: () => setProcessing(false) });
        }
    };

    return (
        <AdminLayout breadcrumbs={[
            { title: 'Dashboard', href: '/admin' },
            { title: 'Marcas', href: '/admin/brands' },
            { title: isEdit ? 'Editar' : 'Crear', href: '#' },
        ]}>
            <Head title={`Admin — ${isEdit ? 'Editar' : 'Crear'} marca`} />
            <div className="flex flex-col gap-4 p-4 max-w-2xl">
                <h1 className="text-2xl font-semibold">{isEdit ? `Editar: ${brand!.name}` : 'Nueva marca'}</h1>

                {flash?.success && (
                    <div className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700">{flash.success}</div>
                )}

                <form onSubmit={submit} className="flex flex-col gap-4">
                    <div className="grid gap-2">
                        <Label>Nombre *</Label>
                        <Input value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} required />
                    </div>

                    <div className="grid gap-2">
                        <Label>Logo</Label>
                        {data.logo_path && (
                            <div className="relative w-fit">
                                <img src={data.logo_path} className="h-16 w-auto object-contain rounded border p-2" alt="" />
                                <button type="button" onClick={() => setData({ ...data, logo_path: null })} className="absolute -right-2 -top-2 flex size-6 items-center justify-center rounded-full bg-destructive text-white" title="Quitar logo">
                                    <X className="size-3.5" />
                                </button>
                            </div>
                        )}
                        <Input type="file" accept="image/*" disabled={uploadingLogo} onChange={(e) => handlePickLogo(e.target.files?.[0] ?? null)} />
                        {uploadingLogo && <p className="text-xs text-muted-foreground">Subiendo logo…</p>}
                    </div>

                    <div className="flex items-center gap-3">
                        <Checkbox id="is_active" checked={data.is_active} onCheckedChange={(v) => setData({ ...data, is_active: !!v })} />
                        <Label htmlFor="is_active">Activa</Label>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <Button type="submit" disabled={processing || uploadingLogo}>
                            {processing ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear marca'}
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/admin/brands">Cancelar</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
