import { Link } from '@inertiajs/react';
import logoBlanco from '@images/logo_blanco.png?format=webp';
import { Menu } from 'lucide-react';
import { useState } from 'react';
import { dashboard } from '@/routes';

const navLinks = [
    { label: 'Vehículos', href: '#vehiculos' },
    { label: 'Seminuevos', href: '#seminuevos' },
    { label: 'Post Venta', href: '#post-venta' },
];

export function Navbar({
    isAuthenticated,
}: {
    isAuthenticated: boolean;
}) {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <nav className="fixed top-0 z-50 w-full backdrop-blur-[10px]">
            <div className="flex items-center justify-between px-8 py-6 lg:px-15">
                <Link href="/">
                    <img
                        src={logoBlanco}
                        alt="Toyota Musalem"
                        className="h-10 w-auto object-contain"
                    />
                </Link>

                {/* Desktop nav */}
                <div className="hidden items-center gap-10 lg:flex">
                    <div className="flex items-center gap-10">
                        {navLinks.map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                className="text-base leading-none text-white transition hover:opacity-80"
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>
                    {isAuthenticated ? (
                        <Link
                            href={dashboard()}
                            className="text-base leading-none text-white transition hover:opacity-80"
                        >
                            Dashboard
                        </Link>
                    ) : (
                        <a
                            href="#cotizar"
                            className="text-base leading-none text-white transition hover:opacity-80"
                        >
                            Cotizar
                        </a>
                    )}
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="text-white transition hover:opacity-80"
                        aria-label="Abrir menú"
                    >
                        <Menu className="size-6" />
                    </button>
                </div>

                {/* Mobile toggle */}
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="text-white lg:hidden"
                    aria-label="Abrir menú"
                >
                    <Menu className="size-6" />
                </button>
            </div>

            {/* Mobile menu */}
            {menuOpen && (
                <div className="flex flex-col gap-6 border-t border-white/10 px-8 py-6 lg:hidden">
                    {navLinks.map((link) => (
                        <a
                            key={link.label}
                            href={link.href}
                            className="text-base text-white transition hover:opacity-80"
                            onClick={() => setMenuOpen(false)}
                        >
                            {link.label}
                        </a>
                    ))}
                    <a
                        href="#cotizar"
                        className="text-base text-white transition hover:opacity-80"
                        onClick={() => setMenuOpen(false)}
                    >
                        Cotizar
                    </a>
                </div>
            )}
        </nav>
    );
}
