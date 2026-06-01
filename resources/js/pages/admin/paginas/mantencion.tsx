import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Separator } from '@/components/ui/separator';
import AdminLayout from '@/layouts/admin-layout';
import { ResponsiveMediaField, SectionCard, SectionProp, TextField, TextareaField, VisibilityField, resetSection, submitSection } from './_section';
import defaultHeroImg from '@images/mantencion/hero-imagen.png?format=webp';
import defaultReservaImg from '@images/mantencion/image_third_section.jpg?format=webp';
import defaultStep2Img from '@images/mantencion/image_step2.png?format=webp';
import defaultStep4Img from '@images/mantencion/image_step4.png?format=webp';

export default function MantencionPage({ sections }: { sections: Record<string, SectionProp> }) {
    const { flash } = usePage<{ flash: { success?: string } }>().props;
    const page = 'mantencion';

    return (
        <AdminLayout breadcrumbs={[
            { title: 'Dashboard', href: '/admin' },
            { title: 'Páginas', href: '/admin/paginas' },
            { title: 'Agendar Mantención', href: '#' },
        ]}>
            <Head title="Admin — Mantención" />
            <div className="flex flex-col gap-4 p-4">
                <h1 className="text-2xl font-semibold">Agendar Mantención</h1>
                {flash?.success && (
                    <div className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700">{flash.success}</div>
                )}
                <HeroSection page={page} s={sections['mantencion_hero']} />
                <ReservaSection page={page} s={sections['mantencion_reserva']} />
            </div>
        </AdminLayout>
    );
}

function HeroSection({ page, s }: { page: string; s: SectionProp }) {
    const [data, setData] = useState(s.data);
    const [visible, setVisible] = useState(s.is_visible);
    const [desktopFile, setDesktopFile] = useState<File | null>(null);
    const [mobileFile, setMobileFile] = useState<File | null>(null);
    const [processing, setProcessing] = useState(false);
    const set = (k: string, v: any) => setData((d: any) => ({ ...d, [k]: v }));

    return (
        <SectionCard page={page} sectionKey="mantencion_hero" label="Hero" isVisible={visible}
            processing={processing}
            onSubmit={(e) => { e.preventDefault(); submitSection(page, 'mantencion_hero', data, visible, { hero_image: desktopFile, hero_image_mobile: mobileFile }, setProcessing); }}
            onReset={() => resetSection(page, 'mantencion_hero')}>
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
            <TextareaField label="Descripción" value={data.description ?? ''} onChange={(v) => set('description', v)} rows={3} />
        </SectionCard>
    );
}

function ReservaSection({ page, s }: { page: string; s: SectionProp }) {
    const [data, setData] = useState(s.data);
    const [visible, setVisible] = useState(s.is_visible);
    const [imgFile, setImgFile] = useState<File | null>(null);
    const [imgMobileFile, setImgMobileFile] = useState<File | null>(null);
    const [step2File, setStep2File] = useState<File | null>(null);
    const [step2MobileFile, setStep2MobileFile] = useState<File | null>(null);
    const [step4File, setStep4File] = useState<File | null>(null);
    const [step4MobileFile, setStep4MobileFile] = useState<File | null>(null);
    const [processing, setProcessing] = useState(false);
    const set = (k: string, v: any) => setData((d: any) => ({ ...d, [k]: v }));

    return (
        <SectionCard page={page} sectionKey="mantencion_reserva" label="Reserva tu hora (textos e imágenes del formulario)" isVisible={visible}
            processing={processing}
            onSubmit={(e) => {
                e.preventDefault();
                submitSection(page, 'mantencion_reserva', data, visible, {
                    image: imgFile,
                    image_mobile: imgMobileFile,
                    step2_image: step2File,
                    step2_image_mobile: step2MobileFile,
                    step4_image: step4File,
                    step4_image_mobile: step4MobileFile,
                }, setProcessing);
            }}
            onReset={() => resetSection(page, 'mantencion_reserva')}>
            <VisibilityField checked={visible} onChange={setVisible} />
            <Separator />
            <p className="text-sm font-medium text-foreground">Carrusel "Servicio técnico Musalem"</p>
            <TextField label="Título del carrusel" value={data.carousel_title ?? ''} onChange={(v) => set('carousel_title', v)} />
            <TextareaField label="Descripción del carrusel" value={data.carousel_description ?? ''} onChange={(v) => set('carousel_description', v)} rows={3} />
            <Separator />
            <p className="text-sm font-medium text-foreground">Bloque "Reserva tu hora"</p>
            <TextField label="Título" value={data.title ?? ''} onChange={(v) => set('title', v)} />
            <TextareaField label="Descripción" value={data.description ?? ''} onChange={(v) => set('description', v)} rows={3} />
            <TextField label="Texto del botón" value={data.button_text ?? ''} onChange={(v) => set('button_text', v)} />
            <ResponsiveMediaField
                label="Imagen del bloque (la del horario)"
                currentDesktopUrl={data.image ?? ''}
                currentMobileUrl={data.image_mobile ?? ''}
                defaultDesktopUrl={defaultReservaImg}
                onChangeDesktop={setImgFile}
                onChangeMobile={setImgMobileFile}
            />
            <Separator />
            <p className="text-sm font-medium text-foreground">Imágenes del wizard (al avanzar pasos del formulario)</p>
            <ResponsiveMediaField
                label="Pasos 1, 2 y 3 (datos del vehículo / contacto)"
                currentDesktopUrl={data.step2_image ?? ''}
                currentMobileUrl={data.step2_image_mobile ?? ''}
                defaultDesktopUrl={defaultStep2Img}
                onChangeDesktop={setStep2File}
                onChangeMobile={setStep2MobileFile}
            />
            <ResponsiveMediaField
                label="Paso 4 (resumen / confirmar)"
                currentDesktopUrl={data.step4_image ?? ''}
                currentMobileUrl={data.step4_image_mobile ?? ''}
                defaultDesktopUrl={defaultStep4Img}
                onChangeDesktop={setStep4File}
                onChangeMobile={setStep4MobileFile}
            />
        </SectionCard>
    );
}
