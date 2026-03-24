import { Head } from '@inertiajs/react';
import { Footer } from '@/components/landing/footer';
import { Navbar } from '@/components/landing/navbar';
import { ArrowIcon } from '@/components/landing/arrow-icon';
import { ShortsCarousel } from '@/components/landing/shorts';
import { Modal360, frames360 } from '@/components/nuevos/modal-360';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useInView } from '@/hooks/use-in-view';

import ejemploVideo from '@images/seminuevos/ejemplo-video.png?format=webp';
import destacado1 from '@images/nuevos/detalle/destacado_1.png?format=webp';
import destacado2 from '@images/nuevos/detalle/destacado_2.png?format=webp';
import destacado3 from '@images/nuevos/detalle/destacado_3.png?format=webp';
import destacado4 from '@images/nuevos/detalle/destacado_4.png?format=webp';
import bz4xVideo from '@images/nuevos/detalle/bz4x_video.mp4';
import galeria1 from '@images/nuevos/detalle/galeria_1.png?format=webp';
import galeria2 from '@images/nuevos/detalle/galeria_2.png?format=webp';
import visitanos1 from '@images/seminuevos/visitanos_1.png?format=webp';
import visitanos2 from '@images/seminuevos/visitanos_2.png?format=webp';
import heroDetail from '@images/nuevos/detalle/hero_detail.png?format=webp';
import logoCard1 from '@images/nuevos/logo_card_1.png?format=webp';

// Hardcoded vehicle data for design testing
const vehicleData = {
    name: 'BZ4X',
    fullName: 'BZ4X Limited 4x2',
    subtitle: 'Más que un eléctrico, un eléctrico Toyota.',
    price: '$ 39.990.000',
    fuel: 'Eléctrico',
    transmission: 'Automática',
    type: 'SUV',
    motor: '150 kW (201 HP) Motor eléctrico',
    autonomy: '516 km (ciclo WLTP)',
    traction: 'Delantera (4x2)',
    acceleration: '7.5 seg (0-100 km/h)',
    versions: [
        {
            name: 'Bz4X Limited 4x2',
            price: '$ 39.990.000',
            electric: true,
            bonus: 'Incluye Bono de $3.000.000 con financiamiento',
            pricing: [
                { label: 'Crédito inteligente', value: '$39.990.990' },
                { label: 'Crédito convencional', value: '$40.990.990' },
                { label: 'Crédito todo medio de pago', value: '$39.990.990' },
                { label: 'Precio de lista', value: '$39.990.990' },
            ],
            characteristics: [
                { title: 'Seguridad', detail: '8 airbags / BA / EDB / HAC / BSM / SEA / Sensor Del. y Tra. Cámara 360° + TSS 3.0' },
                { title: 'Performance', detail: 'Motor eléctrico, Potencia 165 KW (221) / 269 NM. Batería de lon litio de 73.1 KWh. 0 -100Kph: 7,4 segundos' },
                { title: 'Conectividad', detail: 'Pantalla digital TFT de 7" + Pantalla de audio de 14" con conectividad AC y AD + 6 parlantes con amplificador' },
            ],
        },
        {
            name: 'Bz4X Limited AWD',
            price: '$ 46.990.000',
            electric: true,
            bonus: 'Incluye Bono de $3.000.000 con financiamiento',
            pricing: [
                { label: 'Crédito inteligente', value: '$46.990.990' },
                { label: 'Crédito convencional', value: '$46.990.990' },
                { label: 'Crédito todo medio de pago', value: '$46.990.990' },
                { label: 'Precio de lista', value: '$46.990.990' },
            ],
            characteristics: [
                { title: 'Seguridad', detail: '8 airbags / BA / EDB / HAC / BSM / SEA / Sensor Del. y Tra. Cámara 360° + TSS 3.0' },
                { title: 'Performance', detail: 'Motor eléctrico, Potencia 165 KW (221) / 269 NM. Batería de lon litio de 73.1 KWh. 0 -100Kph: 7,4 segundos' },
                { title: 'Conectividad', detail: 'Pantalla digital TFT de 7" + Pantalla de audio de 14" con conectividad AC y AD + 6 parlantes con amplificador' },
            ],
        },
    ],
};

type VersionTab = 'precio' | 'caracteristicas';

const highlights = [
    {
        image: destacado1,
        title: 'Diseño SUV 100% eléctrico',
        subtitle: 'Toyota bZ4X: estilo SUV y 200 mm de altura al suelo, con maletero de 452 L para tu día a día. Un 100% eléctrico listo para ciudad y escapadas.',
    },
    {
        image: destacado2,
        title: 'Tecnología intuitiva que se siente familiar',
        subtitle: 'Aunque es 100% eléctrico, el bZ4X conserva esa experiencia funcional y cercana que distingue a Toyota. Su tecnología está diseñada para simplificar cada trayecto, con pantallas claras, comandos accesibles y botones físicos para las funciones principales, para que todo sea rápido, preciso y familiar.',
    },
    {
        image: destacado3,
        title: 'Cargador',
        subtitle: 'Incluye cargador de viaje/emergencia. Incluye cable tipo 2. Incluye wallbox con instalación domiciliaria de 7.4KW* *Sujeto a factibilidad técnica.',
    },
    {
        image: destacado4,
        title: 'Apertura con manos libres',
        subtitle: 'El bZ4X facilita cada carga gracias a su Kick Sensor, que permite abrir el portalón trasero con un simple movimiento del pie bajo el parachoques. Una función práctica y cómoda para esos momentos en que llevas las manos ocupadas, haciendo cada uso del maletero más fácil y fluido.',
    },
];

