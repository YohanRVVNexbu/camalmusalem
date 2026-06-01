import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Plus, X as XIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import AdminLayout from '@/layouts/admin-layout';
import { SectionCard, SectionProp, VisibilityField, resetSection, submitSection } from './_section';

type Contact = { label: string; phone: string; message: string };

/**
 * Normaliza data antigua (`{phone, message}`) al nuevo shape (`{contacts: [...]}`)
 * para que el admin no se rompa si la migración no se aplicó por algún motivo.
 */
function normalizeContacts(raw: any): Contact[] {
    if (raw && Array.isArray(raw.contacts)) {
        return raw.contacts.map((c: any) => ({
            label: c.label ?? '',
            phone: c.phone ?? '',
            message: c.message ?? '',
        }));
    }
    if (raw && (raw.phone || raw.message)) {
        return [{ label: 'Contacto', phone: raw.phone ?? '', message: raw.message ?? '' }];
    }
    return [];
}

export default function WhatsappPage({ sections }: { sections: Record<string, SectionProp> }) {
    const { flash } = usePage<{ flash: { success?: string } }>().props;
    const page = 'whatsapp';
    const s = sections['whatsapp_button'];

    const [contacts, setContacts] = useState<Contact[]>(() => normalizeContacts(s.data));
    const [visible, setVisible] = useState(s.is_visible);
    const [processing, setProcessing] = useState(false);

    const updateContact = (i: number, patch: Partial<Contact>) => {
        const next = [...contacts];
        next[i] = { ...next[i], ...patch };
        setContacts(next);
    };
    const addContact = () => setContacts([...contacts, { label: '', phone: '', message: '' }]);
    const removeContact = (i: number) => setContacts(contacts.filter((_, j) => j !== i));

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
                    Si lo desactivás, deja de mostrarse por completo. Si hay un solo contacto, el botón
                    abre WhatsApp directamente; si hay 2 o más, el visitante elige a quién contactar
                    desde un menú.
                </p>
                {flash?.success && (
                    <div className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700">{flash.success}</div>
                )}
                <SectionCard
                    page={page}
                    sectionKey="whatsapp_button"
                    label="Botón WhatsApp"
                    isVisible={visible}
                    processing={processing}
                    onSubmit={(e) => {
                        e.preventDefault();
                        submitSection(page, 'whatsapp_button', { contacts }, visible, {}, setProcessing);
                    }}
                    onReset={() => resetSection(page, 'whatsapp_button')}
                >
                    <VisibilityField checked={visible} onChange={setVisible} />
                    <Separator />

                    <div className="flex items-center justify-between">
                        <h4 className="text-base font-semibold">Contactos</h4>
                        <Button type="button" variant="outline" size="sm" onClick={addContact}>
                            <Plus className="mr-1 size-4" /> Agregar contacto
                        </Button>
                    </div>

                    {contacts.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                            Aún no hay contactos. Agregá al menos uno para que el botón aparezca en la home.
                        </p>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {contacts.map((c, i) => (
                                <div key={i} className="rounded-lg border p-4">
                                    <div className="mb-3 flex items-center justify-between">
                                        <span className="text-sm font-medium">Contacto {i + 1}</span>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeContact(i)}
                                            title="Quitar contacto"
                                            className="text-destructive"
                                        >
                                            <XIcon className="size-4" />
                                        </Button>
                                    </div>
                                    <div className="grid gap-3 md:grid-cols-2">
                                        <div className="grid gap-2">
                                            <Label>Etiqueta visible</Label>
                                            <Input
                                                value={c.label}
                                                onChange={(e) => updateContact(i, { label: e.target.value })}
                                                placeholder="Ej: Ventas La Serena"
                                            />
                                            <p className="text-xs text-muted-foreground">
                                                Aparece en el menú cuando hay varios contactos (ignorado si solo
                                                hay uno).
                                            </p>
                                        </div>
                                        <div className="grid gap-2">
                                            <Label>Número de teléfono</Label>
                                            <Input
                                                value={c.phone}
                                                onChange={(e) => updateContact(i, { phone: e.target.value })}
                                                placeholder="+56 9 1234 5678"
                                            />
                                            <p className="text-xs text-muted-foreground">
                                                Con código de país. Los espacios y guiones se ignoran (ej.{' '}
                                                <code>+56 9 1234 5678</code> → <code>wa.me/56912345678</code>).
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-3 grid gap-2">
                                        <Label>Mensaje pre-cargado</Label>
                                        <Textarea
                                            value={c.message}
                                            onChange={(e) => updateContact(i, { message: e.target.value })}
                                            placeholder="Hola, quisiera información sobre los vehículos Toyota."
                                            rows={2}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </SectionCard>
            </div>
        </AdminLayout>
    );
}
