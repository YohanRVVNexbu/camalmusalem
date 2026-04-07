import { Head, Link, router, usePage } from '@inertiajs/react';
import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import AdminLayout from '@/layouts/admin-layout';

type SpecRow = { label: string; value: string };
type PricingRow = { label: string; value: string };
type Version = {
    name: string;
    price: string;
    electric: boolean;
    bonus: string;
    pricing: PricingRow[];
    motor: SpecRow[];
    interior: SpecRow[];
    exterior: SpecRow[];
    seguridad: SpecRow[];
    rendimiento: SpecRow[];
};

type Vehicle = {
    id?: number;
    name: string;
    full_name: string | null;
    subtitle: string | null;
    type: string | null;
    fuel: string | null;
    hero_image: string | null;
    gallery: string[];
    versions: Version[];
    highlights: { title: string; value: string }[];
    is_visible: boolean;
    order: number;
};

const emptyVersion = (): Version => ({
    name: '', price: '', electric: false, bonus: '',
    pricing: [{ label: 'Precio de lista', value: '' }],
    motor: [
        { label: 'Transmisión', value: '' }, { label: 'Combustible', value: '' },
        { label: 'Cilindrada', value: '' }, { label: 'Potencia (HP)', value: '' },
        { label: 'Tracción', value: '' }, { label: 'Puertas', value: '' }, { label: 'Asientos', value: '' },
    ],
    interior: [], exterior: [], seguridad: [], rendimiento: [],
});

