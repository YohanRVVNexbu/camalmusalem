import { Head } from '@inertiajs/react';
import { Footer } from '@/components/landing/footer';
import { Navbar } from '@/components/landing/navbar';
import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { useInView } from '@/hooks/use-in-view';
import heroImg from '@images/nosotros/hero_image.jpg?format=webp';
import misionImg from '@images/nosotros/image_card.jpg?format=webp';
import visionImg from '@images/nosotros/image_card_2.jpg?format=webp';
import carrusel1 from '@images/nosotros/carrusel_1.jpg?format=webp';
import carrusel2 from '@images/nosotros/carrusel_2.jpg?format=webp';
import carrusel3 from '@images/nosotros/carrusel_3.jpg?format=webp';
import carrusel4 from '@images/nosotros/carrusel_4.jpg?format=webp';

const equipo = [
    { nombre: 'Gonzalo Inostroza', cargo: 'Asesor de ventas', img: carrusel1 },
    { nombre: 'Alex Morales', cargo: 'Asesor de Ventas', img: carrusel2 },
    { nombre: 'Fabricio Aponte', cargo: 'Administrativo Telemarketing', img: carrusel3 },
    { nombre: 'Rodrigo Espinosa', cargo: 'Asesor de Ventas de Repuestos', img: carrusel4 },
];

const reconocimientos = [
    { nombre: 'Nombre reconocimiento', año: '2010', img: '' },
    { nombre: 'Nombre reconocimiento', año: '2012', img: '' },
    { nombre: 'Nombre reconocimiento', año: '2015', img: '' },
    { nombre: 'Nombre reconocimiento', año: '2018', img: '' },
    { nombre: 'Nombre reconocimiento', año: '2020', img: '' },
    { nombre: 'Nombre reconocimiento', año: '2023', img: '' },
];

