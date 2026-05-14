import { Head, Link, router, usePage } from '@inertiajs/react';
import { FileText, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { formatCLP } from '@/lib/format';
import AdminLayout from '@/layouts/admin-layout';

type SpecRow = { label: string; value: string };
type Download = { label: string; url: string };
type Specs = { general: SpecRow[]; equipment: SpecRow[]; downloads: Download[] };
type NewDownload = { label: string; file: File | null };

type BranchLite = { id: number; name: string; city: string | null };

type Seminuevo = {
    id?: number; brand: string; model: string; slug: string | null; year: number; km: number;
    price: string; down_payment: string | null;
    fuel: string | null; transmission: string | null; traction: string | null;
    doors: number; seats: number; color: string | null; description: string | null;
    gallery: string[]; featured_gallery: string[]; specs: Specs | null;
    is_visible: boolean; order: number;
    branch_id: number | null;
};

const emptySpecs = (): Specs => ({
    general: [
        { label: 'Motor', value: '' },
        { label: 'Rendimiento', value: '' },
    ],
    equipment: [{ label: '', value: '' }],
    downloads: [],
});

const normalizeSpecs = (raw: any): Specs => {
    if (!raw) return emptySpecs();
    if (Array.isArray(raw.general) && Array.isArray(raw.equipment)) return raw as Specs;
    // Objeto plano proveniente del importador {"ABS": true, "Bluetooth": true, ...}
    const equipment = Object.entries(raw)
        .filter(([k]) => k !== 'downloads')
        .map(([label, v]) => ({ label, value: v ? 'Sí' : 'No' }));
    return {
        general: emptySpecs().general,
        equipment: equipment.length > 0 ? equipment : emptySpecs().equipment,
        downloads: Array.isArray(raw.downloads) ? raw.downloads : [],
    };
};

function SpecsSection({
    title,
    rows,
    onChange,
}: {
    title: string;
    rows: SpecRow[];
    onChange: (rows: SpecRow[]) => void;
}) {
    const update = (i: number, field: keyof SpecRow, val: string) => {
        const next = rows.map((r, idx) => idx === i ? { ...r, [field]: val } : r);
        onChange(next);
    };
    const add = () => onChange([...rows, { label: '', value: '' }]);
    const remove = (i: number) => onChange(rows.filter((_, idx) => idx !== i));

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold">{title}</Label>
                <Button type="button" size="sm" variant="outline" onClick={add}>
                    <Plus className="mr-1 size-3" /> Agregar fila
                </Button>
            </div>
            {rows.map((row, i) => (
                <div key={i} className="flex items-center gap-2">
                    <Input
                        placeholder="Etiqueta"
                        value={row.label}
                        onChange={(e) => update(i, 'label', e.target.value)}
                        className="w-40"
                    />
                    <Input
                        placeholder="Valor"
                        value={row.value}
                        onChange={(e) => update(i, 'value', e.target.value)}
                        className="flex-1"
                    />
                    <Button type="button" size="sm" variant="ghost" onClick={() => remove(i)}>
                        <Trash2 className="size-4 text-destructive" />
                    </Button>
                </div>
            ))}
        </div>
    );
}

