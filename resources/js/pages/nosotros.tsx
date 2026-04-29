import { Head } from '@inertiajs/react';
import { Footer } from '@/components/landing/footer';
import { Navbar } from '@/components/landing/navbar';
import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { useInView } from '@/hooks/use-in-view';
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
    const { ref, visible } = useInView(0.1);
    const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi]);
    const onSelect = useCallback(() => { if (!emblaApi) return; setSelectedIndex(emblaApi.selectedScrollSnap()); }, [emblaApi]);
    useEffect(() => {
        if (!emblaApi) return;
        setScrollSnaps(emblaApi.scrollSnapList());
        emblaApi.on('select', onSelect); onSelect();
        return () => { emblaApi.off('select', onSelect); };
    }, [emblaApi, onSelect]);

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
                                <div className="aspect-262/180 w-65.5 rounded-[10px]" style={{ background: item.img ? `url(${item.img}) lightgray 50% / cover no-repeat` : '#ccc' }} />
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
    footer: any;
    nosotros_hero: any;
    nosotros_historia: any;
    nosotros_mision: any;
    nosotros_vision: any;
    nosotros_equipo: any;
    nosotros_reconocimientos: any;
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

    // Default images (bundled by Vite) used when no custom image uploaded
    const heroImg = hero.hero_image || defaultHeroImg;
    const misionImg = mision.image || defaultMisionImg;
    const visionImg = vision.image || defaultVisionImg;

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

                {/* Nuestra historia */}
                <section ref={historiaInView.ref} className="flex flex-col items-start justify-center gap-7.5 self-stretch bg-white px-5 py-10 lg:gap-15 lg:py-15">
                    <h2 className={`shrink-0 text-2xl font-semibold leading-[120%] text-black transition-all duration-700 ease-out lg:text-[28px] ${historiaInView.visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`} style={{ fontFamily: '"Toyota Type"' }}>
                        {historia.title ?? 'Nuestra historia'}
                    </h2>
                    <p className={`max-w-2xl text-base leading-[120%] text-black transition-all duration-700 delay-150 ease-out lg:text-lg ${historiaInView.visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`} style={{ fontFamily: '"Toyota Type"', whiteSpace: 'pre-line' }}>
                        {historia.content ?? ''}
                    </p>
                </section>

                {/* Nuestra misión */}
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

                {/* Nuestra visión */}
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

                {/* Equipo Musalem */}
                {(equipo.members ?? []).length > 0 && (
                    <EquipoCarousel members={equipo.members} title={equipo.title ?? 'Equipo Musalem'} />
                )}

                {/* Reconocimientos */}
                {(reconocimientos.items ?? []).length > 0 && (
                    <ReconocimientosCarousel items={reconocimientos.items} title={reconocimientos.title ?? 'Reconocimientos'} />
                )}

            </main>

            <div className="bg-[#EAEAF1]">
                <Footer data={footer} />
            </div>
        </div>
    );
}
