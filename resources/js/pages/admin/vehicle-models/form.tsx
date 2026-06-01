import { Head, Link, router, usePage } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, Pencil, Plus, Trash2, Upload, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
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
import { dotToBracket } from '@/lib/form-data';
import { compressUntilUnder } from '@/lib/image-compress';

type BrandLite = { id: number; name: string };

type HighlightSlide = { image: string | null; title: string; text: string };
type ColorSet = { name: string; hex: string | null; photos: string[] };
type TextBlock = { key: string; title: string; text: string };
type Multimedia = { video: string | null; images: string[] };

type DetailContent = {
    hero: { tagline: string; description: string };
    highlights: HighlightSlide[];
    viewer_360: { heading: string; colors: ColorSet[]; text_blocks: TextBlock[] };
    multimedia: Multimedia;
};

type ShortItem = { url: string; thumbnail: string | null };

type VehicleModel = {
    id?: number;
    brand_id: number | null;
    name: string;
    slug?: string;
    body_type: string | null;
    segment: string | null;
    generation: string | null;
    hero_image: string | null;
    detail_hero_image: string | null;
    datasheet_url: string | null;
    datasheet_file: string | null;
    detail_content: DetailContent | null;
    shorts: ShortItem[];
    is_active: boolean;
    display_order: number;
};

