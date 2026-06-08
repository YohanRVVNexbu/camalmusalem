import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import AdminLayout from '@/layouts/admin-layout';
import { ImageField, ResponsiveMediaField, SectionCard, SectionProp, TextField, TextareaField, VisibilityField, resetSection, submitSection } from './_section';
import defaultBannerImg from '@images/seminuevos/hero-image.png?format=webp';
import defaultCertificateImg from '@images/seminuevos/certificate-toyota.png?format=webp';

export default function SeminuevosPage({ sections }: { sections: Record<string, SectionProp> }) {
    const { flash } = usePage<{ flash: { success?: string } }>().props;
    const page = 'seminuevos';
    const s = sections['seminuevos_hero'];
    const [data, setData] = useState(s.data);
    const [visible, setVisible] = useState(s.is_visible);
    const [desktopFile, setDesktopFile] = useState<File | null>(null);
    const [mobileFile, setMobileFile] = useState<File | null>(null);
    const [certificateFile, setCertificateFile] = useState<File | null>(null);
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

                <SectionCard page={page} sectionKey="seminuevos_hero" label="Logo certificado Toyota" isVisible={visible}
                    processing={processing}
                    onSubmit={(e) => { e.preventDefault(); submitSection(page, 'seminuevos_hero', data, visible, { certificate_badge: certificateFile }, setProcessing); }}
                    onReset={() => resetSection(page, 'seminuevos_hero')}>
                    <p className="text-sm text-muted-foreground">
                        Sello que aparece sobre las fotos de los seminuevos certificados.
                    </p>
                    <ImageField
                        label="Logo certificado"
                        currentUrl={data.certificate_badge ?? ''}
                        defaultUrl={defaultCertificateImg}
                        onChange={setCertificateFile}
                        previewClassName="h-24 w-auto max-w-xs rounded-lg object-contain"
                    />
                </SectionCard>

                <WhatsappSection page={page} s={sections['seminuevos_whatsapp']} />
            </div>
        </AdminLayout>
    );
}

type WaContact = { label: string; phone: string };

/**
 * Botón de WhatsApp del detalle de Seminuevos. Mismo patrón que Accesorios:
 * uno o más números por sucursal (con 2+ el cliente elige al pinchar) + el
 * switch "Publicado" para habilitarlo/deshabilitarlo.
 */
function WhatsappSection({ page, s }: { page: string; s?: SectionProp }) {
    const initialContacts: WaContact[] = (() => {
        const c = s?.data?.contacts;
        if (Array.isArray(c) && c.length > 0) return c.map((x: any) => ({ label: x.label ?? '', phone: x.phone ?? '' }));
        if (s?.data?.phone) return [{ label: 'WhatsApp', phone: s.data.phone }];
        return [{ label: 'Sucursal La Serena', phone: '' }, { label: 'Sucursal Ovalle', phone: '' }];
    })();

    const [contacts, setContacts] = useState<WaContact[]>(initialContacts);
    const [message, setMessage] = useState<string>(s?.data?.message ?? 'Hola, me interesa este vehículo: {producto}');
    const [visible, setVisible] = useState(s?.is_visible ?? true);
    const [processing, setProcessing] = useState(false);

    if (!s) return null;

    const setContact = (i: number, k: keyof WaContact, v: string) =>
        setContacts((cs) => cs.map((c, idx) => (idx === i ? { ...c, [k]: v } : c)));
    const addContact = () => setContacts((cs) => [...cs, { label: '', phone: '' }]);
    const removeContact = (i: number) => setContacts((cs) => cs.filter((_, idx) => idx !== i));

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            contacts: contacts.filter((c) => c.phone.trim() !== '').map((c) => ({ label: c.label.trim(), phone: c.phone.trim() })),
            message,
        };
        submitSection(page, 'seminuevos_whatsapp', payload, visible, {}, setProcessing);
    };

    return (
        <SectionCard page={page} sectionKey="seminuevos_whatsapp" label="Botón WhatsApp (detalle de seminuevos)" isVisible={visible}
            processing={processing}
            onSubmit={onSubmit}
            onReset={() => resetSection(page, 'seminuevos_whatsapp')}>
            <p className="text-sm text-muted-foreground">
                Aparece en el detalle de cada seminuevo. Si cargas <strong>dos o más</strong> números, al pinchar el
                botón el cliente <strong>elige la sucursal</strong>. El mensaje usa <code>{'{producto}'}</code> para
                insertar el nombre del vehículo.
            </p>
            <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                <strong>Para deshabilitar el botón:</strong> desmarca "Publicado" y guarda. Desaparece de todos los seminuevos.
            </div>
            <VisibilityField checked={visible} onChange={setVisible} />
            <Separator />
            <div className="flex flex-col gap-3">
                <Label>Números por sucursal</Label>
                {contacts.map((c, i) => (
                    <div key={i} className="grid gap-2 rounded-lg border p-3">
                        <TextField label="Nombre de la sucursal (ej. Sucursal La Serena)" value={c.label} onChange={(v) => setContact(i, 'label', v)} />
                        <TextField label="Teléfono (con código país, ej. +56912345678)" value={c.phone} onChange={(v) => setContact(i, 'phone', v)} />
                        {contacts.length > 1 && (
                            <button type="button" onClick={() => removeContact(i)} className="self-start text-xs text-destructive underline">
                                Quitar este número
                            </button>
                        )}
                    </div>
                ))}
                <button type="button" onClick={addContact} className="self-start rounded-md border px-3 py-1.5 text-sm hover:bg-accent">
                    + Agregar número
                </button>
            </div>
            <TextareaField label="Mensaje pre-cargado" value={message} onChange={setMessage} rows={2} />
        </SectionCard>
    );
}
