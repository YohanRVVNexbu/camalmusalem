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
                        <TextField label="Enlace (URL)" value={item.link ?? ''} onChange={(v) => setItem(i, 'link', v)} placeholder="#" />
                    </div>
                ))}
            </div>
        </SectionCard>
    );
}
