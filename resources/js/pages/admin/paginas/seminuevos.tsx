import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Separator } from '@/components/ui/separator';
import AdminLayout from '@/layouts/admin-layout';
import { ImageField, SectionCard, SectionProp, TextField, TextareaField, VisibilityField, resetSection, submitSection } from './_section';
import defaultBannerImg from '@images/seminuevos/hero-image.png?format=webp';

export default function SeminuevosPage({ sections }: { sections: Record<string, SectionProp> }) {
    const { flash } = usePage<{ flash: { success?: string } }>().props;
    const page = 'seminuevos';
    const s = sections['seminuevos_hero'];
    const [data, setData] = useState(s.data);
    const [visible, setVisible] = useState(s.is_visible);
    const [file, setFile] = useState<File | null>(null);
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
                    onSubmit={(e) => { e.preventDefault(); submitSection(page, 'seminuevos_hero', data, visible, { banner_image: file }, setProcessing); }}
                    onReset={() => resetSection(page, 'seminuevos_hero')}>
                    <VisibilityField checked={visible} onChange={setVisible} />
                    <Separator />
                    <ImageField label="Imagen banner" currentUrl={data.banner_image ?? ''} defaultUrl={defaultBannerImg} onChange={setFile} />
                    <TextField label="Título" value={data.title ?? ''} onChange={(v) => set('title', v)} />
                    <TextareaField label="Descripción" value={data.description ?? ''} onChange={(v) => set('description', v)} rows={3} />
                </SectionCard>
            </div>
        </AdminLayout>
    );
}
