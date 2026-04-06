import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Separator } from '@/components/ui/separator';
import AdminLayout from '@/layouts/admin-layout';
import { ImageField, SectionCard, SectionProp, TextField, VisibilityField, resetSection, submitSection } from './_section';
import defaultHeroImg from '@images/noticias/hero_image.png?format=webp';

export default function NoticiasPage({ sections }: { sections: Record<string, SectionProp> }) {
    const { flash } = usePage<{ flash: { success?: string } }>().props;
    const page = 'noticias';
    const s = sections['noticias_hero'];
    const [data, setData] = useState(s.data);
    const [visible, setVisible] = useState(s.is_visible);
    const [file, setFile] = useState<File | null>(null);
    const [processing, setProcessing] = useState(false);
    const set = (k: string, v: any) => setData((d: any) => ({ ...d, [k]: v }));

    return (
        <AdminLayout breadcrumbs={[
            { title: 'Dashboard', href: '/admin' },
            { title: 'Páginas', href: '/admin/paginas' },
            { title: 'Noticias', href: '#' },
        ]}>
            <Head title="Admin — Noticias (Hero)" />
            <div className="flex flex-col gap-4 p-4">
                <h1 className="text-2xl font-semibold">Noticias — Hero</h1>
                {flash?.success && (
                    <div className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700">{flash.success}</div>
                )}
                <SectionCard page={page} sectionKey="noticias_hero" label="Hero" isVisible={visible}
                    processing={processing}
                    onSubmit={(e) => { e.preventDefault(); submitSection(page, 'noticias_hero', data, visible, { hero_image: file }, setProcessing); }}
                    onReset={() => resetSection(page, 'noticias_hero')}>
                    <VisibilityField checked={visible} onChange={setVisible} />
                    <Separator />
                    <ImageField label="Imagen hero" currentUrl={data.hero_image ?? ''} defaultUrl={defaultHeroImg} onChange={setFile} />
                    <TextField label="Título" value={data.title ?? ''} onChange={(v) => set('title', v)} />
                </SectionCard>
            </div>
        </AdminLayout>
    );
}
