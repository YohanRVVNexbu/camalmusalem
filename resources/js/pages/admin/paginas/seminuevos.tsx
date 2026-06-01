import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Separator } from '@/components/ui/separator';
import AdminLayout from '@/layouts/admin-layout';
import { ResponsiveMediaField, SectionCard, SectionProp, TextField, TextareaField, VisibilityField, resetSection, submitSection } from './_section';
import defaultBannerImg from '@images/seminuevos/hero-image.png?format=webp';

export default function SeminuevosPage({ sections }: { sections: Record<string, SectionProp> }) {
    const { flash } = usePage<{ flash: { success?: string } }>().props;
    const page = 'seminuevos';
    const s = sections['seminuevos_hero'];
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
            { title: 'Seminuevos', href: '#' },
        ]}>
            <Head title="Admin — Seminuevos (Hero)" />
            <div className="flex flex-col gap-4 p-4">
                <h1 className="text-2xl font-semibold">Seminuevos — Hero</h1>
                {flash?.success && (
                    <div className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700">{flash.success}</div>
                )}
                <SectionCard page={page} sectionKey="seminuevos_hero" label="Hero / Banner" isVisible={visible}
                    processing={processing}
                    onSubmit={(e) => { e.preventDefault(); submitSection(page, 'seminuevos_hero', data, visible, { banner_image: desktopFile, banner_image_mobile: mobileFile }, setProcessing); }}
                    onReset={() => resetSection(page, 'seminuevos_hero')}>
                    <VisibilityField checked={visible} onChange={setVisible} />
                    <Separator />
                    <ResponsiveMediaField
                        label="Banner (imagen o video)"
                        currentDesktopUrl={data.banner_image ?? ''}
                        currentMobileUrl={data.banner_image_mobile ?? ''}
                        defaultDesktopUrl={defaultBannerImg}
                        onChangeDesktop={setDesktopFile}
                        onChangeMobile={setMobileFile}
                    />
                    <TextField label="Título sobre el banner (opcional)" value={data.title ?? ''} onChange={(v) => set('title', v)} />
                    <TextField label="Título de la sección (debajo del banner)" value={data.section_title ?? ''} onChange={(v) => set('section_title', v)} placeholder='Ej: Seminuevos certificados por Musalem' />
                    <TextareaField label="Descripción (debajo del título)" value={data.description ?? ''} onChange={(v) => set('description', v)} rows={3} />
                </SectionCard>
            </div>
        </AdminLayout>
    );
}
