import { Link } from '@inertiajs/react';
import logoBlanco from '@images/logo_blanco.png?format=webp';
import logoNegro from '@images/logo_negro.png?format=webp';
import navAgendarMantencion from '@images/navbar/agendar_mantencion.png?format=webp';
import navAccesorios from '@images/navbar/accesorios.png?format=webp';
import navRepuestos from '@images/navbar/repuestos.png?format=webp';
import { useEffect, useState } from 'react';

// ── Iconos ────────────────────────────────────────────────────────────────────

function HamburgerIcon({ open }: { open: boolean }) {
    return (
        <div className="relative flex h-5 w-6 cursor-pointer flex-col items-center justify-center">
            <span className={`absolute h-0.5 w-6 rounded-full bg-current transition-all duration-300 ${open ? 'rotate-45' : '-translate-y-1.5'}`} />
            <span className={`absolute h-0.5 w-6 rounded-full bg-current transition-all duration-300 ${open ? 'scale-x-0 opacity-0' : ''}`} />
            <span className={`absolute h-0.5 w-6 rounded-full bg-current transition-all duration-300 ${open ? '-rotate-45' : 'translate-y-1.5'}`} />
        </div>
    );
}

function ChevronRight({ className }: { className?: string }) {
    return (
        <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <path d="M1 1L7 7L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

// ── Tipos ─────────────────────────────────────────────────────────────────────

type SidebarSection = 'default' | 'post-venta';
type SidebarLink    = { label: string; href: string; image?: string };

const sidebarLinks: Record<SidebarSection, SidebarLink[]> = {
    default: [
        { label: 'Programas Toyota', href: '/programas' },
        { label: 'Noticias',         href: '/noticias' },
        { label: 'Comparar',         href: '/seminuevos/comparar' },
        { label: 'Contacto',         href: '/contacto' },
        { label: 'Nosotros',         href: '/nosotros' },
    ],
    'post-venta': [
        { label: 'Agendar mantención', href: '/post-venta/agendar-mantencion', image: navAgendarMantencion },
        { label: 'Accesorios / Merch', href: '/post-venta/accesorios',         image: navAccesorios },
        { label: 'Repuestos',          href: '/post-venta/repuestos',           image: navRepuestos },
    ],
};

// ── Mobile menu data ──────────────────────────────────────────────────────────

type MobileItem =
    | { type: 'link';      label: string; href: string }
    | { type: 'accordion'; label: string; key: string; children: { label: string; href: string }[] };

const mobileItems: MobileItem[] = [
    {
        type: 'accordion', label: 'Vehículos', key: 'vehiculos',
        children: [
            { label: 'Nuevos',      href: '/nuevos' },
            { label: 'Semi nuevos', href: '/seminuevos' },
        ],
    },
    { type: 'link', label: 'Arriendo Kinto', href: '/kinto' },
    {
        type: 'accordion', label: 'Post Venta', key: 'postventa',
        children: [
            { label: 'Agendar mantención', href: '/post-venta/agendar-mantencion' },
            { label: 'Accesorios / Merch', href: '/post-venta/accesorios' },
            { label: 'Repuestos',          href: '/post-venta/repuestos' },
        ],
    },
    { type: 'link', label: 'Programas Toyota', href: '/programas' },
    { type: 'link', label: 'Comparar',         href: '/seminuevos/comparar' },
    {
        type: 'accordion', label: 'Camal Musalem', key: 'camal',
        children: [
            { label: 'Noticias',  href: '/noticias' },
            { label: 'Contacto',  href: '/contacto' },
            { label: 'Nosotros',  href: '/nosotros' },
        ],
    },
];

// ── Props ─────────────────────────────────────────────────────────────────────

type NavbarProps = {
    variant?: 'transparent' | 'white';
    detailBar?: {
        backHref: string;
        vehicleName: string;
        ctaLabel?: string;
        ctaHref?: string;
    };
};

// ── Componente ────────────────────────────────────────────────────────────────

export function Navbar({ variant = 'transparent', detailBar }: NavbarProps) {
    const [menuOpen, setMenuOpen]         = useState(false);
    const [menuVisible, setMenuVisible]   = useState(false);
    const [activeSection, setActiveSection] = useState<SidebarSection>('default');
    const [openAccordions, setOpenAccordions] = useState<Set<string>>(new Set());
    const isWhite = variant === 'white';

    // Desktop sidebar open/close
    const openMenu = (section: SidebarSection = 'default') => {
        setActiveSection(section);
        setMenuOpen(true);
        requestAnimationFrame(() => requestAnimationFrame(() => setMenuVisible(true)));
    };
    const closeMenu = () => {
        setMenuVisible(false);
        setTimeout(() => {
            setMenuOpen(false);
            setActiveSection('default');
            setOpenAccordions(new Set());
        }, 300);
    };
    const toggleMenu = () => menuOpen ? closeMenu() : openMenu();

    const handleNavClick = (sidebarKey?: string) => {
        if (!sidebarKey) return;
        const section = sidebarKey as SidebarSection;
        if (menuOpen && activeSection === section) {
            closeMenu();
        } else if (menuOpen) {
            setMenuVisible(false);
            setTimeout(() => {
                setActiveSection(section);
                requestAnimationFrame(() => requestAnimationFrame(() => setMenuVisible(true)));
            }, 250);
        } else {
            openMenu(section);
        }
    };

    const toggleAccordion = (key: string) => {
        setOpenAccordions((prev) => {
            const next = new Set(prev);
            next.has(key) ? next.delete(key) : next.add(key);
            return next;
        });
    };

    useEffect(() => {
        document.body.style.overflow = menuOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [menuOpen]);

    const iconColor   = isWhite ? 'text-black' : 'text-white';
    const sidebarBg   = isWhite ? 'rgba(255,255,255,0.80)' : 'rgba(0,0,0,0.60)';
    const sidebarText = isWhite ? 'text-black' : 'text-white';
    const sidebarLine = isWhite ? 'bg-black' : 'bg-white';

    return (
        <>
            {/* ═══════════════════════════════════════════════════════════
                MOBILE: menú full-screen que baja desde arriba
            ════════════════════════════════════════════════════════════ */}
            <div
                className={`fixed inset-0 z-60 flex flex-col overflow-y-auto bg-black px-5 pt-6 pb-20 transition-transform duration-300 ease-out lg:hidden ${
                    menuOpen ? (menuVisible ? 'translate-y-0' : '-translate-y-full') : '-translate-y-full'
                }`}
            >
                {/* Fila superior: logo + botón cerrar */}
                <div className="flex items-center justify-between mb-10">
                    <img src={logoBlanco} alt="Toyota Musalem" className="h-8 w-auto object-contain" />
                    <button
                        onClick={closeMenu}
                        className="flex size-13.5 items-center justify-center rounded-full bg-white"
                        aria-label="Cerrar menú"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Items del menú */}
                <div className="flex flex-col gap-1.5">
                    {mobileItems.map((item) => {
                        if (item.type === 'link') {
                            return (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    onClick={closeMenu}
                                    className="flex h-12.5 items-center rounded-[10px] bg-white/2 px-5 text-lg leading-none text-white"
                                >
                                    {item.label}
                                </Link>
                            );
                        }

                        const isOpen = openAccordions.has(item.key);
                        return (
                            <div key={item.key} className="flex flex-col gap-1.5">
                                <button
                                    type="button"
                                    onClick={() => toggleAccordion(item.key)}
                                    className="flex h-12.5 items-center justify-between rounded-[10px] bg-white/2 px-5 text-lg leading-none text-white"
                                >
                                    {item.label}
                                    <ChevronRight className={`text-white transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`} />
                                </button>

                                {isOpen && (
                                    <div className="flex flex-col gap-1.5 pl-3">
                                        {item.children.map((child) => (
                                            <Link
                                                key={child.label}
                                                href={child.href}
                                                onClick={closeMenu}
                                                className="flex h-12.5 items-center rounded-[10px] bg-white/10 px-5 text-lg leading-none text-white"
                                            >
                                                {child.label}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════
                DESKTOP: sidebar deslizante lateral (comportamiento original)
            ════════════════════════════════════════════════════════════ */}
            {menuOpen && (
                <div
                    className={`fixed inset-0 z-40 hidden transition-colors duration-300 lg:block ${menuVisible ? 'bg-black/30' : 'bg-black/0'}`}
                    onClick={closeMenu}
                >
                    <div
                        className={`absolute top-0 right-0 flex h-full w-80 max-w-[85vw] flex-col items-end gap-5 pt-32.5 pr-10 pb-15 pl-15 transition-transform duration-300 ease-out ${menuVisible ? 'translate-x-0' : 'translate-x-full'}`}
                        style={{ background: sidebarBg, backdropFilter: 'blur(20px)' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {sidebarLinks[activeSection].map((link, i) => {
                            const cls   = `group flex shrink-0 flex-col items-end self-stretch transition-all duration-400 ease-out ${menuVisible ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'}`;
                            const delay = { transitionDelay: menuVisible ? `${150 + i * 60}ms` : '0ms' };
                            const content = (
                                <>
                                    <div className="flex h-14.5 items-center justify-end self-stretch rounded-[60px] px-5 py-2.5">
                                        <span className={`relative text-base leading-none ${sidebarText}`}>
                                            {link.label}
                                            {!link.image && <span className={`absolute right-0 -bottom-1 h-px w-0 ${sidebarLine} transition-all duration-300 ease-out group-hover:w-full`} />}
                                        </span>
                                    </div>
                                    {link.image && (
                                        <div className="grid grid-rows-[0fr] transition-all duration-400 ease-out group-hover:grid-rows-[1fr]">
                                            <div className="overflow-hidden">
                                                <img src={link.image} alt={link.label} className="mt-1 w-full rounded-[15px] object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                                            </div>
                                        </div>
                                    )}
                                </>
                            );
                            return link.href.startsWith('/') ? (
                                <Link key={link.label} href={link.href} className={cls} style={delay} onClick={closeMenu}>{content}</Link>
                            ) : (
                                <a key={link.label} href={link.href} className={cls} style={delay} onClick={closeMenu}>{content}</a>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* ═══════════════════════════════════════════════════════════
                NAVBAR (barra superior — ambos breakpoints)
            ════════════════════════════════════════════════════════════ */}
            <nav className={`fixed top-0 z-50 w-full backdrop-blur-[10px] ${isWhite ? 'rounded-b-[30px] border-b border-black/20 bg-white' : ''}`}>
                <div className="flex items-center justify-between px-5 py-5 lg:px-15 lg:py-6">
                    <Link href="/">
                        <img
                            src={isWhite ? logoNegro : logoBlanco}
                            alt="Toyota Musalem"
                            className="h-8 w-auto object-contain lg:h-10"
                        />
                    </Link>

                    {/* Desktop links */}
                    <div className="hidden items-center gap-10 lg:flex">
                        <div className="flex items-center gap-10">
                            {[
                                { label: 'Nuevos',         href: '/nuevos' },
                                { label: 'Seminuevos',     href: '/seminuevos' },
                                { label: 'Post Venta',     href: '#post-venta', sidebarKey: 'post-venta' as SidebarSection },
                                { label: 'Arriendo Kinto', href: '/kinto' },
                            ].map((link) => {
                                const hasSidebar = 'sidebarKey' in link && link.sidebarKey;
                                const isActive   = menuOpen && hasSidebar && activeSection === link.sidebarKey;
                                const color      = isWhite ? 'text-black' : 'text-white';
                                if (hasSidebar) {
                                    return (
                                        <button key={link.label} onClick={() => handleNavClick(link.sidebarKey)} className={`relative cursor-pointer text-base leading-none ${color} transition hover:opacity-80`}>
                                            {link.label}
                                            <span className={`absolute right-0 -bottom-1 h-px bg-current transition-all duration-300 ${isActive ? 'w-full' : 'w-0'}`} />
                                        </button>
                                    );
                                }
                                return (
                                    <Link key={link.label} href={link.href} className={`text-base leading-none ${color} transition hover:opacity-80`}>{link.label}</Link>
                                );
                            })}
                        </div>
                        <button onClick={toggleMenu} className={`cursor-pointer transition hover:opacity-80 ${iconColor}`} aria-label="Menú">
                            <HamburgerIcon open={menuOpen} />
                        </button>
                    </div>

                    {/* Mobile hamburger */}
                    <button onClick={toggleMenu} className={`cursor-pointer lg:hidden ${iconColor}`} aria-label="Menú">
                        <HamburgerIcon open={menuOpen} />
                    </button>
                </div>

                {/* Detail bar */}
                {detailBar && (
                    <div className="flex items-center justify-between border-t border-black/10 px-5 py-2.5 lg:px-15 lg:py-3">
                        <Link
                            href={detailBar.backHref}
                            className="flex h-8 items-center gap-2 rounded-[60px] border border-black py-2 pr-4 pl-2 text-xs leading-none text-black transition hover:bg-black/5 lg:h-9.5 lg:gap-2.5 lg:pr-5 lg:pl-2.5 lg:text-sm"
                        >
                            <span className="flex size-5 items-center justify-center rounded-full bg-black lg:size-6">
                                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="8" viewBox="0 0 12 9" fill="none">
                                    <path d="M10.6016 4.34961H0.601563M0.601563 4.34961L4.35156 8.09961M0.601563 4.34961L4.35156 0.599609" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </span>
                            Volver
                        </Link>
                        <div className="flex items-center gap-3 lg:gap-5">
                            <span className="text-base font-semibold leading-none text-black lg:text-2xl">{detailBar.vehicleName}</span>
                            <a
                                href={detailBar.ctaHref ?? '#'}
                                className="flex h-8 items-center gap-2 rounded-[60px] border border-black bg-black py-2 pr-2 pl-4 text-xs leading-none text-white transition hover:bg-black/85 lg:h-9.5 lg:gap-2.5 lg:pr-2.5 lg:pl-5 lg:text-sm"
                            >
                                {detailBar.ctaLabel ?? 'Cotizar'}
                                <span className="flex size-5 items-center justify-center rounded-full bg-white lg:size-6">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="8" viewBox="0 0 12 9" fill="none">
                                        <path d="M1.39844 4.34961H11.3984M11.3984 4.34961L7.64844 0.599609M11.3984 4.34961L7.64844 8.09961" stroke="black" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </span>
                            </a>
                        </div>
                    </div>
                )}
            </nav>
        </>
    );
}
