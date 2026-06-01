import { usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

type Contact = { label?: string; phone?: string; message?: string };

/**
 * Estructura `data` actual: `{ contacts: Contact[] }`.
 * También aceptamos la estructura vieja `{ phone, message }` por si algún
 * registro no pasó la migración (defensa en profundidad — el frontend nunca
 * debería romper porque hay un campo legacy en BD).
 */
type WhatsappConfig = {
    contacts?: Contact[];
    phone?: string;
    message?: string;
};

const WHATSAPP_ICON_PATH = 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z';

function buildHref(contact: Contact): string {
    const digits = (contact.phone ?? '').replace(/\D/g, '');
    if (! digits) return 'https://wa.me/';
    const msg = contact.message ?? '';
    return `https://wa.me/${digits}${msg ? `?text=${encodeURIComponent(msg)}` : ''}`;
}

/**
 * Botón flotante de WhatsApp en home.
 *
 *  - 0 contactos válidos  → no se renderiza nada (visibilidad oculta o sin datos).
 *  - 1 contacto válido    → enlace directo: click abre wa.me al toque.
 *  - 2+ contactos válidos → click abre un menú con los labels; el visitante
 *                            elige a quién contactar antes de abrir WhatsApp.
 *
 * Compat: si `data` viene con la estructura vieja `{phone, message}` (no
 * migrada), la convertimos al vuelo a un contacto único.
 */
export function WhatsappButton() {
    const { whatsappButton } = usePage<{ whatsappButton: WhatsappConfig | null }>().props;
    const [hidden, setHidden] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Auto-hide cuando el visitante entra a la sección "about"
    useEffect(() => {
        const target = document.getElementById('about');
        if (!target) return;

        const observer = new IntersectionObserver(
            ([entry]) => setHidden(entry.isIntersecting),
            { threshold: 0.3 },
        );

        observer.observe(target);
        return () => observer.disconnect();
    }, []);

    // Cerrar el menú al click fuera
    useEffect(() => {
        if (!menuOpen) return;
        const handler = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [menuOpen]);

    if (! whatsappButton) return null;

    // Normaliza a array de contactos. Soporta tanto la estructura nueva
    // como la vieja por compat.
    const rawContacts: Contact[] = Array.isArray(whatsappButton.contacts)
        ? whatsappButton.contacts
        : whatsappButton.phone
            ? [{ label: 'Contacto', phone: whatsappButton.phone, message: whatsappButton.message }]
            : [];

    // Filtramos contactos sin teléfono — no aportan nada y romperían wa.me
    const contacts = rawContacts.filter((c) => c.phone && c.phone.replace(/\D/g, '').length >= 8);

    if (contacts.length === 0) return null;

    const hiddenClass = hidden ? 'pointer-events-none scale-0 opacity-0' : 'scale-100 opacity-100';
    const buttonClass = `flex size-14 items-center justify-center rounded-full border border-white bg-black/40 backdrop-blur-[10px] transition-all duration-300 hover:bg-black/60`;
    const Icon = (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white">
            <path d={WHATSAPP_ICON_PATH} />
        </svg>
    );

    // 1 contacto: enlace directo (comportamiento clásico)
    if (contacts.length === 1) {
        return (
            <a
                href={buildHref(contacts[0])}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Contactar por WhatsApp${contacts[0].label ? ' a ' + contacts[0].label : ''}`}
                className={`fixed right-8 bottom-8 z-50 ${buttonClass} ${hiddenClass}`}
            >
                {Icon}
            </a>
        );
    }

    // 2+ contactos: botón abre el menú con los labels
    return (
        <div ref={menuRef} className={`fixed right-8 bottom-8 z-50 ${hiddenClass}`}>
            {menuOpen && (
                <div className="absolute right-0 bottom-16 flex flex-col gap-2 rounded-2xl bg-white p-2 shadow-2xl ring-1 ring-black/5 min-w-56">
                    {contacts.map((c, i) => (
                        <a
                            key={i}
                            href={buildHref(c)}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => setMenuOpen(false)}
                            className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-black transition hover:bg-black/5"
                        >
                            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#25D366]">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="white">
                                    <path d={WHATSAPP_ICON_PATH} />
                                </svg>
                            </span>
                            <span className="font-medium">{c.label || 'Contacto'}</span>
                        </a>
                    ))}
                </div>
            )}
            <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                aria-label="Contactar por WhatsApp"
                aria-expanded={menuOpen}
                className={`${buttonClass} cursor-pointer`}
            >
                {Icon}
            </button>
        </div>
    );
}
