import { Head } from '@inertiajs/react';
import { Footer } from '@/components/landing/footer';
import { Navbar } from '@/components/landing/navbar';
import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { useInView } from '@/hooks/use-in-view';
import { useIsMobile } from '@/hooks/use-mobile';
import { pickResponsiveImage } from '@/lib/media';
import defaultHeroImg from '@images/nosotros/hero_image.jpg?format=webp';
import defaultMisionImg from '@images/nosotros/image_card.jpg?format=webp';
import defaultVisionImg from '@images/nosotros/image_card_2.jpg?format=webp';
import defaultCarrusel1 from '@images/nosotros/carrusel_1.jpg?format=webp';
import defaultCarrusel2 from '@images/nosotros/carrusel_2.jpg?format=webp';
import defaultCarrusel3 from '@images/nosotros/carrusel_3.jpg?format=webp';
import defaultCarrusel4 from '@images/nosotros/carrusel_4.jpg?format=webp';

function ChevronIcon({ className }: { className?: string }) {
    return (
        <svg width="12" height="24" viewBox="0 0 12 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <path d="M1.5 1.5L10.5 12L1.5 22.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function ReconocimientosCarousel({ items, title }: { items: any[]; title: string }) {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' });
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
    const { ref, visible } = useInView(0.1);
    const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi]);
    const onSelect = useCallback(() => { if (!emblaApi) return; setSelectedIndex(emblaApi.selectedScrollSnap()); }, [emblaApi]);
    useEffect(() => {
        if (!emblaApi) return;
        setScrollSnaps(emblaApi.scrollSnapList());
        emblaApi.on('select', onSelect); onSelect();
        return () => { emblaApi.off('select', onSelect); };
    }, [emblaApi, onSelect]);

    // Cierre con Esc y bloqueo del scroll del body mientras el lightbox está abierto.
    useEffect(() => {
        if (lightboxIndex === null) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setLightboxIndex(null);
            else if (e.key === 'ArrowRight') setLightboxIndex((i) => i === null ? null : (i + 1) % items.length);
            else if (e.key === 'ArrowLeft') setLightboxIndex((i) => i === null ? null : (i - 1 + items.length) % items.length);
        };
        document.addEventListener('keydown', onKey);
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = prevOverflow;
        };
    }, [lightboxIndex, items.length]);

    const lightboxItem = lightboxIndex !== null ? items[lightboxIndex] : null;

    return (
        <section ref={ref} className="flex flex-col items-center gap-7.5 rounded-t-[30px] bg-[#EAEAF1] px-5 py-10 lg:gap-10 lg:px-15 lg:py-20">
            <h2 className={`text-center text-2xl font-normal leading-[120%] text-black transition-all duration-700 ease-out lg:text-[32px] ${visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`} style={{ fontFamily: '"Toyota Type"' }}>
                {title}
            </h2>
            <div className={`flex w-full flex-col gap-7.5 transition-all duration-700 delay-150 ease-out lg:gap-10 ${visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                <div className="overflow-hidden" ref={emblaRef}>
                    <div className="flex">
                        {items.map((item: any, i: number) => (
                            <div key={i} className="mr-5 flex shrink-0 flex-col items-start gap-0">
                                <button
                                    type="button"
                                    onClick={() => item.img && setLightboxIndex(i)}
                                    disabled={!item.img}
                                    className="aspect-262/180 w-65.5 cursor-pointer rounded-[10px] transition hover:opacity-90 disabled:cursor-default disabled:hover:opacity-100"
                                    style={{ background: item.img ? `url(${item.img}) lightgray 50% / cover no-repeat` : '#ccc' }}
                                    aria-label={item.img ? `Ver imagen de ${item.nombre || 'reconocimiento'}` : undefined}
                                />
                                <div className="w-65.5 overflow-hidden rounded-2xl p-2.5" style={{ backdropFilter: 'blur(5px)' }}>
                                    <div className="flex flex-col gap-2.5">
                                        <span className="text-base font-semibold leading-[120%] text-black" style={{ fontFamily: '"Toyota Type"' }}>{item.nombre}</span>
                                        <span className="text-base leading-none text-black" style={{ fontFamily: '"Toyota Type"' }}>{item['año']}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex items-center justify-center">
                    <div className="flex items-center gap-3 lg:gap-5">
                        {scrollSnaps.map((_, index) => (
                            <button key={index} onClick={() => scrollTo(index)} className={`h-2 rounded-[20px] transition-all lg:h-2.5 ${index === selectedIndex ? 'w-10 bg-black lg:w-15' : 'w-2 bg-black/30 lg:w-2.5'}`} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Lightbox: imagen a tamaño completo. Click fuera o Esc para cerrar.
                Flechas izquierda/derecha cambian de imagen sin cerrar. */}
            {lightboxItem && (
                <div
                    onClick={() => setLightboxIndex(null)}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-5 backdrop-blur-sm"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Vista ampliada del reconocimiento"
                >
                    <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setLightboxIndex(null); }}
                        className="absolute right-5 top-5 flex size-10 cursor-pointer items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-white/30"
                        aria-label="Cerrar"
                    >✕</button>
                    {items.length > 1 && (
                        <>
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); setLightboxIndex((i) => i === null ? null : (i - 1 + items.length) % items.length); }}
                                className="absolute left-5 top-1/2 flex size-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/20 text-2xl text-white transition hover:bg-white/30"
                                aria-label="Anterior"
                            >‹</button>
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); setLightboxIndex((i) => i === null ? null : (i + 1) % items.length); }}
                                className="absolute right-5 top-1/2 flex size-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/20 text-2xl text-white transition hover:bg-white/30"
                                aria-label="Siguiente"
                            >›</button>
                        </>
                    )}
                    <div onClick={(e) => e.stopPropagation()} className="flex max-h-full max-w-full flex-col items-center gap-4">
                        <img src={lightboxItem.img} alt={lightboxItem.nombre ?? ''} className="max-h-[80vh] max-w-full rounded-lg object-contain" />
                        {(lightboxItem.nombre || lightboxItem['año']) && (
                            <div className="text-center text-white">
                                {lightboxItem.nombre && <p className="text-lg font-semibold">{lightboxItem.nombre}</p>}
                                {lightboxItem['año'] && <p className="text-sm opacity-80">{lightboxItem['año']}</p>}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </section>
    );
}

const DEFAULT_MEMBER_IMGS = [defaultCarrusel1, defaultCarrusel2, defaultCarrusel3, defaultCarrusel4];

function EquipoCarousel({ members, title }: { members: any[]; title: string }) {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' });
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
    const { ref, visible } = useInView(0.1);
    const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
    const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi]);
    const onSelect = useCallback(() => { if (!emblaApi) return; setSelectedIndex(emblaApi.selectedScrollSnap()); }, [emblaApi]);
    useEffect(() => {
        if (!emblaApi) return;
        setScrollSnaps(emblaApi.scrollSnapList());
        emblaApi.on('select', onSelect); onSelect();
        return () => { emblaApi.off('select', onSelect); };
    }, [emblaApi, onSelect]);

    return (
        <section ref={ref} className="bg-white px-5 py-10 lg:px-15 lg:py-15">
            <div className={`flex flex-col items-center gap-7.5 rounded-[30px] bg-black p-5 transition-all duration-700 ease-out lg:gap-10 lg:p-15 ${visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                <h2 className="text-center text-2xl font-normal leading-[120%] text-white lg:text-[32px]" style={{ fontFamily: '"Toyota Type"' }}>{title}</h2>
                <div className="flex w-full flex-col gap-7.5 lg:gap-10">
                    <div className="overflow-hidden" ref={emblaRef}>
                        <div className="flex gap-5">
                            {members.map((persona: any, i: number) => (
                                <div key={i} className="flex h-100 w-66 shrink-0 flex-col items-start justify-end gap-2.5 rounded-[30px] p-2.5 lg:h-[550px] lg:w-99" style={{ background: `linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.20) 100%), url(${persona.img || DEFAULT_MEMBER_IMGS[i % DEFAULT_MEMBER_IMGS.length]}) lightgray center / cover no-repeat` }}>
                                    <div className="flex w-full flex-col gap-2.5 overflow-hidden rounded-2xl p-3 lg:p-5" style={{ background: 'rgba(0,0,0,0.60)', backdropFilter: 'blur(5px)' }}>
                                        <span className="text-base leading-[120%] text-white lg:text-lg" style={{ fontFamily: '"Toyota Type"' }}>{persona.nombre}</span>
                                        <span className="text-sm leading-none text-white lg:text-base" style={{ fontFamily: '"Toyota Type"' }}>{persona.cargo}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center justify-center gap-2 lg:gap-5">
                        {scrollSnaps.map((_, index) => (
                            <button key={index} onClick={() => scrollTo(index)} className={`h-2 rounded-[20px] transition-all lg:h-2.5 ${index === selectedIndex ? 'w-10 bg-white lg:w-15' : 'w-2 bg-white/40 lg:w-2.5'}`} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

type Props = {
    footer: any | null;
    nosotros_hero: any | null;
    nosotros_historia: any | null;
    nosotros_mision: any | null;
    nosotros_vision: any | null;
    nosotros_equipo: any | null;
    nosotros_reconocimientos: any | null;
};

export default function Nosotros({ footer, nosotros_hero, nosotros_historia, nosotros_mision, nosotros_vision, nosotros_equipo, nosotros_reconocimientos }: Props) {
    const heroInView = useInView(0.1);
    const historiaInView = useInView(0.1);
    const misionInView = useInView(0.1);
    const visionInView = useInView(0.1);

    const hero = nosotros_hero ?? {};
    const historia = nosotros_historia ?? {};
    const mision = nosotros_mision ?? {};
    const vision = nosotros_vision ?? {};
    const equipo = nosotros_equipo ?? {};
    const reconocimientos = nosotros_reconocimientos ?? {};

    const isMobile = useIsMobile();
    // Default images (bundled by Vite) used when no custom image uploaded
    const heroImg = pickResponsiveImage(hero.hero_image, hero.hero_image_mobile, isMobile) || defaultHeroImg;
    const misionImg = pickResponsiveImage(mision.image, mision.image_mobile, isMobile) || defaultMisionImg;
    const visionImg = pickResponsiveImage(vision.image, vision.image_mobile, isMobile) || defaultVisionImg;
    const equipoMembers = (equipo.members ?? []) as any[];
    const reconocimientosItems = (reconocimientos.items ?? []) as any[];

    useEffect(() => {
        const html = document.documentElement;
        const prev = html.style.backgroundColor;
        html.style.backgroundColor = '#fff';
        return () => { html.style.backgroundColor = prev; };
    }, []);

    return (
        <div className="min-h-screen bg-white">
            <Head title="Nosotros — Toyota Musalem" />
            <Navbar variant="white" />

            <main className="flex flex-col bg-white">

                {/* Hero */}
                {nosotros_hero && (
                    <section ref={heroInView.ref}>
                        <div
                            className={`flex h-100 flex-col items-center justify-end gap-7.5 rounded-b-[30px] px-5 pt-25 pb-10 transition-all duration-700 ease-out lg:h-165 lg:items-start lg:gap-10 lg:px-10 lg:pt-15 lg:pb-15 ${heroInView.visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}
                            style={{ background: `linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(0,0,0,0.80) 100%), linear-gradient(0deg, rgba(0,0,0,0.20) 0%, rgba(0,0,0,0.20) 100%), url(${heroImg}) lightgray 50% / cover no-repeat` }}
                        >
                            <div className="flex flex-col gap-0 text-center lg:text-left">
                                <span className="text-lg font-semibold leading-[120%] text-white lg:text-[24px]" style={{ fontFamily: '"Toyota Type"' }}>
                                    {hero.subtitle ?? 'Nosotros'}
                                </span>
                                <span className="text-[32px] font-normal leading-[110%] text-white lg:text-[48px] lg:leading-[100%]" style={{ fontFamily: '"Toyota Type"', fontFeatureSettings: '"liga" off, "clig" off' }}>
                                    {hero.title ?? 'Camal Musalem'}
                                </span>
                            </div>
                        </div>
                    </section>
                )}

                {/* Nuestra historia */}
                {nosotros_historia && (
                    <section ref={historiaInView.ref} className="self-stretch bg-white px-5 py-10 lg:py-15">
                        <div className="mx-auto flex w-full max-w-3xl flex-col items-center justify-center gap-7.5 text-center lg:gap-15">
                            <h2 className={`shrink-0 text-2xl font-semibold leading-[120%] text-black transition-all duration-700 ease-out lg:text-[28px] ${historiaInView.visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`} style={{ fontFamily: '"Toyota Type"' }}>
                                {historia.title ?? 'Nuestra historia'}
                            </h2>
                            <p className={`text-base leading-[120%] text-black transition-all duration-700 delay-150 ease-out lg:text-lg ${historiaInView.visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`} style={{ fontFamily: '"Toyota Type"', whiteSpace: 'pre-line' }}>
                                {historia.content ?? ''}
                            </p>
                        </div>
                    </section>
                )}

                {/* Nuestra misión */}
                {nosotros_mision && (
                    <section ref={misionInView.ref} className="bg-white px-5 pb-10 lg:px-15 lg:pb-15">
                        <div className={`flex flex-col overflow-hidden rounded-[30px] transition-all duration-700 ease-out lg:flex-row ${misionInView.visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                            <img src={misionImg} alt="Nuestra misión" className="aspect-3/2 w-full shrink-0 object-cover lg:hidden" style={{ objectPosition: '50% 20%' }} />
                            <div className="flex flex-1 flex-col items-start justify-center gap-5 bg-black p-7.5 lg:gap-10 lg:rounded-tl-[30px] lg:rounded-bl-[30px] lg:py-15 lg:pr-10 lg:pl-32">
                                <h2 className="text-2xl font-semibold leading-[120%] text-white lg:text-[32px]" style={{ fontFamily: '"Toyota Type"' }}>
                                    {mision.title ?? 'Nuestra misión'}
                                </h2>
                                <p className="text-sm leading-[120%] text-white lg:max-w-sm lg:text-base" style={{ fontFamily: '"Toyota Type"' }}>
                                    {mision.text ?? ''}
                                </p>
                            </div>
                            <img src={misionImg} alt="Nuestra misión" className="hidden h-120.75 w-[55%] shrink-0 object-cover lg:block" style={{ objectPosition: '50% 20%' }} />
                        </div>
                    </section>
                )}

                {/* Nuestra visión */}
                {nosotros_vision && (
                    <section ref={visionInView.ref} className="bg-white px-5 pb-10 lg:px-15 lg:pb-15">
                        <div className={`flex flex-col overflow-hidden rounded-[30px] transition-all duration-700 ease-out lg:flex-row ${visionInView.visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                            <img src={visionImg} alt="Nuestra visión" className="aspect-3/2 w-full shrink-0 object-cover object-top lg:h-120.75 lg:w-[55%] lg:aspect-auto" />
                            <div className="flex flex-1 flex-col items-start justify-center gap-5 bg-black p-7.5 lg:gap-10 lg:py-15 lg:pr-10 lg:pl-32">
                                <h2 className="text-2xl font-semibold leading-[120%] text-white lg:w-61 lg:text-[32px]" style={{ fontFamily: '"Toyota Type"' }}>
                                    {vision.title ?? 'Nuestra visión'}
                                </h2>
                                <p className="text-sm leading-[120%] text-white lg:max-w-sm lg:text-base" style={{ fontFamily: '"Toyota Type"' }}>
                                    {vision.text ?? ''}
                                </p>
                            </div>
                        </div>
                    </section>
                )}

                {/* Equipo Musalem */}
                {nosotros_equipo && equipoMembers.length > 0 && (
                    <EquipoCarousel members={equipoMembers} title={equipo.title ?? 'Equipo Musalem'} />
                )}

                {/* Reconocimientos */}
                {nosotros_reconocimientos && reconocimientosItems.length > 0 && (
                    <ReconocimientosCarousel items={reconocimientosItems} title={reconocimientos.title ?? 'Reconocimientos'} />
                )}

            </main>

            {footer && (
                <div className="bg-[#EAEAF1]">
                    <Footer data={footer} />
                </div>
            )}
        </div>
    );
}
