import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Separator } from '@/components/ui/separator';
import AdminLayout from '@/layouts/admin-layout';
import {
    ResponsiveMediaField, SectionCard, SectionProp, TextField,
    VisibilityField, resetSection, submitSection,
} from './_section';
import defaultImg from '@images/seminuevos/ejemplo-video.png?format=webp';

export default function BannerCtaPage({ sections }: { sections: Record<string, SectionProp> }) {
    const { flash } = usePage<{ flash: { success?: string } }>().props;
    const page = 'banner-cta';
    const s = sections['contact_cta_banner'];

    const [data, setData] = useState(s.data);
    const [visible, setVisible] = useState(s.is_visible);
    const [desktopFile, setDesktopFile] = useState<File | null>(null);
    const [mobileFile, setMobileFile] = useState<File | null>(null);
    const [processing, setProcessing] = useState(false);

    const set = (k: string, v: any) => setData((d: any) => ({ ...d, [k]: v }));

    return (
        <AdminLayout breadcrumbs={[
            { title: 'Dashboard', href: '/admin' },
            { title: 'Páginas', href: '/admin/paginas' },
            { title: 'Banner Contáctanos', href: '#' },
        ]}>
            <Head title="Admin — Banner Contáctanos" />
            <div className="flex flex-col gap-4 p-4">
                <h1 className="text-2xl font-semibold">Banner Contáctanos (global)</h1>
                <p className="text-sm text-muted-foreground">
                    Aparece en: Programas, KINTO, Seminuevos (detalle), Vehículos nuevos (detalle),
                    Accesorios, Repuestos, Agendar mantención. Si lo ocultas, deja de mostrarse en todas.
                </p>
                {flash?.success && (
                    <div className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700">{flash.success}</div>
                )}
                <SectionCard page={page} sectionKey="contact_cta_banner" label="Banner Contáctanos" isVisible={visible}
                    processing={processing}
                    onSubmit={(e) => {
                        e.preventDefault();
                        submitSection(page, 'contact_cta_banner', data, visible, { image: desktopFile, image_mobile: mobileFile }, setProcessing);
                    }}
                    onReset={() => resetSection(page, 'contact_cta_banner')}>
                    <VisibilityField checked={visible} onChange={setVisible} />
                    <Separator />
                    <ResponsiveMediaField
                        label="Imagen de fondo"
                        currentDesktopUrl={data.image ?? ''}
                        currentMobileUrl={data.image_mobile ?? ''}
                        defaultDesktopUrl={defaultImg}
                        defaultMobileUrl={defaultImg}
                        onChangeDesktop={setDesktopFile}
                        onChangeMobile={setMobileFile}
                    />
                    <TextField label="Texto principal" value={data.text ?? ''} onChange={(v) => set('text', v)} placeholder="Contáctanos para recibir asesoría personalizada" />
                    <TextField label="Texto del botón" value={data.button_label ?? ''} onChange={(v) => set('button_label', v)} placeholder="Contactar ventas" />
                    <TextField label="Enlace del botón" value={data.button_href ?? ''} onChange={(v) => set('button_href', v)} placeholder="/contacto" />
                </SectionCard>
            </div>
        </AdminLayout>
    );
}
