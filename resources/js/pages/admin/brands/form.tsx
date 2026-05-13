import { Head, Link, router, usePage } from '@inertiajs/react';
import { X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [removeLogo, setRemoveLogo] = useState(false);
    const [processing, setProcessing] = useState(false);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('is_active', data.is_active ? '1' : '0');
        if (logoFile) formData.append('logo', logoFile);
        if (removeLogo && !logoFile) formData.append('logo_remove', '1');
        if (isEdit) formData.append('_method', 'PUT');

        router.post(
            isEdit ? `/admin/brands/${brand!.id}` : '/admin/brands',
            formData,
            { forceFormData: true, onFinish: () => setProcessing(false) },
        );
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
                        {logoFile ? (
                            <div className="relative w-fit">
                                <img src={URL.createObjectURL(logoFile)} className="h-16 w-auto object-contain rounded border p-2" alt="" />
                                <button type="button" onClick={() => setLogoFile(null)} className="absolute -right-2 -top-2 flex size-6 items-center justify-center rounded-full bg-destructive text-white" title="Quitar selección">
                                    <X className="size-3.5" />
                                </button>
                            </div>
                        ) : data.logo_path && !removeLogo ? (
                            <div className="relative w-fit">
                                <img src={data.logo_path} className="h-16 w-auto object-contain rounded border p-2" alt="" />
                                <button type="button" onClick={() => setRemoveLogo(true)} className="absolute -right-2 -top-2 flex size-6 items-center justify-center rounded-full bg-destructive text-white" title="Eliminar logo">
                                    <X className="size-3.5" />
                                </button>
                            </div>
                        ) : removeLogo ? (
                            <p className="text-sm text-destructive">Logo marcado para eliminar al guardar.{' '}
                                <button type="button" className="underline" onClick={() => setRemoveLogo(false)}>Cancelar</button>
                            </p>
                        ) : null}
                        <Input type="file" accept="image/*" onChange={(e) => { setLogoFile(e.target.files?.[0] ?? null); setRemoveLogo(false); }} />
                    </div>

                    <div className="flex items-center gap-3">
                        <Checkbox id="is_active" checked={data.is_active} onCheckedChange={(v) => setData({ ...data, is_active: !!v })} />
                        <Label htmlFor="is_active">Activa</Label>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <Button type="submit" disabled={processing}>
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
