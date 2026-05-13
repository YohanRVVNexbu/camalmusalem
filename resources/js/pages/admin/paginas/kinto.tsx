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
import defaultHeroImg from '@images/kinto/hero_image.png?format=webp';
import defaultCard1 from '@images/kinto/card_1.jpg?format=webp';
import defaultCard2 from '@images/kinto/card_2.jpg?format=webp';
import defaultCard3 from '@images/kinto/card_3.jpg?format=webp';
import defaultCar1 from '@images/kinto/car_1.png?format=webp';
import defaultCar2 from '@images/kinto/car_2.png?format=webp';

const DEFAULT_PASO_IMGS = [defaultCard1, defaultCard2, defaultCard3];
const DEFAULT_CAR_IMGS = [defaultCar1, defaultCar2];

export default function KintoPage({ sections }: { sections: Record<string, SectionProp> }) {
    const { flash } = usePage<{ flash: { success?: string } }>().props;
    const page = 'kinto';

    return (
        <AdminLayout breadcrumbs={[
            { title: 'Dashboard', href: '/admin' },
            { title: 'Páginas', href: '/admin/paginas' },
            { title: 'KINTO', href: '#' },
        ]}>
            <Head title="Admin — KINTO" />
            <div className="flex flex-col gap-4 p-4">
                <h1 className="text-2xl font-semibold">Arriendo KINTO</h1>
                {flash?.success && (
                    <div className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700">
                        {flash.success}
                    </div>
                )}
                <HeroSection page={page} s={sections['kinto_hero']} />
                <PasosSection page={page} s={sections['kinto_pasos']} />
                <VehiculosSection page={page} s={sections['kinto_vehiculos']} />
            </div>
        </AdminLayout>
    );
}

// ── Hero ───────────────────────────────────────────────────────────────────────
function HeroSection({ page, s }: { page: string; s: SectionProp }) {
    const [data, setData] = useState(s.data);
    const [visible, setVisible] = useState(s.is_visible);
    const [heroFile, setHeroFile] = useState<File | null>(null);
    const [processing, setProcessing] = useState(false);
    const set = (k: string, v: any) => setData((d: any) => ({ ...d, [k]: v }));

    return (
        <SectionCard page={page} sectionKey="kinto_hero" label="Hero" isVisible={visible}
            processing={processing}
            onSubmit={(e) => { e.preventDefault(); submitSection(page, 'kinto_hero', data, visible, { 'hero_image': heroFile }, setProcessing); }}
            onReset={() => resetSection(page, 'kinto_hero')}>
            <VisibilityField checked={visible} onChange={setVisible} />
            <Separator />
            <MediaField label="Hero (imagen o video)" currentUrl={data.hero_image ?? ''} defaultUrl={defaultHeroImg} onChange={setHeroFile} />
            <TextField label="Título" value={data.title ?? ''} onChange={(v) => set('title', v)} />
            <TextareaField label="Descripción" value={data.description ?? ''} onChange={(v) => set('description', v)} rows={4} />
            <TextField label="Texto botón" value={data.button_text ?? ''} onChange={(v) => set('button_text', v)} />
        </SectionCard>
    );
}

