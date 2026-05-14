import { Head } from '@inertiajs/react';
import { NoticiaCard, type NoticiaItem } from '@/components/landing/noticia-card';
import { Footer } from '@/components/landing/footer';
import { Navbar } from '@/components/landing/navbar';
import { useEffect, useMemo, useState } from 'react';
import { useInView } from '@/hooks/use-in-view';
import { useIsMobile } from '@/hooks/use-mobile';
import { isVideoUrl, pickResponsiveImage } from '@/lib/media';
import heroImg from '@images/noticias/hero_image.png?format=webp';

const CATEGORIAS_FIJAS = ['Todas', 'Noticias', 'Concursos', 'Reconocimientos', 'Camal Musalem', 'Mundo Toyota'];
const PER_PAGE = 9;

export default function Noticias({ footer, noticias_hero, noticias = [] }: { footer: any | null; noticias_hero?: any | null; noticias?: NoticiaItem[] }) {
    const hero = noticias_hero ?? {};
    const isMobile = useIsMobile();
    const heroMedia = pickResponsiveImage(hero.hero_image, hero.hero_image_mobile, isMobile);
    const heroInView = useInView(0.1);

    const [categoriaActiva, setCategoriaActiva] = useState('Todas');
    const [orden, setOrden] = useState<'recientes' | 'antiguos'>('recientes');
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const html = document.documentElement;
        const prev = html.style.backgroundColor;
        html.style.backgroundColor = '#fff';
        return () => { html.style.backgroundColor = prev; };
    }, []);

    // Reset page when filters change
    useEffect(() => { setCurrentPage(1); }, [categoriaActiva, orden]);

    const filtered = useMemo(() => {
        let list = categoriaActiva === 'Todas'
            ? [...noticias]
            : noticias.filter((n) => n.categoria === categoriaActiva);

        if (orden === 'antiguos') list = list.reverse();
        return list;
    }, [noticias, categoriaActiva, orden]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
    const paginated = useMemo(() => {
        const start = (currentPage - 1) * PER_PAGE;
        return filtered.slice(start, start + PER_PAGE);
    }, [filtered, currentPage]);

    const goToPage = (page: number) => {
        setCurrentPage(page);
        document.querySelector('[data-noticias-grid]')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <div className="min-h-screen bg-white">
            <Head title="Noticias — Toyota Musalem" />
            <Navbar variant="white" />

            <main className="flex flex-col bg-white">

                {/* Hero */}
                {noticias_hero && (
                    <section ref={heroInView.ref}>
                        <div
                            className={`relative flex h-100 flex-col items-center justify-end gap-7.5 overflow-hidden rounded-b-[30px] px-5 pt-25 pb-10 text-center transition-all duration-700 ease-out lg:h-165 lg:items-start lg:gap-10 lg:px-10 lg:pt-15 lg:pb-15 lg:text-left ${heroInView.visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}
                            style={!isVideoUrl(heroMedia) ? {
                                background: `linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(0,0,0,0.80) 100%), linear-gradient(0deg, rgba(0,0,0,0.20) 0%, rgba(0,0,0,0.20) 100%), url(${heroMedia || heroImg}) lightgray 50% / cover no-repeat`,
                            } : undefined}
                        >
                            {isVideoUrl(heroMedia) && (
                                <>
                                    <video src={heroMedia} className="absolute inset-0 -z-20 size-full object-cover" autoPlay muted loop playsInline />
                                    <div className="absolute inset-0 -z-10" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(0,0,0,0.80) 100%), linear-gradient(0deg, rgba(0,0,0,0.20) 0%, rgba(0,0,0,0.20) 100%)' }} />
                                </>
                            )}
                            <span
                                className="text-[32px] font-normal leading-[110%] text-white lg:text-[48px] lg:leading-[100%]"
                                style={{ fontFamily: '"Toyota Type"', fontFeatureSettings: '"liga" off, "clig" off' }}
                            >
                                {hero.title || 'Noticias / Blog Musalem'}
                            </span>
                        </div>
                    </section>
                )}

                {/* Filtros */}
                <section className="flex flex-col gap-5 px-5 py-10 lg:px-15 lg:py-20">
                    <div className="flex flex-col items-start gap-5 self-stretch lg:flex-row lg:items-center lg:justify-between lg:gap-0">
                        <span className="text-2xl leading-[120%] text-black lg:text-[32px]" style={{ fontFamily: '"Toyota Type"' }}>
                            Lo último en Musalem
                        </span>

                        {/* Ordenar */}
                        <div className="relative flex h-11 w-full items-center justify-between rounded-[60px] border border-black bg-[#EAEAF1] px-5 py-2.5 lg:w-65">
                            <span className="pb-1 text-sm leading-none text-black lg:text-base" style={{ fontFamily: '"Toyota Type"' }}>
                                Ordenar: <strong>{orden === 'recientes' ? 'Más recientes' : 'Más antiguos'}</strong>
                            </span>
                            <svg width="5" height="8" viewBox="0 0 5 8" fill="none">
                                <path d="M1 1L4 4L1 7" stroke="black" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <select
                                className="absolute inset-0 cursor-pointer opacity-0"
                                value={orden}
                                onChange={(e) => setOrden(e.target.value as 'recientes' | 'antiguos')}
                            >
                                <option value="recientes">Más recientes</option>
                                <option value="antiguos">Más antiguos</option>
                            </select>
                        </div>
                    </div>

                    {/* Categorías: selector en mobile, chips en desktop */}
                    <div className="relative flex h-11 w-full items-center justify-between rounded-[60px] border border-black bg-[#EAEAF1] px-5 py-2.5 lg:hidden">
                        <span className="pb-1 text-sm leading-none text-black" style={{ fontFamily: '"Toyota Type"' }}>
                            Categoría: <strong>{categoriaActiva}</strong>
                        </span>
                        <svg width="5" height="8" viewBox="0 0 5 8" fill="none">
                            <path d="M1 1L4 4L1 7" stroke="black" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <select
                            className="absolute inset-0 cursor-pointer opacity-0"
                            value={categoriaActiva}
                            onChange={(e) => setCategoriaActiva(e.target.value)}
                        >
                            {CATEGORIAS_FIJAS.map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                    <div className="hidden flex-row items-center gap-3.5 lg:flex">
                        <span className="text-base leading-none text-black" style={{ fontFamily: '"Toyota Type"' }}>
                            Categorías:
                        </span>
                        {CATEGORIAS_FIJAS.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setCategoriaActiva(cat)}
                                className={`cursor-pointer rounded-[60px] border px-5 py-2.5 text-base leading-none transition-colors ${
                                    categoriaActiva === cat
                                        ? 'border-black/80 bg-black text-white/80'
                                        : 'border-black/80 bg-transparent text-black/80 hover:bg-black/10'
                                }`}
                                style={{ fontFamily: '"Toyota Type"' }}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </section>

                {/* Grid noticias */}
                <section data-noticias-grid className="px-5 pb-10 lg:px-15 lg:pb-20">
                    {paginated.length > 0 ? (
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {paginated.map((noticia) => (
                                <NoticiaCard key={noticia.id} noticia={noticia} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex h-40 items-center justify-center text-black/40">
                            No hay noticias en esta categoría.
                        </div>
                    )}

                    {/* Paginador */}
                    {totalPages > 1 && (
                        <div className="mt-10 flex items-center justify-center gap-2 overflow-x-auto lg:mt-15 lg:gap-2.5" style={{ scrollbarWidth: 'none' }}>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => goToPage(page)}
                                    className={`flex size-10 shrink-0 items-center justify-center rounded-full border border-black text-base leading-none transition-colors ${
                                        page === currentPage ? 'bg-black text-white' : 'bg-white text-black hover:bg-black/5'
                                    }`}
                                    style={{ fontFamily: '"Toyota Type"' }}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>
                    )}
                </section>

            </main>

            {footer && (
                <div className="bg-white">
                    <Footer data={footer} />
                </div>
            )}
        </div>
    );
}
