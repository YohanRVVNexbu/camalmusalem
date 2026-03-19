import { Link } from '@inertiajs/react';
import logoBlanco from '@images/logo_blanco.png?format=webp';
import logoNegro from '@images/logo_negro.png?format=webp';
import { Menu } from 'lucide-react';
import { useState } from 'react';

const navLinks = [
    { label: 'Nuevos', href: '/nuevos' },
    { label: 'Seminuevos', href: '/seminuevos' },
    { label: 'Post Venta', href: '#post-venta' },
    { label: 'Arriendo Kinto', href: '#arriendo-kinto' },
];

function NavLink({ label, href, dark = false }: { label: string; href: string; dark?: boolean }) {
    const colorClass = dark ? 'text-black' : 'text-white';
    const cls = `text-base leading-none ${colorClass} transition hover:opacity-80`;
    if (href.startsWith('/')) {
        return <Link href={href} className={cls}>{label}</Link>;
    }
    return <a href={href} className={cls}>{label}</a>;
}

type NavbarProps = {
    variant?: 'transparent' | 'white';
};

export function Navbar({ variant = 'transparent' }: NavbarProps) {
    const [menuOpen, setMenuOpen] = useState(false);
    const isWhite = variant === 'white';

    return (
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
                        {navLinks.map((link) => (
                            <NavLink key={link.label} {...link} dark={isWhite} />
                        ))}
                    </div>
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className={`transition hover:opacity-80 ${isWhite ? 'text-black' : 'text-white'}`}
                        aria-label="Abrir menú"
                    >
                        <Menu className="size-6" />
                    </button>
                </div>

                {/* Mobile toggle */}
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className={`lg:hidden ${isWhite ? 'text-black' : 'text-white'}`}
                    aria-label="Abrir menú"
                >
                    <Menu className="size-6" />
                </button>
            </div>

            {/* Mobile menu */}
            {menuOpen && (
                <div className={`flex flex-col gap-6 border-t px-8 py-6 lg:hidden ${
                    isWhite ? 'border-black/10' : 'border-white/10'
                }`}>
                    {navLinks.map((link) => (
                        <NavLink key={link.label} {...link} dark={isWhite} />
                    ))}
                </div>
            )}
        </nav>
    );
}
