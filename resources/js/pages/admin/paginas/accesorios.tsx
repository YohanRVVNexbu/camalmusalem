import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Separator } from '@/components/ui/separator';
import AdminLayout from '@/layouts/admin-layout';
import { ResponsiveMediaField, SectionCard, SectionProp, TextField, TextareaField, VisibilityField, resetSection, submitSection } from './_section';
import { WhatsappSelector } from './_whatsapp-selector';
import defaultHeroImg from '@images/navbar/accesorios.png?format=webp';
import defaultSeccionImg from '@images/accesorios/image_section2.png?format=webp';

export default function AccesoriosPage({ sections }: { sections: Record<string, SectionProp> }) {
    const { flash } = usePage<{ flash: { success?: string } }>().props;
    const page = 'accesorios';

    return (
        <AdminLayout breadcrumbs={[
            { title: 'Dashboard', href: '/admin' },
            { title: 'Páginas', href: '/admin/paginas' },
            { title: 'Accesorios y Merch', href: '#' },
        ]}>
            <Head title="Admin — Accesorios y Merch" />
            <div className="flex flex-col gap-4 p-4">
                <h1 className="text-2xl font-semibold">Accesorios y Merch</h1>
                {flash?.success && (
                    <div className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700">{flash.success}</div>
                )}
                <HeroSection page={page} s={sections['accesorios_hero']} />
                <SeccionSection page={page} s={sections['accesorios_seccion']} />
                <WhatsappSelector
                    page={page}
                    sectionKey="accesorios_whatsapp"
                    s={sections['accesorios_whatsapp']}
                    label="Botón WhatsApp (detalle de productos)"
                    description="Aparece en el detalle de cada Accesorio y Merch. El mensaje usa {producto} para insertar el nombre del producto."
                    defaultMessage="Hola, quiero cotizar por el producto: {producto}"
                />
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
        <SectionCard page={page} sectionKey="accesorios_hero" label="Hero" isVisible={visible}
            processing={processing}
            onSubmit={(e) => { e.preventDefault(); submitSection(page, 'accesorios_hero', data, visible, { hero_image: desktopFile, hero_image_mobile: mobileFile }, setProcessing); }}
            onReset={() => resetSection(page, 'accesorios_hero')}>
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

function SeccionSection({ page, s }: { page: string; s: SectionProp }) {
    const [data, setData] = useState(s.data);
    const [visible, setVisible] = useState(s.is_visible);
    const [imgFile, setImgFile] = useState<File | null>(null);
    const [imgMobileFile, setImgMobileFile] = useState<File | null>(null);
    const [processing, setProcessing] = useState(false);
    const set = (k: string, v: any) => setData((d: any) => ({ ...d, [k]: v }));

    return (
        <SectionCard page={page} sectionKey="accesorios_seccion" label='Sección "Merch Oficial Toyota"' isVisible={visible}
            processing={processing}
            onSubmit={(e) => {
                e.preventDefault();
                submitSection(page, 'accesorios_seccion', data, visible, {
                    image: imgFile,
                    image_mobile: imgMobileFile,
                }, setProcessing);
            }}
            onReset={() => resetSection(page, 'accesorios_seccion')}>
            <VisibilityField checked={visible} onChange={setVisible} />
            <Separator />
            <TextareaField label='Título (línea nueva para "Merch" / "Oficial Toyota")' value={data.title ?? ''} onChange={(v) => set('title', v)} rows={2} />
            <TextareaField label="Descripción" value={data.description ?? ''} onChange={(v) => set('description', v)} rows={3} />
            <ResponsiveMediaField
                label="Imagen lateral"
                currentDesktopUrl={data.image ?? ''}
                currentMobileUrl={data.image_mobile ?? ''}
                defaultDesktopUrl={defaultSeccionImg}
                onChangeDesktop={setImgFile}
                onChangeMobile={setImgMobileFile}
            />
        </SectionCard>
    );
}
