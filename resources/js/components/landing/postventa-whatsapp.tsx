import { useEffect, useRef, useState } from 'react';

export type PostventaWhatsappContact = { label?: string; phone?: string };
export type PostventaWhatsappConfig = {
    // Estructura nueva: varios números (uno por sucursal). El cliente elige al
    // pinchar el botón.
    contacts?: PostventaWhatsappContact[];
    // Estructura vieja: un solo número. Se mantiene por compat.
    phone?: string;
    message?: string;
} | null;

const WHATSAPP_ICON_PATH = 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z';

function buildHref(phone: string | undefined, message: string, productName: string): string | null {
    const digits = (phone ?? '').replace(/\D/g, '');
    if (digits.length < 8) return null;
    const base = message.trim() || 'Hola, quiero cotizar por el producto';
    const text = base.includes('{producto}') ? base.replaceAll('{producto}', productName) : `${base} ${productName}`;
    return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

const BUTTON_CLASS =
    'flex h-12 w-full cursor-pointer items-center justify-center gap-2.5 rounded-[60px] bg-[#40BE4C] text-base leading-none text-white transition hover:bg-[#38a843]';

const ICON = (
    <svg className="size-5" viewBox="0 0 24 24" fill="currentColor">
        <path d={WHATSAPP_ICON_PATH} />
    </svg>
);

/**
 * Botón de WhatsApp para el detalle de Accesorios y Merch.
 * Se administra desde /admin/paginas/accesorios → "Botón WhatsApp".
 *
 *  - Sección oculta (admin desmarca "Publicado") o sin números válidos → no se
 *    renderiza nada. Eso funciona como el switch para deshabilitar el botón.
 *  - 1 número válido  → enlace directo (click abre WhatsApp al toque).
 *  - 2+ números       → click abre un selector con las sucursales; el cliente
 *                       elige a cuál escribir antes de abrir WhatsApp.
 */
export function PostventaWhatsapp({ config, productName }: { config: PostventaWhatsappConfig; productName: string }) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    // Cerrar el selector al click fuera.
    useEffect(() => {
        if (!open) return;
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [open]);

    if (!config) return null;

    const message = config.message ?? '';

    // Normaliza a lista de contactos válidos (soporta estructura nueva y la
    // vieja de un solo `phone`). Descarta los que no tengan teléfono usable.
    const rawContacts: PostventaWhatsappContact[] = Array.isArray(config.contacts) && config.contacts.length > 0
        ? config.contacts
        : (config.phone ? [{ label: 'WhatsApp', phone: config.phone }] : []);

    const contacts = rawContacts
        .map((c) => ({ label: (c.label ?? '').trim() || 'WhatsApp', href: buildHref(c.phone, message, productName) }))
        .filter((c): c is { label: string; href: string } => c.href !== null);

    if (contacts.length === 0) return null;

    // 1 contacto: enlace directo (comportamiento clásico).
    if (contacts.length === 1) {
        return (
            <a href={contacts[0].href} target="_blank" rel="noopener noreferrer" className={BUTTON_CLASS} style={{ fontFamily: '"Toyota Type"' }}>
                {ICON}
                Whatsapp
            </a>
        );
    }

    // 2+ contactos: el botón abre el selector de sucursal.
    return (
        <div ref={ref} className="relative">
            <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} className={BUTTON_CLASS} style={{ fontFamily: '"Toyota Type"' }}>
                {ICON}
                Whatsapp
            </button>
            {open && (
                <div className="absolute inset-x-0 z-20 mt-2 flex flex-col gap-1 rounded-2xl bg-white p-2 shadow-xl ring-1 ring-black/5">
                    <p className="px-3 py-1 text-xs text-black/50" style={{ fontFamily: '"Toyota Type"' }}>Elige una sucursal</p>
                    {contacts.map((c, i) => (
                        <a
                            key={i}
                            href={c.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-black transition hover:bg-black/5"
                            style={{ fontFamily: '"Toyota Type"' }}
                        >
                            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#40BE4C] text-white">
                                <svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
                                    <path d={WHATSAPP_ICON_PATH} />
                                </svg>
                            </span>
                            <span className="font-medium">{c.label}</span>
                        </a>
                    ))}
                </div>
            )}
        </div>
    );
}
