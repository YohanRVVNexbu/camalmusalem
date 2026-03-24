import { Head } from '@inertiajs/react';
import { Footer } from '@/components/landing/footer';
import { Navbar } from '@/components/landing/navbar';
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
import visitanos1 from '@images/seminuevos/visitanos_1.png?format=webp';
import visitanos2 from '@images/seminuevos/visitanos_2.png?format=webp';
import card1Img from '@images/mantencion/card_1.png?format=webp';
import card2Img from '@images/mantencion/card_2.jpg?format=webp';
import card3Img from '@images/mantencion/card_3.png?format=webp';
import thirdSectionImg from '@images/mantencion/image_third_section.jpg?format=webp';
import step1Img from '@images/mantencion/image_step1.png?format=webp';
import step2Img from '@images/mantencion/image_step2.png?format=webp';
import step4Img from '@images/mantencion/image_step4.png?format=webp';

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

export default function AgendarMantencion({ footer }: { footer: any }) {
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
                            className="absolute left-1/2 text-center text-[48px] leading-[100%] font-normal text-white"
                            style={{
                                top: 'calc(50% - -31.5px)',
                                translate: '-50%',
                                fontFamily: '"Toyota Type"',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            Servicio técnico
                        </span>
                    </div>
                </section>

                {/* Carrusel */}
                <section className="flex w-full flex-col items-start bg-white px-15 pt-20">
                    <div className="flex w-full items-end justify-between">
                        <h2 className="w-115.25 text-left text-[40px] leading-[120%] font-semibold text-black">
                            Servicio técnico Musalem
                        </h2>
                        <p className="w-130 text-left text-base leading-[120%] font-normal text-black">
                            Nuestro objetivo está enfocado en ofrecer y entregar
                            a nuestros clientes un servicio de alto nivel en
                            calidad y seguridad en cada reparación que
                            realizamos.
                        </p>
                    </div>

                    {/* Carousel */}
                    <div
                        className="mt-20 w-full overflow-hidden"
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
                                        className="h-120.75 w-105 shrink-0 rounded-[30px]"
                                        style={{
                                            background: `linear-gradient(0deg, rgba(0,0,0,0.00) 0%, rgba(0,0,0,0.00) 100%), linear-gradient(180deg, rgba(0,0,0,0.00) 0%, rgba(0,0,0,0.20) 100%), url(${card.image}) lightgray center / cover no-repeat`,
                                        }}
                                    />
                                ) : (
                                    <div
                                        key={i}
                                        className="flex h-120.75 w-105 shrink-0 flex-col items-start gap-10 rounded-[30px] bg-[#EAEAF1] px-10 py-15"
                                    >
                                        <h3 className="text-[32px] leading-[120%] font-semibold whitespace-pre-line text-black">
                                            {card.titulo}
                                        </h3>
                                        <div className="flex flex-col gap-2 text-base leading-[120%] text-black">
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
                    <div className="mt-10 mb-20 flex w-full items-center justify-center gap-2.5">
                        {scrollSnaps.map((_, i) => (
                            <div
                                key={i}
                                className={`h-2.5 rounded-full transition-all duration-300 ${
                                    i === selectedIndex
                                        ? 'w-10 bg-black'
                                        : 'w-2.5 bg-black/30'
                                }`}
                            />
                        ))}
                    </div>
                </section>

                {/* Reserva tu hora */}
                <section className="flex w-full flex-col items-center gap-20 bg-white py-20">
                    <div className="flex w-330 max-w-full flex-col items-center gap-20 rounded-[30px] bg-[#EAEAF1] p-15">
                        {!showForm ? (
                            /* Contenido base */
                            <div key="base" className="flex w-full flex-row items-center gap-20" style={{ animation: 'fadeSlideDown 0.5s ease-out' }}>
                                <div className="flex flex-col items-start justify-center gap-10">
                                    <h2 className="text-[40px] leading-[120%] font-semibold text-black">
                                        Reserva tu hora
                                    </h2>
                                    <p className="w-130 text-base leading-[120%] font-normal text-black">
                                        Ahorra tiempo programando el servicio aquí
                                        mismo. Después de enviar el formulario, nos
                                        pondremos en contacto para confirmar su cita de
                                        servicio.
                                    </p>
                                    <button
                                        onClick={() => { setShowForm(true); setFormStep(0); setStepDirection('right'); prevStepRef.current = 0; }}
                                        className="flex cursor-pointer items-center justify-center gap-2.5 rounded-[60px] bg-black px-15 py-4.75 text-base leading-[120%] font-normal text-white transition hover:bg-black/85"
                                    >
                                        Ir a agendar servicio
                                    </button>
                                </div>
                                <div
                                    className="flex h-140 w-140 shrink-0 flex-col items-start justify-end gap-2.5 rounded-[30px] p-7.5"
                                    style={{
                                        background: `url(${thirdSectionImg}) lightgray 0.01px -163.496px / 100% 133.264% no-repeat`,
                                    }}
                                >
                                    <div
                                        className="flex shrink-0 flex-col items-start justify-center gap-2.5 overflow-hidden rounded-2xl p-5"
                                        style={{
                                            background: 'linear-gradient(to left, rgba(0,0,0,0.2), rgba(0,0,0,0.2)), linear-gradient(to left, rgba(0,0,0,0.2), rgba(0,0,0,0.2))',
                                            backdropFilter: 'blur(30px)',
                                        }}
                                    >
                                        <div className="flex flex-col items-start gap-4 self-stretch">
                                            <span className="text-xl leading-none font-semibold text-white uppercase">Horario de atención</span>
                                            <div className="flex items-center justify-between self-stretch">
                                                <span className="text-sm leading-none font-normal text-white">Lunes a Viernes</span>
                                                <span className="text-sm leading-none font-normal text-white">09:00 a 13:30 - 14:45 a 18:30</span>
                                            </div>
                                            <div className="flex items-center justify-between self-stretch">
                                                <span className="text-sm leading-none font-normal text-white">Domingo</span>
                                                <span className="text-sm leading-none font-normal text-white">Cerrado</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            /* Formulario */
                            <div key="form" className="flex w-full flex-col gap-10" style={{ animation: 'fadeSlideDown 0.5s ease-out' }}>
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

                                {/* Tabs */}
                                <div className="flex h-12 w-full gap-5">
                                    {['Servicio y horario', 'Datos del vehículo', 'Datos de contacto', 'Confirmar'].map((label, i) => (
                                        <button
                                            key={label}
                                            onClick={() => changeStep(i)}
                                            className={`flex flex-1 cursor-pointer items-center justify-center rounded-[60px] px-5 text-base leading-[120%] font-normal transition ${
                                                formStep === i
                                                    ? 'bg-black text-white'
                                                    : 'bg-white text-black hover:bg-black/5'
                                            }`}
                                        >
                                            {label}
                                        </button>
                                    ))}
                                </div>

                                {/* Content */}
                                <div className="flex w-full items-center gap-15">
                                    {/* Imagen sucursales */}
                                    <div
                                        className="relative h-140 w-140 shrink-0 overflow-hidden rounded-[30px]"
                                        style={{ boxShadow: '2px 2px 2px 2px rgba(0,0,0,0.02)' }}
                                    >
                                        <img
                                            src={formStep <= 0 ? step1Img : formStep <= 2 ? step2Img : step4Img}
                                            alt=""
                                            className="absolute inset-0 size-full object-cover transition-opacity duration-500"
                                            key={formStep <= 0 ? 'step1' : formStep <= 2 ? 'step2' : 'step4'}
                                        />
                                        <div
                                            className="absolute bottom-7.5 left-7.5 flex w-92.25 flex-col gap-2.5 overflow-hidden rounded-2xl bg-[rgba(0,0,0,0.60)] p-5"
                                            style={{ backdropFilter: 'blur(30px)' }}
                                        >
                                            <span className="text-xl leading-none font-semibold text-white uppercase">Sucursales</span>
                                            <span className="text-sm leading-none font-normal text-white">Av. Francisco de Aguirre #070, La Serena</span>
                                            <span className="text-sm leading-none font-normal text-white">Ariztía #358, Ovalle</span>
                                        </div>
                                    </div>

                                    {/* Formulario paso actual */}
                                    <div key={formStep} className="flex flex-1 flex-col items-start gap-10" style={{ animation: `${stepDirection === 'right' ? 'slideFromRight' : 'slideFromLeft'} 0.4s ease-out` }}>
                                        <h3 className="text-2xl leading-none font-semibold text-black">
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
                                                                <option value="mantencion">Mantención preventiva</option>
                                                                <option value="diagnostico">Diagnóstico electrónico</option>
                                                                <option value="frenos">Revisión de frenos</option>
                                                                <option value="alineacion">Alineación y balanceo</option>
                                                                <option value="electrico">Servicio eléctrico/híbrido</option>
                                                                <option value="desabolladura">Desabolladura y pintura</option>
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
                                                                <option value="la-serena">La Serena - Av. Francisco de Aguirre #070</option>
                                                                <option value="ovalle">Ovalle - Ariztía #358</option>
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
                                                                        if (!selectedTime) setSelectedTime('09:00');
                                                                    }}
                                                                    locale={es}
                                                                    disabled={{ before: new Date() }}
                                                                />
                                                                <div className="mt-3 flex flex-col gap-2 border-t border-black/10 pt-3">
                                                                    <span className="text-sm font-normal text-black">Hora</span>
                                                                    <div className="grid max-h-40 grid-cols-3 gap-1.5 overflow-y-auto">
                                                                        {allTimeSlots.map(t => (
                                                                            <button
                                                                                key={t}
                                                                                type="button"
                                                                                onClick={() => setSelectedTime(t)}
                                                                                className={`cursor-pointer rounded-[60px] py-2 text-center text-xs transition ${
                                                                                    selectedTime === t
                                                                                        ? 'bg-black text-white'
                                                                                        : 'bg-black/5 text-black hover:bg-black/10'
                                                                                }`}
                                                                            >
                                                                                {t}
                                                                            </button>
                                                                        ))}
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
                                                                <option value="Corolla">Corolla</option>
                                                                <option value="Hilux">Hilux</option>
                                                                <option value="RAV4">RAV4</option>
                                                                <option value="bZ4X">bZ4X</option>
                                                                <option value="Yaris">Yaris</option>
                                                                <option value="Camry">Camry</option>
                                                                <option value="Land Cruiser">Land Cruiser</option>
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
                                                <div className="flex w-full flex-col gap-5 rounded-[20px] bg-white p-10">
                                                    <div className="flex flex-col gap-2.5">
                                                        <span className="text-sm font-semibold text-black">Servicio:</span>
                                                        <span className="text-sm font-normal text-black">{servicio || '—'}</span>
                                                    </div>
                                                    <div className="flex flex-col gap-2.5">
                                                        <span className="text-sm font-semibold text-black">Taller:</span>
                                                        <span className="text-sm font-normal text-black">
                                                            {taller === 'la-serena' ? 'Musalem La Serena' : taller === 'ovalle' ? 'Musalem Ovalle' : '—'}
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-col gap-2.5">
                                                        <span className="text-sm font-semibold text-black">Dirección:</span>
                                                        <span className="text-sm font-normal text-black">
                                                            {taller === 'la-serena' ? 'Av. Francisco de Aguirre #070, La Serena, Chile' : taller === 'ovalle' ? 'Ariztía Oriente #358, Ovalle, Chile' : '—'}
                                                        </span>
                                                    </div>
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
                                                        className="size-4.5 shrink-0 cursor-pointer appearance-none rounded border border-black/80 bg-[#EAEAF1] checked:border-black checked:bg-black"
                                                    />
                                                    <span className="text-sm leading-none font-normal text-black">
                                                        He leído y acepto la política de privacidad de mis datos personales.
                                                    </span>
                                                </label>
                                                </>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => formStep < 3 ? changeStep(formStep + 1) : setShowForm(false)}
                                            disabled={formStep === 3 && !aceptaPrivacidad}
                                            className={`flex items-center justify-center gap-2.5 rounded-[60px] px-15 py-4.75 text-base leading-[120%] font-normal transition ${
                                                formStep === 3 && !aceptaPrivacidad
                                                    ? 'cursor-not-allowed bg-black/30 text-white/60'
                                                    : 'cursor-pointer bg-black text-white hover:bg-black/85'
                                            }`}
                                        >
                                            {formStep < 3 ? 'Siguiente' : 'Confirmar agendamiento'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
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
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="12"
                                        height="9"
                                        viewBox="0 0 12 9"
                                        fill="none"
                                    >
                                        <path
                                            d="M1.39844 4.34961H11.3984M11.3984 4.34961L7.64844 0.599609M11.3984 4.34961L7.64844 8.09961"
                                            stroke="white"
                                            strokeWidth="1.2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
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
                        {/* La Serena */}
                        <div className="relative flex-1 overflow-hidden rounded-[20px]">
                            <img
                                src={visitanos1}
                                alt="Sucursal La Serena"
                                className="h-85 w-full object-cover"
                            />
                            <div
                                className="absolute bottom-5 left-5 flex w-92.25 flex-col gap-2.5 rounded-2xl p-5"
                                style={{
                                    background:
                                        'linear-gradient(0deg, rgba(0,0,0,0.20) 0%, rgba(0,0,0,0.20) 100%), rgba(255,255,255,0.20)',
                                    backdropFilter: 'blur(30px)',
                                }}
                            >
                                <span className="text-xl leading-none font-semibold text-white uppercase">
                                    La Serena
                                </span>
                                <span className="text-sm leading-none text-white">
                                    Av. Francisco de Aguirre #70
                                </span>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm leading-none font-semibold text-white">
                                        Ver detalles sucursal
                                    </span>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="18"
                                        height="17"
                                        viewBox="0 0 18 17"
                                        fill="none"
                                    >
                                        <path
                                            d="M0.390625 8H17.1648"
                                            stroke="white"
                                        />
                                        <path
                                            d="M8.39062 0V16.7742"
                                            stroke="white"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        {/* Ovalle */}
                        <div className="relative flex-1 overflow-hidden rounded-[20px]">
                            <img
                                src={visitanos2}
                                alt="Sucursal Ovalle"
                                className="h-85 w-full object-cover"
                            />
                            <div
                                className="absolute bottom-5 left-5 flex w-92.25 flex-col gap-2.5 rounded-2xl p-5"
                                style={{
                                    background:
                                        'linear-gradient(0deg, rgba(0,0,0,0.20) 0%, rgba(0,0,0,0.20) 100%), rgba(255,255,255,0.20)',
                                    backdropFilter: 'blur(30px)',
                                }}
                            >
                                <span className="text-xl leading-none font-semibold text-white uppercase">
                                    Ovalle
                                </span>
                                <span className="text-sm leading-none text-white">
                                    Ariztía #358
                                </span>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm leading-none font-semibold text-white">
                                        Ver detalles sucursal
                                    </span>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="18"
                                        height="17"
                                        viewBox="0 0 18 17"
                                        fill="none"
                                    >
                                        <path
                                            d="M0.390625 8H17.1648"
                                            stroke="white"
                                        />
                                        <path
                                            d="M8.39062 0V16.7742"
                                            stroke="white"
                                        />
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
