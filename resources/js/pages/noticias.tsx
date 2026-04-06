import { Head } from '@inertiajs/react';
import { NoticiaCard } from '@/components/landing/noticia-card';
import { Footer } from '@/components/landing/footer';
import { Navbar } from '@/components/landing/navbar';
import { useEffect, useState } from 'react';
import { useInView } from '@/hooks/use-in-view';
import heroImg from '@images/noticias/hero_image.png?format=webp';

const CATEGORIAS_FIJAS = ['Todas', 'Noticias', 'Concursos', 'Reconocimientos', 'Camal Musalem', 'Mundo Toyota'];

export default function Noticias({ footer, noticias_hero, noticias = [] }: { footer: any; noticias_hero?: any; noticias?: any[] }) {
    const hero = noticias_hero ?? {};
    const heroInView = useInView(0.1);
    const [categoriaActiva, setCategoriaActiva] = useState('Todas');

    useEffect(() => {
        const html = document.documentElement;
        const prev = html.style.backgroundColor;
        html.style.backgroundColor = '#fff';
        return () => { html.style.backgroundColor = prev; };
    }, []);

    return (
        <div className="min-h-screen bg-white">
            <Head title="Noticias — Toyota Musalem" />
            <Navbar variant="white" />

            <main className="flex flex-col bg-white">

                {/* Hero */}
                <section ref={heroInView.ref}>
                    <div
                        className={`flex h-165 flex-col items-start justify-end gap-10 rounded-b-[30px] px-10 py-15 transition-all duration-700 ease-out ${heroInView.visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}
                        style={{
                            background: `linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(0,0,0,0.80) 100%), linear-gradient(0deg, rgba(0,0,0,0.20) 0%, rgba(0,0,0,0.20) 100%), url(${hero.hero_image || heroImg}) lightgray 50% / cover no-repeat`,
                        }}
                    >
                        <span
                            className="text-[48px] font-normal leading-[100%] text-white"
                            style={{ fontFamily: '"Toyota Type"', fontFeatureSettings: '"liga" off, "clig" off' }}
                        >
                            {hero.title || 'Noticias / Blog Musalem'}
                        </span>
                    </div>
                </section>

                {/* Filtros */}
                <section className="flex flex-col gap-5 px-15 py-20">
                    {/* Header */}
                    <div className="flex items-center justify-between self-stretch">
                        <span className="text-[32px] leading-[120%] text-black" style={{ fontFamily: '"Toyota Type"' }}>
                            Lo último en Musalem
                        </span>
                        <div className="relative flex h-11 w-65 items-center justify-between rounded-[60px] border border-black bg-[#EAEAF1] px-5 py-2.5">
                            <span className="pb-1 text-base leading-none text-black" style={{ fontFamily: '"Toyota Type"' }}>
                                Ordenar:
                            </span>
                            <svg width="5" height="8" viewBox="0 0 5 8" fill="none">
                                <path d="M1 1L4 4L1 7" stroke="black" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <select className="absolute inset-0 cursor-pointer opacity-0">
                                <option>Más recientes</option>
                                <option>Más antiguos</option>
                            </select>
                        </div>
                    </div>

                    {/* Categorías */}
                    <div className="flex flex-row items-center gap-3.5">
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
                <section className="px-15 pb-20">
                    <div className="grid grid-cols-3 gap-5">
                        {noticias.map((noticia) => (
                            <NoticiaCard key={noticia.id} noticia={noticia} />
                        ))}
                    </div>

                    {/* Paginador */}
                    <div className="mt-15 flex items-center justify-center gap-2.5">
                        {[1, 2, 3, 4].map((page) => (
                            <button
                                key={page}
                                className={`flex size-10 items-center justify-center rounded-full border border-black text-base leading-none transition-colors ${
                                    page === 1 ? 'bg-black text-white' : 'bg-white text-black hover:bg-black/5'
                                }`}
                                style={{ fontFamily: '"Toyota Type"' }}
                            >
                                {page}
                            </button>
                        ))}
                    </div>
                </section>

            </main>

            <div className="bg-white">
                <Footer data={footer} />
            </div>
        </div>
    );
}
