import { Head, Link, router, usePage } from '@inertiajs/react';
import { Pencil, Plus, Trash2, X } from 'lucide-react';
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

type HighlightSlide = { image: string | null; title: string; text: string };
type ColorSet = { name: string; hex: string | null; photos: string[] };
type TextBlock = { key: string; title: string; text: string };

type DetailContent = {
    hero: { tagline: string; description: string };
    highlights: HighlightSlide[];
    viewer_360: { colors: ColorSet[]; text_blocks: TextBlock[] };
};

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
    datasheet_url: string | null;
    detail_content: DetailContent | null;
    is_active: boolean;
    display_order: number;
};

const defaultDetail = (): DetailContent => ({
    hero: { tagline: 'Desde', description: '' },
    highlights: [],
    viewer_360: {
        colors: [],
        text_blocks: [
            { key: 'seguridad', title: 'Seguridad', text: '' },
            { key: 'conectividad', title: 'Conectividad', text: '' },
            { key: 'performance', title: 'Performance', text: '' },
            { key: 'autonomia', title: 'Autonomía', text: '' },
        ],
    },
});

type VersionLite = {
    id: number;
    trim_name: string;
    model_year: number;
    powertrain_type: string;
    drivetrain: string;
    msrp_clp: number | null;
    is_active: boolean;
};

