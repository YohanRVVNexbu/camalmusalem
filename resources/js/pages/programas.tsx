import { Head } from '@inertiajs/react';
import { Footer } from '@/components/landing/footer';
import { Navbar } from '@/components/landing/navbar';
import { ContactCtaBanner } from '@/components/landing/contact-cta-banner';
import { BranchesSection } from '@/components/landing/branches-section';
import { useEffect } from 'react';
import { useInView } from '@/hooks/use-in-view';
import { useIsMobile } from '@/hooks/use-mobile';
import { isVideoUrl, pickResponsiveImage } from '@/lib/media';
import heroImg from '@images/programas-toyota/hero_section.png?format=webp';
import card2Img from '@images/programas-toyota/card_2_image.png?format=webp';
import grid1 from '@images/programas-toyota/grid_1.png?format=webp';
import grid2 from '@images/programas-toyota/grid_2.jpg?format=webp';
import grid3 from '@images/programas-toyota/grid_3.png?format=webp';
import grid4 from '@images/programas-toyota/grid_4.jpg?format=webp';
import grid5 from '@images/programas-toyota/grid_5.png?format=webp';
import grid6 from '@images/programas-toyota/grid_6.png?format=webp';
import ctaImg from '@images/seminuevos/ejemplo-video.png?format=webp';

