import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import AdminLayout from '@/layouts/admin-layout';
import { ResponsiveMediaField, SectionCard, SectionProp, TextField, TextareaField, VisibilityField, resetSection, submitSection } from './_section';
import defaultHeroImg from '@images/navbar/accesorios.png?format=webp';
import defaultSeccionImg from '@images/accesorios/image_section2.png?format=webp';

export default function AccesoriosPage({ sections }: { sections: Record<string, SectionProp> }) {
    const { flash } = usePage<{ flash: { success?: string } }>().props;
    const page = 'accesorios';

    return (
        <AdminLayout breadcrumbs={[
            { title: 'Dashboard', href: '/admin' },
            { title: 'Páginas', href: '/admin/paginas' },
            { title: 'Accesorios y Merch', href: '#' },
        ]}>
            <Head title="Admin — Accesorios y Merch" />
            <div className="flex flex-col gap-4 p-4">
                <h1 className="text-2xl font-semibold">Accesorios y Merch</h1>
                {flash?.success && (
                    <div className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700">{flash.success}</div>
                )}
                <HeroSection page={page} s={sections['accesorios_hero']} />
                <SeccionSection page={page} s={sections['accesorios_seccion']} />
                <WhatsappSection page={page} s={sections['accesorios_whatsapp']} />
            </div>
        </AdminLayout>
    );
}

type WaContact = { label: string; phone: string };

function WhatsappSection({ page, s }: { page: string; s?: SectionProp }) {
    // Estructura nueva: lista de números por sucursal. Si en BD solo existe el
    // número viejo (`phone`), lo migramos a un contacto. Si no hay nada, se
    // arranca con las dos sucursales para que el cliente solo complete números.
    const initialContacts: WaContact[] = (() => {
        const c = s?.data?.contacts;
        if (Array.isArray(c) && c.length > 0) {
            return c.map((x: any) => ({ label: x.label ?? '', phone: x.phone ?? '' }));
        }
        if (s?.data?.phone) return [{ label: 'WhatsApp', phone: s.data.phone }];
        return [{ label: 'Sucursal La Serena', phone: '' }, { label: 'Sucursal Ovalle', phone: '' }];
    })();

    const [contacts, setContacts] = useState<WaContact[]>(initialContacts);
    const [message, setMessage] = useState<string>(s?.data?.message ?? 'Hola, quiero cotizar por el producto');
    const [visible, setVisible] = useState(s?.is_visible ?? true);
    const [processing, setProcessing] = useState(false);

    if (!s) return null;

    const setContact = (i: number, k: keyof WaContact, v: string) =>
        setContacts((cs) => cs.map((c, idx) => (idx === i ? { ...c, [k]: v } : c)));
    const addContact = () => setContacts((cs) => [...cs, { label: '', phone: '' }]);
    const removeContact = (i: number) => setContacts((cs) => cs.filter((_, idx) => idx !== i));

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Guardamos solo los contactos con teléfono. Limpiamos el `phone` viejo.
        const data = {
            contacts: contacts.filter((c) => c.phone.trim() !== '').map((c) => ({ label: c.label.trim(), phone: c.phone.trim() })),
            message,
        };
        submitSection(page, 'accesorios_whatsapp', data, visible, {}, setProcessing);
    };

    return (
        <SectionCard page={page} sectionKey="accesorios_whatsapp" label="Botón WhatsApp (detalle de productos)" isVisible={visible}
            processing={processing}
            onSubmit={onSubmit}
            onReset={() => resetSection(page, 'accesorios_whatsapp')}>
            <p className="text-sm text-muted-foreground">
                Aparece en el detalle (show) de cada Accesorio y Merch. Si cargas <strong>dos o más</strong> números,
                al pinchar el botón el cliente <strong>elige la sucursal</strong>. Con un solo número, abre WhatsApp directo.
            </p>
            <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                <strong>Para deshabilitar el botón</strong> (mientras no tengan un número definitivo): desmarca
                "Publicado" aquí abajo y guarda. El botón desaparece de todas las fichas. Cuando lo vuelvas a marcar, reaparece.
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
            <TextareaField
                label="Mensaje pre-cargado (se le agrega el nombre del producto; usa {producto} para ubicarlo en el texto)"
                value={message}
                onChange={setMessage}
                rows={2}
            />
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
        <SectionCard page={page} sectionKey="accesorios_hero" label="Hero" isVisible={visible}
            processing={processing}
            onSubmit={(e) => { e.preventDefault(); submitSection(page, 'accesorios_hero', data, visible, { hero_image: desktopFile, hero_image_mobile: mobileFile }, setProcessing); }}
            onReset={() => resetSection(page, 'accesorios_hero')}>
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
    const [processing, setProcessing] = useState(false);
    const set = (k: string, v: any) => setData((d: any) => ({ ...d, [k]: v }));

    return (
        <SectionCard page={page} sectionKey="accesorios_seccion" label='Sección "Merch Oficial Toyota"' isVisible={visible}
            processing={processing}
            onSubmit={(e) => {
                e.preventDefault();
                submitSection(page, 'accesorios_seccion', data, visible, {
                    image: imgFile,
                    image_mobile: imgMobileFile,
                }, setProcessing);
            }}
            onReset={() => resetSection(page, 'accesorios_seccion')}>
            <VisibilityField checked={visible} onChange={setVisible} />
            <Separator />
            <TextareaField label='Título (línea nueva para "Merch" / "Oficial Toyota")' value={data.title ?? ''} onChange={(v) => set('title', v)} rows={2} />
            <TextareaField label="Descripción" value={data.description ?? ''} onChange={(v) => set('description', v)} rows={3} />
            <ResponsiveMediaField
                label="Imagen lateral"
                currentDesktopUrl={data.image ?? ''}
                currentMobileUrl={data.image_mobile ?? ''}
                defaultDesktopUrl={defaultSeccionImg}
                onChangeDesktop={setImgFile}
                onChangeMobile={setImgMobileFile}
            />
        </SectionCard>
    );
}