const defaultDetail = (): DetailContent => ({
    hero: { tagline: 'Desde', description: '' },
    highlights: [],
    viewer_360: {
        heading: '',
        colors: [],
        text_blocks: [
            { key: 'seguridad', title: 'Seguridad', text: '' },
            { key: 'conectividad', title: 'Conectividad', text: '' },
            { key: 'performance', title: 'Performance', text: '' },
            { key: 'autonomia', title: 'Autonomía', text: '' },
        ],
    },
    multimedia: { video: null, images: [] },
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
            hero_image: null, detail_hero_image: null, datasheet_url: null, datasheet_file: null,
            detail_content: null, shorts: [],
            is_active: true, display_order: 0,
        };
        return { ...base, detail_content: base.detail_content ?? defaultDetail(), shorts: base.shorts ?? [] };
    });
    const [heroFile, setHeroFile] = useState<File | null>(null);
    const [removeHero, setRemoveHero] = useState(false);
    const [detailHeroFile, setDetailHeroFile] = useState<File | null>(null);
    const [removeDetailHero, setRemoveDetailHero] = useState(false);
    const [datasheetFile, setDatasheetFile] = useState<File | null>(null);
    const [removeDatasheet, setRemoveDatasheet] = useState(false);
    const [detailFiles, setDetailFiles] = useState<Record<string, File>>({});
    const [processing, setProcessing] = useState(false);
    // Progreso de la subida secuencial de fotos 360. Si `colorIdx` no es
    // null, hay un upload activo para ese color. `done`/`total` se usan
    // para mostrar "Subiendo 3 de 12" en el botón.
    const [photoUploadProgress, setPhotoUploadProgress] = useState<
        { colorIdx: number; done: number; total: number; failed: number } | null
    >(null);
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
    // NOTA: la sección "Multimedia" se movió a NIVEL VERSIÓN
    // (/admin/vehicle-versions/{id}/edit → pestaña Multimedia), con soporte
    // de imagen, video y YouTube. Acá ya no se gestiona.

    // ── Shorts específicos del vehículo ──────────────────────────────────
    const [shortThumbUploading, setShortThumbUploading] = useState<number | null>(null);

    const addShort = () => setData((d) => ({ ...d, shorts: [...d.shorts, { url: '', thumbnail: null }] }));
    const updateShortUrl = (i: number, url: string) =>
        setData((d) => { const s = [...d.shorts]; s[i] = { ...s[i], url }; return { ...d, shorts: s }; });
    const removeShort = (i: number) =>
        setData((d) => ({ ...d, shorts: d.shorts.filter((_, j) => j !== i) }));
    const moveShort = (i: number, dir: -1 | 1) => {
        const to = i + dir;
        setData((d) => {
            if (to < 0 || to >= d.shorts.length) return d;
            const s = [...d.shorts];
            [s[i], s[to]] = [s[to], s[i]];
            return { ...d, shorts: s };
        });
    };

    // Sube la miniatura de un short (imagen) al endpoint de media del modelo,
    // con compresión + reintentos (mismo patrón anti-403 que el resto).
    const uploadShortThumb = async (i: number, file: File) => {
        if (! isEdit) { toast.error('Guardá el vehículo primero para subir miniaturas.'); return; }
        setShortThumbUploading(i);
        const csrfToken = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content ?? '';
        const BACKOFF_MS = [0, 800, 2000];
        const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
        try {
            const compressed = await compressUntilUnder(file, 1.5 * 1024 * 1024);
            let url: string | null = null;
            let lastError = '';
            for (let attempt = 1; attempt <= 3; attempt++) {
                if (BACKOFF_MS[attempt - 1] > 0) await sleep(BACKOFF_MS[attempt - 1]);
                try {
                    const fd = new FormData();
                    fd.append('file', compressed);
                    const res = await fetch(`/admin/vehicle-models/${model!.id}/media`, {
                        method: 'POST', body: fd,
                        headers: { 'X-CSRF-TOKEN': csrfToken, 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
                        credentials: 'same-origin',
                    });
                    if (! res.ok) throw new Error(`HTTP ${res.status}`);
                    url = (await res.json()).url ?? null;
                    break;
                } catch (err) { lastError = err instanceof Error ? err.message : String(err); }
            }
            if (url) {
                setData((d) => { const s = [...d.shorts]; s[i] = { ...s[i], thumbnail: url }; return { ...d, shorts: s }; });
                toast.success('Miniatura subida.');
            } else {
                toast.error(`No se pudo subir la miniatura. ${lastError}`);
            }
        } finally {
            setShortThumbUploading(null);
        }
    };

    const removeColor = (i: number) => {
        setDetail({
            viewer_360: {
                ...detail.viewer_360,
                colors: detail.viewer_360.colors.filter((_, j) => j !== i),
            },
        });
    };
    /**
     * Agrega N fotos al color subiendo UNA POR UNA al endpoint dedicado.
     *
     * Por qué secuencial y no batch: el LiteSpeed Web Server tiene un
     * límite `MaxReqBodySize` que rechaza con 403 los POST multipart
     * grandes (típicamente >10 MB). Mandar 12 fotos en un solo request
     * fácilmente lo supera. En cambio, 12 requests de 1 archivo cada uno
     * pasan sin problema.
     *
     * Cada foto pasa por:
     *  1. Compresión adaptativa client-side (hasta 3 pases progresivos
     *     hasta que pese ≤ 5 MB). Sin perder transparencia para PNGs.
     *  2. POST individual al endpoint, que la guarda en storage y
     *     devuelve la URL.
     *  3. Al recibir la URL, se agrega como slot en `c.photos`. Los
     *     slots aparecen en orden de subida; el usuario los reordena
     *     después con las flechas.
     *
     * Si una foto falla, las otras siguen — el progreso muestra cuántas
     * fallaron al final.
     */
    const addColorPhotosFromFiles = async (colorIdx: number, rawFiles: File[]) => {
        if (rawFiles.length === 0) return;
        if (! isEdit) {
            toast.error('Primero guardá el vehículo, después podés subir las fotos del 360.');
            return;
        }

        const total = rawFiles.length;
        let done = 0;
        let failed = 0;
        setPhotoUploadProgress({ colorIdx, done, total, failed });

        // CSRF token: Laravel lo busca en el meta tag (renderizado por
        // resources/views/app.blade.php). Lo metemos en el header.
        const csrfToken = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content ?? '';

        // Target conservador: 1.5 MB por foto. Margen amplio bajo cualquier
        // MaxReqBodySize de LSWS (default 10 MB, hostings más restrictivos
        // 2-5 MB). Con FormData overhead el body real queda ≤ 2 MB —
        // imposible que rebote contra el límite.
        const COMPRESS_TARGET = 1.5 * 1024 * 1024;
        // Pausa entre uploads consecutivos. Le da aire a WAFs / rate
        // limiters (Imunify360, Cloudflare, etc.) para que no clasifiquen
        // los uploads en serie como tráfico abusivo.
        const DELAY_BETWEEN_UPLOADS_MS = 200;
        // Reintentos por foto con backoff exponencial. Cubre cortes
        // transitorios (network glitch, lock fugaz, WAF cooldown).
        const MAX_ATTEMPTS = 3;
        const BACKOFF_MS = [0, 800, 2000]; // antes del intento N

        // Detalle por foto que falló — lo mostramos al final si hay errores.
        const failures: Array<{ index: number; name: string; reason: string }> = [];

        const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

        const uploadOne = async (file: File, fileIdx: number): Promise<boolean> => {
            const compressed = await compressUntilUnder(file, COMPRESS_TARGET);
            const sizeKb = Math.round(compressed.size / 1024);

            for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
                if (BACKOFF_MS[attempt - 1] > 0) {
                    await sleep(BACKOFF_MS[attempt - 1]);
                }

                try {
                    const formData = new FormData();
                    formData.append('file', compressed);

                    const response = await fetch(
                        `/admin/vehicle-models/${model!.id}/photos-360`,
                        {
                            method: 'POST',
                            body: formData,
                            headers: {
                                'X-CSRF-TOKEN': csrfToken,
                                'Accept': 'application/json',
                                'X-Requested-With': 'XMLHttpRequest',
                            },
                            credentials: 'same-origin',
                        },
                    );

                    if (! response.ok) {
                        // Si el server devolvió HTML (e.g. la página 403 de
                        // LiteSpeed) en vez de JSON, el request ni siquiera
                        // llegó a Laravel. Lo dejamos claro en consola.
                        const contentType = response.headers.get('content-type') ?? '';
                        const blockedByServer = contentType.includes('text/html');
                        const reason = blockedByServer
                            ? `HTTP ${response.status} (bloqueado por servidor web, no llegó a Laravel)`
                            : `HTTP ${response.status}`;
                        throw new Error(reason);
                    }

                    const json = await response.json();
                    if (! json.url) throw new Error('Respuesta sin URL');

                    setData((current) => {
                        const newDetail = current.detail_content ?? defaultDetail();
                        const colors = [...newDetail.viewer_360.colors];
                        if (! colors[colorIdx]) return current;
                        colors[colorIdx] = {
                            ...colors[colorIdx],
                            photos: [...colors[colorIdx].photos, json.url],
                        };
                        return {
                            ...current,
                            detail_content: { ...newDetail, viewer_360: { ...newDetail.viewer_360, colors } },
                        };
                    });

                    console.info(`[360] OK foto #${fileIdx + 1}/${total} "${file.name}" (${sizeKb} KB) intento ${attempt}`);
                    return true;
                } catch (err) {
                    const msg = err instanceof Error ? err.message : String(err);
                    const lastAttempt = attempt === MAX_ATTEMPTS;
                    console.warn(
                        `[360] ${lastAttempt ? 'FALLO FINAL' : `intento ${attempt}/${MAX_ATTEMPTS} falló`} ` +
                        `foto #${fileIdx + 1}/${total} "${file.name}" (${sizeKb} KB): ${msg}`,
                    );
                    if (lastAttempt) {
                        failures.push({ index: fileIdx + 1, name: file.name, reason: msg });
                        return false;
                    }
                }
            }
            return false;
        };

        for (let i = 0; i < rawFiles.length; i++) {
            const ok = await uploadOne(rawFiles[i], i);
            if (ok) done++;
            else failed++;
            setPhotoUploadProgress({ colorIdx, done, total, failed });

            // Pausa entre uploads (excepto después del último) para no
            // saturar al WAF / rate limiter.
            if (i < rawFiles.length - 1) {
                await sleep(DELAY_BETWEEN_UPLOADS_MS);
            }
        }

        // Mensaje final + cierre del progreso.
        if (failed === 0) {
            toast.success(`${done} foto${done === 1 ? '' : 's'} subida${done === 1 ? '' : 's'} correctamente.`);
        } else if (done === 0) {
            // Mostramos el motivo del primer fallo para que el admin
            // sepa si fue red, server (403), validación, etc.
            const firstReason = failures[0]?.reason ?? 'razón desconocida';
            toast.error(`No se pudo subir ninguna foto. ${firstReason}. Revisá consola para detalles.`);
        } else {
            toast.warning(
                `${done} de ${total} fotos subidas. ${failed} fallaron — ` +
                `(${failures.slice(0, 2).map((f) => `#${f.index}: ${f.reason}`).join(', ')}` +
                (failures.length > 2 ? `, +${failures.length - 2} más` : '') + ').',
            );
        }
        setPhotoUploadProgress(null);
    };

    const removeColorPhoto = (colorIdx: number, photoIdx: number) => {
        const colors = [...detail.viewer_360.colors];
        const newPhotos = colors[colorIdx].photos.filter((_, j) => j !== photoIdx);
        colors[colorIdx] = { ...colors[colorIdx], photos: newPhotos };
        setDetail({ viewer_360: { ...detail.viewer_360, colors } });
    };

    const moveColorPhoto = (colorIdx: number, fromIdx: number, toIdx: number) => {
        const colors = [...detail.viewer_360.colors];
        const photos = [...colors[colorIdx].photos];
        if (toIdx < 0 || toIdx >= photos.length || fromIdx === toIdx) return;
        const [moved] = photos.splice(fromIdx, 1);
        photos.splice(toIdx, 0, moved);
        colors[colorIdx] = { ...colors[colorIdx], photos };
        setDetail({ viewer_360: { ...detail.viewer_360, colors } });
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
        formData.append('datasheet_url', data.datasheet_url ?? '');
        formData.append('is_active', data.is_active ? '1' : '0');
        formData.append('display_order', String(data.display_order));
        if (heroFile) formData.append('hero_image', heroFile);
        if (removeHero && !heroFile) formData.append('hero_image_remove', '1');
        if (detailHeroFile) formData.append('detail_hero_image', detailHeroFile);
        if (removeDetailHero && !detailHeroFile) formData.append('detail_hero_image_remove', '1');
        if (datasheetFile) formData.append('datasheet_file', datasheetFile);
        if (removeDatasheet && !datasheetFile) formData.append('datasheet_file_remove', '1');
        if (addVersionAfter) formData.append('add_version_after', '1');
        // Shorts del vehículo: solo URLs + URL de miniatura (ya subidas).
        data.shorts.forEach((s, i) => {
            formData.append(`shorts[${i}][url]`, s.url);
            if (s.thumbnail) formData.append(`shorts[${i}][thumbnail]`, s.thumbnail);
        });

        // detail_content serializado
        formData.append('detail_content[hero][tagline]', detail.hero.tagline);
        formData.append('detail_content[hero][description]', detail.hero.description);
        detail.highlights.forEach((h, i) => {
            if (h.image) formData.append(`detail_content[highlights][${i}][image]`, h.image);
            formData.append(`detail_content[highlights][${i}][title]`, h.title);
            formData.append(`detail_content[highlights][${i}][text]`, h.text);
        });
        formData.append('detail_content[viewer_360][heading]', detail.viewer_360.heading ?? '');
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

        // Archivos nested de detail_content. Convertimos las keys de
        // dot-notation a bracket-notation porque PHP convierte los puntos
        // a underscores en los nombres de campos multipart ($_FILES),
        // rompiendo el matching del controller. Con brackets, PHP arma
        // $_FILES como array nested correctamente y el controller lo
        // aplana con Arr::dot() para procesarlo con dot-notation.
        Object.entries(detailFiles).forEach(([key, file]) => {
            formData.append(dotToBracket(key), file);
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

                        <div className="grid gap-2 rounded-lg border p-4">
                            <Label className="text-base">Ficha técnica (PDF descargable)</Label>
                            <p className="text-xs text-muted-foreground">
                                Puedes pegar una URL externa <strong>o</strong> subir un archivo PDF. Si completas las dos, el archivo subido tiene prioridad. Si dejas todo vacío, el botón "Descargar ficha técnica" se oculta en el hero del detalle.
                            </p>

                            <div className="mt-2 grid gap-2">
                                <Label className="text-xs font-normal text-muted-foreground">URL externa</Label>
                                <Input
                                    type="url"
                                    value={data.datasheet_url ?? ''}
                                    onChange={(e) => setData({ ...data, datasheet_url: e.target.value || null })}
                                    placeholder="https://www.toyota.cl/.../ficha-corolla.pdf"
                                />
                            </div>

                            <div className="mt-3 grid gap-2">
                                <Label className="text-xs font-normal text-muted-foreground">o archivo PDF subido</Label>
                                {datasheetFile ? (
                                    <div className="flex items-center gap-2 rounded-md border bg-muted/40 px-3 py-2 text-sm">
                                        <span className="truncate">📄 {datasheetFile.name}</span>
                                        <span className="text-xs text-muted-foreground">({(datasheetFile.size / 1024).toFixed(0)} KB)</span>
                                        <button
                                            type="button"
                                            onClick={() => setDatasheetFile(null)}
                                            className="ml-auto text-xs text-red-600 hover:underline"
                                        >
                                            Quitar
                                        </button>
                                    </div>
                                ) : data.datasheet_file && !removeDatasheet ? (
                                    <div className="flex items-center gap-2 rounded-md border bg-muted/40 px-3 py-2 text-sm">
                                        <a
                                            href={data.datasheet_file}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="truncate text-blue-600 hover:underline"
                                        >
                                            📄 Ver PDF actual
                                        </a>
                                        <button
                                            type="button"
                                            onClick={() => setRemoveDatasheet(true)}
                                            className="ml-auto text-xs text-red-600 hover:underline"
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                ) : (
                                    <Input
                                        type="file"
                                        accept="application/pdf"
                                        onChange={(e) => {
                                            const f = e.target.files?.[0] ?? null;
                                            setDatasheetFile(f);
                                            if (f) setRemoveDatasheet(false);
                                        }}
                                    />
                                )}
                                {removeDatasheet && !datasheetFile && (
                                    <p className="text-xs text-amber-600">El PDF se eliminará al guardar.</p>
                                )}
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label>Imagen del card (listado y home)</Label>
                            <p className="-mt-1 text-xs text-muted-foreground">
                                Aparece en el <strong>card del listado</strong> (<code>/nuevos</code>) y en las{' '}
                                <strong>tarjetas destacadas "Cotiza tu Toyota 0 KM"</strong> de la home. Recomendado:
                                foto frontal del vehículo con fondo limpio, formato cuadrado o vertical.
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Para la imagen grande del <strong>hero del detalle</strong> usá el campo
                                separado en la pestaña <strong>Detalle</strong> (puede ser una foto distinta,
                                más escenográfica).
                            </p>
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

                            {/* Imagen del hero del detalle — campo propio */}
                            <div className="grid gap-2">
                                <Label>Imagen del hero (detalle)</Label>
                                <p className="-mt-1 text-xs text-muted-foreground">
                                    Imagen de fondo del hero grande en <code>/nuevos/{'{nombre}'}</code>.
                                    Si la dejás vacía, se usa la imagen del card de la pestaña Básico como
                                    fallback. Recomendado: foto escenográfica panorámica, 1920×1080 px o similar.
                                </p>
                                {detailHeroFile ? (
                                    <div className="relative w-fit">
                                        <img src={URL.createObjectURL(detailHeroFile)} className="h-32 w-auto rounded-lg object-cover" alt="" />
                                        <button
                                            type="button"
                                            onClick={() => setDetailHeroFile(null)}
                                            className="absolute -right-2 -top-2 flex size-6 items-center justify-center rounded-full bg-destructive text-white"
                                            title="Quitar selección"
                                        >
                                            <X className="size-3.5" />
                                        </button>
                                    </div>
                                ) : data.detail_hero_image && !removeDetailHero ? (
                                    <div className="relative w-fit">
                                        <img src={data.detail_hero_image} className="h-32 w-auto rounded-lg object-cover" alt="" />
                                        <button
                                            type="button"
                                            onClick={() => setRemoveDetailHero(true)}
                                            className="absolute -right-2 -top-2 flex size-6 items-center justify-center rounded-full bg-destructive text-white"
                                            title="Eliminar imagen"
                                        >
                                            <X className="size-3.5" />
                                        </button>
                                    </div>
                                ) : removeDetailHero ? (
                                    <p className="text-sm text-destructive">Imagen marcada para eliminar al guardar.{' '}
                                        <button type="button" className="underline" onClick={() => setRemoveDetailHero(false)}>Cancelar</button>
                                    </p>
                                ) : null}
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        setDetailHeroFile(e.target.files?.[0] ?? null);
                                        setRemoveDetailHero(false);
                                    }}
                                />
                            </div>

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
                            {detail.highlights.map((h, i) => {
                                const pendingHighlightFile = detailFiles[`detail_content.highlights.${i}.image`];
                                const highlightPreview = pendingHighlightFile ? URL.createObjectURL(pendingHighlightFile) : h.image;
                                return (
                                <div key={i} className="grid gap-3 rounded-md border p-3 md:grid-cols-[180px_1fr_40px]">
                                    <div className="grid gap-1.5">
                                        <Label className="text-xs">Imagen</Label>
                                        {highlightPreview && (
                                            <div className="relative">
                                                <img src={highlightPreview} className="h-24 w-full rounded object-cover" alt="" />
                                                {pendingHighlightFile && (
                                                    <span className="absolute bottom-1 left-1 rounded bg-primary/80 px-1.5 py-0.5 text-[9px] text-white">
                                                        Nueva
                                                    </span>
                                                )}
                                            </div>
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
                                );
                            })}
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

                            {/* Título de la sección 360 (editable por vehículo) */}
                            <div className="grid gap-1.5">
                                <Label className="text-xs">Título de la sección</Label>
                                <Input
                                    value={detail.viewer_360.heading ?? ''}
                                    onChange={(e) => setDetail({ viewer_360: { ...detail.viewer_360, heading: e.target.value } })}
                                    placeholder="Ej: 4Runner, aventura sin límites · (vacío = usa el nombre del modelo)"
                                />
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
                                            <div>
                                                <Label className="text-xs">Fotos del 360 ({c.photos.length})</Label>
                                                <p className="text-[10px] text-muted-foreground">
                                                    El orden define la rotación: 1 = primera foto, última = vuelta completa.
                                                    Las flechas mueven la foto a izquierda/derecha.
                                                </p>
                                            </div>
                                            {(() => {
                                                const uploadingThis = photoUploadProgress?.colorIdx === ci;
                                                const uploadingOther = photoUploadProgress !== null && ! uploadingThis;
                                                const disabled = uploadingThis || uploadingOther || ! isEdit;
                                                const label = ! isEdit
                                                    ? 'Guardá primero el vehículo'
                                                    : uploadingThis
                                                    ? `Subiendo ${photoUploadProgress!.done + 1} de ${photoUploadProgress!.total}…`
                                                    : uploadingOther
                                                    ? 'Espera, hay otra subida en curso…'
                                                    : 'Subir fotos';
                                                return (
                                                    <label className={`inline-flex h-9 items-center gap-1 rounded-md border border-input bg-background px-3 text-sm font-medium transition ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:bg-accent'}`}>
                                                        <Upload className="size-3" />
                                                        {label}
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            multiple
                                                            disabled={disabled}
                                                            className="hidden"
                                                            onChange={(e) => {
                                                                const files = Array.from(e.target.files ?? []);
                                                                addColorPhotosFromFiles(ci, files);
                                                                e.target.value = ''; // permite re-elegir las mismas
                                                            }}
                                                        />
                                                    </label>
                                                );
                                            })()}
                                        </div>
                                        <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 lg:grid-cols-8">
                                            {c.photos.map((p, pi) => {
                                                const isFirst = pi === 0;
                                                const isLast = pi === c.photos.length - 1;
                                                return (
                                                    <div key={pi} className="relative rounded-md border bg-card p-1.5 flex flex-col gap-1">
                                                        {/* Número de orden */}
                                                        <span className="absolute left-1 top-1 z-10 flex size-5 items-center justify-center rounded-full bg-black/80 text-[10px] font-semibold text-white">
                                                            {pi + 1}
                                                        </span>
                                                        {/* Botón quitar */}
                                                        <button
                                                            type="button"
                                                            onClick={() => removeColorPhoto(ci, pi)}
                                                            className="absolute -right-1.5 -top-1.5 z-10 flex size-5 items-center justify-center rounded-full bg-destructive text-white shadow hover:bg-destructive/90"
                                                            title="Quitar foto"
                                                        >
                                                            <X className="size-3" />
                                                        </button>
                                                        {/* Imagen / placeholder */}
                                                        {p ? (
                                                            <img src={p} className="h-20 w-full rounded object-cover" alt={`Foto ${pi + 1}`} />
                                                        ) : (
                                                            <div className="flex h-20 w-full items-center justify-center rounded bg-muted/40 text-[10px] text-muted-foreground">
                                                                Sin foto
                                                            </div>
                                                        )}
                                                        {/* Flechas de reorden */}
                                                        <div className="flex items-center justify-between gap-1">
                                                            <button
                                                                type="button"
                                                                disabled={isFirst}
                                                                onClick={() => moveColorPhoto(ci, pi, pi - 1)}
                                                                className="flex h-6 flex-1 items-center justify-center rounded border bg-background text-foreground transition hover:bg-accent disabled:cursor-not-allowed disabled:opacity-30"
                                                                title="Mover a la izquierda"
                                                            >
                                                                <ChevronLeft className="size-3" />
                                                            </button>
                                                            <button
                                                                type="button"
                                                                disabled={isLast}
                                                                onClick={() => moveColorPhoto(ci, pi, pi + 1)}
                                                                className="flex h-6 flex-1 items-center justify-center rounded border bg-background text-foreground transition hover:bg-accent disabled:cursor-not-allowed disabled:opacity-30"
                                                                title="Mover a la derecha"
                                                            >
                                                                <ChevronRight className="size-3" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                            {c.photos.length === 0 && (
                                                <div className="col-span-full flex flex-col items-center gap-2 rounded-md border border-dashed py-6 text-center text-sm text-muted-foreground">
                                                    <Upload className="size-5" />
                                                    Sin fotos. Hace clic en "Subir fotos" para agregar varias a la vez.
                                                </div>
                                            )}
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

                        {/* La sección Multimedia se movió a nivel versión:
                            /admin/vehicle-versions/{id}/edit → pestaña Multimedia
                            (soporta imagen, video y YouTube). */}

                        {/* Shorts específicos del vehículo */}
                        <section className="rounded-lg border p-4 flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-lg font-semibold">Shorts del vehículo ({data.shorts.length})</h2>
                                    <p className="text-xs text-muted-foreground">Pegá URLs de YouTube, Instagram o TikTok. YouTube saca la miniatura solo; para Instagram/TikTok subí una imagen. Si está vacío, la sección no aparece en el detalle.</p>
                                </div>
                                <Button type="button" variant="outline" size="sm" onClick={addShort}>
                                    <Plus className="mr-1 size-3" /> Agregar short
                                </Button>
                            </div>

                            {! isEdit && (
                                <p className="text-sm text-muted-foreground">Guardá el vehículo primero para poder subir miniaturas.</p>
                            )}

                            {data.shorts.length === 0 && (
                                <p className="text-sm text-muted-foreground py-2">Sin shorts aún.</p>
                            )}

                            {data.shorts.map((s, i) => (
                                <div key={i} className="grid gap-3 rounded-md border p-3 md:grid-cols-[120px_1fr_auto] md:items-start">
                                    {/* Miniatura */}
                                    <div className="grid gap-1.5">
                                        <Label className="text-xs">Miniatura</Label>
                                        {s.thumbnail && (
                                            <img src={s.thumbnail} className="h-24 w-full rounded object-cover" alt="" />
                                        )}
                                        <Input
                                            type="file" accept="image/*"
                                            disabled={! isEdit || shortThumbUploading === i}
                                            onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadShortThumb(i, f); e.target.value = ''; }}
                                        />
                                        {shortThumbUploading === i && <span className="text-[10px] text-muted-foreground">Subiendo…</span>}
                                        <span className="text-[10px] text-muted-foreground">YouTube: opcional (auto)</span>
                                    </div>
                                    {/* URL */}
                                    <div className="grid gap-1.5">
                                        <Label className="text-xs">URL del short (YouTube / Instagram / TikTok)</Label>
                                        <Input
                                            value={s.url}
                                            onChange={(e) => updateShortUrl(i, e.target.value)}
                                            placeholder="https://www.youtube.com/shorts/... o instagram.com/reel/... o tiktok.com/@.../video/..."
                                        />
                                    </div>
                                    {/* Acciones */}
                                    <div className="flex items-center gap-1 md:flex-col">
                                        <Button type="button" variant="ghost" size="icon" onClick={() => moveShort(i, -1)} disabled={i === 0} title="Subir">↑</Button>
                                        <Button type="button" variant="ghost" size="icon" onClick={() => moveShort(i, 1)} disabled={i === data.shorts.length - 1} title="Bajar">↓</Button>
                                        <Button type="button" variant="ghost" size="icon" onClick={() => removeShort(i)} title="Quitar"><Trash2 className="size-4 text-destructive" /></Button>
                                    </div>
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
