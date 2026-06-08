import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import AdminLayout from '@/layouts/admin-layout';
import { ResponsiveMediaField, SectionCard, SectionProp, TextField, TextareaField, VisibilityField, resetSection, submitSection } from './_section';
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
                <WhatsappSection page={page} s={sections['repuestos_whatsapp']} />
            </div>
        </AdminLayout>
    );
}

type WaContact = { label: string; phone: string };

/** Botón de WhatsApp del detalle de Repuestos (uno o más números + switch). */
function WhatsappSection({ page, s }: { page: string; s?: SectionProp }) {
    const initialContacts: WaContact[] = (() => {
        const c = s?.data?.contacts;
        if (Array.isArray(c) && c.length > 0) return c.map((x: any) => ({ label: x.label ?? '', phone: x.phone ?? '' }));
        if (s?.data?.phone) return [{ label: 'WhatsApp', phone: s.data.phone }];
        return [{ label: 'Sucursal La Serena', phone: '' }, { label: 'Sucursal Ovalle', phone: '' }];
    })();

    const [contacts, setContacts] = useState<WaContact[]>(initialContacts);
    const [message, setMessage] = useState<string>(s?.data?.message ?? 'Hola, quiero consultar por el repuesto: {producto}');
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
        submitSection(page, 'repuestos_whatsapp', payload, visible, {}, setProcessing);
    };

    return (
        <SectionCard page={page} sectionKey="repuestos_whatsapp" label="Botón WhatsApp (detalle de repuestos)" isVisible={visible}
            processing={processing}
            onSubmit={onSubmit}
            onReset={() => resetSection(page, 'repuestos_whatsapp')}>
            <p className="text-sm text-muted-foreground">
                Aparece en el detalle de cada repuesto. Con <strong>dos o más</strong> números, al pinchar el botón
                el cliente <strong>elige la sucursal</strong>. El mensaje usa <code>{'{producto}'}</code> para el nombre del repuesto.
            </p>
            <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                <strong>Para deshabilitar el botón:</strong> desmarca "Publicado" y guarda.
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
