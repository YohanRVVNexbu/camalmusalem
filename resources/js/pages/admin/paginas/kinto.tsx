import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import AdminLayout from '@/layouts/admin-layout';
import {
    ResponsiveMediaField, SectionCard, SectionProp, TextareaField, TextField,
    VisibilityField, resetSection, submitSection,
} from './_section';
import defaultHeroImg from '@images/kinto/hero_image.png?format=webp';
import defaultCard1 from '@images/kinto/card_1.jpg?format=webp';
import defaultCard2 from '@images/kinto/card_2.jpg?format=webp';
import defaultCard3 from '@images/kinto/card_3.jpg?format=webp';
import defaultFormImg from '@images/kinto/image_form.jpg?format=webp';
import defaultStep2Img from '@images/mantencion/form_2_image.png?format=webp';
import defaultStep3Img from '@images/mantencion/form_image_3.png?format=webp';
const DEFAULT_PASO_IMGS = [defaultCard1, defaultCard2, defaultCard3];

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
                <FormularioSection page={page} s={sections['kinto_formulario']} />
            </div>
        </AdminLayout>
    );
}

// ── Solicitar arriendo (Form) ─────────────────────────────────────────────────
function FormularioSection({ page, s }: { page: string; s: SectionProp }) {
    const [data, setData] = useState(s.data);
    const [visible, setVisible] = useState(s.is_visible);
    const [imgFile, setImgFile] = useState<File | null>(null);
    const [imgMobileFile, setImgMobileFile] = useState<File | null>(null);
    const [step2File, setStep2File] = useState<File | null>(null);
    const [step2MobileFile, setStep2MobileFile] = useState<File | null>(null);
    const [step3File, setStep3File] = useState<File | null>(null);
    const [step3MobileFile, setStep3MobileFile] = useState<File | null>(null);
    const [processing, setProcessing] = useState(false);
    const set = (k: string, v: any) => setData((d: any) => ({ ...d, [k]: v }));

    return (
        <SectionCard page={page} sectionKey="kinto_formulario" label="Solicitar arriendo (textos e imágenes del formulario)" isVisible={visible}
            processing={processing}
            onSubmit={(e) => {
                e.preventDefault();
                submitSection(page, 'kinto_formulario', data, visible, {
                    image: imgFile,
                    image_mobile: imgMobileFile,
                    step2_image: step2File,
                    step2_image_mobile: step2MobileFile,
                    step3_image: step3File,
                    step3_image_mobile: step3MobileFile,
                }, setProcessing);
            }}
            onReset={() => resetSection(page, 'kinto_formulario')}>
            <VisibilityField checked={visible} onChange={setVisible} />
            <Separator />
            <TextareaField
                label='Título (usar línea nueva para "Solicita tu arriendo" y "Kinto en Musalem")'
                value={data.title ?? ''}
                onChange={(v) => set('title', v)}
                rows={3}
            />
            <TextareaField label="Descripción" value={data.description ?? ''} onChange={(v) => set('description', v)} rows={4} />
            <TextField label="Texto del botón" value={data.button_text ?? ''} onChange={(v) => set('button_text', v)} />
            <Separator />
            <p className="text-sm font-medium text-foreground">Imagen principal (al lado del título "Solicita tu arriendo...")</p>
            <ResponsiveMediaField
                label="Imagen principal"
                currentDesktopUrl={data.image ?? ''}
                currentMobileUrl={data.image_mobile ?? ''}
                defaultDesktopUrl={defaultFormImg}
                onChangeDesktop={setImgFile}
                onChangeMobile={setImgMobileFile}
            />
            <Separator />
            <p className="text-sm font-medium text-foreground">Imagen del paso 2 — Datos de contacto</p>
            <ResponsiveMediaField
                label="Imagen paso 2"
                currentDesktopUrl={data.step2_image ?? ''}
                currentMobileUrl={data.step2_image_mobile ?? ''}
                defaultDesktopUrl={defaultStep2Img}
                onChangeDesktop={setStep2File}
                onChangeMobile={setStep2MobileFile}
            />
            <Separator />
            <p className="text-sm font-medium text-foreground">Imagen del paso 3 — Confirmar solicitud</p>
            <ResponsiveMediaField
                label="Imagen paso 3"
                currentDesktopUrl={data.step3_image ?? ''}
                currentMobileUrl={data.step3_image_mobile ?? ''}
                defaultDesktopUrl={defaultStep3Img}
                onChangeDesktop={setStep3File}
                onChangeMobile={setStep3MobileFile}
            />
        </SectionCard>
    );
}

// ── Hero ───────────────────────────────────────────────────────────────────────
function HeroSection({ page, s }: { page: string; s: SectionProp }) {
    const [data, setData] = useState(s.data);
    const [visible, setVisible] = useState(s.is_visible);
    const [heroFile, setHeroFile] = useState<File | null>(null);
    const [heroMobileFile, setHeroMobileFile] = useState<File | null>(null);
    const [processing, setProcessing] = useState(false);
    const set = (k: string, v: any) => setData((d: any) => ({ ...d, [k]: v }));

    return (
        <SectionCard page={page} sectionKey="kinto_hero" label="Hero" isVisible={visible}
            processing={processing}
            onSubmit={(e) => { e.preventDefault(); submitSection(page, 'kinto_hero', data, visible, { hero_image: heroFile, hero_image_mobile: heroMobileFile }, setProcessing); }}
            onReset={() => resetSection(page, 'kinto_hero')}>
            <VisibilityField checked={visible} onChange={setVisible} />
            <Separator />
            <ResponsiveMediaField
                label="Hero (imagen o video)"
                currentDesktopUrl={data.hero_image ?? ''}
                currentMobileUrl={data.hero_image_mobile ?? ''}
                defaultDesktopUrl={defaultHeroImg}
                onChangeDesktop={setHeroFile}
                onChangeMobile={setHeroMobileFile}
            />
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

// ── Vehículos: solo título (los vehículos se gestionan en /admin/rentals) ─────
function VehiculosSection({ page, s }: { page: string; s: SectionProp }) {
    const [data, setData] = useState(s.data);
    const [visible, setVisible] = useState(s.is_visible);
    const [processing, setProcessing] = useState(false);

    return (
        <SectionCard page={page} sectionKey="kinto_vehiculos" label="Vehículos disponibles" isVisible={visible}
            processing={processing}
            onSubmit={(e) => {
                e.preventDefault();
                submitSection(page, 'kinto_vehiculos', data, visible, {}, setProcessing);
            }}
            onReset={() => resetSection(page, 'kinto_vehiculos')}>
            <VisibilityField checked={visible} onChange={setVisible} />
            <Separator />
            <TextField label="Título de sección" value={data.title ?? ''} onChange={(v) => setData((d: any) => ({ ...d, title: v }))} />
            <p className="text-xs text-muted-foreground">
                Los vehículos disponibles se administran en{' '}
                <a href="/admin/rentals" className="font-medium underline">Arriendos</a>.
            </p>
        </SectionCard>
    );
}
