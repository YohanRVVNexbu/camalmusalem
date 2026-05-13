import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import AdminLayout from '@/layouts/admin-layout';
import {
    ImageField, MediaField, SectionCard, SectionProp, TextareaField, TextField,
    VisibilityField, resetSection, submitSection,
} from './_section';
import defaultHeroImg from '@images/nosotros/hero_image.jpg?format=webp';
import defaultMisionImg from '@images/nosotros/image_card.jpg?format=webp';
import defaultVisionImg from '@images/nosotros/image_card_2.jpg?format=webp';
import defaultCarrusel1 from '@images/nosotros/carrusel_1.jpg?format=webp';
import defaultCarrusel2 from '@images/nosotros/carrusel_2.jpg?format=webp';
import defaultCarrusel3 from '@images/nosotros/carrusel_3.jpg?format=webp';
import defaultCarrusel4 from '@images/nosotros/carrusel_4.jpg?format=webp';

const DEFAULT_MEMBER_IMGS = [defaultCarrusel1, defaultCarrusel2, defaultCarrusel3, defaultCarrusel4];

export default function NosotrosPage({ sections }: { sections: Record<string, SectionProp> }) {
    const { flash } = usePage<{ flash: { success?: string } }>().props;
    const page = 'nosotros';

    return (
        <AdminLayout breadcrumbs={[
            { title: 'Dashboard', href: '/admin' },
            { title: 'Páginas', href: '/admin/paginas' },
            { title: 'Nosotros', href: '#' },
        ]}>
            <Head title="Admin — Nosotros" />
            <div className="flex flex-col gap-4 p-4">
                <h1 className="text-2xl font-semibold">Nosotros</h1>
                {flash?.success && (
                    <div className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700">
                        {flash.success}
                    </div>
                )}
                <SimpleHeroSection page={page} s={sections['nosotros_hero']} />
                <HistoriaSection page={page} s={sections['nosotros_historia']} />
                <MisionVisionSection page={page} s={sections['nosotros_mision']} label="Nuestra misión" sectionKey="nosotros_mision" defaultImg={defaultMisionImg} />
                <MisionVisionSection page={page} s={sections['nosotros_vision']} label="Nuestra visión" sectionKey="nosotros_vision" defaultImg={defaultVisionImg} />
                <EquipoSection page={page} s={sections['nosotros_equipo']} />
                <ReconocimientosSection page={page} s={sections['nosotros_reconocimientos']} />
            </div>
        </AdminLayout>
    );
}

function SimpleHeroSection({ page, s }: { page: string; s: SectionProp }) {
    const [data, setData] = useState(s.data);
    const [visible, setVisible] = useState(s.is_visible);
    const [file, setFile] = useState<File | null>(null);
    const [processing, setProcessing] = useState(false);
    const set = (k: string, v: any) => setData((d: any) => ({ ...d, [k]: v }));

    return (
        <SectionCard page={page} sectionKey="nosotros_hero" label="Hero" isVisible={visible}
            processing={processing}
            onSubmit={(e) => { e.preventDefault(); submitSection(page, 'nosotros_hero', data, visible, { hero_image: file }, setProcessing); }}
            onReset={() => resetSection(page, 'nosotros_hero')}>
            <VisibilityField checked={visible} onChange={setVisible} />
            <Separator />
            <MediaField label="Hero (imagen o video)" currentUrl={data.hero_image ?? ''} defaultUrl={defaultHeroImg} onChange={setFile} />
            <TextField label="Subtítulo (encima del título)" value={data.subtitle ?? ''} onChange={(v) => set('subtitle', v)} />
            <TextField label="Título principal" value={data.title ?? ''} onChange={(v) => set('title', v)} />
        </SectionCard>
    );
}

function HistoriaSection({ page, s }: { page: string; s: SectionProp }) {
    const [data, setData] = useState(s.data);
    const [visible, setVisible] = useState(s.is_visible);
    const [processing, setProcessing] = useState(false);
    const set = (k: string, v: any) => setData((d: any) => ({ ...d, [k]: v }));

    return (
        <SectionCard page={page} sectionKey="nosotros_historia" label="Nuestra historia" isVisible={visible}
            processing={processing}
            onSubmit={(e) => { e.preventDefault(); submitSection(page, 'nosotros_historia', data, visible, {}, setProcessing); }}
            onReset={() => resetSection(page, 'nosotros_historia')}>
            <VisibilityField checked={visible} onChange={setVisible} />
            <Separator />
            <TextField label="Título" value={data.title ?? ''} onChange={(v) => set('title', v)} />
            <TextareaField label="Contenido (saltos de línea con Enter)" value={data.content ?? ''} onChange={(v) => set('content', v)} rows={10} />
        </SectionCard>
    );
}

