import { useInView } from '@/hooks/use-in-view';
import { SOCIAL_NETWORKS_BY_KEY } from '@/lib/social-networks';

function SocialButton({
    href,
    children,
}: {
    href: string;
    children: React.ReactNode;
}) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex size-11.5 items-center justify-center rounded-full bg-[#EAEAF1] text-[#231F20] shadow-[0_2px_6px_rgba(0,0,0,0.25)] transition hover:bg-[#dddde5]"
        >
            {children}
        </a>
    );
}

type LegalLink = { label: string; href: string; file?: string };

type FooterData = {
    logo: string;
    social_links: Record<string, string>;
    nav_links: { label: string; href: string }[];
    locations: { title: string; items: string[] }[];
    /** Acepta el formato nuevo {label,href} o el antiguo (string) por compat */
    legal_links: (string | LegalLink)[];
    copyright: string;
};

export function Footer({ data }: { data: FooterData }) {
    const { ref, visible } = useInView(0.1);

    return (
        <footer ref={ref} className="rounded-t-[30px] border border-[rgba(35,31,32,0.20)] bg-white px-5 py-15 md:px-15 md:py-20">
            <div className="flex flex-col gap-15">
                {/* Top section */}
                <div className={`flex flex-col items-start gap-10 transition-all duration-700 ease-out md:flex-row md:justify-between md:gap-0 ${visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                    {/* Logo + socials */}
                    <div className="flex flex-col gap-7.5 md:w-67.5 md:gap-5">
                        <img
                            src={data.logo}
                            alt="Toyota Musalem"
                            className="h-12.5 w-auto object-contain object-left"
                        />
                        <div className="flex flex-wrap gap-5">
                            {Object.entries(data.social_links).map(([key, url]) => {
                                const network = SOCIAL_NETWORKS_BY_KEY[key];
                                if (!network || !url) return null;
                                const Icon = network.Icon;
                                return (
                                    <SocialButton key={key} href={url}>
                                        <Icon />
                                    </SocialButton>
                                );
                            })}
                        </div>
                    </div>

                    {/* Columns */}
                    <div className="flex flex-col gap-15 md:flex-row">
                        {/* MUSALEM */}
                        <div className="flex flex-col gap-5 md:w-30">
                            <span className="text-sm font-semibold leading-none text-[#231F20]">
                                MUSALEM
                            </span>
                            {data.nav_links.map((link) => (
                                <a
                                    key={link.label}
                                    href={link.href}
                                    className="text-sm leading-none text-[rgba(35,31,32,0.80)] transition hover:text-black"
                                >
                                    {link.label}
                                </a>
                            ))}
                        </div>

                        {/* Locations */}
                        {data.locations.map((loc) => (
                            <div key={loc.title} className="flex flex-col gap-5">
                                <span className="text-sm font-semibold leading-none uppercase text-[#231F20]">
                                    {loc.title}
                                </span>
                                {loc.items.map((item, i) => (
                                    <span key={i} className="text-sm leading-none text-[rgba(35,31,32,0.80)]">
                                        {item}
                                    </span>
                                ))}
                            </div>
                        ))}

                        {/* LEGALES */}
                        <div className="flex flex-col gap-5 md:w-40">
                            <span className="text-sm font-semibold leading-none uppercase text-[#231F20]">
                                Legales
                            </span>
                            {data.legal_links.map((item, i) => {
                                // Soporta tanto el formato nuevo {label,href,file} como el legacy (string).
                                const label = typeof item === 'string' ? item : item.label;
                                // Prioridad: archivo subido (PDF) > URL/ruta > '#'.
                                const file = typeof item === 'string' ? '' : (item.file ?? '');
                                const href = typeof item === 'string'
                                    ? (/prevenci[óo]n.*del\s*delito/i.test(item) ? '/prevencion-delito' : '#')
                                    : (item.file || item.href || '#');
                                const external = href !== '#' && (!!file || /^https?:\/\//i.test(href));
                                return (
                                    <a
                                        key={`${label}-${i}`}
                                        href={href}
                                        target={external ? '_blank' : undefined}
                                        rel={external ? 'noopener noreferrer' : undefined}
                                        className="text-sm leading-normal text-[rgba(35,31,32,0.80)] transition hover:text-black"
                                    >
                                        {label}
                                    </a>
                                );
                            })}
                            {/* Cookies — fijos (legales), independientes del admin de legal_links */}
                            <a
                                href="/politica-de-cookies"
                                className="text-sm leading-normal text-[rgba(35,31,32,0.80)] transition hover:text-black"
                            >
                                Política de Cookies
                            </a>
                            <button
                                type="button"
                                onClick={() => (window as unknown as { openCookiePreferences?: () => void }).openCookiePreferences?.()}
                                className="cursor-pointer text-left text-sm leading-normal text-[rgba(35,31,32,0.80)] transition hover:text-black"
                            >
                                Configurar cookies
                            </button>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <span className={`text-sm leading-none text-[#231F20] transition-all duration-700 delay-200 ease-out ${visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                    &copy; {new Date().getFullYear()} {data.copyright}
                </span>
            </div>
        </footer>
    );
}