// ── Pasos ──────────────────────────────────────────────────────────────────────
function PasosSection({ page, s }: { page: string; s: SectionProp }) {
    const [data, setData] = useState(s.data);
    const [visible, setVisible] = useState(s.is_visible);
    const [pasoFiles, setPasoFiles] = useState<(File | null)[]>([null, null, null]);
    const [processing, setProcessing] = useState(false);

    const setPaso = (i: number, k: string, v: any) => {
        const pasos = [...data.pasos];
        pasos[i] = { ...pasos[i], [k]: v };
        setData((d: any) => ({ ...d, pasos }));
    };

    return (
        <SectionCard page={page} sectionKey="kinto_pasos" label="¿Cómo funciona? (3 pasos)" isVisible={visible}
            processing={processing}
            onSubmit={(e) => {
                e.preventDefault();
                const files: Record<string, File | null> = {};
                pasoFiles.forEach((f, i) => { files[`pasos.${i}.img`] = f; });
                submitSection(page, 'kinto_pasos', data, visible, files, setProcessing);
            }}
            onReset={() => resetSection(page, 'kinto_pasos')}>
            <VisibilityField checked={visible} onChange={setVisible} />
            <Separator />
            <TextField label="Título de sección" value={data.title ?? ''} onChange={(v) => setData((d: any) => ({ ...d, title: v }))} />
            {(data.pasos ?? []).map((paso: any, i: number) => (
                <div key={i} className="grid gap-3 rounded-lg border p-4">
                    <p className="font-medium text-sm">Paso {i + 1}</p>
                    <div className="grid gap-2">
                        <Label>Imagen</Label>
                        <div className="relative">
                            {pasoFiles[i] ? (
                                <>
                                    <img src={URL.createObjectURL(pasoFiles[i] as File)} className="h-32 w-full rounded-lg object-cover ring-2 ring-primary" alt="" />
                                    <span className="absolute bottom-2 left-2 rounded bg-primary/80 px-2 py-0.5 text-xs text-white">Nueva imagen</span>
                                </>
                            ) : (
                                <>
                                    <img src={paso.img || DEFAULT_PASO_IMGS[i]} className="h-32 w-full rounded-lg object-cover" alt="" />
                                    {!paso.img && <span className="absolute bottom-2 left-2 rounded bg-black/60 px-2 py-0.5 text-xs text-white">Default</span>}
                                </>
                            )}
                        </div>
                        <input type="file" accept="image/*" onChange={(e) => {
                            const f = [...pasoFiles]; f[i] = e.target.files?.[0] ?? null; setPasoFiles(f);
                        }} className="text-sm" />
                    </div>
                    <TextField label="Título" value={paso.titulo ?? ''} onChange={(v) => setPaso(i, 'titulo', v)} />
                    <TextareaField label="Subtítulo / descripción" value={paso.subtitulo ?? ''} onChange={(v) => setPaso(i, 'subtitulo', v)} rows={3} />
                </div>
            ))}
        </SectionCard>
    );
}

// ── Vehículos ──────────────────────────────────────────────────────────────────
function VehiculosSection({ page, s }: { page: string; s: SectionProp }) {
    const [data, setData] = useState(s.data);
    const [visible, setVisible] = useState(s.is_visible);
    const [vehiculoFiles, setVehiculoFiles] = useState<(File | null)[]>([null, null]);
    const [processing, setProcessing] = useState(false);

    const setV = (i: number, k: string, v: any) => {
        const vehiculos = [...data.vehiculos];
        vehiculos[i] = { ...vehiculos[i], [k]: v };
        setData((d: any) => ({ ...d, vehiculos }));
    };

    return (
        <SectionCard page={page} sectionKey="kinto_vehiculos" label="Vehículos disponibles" isVisible={visible}
            processing={processing}
            onSubmit={(e) => {
                e.preventDefault();
                const files: Record<string, File | null> = {};
                vehiculoFiles.forEach((f, i) => { files[`vehiculos.${i}.img`] = f; });
                submitSection(page, 'kinto_vehiculos', data, visible, files, setProcessing);
            }}
            onReset={() => resetSection(page, 'kinto_vehiculos')}>
            <VisibilityField checked={visible} onChange={setVisible} />
            <Separator />
            <TextField label="Título de sección" value={data.title ?? ''} onChange={(v) => setData((d: any) => ({ ...d, title: v }))} />
            {(data.vehiculos ?? []).map((v: any, i: number) => (
                <div key={i} className="grid gap-3 rounded-lg border p-4">
                    <p className="font-medium text-sm">Vehículo {i + 1}</p>
                    <div className="grid gap-2">
                        <Label>Imagen</Label>
                        <div className="relative">
                            {vehiculoFiles[i] ? (
                                <>
                                    <img src={URL.createObjectURL(vehiculoFiles[i] as File)} className="h-32 w-full rounded-lg object-contain bg-gray-100 ring-2 ring-primary" alt="" />
                                    <span className="absolute bottom-2 left-2 rounded bg-primary/80 px-2 py-0.5 text-xs text-white">Nueva imagen</span>
                                </>
                            ) : (
                                <>
                                    <img src={v.img || DEFAULT_CAR_IMGS[i]} className="h-32 w-full rounded-lg object-contain bg-gray-100" alt="" />
                                    {!v.img && <span className="absolute bottom-2 left-2 rounded bg-black/60 px-2 py-0.5 text-xs text-white">Default</span>}
                                </>
                            )}
                        </div>
                        <input type="file" accept="image/*" onChange={(e) => {
                            const f = [...vehiculoFiles]; f[i] = e.target.files?.[0] ?? null; setVehiculoFiles(f);
                        }} className="text-sm" />
                    </div>
                    <TextField label="Nombre" value={v.nombre ?? ''} onChange={(val) => setV(i, 'nombre', val)} />
                    <TextField label="Precio" value={v.precio ?? ''} onChange={(val) => setV(i, 'precio', val)} />
                </div>
            ))}
        </SectionCard>
    );
}
