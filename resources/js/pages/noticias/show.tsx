import { Head, Link } from '@inertiajs/react';
import { Footer } from '@/components/landing/footer';
import { Navbar } from '@/components/landing/navbar';
import { NoticiaCard, type NoticiaItem } from '@/components/landing/noticia-card';
import { useEffect, useState } from 'react';
import { useInView } from '@/hooks/use-in-view';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// ─── Types ──────────────────────────────────────────────────────────────────

type HeroSection    = { type: 'hero';    images: string[] };
type TextSection    = { type: 'text';    content: string };
type GallerySection = { type: 'gallery'; images: string[] };
type Section = HeroSection | TextSection | GallerySection;

type Noticia = {
    slug: string;
    titulo: string;
    categoria: string;
    fecha: string;
    sections: Section[];
};

// ─── Hero section (carousel if multiple images) ──────────────────────────────

function HeroCarousel({ images }: { images: string[] }) {
    const [current, setCurrent] = useState(0);

    if (images.length === 0) return (
        <div className="h-120.75 w-full rounded-[30px] bg-[#d0d0d0]" />
    );

    if (images.length === 1) return (
        <div
            className="h-120.75 w-full rounded-[30px]"
            style={{
                background: `linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.20) 100%), url(${images[0]}) lightgray 50% / cover no-repeat`,
            }}
        />
    );

    return (
        <div className="relative h-120.75 w-full overflow-hidden rounded-[30px]">
            <div
                className="h-full w-full transition-all duration-500"
                style={{
                    background: `linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.20) 100%), url(${images[current]}) lightgray 50% / cover no-repeat`,
                }}
            />
            <button
                onClick={() => setCurrent((c) => (c === 0 ? images.length - 1 : c - 1))}
                className="absolute left-4 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur transition hover:bg-black/70"
            >
                <ChevronLeft className="size-5" />
            </button>
            <button
                onClick={() => setCurrent((c) => (c === images.length - 1 ? 0 : c + 1))}
                className="absolute right-4 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur transition hover:bg-black/70"
            >
                <ChevronRight className="size-5" />
            </button>
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">
                {images.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrent(i)}
                        className={`size-2 rounded-full transition ${i === current ? 'bg-white' : 'bg-white/40'}`}
                    />
                ))}
            </div>
        </div>
    );
}

// ─── Gallery section ─────────────────────────────────────────────────────────

