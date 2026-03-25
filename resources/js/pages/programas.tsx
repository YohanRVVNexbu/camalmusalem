import { Head } from '@inertiajs/react';
import { Footer } from '@/components/landing/footer';
import { Navbar } from '@/components/landing/navbar';
import { ContactCta } from '@/components/landing/contact-cta';
import { BranchesSection } from '@/components/landing/branches-section';
import { useEffect } from 'react';
import { useInView } from '@/hooks/use-in-view';
import heroImg from '@images/programas-toyota/hero_section.png?format=webp';
import card2Img from '@images/programas-toyota/card_2_image.png?format=webp';
import grid1 from '@images/programas-toyota/grid_1.png?format=webp';
import grid2 from '@images/programas-toyota/grid_2.jpg?format=webp';
import grid3 from '@images/programas-toyota/grid_3.png?format=webp';
import grid4 from '@images/programas-toyota/grid_4.jpg?format=webp';
import grid5 from '@images/programas-toyota/grid_5.png?format=webp';
import grid6 from '@images/programas-toyota/grid_6.png?format=webp';
import ctaImg from '@images/seminuevos/ejemplo-video.png?format=webp';
import visitanos1 from '@images/seminuevos/visitanos_1.png?format=webp';
import visitanos2 from '@images/seminuevos/visitanos_2.png?format=webp';

