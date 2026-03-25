import { Link } from '@inertiajs/react';
import logoBlanco from '@images/logo_blanco.png?format=webp';
import logoNegro from '@images/logo_negro.png?format=webp';
import navAgendarMantencion from '@images/navbar/agendar_mantencion.png?format=webp';
import navAccesorios from '@images/navbar/accesorios.png?format=webp';
import navRepuestos from '@images/navbar/repuestos.png?format=webp';
import { useEffect, useState } from 'react';

function HamburgerIcon({ open, className }: { open: boolean; className?: string }) {
    return (
        <div className={`relative flex h-5 w-6 cursor-pointer flex-col items-center justify-center ${className ?? ''}`}>
            <span
                className={`absolute h-0.5 w-6 rounded-full bg-current transition-all duration-300 ease-in-out ${
                    open ? 'translate-y-0 rotate-45' : '-translate-y-1.5'
                }`}
            />
            <span
                className={`absolute h-0.5 w-6 rounded-full bg-current transition-all duration-300 ease-in-out ${
                    open ? 'scale-x-0 opacity-0' : 'opacity-100'
                }`}
            />
            <span
                className={`absolute h-0.5 w-6 rounded-full bg-current transition-all duration-300 ease-in-out ${
                    open ? 'translate-y-0 -rotate-45' : 'translate-y-1.5'
                }`}
            />
        </div>
    );
}

const navLinks = [
    { label: 'Nuevos', href: '/nuevos' },
    { label: 'Seminuevos', href: '/seminuevos' },
    { label: 'Post Venta', href: '#post-venta', sidebarKey: 'post-venta' as const },
    { label: 'Arriendo Kinto', href: '#arriendo-kinto', sidebarKey: 'arriendo-kinto' as const },
];

type SidebarSection = 'default' | 'post-venta' | 'arriendo-kinto';
type SidebarLink = { label: string; href: string; image?: string };

const sidebarLinks: Record<SidebarSection, SidebarLink[]> = {
    default: [
        { label: 'Programas Toyota', href: '/programas' },
        { label: 'Shorts', href: '/shorts' },
        { label: 'Noticias', href: '/noticias' },
        { label: 'Comparar', href: '/seminuevos/comparar' },
        { label: 'Contacto', href: '/contacto' },
        { label: 'Nosotros', href: '/nosotros' },
    ],
    'post-venta': [
        { label: 'Agendar mantención', href: '/post-venta/agendar-mantencion', image: navAgendarMantencion },
        { label: 'Accesorios / Merch', href: '/post-venta/accesorios', image: navAccesorios },
        { label: 'Repuestos', href: '/post-venta/repuestos', image: navRepuestos },
    ],
    'arriendo-kinto': [
        { label: 'Arriendo Kinto', href: '#arriendo-kinto' },
    ],
};

type NavbarProps = {
    variant?: 'transparent' | 'white';
    detailBar?: {
        backHref: string;
        vehicleName: string;
        ctaLabel?: string;
        ctaHref?: string;
    };
};

