import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import { Footer } from '@/components/landing/footer';
import { Navbar } from '@/components/landing/navbar';
import { ContactCta } from '@/components/landing/contact-cta';
import { BranchesSection } from '@/components/landing/branches-section';
import { useEffect } from 'react';

const ordenarOpciones = ['Menor precio', 'Mayor precio', 'Más reciente'];
import heroImg from '@images/navbar/accesorios.png?format=webp';
import section2Img from '@images/accesorios/image_section2.png?format=webp';
import ejemploVideo from '@images/seminuevos/ejemplo-video.png?format=webp';
import visitanos1 from '@images/seminuevos/visitanos_1.png?format=webp';
import visitanos2 from '@images/seminuevos/visitanos_2.png?format=webp';

type Accesorio = {
    id: number;
    name: string;
    price: string | null;
    category: string;
    images: string[];
};

export default function Accesorios({ footer, accesorios_hero, accesorios = [] }: { footer: any; accesorios_hero?: any; accesorios: Accesorio[] }) {
    const hero = accesorios_hero ?? {};
    const categorias = ['Todos', ...Array.from(new Set(accesorios.map(a => a.category)))];
    const [categoria, setCategoria] = useState('Todos');
    const [ordenar, setOrdenar] = useState('');

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
                            backgroundImage: `url(${hero.hero_image || heroImg})`,
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
                            {hero.title || 'Accesorios y merch'}
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
                <section className="flex flex-col items-center justify-center gap-10 self-stretch bg-[#EAEAF1] px-15 py-20">
                    {/* Title + filters row */}
                    <div className="flex items-center self-stretch">
                        <h2
                            className="text-[32px] font-semibold leading-[120%] text-black"
                            style={{ fontFamily: '"Toyota Type"' }}
                        >
                            Productos disponibles
                        </h2>
                        <div className="flex flex-1 items-center justify-end gap-5">
                            {/* Categorias filter */}
                            <div className="relative">
                                <select
                                    value={categoria}
                                    onChange={(e) => setCategoria(e.target.value)}
                                    className="w-65 appearance-none rounded-[60px] border border-black bg-[#EAEAF1] py-2.5 pl-5 pr-8 text-base leading-none text-black outline-none"
                                    style={{ fontFamily: '"Toyota Type"' }}
                                >
                                    {categorias.map((c) => (
                                        <option key={c} value={c}>{c === 'Todos' ? `Categorias: ${c}` : c}</option>
                                    ))}
                                </select>
                                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
                                    <svg width="5" height="7" viewBox="0 0 5 8" fill="none">
                                        <path d="M1 1L4 4L1 7" stroke="black" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </span>
                            </div>
                            {/* Ordenar filter */}
                            <div className="relative">
                                <select
                                    value={ordenar}
                                    onChange={(e) => setOrdenar(e.target.value)}
                                    className="w-65 appearance-none rounded-[60px] border border-black bg-[#EAEAF1] py-2.5 pl-5 pr-8 text-base leading-none text-black outline-none"
                                    style={{ fontFamily: '"Toyota Type"' }}
                                >
                                    <option value="" disabled>Ordenar:</option>
                                    {ordenarOpciones.map((o) => (
                                        <option key={o} value={o}>{o}</option>
                                    ))}
                                </select>
                                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
                                    <svg width="5" height="7" viewBox="0 0 5 8" fill="none">
                                        <path d="M1 1L4 4L1 7" stroke="black" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-5">
                        {accesorios
                            .filter(a => categoria === 'Todos' || a.category === categoria)
                            .map((item) => (
                            <div
                                key={item.id}
                                className="group relative h-80 w-80 overflow-hidden rounded-[30px] bg-gray-100"
                                style={item.images?.[0] ? {
                                    backgroundImage: `url(${item.images[0]})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: '50%',
                                    backgroundRepeat: 'no-repeat',
                                } : {}}
                            >
                                {/* Hover overlay */}
                                <div className="absolute inset-0 flex translate-y-full flex-col items-center justify-center gap-5 rounded-[30px] bg-[#EB0A1E] px-20.5 transition-transform duration-300 ease-in-out group-hover:translate-y-0">
                                    <h3
                                        className="text-center text-[28px] font-semibold leading-[120%] text-white"
                                        style={{ fontFamily: '"Toyota Type"' }}
                                    >
                                        {item.name}
                                    </h3>
                                    <Link
                                        href={`/post-venta/accesorios/${item.id}`}
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
                        {accesorios.filter(a => categoria === 'Todos' || a.category === categoria).length === 0 && (
                            <p className="col-span-3 py-10 text-center text-black/50">No hay productos en esta categoría.</p>
                        )}
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