export default function ProgramasPage({ footer, programas, programas_hero, programas_grid }: { footer: any | null; programas: any | null; programas_hero?: any | null; programas_grid?: any | null }) {
    const hero = programas_hero ?? {};
    const grid = programas_grid ?? {};
    const isMobile = useIsMobile();
    const heroMedia = pickResponsiveImage(hero.hero_image, hero.hero_image_mobile, isMobile);
    const heroInView = useInView(0.1);
    const gridInView = useInView(0.05);
    const cardInView = useInView(0.1);

    useEffect(() => {
        const html = document.documentElement;
        const prev = html.style.backgroundColor;
        html.style.backgroundColor = '#fff';
        return () => { html.style.backgroundColor = prev; };
    }, []);

    return (
        <div className="min-h-screen bg-white">
            <Head title="Programas Toyota — Musalem" />
            <Navbar variant="white" />

            <main className="flex flex-col bg-white">

                {/* Hero */}
                {programas_hero && (
                    <section ref={heroInView.ref}>
                        <div
                            className={`relative flex h-100 flex-col items-start justify-end gap-10 overflow-hidden rounded-b-[30px] px-5 pt-25 pb-10 transition-all duration-700 ease-out lg:h-165 lg:px-10 lg:pt-15 lg:pb-15 ${heroInView.visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}
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
                                style={{
                                    fontFamily: '"Toyota Type"',
                                    fontFeatureSettings: '"liga" off, "clig" off',
                                }}
                                className="text-[32px] font-normal leading-[110%] text-white lg:text-[48px] lg:leading-[100%]"
                            >
                                {hero.title || 'Programas Toyota'}
                            </span>
                        </div>
                    </section>
                )}

                {/* Grid de programas */}
                {programas_grid && (
                <section ref={gridInView.ref} className="bg-white px-5 py-10 lg:px-15 lg:py-20">
                    <div className="flex flex-col gap-7.5 lg:gap-10">
                        {/* Header */}
                        <div className={`flex flex-col items-start gap-5 self-stretch transition-all duration-700 ease-out lg:flex-row lg:items-center lg:justify-between lg:gap-0 ${gridInView.visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}>
                            <span
                                className="text-2xl font-normal leading-[120%] text-black lg:text-[32px]"
                                style={{ fontFamily: '"Toyota Type"' }}
                            >
                                {grid.title || 'Descubre todos nuestros programas'}
                            </span>
                            <div className="relative flex h-11 w-full shrink-0 items-center justify-between rounded-[60px] border border-black bg-[#EAEAF1] py-2.5 pl-5 pr-5 lg:w-65">
                                <select
                                    className="w-full appearance-none bg-transparent text-base leading-none text-black outline-none"
                                    style={{ fontFamily: '"Toyota Type"' }}
                                >
                                    <option>Ordenar:</option>
                                    <option>A - Z</option>
                                    <option>Z - A</option>
                                </select>
                                <svg className="pointer-events-none absolute right-5 shrink-0" width="5" height="8" viewBox="0 0 5 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1 1L4 4L1 7" stroke="black" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                        </div>

                        {/* Grid: 1 columna en mobile, 2 en desktop */}
                        <div className="flex flex-col gap-5 pb-10 lg:gap-5">
                            {(() => {
                                const fallbackImgs = [grid1, grid2, grid3, grid4, grid5, grid6];
                                const items = (grid.items ?? [
                                    { img: grid1, title: 'App Mundo Toyota', desc: 'Accede al historial de mantenciones, revisa pautas y precios, agenda servicios, suma puntos y descubre beneficios, descuentos y comercios asociados desde una sola aplicación.', link: '#' },
                                    { img: grid2, title: 'Kinto', desc: 'Movilidad flexible, directo desde tu celular. Con Kinto SHARE puedes reservar, retirar y usar tu Toyota desde la app, sin trámites ni complicaciones.', link: '#' },
                                    { img: grid3, title: 'Kinto One', desc: 'Programa de arriendo Toyota que contempla dos modalidades: Business, orientado a empresas con necesidad de flota, y Personal, con periodos de 12, 24, 36 y 48 meses.', link: '#' },
                                    { img: grid4, title: 'Beyond Zero', desc: 'Una iniciativa de Toyota que reúne su visión de movilidad sostenible a través de vehículos híbridos y eléctricos, orientada a reducir el impacto ambiental y avanzar hacia la neutralidad de carbono.', link: '#' },
                                    { img: grid5, title: 'Toyota 10 Relax', desc: 'Entrega una cobertura adicional de hasta 5 años o 200.000 km, lo que ocurra primero.', link: '#' },
                                    { img: grid6, title: 'Llamado a revisión', desc: 'Campañas de revisión y reemplazo preventivo para ciertos modelos Toyota, realizadas con repuestos originales y orientadas a mantener la seguridad de tu vehículo.', link: '#' },
                                ]) as { img: string; title: string; desc: string; link?: string }[];
                                return items.map((it, idx) => ({ ...it, _fallback: fallbackImgs[idx % fallbackImgs.length] }));
                            })().reduce<{ img: string; title: string; desc: string; link?: string; _fallback: string }[][]>((rows, item, i) => {
                                if (i % 2 === 0) rows.push([item]);
                                else rows[rows.length - 1].push(item);
                                return rows;
                            }, []).map((row, ri) => (
                                <div
                                    key={ri}
                                    className={`flex flex-col gap-5 transition-all duration-700 ease-out lg:h-150 lg:flex-row ${gridInView.visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
                                    style={{ transitionDelay: gridInView.visible ? `${ri * 150}ms` : '0ms' }}
                                >
                                    {row.map((item) => (
                                        <div key={item.title} className="flex flex-1 flex-col overflow-hidden rounded-[30px]">
                                            <img
                                                src={item.img || item._fallback}
                                                alt={item.title}
                                                onError={(e) => { (e.currentTarget as HTMLImageElement).src = item._fallback; }}
                                                className="aspect-3/2 w-full shrink-0 rounded-[30px] object-cover lg:aspect-auto lg:h-95.25"
                                            />
                                            <div className="flex flex-col gap-5 px-2.5 py-5 lg:gap-7.5">
                                                <div className="flex flex-col gap-3 lg:gap-5">
                                                    <h3
                                                        className="text-2xl font-semibold leading-[120%] text-black lg:text-[28px]"
                                                        style={{ fontFamily: '"Toyota Type"' }}
                                                    >
                                                        {item.title}
                                                    </h3>
                                                    <p className="text-sm leading-[120%] text-black lg:text-base" style={{ fontFamily: '"Toyota Type"' }}>
                                                        {item.desc}
                                                    </p>
                                                </div>
                                                <a
                                                    href={item.link ?? '#'}
                                                    className="flex w-full items-center justify-between rounded-[60px] bg-black p-1 lg:w-38"
                                                >
                                                    <span className="pl-2.5 text-base leading-none text-white" style={{ fontFamily: '"Toyota Type"' }}>
                                                        Ver más
                                                    </span>
                                                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="14" viewBox="0 0 18 14" fill="none">
                                                            <path d="M0.75 6.75L16.75 6.75M16.75 6.75L10.75 12.75M16.75 6.75L10.75 0.75" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                        </svg>
                                                    </span>
                                                </a>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
                )}

                {/* Card mantenimiento */}
                <section ref={cardInView.ref} className="px-5 py-10 lg:px-15 lg:py-15" style={{ background: 'linear-gradient(180deg, #ffffff 0%, #EAEAF1 100%)' }}>
                    <div className={`flex flex-col overflow-hidden rounded-[30px] bg-black transition-all duration-700 ease-out lg:flex-row ${cardInView.visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                        <div
                            className="flex aspect-3/2 w-full shrink-0 flex-col items-start justify-end gap-2.5 self-stretch p-5 lg:aspect-auto lg:basis-[55%] lg:p-7.5"
                            style={{
                                background: `linear-gradient(0deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 100%), linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.20) 100%), url(${card2Img}) center / cover no-repeat`,
                            }}
                        />
                        <div className="flex w-full shrink-0 flex-col items-start justify-center gap-7.5 bg-black p-7.5 lg:h-120.75 lg:w-[45%] lg:gap-10 lg:px-10 lg:py-15">
                            <h2
                                className="text-2xl font-semibold leading-[120%] text-white lg:text-[32px]"
                                style={{ fontFamily: '"Toyota Type"' }}
                            >
                                ¿Buscas mantenimiento?
                            </h2>
                            <p className="self-stretch text-sm leading-[120%] text-white lg:text-base" style={{ fontFamily: '"Toyota Type"' }}>
                                Reserva tu hora aquí mismo
                                <br /><br />
                                Realizamos los chequeos y cambios necesarios según el kilometraje indicado para mantener tu vehículo en óptimas condiciones y conservar la garantía vigente.
                            </p>
                            <a
                                href="/post-venta/agendar-mantencion"
                                className="flex w-full items-center justify-between rounded-[60px] bg-white p-1 lg:w-auto"
                            >
                                <span className="pl-2.5 text-base leading-none text-black" style={{ fontFamily: '"Toyota Type"' }}>
                                    Ir a reservar
                                </span>
                                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-black lg:ml-2.5">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="14" viewBox="0 0 18 14" fill="none">
                                        <path d="M0.75 6.75L16.75 6.75M16.75 6.75L10.75 12.75M16.75 6.75L10.75 0.75" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </span>
                            </a>
                        </div>
                    </div>
                </section>

                <ContactCtaBanner />
                <BranchesSection />

            </main>

            {footer && (
                <div className="bg-black">
                    <Footer data={footer} />
                </div>
            )}
        </div>
    );
}
