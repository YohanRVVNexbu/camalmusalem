import { Head, Link, router, usePage } from '@inertiajs/react';
import { Pencil, Plus } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import AdminLayout from '@/layouts/admin-layout';

type BrandLite = { id: number; name: string };

type VehicleModel = {
    id?: number;
    brand_id: number | null;
    name: string;
    slug?: string;
    body_type: string | null;
    segment: string | null;
    generation: string | null;
    description: string | null;
    hero_image: string | null;
    is_active: boolean;
    display_order: number;
};

type VersionLite = {
    id: number;
    trim_name: string;
    model_year: number;
    powertrain_type: string;
    drivetrain: string;
    msrp_clp: number | null;
    is_active: boolean;
};

type Tab = 'basico' | 'versiones';

const POWERTRAIN_LABELS: Record<string, string> = {
    gasoline: 'Gasolina', diesel: 'Diésel', hybrid: 'Híbrido', phev: 'PHEV', bev: 'Eléctrico',
};

export default function VehicleModelForm({
    model, brands, bodyTypes, versions = [],
}: {
    model: VehicleModel | null;
    brands: BrandLite[];
    bodyTypes: Record<string, string>;
    versions?: VersionLite[];
}) {
    const { flash } = usePage<{ flash: { success?: string } }>().props;
    const isEdit = !!model?.id;

    const [data, setData] = useState<VehicleModel>(model ?? {
        brand_id: brands[0]?.id ?? null,
        name: '', body_type: null, segment: null, generation: null,
        description: null, hero_image: null, is_active: true, display_order: 0,
    });
    const [heroFile, setHeroFile] = useState<File | null>(null);
    const [processing, setProcessing] = useState(false);
    const [tab, setTab] = useState<Tab>('basico');

    const submit = (e: React.SyntheticEvent | null, addVersionAfter = false) => {
        e?.preventDefault();
        setProcessing(true);

        const formData = new FormData();
        formData.append('brand_id', String(data.brand_id ?? ''));
        formData.append('name', data.name);
        formData.append('body_type', data.body_type ?? '');
        formData.append('segment', data.segment ?? '');
        formData.append('generation', data.generation ?? '');
        formData.append('description', data.description ?? '');
        formData.append('is_active', data.is_active ? '1' : '0');
        formData.append('display_order', String(data.display_order));
        if (heroFile) formData.append('hero_image', heroFile);
        if (addVersionAfter) formData.append('add_version_after', '1');
        if (isEdit) formData.append('_method', 'PUT');

        router.post(
            isEdit ? `/admin/vehicle-models/${model!.id}` : '/admin/vehicle-models',
            formData,
            { forceFormData: true, onFinish: () => setProcessing(false) },
        );
    };

    return (
        <AdminLayout breadcrumbs={[
            { title: 'Dashboard', href: '/admin' },
            { title: 'Vehículos nuevos', href: '/admin/vehicle-models' },
            { title: isEdit ? 'Editar' : 'Crear', href: '#' },
        ]}>
            <Head title={`Admin — ${isEdit ? 'Editar' : 'Crear'} vehículo`} />
            <div className="flex flex-col gap-4 p-4 max-w-5xl">
                <h1 className="text-2xl font-semibold">{isEdit ? `Editar: ${model!.name}` : 'Nuevo vehículo'}</h1>

                {flash?.success && (
                    <div className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700">{flash.success}</div>
                )}

                {/* Tabs */}
                <div className="flex flex-wrap gap-1 border-b pb-2">
                    <Button
                        type="button"
                        variant={tab === 'basico' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setTab('basico')}
                    >
                        Datos básicos
                    </Button>
                    {isEdit && (
                        <Button
                            type="button"
                            variant={tab === 'versiones' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setTab('versiones')}
                        >
                            Ficha técnica
                            <Badge variant="secondary" className="ml-2">{versions.length}</Badge>
                        </Button>
                    )}
                </div>

                {tab === 'basico' && (
                    <form onSubmit={submit} className="flex flex-col gap-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>Marca *</Label>
                                <Select
                                    value={data.brand_id ? String(data.brand_id) : ''}
                                    onValueChange={(v) => setData({ ...data, brand_id: Number(v) })}
                                >
                                    <SelectTrigger><SelectValue placeholder="Seleccionar marca" /></SelectTrigger>
                                    <SelectContent>
                                        {brands.map((b) => (
                                            <SelectItem key={b.id} value={String(b.id)}>{b.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {brands.length === 0 && (
                                    <p className="text-xs text-muted-foreground">No hay marcas activas. <Link href="/admin/brands/create" className="underline">Crear una</Link>.</p>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <Label>Nombre *</Label>
                                <Input value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} placeholder="Ej: Hilux" required />
                            </div>
                            <div className="grid gap-2">
                                <Label>Tipo de carrocería</Label>
                                <Select
                                    value={data.body_type ?? ''}
                                    onValueChange={(v) => setData({ ...data, body_type: v || null })}
                                >
                                    <SelectTrigger><SelectValue placeholder="Seleccionar…" /></SelectTrigger>
                                    <SelectContent>
                                        {Object.entries(bodyTypes).map(([code, label]) => (
                                            <SelectItem key={code} value={code}>{label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label>Segmento</Label>
                                <Input
                                    value={data.segment ?? ''}
                                    onChange={(e) => setData({ ...data, segment: e.target.value || null })}
                                    placeholder='Ej: "pickup mediano", "SUV compacto"'
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Generación</Label>
                                <Input
                                    value={data.generation ?? ''}
                                    onChange={(e) => setData({ ...data, generation: e.target.value || null })}
                                    placeholder='Ej: "8va gen"'
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Orden de visualización</Label>
                                <Input type="number" value={data.display_order} onChange={(e) => setData({ ...data, display_order: Number(e.target.value) })} />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label>Descripción</Label>
                            <Textarea rows={3} value={data.description ?? ''} onChange={(e) => setData({ ...data, description: e.target.value || null })} />
                        </div>

                        <div className="grid gap-2">
                            <Label>Imagen card</Label>
                            {data.hero_image && !heroFile && (
                                <img src={data.hero_image} className="h-32 w-full rounded-lg object-cover" alt="" />
                            )}
                            <Input type="file" accept="image/*" onChange={(e) => setHeroFile(e.target.files?.[0] ?? null)} />
                        </div>

                        <div className="flex items-center gap-3">
                            <Checkbox id="is_active" checked={data.is_active} onCheckedChange={(v) => setData({ ...data, is_active: !!v })} />
                            <Label htmlFor="is_active">Activo</Label>
                        </div>

                        <div className="flex flex-wrap gap-3 pt-2">
                            <Button type="submit" disabled={processing || !data.brand_id}>
                                {processing ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear vehículo'}
                            </Button>
                            {!isEdit && (
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={(e) => submit(e as any, true)}
                                    disabled={processing || !data.brand_id}
                                >
                                    Crear y agregar ficha técnica
                                </Button>
                            )}
                            <Button variant="outline" asChild>
                                <Link href="/admin/vehicle-models">Cancelar</Link>
                            </Button>
                        </div>
                    </form>
                )}

                {tab === 'versiones' && isEdit && (
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-semibold">Ficha técnica / Versiones</h2>
                                <p className="text-sm text-muted-foreground">
                                    Cada versión (trim) tiene su propia ficha: motor, dimensiones, capacidades, equipamiento, colores.
                                </p>
                            </div>
                            <Button asChild>
                                <Link href={`/admin/vehicle-versions/create?model_id=${model!.id}`}>
                                    <Plus className="mr-1 size-4" />
                                    Nueva versión
                                </Link>
                            </Button>
                        </div>

                        {versions.length === 0 ? (
                            <div className="rounded-lg border border-dashed p-8 text-center">
                                <p className="text-sm text-muted-foreground">
                                    Este vehículo aún no tiene versiones. Agrega la primera para poder completar motor, equipamiento, etc.
                                </p>
                                <Button asChild className="mt-4">
                                    <Link href={`/admin/vehicle-versions/create?model_id=${model!.id}`}>
                                        <Plus className="mr-1 size-4" /> Crear primera versión
                                    </Link>
                                </Button>
                            </div>
                        ) : (
                            <div className="rounded-lg border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Trim</TableHead>
                                            <TableHead>Año</TableHead>
                                            <TableHead>Propulsión</TableHead>
                                            <TableHead>Tracción</TableHead>
                                            <TableHead>Precio lista</TableHead>
                                            <TableHead>Estado</TableHead>
                                            <TableHead className="text-right">Editar ficha</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {versions.map((v) => (
                                            <TableRow key={v.id}>
                                                <TableCell className="font-medium">{v.trim_name}</TableCell>
                                                <TableCell>{v.model_year}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">{POWERTRAIN_LABELS[v.powertrain_type] ?? v.powertrain_type}</Badge>
                                                </TableCell>
                                                <TableCell className="uppercase text-xs">{v.drivetrain}</TableCell>
                                                <TableCell>{v.msrp_clp ? `$${v.msrp_clp.toLocaleString('es-CL')}` : '—'}</TableCell>
                                                <TableCell>
                                                    <Badge variant={v.is_active ? 'default' : 'secondary'}>
                                                        {v.is_active ? 'Activa' : 'Inactiva'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="ghost" size="sm" asChild>
                                                        <Link href={`/admin/vehicle-versions/${v.id}/edit`}>
                                                            <Pencil className="mr-1 size-3" /> Editar
                                                        </Link>
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