function GalleryCarousel({ images }: { images: string[] }) {
    const [current, setCurrent] = useState(0);

    if (images.length === 0) return null;

    if (images.length <= 2) {
        return (
            <div className={`grid gap-5 ${images.length === 2 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                {images.map((img, i) => (
                    <div
                        key={i}
                        className="h-120.75 rounded-[30px]"
                        style={{
                            background: `linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.20) 100%), url(${img}) lightgray 50% / cover no-repeat`,
                        }}
                    />
                ))}
            </div>
        );
    }

    // carousel for 3+
    const visible = [images[current], images[(current + 1) % images.length]];
    return (
        <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-5">
                {visible.map((img, i) => (
                    <div
                        key={i}
                        className="h-120.75 rounded-[30px] transition-all duration-500"
                        style={{
                            background: `linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.20) 100%), url(${img}) lightgray 50% / cover no-repeat`,
                        }}
                    />
                ))}
            </div>
            <div className="flex items-center justify-center gap-4">
                <button
                    onClick={() => setCurrent((c) => (c === 0 ? images.length - 1 : c - 1))}
                    className="flex size-10 items-center justify-center rounded-full bg-black text-white transition hover:bg-black/70"
                >
                    <ChevronLeft className="size-5" />
                </button>
                <span className="text-sm font-medium text-black">{current + 1} / {images.length}</span>
                <button
                    onClick={() => setCurrent((c) => (c === images.length - 1 ? 0 : c + 1))}
                    className="flex size-10 items-center justify-center rounded-full bg-black text-white transition hover:bg-black/70"
                >
                    <ChevronRight className="size-5" />
                </button>
            </div>
        </div>
    );
}

// ─── Section renderer ─────────────────────────────────────────────────────────

function SectionRenderer({ section }: { section: Section }) {
    if (section.type === 'hero') return <HeroCarousel images={section.images} />;
    if (section.type === 'gallery') return <GalleryCarousel images={section.images} />;
    if (section.type === 'text') return (
        <div
            className="wysiwyg-content text-black"
            style={{ fontFamily: '"Toyota Type"' }}
            dangerouslySetInnerHTML={{ __html: section.content }}
        />
    );
    return null;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function ArrowLeft() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="14" viewBox="0 0 18 14" fill="none">
            <path d="M17.25 6.75L1.25 6.75M1.25 6.75L7.25 12.75M1.25 6.75L7.25 0.75" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    );
}

export default function NoticiaShow({ footer, noticia, relacionadas = [] }: { footer: any; noticia: Noticia; relacionadas?: NoticiaItem[] }) {
    const inView = useInView(0.05);

    useEffect(() => {
        const html = document.documentElement;
        const prev = html.style.backgroundColor;
        html.style.backgroundColor = '#EAEAF1';
        return () => { html.style.backgroundColor = prev; };
    }, []);

    return (
        <div className="min-h-screen bg-[#EAEAF1]">
            <Head title={`${noticia.titulo} — Toyota Musalem`} />
            <Navbar variant="white" />

            <main className="flex flex-col bg-[#EAEAF1]">
                <section ref={inView.ref} className="px-15 pb-20 pt-32">
                    <div className={`flex flex-col gap-6 transition-all duration-700 ease-out ${inView.visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}>

                        {/* Volver + Categoría + Fecha — mismo margen que el contenido */}
                        <div className="flex items-center justify-between">
                            <Link
                                href="/noticias"
                                className="flex h-9.5 cursor-pointer items-center gap-2.5 rounded-[60px] border border-black py-2.5 pl-2.5 pr-5 transition-opacity hover:opacity-70"
                            >
                                <span className="flex size-6 items-center justify-center rounded-full">
                                    <ArrowLeft />
                                </span>
                                <span className="text-sm leading-none text-black" style={{ fontFamily: '"Toyota Type"' }}>
                                    Volver
                                </span>
                            </Link>

                            <div className="flex items-center gap-2.5">
                                <span className="rounded-[3px] bg-black/8 px-2 py-1.5 text-sm leading-none text-black/60" style={{ fontFamily: '"Toyota Type"' }}>
                                    {noticia.categoria}
                                </span>
                                <span className="rounded-[3px] bg-black/8 px-2 py-1.5 text-sm leading-none text-black/60" style={{ fontFamily: '"Toyota Type"' }}>
                                    {noticia.fecha}
                                </span>
                            </div>
                        </div>

                        {/* Título */}
                        <h1
                            className="text-[48px] font-normal leading-[120%] text-black"
                            style={{ fontFamily: '"Toyota Type"', fontFeatureSettings: '"liga" off, "clig" off' }}
                        >
                            {noticia.titulo}
                        </h1>

                        {/* Secciones dinámicas — mismo ancho que título */}
                        <div className="flex flex-col gap-10">
                            {(noticia.sections ?? []).map((section, i) => (
                                <SectionRenderer key={i} section={section} />
                            ))}
                        </div>

                    </div>
                </section>
            </main>

            {/* Te podrían interesar */}
            {relacionadas.length > 0 && (
                <section className="flex flex-col gap-10 px-15 pb-20">
                    <h2
                        className="text-[32px] font-normal leading-[120%] text-black"
                        style={{ fontFamily: '"Toyota Type"' }}
                    >
                        Te podrían interesar
                    </h2>
                    <div className="grid grid-cols-3 gap-5">
                        {relacionadas.map((n) => (
                            <NoticiaCard key={n.id} noticia={n} />
                        ))}
                    </div>
                </section>
            )}

            <div className="bg-[#EAEAF1]">
                <Footer data={footer} />
            </div>
        </div>
    );
}
