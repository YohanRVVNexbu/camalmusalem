import { usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { SectionCard, SectionProp, TextareaField, VisibilityField, resetSection, submitSection } from './_section';

/**
 * Selector de WhatsApp por página. En vez de re-escribir los números en cada
 * página, el admin MARCA cuáles de los contactos del WhatsApp flotante
 * (lista maestra, global) aparecen en esta sección. Pedido del cliente
 * (jun 2026): poder elegir, p. ej., que en Seminuevos solo aparezca
 * "Ventas Seminuevos".
 *
 *  - Lista maestra: `whatsappButton.contacts` (compartido por HandleInertiaRequests).
 *  - La sección guarda los contactos MARCADOS en `contacts` (mismo formato que
 *    consume PostventaWhatsapp), así que el front público no cambia.
 *  - Contactos que ya estaban en la sección y no están en la maestra (legacy)
 *    también se listan, para no perderlos.
 *  - 0 marcados → no se muestra el botón. 1 → enlace directo. 2+ → el cliente
 *    elige la sucursal al pinchar.
 */

type WaContact = { label: string; phone: string };
type WhatsappShared = { contacts?: { label?: string; phone?: string }[]; phone?: string } | null;

const onlyDigits = (p: string) => (p ?? '').replace(/\D/g, '');
const keyOf = (c: WaContact) => `${c.label.trim().toLowerCase()}|${onlyDigits(c.phone)}`;
const normalize = (list: any): WaContact[] =>
    Array.isArray(list)
        ? list.map((x: any) => ({ label: (x.label ?? '').trim(), phone: (x.phone ?? '').trim() })).filter((x: WaContact) => x.phone)
        : [];

export function WhatsappSelector({
    page,
    sectionKey,
    s,
    label,
    description,
    defaultMessage,
}: {
    page: string;
    sectionKey: string;
    s?: SectionProp;
    label: string;
    description: string;
    defaultMessage: string;
}) {
    const { whatsappButton } = usePage<{ whatsappButton: WhatsappShared }>().props;

    const master = useMemo(() => normalize(whatsappButton?.contacts), [whatsappButton]);
    const sectionContacts = useMemo(() => {
        const c = normalize(s?.data?.contacts);
        if (c.length === 0 && s?.data?.phone) return [{ label: 'WhatsApp', phone: s.data.phone }];
        return c;
    }, [s]);

    // Opciones = lista maestra ∪ contactos legacy de la sección que no estén en ella.
    const options = useMemo(() => {
        const seen = new Set(master.map(keyOf));
        return [...master, ...sectionContacts.filter((c) => !seen.has(keyOf(c)))];
    }, [master, sectionContacts]);

    const [selected, setSelected] = useState<Set<string>>(() => new Set(sectionContacts.map(keyOf)));
    const [message, setMessage] = useState<string>(s?.data?.message ?? defaultMessage);
    const [visible, setVisible] = useState(s?.is_visible ?? true);
    const [processing, setProcessing] = useState(false);

    if (!s) return null;

    const toggle = (k: string) =>
        setSelected((prev) => {
            const next = new Set(prev);
            if (next.has(k)) next.delete(k);
            else next.add(k);
            return next;
        });

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const contacts = options.filter((c) => selected.has(keyOf(c))).map((c) => ({ label: c.label, phone: c.phone }));
        submitSection(page, sectionKey, { contacts, message }, visible, {}, setProcessing);
    };

    return (
        <SectionCard
            page={page}
            sectionKey={sectionKey}
            label={label}
            isVisible={visible}
            processing={processing}
            onSubmit={onSubmit}
            onReset={() => resetSection(page, sectionKey)}
        >
            <p className="text-sm text-muted-foreground">{description}</p>
            <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                <strong>Para deshabilitar el botón:</strong> desmarca "Publicado" y guarda. Desaparece de esta página.
            </div>
            <VisibilityField checked={visible} onChange={setVisible} />
            <Separator />
            <div className="flex flex-col gap-2">
                <Label>¿Qué WhatsApp se muestran en esta página?</Label>
                <p className="text-xs text-muted-foreground">
                    Marca cuáles aparecen aquí. Los números se administran en el{' '}
                    <strong>WhatsApp flotante</strong> (Inicio → Botón WhatsApp). Si marcas dos o más, el
                    cliente elige la sucursal al pinchar el botón.
                </p>
                {options.length === 0 ? (
                    <p className="rounded-md border border-dashed p-3 text-sm text-muted-foreground">
                        No hay números configurados todavía. Agrégalos primero en el WhatsApp flotante.
                    </p>
                ) : (
                    <div className="flex flex-col divide-y rounded-lg border">
                        {options.map((c) => {
                            const k = keyOf(c);
                            return (
                                <label key={k} className="flex cursor-pointer items-center gap-3 px-3 py-2.5 hover:bg-accent">
                                    <input
                                        type="checkbox"
                                        checked={selected.has(k)}
                                        onChange={() => toggle(k)}
                                        className="size-4 shrink-0"
                                    />
                                    <span className="flex flex-col">
                                        <span className="text-sm font-medium">{c.label || 'WhatsApp'}</span>
                                        <span className="text-xs text-muted-foreground">{c.phone}</span>
                                    </span>
                                </label>
                            );
                        })}
                    </div>
                )}
            </div>
            <TextareaField label="Mensaje pre-cargado" value={message} onChange={setMessage} rows={2} />
        </SectionCard>
    );
}