export default function VehicleForm({ vehicle }: { vehicle: Vehicle | null }) {
    const { flash } = usePage<{ flash: { success?: string; error?: string } }>().props;
    const isEdit = !!vehicle?.id;

    const [data, setData] = useState<Vehicle>(vehicle ?? {
        name: '', full_name: null, subtitle: null, type: null, fuel: null,
        hero_image: null, gallery: [], versions: [emptyVersion()],
        highlights: [], is_visible: true, order: 0,
    });
    const [heroFile, setHeroFile] = useState<File | null>(null);
    const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
    const [galleryRemove, setGalleryRemove] = useState<string[]>([]);
    const [processing, setProcessing] = useState(false);
    const [expandedVersion, setExpandedVersion] = useState(0);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('full_name', data.full_name ?? '');
        formData.append('subtitle', data.subtitle ?? '');
        formData.append('type', data.type ?? '');
        formData.append('fuel', data.fuel ?? '');
        formData.append('is_visible', data.is_visible ? '1' : '0');
        formData.append('order', String(data.order));
        formData.append('versions', JSON.stringify(data.versions));
        formData.append('highlights', JSON.stringify(data.highlights));
        if (heroFile) formData.append('hero_image', heroFile);
        galleryFiles.forEach((f) => formData.append('gallery_new[]', f));
        galleryRemove.forEach((u) => formData.append('gallery_remove[]', u));
        if (isEdit) formData.append('_method', 'PUT');

        router.post(isEdit ? `/admin/vehicles/${vehicle!.id}` : '/admin/vehicles', formData, {
            forceFormData: true,
            onFinish: () => setProcessing(false),
        });
    };

    const updateVersion = (i: number, field: keyof Version, value: any) => {
        const versions = [...data.versions];
        versions[i] = { ...versions[i], [field]: value };
        setData({ ...data, versions });
    };

    const updateSpecRow = (vIdx: number, tab: keyof Pick<Version, 'motor'|'interior'|'exterior'|'seguridad'|'rendimiento'|'pricing'>, rowIdx: number, field: 'label'|'value', val: string) => {
        const versions = [...data.versions];
        const rows = [...(versions[vIdx][tab] as SpecRow[])];
        rows[rowIdx] = { ...rows[rowIdx], [field]: val };
        versions[vIdx] = { ...versions[vIdx], [tab]: rows };
        setData({ ...data, versions });
    };

    const addSpecRow = (vIdx: number, tab: keyof Pick<Version, 'motor'|'interior'|'exterior'|'seguridad'|'rendimiento'|'pricing'>) => {
        const versions = [...data.versions];
        versions[vIdx] = { ...versions[vIdx], [tab]: [...(versions[vIdx][tab] as SpecRow[]), { label: '', value: '' }] };
        setData({ ...data, versions });
    };

    const removeSpecRow = (vIdx: number, tab: keyof Pick<Version, 'motor'|'interior'|'exterior'|'seguridad'|'rendimiento'|'pricing'>, rowIdx: number) => {
        const versions = [...data.versions];
        versions[vIdx] = { ...versions[vIdx], [tab]: (versions[vIdx][tab] as SpecRow[]).filter((_, i) => i !== rowIdx) };
        setData({ ...data, versions });
    };

    const SpecTable = ({ vIdx, tab, label }: { vIdx: number; tab: keyof Pick<Version, 'motor'|'interior'|'exterior'|'seguridad'|'rendimiento'|'pricing'>; label: string }) => (
        <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
                <Label className="font-semibold">{label}</Label>
                <Button type="button" variant="outline" size="sm" onClick={() => addSpecRow(vIdx, tab)}>
                    <Plus className="size-3 mr-1" /> Fila
                </Button>
            </div>
            {(data.versions[vIdx][tab] as SpecRow[]).map((row, rIdx) => (
                <div key={rIdx} className="flex gap-2">
                    <Input placeholder="Etiqueta" value={row.label} onChange={(e) => updateSpecRow(vIdx, tab, rIdx, 'label', e.target.value)} />
                    <Input placeholder="Valor" value={row.value} onChange={(e) => updateSpecRow(vIdx, tab, rIdx, 'value', e.target.value)} />
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeSpecRow(vIdx, tab, rIdx)}>
                        <Trash2 className="size-4 text-destructive" />
                    </Button>
                </div>
            ))}
        </div>
    );

    return (
        <AdminLayout breadcrumbs={[
            { title: 'Dashboard', href: '/admin' },
            { title: 'Vehículos', href: '/admin/vehicles' },
            { title: isEdit ? 'Editar' : 'Crear', href: '#' },
        ]}>
            <Head title={`Admin — ${isEdit ? 'Editar' : 'Crear'} vehículo`} />
            <div className="flex flex-col gap-4 p-4">
                <h1 className="text-2xl font-semibold">{isEdit ? `Editar: ${vehicle!.name}` : 'Nuevo vehículo'}</h1>

                {flash?.success && (
                    <div className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700">{flash.success}</div>
                )}

                <form onSubmit={submit} className="flex flex-col gap-6">

                    {/* Visibilidad */}
                    <div className="flex items-center space-x-3">
                        <Checkbox id="is_visible" checked={data.is_visible} onCheckedChange={(v) => setData({ ...data, is_visible: !!v })} />
                        <Label htmlFor="is_visible">Publicado</Label>
                    </div>

                    <Separator />

                    {/* Datos básicos */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="grid gap-2">
                            <Label>Nombre *</Label>
                            <Input value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} required />
                        </div>
                        <div className="grid gap-2">
                            <Label>Nombre completo</Label>
                            <Input value={data.full_name ?? ''} onChange={(e) => setData({ ...data, full_name: e.target.value })} />
                        </div>
                        <div className="grid gap-2">
                            <Label>Subtítulo</Label>
                            <Input value={data.subtitle ?? ''} onChange={(e) => setData({ ...data, subtitle: e.target.value })} />
                        </div>
                        <div className="grid gap-2">
                            <Label>Tipo</Label>
                            <Select value={data.type ?? ''} onValueChange={(v) => setData({ ...data, type: v })}>
                                <SelectTrigger><SelectValue placeholder="Seleccionar…" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="SUV">SUV</SelectItem>
                                    <SelectItem value="Sedán">Sedán</SelectItem>
                                    <SelectItem value="Hatchback">Hatchback</SelectItem>
                                    <SelectItem value="Pickup">Pickup</SelectItem>
                                    <SelectItem value="Van">Van</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label>Combustible</Label>
                            <Select value={data.fuel ?? ''} onValueChange={(v) => setData({ ...data, fuel: v })}>
                                <SelectTrigger><SelectValue placeholder="Seleccionar…" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Gasolina">Gasolina</SelectItem>
                                    <SelectItem value="Diésel">Diésel</SelectItem>
                                    <SelectItem value="Híbrido">Híbrido</SelectItem>
                                    <SelectItem value="Híbrido Enchufable">Híbrido Enchufable</SelectItem>
                                    <SelectItem value="Eléctrico">Eléctrico</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label>Orden</Label>
                            <Input type="number" value={data.order} onChange={(e) => setData({ ...data, order: Number(e.target.value) })} />
                        </div>
                    </div>

                    {/* Imagen hero */}
                    <div className="grid gap-2">
                        <Label>Imagen hero</Label>
                        {data.hero_image && !heroFile && (
                            <img src={data.hero_image} className="h-32 w-full rounded-lg object-cover" alt="" />
                        )}
                        <Input type="file" accept="image/*" onChange={(e) => setHeroFile(e.target.files?.[0] ?? null)} />
                    </div>

                    {/* Galería */}
                    <div className="grid gap-2">
                        <Label>Galería</Label>
                        {(data.gallery ?? []).length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {data.gallery.map((url) => (
                                    <div key={url} className="relative">
                                        <img src={url} className="h-24 w-32 rounded-lg object-cover" alt="" />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setGalleryRemove([...galleryRemove, url]);
                                                setData({ ...data, gallery: data.gallery.filter((u) => u !== url) });
                                            }}
                                            className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-destructive text-white text-xs"
                                        >✕</button>
                                    </div>
                                ))}
                            </div>
                        )}
                        <Input type="file" accept="image/*" multiple onChange={(e) => setGalleryFiles(Array.from(e.target.files ?? []))} />
                    </div>

                    {/* Highlights */}
                    <div className="grid gap-2">
                        <div className="flex items-center justify-between">
                            <Label className="font-semibold">Highlights</Label>
                            <Button type="button" variant="outline" size="sm" onClick={() => setData({ ...data, highlights: [...(data.highlights ?? []), { title: '', value: '' }] })}>
                                <Plus className="size-3 mr-1" /> Agregar
                            </Button>
                        </div>
                        {(data.highlights ?? []).map((h, i) => (
                            <div key={i} className="flex gap-2">
                                <Input placeholder="Título" value={h.title} onChange={(e) => {
                                    const highlights = [...data.highlights];
                                    highlights[i] = { ...highlights[i], title: e.target.value };
                                    setData({ ...data, highlights });
                                }} />
                                <Input placeholder="Valor" value={h.value} onChange={(e) => {
                                    const highlights = [...data.highlights];
                                    highlights[i] = { ...highlights[i], value: e.target.value };
                                    setData({ ...data, highlights });
                                }} />
                                <Button type="button" variant="ghost" size="icon" onClick={() => setData({ ...data, highlights: data.highlights.filter((_, j) => j !== i) })}>
                                    <Trash2 className="size-4 text-destructive" />
                                </Button>
                            </div>
                        ))}
                    </div>

                    <Separator />

                    {/* Versiones */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold">Versiones ({data.versions.length})</h2>
                            <Button type="button" variant="outline" onClick={() => setData({ ...data, versions: [...data.versions, emptyVersion()] })}>
                                <Plus className="size-4 mr-1" /> Agregar versión
                            </Button>
                        </div>

                        {data.versions.map((ver, vIdx) => (
                            <div key={vIdx} className="rounded-lg border">
                                <div
                                    className="flex cursor-pointer items-center justify-between p-4"
                                    onClick={() => setExpandedVersion(expandedVersion === vIdx ? -1 : vIdx)}
                                >
                                    <span className="font-medium">{ver.name || `Versión ${vIdx + 1}`}</span>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline">{ver.price || '—'}</Badge>
                                        {data.versions.length > 1 && (
                                            <Button type="button" variant="ghost" size="icon" onClick={(e) => {
                                                e.stopPropagation();
                                                setData({ ...data, versions: data.versions.filter((_, i) => i !== vIdx) });
                                            }}>
                                                <Trash2 className="size-4 text-destructive" />
                                            </Button>
                                        )}
                                    </div>
                                </div>

                                {expandedVersion === vIdx && (
                                    <div className="flex flex-col gap-4 border-t p-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="grid gap-2">
                                                <Label>Nombre versión</Label>
                                                <Input value={ver.name} onChange={(e) => updateVersion(vIdx, 'name', e.target.value)} />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label>Precio</Label>
                                                <Input value={ver.price} onChange={(e) => updateVersion(vIdx, 'price', e.target.value)} />
                                            </div>
                                            <div className="grid gap-2 col-span-2">
                                                <Label>Bono / texto promocional</Label>
                                                <Input value={ver.bonus} onChange={(e) => updateVersion(vIdx, 'bonus', e.target.value)} />
                                            </div>
                                            <div className="flex items-center space-x-3 col-span-2">
                                                <Checkbox checked={ver.electric} onCheckedChange={(v) => updateVersion(vIdx, 'electric', !!v)} />
                                                <Label>Eléctrico</Label>
                                            </div>
                                        </div>

                                        <SpecTable vIdx={vIdx} tab="pricing" label="Precios / financiamiento" />
                                        <SpecTable vIdx={vIdx} tab="motor" label="Motor" />
                                        <SpecTable vIdx={vIdx} tab="interior" label="Interior" />
                                        <SpecTable vIdx={vIdx} tab="exterior" label="Exterior" />
                                        <SpecTable vIdx={vIdx} tab="seguridad" label="Seguridad" />
                                        <SpecTable vIdx={vIdx} tab="rendimiento" label="Rendimiento" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-3">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear vehículo'}
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/admin/vehicles">Cancelar</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
