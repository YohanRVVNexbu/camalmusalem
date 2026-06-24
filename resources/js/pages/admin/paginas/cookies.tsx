import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';

import { Separator } from '@/components/ui/separator';
import AdminLayout from '@/layouts/admin-layout';

import {
    SectionCard, SectionProp, TextField, TextareaField,
    VisibilityField, resetSection, submitSection,
} from './_section';

export default function CookiesPage({ sections }: { sections: Record<string, SectionProp> }) {
    const { flash } = usePage<{ flash: { success?: string } }>().props;
    const page = 'cookies';

    return (
        <AdminLayout breadcrumbs={[
            { title: 'Dashboard', href: '/admin' },
            { title: 'Páginas', href: '/admin/paginas' },
            { title: 'Cookies', href: '#' },
        ]}>
            <Head title="Admin — Cookies" />
            <div className="flex flex-col gap-4 p-4">
                <h1 className="text-2xl font-semibold">Cookies (banner + política)</h1>
                <p className="text-sm text-muted-foreground">
                    Textos del banner de consentimiento que aparece en el sitio y de la página{' '}
                    <code>/politica-de-cookies</code>. Si desactivas la visibilidad del banner, deja de aparecer el pop-up.
                    Para forzar que vuelva a aparecer a quienes ya aceptaron (por un cambio legal), sube el número en
                    <strong> “Versión de política”</strong>.
                </p>
                {flash?.success && (
                    <div className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700">
                        {flash.success}
                    </div>
                )}

                <BannerSection page={page} s={sections['cookies_banner']} />
                <PolicySection page={page} s={sections['cookies_policy']} />
            </div>
        </AdminLayout>
    );
}

function BannerSection({ page, s }: { page: string; s: SectionProp }) {
    const [data, setData] = useState(s.data);
    const [visible, setVisible] = useState(s.is_visible);
    const [processing, setProcessing] = useState(false);
    const set = (k: string, v: string) => setData((d: any) => ({ ...d, [k]: v }));

    return (
        <SectionCard page={page} sectionKey="cookies_banner" label="Banner de consentimiento" isVisible={visible}
            processing={processing}
            onSubmit={(e) => { e.preventDefault(); submitSection(page, 'cookies_banner', data, visible, {}, setProcessing); }}
            onReset={() => resetSection(page, 'cookies_banner')}>
            <VisibilityField checked={visible} onChange={setVisible} />
            <Separator />

            <TextField label="Título" value={data.title ?? ''} onChange={(v) => set('title', v)} />
            <TextareaField label="Descripción" value={data.description ?? ''} onChange={(v) => set('description', v)} rows={3} />

            <div className="grid gap-3 md:grid-cols-2">
                <TextField label="Botón Aceptar todo" value={data.accept_label ?? ''} onChange={(v) => set('accept_label', v)} />
                <TextField label="Botón Rechazar" value={data.reject_label ?? ''} onChange={(v) => set('reject_label', v)} />
                <TextField label="Botón Configurar" value={data.settings_label ?? ''} onChange={(v) => set('settings_label', v)} />
                <TextField label="Botón Guardar preferencias" value={data.save_label ?? ''} onChange={(v) => set('save_label', v)} />
            </div>

            <Separator />
            <h4 className="text-base font-semibold">Panel de preferencias (por categoría)</h4>
            <TextField label="Título del panel" value={data.prefs_title ?? ''} onChange={(v) => set('prefs_title', v)} />
            <div className="grid gap-3 md:grid-cols-2">
                <TextField label="Necesarias — título" value={data.necessary_title ?? ''} onChange={(v) => set('necessary_title', v)} />
                <TextField label="Necesarias — descripción" value={data.necessary_desc ?? ''} onChange={(v) => set('necessary_desc', v)} />
                <TextField label="Analíticas — título" value={data.analytics_title ?? ''} onChange={(v) => set('analytics_title', v)} />
                <TextField label="Analíticas — descripción" value={data.analytics_desc ?? ''} onChange={(v) => set('analytics_desc', v)} />
                <TextField label="Marketing — título" value={data.marketing_title ?? ''} onChange={(v) => set('marketing_title', v)} />
                <TextField label="Marketing — descripción" value={data.marketing_desc ?? ''} onChange={(v) => set('marketing_desc', v)} />
            </div>

            <Separator />
            <div className="grid gap-3 md:grid-cols-2">
                <TextField label="URL de la política" value={data.policy_url ?? ''} onChange={(v) => set('policy_url', v)} placeholder="/politica-de-cookies" />
                <TextField label="Texto del enlace a la política" value={data.policy_link_label ?? ''} onChange={(v) => set('policy_link_label', v)} />
                <TextField label="Versión de política (subir el número re-pregunta)" value={data.policy_version ?? '1'} onChange={(v) => set('policy_version', v)} />
            </div>
        </SectionCard>
    );
}

function PolicySection({ page, s }: { page: string; s: SectionProp }) {
    const [data, setData] = useState(s.data);
    const [visible, setVisible] = useState(s.is_visible);
    const [processing, setProcessing] = useState(false);
    const set = (k: string, v: string) => setData((d: any) => ({ ...d, [k]: v }));

    return (
        <SectionCard page={page} sectionKey="cookies_policy" label="Página de Política de Cookies" isVisible={visible}
            processing={processing}
            onSubmit={(e) => { e.preventDefault(); submitSection(page, 'cookies_policy', data, visible, {}, setProcessing); }}
            onReset={() => resetSection(page, 'cookies_policy')}>
            <VisibilityField checked={visible} onChange={setVisible} />
            <Separator />
            <TextField label="Título" value={data.title ?? ''} onChange={(v) => set('title', v)} />
            <TextField label="Etiqueta de actualización" value={data.updated_label ?? ''} onChange={(v) => set('updated_label', v)} placeholder="Última actualización: junio 2026" />
            <TextareaField label="Contenido (texto plano; los saltos de línea se respetan)" value={data.content ?? ''} onChange={(v) => set('content', v)} rows={16} />
        </SectionCard>
    );
}
