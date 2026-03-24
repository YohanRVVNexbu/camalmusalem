import { Head } from '@inertiajs/react';
import { Footer } from '@/components/landing/footer';
import { Navbar } from '@/components/landing/navbar';
import { useEffect } from 'react';
import heroImg from '@images/navbar/accesorios.png?format=webp';
import section2Img from '@images/accesorios/image_section2.png?format=webp';
import ejemploVideo from '@images/seminuevos/ejemplo-video.png?format=webp';
import visitanos1 from '@images/seminuevos/visitanos_1.png?format=webp';
import visitanos2 from '@images/seminuevos/visitanos_2.png?format=webp';
import grid1 from '@images/accesorios/grid/grid_1.jpg?format=webp';
import grid2 from '@images/accesorios/grid/grid_2.jpg?format=webp';
import grid3 from '@images/accesorios/grid/grid_3.jpg?format=webp';
import grid4 from '@images/accesorios/grid/grid_4.jpg?format=webp';
import grid5 from '@images/accesorios/grid/grid_5.jpg?format=webp';
import grid6 from '@images/accesorios/grid/grid_6.jpg?format=webp';

export default function Accesorios({ footer }: { footer: any }) {
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
                <section className="bg-white pb-20">
                    <div
                        className="relative h-119.25 shrink-0 overflow-hidden rounded-b-[30px]"
                        style={{
                            backgroundImage: `url(${heroImg})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                        }}
                    >
                        <div
                            className="absolute inset-0"
                            style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.60) 100%)' }}
                        />
                        <div
                            className="absolute inset-0"
                            style={{ background: 'rgba(0,0,0,0.20)' }}
                        />
                        <span
                            className="absolute left-1/2 text-center text-[48px] leading-[100%] font-normal text-white"
                            style={{
                                top: 'calc(50% + 31.5px)',
                                translate: '-50%',
                                fontFamily: '"Toyota Type"',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            Accesorios y merch
                        </span>
                    </div>
                </section>

                {/* Merch section */}
                <section className="flex flex-row items-center justify-center gap-15 self-stretch bg-white px-15 pb-20">
                    <img
                        src={section2Img}
                        alt="Merch Oficial Toyota"
                        className="h-103.25 w-170 shrink-0 rounded-[30px] object-cover"
                        style={{
                            background: 'linear-gradient(to left, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0)), linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.2) 100%)',
                        }}
                    />
                    <div className="flex h-56 w-115.25 shrink-0 flex-col items-start justify-center gap-5 pr-5">
                        <h2
                            className="w-115.25 text-[40px] font-semibold leading-[120%] text-black"
                            style={{ fontFamily: '"Toyota Type"' }}
                        >
                            Merch
                            <br />
                            Oficial Toyota
                        </h2>
                        <p className="w-100 text-base leading-[120%] text-black">
                            Accesorios, prendas y productos oficiales que reflejan el estilo Toyota.
                            Visítanos en nuestras sucursales Musalem y encuentra tus favoritos.
                        </p>
                    </div>
                </section>

                {/* Products grid section */}
                <section className="flex flex-col items-center justify-center gap-10 self-stretch bg-[#EAEAF1] py-20">
                    <h2
                        className="text-center text-[32px] font-semibold leading-[120%] text-black"
                        style={{ fontFamily: '"Toyota Type"' }}
                    >
                        Productos disponibles
                    </h2>
                    <div className="grid grid-cols-3 gap-5">
                        {[grid1, grid2, grid3, grid4, grid5, grid6, grid5, grid6, grid1].map((image, index) => (
                            <div
                                key={index}
                                className="group relative h-80 w-80 overflow-hidden rounded-[30px] bg-white"
                                style={{
                                    backgroundImage: `url(${image})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: '50%',
                                    backgroundRepeat: 'no-repeat',
                                }}
                            >
                                {/* Hover overlay */}
                                <div className="absolute inset-0 flex translate-y-full flex-col items-center justify-center gap-5 rounded-[30px] bg-[#EB0A1E] px-20.5 transition-transform duration-300 ease-in-out group-hover:translate-y-0">
                                    <h3
                                        className="text-center text-[28px] font-semibold leading-[120%] text-white"
                                        style={{ fontFamily: '"Toyota Type"' }}
                                    >
                                        Producto {index + 1}
                                    </h3>
                                    <a
                                        href="#"
                                        className="flex items-center gap-2.5 rounded-[60px] bg-white p-1 pl-3.5 transition hover:bg-white/90"
                                    >
                                        <span
                                            className="whitespace-nowrap text-base leading-[120%] text-[#EB0A1E]"
                                            style={{ fontFamily: '"Toyota Type"' }}
                                        >
                                            Ver detalles
                                        </span>
                                        <span className="flex size-10 items-center justify-center rounded-[60px] bg-[#EB0A1E]" style={{ backdropFilter: 'blur(15px)' }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="12" viewBox="0 0 18 14" fill="none">
                                                <path d="M0.75 6.75L16.75 6.75M16.75 6.75L10.75 12.75M16.75 6.75L10.75 0.75" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        </span>
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Contact CTA banner */}
                <div className="flex flex-col items-center bg-[#EAEAF1] p-15">
                    <div
                        className="flex w-full flex-col items-start justify-end rounded-[30px] p-7.5"
                        style={{
                            backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 100%), url(${ejemploVideo})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            height: '340px',
                        }}
                    >
                        <div className="flex flex-col gap-7.5">
                            <p className="w-90 text-2xl leading-[120%] text-white">
                                Contáctanos para recibir asesoría personalizada
                            </p>
                            <a
                                href="#"
                                className="flex w-fit cursor-pointer items-center gap-2.5 rounded-[60px] bg-white p-1 pl-3.5 text-base leading-none text-black transition hover:bg-white/90"
                            >
                                Contactar ventas
                                <span className="flex size-10 items-center justify-center rounded-full bg-black">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="9" viewBox="0 0 12 9" fill="none">
                                        <path d="M1.39844 4.34961H11.3984M11.3984 4.34961L7.64844 0.599609M11.3984 4.34961L7.64844 8.09961" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </span>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Branches section */}
                <div className="flex flex-col items-center gap-10 bg-black px-15 py-20">
                    <h2 className="text-center text-[32px] leading-[120%] text-white">
                        Visítanos en
                        <br />
                        nuestras sucursales
                    </h2>
                    <div className="flex w-full gap-5">
                        <div className="relative flex-1 overflow-hidden rounded-[20px]">
                            <img src={visitanos1} alt="Sucursal La Serena" className="h-85 w-full object-cover" />
                            <div className="absolute bottom-5 left-5 flex w-92.25 flex-col gap-2.5 rounded-2xl p-5" style={{ background: 'linear-gradient(0deg, rgba(0,0,0,0.20) 0%, rgba(0,0,0,0.20) 100%), rgba(255,255,255,0.20)', backdropFilter: 'blur(30px)' }}>
                                <span className="text-xl font-semibold uppercase leading-none text-white">La Serena</span>
                                <span className="text-sm leading-none text-white">Av. Francisco de Aguirre #70</span>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-semibold leading-none text-white">Ver detalles sucursal</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="17" viewBox="0 0 18 17" fill="none">
                                        <path d="M0.390625 8H17.1648" stroke="white" />
                                        <path d="M8.39062 0V16.7742" stroke="white" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div className="relative flex-1 overflow-hidden rounded-[20px]">
                            <img src={visitanos2} alt="Sucursal Ovalle" className="h-85 w-full object-cover" />
                            <div className="absolute bottom-5 left-5 flex w-92.25 flex-col gap-2.5 rounded-2xl p-5" style={{ background: 'linear-gradient(0deg, rgba(0,0,0,0.20) 0%, rgba(0,0,0,0.20) 100%), rgba(255,255,255,0.20)', backdropFilter: 'blur(30px)' }}>
                                <span className="text-xl font-semibold uppercase leading-none text-white">Ovalle</span>
                                <span className="text-sm leading-none text-white">Ariztía #358</span>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-semibold leading-none text-white">Ver detalles sucursal</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="17" viewBox="0 0 18 17" fill="none">
                                        <path d="M0.390625 8H17.1648" stroke="white" />
                                        <path d="M8.39062 0V16.7742" stroke="white" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-black">
                    <Footer data={footer} />
                </div>

            </main>
        </div>
    );
}
