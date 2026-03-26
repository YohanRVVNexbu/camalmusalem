import { Head, Link } from '@inertiajs/react';
import { Footer } from '@/components/landing/footer';
import { Navbar } from '@/components/landing/navbar';
import { ContactCta } from '@/components/landing/contact-cta';
import { BranchesSection } from '@/components/landing/branches-section';
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
                                    <Link
                                        href={`/post-venta/accesorios/${index + 1}`}
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
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <ContactCta backgroundImage={ejemploVideo} />
                <BranchesSection image1={visitanos1} image2={visitanos2} />

                <div className="bg-black">
                    <Footer data={footer} />
                </div>

            </main>
        </div>
    );
}
