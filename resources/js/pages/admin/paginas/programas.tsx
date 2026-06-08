import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import AdminLayout from '@/layouts/admin-layout';
import {
    ImageField, MediaField, ResponsiveMediaField, SectionCard, SectionProp, TextareaField, TextField,
    VisibilityField, resetSection, submitSection,
} from './_section';
import defaultHeroImg from '@images/programas-toyota/hero_section.png?format=webp';
import defaultGrid1 from '@images/programas-toyota/grid_1.png?format=webp';
import defaultGrid2 from '@images/programas-toyota/grid_2.jpg?format=webp';
import defaultGrid3 from '@images/programas-toyota/grid_3.png?format=webp';
import defaultGrid4 from '@images/programas-toyota/grid_4.jpg?format=webp';
import defaultGrid5 from '@images/programas-toyota/grid_5.png?format=webp';
import defaultGrid6 from '@images/programas-toyota/grid_6.png?format=webp';
import defaultMantenimientoImg from '@images/programas-toyota/card_2_image.png?format=webp';

const DEFAULT_GRID_IMGS = [defaultGrid1, defaultGrid2, defaultGrid3, defaultGrid4, defaultGrid5, defaultGrid6];

// Páginas internas del sitio a las que el botón puede redirigir directamente
// (el cliente las elige del selector en vez de escribir la ruta a mano).
const SITE_PAGES: { label: string; value: string }[] = [
    { label: 'Inicio', value: '/' },
    { label: 'Vehículos nuevos', value: '/nuevos' },
    { label: 'Seminuevos', value: '/seminuevos' },
    { label: 'Comparar vehículos', value: '/seminuevos/comparar' },
    { label: 'Arriendo KINTO', value: '/kinto' },
    { label: 'Programas Toyota', value: '/programas' },
    { label: 'Noticias', value: '/noticias' },
    { label: 'Shorts', value: '/shorts' },
    { label: 'Nosotros', value: '/nosotros' },
    { label: 'Contacto', value: '/contacto' },
    { label: 'Accesorios y Merch', value: '/post-venta/accesorios' },
    { label: 'Repuestos', value: '/post-venta/repuestos' },
    { label: 'Agendar mantención', value: '/post-venta/agendar-mantencion' },
];

/**
 * Selector de destino del botón de una tarjeta. El cliente puede:
 *  - elegir "Sin botón" (no se muestra el botón),
 *  - elegir una página del sitio (el selector setea la ruta),
 *  - o "Otra URL…" para pegar un link externo o una noticia específica.
 * Internamente todo se guarda en el mismo campo `link` (string).
 */
