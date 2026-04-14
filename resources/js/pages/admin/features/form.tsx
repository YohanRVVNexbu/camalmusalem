import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AdminLayout from '@/layouts/admin-layout';

type Feature = {
    id?: number;
    code: string;
    name_es: string;
    name_en: string | null;
    category: string;
    data_type: string;
    unit: string | null;
    description: string | null;
    is_active: boolean;
    display_order: number;
};

export default function FeatureForm({
    feature, categories,
}: {
    feature: Feature | null;
    categories: Record<string, string>;
}) {
    const { flash } = usePage<{ flash: { success?: string } }>().props;
    const isEdit = !!feature?.id;

    const [data, setData] = useState<Feature>(feature ?? {
        code: '', name_es: '', name_en: null, category: 'safety',
        data_type: 'boolean', unit: null, description: null,
        is_active: true, display_order: 0,
    });
    const [processing, setProcessing] = useState(false);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        const payload = { ...data, is_active: data.is_active ? 1 : 0 };

        if (isEdit) {
            router.put(`/admin/features/${feature!.id}`, payload as any, { onFinish: () => setProcessing(false) });
        } else {
            router.post('/admin/features', payload as any, { onFinish: () => setProcessing(false) });
        }
    };

    return (
        <AdminLayout breadcrumbs={[
            { title: 'Dashboard', href: '/admin' },
            { title: 'Equipamiento', href: '/admin/features' },
            { title: isEdit ? 'Editar' : 'Crear', href: '#' },
        ]}>
            <Head title={`Admin — ${isEdit ? 'Editar' : 'Crear'} equipamiento`} />
            <div className="flex flex-col gap-4 p-4 max-w-3xl">
                <h1 className="text-2xl font-semibold">{isEdit ? `Editar: ${feature!.name_es}` : 'Nuevo equipamiento'}</h1>

                {flash?.success && (
                    <div className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700">{flash.success}</div>
                )}

                <form onSubmit={submit} className="flex flex-col gap-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label>Nombre (español) *</Label>
                            <Input value={data.name_es} onChange={(e) => setData({ ...data, name_es: e.target.value })} required />
                        </div>
                        <div className="grid gap-2">
                            <Label>Código</Label>
                            <Input
                                value={data.code}
                                onChange={(e) => setData({ ...data, code: e.target.value })}
                                placeholder="Se genera automáticamente si lo dejas vacío"
                                className="font-mono text-sm"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>Categoría *</Label>
                            <Select value={data.category} onValueChange={(v) => setData({ ...data, category: v })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {Object.entries(categories).map(([code, label]) => (
                                        <SelectItem key={code} value={code}>{label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label>Tipo de dato</Label>
                            <Select value={data.data_type} onValueChange={(v) => setData({ ...data, data_type: v })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="boolean">Sí/No (boolean)</SelectItem>
                                    <SelectItem value="int">Número entero</SelectItem>
                                    <SelectItem value="string">Texto</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label>Unidad (opcional)</Label>
                            <Input
                                value={data.unit ?? ''}
                                onChange={(e) => setData({ ...data, unit: e.target.value || null })}
                                placeholder='Ej: "L", "kW", "pulgadas"'
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>Orden</Label>
                            <Input type="number" value={data.display_order} onChange={(e) => setData({ ...data, display_order: Number(e.target.value) })} />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label>Descripción (opcional)</Label>
                        <Textarea
                            rows={3}
                            value={data.description ?? ''}
                            onChange={(e) => setData({ ...data, description: e.target.value || null })}
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <Checkbox id="is_active" checked={data.is_active} onCheckedChange={(v) => setData({ ...data, is_active: !!v })} />
                        <Label htmlFor="is_active">Activa</Label>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear equipamiento'}
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/admin/features">Cancelar</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
