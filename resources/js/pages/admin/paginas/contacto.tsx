import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Separator } from '@/components/ui/separator';
import AdminLayout from '@/layouts/admin-layout';
import {
    ResponsiveMediaField, SectionCard, SectionProp, TextField,
    VisibilityField, resetSection, submitSection,
} from './_section';
import defaultFormImg from '@images/contacto/form_image.png?format=webp';

export default function ContactoPage({ sections }: { sections: Record<string, SectionProp> }) {
    const { flash } = usePage<{ flash: { success?: string } }>().props;
    const page = 'contacto';

    return (
        <AdminLayout breadcrumbs={[
            { title: 'Dashboard', href: '/admin' },
            { title: 'Páginas', href: '/admin/paginas' },
            { title: 'Contacto', href: '#' },
        ]}>
            <Head title="Admin — Contacto" />
            <div className="flex flex-col gap-4 p-4">
                <h1 className="text-2xl font-semibold">Contacto</h1>
                {flash?.success && (
                    <div className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700">
                        {flash.success}
                    </div>
                )}
                <ContactoInfoSection page={page} s={sections['contacto_info']} />
            </div>
        </AdminLayout>
    );
}

function ContactoInfoSection({ page, s }: { page: string; s: SectionProp }) {
    const [data, setData] = useState(s.data);
    const [visible, setVisible] = useState(s.is_visible);
    const [desktopFile, setDesktopFile] = useState<File | null>(null);
    const [mobileFile, setMobileFile] = useState<File | null>(null);
    const [processing, setProcessing] = useState(false);
    const set = (k: string, v: any) => setData((d: any) => ({ ...d, [k]: v }));

    return (
        <SectionCard page={page} sectionKey="contacto_info" label="Información y formulario" isVisible={visible}
            processing={processing}
            onSubmit={(e) => { e.preventDefault(); submitSection(page, 'contacto_info', data, visible, { form_image: desktopFile, form_image_mobile: mobileFile }, setProcessing); }}
            onReset={() => resetSection(page, 'contacto_info')}>
            <VisibilityField checked={visible} onChange={setVisible} />
            <Separator />
            <ResponsiveMediaField
                label="Imagen lateral (formulario)"
                currentDesktopUrl={data.form_image ?? ''}
                currentMobileUrl={data.form_image_mobile ?? ''}
                defaultDesktopUrl={defaultFormImg}
                onChangeDesktop={setDesktopFile}
                onChangeMobile={setMobileFile}
            />
            <div className="grid grid-cols-2 gap-4">
                <TextField label="Horario Lunes a Viernes" value={data.horario_lv ?? ''} onChange={(v) => set('horario_lv', v)} placeholder="09:00 a 13:30 - 14:45 a 18:30" />
                <TextField label="Horario Sábado / Domingo" value={data.horario_sab ?? ''} onChange={(v) => set('horario_sab', v)} placeholder="Cerrado" />
            </div>
            <TextField label="Correo electrónico" value={data.email ?? ''} onChange={(v) => set('email', v)} />
            <Separator />
            <p className="text-sm font-medium text-muted-foreground">Textos del formulario</p>
            <TextField label="Título del formulario" value={data.form_title ?? ''} onChange={(v) => set('form_title', v)} />
            <TextField label="Subtítulo" value={data.form_subtitle ?? ''} onChange={(v) => set('form_subtitle', v)} />
            <TextField label="Descripción" value={data.form_desc ?? ''} onChange={(v) => set('form_desc', v)} />
        </SectionCard>
    );
}