function MisionVisionSection({ page, s, label, sectionKey, defaultImg }: { page: string; s: SectionProp; label: string; sectionKey: string; defaultImg: string }) {
    const [data, setData] = useState(s.data);
    const [visible, setVisible] = useState(s.is_visible);
    const [file, setFile] = useState<File | null>(null);
    const [processing, setProcessing] = useState(false);
    const set = (k: string, v: any) => setData((d: any) => ({ ...d, [k]: v }));

    return (
        <SectionCard page={page} sectionKey={sectionKey} label={label} isVisible={visible}
            processing={processing}
            onSubmit={(e) => { e.preventDefault(); submitSection(page, sectionKey, data, visible, { image: file }, setProcessing); }}
            onReset={() => resetSection(page, sectionKey)}>
            <VisibilityField checked={visible} onChange={setVisible} />
            <Separator />
            <ImageField label="Imagen" currentUrl={data.image ?? ''} defaultUrl={defaultImg} onChange={setFile} />
            <TextField label="Título" value={data.title ?? ''} onChange={(v) => set('title', v)} />
            <TextareaField label="Texto" value={data.text ?? ''} onChange={(v) => set('text', v)} rows={4} />
        </SectionCard>
    );
}

function EquipoSection({ page, s }: { page: string; s: SectionProp }) {
    const [data, setData] = useState(s.data);
    const [visible, setVisible] = useState(s.is_visible);
    const [memberFiles, setMemberFiles] = useState<(File | null)[]>((s.data.members ?? []).map(() => null));
    const [processing, setProcessing] = useState(false);

    const setMember = (i: number, k: string, v: any) => {
        const members = [...data.members];
        members[i] = { ...members[i], [k]: v };
        setData((d: any) => ({ ...d, members }));
    };

    const addMember = () => {
        setData((d: any) => ({ ...d, members: [...(d.members ?? []), { nombre: '', cargo: '', img: '' }] }));
        setMemberFiles((f) => [...f, null]);
    };

    const removeMember = (i: number) => {
        setData((d: any) => ({ ...d, members: d.members.filter((_: any, idx: number) => idx !== i) }));
        setMemberFiles((f) => f.filter((_, idx) => idx !== i));
    };

    return (
        <SectionCard page={page} sectionKey="nosotros_equipo" label="Equipo Musalem" isVisible={visible}
            processing={processing}
            onSubmit={(e) => {
                e.preventDefault();
                const files: Record<string, File | null> = {};
                memberFiles.forEach((f, i) => { files[`members.${i}.img`] = f; });
                submitSection(page, 'nosotros_equipo', data, visible, files, setProcessing);
            }}
            onReset={() => resetSection(page, 'nosotros_equipo')}>
            <VisibilityField checked={visible} onChange={setVisible} />
            <Separator />
            <TextField label="Título de sección" value={data.title ?? ''} onChange={(v) => setData((d: any) => ({ ...d, title: v }))} />
            <div className="flex flex-col gap-3">
                {(data.members ?? []).map((m: any, i: number) => (
                    <div key={i} className="grid gap-3 rounded-lg border p-4">
                        <div className="flex items-center justify-between">
                            <p className="font-medium text-sm">Miembro {i + 1}</p>
                            <button type="button" onClick={() => removeMember(i)} className="text-xs text-destructive hover:underline">Eliminar</button>
                        </div>
                        <div className="grid gap-2">
                            <Label>Foto</Label>
                            <div className="relative inline-block">
                                {memberFiles[i] ? (
                                    <>
                                        <img src={URL.createObjectURL(memberFiles[i] as File)} className="h-28 w-28 rounded-full object-cover ring-2 ring-primary" alt="" />
                                        <span className="absolute bottom-0 left-0 right-0 rounded-b-full bg-primary/80 py-0.5 text-center text-[10px] text-white">Nueva</span>
                                    </>
                                ) : (
                                    <>
                                        <img src={m.img || DEFAULT_MEMBER_IMGS[i % DEFAULT_MEMBER_IMGS.length]} className="h-28 w-28 rounded-full object-cover" alt="" />
                                        {!m.img && <span className="absolute bottom-0 left-0 right-0 rounded-b-full bg-black/60 py-0.5 text-center text-[10px] text-white">Default</span>}
                                    </>
                                )}
                            </div>
                            <input type="file" accept="image/*" onChange={(e) => {
                                const f = [...memberFiles]; f[i] = e.target.files?.[0] ?? null; setMemberFiles(f);
                            }} className="text-sm" />
                        </div>
                        <TextField label="Nombre" value={m.nombre ?? ''} onChange={(v) => setMember(i, 'nombre', v)} />
                        <TextField label="Cargo" value={m.cargo ?? ''} onChange={(v) => setMember(i, 'cargo', v)} />
                    </div>
                ))}
                <button type="button" onClick={addMember} className="rounded-md border border-dashed py-2 text-sm text-muted-foreground hover:border-foreground/50">
                    + Agregar miembro
                </button>
            </div>
        </SectionCard>
    );
}

