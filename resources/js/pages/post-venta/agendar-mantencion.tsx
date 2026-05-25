import { Head, router, usePage } from '@inertiajs/react';
import { toast } from 'sonner';
import { BranchesSection } from '@/components/landing/branches-section';
import { BranchMap, type BranchMapData } from '@/components/landing/branch-map';
import { ContactCtaBanner } from '@/components/landing/contact-cta-banner';
import { Footer } from '@/components/landing/footer';
import { Navbar } from '@/components/landing/navbar';
import { isVideoUrl, pickResponsiveImage } from '@/lib/media';
import { useIsMobile } from '@/hooks/use-mobile';
import useEmblaCarousel from 'embla-carousel-react';
import { DayPicker } from 'react-day-picker';
import { es } from 'date-fns/locale';
import { format } from 'date-fns';
import 'react-day-picker/style.css';
const allTimeSlots = ['09:00','09:30','10:00','10:30','11:00','11:30','12:00','12:30','13:00','14:45','15:00','15:30','16:00','16:30','17:00','17:30','18:00'];

const calendarStyles = `
    .rdp-root { --rdp-accent-color: #000; --rdp-accent-background: #000; --rdp-day_button-height: 40px; --rdp-day_button-width: 40px; font-family: inherit; color: #000; }
    .rdp-month_caption { font-size: 16px; font-weight: 600; color: #000; }
    .rdp-weekday { font-size: 13px; color: rgba(0,0,0,0.5); font-weight: 600; }
    .rdp-day_button { font-size: 14px; border-radius: 50%; color: #000; font-weight: 500; }
    .rdp-selected .rdp-day_button { background: #000 !important; color: #fff !important; }
    .rdp-today:not(.rdp-selected) .rdp-day_button { font-weight: 700; color: #000; border: 2px solid #000; }
    .rdp-disabled .rdp-day_button { color: rgba(0,0,0,0.2) !important; }
    .rdp-chevron { fill: #000; }
    .rdp-button_next, .rdp-button_previous { border: 1px solid rgba(0,0,0,0.2); border-radius: 50%; width: 32px; height: 32px; }
    .rdp-day_button:hover:not(.rdp-selected) { background: rgba(0,0,0,0.08); }
`;
import { useCallback, useEffect, useRef, useState } from 'react';
import heroImg from '@images/mantencion/hero-imagen.png?format=webp';
import ejemploVideo from '@images/seminuevos/ejemplo-video.png?format=webp';
import card1Img from '@images/mantencion/card_1.png?format=webp';
import card2Img from '@images/mantencion/card_2.jpg?format=webp';
import card3Img from '@images/mantencion/card_3.png?format=webp';
import thirdSectionImg from '@images/mantencion/image_third_section.jpg?format=webp';
import step2Img from '@images/mantencion/image_step2.png?format=webp';
import step4Img from '@images/mantencion/image_step4.png?format=webp';

type BranchLite = BranchMapData & { id: number; name: string; city: string | null; address: string | null };
type ServiceLite = { id: number; name: string; slug: string };
type VehicleModelLite = { id: number; name: string };

const carouselCards: (
    | { type: 'image'; image: string }
    | { type: 'text'; titulo: string; subtitulo: string; desc: string }
)[] = [
    { type: 'image', image: card1Img },
    {
        type: 'text',
        titulo: 'Los inicios',
        subtitulo: '1968',
        desc: 'Camal Musalem nace en 1968 con un taller mecánico en Ovalle, dando inicio a su desarrollo en el rubro automotriz en Ovalle y La Serena.',
    },
    { type: 'image', image: card2Img },
    {
        type: 'text',
        titulo: 'Reparaciones, revisión y diagnóstico',
        subtitulo: 'Servicio autorizado y atención experta',
        desc: 'Contamos con repuestos originales y personal técnico calificado para revisar, diagnosticar y reparar tu vehículo con la confianza y respaldo que necesitas.',
    },
    { type: 'image', image: card3Img },
    {
        type: 'text',
        titulo: 'Desabolladura\ny pintura',
        subtitulo: 'Terminaciones de calidad para tu vehículo',
        desc: 'Realizamos trabajos de desabolladura, cuadratura y pintura con terminaciones óptimas, utilizando equipamiento especializado y tecnología adecuada para cada reparación.',
    },
];