function ButtonDestinationField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
    const isKnownPage = SITE_PAGES.some((p) => p.value === value);
    const isEmpty = value.trim() === '' || value.trim() === '#';
    const [mode, setMode] = useState<'none' | 'page' | 'custom'>(
        isEmpty ? 'none' : isKnownPage ? 'page' : 'custom',
    );

    const handleSelect = (sel: string) => {
        if (sel === 'none') {
            setMode('none');
            onChange('');
        } else if (sel === 'custom') {
            setMode('custom'); // conserva el valor actual para que lo editen
        } else {
            setMode('page');
            onChange(sel); // sel es la ruta de la página
        }
    };

    const selectValue = mode === 'none' ? 'none' : mode === 'custom' ? 'custom' : value;

    return (
        <div className="grid gap-2">
            <Label>Destino del botón</Label>
            <select
                value={selectValue}
                onChange={(e) => handleSelect(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
                <option value="none">— Sin botón —</option>
                <optgroup label="Páginas del sitio">
                    {SITE_PAGES.map((p) => (
                        <option key={p.value} value={p.value}>{p.label}</option>
                    ))}
                </optgroup>
                <option value="custom">Otra URL (externa o noticia específica)…</option>
            </select>
            {mode === 'custom' && (
                <TextField
                    label="URL"
                    value={value}
                    onChange={onChange}
                    placeholder="https://… o /noticias/mi-noticia"
                />
            )}
        </div>
    );
}

export default function ProgramasPage({ sections }: { sections: Record<string, SectionProp> }) {
    const { flash } = usePage<{ flash: { success?: string } }>().props;
    const page = 'programas';

    return (
        <AdminLayout breadcrumbs={[
            { title: 'Dashboard', href: '/admin' },
            { title: 'Páginas', href: '/admin/paginas' },
            { title: 'Programas Toyota', href: '#' },
        ]}>
            <Head title="Admin — Programas Toyota" />
            <div className="flex flex-col gap-4 p-4">
                <h1 className="text-2xl font-semibold">Programas Toyota</h1>
                {flash?.success && (
                    <div className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700">
                        {flash.success}
                    </div>
                )}
                <ProgramasHeroSection page={page} s={sections['programas_hero']} />
                <ProgramasGridSection page={page} s={sections['programas_grid']} />
                <ProgramasMantenimientoSection page={page} s={sections['programas_mantenimiento']} />
            </div>
        </AdminLayout>
    );
}

function ProgramasHeroSection({ page, s }: { page: string; s: SectionProp }) {
    const [data, setData] = useState(s.data);
    const [visible, setVisible] = useState(s.is_visible);
    const [desktopFile, setDesktopFile] = useState<File | null>(null);
    const [mobileFile, setMobileFile] = useState<File | null>(null);
    const [processing, setProcessing] = useState(false);
    const set = (k: string, v: any) => setData((d: any) => ({ ...d, [k]: v }));

    return (
        <SectionCard page={page} sectionKey="programas_hero" label="Hero" isVisible={visible}
            processing={processing}
            onSubmit={(e) => { e.preventDefault(); submitSection(page, 'programas_hero', data, visible, { hero_image: desktopFile, hero_image_mobile: mobileFile }, setProcessing); }}
            onReset={() => resetSection(page, 'programas_hero')}>
            <VisibilityField checked={visible} onChange={setVisible} />
            <Separator />
            <ResponsiveMediaField
                label="Hero (imagen o video)"
                currentDesktopUrl={data.hero_image ?? ''}
                currentMobileUrl={data.hero_image_mobile ?? ''}
                defaultDesktopUrl={defaultHeroImg}
                onChangeDesktop={setDesktopFile}
                onChangeMobile={setMobileFile}
            />
            <TextField label="Título" value={data.title ?? ''} onChange={(v) => set('title', v)} />
        </SectionCard>
    );
}

function ProgramasMantenimientoSection({ page, s }: { page: string; s: SectionProp }) {
    const [data, setData] = useState(s.data);
    const [visible, setVisible] = useState(s.is_visible);
    const [desktopFile, setDesktopFile] = useState<File | null>(null);
    const [mobileFile, setMobileFile] = useState<File | null>(null);
    const [processing, setProcessing] = useState(false);
    const set = (k: string, v: any) => setData((d: any) => ({ ...d, [k]: v }));

    return (
        <SectionCard page={page} sectionKey="programas_mantenimiento" label="Card ¿Buscas mantenimiento?" isVisible={visible}
            processing={processing}
            onSubmit={(e) => { e.preventDefault(); submitSection(page, 'programas_mantenimiento', data, visible, { image: desktopFile, image_mobile: mobileFile }, setProcessing); }}
            onReset={() => resetSection(page, 'programas_mantenimiento')}>
            <VisibilityField checked={visible} onChange={setVisible} />
            <Separator />
            <ResponsiveMediaField
                label="Imagen del card"
                currentDesktopUrl={data.image ?? ''}
                currentMobileUrl={data.image_mobile ?? ''}
                defaultDesktopUrl={defaultMantenimientoImg}
                onChangeDesktop={setDesktopFile}
                onChangeMobile={setMobileFile}
            />
            <TextField label="Título" value={data.title ?? ''} onChange={(v) => set('title', v)} placeholder="¿Buscas mantenimiento?" />
            <TextareaField label="Descripción" value={data.description ?? ''} onChange={(v) => set('description', v)} rows={5} />
            <TextField label="Texto del botón" value={data.button_label ?? ''} onChange={(v) => set('button_label', v)} placeholder="Ir a reservar" />
            <TextField label="Destino del botón (URL)" value={data.button_href ?? ''} onChange={(v) => set('button_href', v)} placeholder="/post-venta/agendar-mantencion" />
        </SectionCard>
    );
}

function ProgramasGridSection({ page, s }: { page: string; s: SectionProp }) {
    const [data, setData] = useState(s.data);
    const [visible, setVisible] = useState(s.is_visible);
    const [itemFiles, setItemFiles] = useState<(File | null)[]>((s.data.items ?? []).map(() => null));
    const [processing, setProcessing] = useState(false);

    const setItem = (i: number, k: string, v: any) => {
        const items = [...data.items];
        items[i] = { ...items[i], [k]: v };
        setData((d: any) => ({ ...d, items }));
    };

    return (
        <SectionCard page={page} sectionKey="programas_grid" label="Grilla de programas" isVisible={visible}
            processing={processing}
            onSubmit={(e) => {
                e.preventDefault();
                const files: Record<string, File | null> = {};
                itemFiles.forEach((f, i) => { files[`items.${i}.img`] = f; });
                submitSection(page, 'programas_grid', data, visible, files, setProcessing);
            }}
            onReset={() => resetSection(page, 'programas_grid')}>
            <VisibilityField checked={visible} onChange={setVisible} />
            <Separator />
            <TextField label="Título de sección" value={data.title ?? ''} onChange={(v) => setData((d: any) => ({ ...d, title: v }))} />
            <div className="flex flex-col gap-3">
                {(data.items ?? []).map((item: any, i: number) => (
                    <div key={i} className="grid gap-3 rounded-lg border p-4">
                        <p className="font-medium text-sm">Programa {i + 1}</p>
                        <div className="grid gap-2">
                            <Label>Imagen</Label>
                            <div className="relative">
                                {itemFiles[i] ? (
                                    <>
                                        <img src={URL.createObjectURL(itemFiles[i] as File)} className="h-32 w-full rounded-lg object-cover" alt="" />
                                        <span className="absolute bottom-2 left-2 rounded bg-primary/80 px-2 py-0.5 text-xs text-white">Nueva imagen</span>
                                    </>
                                ) : (
                                    <>
                                        <img src={item.img || DEFAULT_GRID_IMGS[i]} className="h-32 w-full rounded-lg object-cover" alt="" />
                                        {!item.img && <span className="absolute bottom-2 left-2 rounded bg-black/60 px-2 py-0.5 text-xs text-white">Default</span>}
                                    </>
                                )}
                            </div>
                            <input type="file" accept="image/*" onChange={(e) => {
                                const f = [...itemFiles]; f[i] = e.target.files?.[0] ?? null; setItemFiles(f);
                            }} className="text-sm" />
                        </div>
                        <TextField label="Título" value={item.title ?? ''} onChange={(v) => setItem(i, 'title', v)} />
                        <TextareaField label="Descripción" value={item.desc ?? ''} onChange={(v) => setItem(i, 'desc', v)} rows={3} />
                        <div className="grid gap-3 rounded-md border border-dashed p-3">
                            <p className="text-xs text-muted-foreground">
                                <strong>Botón de la tarjeta.</strong> Elige a qué página del sitio lleva, o pega
                                una URL. Con "Sin botón" la tarjeta no muestra botón.
                            </p>
                            <TextField label="Texto del botón" value={item.button_label ?? ''} onChange={(v) => setItem(i, 'button_label', v)} placeholder="Ver más / Descargar app / Leer noticia" />
                            <ButtonDestinationField value={item.link ?? ''} onChange={(v) => setItem(i, 'link', v)} />
                        </div>
                    </div>
                ))}
            </div>
        </SectionCard>
    );
}