export default function ProgramasPage({ footer, programas }: { footer: any; programas: any }) {
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
                <section ref={heroInView.ref}>
                    <div
                        className={`flex h-165 flex-col items-start justify-end gap-10 rounded-b-[30px] px-10 py-15 transition-all duration-700 ease-out ${heroInView.visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}
                        style={{
                            background: `linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(0,0,0,0.80) 100%), linear-gradient(0deg, rgba(0,0,0,0.20) 0%, rgba(0,0,0,0.20) 100%), url(${heroImg}) lightgray 50% / cover no-repeat`,
                        }}
                    >
                        <span
                            style={{
                                fontFamily: '"Toyota Type"',
                                fontFeatureSettings: '"liga" off, "clig" off',
                            }}
                            className="text-[48px] font-normal leading-[100%] text-white"
                        >
                            Programas Toyota
                        </span>
                    </div>
                </section>

                {/* Grid de programas */}
                <section ref={gridInView.ref} className="bg-white px-15 py-20">
                    <div className="flex flex-col gap-10">
                        {/* Header */}
                        <div className={`flex items-center justify-between self-stretch transition-all duration-700 ease-out ${gridInView.visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}>
                            <span
                                className="text-[32px] font-normal leading-[120%] text-black"
                                style={{ fontFamily: '"Toyota Type"' }}
                            >
                                Descubre todos nuestros programas
                            </span>
                            <div className="relative flex h-11 w-65 shrink-0 items-center justify-between rounded-[60px] border border-black bg-[#EAEAF1] py-2.5 pl-5 pr-5">
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

                        {/* Grid */}
                        <div className="flex flex-col gap-5 pb-10">
                            {[
                                { img: grid1, title: 'App Mundo Toyota', desc: 'Accede al historial de mantenciones, revisa pautas y precios, agenda servicios, suma puntos y descubre beneficios, descuentos y comercios asociados desde una sola aplicación.' },
                                { img: grid2, title: 'Kinto', desc: 'Movilidad flexible, directo desde tu celular. Con Kinto SHARE puedes reservar, retirar y usar tu Toyota desde la app, sin trámites ni complicaciones.' },
                                { img: grid3, title: 'Kinto One', desc: 'Programa de arriendo Toyota que contempla dos modalidades: Business, orientado a empresas con necesidad de flota, y Personal, con periodos de 12, 24, 36 y 48 meses.' },
                                { img: grid4, title: 'Beyond Zero', desc: 'Una iniciativa de Toyota que reúne su visión de movilidad sostenible a través de vehículos híbridos y eléctricos, orientada a reducir el impacto ambiental y avanzar hacia la neutralidad de carbono.' },
                                { img: grid5, title: 'Toyota 10 Relax', desc: 'Entrega una cobertura adicional de hasta 5 años o 200.000 km, lo que ocurra primero.' },
                                { img: grid6, title: 'Llamado a revisión', desc: 'Campañas de revisión y reemplazo preventivo para ciertos modelos Toyota, realizadas con repuestos originales y orientadas a mantener la seguridad de tu vehículo.' },
                            ].reduce<{ img: string; title: string; desc: string }[][]>((rows, item, i) => {
                                if (i % 2 === 0) rows.push([item]);
                                else rows[rows.length - 1].push(item);
                                return rows;
                            }, []).map((row, ri) => (
                                <div
                                    key={ri}
                                    className={`flex h-150 gap-5 transition-all duration-700 ease-out ${gridInView.visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
                                    style={{ transitionDelay: gridInView.visible ? `${ri * 150}ms` : '0ms' }}
                                >
                                    {row.map((item) => (
                                        <div key={item.title} className="flex flex-1 flex-col overflow-hidden rounded-[30px]">
                                            <img
                                                src={item.img}
                                                alt={item.title}
                                                className="h-95.25 w-full shrink-0 rounded-[30px] object-cover"
                                            />
                                            <div className="flex flex-col gap-7.5 px-2.5 py-5">
                                                <div className="flex flex-col gap-5">
                                                    <h3
                                                        className="text-[28px] font-semibold leading-[120%] text-black"
                                                        style={{ fontFamily: '"Toyota Type"' }}
                                                    >
                                                        {item.title}
                                                    </h3>
                                                    <p className="text-base leading-[120%] text-black" style={{ fontFamily: '"Toyota Type"' }}>
                                                        {item.desc}
                                                    </p>
                                                </div>
                                                <a
                                                    href="#"
                                                    className="flex w-38 items-center justify-between rounded-[60px] bg-black p-1"
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

                {/* Card mantenimiento */}
                <section ref={cardInView.ref} className="px-15 py-15" style={{ background: 'linear-gradient(180deg, #ffffff 0%, #EAEAF1 100%)' }}>
                    <div className={`flex overflow-hidden rounded-[30px] bg-black transition-all duration-700 ease-out ${cardInView.visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                        <div
                            className="flex flex-col items-start justify-end gap-2.5 self-stretch p-7.5"
                            style={{
                                flex: '0 0 55%',
                                background: `linear-gradient(0deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 100%), linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.20) 100%), url(${card2Img}) -142.481px -65.669px / 117.606% 127.377% no-repeat`,
                            }}
                        />
                        <div className="flex h-120.75 w-[45%] shrink-0 flex-col items-start justify-center gap-10 bg-black px-10 py-15">
                            <h2
                                className="text-[32px] font-semibold leading-[120%] text-white"
                                style={{ fontFamily: '"Toyota Type"' }}
                            >
                                ¿Buscas mantenimiento?
                            </h2>
                            <p className="self-stretch text-base leading-[120%] text-white" style={{ fontFamily: '"Toyota Type"' }}>
                                Reserva tu hora aquí mismo
                                <br /><br />
                                Realizamos los chequeos y cambios necesarios según el kilometraje indicado para mantener tu vehículo en óptimas condiciones y conservar la garantía vigente.
                            </p>
                            <a
                                href="/post-venta/agendar-mantencion"
                                className="flex items-center justify-between rounded-[60px] bg-white p-1"
                            >
                                <span className="pl-2.5 text-base leading-none text-black" style={{ fontFamily: '"Toyota Type"' }}>
                                    Ir a reservar
                                </span>
                                <span className="ml-2.5 flex size-10 shrink-0 items-center justify-center rounded-full bg-black">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="14" viewBox="0 0 18 14" fill="none">
                                        <path d="M0.75 6.75L16.75 6.75M16.75 6.75L10.75 12.75M16.75 6.75L10.75 0.75" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </span>
                            </a>
                        </div>
                    </div>
                </section>

                <ContactCta backgroundImage={ctaImg} />
                <BranchesSection image1={visitanos1} image2={visitanos2} />

            </main>

            <div className="bg-black">
                <Footer data={footer} />
            </div>
        </div>
    );
}