export function Navbar({ variant = 'transparent', detailBar }: NavbarProps) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [menuVisible, setMenuVisible] = useState(false);
    const [activeSection, setActiveSection] = useState<SidebarSection>('default');
    const isWhite = variant === 'white';

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
        }, 300);
    };

    useEffect(() => {
        if (menuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [menuOpen]);

    const toggleMenu = () => {
        if (menuOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    };

    const handleNavClick = (sidebarKey?: string) => {
        if (!sidebarKey) return;
        const section = sidebarKey as SidebarSection;
        if (menuOpen && activeSection === section) {
            closeMenu();
        } else if (menuOpen) {
            // Switch section: fade out links, swap, fade back in
            setMenuVisible(false);
            setTimeout(() => {
                setActiveSection(section);
                requestAnimationFrame(() => requestAnimationFrame(() => setMenuVisible(true)));
            }, 250);
        } else {
            openMenu(section);
        }
    };

    const iconColor = isWhite ? 'text-black' : 'text-white';
    const currentLinks = sidebarLinks[activeSection];

    // Sidebar styles based on variant
    const sidebarBg = isWhite
        ? 'rgba(255, 255, 255, 0.80)'
        : 'rgba(0, 0, 0, 0.60)';
    const sidebarTextColor = isWhite ? 'text-black' : 'text-white';
    const sidebarLineColor = isWhite ? 'bg-black' : 'bg-white';

    return (
        <>
            {/* Slide-in menu panel (behind navbar) */}
            {menuOpen && (
                <div
                    className={`fixed inset-0 z-40 transition-colors duration-300 ${menuVisible ? 'bg-black/30' : 'bg-black/0'}`}
                    onClick={closeMenu}
                >
                    <div
                        className={`absolute top-0 right-0 flex h-full w-80 max-w-[85vw] flex-col items-end gap-5 pt-32.5 pr-10 pb-15 pl-15 transition-transform duration-300 ease-out ${menuVisible ? 'translate-x-0' : 'translate-x-full'}`}
                        style={{ background: sidebarBg, backdropFilter: 'blur(20px)' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {currentLinks.map((link, i) => {
                            const cls = `group flex shrink-0 flex-col items-end self-stretch transition-all duration-400 ease-out ${
                                menuVisible ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'
                            }`;
                            const delay = { transitionDelay: menuVisible ? `${150 + i * 60}ms` : '0ms' };

                            const content = (
                                <>
                                    <div className="flex h-14.5 items-center justify-end self-stretch rounded-[60px] px-5 py-2.5">
                                        <span className={`relative text-base leading-none ${sidebarTextColor}`}>
                                            {link.label}
                                            {!link.image && <span className={`absolute right-0 -bottom-1 h-px w-0 ${sidebarLineColor} transition-all duration-300 ease-out group-hover:w-full`} />}
                                        </span>
                                    </div>
                                    {link.image && (
                                        <div className="grid grid-rows-[0fr] transition-all duration-400 ease-out group-hover:grid-rows-[1fr]">
                                            <div className="overflow-hidden">
                                                <img
                                                    src={link.image}
                                                    alt={link.label}
                                                    className="mt-1 w-full rounded-[15px] object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </>
                            );

                            return link.href.startsWith('/') ? (
                                <Link key={link.label} href={link.href} className={cls} style={delay} onClick={closeMenu}>
                                    {content}
                                </Link>
                            ) : (
                                <a key={link.label} href={link.href} className={cls} style={delay} onClick={closeMenu}>
                                    {content}
                                </a>
                            );
                        })}
                    </div>
                </div>
            )}

            <nav
                className={`fixed top-0 z-50 w-full backdrop-blur-[10px] ${
                    isWhite
                        ? 'rounded-b-[30px] border-b border-black/20 bg-white'
                        : ''
                }`}
            >
                <div className="flex items-center justify-between px-8 py-6 lg:px-15">
                    <Link href="/">
                        <img
                            src={isWhite ? logoNegro : logoBlanco}
                            alt="Toyota Musalem"
                            className="h-10 w-auto object-contain"
                        />
                    </Link>

                    {/* Desktop nav */}
                    <div className="hidden items-center gap-10 lg:flex">
                        <div className="flex items-center gap-10">
                            {navLinks.map((link) => {
                                const hasSidebar = 'sidebarKey' in link && link.sidebarKey;
                                const isActive = menuOpen && hasSidebar && activeSection === link.sidebarKey;
                                const colorClass = isWhite ? 'text-black' : 'text-white';

                                if (hasSidebar) {
                                    return (
                                        <button
                                            key={link.label}
                                            onClick={() => handleNavClick(link.sidebarKey)}
                                            className={`relative cursor-pointer text-base leading-none ${colorClass} transition hover:opacity-80`}
                                        >
                                            {link.label}
                                            <span className={`absolute right-0 -bottom-1 h-px bg-current transition-all duration-300 ease-out ${isActive ? 'w-full' : 'w-0'}`} />
                                        </button>
                                    );
                                }

                                if (link.href.startsWith('/')) {
                                    return (
                                        <Link key={link.label} href={link.href} className={`text-base leading-none ${colorClass} transition hover:opacity-80`}>
                                            {link.label}
                                        </Link>
                                    );
                                }

                                return (
                                    <a key={link.label} href={link.href} className={`text-base leading-none ${colorClass} transition hover:opacity-80`}>
                                        {link.label}
                                    </a>
                                );
                            })}
                        </div>
                        <button
                            onClick={toggleMenu}
                            className={`cursor-pointer transition hover:opacity-80 ${iconColor}`}
                            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
                        >
                            <HamburgerIcon open={menuOpen} />
                        </button>
                    </div>

                    {/* Mobile toggle */}
                    <button
                        onClick={toggleMenu}
                        className={`cursor-pointer lg:hidden ${iconColor}`}
                        aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
                    >
                        <HamburgerIcon open={menuOpen} />
                    </button>
                </div>

                {/* Detail bar for vehicle pages */}
                {detailBar && (
                    <div className="flex items-center justify-between border-t border-black/10 px-8 py-3 lg:px-15">
                        <Link
                            href={detailBar.backHref}
                            className="flex h-9.5 items-center gap-2.5 rounded-[60px] border border-black py-2.5 pr-5 pl-2.5 text-sm leading-none text-black transition hover:bg-black/5"
                        >
                            <span className="flex size-6 items-center justify-center rounded-full bg-black" style={{ backdropFilter: 'blur(9.375px)' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="9" viewBox="0 0 12 9" fill="none">
                                    <path d="M10.6016 4.34961H0.601563M0.601563 4.34961L4.35156 8.09961M0.601563 4.34961L4.35156 0.599609" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </span>
                            Volver
                        </Link>
                        <div className="flex items-center gap-5">
                            <span className="text-2xl font-semibold leading-none text-black">
                                {detailBar.vehicleName}
                            </span>
                            <a
                                href={detailBar.ctaHref ?? '#'}
                                className="flex h-9.5 items-center gap-2.5 rounded-[60px] border border-black bg-black py-2.5 pr-2.5 pl-5 text-sm leading-none text-white transition hover:bg-black/85"
                            >
                                {detailBar.ctaLabel ?? 'Cotizar'}
                                <span className="flex size-6 items-center justify-center rounded-full bg-white">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="9" viewBox="0 0 12 9" fill="none">
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