function HighlightsCarousel() {
    const { ref: animRef, visible } = useInView(0.1);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const totalSlides = highlights.length;

    useEffect(() => {
        const wrapper = wrapperRef.current;
        if (!wrapper) return;

        const handleScroll = () => {
            const rect = wrapper.getBoundingClientRect();
            const scrollableHeight = wrapper.offsetHeight - window.innerHeight;
            const scrolled = -rect.top;
            const progress = Math.max(0, Math.min(1, scrolled / scrollableHeight));
            const index = Math.min(totalSlides - 1, Math.floor(progress * totalSlides));
            setActiveIndex(index);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, [totalSlides]);

    return (
        <div
            ref={(el) => {
                (wrapperRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
                (animRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
            }}
            className="relative bg-[#EAEAF1]"
            style={{ height: `${totalSlides * 100}vh` }}
        >
            <div className="sticky top-0 flex h-dvh flex-col justify-end" style={{ padding: '60px', paddingTop: '140px' }}>
                <div className={`flex w-full flex-1 flex-col gap-10 transition-all duration-700 ease-out ${visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <h2 className="text-[32px] leading-none text-black">Aspectos destacados</h2>
                        <div className="flex items-center gap-2.5">
                            {highlights.map((_, i) => (
                                <div
                                    key={i}
                                    className={`h-2.5 rounded-full transition-all duration-300 ${
                                        i === activeIndex ? 'w-10 bg-black' : 'w-2.5 bg-black/25'
                                    }`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Single slide with crossfade */}
                    <div className="relative flex-1 overflow-hidden rounded-[30px]">
                        {highlights.map((item, i) => (
                            <div
                                key={i}
                                className="absolute inset-0 flex flex-col items-start justify-end rounded-[30px] p-7.5 transition-opacity duration-700 ease-out"
                                style={{
                                    background: `linear-gradient(206deg, rgba(0, 0, 0, 0.00) 69.38%, rgba(0, 0, 0, 0.60) 81.55%), url(${item.image}) lightgray 50% / cover no-repeat`,
                                    opacity: i === activeIndex ? 1 : 0,
                                }}
                            >
                                <div
                                    className="flex max-w-100 flex-col gap-5 transition-all duration-500 ease-out"
                                    style={{
                                        opacity: i === activeIndex ? 1 : 0,
                                        transform: i === activeIndex ? 'translateY(0)' : 'translateY(16px)',
                                        transitionDelay: i === activeIndex ? '150ms' : '0ms',
                                    }}
                                >
                                    <span className="text-[28px] font-semibold leading-none text-white">{item.title}</span>
                                    <span className="text-base leading-[120%] text-white">{item.subtitle}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function VersionsSection({
    versions,
    selectedVersion,
    setSelectedVersion,
    versionCardTab,
    setVersionCardTab,
}: {
    versions: typeof vehicleData.versions;
    selectedVersion: number;
    setSelectedVersion: (i: number) => void;
    versionCardTab: VersionTab;
    setVersionCardTab: (tab: VersionTab) => void;
}) {
    const sectionRef = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);
    const [tabAnimating, setTabAnimating] = useState(false);
    const prevTab = useRef(versionCardTab);

    useEffect(() => {
        const el = sectionRef.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
            { threshold: 0.15 },
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (prevTab.current !== versionCardTab) {
            setTabAnimating(true);
            const t = setTimeout(() => setTabAnimating(false), 300);
            prevTab.current = versionCardTab;
            return () => clearTimeout(t);
        }
    }, [versionCardTab]);

    return (
        <div ref={sectionRef} className="flex flex-col items-center bg-[#EAEAF1]" style={{ padding: '80px 60px', marginTop: '-60px' }}>
            <div className="flex gap-5">
                {versions.map((ver, i) => {
                    const isSelected = selectedVersion === i;
                    return (
                        <button
                            key={ver.name}
                            onClick={() => setSelectedVersion(i)}
                            className={`flex w-100 cursor-pointer flex-col items-center gap-5 rounded-[20px] bg-white p-5 pt-10 pb-10 text-left transition-all duration-700 ease-out ${
                                isSelected
                                    ? 'border-2 border-black shadow-[2px_2px_10px_0_rgba(0,0,0,0.15)]'
                                    : 'border-2 border-transparent'
                            } ${
                                visible
                                    ? 'translate-y-0 opacity-100'
                                    : i === 0
                                        ? '-translate-y-16 opacity-0'
                                        : 'translate-y-16 opacity-0'
                            }`}
                            style={{ transitionDelay: visible ? `${i * 150}ms` : '0ms' }}
                        >
                            {/* Header */}
                            <div className="flex w-full flex-col gap-3">
                                <div className="flex items-end gap-1.5">
                                    {ver.electric && (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="11" height="14" viewBox="0 0 11 14" fill="none" className="shrink-0">
                                            <path d="M4.79427 8.74999L0.612796 8.22499C0.318741 8.18999 0.127487 8.03249 0.0390351 7.75249C-0.0494168 7.47249 0.0124525 7.23333 0.224643 7.03499L7.44077 0.175C7.49958 0.116667 7.57015 0.0730333 7.65249 0.0440999C7.73482 0.0151666 7.84656 0.000466666 7.98771 0C8.22295 0 8.40245 0.0991666 8.52618 0.2975C8.64992 0.495833 8.65275 0.699999 8.53465 0.909999L6.20573 5.25L10.3872 5.775C10.6813 5.81 10.8725 5.9675 10.961 6.2475C11.0494 6.52749 10.9875 6.76666 10.7754 6.96499L3.55923 13.825C3.50042 13.8833 3.42985 13.9272 3.34751 13.9566C3.26518 13.986 3.15344 14.0005 3.01229 14C2.77705 14 2.59755 13.9008 2.47381 13.7025C2.35008 13.5042 2.34725 13.3 2.46535 13.09L4.79427 8.74999Z" fill="black"/>
                                        </svg>
                                    )}
                                    <span className="text-xl font-semibold uppercase leading-none text-black">{ver.name}</span>
                                </div>
                                <span className="text-2xl font-semibold uppercase leading-none text-black">{ver.price}</span>
                                <span className="text-sm leading-none text-black/60">{ver.bonus}</span>
                            </div>

                            {/* Tabs */}
                            <div className="flex w-full items-center gap-2.5">
                                <div
                                    onClick={(e) => { e.stopPropagation(); setVersionCardTab('precio'); }}
                                    className={`flex h-8.5 flex-1 cursor-pointer items-center justify-center rounded-[60px] text-sm font-semibold leading-none transition-colors duration-300 ${
                                        versionCardTab === 'precio' ? 'bg-black text-white' : 'text-black'
                                    }`}
                                >
                                    Precio
                                </div>
                                <div
                                    onClick={(e) => { e.stopPropagation(); setVersionCardTab('caracteristicas'); }}
                                    className={`flex h-8.5 flex-1 cursor-pointer items-center justify-center rounded-[60px] text-sm font-semibold leading-none transition-colors duration-300 ${
                                        versionCardTab === 'caracteristicas' ? 'bg-black text-white' : 'text-black'
                                    }`}
                                >
                                    Características
                                </div>
                            </div>

                            {/* Tab content */}
                            <div className={`flex w-full flex-col gap-3.5 rounded-[20px] bg-black/5 p-2.5 transition-all duration-300 ${
                                tabAnimating ? 'translate-y-2 opacity-0' : 'translate-y-0 opacity-100'
                            }`}>
                                {versionCardTab === 'precio' ? (
                                    ver.pricing.map((item) => (
                                        <div key={item.label} className="flex items-center justify-between">
                                            <span className="text-sm leading-[120%] text-black">{item.label}</span>
                                            <span className="text-sm font-semibold leading-[120%] text-black">{item.value}</span>
                                        </div>
                                    ))
                                ) : (
                                    ver.characteristics.map((item) => (
                                        <div key={item.title} className="text-sm leading-[120%] text-black">
                                            <span className="font-semibold">{item.title}:</span>
                                            <br />
                                            {item.detail}
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* CTA buttons */}
                            <div className="flex w-full flex-col gap-4">
                                <a href="#" onClick={(e) => e.stopPropagation()} className="flex h-10 items-center justify-center rounded-[60px] bg-black text-sm leading-none text-white transition hover:bg-black/85">
                                    Cotizar
                                </a>
                                <a href="#" onClick={(e) => e.stopPropagation()} className="flex h-10 items-center justify-center rounded-[60px] border border-black text-sm leading-none text-black transition hover:bg-black/5">
                                    {versionCardTab === 'precio' ? 'Comparar modelo' : 'Ver modelo'}
                                </a>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

export default function NuevosShow({ vehicleId, footer, shorts, youtubeShorts }: { vehicleId: string; footer: any; shorts: any; youtubeShorts: any[] }) {
    const [selectedVersion, setSelectedVersion] = useState(0);
    const [versionCardTab, setVersionCardTab] = useState<'precio' | 'caracteristicas'>('precio');
    const [modal360Open, setModal360Open] = useState(false);
    const [frameIndex, setFrameIndex] = useState(0);
    const [selectedColor, setSelectedColor] = useState(0);
    const [selectedMedia, setSelectedMedia] = useState(0);
    const galeriaItems = [bz4xVideo, galeria1, galeria2, galeria1, galeria2];
    const [isDragging, setIsDragging] = useState(false);
    const dragStartX = useRef(0);
    const dragStartFrame = useRef(0);

    const vehicle = vehicleData;

    const hero = useInView(0.1);
    const section360 = useInView(0.1);
    const multimedia = useInView(0.1);
    const shortsSection = useInView(0.1);
    const ctaBanner = useInView(0.15);
    const branches = useInView(0.1);

    const handlePointerDown = useCallback((e: React.PointerEvent) => {
        setIsDragging(true);
        dragStartX.current = e.clientX;
        dragStartFrame.current = frameIndex;
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
    }, [frameIndex]);

    const handlePointerMove = useCallback((e: React.PointerEvent) => {
        if (!isDragging) return;
        const dx = e.clientX - dragStartX.current;
        const sensitivity = 30;
        const frameDelta = Math.round(dx / sensitivity);
        let newIndex = (dragStartFrame.current + frameDelta) % frames360.length;
        if (newIndex < 0) newIndex += frames360.length;
        setFrameIndex(newIndex);
    }, [isDragging]);

    const handlePointerUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    return (
        <>
            <Head title={vehicle.name} />
            <div className="min-h-screen bg-[#EAEAF1]">
                <Navbar
                    variant="white"
                    detailBar={{
                        backHref: '/nuevos',
                        vehicleName: vehicle.fullName,
                    }}
                />
                {/* Hero section */}
                <div
                    ref={hero.ref}
                    className="group/hero relative mt-28 overflow-hidden rounded-[20px]"
                    style={{
                        margin: '0 60px',
                        marginTop: '7.5rem',
                    }}
                >
                    {/* Metallic shimmer */}
                    <div
                        className="pointer-events-none absolute inset-0 z-10"
                        style={{
                            background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.08) 45%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.08) 55%, transparent 60%)',
                            backgroundSize: '200% 100%',
                            animation: 'heroShimmer 8s ease-in-out infinite',
                        }}
                    />
                    <style>{`
                        @keyframes heroShimmer {
                            0%, 60% { background-position: 200% 0; }
                            100% { background-position: -200% 0; }
                        }
                    `}</style>
                    <div
                        className="relative flex flex-col justify-between"
                        style={{
                            background: `linear-gradient(270deg, rgba(0, 0, 0, 0.00) 60.73%, rgba(0, 0, 0, 0.40) 100%), linear-gradient(180deg, rgba(0, 0, 0, 0.00) 60.06%, rgba(0, 0, 0, 0.50) 94.55%), url(${heroDetail}) center / cover no-repeat`,
                            padding: '0 65px 83px 65px',
                            height: '920px',
                        }}
                    >
                        {/* Left content */}
                        <div className={`flex max-w-105 flex-col gap-4 pt-40 transition-all duration-1000 ease-out ${hero.visible ? 'translate-x-0 opacity-100' : '-translate-x-12 opacity-0'}`}>
                            {/* Electric badge */}
                            <div className="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="11" height="14" viewBox="0 0 11 14" fill="none">
                                    <path d="M4.79427 8.74999L0.612796 8.22499C0.318741 8.18999 0.127487 8.03249 0.0390351 7.75249C-0.0494168 7.47249 0.0124525 7.23333 0.224643 7.03499L7.44077 0.175C7.49958 0.116667 7.57015 0.0730333 7.65249 0.0440999C7.73482 0.0151666 7.84656 0.000466666 7.98771 0C8.22295 0 8.40245 0.0991666 8.52618 0.2975C8.64992 0.495833 8.65275 0.699999 8.53465 0.909999L6.20573 5.25L10.3872 5.775C10.6813 5.81 10.8725 5.9675 10.961 6.2475C11.0494 6.52749 10.9875 6.76666 10.7754 6.96499L3.55923 13.825C3.50042 13.8833 3.42985 13.9272 3.34751 13.9566C3.26518 13.986 3.15344 14.0005 3.01229 14C2.77705 14 2.59755 13.9008 2.47381 13.7025C2.35008 13.5042 2.34725 13.3 2.46535 13.09L4.79427 8.74999Z" fill="white"/>
                                </svg>
                                <span className="text-xl leading-none text-white">100% Eléctrico de Toyota</span>
                            </div>

                            {/* Vehicle logo */}
                            <img src={logoCard1} alt={vehicle.name} className="h-32 w-auto self-start object-contain" />

                            {/* Description */}
                            <p className="text-base leading-[120%] text-white">
                                El Toyota bZ4X es el primer SUV 100 % eléctrico desarrollado sobre la plataforma dedicada e-TNGA, marcando el inicio de la familia Beyond Zero de Toyota. Diseñado para una movilidad más limpia y eficiente, el bZ4X combina cero emisiones, un manejo silencioso y una experiencia de conducción estable y segura.
                            </p>

                            {/* Price */}
                            <div className="mt-4 flex flex-col gap-1">
                                <span className="text-base leading-none text-white">Desde</span>
                                <span className="text-[32px] font-semibold leading-none text-white">{vehicle.price}</span>
                            </div>
                        </div>

                        {/* Bottom row: specs + download button */}
                        <div className={`flex items-end justify-between transition-all duration-1000 delay-300 ease-out ${hero.visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                            {/* Specs columns */}
                            <div className="flex items-center gap-10">
                                <div className="flex flex-col">
                                    <span className="text-sm leading-none text-[#f4f4f4]">Potencia hasta</span>
                                    <span className="text-2xl leading-none text-[#f4f4f4]">338 hp</span>
                                </div>
                                <div className="h-16.5 w-px bg-white" />
                                <div className="flex flex-col">
                                    <span className="text-sm leading-none text-[#f4f4f4]">Transmisión</span>
                                    <span className="text-2xl leading-none text-[#f4f4f4]">Automática</span>
                                </div>
                                <div className="h-16.5 w-px bg-white" />
                                <div className="flex flex-col">
                                    <span className="text-sm leading-none text-[#f4f4f4]">Combustible</span>
                                    <span className="text-2xl leading-none text-white">100% Eléctrico</span>
                                </div>
                                <div className="h-16.5 w-px bg-white" />
                                <div className="flex flex-col">
                                    <span className="text-sm leading-none text-[#f4f4f4]">Autonomía hasta</span>
                                    <span className="text-2xl leading-none text-white">478 km (WLTC)</span>
                                </div>
                            </div>

                            {/* Download button */}
                            <a
                                href="#"
                                className="flex items-center gap-2.5 rounded-[60px] border border-white p-1 transition hover:bg-white/10"
                            >
                                <span className="pl-4 text-base leading-none text-white">Descargar ficha técnica</span>
                                <span className="flex size-10 items-center justify-center rounded-full bg-white" style={{ backdropFilter: 'blur(15px)' }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="18" viewBox="0 0 14 18" fill="none">
                                        <path d="M6.75 0.75L6.75 16.75M6.75 16.75L0.75 10.75M6.75 16.75L12.75 10.75" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </span>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Versions section */}
                <VersionsSection
                    versions={vehicle.versions}
                    selectedVersion={selectedVersion}
                    setSelectedVersion={setSelectedVersion}
                    versionCardTab={versionCardTab}
                    setVersionCardTab={setVersionCardTab}
                />

                {/* 360 Section */}
                <div
                    ref={section360.ref}
                    className="flex flex-col items-center justify-center"
                    style={{
                        background: 'radial-gradient(50% 50% at 50% 50%, rgba(102, 102, 102, 0.10) 0%, rgba(0, 0, 0, 0.10) 100%), #EAEAF1',
                        padding: '80px 280px',
                        gap: '40px',
                    }}
                >
                    <h2 className={`text-center text-[32px] leading-none text-black transition-all duration-700 ease-out ${section360.visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                        {vehicle.name}, más que un eléctrico, un eléctrico Toyota.
                    </h2>

                    {/* Version tabs */}
                    <div className="flex items-center gap-2.5">
                        {vehicle.versions.map((ver, i) => (
                            <button
                                key={ver.name}
                                onClick={() => setSelectedVersion(i)}
                                className={`flex cursor-pointer items-center justify-center gap-2.5 rounded-[60px] px-5 py-2.5 transition-colors duration-300 ${
                                    selectedVersion === i
                                        ? 'bg-black text-base font-semibold leading-none text-white'
                                        : 'bg-black/10 text-base leading-none text-black'
                                }`}
                            >
                                {ver.name}
                            </button>
                        ))}
                    </div>

                    {/* 360 icon */}
                    <svg width="46" height="64" viewBox="0 0 46 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="-mt-5">
                        <path d="M10.5176 26.176C9.72823 26.176 9.02956 26.0267 8.42156 25.728C7.81356 25.4187 7.33356 25.0293 6.98156 24.56L7.58956 23.6C8.36823 24.6027 9.34423 25.104 10.5176 25.104C11.3176 25.104 11.9576 24.8907 12.4376 24.464C12.9282 24.0267 13.1736 23.4613 13.1736 22.768C13.1736 22 12.8696 21.424 12.2616 21.04C11.6536 20.656 10.8429 20.464 9.82956 20.464V19.472C10.4589 19.4613 10.9869 19.3547 11.4136 19.152C11.8509 18.9387 12.1709 18.6667 12.3736 18.336C12.5869 18.0053 12.6936 17.648 12.6936 17.264C12.6936 16.752 12.5069 16.3413 12.1336 16.032C11.7709 15.712 11.2696 15.552 10.6296 15.552C9.64823 15.552 8.72023 15.9893 7.84556 16.864L7.30156 15.904C8.29356 14.9547 9.42423 14.48 10.6936 14.48C11.3122 14.48 11.8562 14.5973 12.3256 14.832C12.8056 15.056 13.1789 15.3707 13.4456 15.776C13.7122 16.1813 13.8456 16.6453 13.8456 17.168C13.8456 17.7973 13.6536 18.3467 13.2696 18.816C12.8962 19.2853 12.3522 19.6267 11.6376 19.84C12.5229 20.0427 13.1949 20.4053 13.6536 20.928C14.1122 21.44 14.3416 22.0693 14.3416 22.816C14.3416 23.4453 14.1816 24.016 13.8616 24.528C13.5416 25.04 13.0882 25.4453 12.5016 25.744C11.9256 26.032 11.2642 26.176 10.5176 26.176ZM20.4221 18.768C21.0834 18.768 21.6754 18.9227 22.1981 19.232C22.7207 19.5413 23.1314 19.9733 23.4301 20.528C23.7287 21.0827 23.8781 21.712 23.8781 22.416C23.8781 23.0987 23.7127 23.728 23.3821 24.304C23.0621 24.8693 22.6194 25.3227 22.0541 25.664C21.4994 25.9947 20.8861 26.16 20.2141 26.16C19.4781 26.16 18.8061 25.9787 18.1981 25.616C17.6007 25.2427 17.1261 24.6933 16.7741 23.968C16.4221 23.232 16.2461 22.3413 16.2461 21.296C16.2461 20.016 16.4754 18.8693 16.9341 17.856C17.3927 16.8427 18.1234 16.0427 19.1261 15.456C20.1287 14.8587 21.4141 14.56 22.9821 14.56L23.2381 15.552C19.7394 15.552 17.7981 17.104 17.4141 20.208C17.7447 19.7813 18.1714 19.4347 18.6941 19.168C19.2167 18.9013 19.7927 18.768 20.4221 18.768ZM20.1821 25.12C20.6727 25.12 21.1101 25.0027 21.4941 24.768C21.8887 24.5333 22.1927 24.2133 22.4061 23.808C22.6301 23.392 22.7421 22.9333 22.7421 22.432C22.7421 21.6427 22.5074 21.0027 22.0381 20.512C21.5794 20.0107 20.9821 19.76 20.2461 19.76C19.5954 19.76 19.0034 19.9413 18.4701 20.304C17.9474 20.656 17.5741 21.0827 17.3501 21.584C17.3821 22.736 17.6594 23.616 18.1821 24.224C18.7154 24.8213 19.3821 25.12 20.1821 25.12ZM29.3826 26.16C28.0066 26.16 27.0412 25.648 26.4866 24.624C25.9426 23.5893 25.6706 22.1653 25.6706 20.352C25.6706 18.5387 25.9479 17.1093 26.5026 16.064C27.0572 15.008 28.0172 14.48 29.3826 14.48C30.7479 14.48 31.7079 15.008 32.2626 16.064C32.8172 17.1093 33.0946 18.5387 33.0946 20.352C33.0946 22.1547 32.8119 23.5733 32.2466 24.608C31.6919 25.6427 30.7372 26.16 29.3826 26.16ZM29.3826 25.072C30.0759 25.072 30.6092 24.864 30.9826 24.448C31.3559 24.032 31.6012 23.488 31.7186 22.816C31.8466 22.1333 31.9106 21.3067 31.9106 20.336C31.9106 18.832 31.7346 17.664 31.3826 16.832C31.0412 15.9893 30.3746 15.568 29.3826 15.568C28.6892 15.568 28.1559 15.776 27.7826 16.192C27.4199 16.608 27.1746 17.1627 27.0466 17.856C26.9186 18.5387 26.8546 19.3707 26.8546 20.352C26.8546 21.3227 26.9186 22.1493 27.0466 22.832C27.1746 23.504 27.4199 24.048 27.7826 24.464C28.1559 24.8693 28.6892 25.072 29.3826 25.072ZM36.9671 19.536C36.5191 19.536 36.1084 19.4293 35.7351 19.216C35.3617 18.992 35.0631 18.6933 34.8391 18.32C34.6257 17.9467 34.5191 17.536 34.5191 17.088C34.5191 16.64 34.6257 16.2293 34.8391 15.856C35.0631 15.4827 35.3617 15.1893 35.7351 14.976C36.1084 14.752 36.5191 14.64 36.9671 14.64C37.4151 14.64 37.8257 14.752 38.1991 14.976C38.5831 15.1893 38.8817 15.4827 39.0951 15.856C39.3191 16.2293 39.4311 16.64 39.4311 17.088C39.4311 17.536 39.3191 17.9467 39.0951 18.32C38.8817 18.6933 38.5831 18.992 38.1991 19.216C37.8257 19.4293 37.4151 19.536 36.9671 19.536ZM36.9671 18.624C37.3937 18.624 37.7564 18.4747 38.0551 18.176C38.3537 17.8773 38.5031 17.5147 38.5031 17.088C38.5031 16.6613 38.3537 16.2987 38.0551 16C37.7564 15.7013 37.3937 15.552 36.9671 15.552C36.5404 15.552 36.1777 15.7013 35.8791 16C35.5911 16.2987 35.4471 16.6613 35.4471 17.088C35.4471 17.5147 35.5911 17.8773 35.8791 18.176C36.1777 18.4747 36.5404 18.624 36.9671 18.624Z" fill="black"/>
                        <path d="M16.4626 53L15.1252 51.6822L19.158 47.6822C15.491 47.2025 12.3813 46.3004 9.82878 44.9758C7.27626 43.6511 6 42.1445 6 40.4557C6 38.4501 7.64837 36.7061 10.9451 35.2237C14.2419 33.7412 18.2601 33 23 33C27.7399 33 31.7581 33.7412 35.0549 35.2237C38.3516 36.7061 40 38.4501 40 40.4557C40 41.8089 39.1412 43.0913 37.4236 44.3029C35.7059 45.5144 33.4166 46.4452 30.5556 47.0951V45.2088C32.9796 44.5875 34.8452 43.8189 36.1523 42.9031C37.4594 41.9873 38.1124 41.1715 38.1111 40.4557C38.1111 39.3896 36.7656 38.1911 34.0746 36.8602C31.3835 35.5294 27.692 34.8639 23 34.8639C18.308 34.8639 14.6165 35.5294 11.9254 36.8602C9.23441 38.1911 7.88889 39.3896 7.88889 40.4557C7.88889 41.3454 8.93407 42.3402 11.0244 43.4399C13.1148 44.5409 15.7605 45.3194 18.9616 45.7754L15.1233 41.9897L16.4588 40.6719L22.7072 46.836L16.4626 53Z" fill="black"/>
                    </svg>

                    {/* 360 viewer */}
                    <div
                        className={`relative select-none transition-all duration-700 delay-200 ease-out ${section360.visible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
                        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
                        onPointerDown={handlePointerDown}
                        onPointerMove={handlePointerMove}
                        onPointerUp={handlePointerUp}
                        onPointerCancel={handlePointerUp}
                    >
                        <img
                            src={frames360[frameIndex]}
                            alt={`${vehicle.name} 360° vista`}
                            className="pointer-events-none h-auto w-full max-w-[700px] object-contain"
                            draggable={false}
                        />
                    </div>

                    {/* Specs + colors */}
                    <div className={`flex gap-15 p-2.5 transition-all duration-700 delay-400 ease-out ${section360.visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                        {/* Colors */}
                        <div className="flex w-57.5 flex-col gap-2.5">
                            <span className="text-base font-semibold leading-none text-black">Colores disponibles</span>
                            <div className="flex items-center gap-2.5">
                                {[
                                    { color: '#878787', label: 'Gris' },
                                    { color: '#dadada', label: 'Plateado' },
                                    { color: '#102e48', label: 'Azul' },
                                    { color: '#a2110a', label: 'Rojo' },
                                    { color: '#000000', label: 'Negro' },
                                ].map((c, i) => (
                                    <button
                                        key={c.color}
                                        onClick={() => setSelectedColor(i)}
                                        className="size-8 shrink-0 cursor-pointer rounded-full border-2 transition-all duration-200"
                                        style={{
                                            backgroundColor: c.color,
                                            borderColor: selectedColor === i ? '#ffffff' : 'rgba(255,255,255,0.20)',
                                            boxShadow: selectedColor === i ? '0 0 0 1px rgba(0,0,0,0.15)' : 'none',
                                        }}
                                        title={c.label}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Specs grid */}
                        <div className="flex w-130 flex-col gap-5">
                            <div className="flex gap-15">
                                <div className="flex w-57.5 flex-col gap-2.5">
                                    <span className="text-base font-semibold leading-none text-black">Seguridad</span>
                                    <span className="text-xs leading-none text-black">8 airbags / BA / EDB / HAC / BSM/ SEA/ Sensor Del. y Tra. Cámara 360° + TSS 3.0</span>
                                </div>
                                <div className="flex w-57.5 flex-col gap-2.5">
                                    <span className="text-base font-semibold leading-none text-black">Conectividad</span>
                                    <span className="text-xs leading-none text-black">Pantalla digital TFT de 7'' + Pantalla de audio de 14'' con conectividad AC y AD + 6 parlantes con amplificador</span>
                                </div>
                            </div>
                            <div className="flex gap-15">
                                <div className="flex w-57.5 flex-col gap-2.5">
                                    <span className="text-base font-semibold leading-none text-black">Performance</span>
                                    <span className="text-xs leading-none text-black">Motor eléctrico, Potencia 165 KW (221 HP) / 269 NM. Batería de Ion litio de 73.1 KWh. 0 -100Kph: 7,4 segundos</span>
                                </div>
                                <div className="flex w-57.5 flex-col gap-2.5">
                                    <span className="text-base font-semibold leading-none text-black">Autonomía</span>
                                    <span className="text-xs leading-none text-black">478 KM</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Aspectos destacados */}
                <HighlightsCarousel />

                {/* Multimedia */}
                <div
                    ref={multimedia.ref}
                    className="flex flex-col items-center rounded-b-[30px] bg-[#EAEAF1]"
                    style={{ padding: '60px 60px 120px 60px', gap: '40px' }}
                >
                    <h2 className={`text-[32px] leading-none text-black transition-all duration-700 ease-out ${multimedia.visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>Multimedia</h2>
                    <div className={`flex w-full flex-col gap-5 transition-all duration-700 delay-200 ease-out ${multimedia.visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                        {/* Main media */}
                        {selectedMedia === 0 ? (
                            <video
                                className="h-185.5 w-full rounded-[30px] object-cover"
                                controls
                                playsInline
                            >
                                <source src={bz4xVideo} type="video/mp4" />
                            </video>
                        ) : (
                            <div
                                className="h-185.5 w-full rounded-[30px]"
                                style={{ background: `url(${galeriaItems[selectedMedia]}) lightgray 50% / cover no-repeat` }}
                            />
                        )}

                        {/* Gallery thumbnails */}
                        <div className="flex items-center gap-5">
                            <button
                                onClick={() => setSelectedMedia((prev) => (prev === 0 ? galeriaItems.length - 1 : prev - 1))}
                                className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-black/60 transition hover:bg-black/80"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="8" height="13" viewBox="0 0 8 13" fill="none">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M0.296188 7.071L5.95319 12.728L7.36719 11.314L2.41719 6.364L7.36719 1.414L5.95319 0L0.296188 5.657C0.108717 5.84453 0.00340128 6.09884 0.00340128 6.364C0.00340128 6.62916 0.108717 6.88347 0.296188 7.071Z" fill="white"/>
                                </svg>
                            </button>
                            <div className="flex flex-1 gap-5">
                                {galeriaItems.map((item, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setSelectedMedia(i)}
                                        className={`relative h-40 flex-1 cursor-pointer overflow-hidden rounded-[20px] transition-all duration-200 ${
                                            selectedMedia === i ? 'ring-2 ring-black' : 'opacity-60 hover:opacity-100'
                                        }`}
                                        style={i === 0 ? { background: '#000' } : { background: `url(${item}) lightgray 50% / cover no-repeat` }}
                                    >
                                        {i === 0 && (
                                            <div className="flex size-full items-center justify-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white">
                                                    <path d="M8 5v14l11-7z"/>
                                                </svg>
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={() => setSelectedMedia((prev) => (prev === galeriaItems.length - 1 ? 0 : prev + 1))}
                                className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-black/60 transition hover:bg-black/80"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="8" height="13" viewBox="0 0 8 13" fill="none">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M7.071 7.071L1.414 12.728L0 11.314L4.95 6.364L0 1.414L1.414 0L7.071 5.657C7.25847 5.84453 7.36379 6.09884 7.36379 6.364C7.36379 6.62916 7.25847 6.88347 7.071 7.071Z" fill="white"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Shorts */}
                {shorts && (
                    <section ref={shortsSection.ref} className="flex w-full flex-col items-center gap-10 bg-[#EAEAF1] px-15 pt-15 pb-25">
                        <h2 className={`text-center text-[32px] leading-none text-black transition-all duration-700 ease-out ${shortsSection.visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>Shorts y reviews</h2>
                        <div className={`w-full transition-all duration-700 delay-200 ease-out ${shortsSection.visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                            <ShortsCarousel data={shorts} videos={youtubeShorts || []} variant="light" />
                        </div>
                    </section>
                )}

                {/* Contact CTA banner */}
                <div ref={ctaBanner.ref} className="flex flex-col items-center bg-[#EAEAF1] p-15">
                    <div
                        className={`flex w-full flex-col items-start justify-end rounded-[30px] p-7.5 transition-all duration-700 ease-out ${ctaBanner.visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
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
                                    <ArrowIcon className="scale-75 text-white" />
                                </span>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Branches section */}
                <div ref={branches.ref} className="flex flex-col items-center gap-10 rounded-b-[30px] bg-[#EAEAF1] px-15 py-20">
                    <h2 className={`text-center text-[32px] leading-[120%] text-black transition-all duration-700 ease-out ${branches.visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                        Visítanos en
                        <br />
                        nuestras sucursales
                    </h2>
                    <div className="flex w-full gap-5">
                        {/* La Serena */}
                        <div className={`relative flex-1 overflow-hidden rounded-[20px] transition-all duration-700 delay-200 ease-out ${branches.visible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
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
                        {/* Ovalle */}
                        <div className={`relative flex-1 overflow-hidden rounded-[20px] transition-all duration-700 delay-400 ease-out ${branches.visible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
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

                {footer && <Footer data={footer} />}
            </div>

            <Modal360
                open={modal360Open}
                onClose={() => setModal360Open(false)}
                name={vehicle.name}
                subtitle={vehicle.subtitle}
            />
        </>
    );
}