function DownloadsSection({
    existing,
    onChangeExisting,
    newItems,
    onChangeNew,
    removed,
    onChangeRemoved,
}: {
    existing: Download[];
    onChangeExisting: (rows: Download[]) => void;
    newItems: NewDownload[];
    onChangeNew: (rows: NewDownload[]) => void;
    removed: string[];
    onChangeRemoved: (urls: string[]) => void;
}) {
    const updateExisting = (i: number, label: string) => {
        onChangeExisting(existing.map((r, idx) => (idx === i ? { ...r, label } : r)));
    };
    const removeExisting = (i: number) => {
        const url = existing[i].url;
        onChangeExisting(existing.filter((_, idx) => idx !== i));
        if (url) onChangeRemoved([...removed, url]);
    };
    const updateNew = (i: number, patch: Partial<NewDownload>) => {
        onChangeNew(newItems.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
    };
    const addNew = () => onChangeNew([...newItems, { label: '', file: null }]);
    const removeNew = (i: number) => onChangeNew(newItems.filter((_, idx) => idx !== i));

    const fileName = (url: string) => url.split('/').pop() ?? url;

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
                <div>
                    <Label className="text-sm font-semibold">Descargables</Label>
                    <p className="text-xs text-muted-foreground">Archivos (PDF, imágenes, etc.) que el usuario podrá descargar desde la ficha.</p>
                </div>
                <Button type="button" size="sm" variant="outline" onClick={addNew}>
                    <Plus className="mr-1 size-3" /> Agregar archivo
                </Button>
            </div>

            {/* Archivos ya subidos */}
            {existing.map((row, i) => (
                <div key={`ex-${i}`} className="flex items-center gap-2 rounded-md border p-2">
                    <Input
                        placeholder="Etiqueta (ej: Ficha técnica.pdf)"
                        value={row.label}
                        onChange={(e) => updateExisting(i, e.target.value)}
                        className="flex-1"
                    />
                    <a
                        href={row.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground"
                        title={row.url}
                    >
                        <FileText className="size-4" />
                        {fileName(row.url)}
                    </a>
                    <Button type="button" size="sm" variant="ghost" onClick={() => removeExisting(i)}>
                        <Trash2 className="size-4 text-destructive" />
                    </Button>
                </div>
            ))}

            {/* Nuevos para subir */}
            {newItems.map((row, i) => (
                <div key={`new-${i}`} className="flex items-center gap-2 rounded-md border border-dashed p-2">
                    <Input
                        placeholder="Etiqueta (ej: Manual del propietario)"
                        value={row.label}
                        onChange={(e) => updateNew(i, { label: e.target.value })}
                        className="w-64"
                    />
                    <Input
                        type="file"
                        className="flex-1"
                        onChange={(e) => updateNew(i, { file: e.target.files?.[0] ?? null })}
                    />
                    <Button type="button" size="sm" variant="ghost" onClick={() => removeNew(i)}>
                        <Trash2 className="size-4 text-destructive" />
                    </Button>
                </div>
            ))}

            {existing.length === 0 && newItems.length === 0 && (
                <p className="text-xs text-muted-foreground py-2">Sin archivos descargables.</p>
            )}
        </div>
    );
}

export default function SeminuevoForm({ seminuevo, branches = [] }: { seminuevo: Seminuevo | null; branches?: BranchLite[] }) {
    const { flash } = usePage<{ flash: { success?: string } }>().props;
    const isEdit = !!seminuevo?.id;

    const [data, setData] = useState<Seminuevo>(() => {
        const base = seminuevo ?? {
            brand: 'Toyota', model: '', slug: null, year: new Date().getFullYear(), km: 0,
            price: '', down_payment: null, fuel: null, transmission: null, traction: null,
            doors: 5, seats: 5, color: null, description: null,
            gallery: [], featured_gallery: [], specs: null, is_visible: true, order: 0,
            branch_id: null,
        };
        return { ...base, specs: normalizeSpecs(base.specs) };
    });
    const specs = data.specs ?? emptySpecs();

    const [newGallery, setNewGallery] = useState<File[]>([]);
    const [removeGallery, setRemoveGallery] = useState<string[]>([]);
    const [newFeatured, setNewFeatured] = useState<File[]>([]);
    const [removeFeatured, setRemoveFeatured] = useState<string[]>([]);
    const [newDownloads, setNewDownloads] = useState<NewDownload[]>([]);
    const [removedDownloads, setRemovedDownloads] = useState<string[]>([]);
    const [processing, setProcessing] = useState(false);

    const set = (field: keyof Seminuevo, val: any) => setData({ ...data, [field]: val });
    const setSpecs = (section: keyof Specs, rows: any) =>
        set('specs', { ...specs, [section]: rows });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        const formData = new FormData();
        const fields: (keyof Seminuevo)[] = [
            'brand', 'model', 'slug', 'year', 'km', 'price', 'down_payment',
            'fuel', 'transmission', 'traction', 'doors', 'seats', 'color', 'description', 'is_visible', 'order', 'branch_id',
        ];
        fields.forEach((f) => formData.append(f as string, String(data[f] ?? '')));
        formData.set('is_visible', data.is_visible ? '1' : '0');
        formData.append('specs', JSON.stringify(specs));

        newGallery.forEach((f) => formData.append('gallery_new[]', f));
        removeGallery.forEach((u) => formData.append('gallery_remove[]', u));
        newFeatured.forEach((f) => formData.append('featured_new[]', f));
        removeFeatured.forEach((u) => formData.append('featured_remove[]', u));

        newDownloads.forEach((d, i) => {
            if (d.file) {
                formData.append(`downloads_new[${i}][label]`, d.label);
                formData.append(`downloads_new[${i}][file]`, d.file);
            }
        });
        removedDownloads.forEach((u) => formData.append('downloads_remove[]', u));

        if (isEdit) formData.append('_method', 'PUT');

        router.post(isEdit ? `/admin/seminuevos/${seminuevo!.id}` : '/admin/seminuevos', formData, {
            forceFormData: true, onFinish: () => setProcessing(false),
        });
    };

    return (
        <AdminLayout breadcrumbs={[{ title: 'Dashboard', href: '/admin' }, { title: 'Seminuevos', href: '/admin/seminuevos' }, { title: isEdit ? 'Editar' : 'Crear', href: '#' }]}>
            <Head title={`Admin — ${isEdit ? 'Editar' : 'Crear'} seminuevo`} />
            <div className="flex flex-col gap-4 p-4">
                <h1 className="text-2xl font-semibold">{isEdit ? `Editar: ${seminuevo!.brand} ${seminuevo!.model}` : 'Nuevo seminuevo'}</h1>
                {flash?.success && <div className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700">{flash.success}</div>}

                <form onSubmit={submit} className="flex flex-col gap-6">
                    <div className="flex items-center space-x-3">
                        <Checkbox checked={data.is_visible} onCheckedChange={(v) => set('is_visible', !!v)} />
                        <Label>Publicado</Label>
                    </div>
                    <Separator />

                    {/* Basic fields */}
                    <div className="grid grid-cols-4 gap-4">
                        <div className="grid gap-2">
                            <Label>Marca *</Label>
                            <Input value={data.brand} onChange={(e) => set('brand', e.target.value)} required />
                        </div>
                        <div className="col-span-3 grid gap-2">
                            <Label>Modelo *</Label>
                            <Input value={data.model} onChange={(e) => set('model', e.target.value)} required />
                        </div>
                        <div className="col-span-4 grid gap-2">
                            <Label>Slug (URL) <span className="text-muted-foreground text-xs">(auto-generado si se deja vacío)</span></Label>
                            <Input value={data.slug ?? ''} onChange={(e) => set('slug', e.target.value)} placeholder="bmw-x1-sdrive-2024" />
                        </div>
                        <div className="grid gap-2">
                            <Label>Año *</Label>
                            <Input type="number" value={data.year} onChange={(e) => set('year', Number(e.target.value))} required min={1990} max={2030} />
                        </div>
                        <div className="grid gap-2">
                            <Label>Km *</Label>
                            <Input type="number" value={data.km} onChange={(e) => set('km', Number(e.target.value))} required min={0} />
                        </div>
                        <div className="grid gap-2">
                            <Label>Precio *</Label>
                            <Input
                                value={formatCLP(data.price)}
                                onChange={(e) => set('price', e.target.value.replace(/[^0-9]/g, ''))}
                                placeholder="$ 15.000.000"
                                inputMode="numeric"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>Pie mínimo</Label>
                            <Input
                                value={formatCLP(data.down_payment)}
                                onChange={(e) => set('down_payment', e.target.value.replace(/[^0-9]/g, '') || null)}
                                placeholder="$ 5.000.000"
                                inputMode="numeric"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>Combustible</Label>
                            <Select value={data.fuel ?? ''} onValueChange={(v) => set('fuel', v)}>
                                <SelectTrigger><SelectValue placeholder="Seleccionar…" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Gasolina">Gasolina</SelectItem>
                                    <SelectItem value="Diésel">Diésel</SelectItem>
                                    <SelectItem value="Eléctrico">Eléctrico</SelectItem>
                                    <SelectItem value="Híbrido">Híbrido</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label>Transmisión</Label>
                            <Select value={data.transmission ?? ''} onValueChange={(v) => set('transmission', v)}>
                                <SelectTrigger><SelectValue placeholder="Seleccionar…" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Automática">Automática</SelectItem>
                                    <SelectItem value="Manual">Manual</SelectItem>
                                    <SelectItem value="CVT">CVT</SelectItem>
                                    <SelectItem value="ECVT">ECVT (Híbrido)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label>Tracción</Label>
                            <Select value={data.traction ?? ''} onValueChange={(v) => set('traction', v)}>
                                <SelectTrigger><SelectValue placeholder="Seleccionar…" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="4x2">4x2</SelectItem>
                                    <SelectItem value="4x4">4x4</SelectItem>
                                    <SelectItem value="AWD">AWD</SelectItem>
                                    <SelectItem value="FWD">FWD</SelectItem>
                                    <SelectItem value="RWD">RWD</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label>Color</Label>
                            <Input value={data.color ?? ''} onChange={(e) => set('color', e.target.value)} />
                        </div>
                        <div className="grid gap-2">
                            <Label>Sucursal</Label>
                            <Select
                                value={data.branch_id ? String(data.branch_id) : 'none'}
                                onValueChange={(v) => set('branch_id', v === 'none' ? null : Number(v))}
                            >
                                <SelectTrigger><SelectValue placeholder="Seleccionar…" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">— Sin asignar —</SelectItem>
                                    {branches.map((b) => (
                                        <SelectItem key={b.id} value={String(b.id)}>
                                            {b.name}{b.city ? ` · ${b.city}` : ''}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {branches.length === 0 && (
                                <p className="text-xs text-muted-foreground">No hay sucursales activas. <Link href="/admin/branches/create" className="underline">Crear una</Link>.</p>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label>Puertas</Label>
                            <Input type="number" value={data.doors} onChange={(e) => set('doors', Number(e.target.value))} min={2} max={6} />
                        </div>
                        <div className="grid gap-2">
                            <Label>Asientos</Label>
                            <Input type="number" value={data.seats} onChange={(e) => set('seats', Number(e.target.value))} min={2} max={9} />
                        </div>
                        <div className="grid gap-2">
                            <Label>Orden</Label>
                            <Input type="number" value={data.order} onChange={(e) => set('order', Number(e.target.value))} />
                        </div>
                        <div className="col-span-4 grid gap-2">
                            <Label>Descripción</Label>
                            <Textarea value={data.description ?? ''} onChange={(e) => set('description', e.target.value)} rows={3} />
                        </div>
                    </div>

                    <Separator />

                    {/* Gallery (carousel) */}
                    <div className="grid gap-2">
                        <Label className="text-base font-semibold">Galería de fotos (carrusel)</Label>
                        {(data.gallery ?? []).length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {data.gallery.map((url) => (
                                    <div key={url} className="relative">
                                        <img src={url} className="h-24 w-32 rounded-lg object-cover" alt="" />
                                        <button type="button" onClick={() => {
                                            setRemoveGallery([...removeGallery, url]);
                                            setData({ ...data, gallery: data.gallery.filter((u) => u !== url) });
                                        }} className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-destructive text-white text-xs">✕</button>
                                    </div>
                                ))}
                            </div>
                        )}
                        <Input type="file" accept="image/*" multiple onChange={(e) => {
                            setNewGallery([...newGallery, ...Array.from(e.target.files ?? [])]);
                            e.target.value = '';
                        }} />
                        {newGallery.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {newGallery.map((f, i) => (
                                    <div key={i} className="relative">
                                        <img src={URL.createObjectURL(f)} className="h-24 w-32 rounded-lg object-cover ring-2 ring-primary" alt="" />
                                        <button type="button" onClick={() => setNewGallery(newGallery.filter((_, j) => j !== i))} className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-destructive text-white text-xs" title="Quitar">✕</button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Featured gallery */}
                    <div className="grid gap-2">
                        <Label className="text-base font-semibold">Fotos destacadas (sección inferior)</Label>
                        <p className="text-sm text-muted-foreground">Fotos grandes que aparecen debajo del carrusel en la vista del vehículo.</p>
                        {(data.featured_gallery ?? []).length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {data.featured_gallery.map((url) => (
                                    <div key={url} className="relative">
                                        <img src={url} className="h-24 w-32 rounded-lg object-cover" alt="" />
                                        <button type="button" onClick={() => {
                                            setRemoveFeatured([...removeFeatured, url]);
                                            setData({ ...data, featured_gallery: data.featured_gallery.filter((u) => u !== url) });
                                        }} className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-destructive text-white text-xs">✕</button>
                                    </div>
                                ))}
                            </div>
                        )}
                        <Input type="file" accept="image/*" multiple onChange={(e) => {
                            setNewFeatured([...newFeatured, ...Array.from(e.target.files ?? [])]);
                            e.target.value = '';
                        }} />
                        {newFeatured.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {newFeatured.map((f, i) => (
                                    <div key={i} className="relative">
                                        <img src={URL.createObjectURL(f)} className="h-24 w-32 rounded-lg object-cover ring-2 ring-primary" alt="" />
                                        <button type="button" onClick={() => setNewFeatured(newFeatured.filter((_, j) => j !== i))} className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-destructive text-white text-xs" title="Quitar">✕</button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <Separator />

                    {/* Specs */}
                    <div className="flex flex-col gap-4">
                        <Label className="text-base font-semibold">Detalles del vehículo (pestañas)</Label>
                        <SpecsSection title="General" rows={specs.general} onChange={(rows) => setSpecs('general', rows)} />
                        <Separator />
                        <SpecsSection title="Equipamiento y seguridad" rows={specs.equipment} onChange={(rows) => setSpecs('equipment', rows)} />
                        <Separator />
                        <DownloadsSection
                            existing={specs.downloads}
                            onChangeExisting={(rows) => setSpecs('downloads', rows)}
                            newItems={newDownloads}
                            onChangeNew={setNewDownloads}
                            removed={removedDownloads}
                            onChangeRemoved={setRemovedDownloads}
                        />
                    </div>

                    <div className="flex gap-3">
                        <Button type="submit" disabled={processing}>{processing ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear seminuevo'}</Button>
                        <Button variant="outline" asChild><Link href="/admin/seminuevos">Cancelar</Link></Button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
