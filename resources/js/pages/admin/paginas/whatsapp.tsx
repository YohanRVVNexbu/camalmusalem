import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Separator } from '@/components/ui/separator';
import AdminLayout from '@/layouts/admin-layout';
import {
    SectionCard, SectionProp, TextField, TextareaField,
    VisibilityField, resetSection, submitSection,
} from './_section';

export default function WhatsappPage({ sections }: { sections: Record<string, SectionProp> }) {
    const { flash } = usePage<{ flash: { success?: string } }>().props;
    const page = 'whatsapp';
    const s = sections['whatsapp_button'];

    const [data, setData] = useState(s.data);
    const [visible, setVisible] = useState(s.is_visible);
    const [processing, setProcessing] = useState(false);

    const set = (k: string, v: any) => setData((d: any) => ({ ...d, [k]: v }));

    return (
        <AdminLayout breadcrumbs={[
            { title: 'Dashboard', href: '/admin' },
            { title: 'Páginas', href: '/admin/paginas' },
            { title: 'Botón WhatsApp', href: '#' },
        ]}>
            <Head title="Admin — Botón WhatsApp" />
            <div className="flex flex-col gap-4 p-4">
                <h1 className="text-2xl font-semibold">Botón WhatsApp (flotante)</h1>
                <p className="text-sm text-muted-foreground">
                    Aparece como botón circular fijo abajo a la derecha solo en la home (<code>/</code>).
                    Si lo desactivas, deja de mostrarse por completo.
                </p>
                {flash?.success && (
                    <div className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700">{flash.success}</div>
                )}
                <SectionCard page={page} sectionKey="whatsapp_button" label="Botón WhatsApp" isVisible={visible}
                    processing={processing}
                    onSubmit={(e) => {
                        e.preventDefault();
                        submitSection(page, 'whatsapp_button', data, visible, {}, setProcessing);
                    }}
                    onReset={() => resetSection(page, 'whatsapp_button')}>
                    <VisibilityField checked={visible} onChange={setVisible} />
                    <Separator />
                    <TextField
                        label="Número de teléfono"
                        value={data.phone ?? ''}
                        onChange={(v) => set('phone', v)}
                        placeholder="+56 9 1234 5678"
                    />
                    <p className="-mt-2 text-xs text-muted-foreground">
                        Incluye código de país. Los espacios, paréntesis y guiones se ignoran automáticamente
                        (ej: <code>+56 9 1234 5678</code> → <code>wa.me/56912345678</code>).
                    </p>
                    <TextareaField
                        label="Mensaje pre-cargado"
                        value={data.message ?? ''}
                        onChange={(v) => set('message', v)}
                        placeholder="Hola, quisiera información sobre los vehículos Toyota."
                        rows={3}
                    />
                    <p className="-mt-2 text-xs text-muted-foreground">
                        Texto que aparece escrito en el chat de WhatsApp al hacer clic. Si lo dejas vacío,
                        WhatsApp se abre sin mensaje.
                    </p>
                </SectionCard>
            </div>
        </AdminLayout>
    );
}