function ReconocimientosCarousel() {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' });
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
    const { ref, visible } = useInView(0.1);

    const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi]);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setSelectedIndex(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        setScrollSnaps(emblaApi.scrollSnapList());
        emblaApi.on('select', onSelect);
        onSelect();
        return () => { emblaApi.off('select', onSelect); };
    }, [emblaApi, onSelect]);

    return (
        <section ref={ref} className="flex flex-col items-center gap-10 rounded-t-[30px] bg-[#EAEAF1] px-15 py-20">
            <h2
                className={`text-center text-[32px] font-normal leading-[120%] text-black transition-all duration-700 ease-out ${visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}
                style={{ fontFamily: '"Toyota Type"' }}
            >
                Reconocimientos
            </h2>

            <div className={`flex w-full flex-col gap-10 transition-all duration-700 delay-150 ease-out ${visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                <div className="overflow-hidden" ref={emblaRef}>
                    <div className="flex gap-5">
                        {reconocimientos.map((item, i) => (
                            <div key={i} className="flex shrink-0 flex-col gap-0 items-start">
                                <div
                                    className="rounded-[10px]"
                                    style={{
                                        width: '262px',
                                        height: '180px',
                                        background: item.img
                                            ? `url(${item.img}) lightgray 50% / cover no-repeat`
                                            : '#ccc',
                                    }}
                                />
                                <div
                                    className="w-65.5 overflow-hidden rounded-2xl p-2.5"
                                    style={{ backdropFilter: 'blur(5px)' }}
                                >
                                    <div className="flex flex-col gap-2.5">
                                        <span
                                            className="text-base font-semibold leading-[120%] text-black"
                                            style={{ fontFamily: '"Toyota Type"' }}
                                        >
                                            {item.nombre}
                                        </span>
                                        <span
                                            className="text-base leading-none text-black"
                                            style={{ fontFamily: '"Toyota Type"' }}
                                        >
                                            {item.año}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex items-center justify-center">
                    <div className="flex items-center gap-5">
                        {scrollSnaps.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => scrollTo(index)}
                                className={`h-2.5 rounded-[20px] transition-all ${
                                    index === selectedIndex ? 'w-15 bg-black' : 'w-2.5 bg-black/30'
                                }`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

function ChevronIcon({ className }: { className?: string }) {
    return (
        <svg width="12" height="24" viewBox="0 0 12 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <path d="M1.5 1.5L10.5 12L1.5 22.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function EquipoCarousel() {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' });
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
    const { ref, visible } = useInView(0.1);

    const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
    const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi]);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setSelectedIndex(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        setScrollSnaps(emblaApi.scrollSnapList());
        emblaApi.on('select', onSelect);
        onSelect();
        return () => { emblaApi.off('select', onSelect); };
    }, [emblaApi, onSelect]);

    return (
        <section ref={ref} className="bg-white px-15 py-15">
            <div className={`flex flex-col items-center gap-10 rounded-[30px] bg-black p-15 transition-all duration-700 ease-out ${visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                <h2
                    className="text-center text-[32px] font-normal leading-[120%] text-white"
                    style={{ fontFamily: '"Toyota Type"' }}
                >
                    Equipo Musalem
                </h2>

                <div className="flex w-full flex-col gap-10">
                    <div className="overflow-hidden" ref={emblaRef}>
                        <div className="flex gap-5">
                            {equipo.map((persona) => (
                                <div
                                    key={persona.nombre}
                                    className="flex shrink-0 flex-col items-start justify-end gap-2.5 rounded-[30px] p-2.5"
                                    style={{
                                        width: '396px',
                                        height: '550px',
                                        background: persona.img
                                            ? `linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.20) 100%), url(${persona.img}) lightgray -175.785px 0px / 183.333% 132% no-repeat`
                                            : 'linear-gradient(180deg, #1a1a1a 0%, #333 100%)',
                                    }}
                                >
                                    <div
                                        className="flex w-full flex-col gap-2.5 overflow-hidden rounded-2xl p-5"
                                        style={{ background: 'rgba(0,0,0,0.60)', backdropFilter: 'blur(5px)' }}
                                    >
                                        <span className="text-lg leading-[120%] text-white" style={{ fontFamily: '"Toyota Type"' }}>
                                            {persona.nombre}
                                        </span>
                                        <span className="text-base leading-none text-white" style={{ fontFamily: '"Toyota Type"' }}>
                                            {persona.cargo}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center justify-center">
                        <div className="flex items-center gap-5">
                            {scrollSnaps.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => scrollTo(index)}
                                    className={`h-2.5 rounded-[20px] transition-all ${
                                        index === selectedIndex ? 'w-15 bg-white' : 'w-2.5 bg-white/40'
                                    }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default function Nosotros({ footer }: { footer: any }) {
    const heroInView = useInView(0.1);
    const historiaInView = useInView(0.1);
    const misionInView = useInView(0.1);
    const visionInView = useInView(0.1);

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
                        className={`flex h-165 flex-col items-start justify-end gap-10 rounded-b-[30px] px-10 py-15 transition-all duration-700 ease-out ${heroInView.visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}
                        style={{
                            background: `linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(0,0,0,0.80) 100%), linear-gradient(0deg, rgba(0,0,0,0.20) 0%, rgba(0,0,0,0.20) 100%), url(${heroImg}) lightgray 50% / cover no-repeat`,
                        }}
                    >
                        <div className="flex flex-col gap-0">
                            <span
                                className="text-[24px] font-semibold leading-[120%] text-white"
                                style={{ fontFamily: '"Toyota Type"' }}
                            >
                                Nosotros
                            </span>
                            <span
                                className="text-[48px] font-normal leading-[100%] text-white"
                                style={{
                                    fontFamily: '"Toyota Type"',
                                    fontFeatureSettings: '"liga" off, "clig" off',
                                }}
                            >
                                Camal Musalem
                            </span>
                        </div>
                    </div>
                </section>

                {/* Nuestra historia */}
                <section ref={historiaInView.ref} className="flex flex-col items-center justify-center gap-15 bg-white px-5 py-15 self-stretch">
                    <h2
                        className={`shrink-0 text-[28px] font-semibold leading-[120%] text-black transition-all duration-700 ease-out ${historiaInView.visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}
                        style={{ fontFamily: '"Toyota Type"' }}
                    >
                        Nuestra historia
                    </h2>
                    <p
                        className={`max-w-2xl text-lg leading-[120%] text-black transition-all duration-700 delay-150 ease-out ${historiaInView.visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}
                        style={{ fontFamily: '"Toyota Type"' }}
                    >
                        Camal Musalem se formó en el año 1968 con un taller mecánico en la ciudad de Ovalle, lo que posteriormente permitió su desarrollo en el rubro automotriz en las ciudades de Ovalle y La Serena.
                        <br /><br />
                        En 1986, la empresa se convierte en concesionario oficial de la marca Toyota e incorpora posteriormente las áreas de venta de automóviles y venta de repuestos, emplazándose en Avenida Francisco de Aguirre 350, en La Serena.
                        <br /><br />
                        Más adelante, se instalan sucursales de servicio técnico autorizado en ambas ciudades y, en 1994, se abre una sucursal adicional exclusiva para servicio técnico en Avenida Francisco de Aguirre 0124, en la capital regional.
                        <br /><br />
                        En 2009, se inaugura un centro integral como casa matriz, donde se concentran los servicios de venta de vehículos nuevos, venta de repuestos y servicio técnico. La empresa desarrolla sus labores con herramientas, maquinarias e insumos, bajo normas y condiciones de seguridad y funcionalidad que aseguran el cumplimiento de los estándares establecidos por TOYOTA CHILE S.A.
                    </p>
                </section>

                {/* Nuestra misión */}
                <section ref={misionInView.ref} className="bg-white px-15 pb-15">
                    <div className={`flex overflow-hidden rounded-[30px] transition-all duration-700 ease-out ${misionInView.visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                        <div className="flex flex-1 flex-col items-start justify-center gap-10 rounded-tl-[30px] rounded-bl-[30px] bg-black pl-32 pr-10 py-15">
                            <h2
                                className="text-[32px] font-semibold leading-[120%] text-white"
                                style={{ fontFamily: '"Toyota Type"' }}
                            >
                                Nuestra misión
                            </h2>
                            <p
                                className="max-w-sm text-base leading-[120%] text-white"
                                style={{ fontFamily: '"Toyota Type"' }}
                            >
                                «Camal Musalem, es una empresa del servicio automotriz, orientada a entregar un producto y servicio de calidad, comprometido con la mejora continua de sus procesos (KAIZEN) y preocupada de la fidelización de nuestros clientes.»
                            </p>
                        </div>
                        <img
                            src={misionImg}
                            alt="Nuestra misión"
                            className="h-120.75 w-[55%] shrink-0 object-cover" style={{ objectPosition: '50% 20%' }}
                        />
                    </div>
                </section>

                {/* Nuestra visión */}
                <section ref={visionInView.ref} className="bg-white px-15 pb-15">
                    <div className={`flex overflow-hidden rounded-[30px] transition-all duration-700 ease-out ${visionInView.visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                        <img
                            src={visionImg}
                            alt="Nuestra visión"
                            className="h-120.75 w-[55%] shrink-0 object-cover object-top"
                        />
                        <div className="flex flex-1 flex-col items-start justify-center gap-10 bg-black pl-32 pr-10 py-15">
                            <h2
                                className="w-61 text-[32px] font-semibold leading-[120%] text-white"
                                style={{ fontFamily: '"Toyota Type"' }}
                            >
                                Nuestra visión
                            </h2>
                            <p
                                className="max-w-sm text-base leading-[120%] text-white"
                                style={{ fontFamily: '"Toyota Type"' }}
                            >
                                «Llegar a ser líderes en ventas y servicios de la zona norte de nuestro país, apoyados de un crecimiento sustentable en el tiempo y comprometidos con el medio ambiente.»
                            </p>
                        </div>
                    </div>
                </section>

                {/* Equipo Musalem */}
                <EquipoCarousel />

                {/* Reconocimientos */}
                <ReconocimientosCarousel />

            </main>

            <div className="bg-[#EAEAF1]">
                <Footer data={footer} />
            </div>
        </div>
    );
}