type Tab = 'basico' | 'detalle' | 'versiones';

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

    const [data, setData] = useState<VehicleModel>(() => {
        const base = model ?? {
            brand_id: brands[0]?.id ?? null,
            name: '', body_type: null, segment: null, generation: null,
            description: null, hero_image: null, datasheet_url: null,
            detail_content: null,
            is_active: true, display_order: 0,
        };
        return { ...base, detail_content: base.detail_content ?? defaultDetail() };
    });
    const [heroFile, setHeroFile] = useState<File | null>(null);
    const [removeHero, setRemoveHero] = useState(false);
    const [detailFiles, setDetailFiles] = useState<Record<string, File>>({});
    const [processing, setProcessing] = useState(false);
    const [tab, setTab] = useState<Tab>('basico');

    const detail = data.detail_content ?? defaultDetail();
    const setDetail = (patch: Partial<DetailContent>) =>
        setData({ ...data, detail_content: { ...detail, ...patch } });

    // Highlights helpers
    const addHighlight = () => setDetail({
        highlights: [...detail.highlights, { image: null, title: '', text: '' }],
    });
    const updateHighlight = (i: number, patch: Partial<HighlightSlide>) => {
        const next = [...detail.highlights];
        next[i] = { ...next[i], ...patch };
        setDetail({ highlights: next });
    };
    const removeHighlight = (i: number) => {
        setDetail({ highlights: detail.highlights.filter((_, j) => j !== i) });
    };

    // Colors (360) helpers
    const addColor = () => setDetail({
        viewer_360: {
            ...detail.viewer_360,
            colors: [...detail.viewer_360.colors, { name: '', hex: '#FFFFFF', photos: [] }],
        },
    });
    const updateColor = (i: number, patch: Partial<ColorSet>) => {
        const next = [...detail.viewer_360.colors];
        next[i] = { ...next[i], ...patch };
        setDetail({ viewer_360: { ...detail.viewer_360, colors: next } });
    };
    const removeColor = (i: number) => {
        setDetail({
            viewer_360: {
                ...detail.viewer_360,
                colors: detail.viewer_360.colors.filter((_, j) => j !== i),
            },
        });
    };
    const addColorPhotoSlot = (colorIdx: number) => {
        const next = [...detail.viewer_360.colors];
        next[colorIdx] = { ...next[colorIdx], photos: [...next[colorIdx].photos, ''] };
        setDetail({ viewer_360: { ...detail.viewer_360, colors: next } });
    };
    const removeColorPhoto = (colorIdx: number, photoIdx: number) => {
        const next = [...detail.viewer_360.colors];
        next[colorIdx] = {
            ...next[colorIdx],
            photos: next[colorIdx].photos.filter((_, j) => j !== photoIdx),
        };
        setDetail({ viewer_360: { ...detail.viewer_360, colors: next } });
        setDetailFiles((f) => {
            const { [`detail_content.viewer_360.colors.${colorIdx}.photos.${photoIdx}`]: _removed, ...rest } = f;
            return rest;
        });
    };

    // Text blocks helpers
    const addTextBlock = () => setDetail({
        viewer_360: {
            ...detail.viewer_360,
            text_blocks: [...detail.viewer_360.text_blocks, { key: '', title: '', text: '' }],
        },
    });
    const updateTextBlock = (i: number, patch: Partial<TextBlock>) => {
        const next = [...detail.viewer_360.text_blocks];
        next[i] = { ...next[i], ...patch };
        setDetail({ viewer_360: { ...detail.viewer_360, text_blocks: next } });
    };
    const removeTextBlock = (i: number) => {
        setDetail({
            viewer_360: {
                ...detail.viewer_360,
                text_blocks: detail.viewer_360.text_blocks.filter((_, j) => j !== i),
            },
        });
    };

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
        formData.append('datasheet_url', data.datasheet_url ?? '');
        formData.append('is_active', data.is_active ? '1' : '0');
        formData.append('display_order', String(data.display_order));
        if (heroFile) formData.append('hero_image', heroFile);
        if (removeHero && !heroFile) formData.append('hero_image_remove', '1');
        if (addVersionAfter) formData.append('add_version_after', '1');

        // detail_content serializado
        formData.append('detail_content[hero][tagline]', detail.hero.tagline);
        formData.append('detail_content[hero][description]', detail.hero.description);
        detail.highlights.forEach((h, i) => {
            if (h.image) formData.append(`detail_content[highlights][${i}][image]`, h.image);
            formData.append(`detail_content[highlights][${i}][title]`, h.title);
            formData.append(`detail_content[highlights][${i}][text]`, h.text);
        });
        detail.viewer_360.colors.forEach((c, i) => {
            formData.append(`detail_content[viewer_360][colors][${i}][name]`, c.name);
            formData.append(`detail_content[viewer_360][colors][${i}][hex]`, c.hex ?? '');
            c.photos.forEach((p, j) => {
                if (p) formData.append(`detail_content[viewer_360][colors][${i}][photos][${j}]`, p);
            });
        });
        detail.viewer_360.text_blocks.forEach((b, i) => {
            formData.append(`detail_content[viewer_360][text_blocks][${i}][key]`, b.key);
            formData.append(`detail_content[viewer_360][text_blocks][${i}][title]`, b.title);
            formData.append(`detail_content[viewer_360][text_blocks][${i}][text]`, b.text);
        });

        // Archivos nested de detail_content (usan la misma clave que espera el controller)
        Object.entries(detailFiles).forEach(([key, file]) => {
            formData.append(key, file);
        });

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
                    <Button
                        type="button"
                        variant={tab === 'detalle' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setTab('detalle')}
                    >
                        Página de detalle
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
                            <Label>URL ficha técnica (PDF descargable)</Label>
                            <Input
                                type="url"
                                value={data.datasheet_url ?? ''}
                                onChange={(e) => setData({ ...data, datasheet_url: e.target.value || null })}
                                placeholder="https://www.toyota.cl/.../ficha-corolla.pdf"
                            />
                            <p className="text-xs text-muted-foreground">
                                Si está completo, en el hero del detalle aparece el botón "Descargar ficha técnica" que abre/descarga este PDF. Si lo dejas vacío, el botón se oculta.
                            </p>
                        </div>

                        <div className="grid gap-2">
                            <Label>Imagen card</Label>
                            {heroFile ? (
                                <div className="relative w-fit">
                                    <img src={URL.createObjectURL(heroFile)} className="h-32 w-auto rounded-lg object-cover" alt="" />
                                    <button
                                        type="button"
                                        onClick={() => setHeroFile(null)}
                                        className="absolute -right-2 -top-2 flex size-6 items-center justify-center rounded-full bg-destructive text-white"
                                        title="Quitar selección"
                                    >
                                        <X className="size-3.5" />
                                    </button>
                                </div>
                            ) : data.hero_image && !removeHero ? (
                                <div className="relative w-fit">
                                    <img src={data.hero_image} className="h-32 w-auto rounded-lg object-cover" alt="" />
                                    <button
                                        type="button"
                                        onClick={() => setRemoveHero(true)}
                                        className="absolute -right-2 -top-2 flex size-6 items-center justify-center rounded-full bg-destructive text-white"
                                        title="Eliminar imagen"
                                    >
                                        <X className="size-3.5" />
                                    </button>
                                </div>
                            ) : removeHero ? (
                                <p className="text-sm text-destructive">Imagen marcada para eliminar al guardar.{' '}
                                    <button type="button" className="underline" onClick={() => setRemoveHero(false)}>Cancelar</button>
                                </p>
                            ) : null}
                            <Input type="file" accept="image/*" onChange={(e) => { setHeroFile(e.target.files?.[0] ?? null); setRemoveHero(false); }} />
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

                {tab === 'detalle' && (
                    <form onSubmit={submit} className="flex flex-col gap-6">
                        {/* Hero */}
                        <section className="rounded-lg border p-4 flex flex-col gap-3">
                            <h2 className="text-lg font-semibold">Hero (encabezado de la página)</h2>
                            <p className="text-xs text-muted-foreground">Los "top specs" (potencia, transmisión, combustible) se derivan automáticamente de la primera versión activa — no necesitas completarlos aquí.</p>
                            <div className="grid gap-2">
                                <Label>Etiqueta sobre el precio</Label>
                                <Input
                                    value={detail.hero.tagline}
                                    onChange={(e) => setDetail({ hero: { ...detail.hero, tagline: e.target.value } })}
                                    placeholder="Ej: Desde"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Descripción</Label>
                                <Textarea
                                    rows={4}
                                    value={detail.hero.description}
                                    onChange={(e) => setDetail({ hero: { ...detail.hero, description: e.target.value } })}
                                    placeholder="Texto que acompaña al hero del vehículo."
                                />
                            </div>
                        </section>

                        {/* Highlights carrusel */}
                        <section className="rounded-lg border p-4 flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-lg font-semibold">Aspectos destacados (carrusel)</h2>
                                    <p className="text-xs text-muted-foreground">Cada slide tiene imagen, título y texto. Agrega o quita slides según necesites.</p>
                                </div>
                                <Button type="button" variant="outline" size="sm" onClick={addHighlight}>
                                    <Plus className="mr-1 size-3" /> Nuevo slide
                                </Button>
                            </div>
                            {detail.highlights.length === 0 && (
                                <p className="text-sm text-muted-foreground py-3">Sin slides aún.</p>
                            )}
                            {detail.highlights.map((h, i) => (
                                <div key={i} className="grid gap-3 rounded-md border p-3 md:grid-cols-[180px_1fr_40px]">
                                    <div className="grid gap-1.5">
                                        <Label className="text-xs">Imagen</Label>
                                        {h.image && (
                                            <img src={h.image} className="h-24 w-full rounded object-cover" alt="" />
                                        )}
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const f = e.target.files?.[0];
                                                if (f) setDetailFiles({ ...detailFiles, [`detail_content.highlights.${i}.image`]: f });
                                            }}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <div className="grid gap-1.5">
                                            <Label className="text-xs">Título</Label>
                                            <Input value={h.title} onChange={(e) => updateHighlight(i, { title: e.target.value })} />
                                        </div>
                                        <div className="grid gap-1.5">
                                            <Label className="text-xs">Texto</Label>
                                            <Textarea rows={3} value={h.text} onChange={(e) => updateHighlight(i, { text: e.target.value })} />
                                        </div>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeHighlight(i)}
                                        title="Quitar slide"
                                    >
                                        <Trash2 className="size-4 text-destructive" />
                                    </Button>
                                </div>
                            ))}
                        </section>

                        {/* 360 viewer */}
                        <section className="rounded-lg border p-4 flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-lg font-semibold">Vista 360° por color</h2>
                                    <p className="text-xs text-muted-foreground">Cada color tiene su set de fotos (ideal 12 para rotación). El visitante elige un color y las fotos del 360 cambian.</p>
                                </div>
                                <Button type="button" variant="outline" size="sm" onClick={addColor}>
                                    <Plus className="mr-1 size-3" /> Nuevo color
                                </Button>
                            </div>
                            {detail.viewer_360.colors.length === 0 && (
                                <p className="text-sm text-muted-foreground py-3">Sin colores cargados.</p>
                            )}
                            {detail.viewer_360.colors.map((c, ci) => (
                                <div key={ci} className="rounded-md border p-3 flex flex-col gap-3">
                                    <div className="grid gap-3 md:grid-cols-[1fr_160px_40px] items-end">
                                        <div className="grid gap-1.5">
                                            <Label className="text-xs">Nombre del color</Label>
                                            <Input value={c.name} onChange={(e) => updateColor(ci, { name: e.target.value })} placeholder="Ej: Blanco Perla" />
                                        </div>
                                        <div className="grid gap-1.5">
                                            <Label className="text-xs">Hex</Label>
                                            <div className="flex gap-1">
                                                <Input
                                                    type="color"
                                                    value={c.hex ?? '#FFFFFF'}
                                                    onChange={(e) => updateColor(ci, { hex: e.target.value })}
                                                    className="w-12 p-1"
                                                />
                                                <Input
                                                    value={c.hex ?? ''}
                                                    onChange={(e) => updateColor(ci, { hex: e.target.value || null })}
                                                    className="font-mono text-xs"
                                                />
                                            </div>
                                        </div>
                                        <Button type="button" variant="ghost" size="icon" onClick={() => removeColor(ci)} title="Quitar color">
                                            <Trash2 className="size-4 text-destructive" />
                                        </Button>
                                    </div>

                                    <div className="grid gap-2">
                                        <div className="flex items-center justify-between">
                                            <Label className="text-xs">Fotos ({c.photos.length})</Label>
                                            <Button type="button" variant="outline" size="sm" onClick={() => addColorPhotoSlot(ci)}>
                                                <Plus className="mr-1 size-3" /> Agregar foto
                                            </Button>
                                        </div>
                                        <div className="grid grid-cols-4 gap-2">
                                            {c.photos.map((p, pi) => (
                                                <div key={pi} className="relative rounded-md border p-2 flex flex-col gap-1">
                                                    {p ? (
                                                        <img src={p} className="h-16 w-full rounded object-cover" alt="" />
                                                    ) : (
                                                        <div className="h-16 w-full rounded bg-muted/50" />
                                                    )}
                                                    <Input
                                                        type="file"
                                                        accept="image/*"
                                                        className="text-[10px]"
                                                        onChange={(e) => {
                                                            const f = e.target.files?.[0];
                                                            if (f) setDetailFiles({
                                                                ...detailFiles,
                                                                [`detail_content.viewer_360.colors.${ci}.photos.${pi}`]: f,
                                                            });
                                                        }}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeColorPhoto(ci, pi)}
                                                        className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-destructive text-xs text-white"
                                                    >
                                                        <X className="size-3" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </section>

                        {/* Text blocks */}
                        <section className="rounded-lg border p-4 flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-lg font-semibold">Textos de la sección 360</h2>
                                    <p className="text-xs text-muted-foreground">Bloques de texto editables que acompañan al visor 360. Puedes agregar o quitar categorías (por defecto: Seguridad, Conectividad, Performance, Autonomía).</p>
                                </div>
                                <Button type="button" variant="outline" size="sm" onClick={addTextBlock}>
                                    <Plus className="mr-1 size-3" /> Nuevo bloque
                                </Button>
                            </div>
                            {detail.viewer_360.text_blocks.map((b, i) => (
                                <div key={i} className="grid gap-2 rounded-md border p-3 md:grid-cols-[1fr_2fr_40px]">
                                    <div className="grid gap-1.5">
                                        <Label className="text-xs">Título</Label>
                                        <Input value={b.title} onChange={(e) => updateTextBlock(i, { title: e.target.value })} />
                                    </div>
                                    <div className="grid gap-1.5">
                                        <Label className="text-xs">Texto</Label>
                                        <Textarea rows={2} value={b.text} onChange={(e) => updateTextBlock(i, { text: e.target.value })} />
                                    </div>
                                    <Button type="button" variant="ghost" size="icon" onClick={() => removeTextBlock(i)}>
                                        <Trash2 className="size-4 text-destructive" />
                                    </Button>
                                </div>
                            ))}
                        </section>

                        <div className="flex gap-3 pt-2">
                            <Button type="submit" disabled={processing || !data.brand_id}>
                                {processing ? 'Guardando...' : 'Guardar página de detalle'}
                            </Button>
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