function ReconocimientosSection({ page, s }: { page: string; s: SectionProp }) {
    const [data, setData] = useState(s.data);
    const [visible, setVisible] = useState(s.is_visible);
    const [itemFiles, setItemFiles] = useState<(File | null)[]>((s.data.items ?? []).map(() => null));
    const [processing, setProcessing] = useState(false);

    const setItem = (i: number, k: string, v: any) => {
        const items = [...data.items];
        items[i] = { ...items[i], [k]: v };
        setData((d: any) => ({ ...d, items }));
    };

    const addItem = () => {
        setData((d: any) => ({ ...d, items: [...(d.items ?? []), { nombre: '', año: '', img: '' }] }));
        setItemFiles((f) => [...f, null]);
    };

    const removeItem = (i: number) => {
        setData((d: any) => ({ ...d, items: d.items.filter((_: any, idx: number) => idx !== i) }));
        setItemFiles((f) => f.filter((_, idx) => idx !== i));
    };

    return (
        <SectionCard page={page} sectionKey="nosotros_reconocimientos" label="Reconocimientos" isVisible={visible}
            processing={processing}
            onSubmit={(e) => {
                e.preventDefault();
                const files: Record<string, File | null> = {};
                itemFiles.forEach((f, i) => { files[`items.${i}.img`] = f; });
                submitSection(page, 'nosotros_reconocimientos', data, visible, files, setProcessing);
            }}
            onReset={() => resetSection(page, 'nosotros_reconocimientos')}>
            <VisibilityField checked={visible} onChange={setVisible} />
            <Separator />
            <TextField label="Título de sección" value={data.title ?? ''} onChange={(v) => setData((d: any) => ({ ...d, title: v }))} />
            <div className="flex flex-col gap-3">
                {(data.items ?? []).map((item: any, i: number) => (
                    <div key={i} className="grid gap-3 rounded-lg border p-4">
                        <div className="flex items-center justify-between">
                            <p className="font-medium text-sm">Reconocimiento {i + 1}</p>
                            <button type="button" onClick={() => removeItem(i)} className="text-xs text-destructive hover:underline">Eliminar</button>
                        </div>
                        <div className="grid gap-2">
                            <Label>Imagen</Label>
                            {itemFiles[i] ? (
                                <div className="relative w-fit">
                                    <img src={URL.createObjectURL(itemFiles[i] as File)} className="h-24 w-40 rounded-lg object-cover ring-2 ring-primary" alt="" />
                                    <span className="absolute bottom-1 left-1 rounded bg-primary/80 px-1.5 py-0.5 text-[10px] text-white">Nueva</span>
                                </div>
                            ) : item.img ? (
                                <img src={item.img} className="h-24 w-40 rounded-lg object-cover" alt="" />
                            ) : null}
                            <input type="file" accept="image/*" onChange={(e) => {
                                const f = [...itemFiles]; f[i] = e.target.files?.[0] ?? null; setItemFiles(f);
                            }} className="text-sm" />
                        </div>
                        <TextField label="Nombre" value={item.nombre ?? ''} onChange={(v) => setItem(i, 'nombre', v)} />
                        <TextField label="Año" value={item['año'] ?? ''} onChange={(v) => setItem(i, 'año', v)} />
                    </div>
                ))}
                <button type="button" onClick={addItem} className="rounded-md border border-dashed py-2 text-sm text-muted-foreground hover:border-foreground/50">
                    + Agregar reconocimiento
                </button>
            </div>
        </SectionCard>
    );
}
