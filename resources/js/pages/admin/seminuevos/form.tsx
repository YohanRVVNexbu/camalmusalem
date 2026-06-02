import { Head, Link, router, usePage } from '@inertiajs/react';
import { FileText, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { formatCLP } from '@/lib/format';
import { uploadImageBase64 } from '@/lib/image-upload';
import AdminLayout from '@/layouts/admin-layout';

type SpecRow = { label: string; value: string };
type Download = { label: string; url: string };
type Specs = { general: SpecRow[]; equipment: SpecRow[]; downloads: Download[] };
type NewDownload = { label: string; file: File | null };

type BranchLite = { id: number; name: string; city: string | null };

type Seminuevo = {
    id?: number; brand: string; model: string; vu_code: string | null; slug: string | null; year: number; km: number;
    price: string; price_offer: string | null; down_payment: string | null;
    fuel: string | null; transmission: string | null; traction: string | null;
    doors: number; seats: number; color: string | null; description: string | null;
    gallery: string[]; featured_gallery: string[]; specs: Specs | null;
    is_visible: boolean; certified: boolean; order: number;
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
            brand: 'Toyota', model: '', vu_code: null, slug: null, year: new Date().getFullYear(), km: 0,
            price: '', price_offer: null, down_payment: null, fuel: null, transmission: null, traction: null,
            doors: 5, seats: 5, color: null, description: null,
            gallery: [], featured_gallery: [], specs: null, is_visible: true, certified: false, order: 0,
            branch_id: null,
        };
        return { ...base, specs: normalizeSpecs(base.specs) };
    });
    const specs = data.specs ?? emptySpecs();

    const [uploadingGallery, setUploadingGallery] = useState(0);
    const [uploadingFeatured, setUploadingFeatured] = useState(0);
    const [newDownloads, setNewDownloads] = useState<NewDownload[]>([]);
    const [removedDownloads, setRemovedDownloads] = useState<string[]>([]);
    const [processing, setProcessing] = useState(false);

    // Sube las imágenes vía Base64 al elegirlas (sortea el 403 del WAF en
    // multipart) y agrega las URLs al array correspondiente.
    const handlePickGallery = async (files: File[], target: 'gallery' | 'featured_gallery') => {
        if (files.length === 0) return;
        const setUploading = target === 'gallery' ? setUploadingGallery : setUploadingFeatured;
        const subdir = target === 'gallery' ? 'gallery' : 'featured';
        setUploading((c) => c + files.length);
        for (const file of files) {
            try {
                const url = await uploadImageBase64(file, `seminuevos/${seminuevo?.id ?? 'new'}/${subdir}`);
                setData((d) => ({ ...d, [target]: [...((d as any)[target] ?? []), url] }));
            } catch (err) {
                console.error('Falló subir imagen de seminuevo:', err);
                toast.error('No se pudo subir una imagen. ' + (err instanceof Error ? err.message : ''));
            } finally {
                setUploading((c) => c - 1);
            }
        }
    };

    const set = (field: keyof Seminuevo, val: any) => setData({ ...data, [field]: val });
    const setSpecs = (section: keyof Specs, rows: any) =>
        set('specs', { ...specs, [section]: rows });

    const moveGallery = (i: number, dir: -1 | 1) => {
        const arr = [...(data.gallery ?? [])];
        const j = i + dir;
        if (j < 0 || j >= arr.length) return;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        setData({ ...data, gallery: arr });
    };
    const moveFeatured = (i: number, dir: -1 | 1) => {
        const arr = [...(data.featured_gallery ?? [])];
        const j = i + dir;
        if (j < 0 || j >= arr.length) return;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        setData({ ...data, featured_gallery: arr });
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        const formData = new FormData();
        const fields: (keyof Seminuevo)[] = [
            'brand', 'model', 'vu_code', 'slug', 'year', 'km', 'price', 'price_offer', 'down_payment',
            'fuel', 'transmission', 'traction', 'doors', 'seats', 'color', 'description', 'is_visible', 'certified', 'order', 'branch_id',
        ];
        fields.forEach((f) => formData.append(f as string, String(data[f] ?? '')));
        formData.set('is_visible', data.is_visible ? '1' : '0');
        formData.set('certified', data.certified ? '1' : '0');
        formData.append('specs', JSON.stringify(specs));

        // Gallery + featured ya son arrays finales de URLs (subidas vía Base64).
        // El backend hace diff vs lo que tiene en BD para borrar los archivos
        // que el admin quitó.
        (data.gallery ?? []).forEach((u) => formData.append('gallery_order[]', u));
        (data.featured_gallery ?? []).forEach((u) => formData.append('featured_order[]', u));

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
                    <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
                        <div className="flex items-center space-x-3">
                            <Checkbox checked={data.is_visible} onCheckedChange={(v) => set('is_visible', !!v)} />
                            <Label>Publicado</Label>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Checkbox checked={data.certified} onCheckedChange={(v) => set('certified', !!v)} />
                            <Label>Seminuevo Certificado Toyota Musalem <span className="text-muted-foreground text-xs">(muestra el distintivo en el vehículo)</span></Label>
                        </div>
                    </div>
                    <Separator />

                    {/* Basic fields */}
                    <div className="grid grid-cols-4 gap-4">
                        <div className="grid gap-2">
                            <Label>Marca *</Label>
                            <Input value={data.brand} onChange={(e) => set('brand', e.target.value)} required />
                        </div>
                        <div className="col-span-2 grid gap-2">
                            <Label>Modelo *</Label>
                            <Input value={data.model} onChange={(e) => set('model', e.target.value)} required />
                        </div>
                        <div className="grid gap-2">
                            <Label>VU (código único)</Label>
                            <Input
                                value={data.vu_code ?? ''}
                                onChange={(e) => set('vu_code', e.target.value || null)}
                                placeholder="Ej: VU-2024-001"
                            />
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
                            <Label>*Precio *</Label>
                            <Input
                                value={formatCLP(data.price)}
                                onChange={(e) => set('price', e.target.value.replace(/[^0-9]/g, ''))}
                                placeholder="$ 15.000.000"
                                inputMode="numeric"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>*Precio con Financiamiento</Label>
                            <Input
                                value={formatCLP(data.down_payment)}
                                onChange={(e) => set('down_payment', e.target.value.replace(/[^0-9]/g, '') || null)}
                                placeholder="$ 14.500.000"
                                inputMode="numeric"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>Precio oferta <span className="text-muted-foreground text-xs">(opcional — para campañas con descuento)</span></Label>
                            <Input
                                value={formatCLP(data.price_offer)}
                                onChange={(e) => set('price_offer', e.target.value.replace(/[^0-9]/g, '') || null)}
                                placeholder="$ 13.990.000"
                                inputMode="numeric"
                            />
                            {data.price_offer && <p className="text-xs text-muted-foreground">Se mostrará como precio rebajado y el precio normal aparecerá tachado.</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label>Combustible</Label>
                            <Select value={data.fuel ?? ''} onValueChange={(v) => set('fuel', v)}>
                                <SelectTrigger><SelectValue placeholder="Seleccionar…" /></SelectTrigger>
                                <SelectContent>
                                    {data.fuel && !['Gasolina', 'Diésel', 'Eléctrico', 'Híbrido'].includes(data.fuel) && (
                                        <SelectItem value={data.fuel}>{data.fuel} (importado)</SelectItem>
                                    )}
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
                                    {data.transmission && !['Automática', 'Manual', 'CVT', 'ECVT'].includes(data.transmission) && (
                                        <SelectItem value={data.transmission}>{data.transmission} (importado)</SelectItem>
                                    )}
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
                                    {data.traction && !['4x2', '4x4', 'AWD', 'FWD', 'RWD'].includes(data.traction) && (
                                        <SelectItem value={data.traction}>{data.traction} (importado)</SelectItem>
                                    )}
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
                            <>
                                <p className="text-sm text-muted-foreground">La <strong>primera foto</strong> es la <strong>portada</strong> (la que aparece en el card del listado). Usá las flechas <strong>← →</strong> bajo cada foto para reordenar.</p>
                                <div className="flex flex-wrap gap-3">
                                    {data.gallery.map((url, i) => (
                                        <div key={url} className="flex flex-col items-center gap-1">
                                            <div className={`relative ${i === 0 ? 'ring-2 ring-primary' : ''} rounded-lg`}>
                                                <img src={url} className="h-24 w-32 rounded-lg object-cover" alt="" />
                                                {i === 0 && (
                                                    <span className="absolute left-1 top-1 rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold uppercase leading-none text-primary-foreground">Portada</span>
                                                )}
                                                <button type="button" onClick={() => {
                                                    setData({ ...data, gallery: data.gallery.filter((u) => u !== url) });
                                                }} className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-destructive text-white text-xs">✕</button>
                                            </div>
                                            <div className="flex w-32 items-stretch gap-1">
                                                <button type="button" onClick={() => moveGallery(i, -1)} disabled={i === 0} className="flex flex-1 items-center justify-center rounded-md border bg-background py-1 text-base leading-none hover:bg-muted disabled:opacity-30" title="Mover a la izquierda">←</button>
                                                <button type="button" onClick={() => moveGallery(i, 1)} disabled={i === data.gallery.length - 1} className="flex flex-1 items-center justify-center rounded-md border bg-background py-1 text-base leading-none hover:bg-muted disabled:opacity-30" title="Mover a la derecha">→</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                        <Input
                            type="file"
                            accept="image/*"
                            multiple
                            disabled={uploadingGallery > 0}
                            onChange={(e) => {
                                const files = Array.from(e.target.files ?? []);
                                handlePickGallery(files, 'gallery');
                                e.target.value = '';
                            }}
                        />
                        {uploadingGallery > 0 && <p className="text-xs text-muted-foreground">Subiendo {uploadingGallery} imagen{uploadingGallery === 1 ? '' : 'es'}…</p>}
                    </div>

                    {/* Featured gallery */}
                    <div className="grid gap-2">
                        <Label className="text-base font-semibold">Fotos destacadas (sección inferior)</Label>
                        <p className="text-sm text-muted-foreground">Fotos grandes que aparecen debajo del carrusel en la vista del vehículo. Usá las flechas <strong>← →</strong> bajo cada foto para reordenarlas.</p>
                        {(data.featured_gallery ?? []).length > 0 && (
                            <div className="flex flex-wrap gap-3">
                                {data.featured_gallery.map((url, i) => (
                                    <div key={url} className="flex flex-col items-center gap-1">
                                        <div className="relative">
                                            <img src={url} className="h-24 w-32 rounded-lg object-cover" alt="" />
                                            <button type="button" onClick={() => {
                                                setData({ ...data, featured_gallery: data.featured_gallery.filter((u) => u !== url) });
                                            }} className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-destructive text-white text-xs">✕</button>
                                        </div>
                                        <div className="flex w-32 items-stretch gap-1">
                                            <button type="button" onClick={() => moveFeatured(i, -1)} disabled={i === 0} className="flex flex-1 items-center justify-center rounded-md border bg-background py-1 text-base leading-none hover:bg-muted disabled:opacity-30" title="Mover a la izquierda">←</button>
                                            <button type="button" onClick={() => moveFeatured(i, 1)} disabled={i === data.featured_gallery.length - 1} className="flex flex-1 items-center justify-center rounded-md border bg-background py-1 text-base leading-none hover:bg-muted disabled:opacity-30" title="Mover a la derecha">→</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        <Input
                            type="file"
                            accept="image/*"
                            multiple
                            disabled={uploadingFeatured > 0}
                            onChange={(e) => {
                                const files = Array.from(e.target.files ?? []);
                                handlePickGallery(files, 'featured_gallery');
                                e.target.value = '';
                            }}
                        />
                        {uploadingFeatured > 0 && <p className="text-xs text-muted-foreground">Subiendo {uploadingFeatured} imagen{uploadingFeatured === 1 ? '' : 'es'}…</p>}
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
