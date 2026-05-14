import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Separator } from '@/components/ui/separator';
import AdminLayout from '@/layouts/admin-layout';
import { ResponsiveMediaField, SectionCard, SectionProp, TextField, TextareaField, VisibilityField, resetSection, submitSection } from './_section';
import defaultHeroImg from '@images/mantencion/hero-imagen.png?format=webp';

export default function MantencionPage({ sections }: { sections: Record<string, SectionProp> }) {
    const { flash } = usePage<{ flash: { success?: string } }>().props;
    const page = 'mantencion';
    const s = sections['mantencion_hero'];
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
            { title: 'Agendar Mantención', href: '#' },
        ]}>
            <Head title="Admin — Mantención (Hero)" />
            <div className="flex flex-col gap-4 p-4">
                <h1 className="text-2xl font-semibold">Agendar Mantención — Hero</h1>
                {flash?.success && (
                    <div className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700">{flash.success}</div>
                )}
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
            </div>
        </AdminLayout>
    );
}
