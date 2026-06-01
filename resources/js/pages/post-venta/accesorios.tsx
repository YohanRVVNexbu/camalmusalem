import { Head, Link } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { Footer } from '@/components/landing/footer';
import { Navbar } from '@/components/landing/navbar';
import { ContactCtaBanner } from '@/components/landing/contact-cta-banner';
import { BranchesSection } from '@/components/landing/branches-section';
import { isVideoUrl, pickResponsiveImage } from '@/lib/media';
import { useIsMobile } from '@/hooks/use-mobile';
import { formatCLP } from '@/lib/format';
import { useEffect } from 'react';

const ordenarOpciones = ['Menor precio', 'Mayor precio', 'Más reciente'];
import heroImg from '@images/navbar/accesorios.png?format=webp';
import section2Img from '@images/accesorios/image_section2.png?format=webp';
import ejemploVideo from '@images/seminuevos/ejemplo-video.png?format=webp';

type Accesorio = {
    id: number;
    name: string;
    price: string | null;
    category: string;
    images: string[];
};

type Merch = {
    id: number;
    name: string;
    price: string | null;
    category: string;
    images: string[];
};

export default function Accesorios({ footer, accesorios_hero, accesorios_seccion, accesorios = [], merch = [] }: { footer: any | null; accesorios_hero?: any | null; accesorios_seccion?: any | null; accesorios: Accesorio[]; merch?: Merch[] }) {
    const hero = accesorios_hero ?? {};
    const seccion = accesorios_seccion ?? {};
    const isMobile = useIsMobile();
    const heroMedia = pickResponsiveImage(hero.hero_image, hero.hero_image_mobile, isMobile);
    const merchImg = pickResponsiveImage(seccion.image, seccion.image_mobile, isMobile) || section2Img;

    // Unificamos accesorios + merch en una sola lista con un discriminador
    // de tipo. El filtro de "tipo" permite alternar entre Todos / Accesorios /
    // Merch sin tener dos secciones separadas en la página.
    type Item = { id: number; name: string; price: string | null; category: string; images: string[]; type: 'accesorio' | 'merch' };
    const allItems: Item[] = useMemo(() => [
        ...accesorios.map((a) => ({ ...a, type: 'accesorio' as const })),
        ...merch.map((m) => ({ ...m, type: 'merch' as const })),
    ], [accesorios, merch]);

    const [tipo, setTipo] = useState<'Todos' | 'Accesorios' | 'Merch'>('Todos');
    const [categoria, setCategoria] = useState('Todos');
    const [ordenar, setOrdenar] = useState<'' | 'menor' | 'mayor'>('');

    // Las categorías disponibles dependen del tipo seleccionado.
    const categorias = useMemo(() => {
        const base = allItems.filter((i) => tipo === 'Todos' || (tipo === 'Accesorios' ? i.type === 'accesorio' : i.type === 'merch'));
        return ['Todos', ...Array.from(new Set(base.map((i) => i.category).filter(Boolean)))];
    }, [allItems, tipo]);

    const filtered = useMemo(() => {
        let list = allItems;
        if (tipo === 'Accesorios') list = list.filter((i) => i.type === 'accesorio');
        else if (tipo === 'Merch') list = list.filter((i) => i.type === 'merch');
        if (categoria !== 'Todos') list = list.filter((i) => i.category === categoria);
        const price = (s: string | null) => Number(String(s ?? '').replace(/[^0-9]/g, '')) || 0;
        if (ordenar === 'menor') list = [...list].sort((a, b) => price(a.price) - price(b.price));
        else if (ordenar === 'mayor') list = [...list].sort((a, b) => price(b.price) - price(a.price));
        return list;
    }, [allItems, tipo, categoria, ordenar]);

    useEffect(() => {
        const html = document.documentElement;
        const prev = html.style.backgroundColor;
        html.style.backgroundColor = '#000';
        return () => { html.style.backgroundColor = prev; };
    }, []);

    return (
        <div className="min-h-screen bg-black">
            <Head title="Accesorios y Merch — Toyota Musalem" />
            <Navbar variant="white" />

            <main className="flex flex-col bg-black">

                {/* Hero */}
                {accesorios_hero && (
                <section className="bg-white pb-10 lg:pb-20">
                    <div
                        className="relative h-100 shrink-0 overflow-hidden rounded-b-[30px] lg:h-119.25"
                        style={!isVideoUrl(heroMedia) ? {
                            backgroundImage: `url(${heroMedia || heroImg})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                        } : undefined}
                    >
                        {isVideoUrl(heroMedia) && (
                            <video src={heroMedia!} className="absolute inset-0 size-full object-cover" autoPlay muted loop playsInline />
                        )}
                        <div
                            className="absolute inset-0"
                            style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.60) 100%)' }}
                        />
                        <div
                            className="absolute inset-0"
                            style={{ background: 'rgba(0,0,0,0.20)' }}
                        />
                        <span
                            className="absolute left-1/2 -translate-x-1/2 text-center text-[28px] leading-[110%] font-normal text-white lg:text-[48px] lg:leading-[100%]"
                            style={{
                                top: 'calc(50% + 31.5px)',
                                fontFamily: '"Toyota Type"',
                            }}
                        >
                            {hero.title || 'Accesorios y merch'}
                        </span>
                    </div>
                </section>
                )}

                {/* Merch section */}
                {(accesorios_seccion === undefined || accesorios_seccion) && (
                <section className="flex flex-col items-center justify-center gap-7.5 self-stretch bg-white px-5 pb-10 lg:flex-row lg:gap-15 lg:px-15 lg:pb-20">
                    <img
                        src={merchImg}
                        alt={seccion.title || 'Merch Oficial Toyota'}
                        className="aspect-3/2 w-full shrink-0 rounded-[20px] object-cover lg:aspect-auto lg:h-103.25 lg:w-170 lg:rounded-[30px]"
                        style={{
                            background: 'linear-gradient(to left, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0)), linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.2) 100%)',
                        }}
                    />
                    <div className="flex w-full shrink-0 flex-col items-start justify-center gap-5 lg:h-56 lg:w-115.25 lg:pr-5">
                        <h2
                            className="text-[28px] font-semibold leading-[120%] text-black lg:w-115.25 lg:text-[40px]"
                            style={{ fontFamily: '"Toyota Type"', whiteSpace: 'pre-line' }}
                        >
                            {seccion.title || "Merch\nOficial Toyota"}
                        </h2>
                        <p className="text-sm leading-[120%] text-black lg:w-100 lg:text-base">
                            {seccion.description || 'Accesorios, prendas y productos oficiales que reflejan el estilo Toyota. Visítanos en nuestras sucursales Musalem y encuentra tus favoritos.'}
                        </p>
                    </div>
                </section>
                )}

                {/* Grid UNIFICADO accesorios + merch (estilo repuestos) */}
                <section className="flex flex-col items-center justify-center gap-7.5 self-stretch bg-[#EAEAF1] px-5 py-10 lg:gap-10 lg:px-15 lg:py-20">
                    {/* Title + filters row */}
                    <div className="flex flex-col items-start gap-5 self-stretch lg:flex-row lg:items-center lg:gap-0">
                        <h2
                            className="text-2xl font-semibold leading-[120%] text-black lg:text-[32px]"
                            style={{ fontFamily: '"Toyota Type"' }}
                        >
                            Productos disponibles
                        </h2>
                        <div className="flex w-full flex-col items-stretch gap-3 lg:flex-1 lg:flex-row lg:items-center lg:justify-end lg:gap-2.5">
                            {/* Tipo (accesorio / merch) */}
                            <div className="relative lg:w-56">
                                <select
                                    value={tipo}
                                    onChange={(e) => { setTipo(e.target.value as 'Todos' | 'Accesorios' | 'Merch'); setCategoria('Todos'); }}
                                    className="h-11 w-full cursor-pointer appearance-none rounded-[60px] border border-black bg-[#EAEAF1] px-5 py-2.5 pr-10 text-base leading-none text-black outline-none"
                                    style={{ fontFamily: '"Toyota Type"' }}
                                >
                                    <option value="Todos">Tipo: Todos</option>
                                    <option value="Accesorios">Accesorios</option>
                                    <option value="Merch">Merch</option>
                                </select>
                                <svg className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2" width="6" height="10" viewBox="0 0 6 10" fill="none">
                                    <path d="M1 1L5 5L1 9" stroke="#000" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                            {/* Categoría */}
                            <div className="relative lg:w-56">
                                <select
                                    value={categoria}
                                    onChange={(e) => setCategoria(e.target.value)}
                                    className="h-11 w-full cursor-pointer appearance-none rounded-[60px] border border-black bg-[#EAEAF1] px-5 py-2.5 pr-10 text-base leading-none text-black outline-none"
                                    style={{ fontFamily: '"Toyota Type"' }}
                                >
                                    {categorias.map((c) => (
                                        <option key={c} value={c}>{c === 'Todos' ? 'Categoría: Todos' : c}</option>
                                    ))}
                                </select>
                                <svg className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2" width="6" height="10" viewBox="0 0 6 10" fill="none">
                                    <path d="M1 1L5 5L1 9" stroke="#000" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                            {/* Ordenar */}
                            <div className="relative lg:w-44">
                                <select
                                    value={ordenar}
                                    onChange={(e) => setOrdenar(e.target.value as '' | 'menor' | 'mayor')}
                                    className="h-11 w-full cursor-pointer appearance-none rounded-[60px] border border-black bg-[#EAEAF1] px-5 py-2.5 pr-10 text-base leading-none text-black outline-none"
                                    style={{ fontFamily: '"Toyota Type"' }}
                                >
                                    <option value="">Ordenar:</option>
                                    <option value="menor">Menor precio</option>
                                    <option value="mayor">Mayor precio</option>
                                </select>
                                <svg className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2" width="6" height="10" viewBox="0 0 6 10" fill="none">
                                    <path d="M1 1L5 5L1 9" stroke="#000" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {filtered.length === 0 && (
                            <p className="col-span-full py-10 text-center text-black/50">No hay productos para los filtros seleccionados.</p>
                        )}
                        {filtered.map((item) => {
                            const href = item.type === 'accesorio'
                                ? `/post-venta/accesorios/${item.id}`
                                : `/post-venta/merch/${item.id}`;
                            return (
                                <div key={`${item.type}-${item.id}`} className="flex flex-col overflow-hidden rounded-[20px] border border-black/5 bg-white">
                                    {item.images?.[0] ? (
                                        <img src={item.images[0]} alt={item.name} className="aspect-3/2 w-full rounded-t-[14px] object-cover lg:aspect-auto lg:h-59.5" />
                                    ) : (
                                        <div className="aspect-3/2 w-full rounded-t-[14px] bg-gray-100 lg:aspect-auto lg:h-59.5" />
                                    )}
                                    <div className="flex flex-col gap-3 px-5 py-5">
                                        <div className="flex items-center gap-2 px-2.5">
                                            <span className="rounded-full bg-[#EAEAF1] px-2 py-1 text-xs leading-none text-black/60" style={{ fontFamily: '"Toyota Type"' }}>
                                                {item.type === 'accesorio' ? 'Accesorio' : 'Merch'}
                                            </span>
                                            {item.category && (
                                                <span className="rounded-full bg-[#EAEAF1] px-2 py-1 text-xs leading-none text-black/60" style={{ fontFamily: '"Toyota Type"' }}>
                                                    {item.category}
                                                </span>
                                            )}
                                        </div>
                                        <span
                                            className="line-clamp-2 px-2.5 text-base font-semibold leading-[120%] text-black lg:text-lg"
                                            style={{ fontFamily: '"Toyota Type"' }}
                                        >
                                            {item.name}
                                        </span>
                                        <div className="flex items-center justify-between gap-2 px-2.5">
                                            <span className="text-xl font-semibold uppercase leading-none text-black lg:text-2xl" style={{ fontFamily: '"Toyota Type"' }}>
                                                {item.price ? formatCLP(item.price) : '—'}
                                            </span>
                                            <Link href={href} className="flex h-10 shrink-0 items-center gap-2.5 rounded-[60px] bg-black p-1 pl-3.5 transition-opacity hover:opacity-80">
                                                <span className="pb-0.5 text-sm leading-none text-white" style={{ fontFamily: '"Toyota Type Book", "Toyota Type", sans-serif' }}>
                                                    Ver más
                                                </span>
                                                <span className="flex size-7.5 items-center justify-center rounded-[60px] bg-white">
                                                    <svg width="14" height="11" viewBox="0 0 14 11" fill="none">
                                                        <path d="M0.5 5.5L13.5 5.5M13.5 5.5L8.625 10.5M13.5 5.5L8.625 0.5" stroke="black" strokeLinecap="round" strokeLinejoin="round"/>
                                                    </svg>
                                                </span>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                <ContactCtaBanner />
                <BranchesSection />

                {footer && (
                    <div className="bg-black">
                        <Footer data={footer} />
                    </div>
                )}

            </main>
        </div>
    );
}
