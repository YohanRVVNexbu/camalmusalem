import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Separator } from '@/components/ui/separator';
import AdminLayout from '@/layouts/admin-layout';
import { ResponsiveMediaField, SectionCard, SectionProp, TextField, TextareaField, VisibilityField, resetSection, submitSection } from './_section';
import { WhatsappSelector } from './_whatsapp-selector';
import defaultHeroImg from '@images/repuestos/hero_image.png?format=webp';
import defaultSection2Img from '@images/repuestos/image_section2.jpg?format=webp';
import defaultSection3Img from '@images/repuestos/image_section3.jpg?format=webp';

export default function RepuestosPage({ sections }: { sections: Record<string, SectionProp> }) {
    const { flash } = usePage<{ flash: { success?: string } }>().props;
    const page = 'repuestos';

    return (
        <AdminLayout breadcrumbs={[
            { title: 'Dashboard', href: '/admin' },
            { title: 'Páginas', href: '/admin/paginas' },
            { title: 'Repuestos', href: '#' },
        ]}>
            <Head title="Admin — Repuestos" />
            <div className="flex flex-col gap-4 p-4">
                <h1 className="text-2xl font-semibold">Repuestos</h1>
                {flash?.success && (
                    <div className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700">{flash.success}</div>
                )}
                <HeroSection page={page} s={sections['repuestos_hero']} />
                <SeccionSection page={page} s={sections['repuestos_seccion']} />
                <WhatsappSelector
                    page={page}
                    sectionKey="repuestos_whatsapp"
                    s={sections['repuestos_whatsapp']}
                    label="Botón WhatsApp (detalle de repuestos)"
                    description="Aparece en el detalle de cada repuesto. El mensaje usa {producto} para insertar el nombre del repuesto."
                    defaultMessage="Hola, quiero consultar por el repuesto: {producto}"
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
        <SectionCard page={page} sectionKey="repuestos_hero" label="Hero" isVisible={visible}
            processing={processing}
            onSubmit={(e) => { e.preventDefault(); submitSection(page, 'repuestos_hero', data, visible, { hero_image: desktopFile, hero_image_mobile: mobileFile }, setProcessing); }}
            onReset={() => resetSection(page, 'repuestos_hero')}>
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
    const [formImgFile, setFormImgFile] = useState<File | null>(null);
    const [formImgMobileFile, setFormImgMobileFile] = useState<File | null>(null);
    const [processing, setProcessing] = useState(false);
    const set = (k: string, v: any) => setData((d: any) => ({ ...d, [k]: v }));

    return (
        <SectionCard page={page} sectionKey="repuestos_seccion" label="Encargo de repuestos + Solicitud (textos e imágenes)" isVisible={visible}
            processing={processing}
            onSubmit={(e) => {
                e.preventDefault();
                submitSection(page, 'repuestos_seccion', data, visible, {
                    image: imgFile,
                    image_mobile: imgMobileFile,
                    form_image: formImgFile,
                    form_image_mobile: formImgMobileFile,
                }, setProcessing);
            }}
            onReset={() => resetSection(page, 'repuestos_seccion')}>
            <VisibilityField checked={visible} onChange={setVisible} />
            <Separator />
            <p className="text-sm font-medium text-foreground">Encabezado del listado de repuestos</p>
            <TextareaField label='Título (linea nueva para "Repuestos" / "Camal Musalem")' value={data.title ?? ''} onChange={(v) => set('title', v)} rows={2} />
            <TextareaField label="Descripción" value={data.description ?? ''} onChange={(v) => set('description', v)} rows={3} />
            <Separator />
            <p className="text-sm font-medium text-foreground">Bloque "Encargo de repuestos" (imagen + tarjeta lateral)</p>
            <TextareaField label="Título de la tarjeta" value={data.card_title ?? ''} onChange={(v) => set('card_title', v)} rows={2} />
            <TextareaField label="Texto de la tarjeta" value={data.card_text ?? ''} onChange={(v) => set('card_text', v)} rows={6} />
            <TextareaField label="Subtexto" value={data.card_subtext ?? ''} onChange={(v) => set('card_subtext', v)} rows={2} />
            <ResponsiveMediaField
                label="Imagen lateral"
                currentDesktopUrl={data.image ?? ''}
                currentMobileUrl={data.image_mobile ?? ''}
                defaultDesktopUrl={defaultSection2Img}
                onChangeDesktop={setImgFile}
                onChangeMobile={setImgMobileFile}
            />
            <Separator />
            <p className="text-sm font-medium text-foreground">Bloque "Solicitud de encargo de repuestos" (form)</p>
            <TextareaField label="Título del bloque" value={data.form_title ?? ''} onChange={(v) => set('form_title', v)} rows={2} />
            <TextareaField label="Descripción" value={data.form_description ?? ''} onChange={(v) => set('form_description', v)} rows={3} />
            <TextField label="Texto del botón" value={data.form_button_text ?? ''} onChange={(v) => set('form_button_text', v)} />
            <ResponsiveMediaField
                label="Imagen del bloque (con horario)"
                currentDesktopUrl={data.form_image ?? ''}
                currentMobileUrl={data.form_image_mobile ?? ''}
                defaultDesktopUrl={defaultSection3Img}
                onChangeDesktop={setFormImgFile}
                onChangeMobile={setFormImgMobileFile}
            />
        </SectionCard>
    );
}