export default function AgendarMantencion({
    footer,
    mantencion_hero,
    branches = [],
    services = [],
    vehicle_models = [],
}: {
    footer: any | null;
    mantencion_hero?: any | null;
    branches?: BranchLite[];
    services?: ServiceLite[];
    vehicle_models?: VehicleModelLite[];
}) {
    const hero = mantencion_hero ?? {};
    const isMobile = useIsMobile();
    const heroMedia = pickResponsiveImage(hero.hero_image, hero.hero_image_mobile, isMobile);
    const { flash } = usePage<{ flash: { success?: string; error?: string } }>().props;
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (flash?.error) toast.error(flash.error);
    }, [flash?.error]);
    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: true,
        align: 'start',
    });
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
    const [isPaused, setIsPaused] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [formStep, setFormStep] = useState(0);
    const [stepDirection, setStepDirection] = useState<'left' | 'right'>('right');
    const prevStepRef = useRef(0);

    const changeStep = (newStep: number) => {
        setStepDirection(newStep > prevStepRef.current ? 'right' : 'left');
        prevStepRef.current = newStep;
        setFormStep(newStep);
    };
    // Step 0
    const [servicio, setServicio] = useState('');
    const [taller, setTaller] = useState('');
    const [selectedDate, setSelectedDate] = useState<Date | undefined>();
    const [selectedTime, setSelectedTime] = useState('');
    const [showCalendar, setShowCalendar] = useState(false);
    const calendarRef = useRef<HTMLDivElement>(null);

    // Step 1
    const [modelo, setModelo] = useState('');
    const [anio, setAnio] = useState('');
    const [patente, setPatente] = useState('');
    const [comentario, setComentario] = useState('');
    // Step 2
    const [nombre, setNombre] = useState('');
    const [rut, setRut] = useState('');
    const [telefono, setTelefono] = useState('');
    const [correo, setCorreo] = useState('');
    const [aceptaPrivacidad, setAceptaPrivacidad] = useState(false);

    const formatRut = (value: string) => {
        let clean = value.replace(/[^0-9kK]/g, '');
        if (clean.length > 9) clean = clean.slice(0, 9);
        if (clean.length <= 1) return clean;
        const dv = clean.slice(-1);
        const body = clean.slice(0, -1);
        const formatted = body.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        return `${formatted}-${dv}`;
    };

    // Close calendar on outside click
    useEffect(() => {
        if (!showCalendar) return;
        const handleClick = (e: MouseEvent) => {
            if (calendarRef.current && !calendarRef.current.contains(e.target as Node)) {
                setShowCalendar(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [showCalendar]);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setSelectedIndex(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        setScrollSnaps(emblaApi.scrollSnapList());
        emblaApi.on('select', onSelect);
        onSelect();
    }, [emblaApi, onSelect]);

    // Set html background to black for this page
    useEffect(() => {
        const html = document.documentElement;
        const prev = html.style.backgroundColor;
        html.style.backgroundColor = '#000';
        return () => { html.style.backgroundColor = prev; };
    }, []);

    // Autoplay
    useEffect(() => {
        if (!emblaApi || isPaused) return;
        const interval = setInterval(() => emblaApi.scrollNext(), 3000);
        return () => clearInterval(interval);
    }, [emblaApi, isPaused]);

    return (
        <div className="min-h-screen bg-black">
            <style>{`
                @keyframes fadeSlideDown {
                    from { opacity: 0; transform: translateY(-20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes slideFromRight {
                    from { opacity: 0; transform: translateX(40px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                @keyframes slideFromLeft {
                    from { opacity: 0; transform: translateX(-40px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                @keyframes fadeSlideIn {
                    from { opacity: 0; transform: translateY(12px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
            <Head title="Agendar Mantención — Toyota Musalem" />
            <Navbar variant="white" />

            <main className="flex flex-col bg-black">
                {/* Hero */}
                {mantencion_hero && (
                <section className="bg-white pb-10 lg:pb-20">
                    <div
                        className="relative h-100 shrink-0 overflow-hidden rounded-b-[30px] lg:h-119.25"
                        style={!isVideoUrl(heroMedia) ? {
                            backgroundImage: `url(${heroMedia || heroImg})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                        } : undefined}
                    >
                        {isVideoUrl(heroMedia) && (
                            <video src={heroMedia!} className="absolute inset-0 size-full object-cover" autoPlay muted loop playsInline />
                        )}
                        <div
                            className="absolute inset-0"
                            style={{
                                background:
                                    'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.60) 100%)',
                            }}
                        />
                        <div
                            className="absolute inset-0"
                            style={{ background: 'rgba(0,0,0,0.20)' }}
                        />
                        <span
                            className="absolute left-1/2 -translate-x-1/2 text-center text-[32px] leading-[110%] font-normal text-white lg:text-[48px] lg:leading-[100%]"
                            style={{
                                top: 'calc(50% + 31.5px)',
                                fontFamily: '"Toyota Type"',
                            }}
                        >
                            {hero.title || 'Servicio técnico'}
                        </span>
                    </div>
                </section>
                )}

                {/* Carrusel */}
                <section className="flex w-full flex-col items-start bg-white px-5 pt-10 lg:px-15 lg:pt-20">
                    <div className="flex w-full flex-col items-start gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-0">
                        <h2 className="text-left text-2xl leading-[120%] font-semibold text-black lg:w-115.25 lg:text-[40px]">
                            Servicio técnico Musalem
                        </h2>
                        <p className="text-left text-sm leading-[120%] font-normal text-black lg:w-130 lg:text-base">
                            Nuestro objetivo está enfocado en ofrecer y entregar
                            a nuestros clientes un servicio de alto nivel en
                            calidad y seguridad en cada reparación que
                            realizamos.
                        </p>
                    </div>

                    {/* Carousel */}
                    <div
                        className="mt-10 w-full overflow-hidden lg:mt-20"
                        ref={emblaRef}
                        onMouseEnter={() => setIsPaused(true)}
                        onMouseLeave={() => setIsPaused(false)}
                        onPointerDown={() => setIsPaused(true)}
                    >
                        <div className="flex gap-5">
                            {carouselCards.map((card, i) =>
                                card.type === 'image' ? (
                                    <div
                                        key={i}
                                        className="h-100 w-72 shrink-0 rounded-[20px] lg:h-120.75 lg:w-105 lg:rounded-[30px]"
                                        style={{
                                            background: `linear-gradient(0deg, rgba(0,0,0,0.00) 0%, rgba(0,0,0,0.00) 100%), linear-gradient(180deg, rgba(0,0,0,0.00) 0%, rgba(0,0,0,0.20) 100%), url(${card.image}) lightgray center / cover no-repeat`,
                                        }}
                                    />
                                ) : (
                                    <div
                                        key={i}
                                        className="flex h-100 w-72 shrink-0 flex-col items-start gap-5 rounded-[20px] bg-[#EAEAF1] px-5 py-7.5 lg:h-120.75 lg:w-105 lg:gap-10 lg:rounded-[30px] lg:px-10 lg:py-15"
                                    >
                                        <h3 className="text-2xl leading-[120%] font-semibold whitespace-pre-line text-black lg:text-[32px]">
                                            {card.titulo}
                                        </h3>
                                        <div className="flex flex-col gap-2 text-sm leading-[120%] text-black lg:text-base">
                                            {card.subtitulo && (
                                                <span className="font-semibold">
                                                    {card.subtitulo}
                                                </span>
                                            )}
                                            <p className="font-normal">
                                                {card.desc}
                                            </p>
                                        </div>
                                    </div>
                                ),
                            )}
                        </div>
                    </div>

                    {/* Paginación */}
                    <div className="mt-7.5 mb-10 flex w-full items-center justify-center gap-2 lg:mt-10 lg:mb-20 lg:gap-2.5">
                        {scrollSnaps.map((_, i) => (
                            <div
                                key={i}
                                className={`h-2 rounded-full transition-all duration-300 lg:h-2.5 ${
                                    i === selectedIndex
                                        ? 'w-8 bg-black lg:w-10'
                                        : 'w-2 bg-black/30 lg:w-2.5'
                                }`}
                            />
                        ))}
                    </div>
                </section>

                {/* Reserva tu hora */}
                <section className="flex w-full flex-col items-center gap-10 bg-white px-5 py-10 lg:gap-20 lg:px-0 lg:py-20">
                    <div className="flex w-330 max-w-full flex-col items-center gap-10 rounded-[30px] bg-[#EAEAF1] p-5 lg:gap-20 lg:p-15">
                        {!showForm ? (
                            /* Contenido base */
                            <div key="base" className="flex w-full flex-col items-start gap-7.5 lg:flex-row lg:items-center lg:gap-20" style={{ animation: 'fadeSlideDown 0.5s ease-out' }}>
                                <div className="flex flex-col items-start justify-center gap-5 lg:gap-10">
                                    <h2 className="text-[28px] leading-[120%] font-semibold text-black lg:text-[40px]">
                                        Reserva tu hora
                                    </h2>
                                    <p className="text-sm leading-[120%] font-normal text-black lg:w-130 lg:text-base">
                                        Ahorra tiempo programando el servicio aquí
                                        mismo. Después de enviar el formulario, nos
                                        pondremos en contacto para confirmar su cita de
                                        servicio.
                                    </p>
                                    <button
                                        onClick={() => { setShowForm(true); setFormStep(0); setStepDirection('right'); prevStepRef.current = 0; }}
                                        className="flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-[60px] bg-black px-8 py-4 text-base leading-[120%] font-normal text-white transition hover:bg-black/85 lg:w-auto lg:px-15 lg:py-4.75"
                                    >
                                        Ir a agendar servicio
                                    </button>
                                </div>
                                <div
                                    className="flex aspect-square w-full shrink-0 flex-col items-start justify-end gap-2.5 rounded-[30px] p-3 lg:aspect-auto lg:h-140 lg:w-140 lg:p-7.5"
                                    style={{
                                        background: `url(${thirdSectionImg}) lightgray center / cover no-repeat`,
                                    }}
                                >
                                    <div
                                        className="flex shrink-0 flex-col items-start justify-center gap-2.5 self-stretch overflow-hidden rounded-2xl p-5"
                                        style={{
                                            background: 'linear-gradient(to left, rgba(0,0,0,0.2), rgba(0,0,0,0.2)), linear-gradient(to left, rgba(0,0,0,0.2), rgba(0,0,0,0.2))',
                                            backdropFilter: 'blur(30px)',
                                        }}
                                    >
                                        <div className="flex flex-col items-start gap-4 self-stretch">
                                            <span className="text-xl leading-none font-semibold text-white uppercase">Horario de atención</span>
                                            <div className="flex h-3.5 items-center justify-between self-stretch">
                                                <span className="text-sm leading-none font-normal text-white">Lunes a Viernes</span>
                                                <span className="text-sm leading-none font-normal text-white">09:00 a 13:30 - 14:45 a 18:30</span>
                                            </div>
                                            <div className="flex h-3.5 items-center justify-between self-stretch">
                                                <span className="text-sm leading-none font-normal text-white">Domingo</span>
                                                <span className="text-sm leading-none font-normal text-white">Cerrado</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            /* Formulario */
                            <div key="form" className="flex w-full flex-col gap-7.5 lg:gap-10" style={{ animation: 'fadeSlideDown 0.5s ease-out' }}>
                                {/* Volver */}
                                <button
                                    onClick={() => setShowForm(false)}
                                    className="flex h-9.5 w-fit cursor-pointer items-center gap-2.5 rounded-[60px] border border-black py-2.5 pr-5 pl-2.5 text-sm leading-none text-black transition hover:bg-black/5"
                                >
                                    <span className="flex size-6 items-center justify-center rounded-full bg-black">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="9" viewBox="0 0 12 9" fill="none">
                                            <path d="M10.6016 4.34961H0.601563M0.601563 4.34961L4.35156 8.09961M0.601563 4.34961L4.35156 0.599609" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </span>
                                    Volver
                                </button>

                                {/* Tabs: número solo en mobile, label completo en desktop */}
                                <div className="flex h-10 w-full gap-2 lg:h-12 lg:gap-5">
                                    {['Servicio y horario', 'Datos del vehículo', 'Datos de contacto', 'Confirmar'].map((label, i) => (
                                        <button
                                            key={label}
                                            onClick={() => changeStep(i)}
                                            className={`flex h-10 flex-1 cursor-pointer items-center justify-center rounded-[60px] px-2 text-sm leading-[120%] font-normal transition lg:h-12 lg:px-5 lg:text-base ${
                                                formStep === i
                                                    ? 'bg-black text-white'
                                                    : 'bg-white text-black hover:bg-black/5'
                                            }`}
                                        >
                                            <span className="lg:hidden">{i + 1}</span>
                                            <span className="hidden lg:inline">{label}</span>
                                        </button>
                                    ))}
                                </div>

                                {/* Content */}
                                <div className="flex w-full flex-col items-stretch gap-7.5 lg:flex-row lg:items-center lg:gap-15">
                                    {/* Mapa de sucursales (paso 0) o imagen estática para otros pasos */}
                                    <div
                                        className="relative w-full shrink-0 lg:h-140 lg:w-140"
                                        style={{ boxShadow: '2px 2px 2px 2px rgba(0,0,0,0.02)' }}
                                    >
                                        {formStep === 0 ? (
                                            <div className="flex w-full flex-col gap-2.5">
                                                <BranchMap
                                                    branch={branches.find((b) => String(b.id) === taller) ?? branches[0] ?? null}
                                                    className="aspect-square w-full lg:aspect-auto lg:h-115"
                                                />
                                                <div
                                                    className="flex flex-col gap-2.5 overflow-hidden rounded-2xl p-5"
                                                    style={{ background: 'rgba(0,0,0,0.60)', backdropFilter: 'blur(30px)' }}
                                                >
                                                    <span className="text-xl font-semibold uppercase leading-none text-white" style={{ fontFamily: '"Toyota Type"' }}>
                                                        Sucursales
                                                    </span>
                                                    {branches.map((b) => (
                                                        <span key={b.id} className="text-sm leading-none text-white" style={{ fontFamily: '"Toyota Type"' }}>
                                                            {[b.address, b.city].filter(Boolean).join(', ') || b.name}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="relative aspect-square w-full overflow-hidden rounded-[30px] lg:h-140 lg:aspect-auto">
                                                <img
                                                    src={formStep <= 2 ? step2Img : step4Img}
                                                    alt=""
                                                    className="absolute inset-0 size-full object-cover transition-opacity duration-500"
                                                    key={formStep <= 2 ? 'step2' : 'step4'}
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {/* Formulario paso actual */}
                                    <div key={formStep} className="flex w-full flex-1 flex-col items-start gap-7.5 lg:gap-10" style={{ animation: `${stepDirection === 'right' ? 'slideFromRight' : 'slideFromLeft'} 0.4s ease-out` }}>
                                        <h3 className="text-xl leading-[120%] font-semibold text-black lg:text-2xl lg:leading-none">
                                            {['Servicio y horario', 'Datos del vehículo', 'Datos de contacto', 'Resumen de tu agendamiento'][formStep]}
                                        </h3>
                                        <div className="flex w-full flex-col gap-5">
                                            {formStep === 0 && (
                                                <>
                                                    <div className="flex flex-col gap-2.5">
                                                        <span className="text-sm leading-none font-normal text-black">Servicio</span>
                                                        <div className="relative">
                                                            <select
                                                                value={servicio}
                                                                onChange={(e) => setServicio(e.target.value)}
                                                                className="h-10 w-full appearance-none rounded-[60px] border border-transparent bg-white px-5 py-2.5 text-sm leading-none font-normal text-black outline-none"
                                                            >
                                                                <option value="" disabled>Seleccione Servicio</option>
                                                                {services.map((s) => (
                                                                    <option key={s.id} value={s.slug}>{s.name}</option>
                                                                ))}
                                                            </select>
                                                            <svg className="pointer-events-none absolute top-1/2 right-5 -translate-y-1/2" xmlns="http://www.w3.org/2000/svg" width="6" height="10" viewBox="0 0 6 10" fill="none"><path d="M1 1L5 5L1 9" stroke="black" strokeWidth="1.2"/></svg>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col gap-2.5">
                                                        <span className="text-sm leading-none font-normal text-black">Taller</span>
                                                        <div className="relative">
                                                            <select
                                                                value={taller}
                                                                onChange={(e) => setTaller(e.target.value)}
                                                                className="h-10 w-full appearance-none rounded-[60px] border border-transparent bg-white px-5 py-2.5 text-sm leading-none font-normal text-black outline-none"
                                                            >
                                                                <option value="" disabled>Seleccionar taller</option>
                                                                {branches.map((b) => (
                                                                    <option key={b.id} value={String(b.id)}>
                                                                        {[b.city, b.address].filter(Boolean).join(' - ') || b.name}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                            <svg className="pointer-events-none absolute top-1/2 right-5 -translate-y-1/2" xmlns="http://www.w3.org/2000/svg" width="6" height="10" viewBox="0 0 6 10" fill="none"><path d="M1 1L5 5L1 9" stroke="black" strokeWidth="1.2"/></svg>
                                                        </div>
                                                    </div>
                                                    <div className="relative flex flex-col gap-2.5">
                                                        <span className="text-sm leading-none font-normal text-black">Fecha y hora</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowCalendar(!showCalendar)}
                                                            className="flex h-10 w-full cursor-pointer items-center justify-between rounded-[60px] border border-transparent bg-white px-5 py-2.5 text-left"
                                                        >
                                                            <span className={`text-sm leading-none font-normal ${selectedDate ? 'text-black' : 'text-black/60'}`}>
                                                                {selectedDate
                                                                    ? `${format(selectedDate, "d 'de' MMMM yyyy", { locale: es })}${selectedTime ? ` - ${selectedTime}` : ''}`
                                                                    : 'Seleccionar fecha y hora'}
                                                            </span>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" stroke="black" strokeWidth="1.5"/><path d="M16 2V6M8 2V6M3 10H21" stroke="black" strokeWidth="1.5" strokeLinecap="round"/></svg>
                                                        </button>
                                                        {showCalendar && (
                                                            <div ref={calendarRef} className="absolute top-full left-0 z-10 mt-2 rounded-[20px] bg-white p-4 shadow-lg">
                                                                <style>{calendarStyles}</style>
                                                                <DayPicker
                                                                    mode="single"
                                                                    selected={selectedDate}
                                                                    onSelect={(date) => {
                                                                        if (!date) return;
                                                                        setSelectedDate(date);
                                                                        if (!selectedTime) {
                                                                            setSelectedTime(allTimeSlots[0] ?? '');
                                                                        }
                                                                    }}
                                                                    locale={es}
                                                                    disabled={{ before: new Date() }}
                                                                />
                                                                <div className="mt-3 flex flex-col gap-2 border-t border-black/10 pt-3">
                                                                    <div className="flex items-center justify-between">
                                                                        <span className="text-sm font-normal text-black">Hora</span>
                                                                        {!taller && (
                                                                            <span className="text-xs text-black/60">Selecciona un taller primero</span>
                                                                        )}
                                                                    </div>
                                                                    <div className="grid max-h-40 grid-cols-3 gap-1.5 overflow-y-auto">
                                                                        {allTimeSlots.map(t => {
                                                                            const isSelected = selectedTime === t;
                                                                            return (
                                                                                <button
                                                                                    key={t}
                                                                                    type="button"
                                                                                    disabled={!taller || !selectedDate}
                                                                                    onClick={() => setSelectedTime(t)}
                                                                                    className={`relative rounded-[60px] py-2 text-center text-xs transition ${
                                                                                        !taller || !selectedDate
                                                                                            ? 'cursor-not-allowed bg-black/5 text-black/30'
                                                                                            : isSelected
                                                                                                ? 'cursor-pointer bg-black text-white'
                                                                                                : 'cursor-pointer bg-black/5 text-black hover:bg-black/10'
                                                                                    }`}
                                                                                >
                                                                                    {t}
                                                                                </button>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                </div>
                                                                <button
                                                                    onClick={() => setShowCalendar(false)}
                                                                    className="mt-3 w-full cursor-pointer rounded-[60px] bg-black py-2.5 text-center text-sm text-white transition hover:bg-black/85"
                                                                >
                                                                    Confirmar
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </>
                                            )}
                                            {formStep === 1 && (
                                                <>
                                                    <div className="flex flex-col gap-2.5">
                                                        <span className="text-sm leading-none font-normal text-black">Modelo</span>
                                                        <div className="relative">
                                                            <select
                                                                value={modelo}
                                                                onChange={(e) => setModelo(e.target.value)}
                                                                className="h-10 w-full appearance-none rounded-[60px] border border-transparent bg-white px-5 py-2.5 text-sm leading-none font-normal text-black outline-none"
                                                            >
                                                                <option value="" disabled>Seleccione modelo del vehículo</option>
                                                                {vehicle_models.map((m) => (
                                                                    <option key={m.id} value={m.name}>{m.name}</option>
                                                                ))}
                                                            </select>
                                                            <svg className="pointer-events-none absolute top-1/2 right-5 -translate-y-1/2" xmlns="http://www.w3.org/2000/svg" width="6" height="10" viewBox="0 0 6 10" fill="none"><path d="M1 1L5 5L1 9" stroke="black" strokeWidth="1.2"/></svg>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col gap-2.5">
                                                        <span className="text-sm leading-none font-normal text-black">Año</span>
                                                        <input
                                                            type="text"
                                                            value={anio}
                                                            onChange={(e) => setAnio(e.target.value)}
                                                            placeholder="Seleccionar año"
                                                            className="h-10 w-full rounded-[60px] border border-transparent bg-white px-5 py-2.5 text-sm leading-none font-normal text-black placeholder:text-black/60 outline-none"
                                                        />
                                                    </div>
                                                    <div className="flex flex-col gap-2.5">
                                                        <span className="text-sm leading-none font-normal text-black">Patente</span>
                                                        <input
                                                            type="text"
                                                            value={patente}
                                                            onChange={(e) => setPatente(e.target.value.toUpperCase())}
                                                            placeholder="Patente del vehículo"
                                                            className="h-10 w-full rounded-[60px] border border-transparent bg-white px-5 py-2.5 text-sm leading-none font-normal text-black placeholder:text-black/60 outline-none"
                                                        />
                                                    </div>
                                                    <div className="flex flex-col gap-2.5">
                                                        <span className="text-sm leading-none font-normal text-black">Comentario</span>
                                                        <textarea
                                                            value={comentario}
                                                            onChange={(e) => setComentario(e.target.value)}
                                                            placeholder="Escribe aquí cualquier comentario, síntoma o detalle que debamos considerar"
                                                            className="h-28.5 w-full resize-none rounded-[20px] border border-transparent bg-white p-5 text-sm leading-none font-normal text-black placeholder:text-black/60 outline-none"
                                                        />
                                                    </div>
                                                </>
                                            )}
                                            {formStep === 2 && (
                                                <>
                                                    <div className="flex flex-col gap-2.5">
                                                        <span className="text-sm leading-none font-normal text-black">Nombre</span>
                                                        <input
                                                            type="text"
                                                            value={nombre}
                                                            onChange={(e) => setNombre(e.target.value)}
                                                            placeholder="Nombre y apellido"
                                                            className="h-10 w-full rounded-[60px] border border-transparent bg-white px-5 py-2.5 text-sm leading-none font-normal text-black placeholder:text-black/60 outline-none"
                                                        />
                                                    </div>
                                                    <div className="flex flex-col gap-2.5">
                                                        <span className="text-sm leading-none font-normal text-black">Rut</span>
                                                        <input
                                                            type="text"
                                                            value={rut}
                                                            onChange={(e) => setRut(formatRut(e.target.value))}
                                                            placeholder="12.345.678-9"
                                                            className="h-10 w-full rounded-[60px] border border-transparent bg-white px-5 py-2.5 text-sm leading-none font-normal text-black placeholder:text-black/60 outline-none"
                                                        />
                                                    </div>
                                                    <div className="flex flex-col gap-2.5">
                                                        <span className="text-sm leading-none font-normal text-black">Teléfono</span>
                                                        <input
                                                            type="tel"
                                                            value={telefono}
                                                            onChange={(e) => setTelefono(e.target.value)}
                                                            placeholder="+569"
                                                            className="h-10 w-full rounded-[60px] border border-transparent bg-white px-5 py-2.5 text-sm leading-none font-normal text-black placeholder:text-black/60 outline-none"
                                                        />
                                                    </div>
                                                    <div className="flex flex-col gap-2.5">
                                                        <span className="text-sm leading-none font-normal text-black">Correo</span>
                                                        <input
                                                            type="email"
                                                            value={correo}
                                                            onChange={(e) => setCorreo(e.target.value)}
                                                            placeholder="Correo electrónico"
                                                            className="h-10 w-full rounded-[60px] border border-transparent bg-white px-5 py-2.5 text-sm leading-none font-normal text-black placeholder:text-black/60 outline-none"
                                                        />
                                                    </div>
                                                </>
                                            )}
                                            {formStep === 3 && (
                                                <>
                                                <div className="flex w-full flex-col gap-5 rounded-[20px] bg-white p-5 lg:p-10">
                                                    <div className="flex flex-col gap-2.5">
                                                        <span className="text-sm font-semibold text-black">Servicio:</span>
                                                        <span className="text-sm font-normal text-black">
                                                            {services.find((s) => s.slug === servicio)?.name || servicio || '—'}
                                                        </span>
                                                    </div>
                                                    {(() => {
                                                        const selectedBranch = branches.find((b) => String(b.id) === taller);
                                                        const direccion = selectedBranch
                                                            ? [selectedBranch.address, selectedBranch.city].filter(Boolean).join(', ')
                                                            : '';
                                                        return (
                                                            <>
                                                                <div className="flex flex-col gap-2.5">
                                                                    <span className="text-sm font-semibold text-black">Taller:</span>
                                                                    <span className="text-sm font-normal text-black">
                                                                        {selectedBranch?.name || '—'}
                                                                    </span>
                                                                </div>
                                                                <div className="flex flex-col gap-2.5">
                                                                    <span className="text-sm font-semibold text-black">Dirección:</span>
                                                                    <span className="text-sm font-normal text-black">
                                                                        {direccion || '—'}
                                                                    </span>
                                                                </div>
                                                            </>
                                                        );
                                                    })()}
                                                    <div className="flex flex-col gap-2.5">
                                                        <span className="text-sm font-semibold text-black">Fecha:</span>
                                                        <span className="text-sm font-normal text-black">
                                                            {selectedDate ? `${format(selectedDate, "d 'de' MMMM yyyy", { locale: es })}, ${selectedTime} hrs.` : '—'}
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-col gap-2.5">
                                                        <span className="text-sm font-semibold text-black">Datos de contacto:</span>
                                                        <span className="text-sm font-normal text-black">
                                                            {nombre || '—'}, {correo || '—'}, {telefono || '—'}
                                                        </span>
                                                    </div>
                                                </div>
                                                <label className="mt-2 flex cursor-pointer items-center gap-2.5">
                                                    <input
                                                        type="checkbox"
                                                        checked={aceptaPrivacidad}
                                                        onChange={(e) => setAceptaPrivacidad(e.target.checked)}
                                                        className="size-4.5 shrink-0 cursor-pointer appearance-none rounded border border-black/80 bg-[#EAEAF1] checked:border-black checked:bg-black checked:bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%2012%2010%22%20fill%3D%22none%22%3E%3Cpath%20d%3D%22M1%205l3.5%203.5L11%201%22%20stroke%3D%22%23fff%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] checked:bg-center checked:bg-no-repeat"
                                                    />
                                                    <span className="text-sm leading-none font-normal text-black">
                                                        He leído y acepto la política de privacidad de mis datos personales.
                                                    </span>
                                                </label>
                                                </>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => {
                                                if (formStep < 3) {
                                                    changeStep(formStep + 1);
                                                } else {
                                                    if (!aceptaPrivacidad) {
                                                        toast.error('Debes aceptar la política de privacidad para continuar.');
                                                        return;
                                                    }
                                                    setSubmitting(true);
                                                    router.post('/post-venta/agendar-mantencion', {
                                                        servicio, taller,
                                                        fecha: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '',
                                                        hora: selectedTime,
                                                        modelo, anio, patente, comentario,
                                                        nombre, rut, telefono, correo,
                                                        privacidad: aceptaPrivacidad,
                                                        _website: '',
                                                    }, {
                                                        preserveState: true,
                                                        onSuccess: () => {
                                                            setShowForm(false);
                                                            setSubmitting(false);
                                                            toast.success('¡Agendamiento confirmado! Te contactaremos pronto.');
                                                        },
                                                        onError: () => {
                                                            setSubmitting(false);
                                                            toast.error('Hubo un problema al enviar. Intenta nuevamente.');
                                                        },
                                                    });
                                                }
                                            }}
                                            disabled={(formStep === 3 && !aceptaPrivacidad) || submitting}
                                            className={`flex w-full items-center justify-center gap-2.5 rounded-[60px] px-8 py-4 text-base leading-[120%] font-normal transition lg:w-auto lg:px-15 lg:py-4.75 ${
                                                (formStep === 3 && !aceptaPrivacidad) || submitting
                                                    ? 'cursor-not-allowed bg-black/30 text-white/60'
                                                    : 'cursor-pointer bg-black text-white hover:bg-black/85'
                                            }`}
                                        >
                                            {formStep < 3 ? 'Siguiente' : submitting ? 'Enviando…' : 'Confirmar agendamiento'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                <ContactCtaBanner />

                {/* Branches section */}
                <BranchesSection />

                {footer && (
                    <div className="bg-black">
                        <Footer data={footer} />
                    </div>
                )}
            </main>
        </div>
    );
}
