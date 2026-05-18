import { Head, router, usePage } from '@inertiajs/react';
import { toast } from 'sonner';
import { Footer } from '@/components/landing/footer';
import { Navbar } from '@/components/landing/navbar';
import { ContactCtaBanner } from '@/components/landing/contact-cta-banner';
import { useEffect, useRef, useState } from 'react';
import { useInView } from '@/hooks/use-in-view';
import { useIsMobile } from '@/hooks/use-mobile';
import { pickResponsiveImage } from '@/lib/media';
import { formatCLP } from '@/lib/format';
import { DayPicker } from 'react-day-picker';
import { es } from 'date-fns/locale';
import { format } from 'date-fns';
import 'react-day-picker/style.css';
import { BranchMap } from '@/components/landing/branch-map';

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

import heroImgDefault from '@images/kinto/hero_image.png?format=webp';
import formImg from '@images/kinto/image_form.jpg?format=webp';
import ctaImg from '@images/seminuevos/ejemplo-video.png?format=webp';
import formStep2Img from '@images/mantencion/form_2_image.png?format=webp';
import formStep3Img from '@images/mantencion/form_image_3.png?format=webp';
import card1Img from '@images/kinto/card_1.jpg?format=webp';
import card2Img from '@images/kinto/card_2.jpg?format=webp';
import card3Img from '@images/kinto/card_3.jpg?format=webp';

const DEFAULT_PASOS = [
    { img: card1Img, titulo: 'Paso 1:', subtitulo: 'Descarga la app KINTO Share y conoce cómo funciona el servicio.' },
    { img: card2Img, titulo: 'Paso 2:', subtitulo: 'Completa el formulario con tu interés o solicitud para que podamos orientarte.' },
    { img: card3Img, titulo: 'Paso 3:', subtitulo: 'Un asesor de Musalem te contactará para ayudarte a revisar la disponibilidad y continuar la gestión desde la sucursal correspondiente.' },
];

type Rental = {
    id: number;
    name: string | null;
    image: string | null;
    description: string | null;
    price_hour: string | null;
    price_day: string | null;
    price_week: string | null;
    price_month: string | null;
    branch_ids: number[];
    vehicle_slug: string | null;
};

type BranchLite = {
    id: number;
    name: string;
    city: string;
    address?: string | null;
    latitude?: number | null;
    longitude?: number | null;
};

// Returns the "best" display price for a rental card, preferring the most
// granular unit available (hour → day → week → month).
function summarizePrice(r: Rental): string {
    if (r.price_hour) return `Desde ${formatCLP(r.price_hour)} la hora`;
    if (r.price_day) return `Desde ${formatCLP(r.price_day)} el día`;
    if (r.price_week) return `Desde ${formatCLP(r.price_week)} la semana`;
    if (r.price_month) return `Desde ${formatCLP(r.price_month)} al mes`;
    return 'Consultar precio';
}

function KintoIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="24" viewBox="0 0 22 24" fill="none">
            <path d="M0.0848142 14.309L0.0628316 14.0968L0.0579467 14.0425C0.0155799 13.5722 -0.00357771 13.1 0.000548458 12.6277C0.0225308 4.68251 5.23968 0 15.8767 0H20.7788C21.1027 0 21.4133 0.133082 21.6423 0.369969C21.8713 0.606856 22 0.928144 22 1.26315L21.9976 3.86146C21.3894 14.8522 16.2089 20.2105 7.3451 20.2105H4.13201C3.92194 21.0873 3.76894 21.9777 3.67404 22.8757C3.6564 23.0406 3.60754 23.2003 3.53023 23.3456C3.45293 23.491 3.3487 23.6191 3.22351 23.7228C3.09831 23.8265 2.95459 23.9037 2.80056 23.9499C2.64653 23.9962 2.48521 24.0106 2.32579 23.9923C2.16638 23.9741 2.012 23.9235 1.87147 23.8436C1.73095 23.7636 1.60702 23.6558 1.50677 23.5263C1.40652 23.3968 1.33192 23.2482 1.28721 23.0889C1.2425 22.9296 1.22857 22.7627 1.24622 22.5978C1.38788 21.2774 1.62399 20.0366 1.95454 18.8753L1.81043 18.6909L1.55641 18.3372L1.36468 18.0479L1.14241 17.6778L1.02273 17.4618L0.943347 17.3077C0.749368 16.9265 0.58717 16.5288 0.458514 16.1191L0.370585 15.8197L0.266779 15.4067L0.197168 15.0682L0.144655 14.7625L0.0848142 14.309ZM10.513 8.9507C7.03857 10.5486 4.58509 12.9044 3.05365 16.0029C3.13344 16.1713 3.22218 16.3397 3.31988 16.5082L3.54581 16.8631L3.6313 16.9856C3.729 17.1237 3.83403 17.2623 3.94638 17.4012L4.18697 17.6841H4.97955C6.24598 14.8155 8.37094 12.6997 11.5046 11.2597C11.8007 11.1237 12.0324 10.8717 12.1487 10.559C12.2651 10.2463 12.2565 9.89858 12.125 9.59239C11.9935 9.28619 11.7498 9.04656 11.4475 8.92622C11.1452 8.80588 10.809 8.81469 10.513 8.9507Z" fill="black"/>
        </svg>
    );
}

function SelectField({ label, placeholder, options, value, onChange, disabled, hint }: {
    label: string;
    placeholder: string;
    options: { value: string; label: string }[];
    value: string;
    onChange: (v: string) => void;
    disabled?: boolean;
    hint?: string;
}) {
    return (
        <div className="flex flex-col gap-2.5 items-start self-stretch">
            <span className="text-sm leading-none text-black" style={{ fontFamily: '"Toyota Type Book", "Toyota Type", sans-serif' }}>{label}</span>
            <div className="relative self-stretch">
                <select
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    disabled={disabled}
                    className="w-full h-10 rounded-[60px] bg-white border border-transparent pl-5 pr-10 text-sm leading-none appearance-none cursor-pointer focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
                    style={{ fontFamily: '"Toyota Type Book", "Toyota Type", sans-serif', color: value ? '#000' : 'rgba(0,0,0,0.60)' }}
                >
                    <option value="" disabled>{placeholder}</option>
                    {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <svg className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2" width="6" height="10" viewBox="0 0 6 10" fill="none">
                    <path d="M1 1L5 5L1 9" stroke="#000" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </div>
            {hint && (
                <span className="text-xs leading-none text-black/60" style={{ fontFamily: '"Toyota Type Book", "Toyota Type", sans-serif' }}>
                    {hint}
                </span>
            )}
        </div>
    );
}

export default function Kinto({ footer, kinto_hero, kinto_pasos, kinto_vehiculos, rentals = [], branches = [] }: {
    footer: any | null;
    kinto_hero?: any | null;
    kinto_pasos?: any | null;
    kinto_vehiculos?: any | null;
    rentals?: Rental[];
    branches?: BranchLite[];
}) {
    const { flash } = usePage<{ flash: { success?: string; error?: string } }>().props;
    const heroData = kinto_hero ?? {};
    const isMobile = useIsMobile();
    const heroImg = pickResponsiveImage(heroData.hero_image, heroData.hero_image_mobile, isMobile) || heroImgDefault;
    const pasos = kinto_pasos?.pasos ?? DEFAULT_PASOS;
    const heroInView = useInView(0.1);
    const comoFuncionaInView = useInView(0.1);
    const vehiculosInView = useInView(0.1);
    const formSectionRef = useRef<HTMLDivElement>(null);
    const [selectedBranchId, setSelectedBranchId] = useState<number | null>(
        branches[0]?.id ?? null,
    );

    const filteredRentals = rentals.filter((r) =>
        selectedBranchId == null || r.branch_ids.includes(selectedBranchId),
    );
    const [showForm, setShowForm] = useState(false);
    const [formStep, setFormStep] = useState(1);
    const [durationType, setDurationType] = useState<'horas' | 'dias'>('horas');
    const [formSucursal, setFormSucursal] = useState('');
    const [formFecha, setFormFecha] = useState('');
    const [formDuracion, setFormDuracion] = useState('');
    const [formVehiculo, setFormVehiculo] = useState('');
    const [formNombre, setFormNombre] = useState('');
    const [formRut, setFormRut] = useState('');
    const [formTelefono, setFormTelefono] = useState('+569');
    const [formCorreo, setFormCorreo] = useState('');
    const [formLicencia, setFormLicencia] = useState(false);
    const [formPrivacidad, setFormPrivacidad] = useState(false);
    const [formSent, setFormSent] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const formatRut = (value: string) => {
        let clean = value.replace(/[^0-9kK]/g, '');
        if (clean.length > 9) clean = clean.slice(0, 9);
        if (clean.length <= 1) return clean;
        const dv = clean.slice(-1);
        const body = clean.slice(0, -1);
        const formatted = body.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        return `${formatted}-${dv}`;
    };
    const [showCalendar, setShowCalendar] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>();
    const calendarRef = useRef<HTMLDivElement>(null);

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

    // Handle deep-link from /nuevos/{slug}?rental=N — auto-open the form with
    // the rental + first matching branch preselected, and scroll to it.
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const params = new URLSearchParams(window.location.search);
        const rentalParam = params.get('rental');
        if (!rentalParam) return;

        const rental = rentals.find((r) => String(r.id) === rentalParam);
        if (!rental) return;

        const branchForRental = selectedBranchId && rental.branch_ids.includes(selectedBranchId)
            ? selectedBranchId
            : rental.branch_ids[0] ?? null;

        setShowForm(true);
        setFormStep(1);
        setFormSucursal(branchForRental ? String(branchForRental) : '');
        setFormVehiculo(String(rental.id));

        requestAnimationFrame(() => {
            formSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const html = document.documentElement;
        const prev = html.style.backgroundColor;
        html.style.backgroundColor = '#000';
        return () => { html.style.backgroundColor = prev; };
    }, []);

    useEffect(() => {
        if (flash?.error) toast.error(flash.error);
    }, [flash?.error]);

    return (
        <div className="min-h-screen bg-black">
            <Head title="Arriendo Kinto — Toyota Musalem" />
            <Navbar variant="white" />

            <main className="flex flex-col bg-black">

                {/* Hero */}
                {kinto_hero && (
                <section ref={heroInView.ref}>
                    <div
                        className={`flex h-125 flex-col items-start justify-end gap-7.5 rounded-b-[30px] px-5 pt-25 pb-10 transition-all duration-700 ease-out lg:h-165 lg:gap-10 lg:px-10 lg:pt-15 lg:pb-15 ${heroInView.visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}
                        style={{
                            background: `linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(0,0,0,0.80) 100%), linear-gradient(0deg, rgba(0,0,0,0.30) 0%, rgba(0,0,0,0.30) 100%), url(${heroImg}) lightgray center / cover no-repeat`,
                        }}
                    >
                        <div className="flex w-full flex-col items-start gap-7.5 lg:flex-row lg:items-end lg:justify-between lg:self-stretch">
                            {/* Izquierda: título + descripción */}
                            <div className="flex flex-col items-start gap-5 lg:gap-10">
                                <h1
                                    className="text-[32px] font-normal leading-[110%] text-white lg:text-[48px] lg:leading-[100%]"
                                    style={{ fontFamily: '"Toyota Type"', fontFeatureSettings: '"liga" off, "clig" off', whiteSpace: 'pre-line' }}
                                >
                                    {heroData.title || "Arrienda con KINTO\ndesde Musalem"}
                                </h1>
                                <p
                                    className="text-sm leading-[120%] text-white lg:w-124 lg:text-base"
                                    style={{ fontFamily: '"Toyota Type"' }}
                                >
                                    {heroData.description || 'Con KINTO puedes reservar, retirar y usar un Toyota directamente desde la app. En Musalem te orientamos durante el proceso y te ayudamos a encontrar la alternativa disponible que mejor se adapte a tu necesidad, ya sea por horas, días o semanas.'}
                                </p>
                            </div>

                            {/* Derecha: botón + nota */}
                            <div className="flex w-full flex-col items-start gap-2.5 lg:w-auto lg:gap-5">
                                <button className="flex w-full cursor-pointer items-center justify-between rounded-[60px] border border-transparent bg-white p-1 transition-opacity hover:opacity-90 lg:w-auto lg:justify-start">
                                    <span className="pl-2.5 text-base leading-none text-black" style={{ fontFamily: '"Toyota Type"' }}>
                                        {heroData.button_text || 'Descargar app KINTO'}
                                    </span>
                                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-black lg:ml-2.5">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="14" viewBox="0 0 18 14" fill="none">
                                            <path d="M0.75 6.75L16.75 6.75M16.75 6.75L10.75 12.75M16.75 6.75L10.75 0.75" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </span>
                                </button>
                                <span className="text-xs leading-[120%] text-white" style={{ fontFamily: '"Toyota Type"' }}>
                                    Disponible en App Store y Google Play.
                                </span>
                            </div>
                        </div>
                    </div>
                </section>
                )}

                {/* ¿Cómo funciona KINTO? */}
                {kinto_pasos && (
                <section ref={comoFuncionaInView.ref} className="bg-black px-5 py-10 lg:px-15 lg:py-20">
                    <div className={`flex flex-col items-center gap-7.5 rounded-[30px] bg-[#EAEAF1] p-5 transition-all duration-700 ease-out lg:gap-10 lg:p-10 ${comoFuncionaInView.visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                        <h2
                            className="text-center text-2xl font-normal leading-[120%] text-black lg:text-[32px]"
                            style={{ fontFamily: '"Toyota Type"' }}
                        >
                            {kinto_pasos?.title || '¿Cómo funciona KINTO en Musalem?'}
                        </h2>
                        <div className="flex w-full flex-col gap-5 lg:flex-row">
                            {pasos.map((paso: any, i: number) => {
                                const pasoImg = paso.img || [card1Img, card2Img, card3Img][i] || card1Img;
                                return (
                                <div
                                    key={i}
                                    className="flex h-75 flex-1 flex-col items-center justify-center gap-3 rounded-[30px] px-5 py-10 lg:h-102 lg:gap-5 lg:rounded-[40.8px] lg:px-10 lg:py-15"
                                    style={{
                                        background: `linear-gradient(0deg, rgba(0,0,0,0.20) 0%, rgba(0,0,0,0.20) 100%), linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.80) 100%), url(${pasoImg}) lightgray 50% / cover no-repeat`,
                                    }}
                                >
                                    <span
                                        className="text-center text-2xl font-semibold leading-[120%] text-white lg:text-[28px]"
                                        style={{ fontFamily: '"Toyota Type"' }}
                                    >
                                        {paso.titulo}
                                    </span>
                                    <p
                                        className="text-center text-sm font-normal leading-[120%] text-white lg:text-base"
                                        style={{ fontFamily: '"Toyota Type"' }}
                                    >
                                        {paso.subtitulo}
                                    </p>
                                </div>
                                );
                            })}
                        </div>
                    </div>
                </section>
                )}

                {/* Vehículos disponibles */}
                {kinto_vehiculos && (
                <section ref={vehiculosInView.ref} className="bg-black px-5 py-10 lg:px-15 lg:py-20">
                    <div className={`flex flex-col gap-7.5 transition-all duration-700 ease-out lg:gap-10 ${vehiculosInView.visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>

                        {/* Header con tabs */}
                        <div className="flex flex-col items-start gap-5 self-stretch lg:flex-row lg:items-center lg:justify-between">
                            <h2
                                className="text-2xl font-normal leading-[120%] text-white lg:text-[32px]"
                                style={{ fontFamily: '"Toyota Type"' }}
                            >
                                {kinto_vehiculos?.title || 'Vehículos disponibles'}
                            </h2>
                            {branches.length > 0 && (
                                <div className="flex w-full items-center gap-1.5 rounded-[60px] bg-white p-1.5 lg:w-auto">
                                    {branches.map((b) => (
                                        <button
                                            key={b.id}
                                            onClick={() => setSelectedBranchId(b.id)}
                                            className={`h-9.5 flex-1 cursor-pointer rounded-[60px] border border-transparent px-3 py-1 text-sm leading-none transition-colors lg:h-11 lg:flex-none lg:px-5 lg:text-base ${
                                                selectedBranchId === b.id
                                                    ? 'bg-black text-white'
                                                    : 'bg-[#EAEAF1] text-black'
                                            }`}
                                            style={{ fontFamily: '"Toyota Type"' }}
                                        >
                                            {b.name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Cards de vehículos */}
                        {filteredRentals.length === 0 ? (
                            <div className="rounded-[30px] bg-white/5 p-10 text-center">
                                <p className="text-base text-white/70" style={{ fontFamily: '"Toyota Type"' }}>
                                    No hay vehículos disponibles para arriendo en esta sucursal por ahora.
                                </p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-5 lg:flex-row lg:flex-wrap">
                                {filteredRentals.map((rental) => (
                                    <div
                                        key={rental.id}
                                        className="flex flex-1 flex-col items-center justify-between gap-7.5 overflow-hidden rounded-[30px] bg-white px-5 py-10 lg:min-w-100 lg:h-162.5 lg:gap-0 lg:px-0 lg:py-15"
                                    >
                                        {/* Nombre */}
                                        <div className="flex items-end gap-2.5 px-5 text-center">
                                            <KintoIcon />
                                            <span
                                                className="text-2xl font-semibold uppercase leading-none text-black lg:text-[32px]"
                                                style={{ fontFamily: '"Toyota Type"' }}
                                            >
                                                {rental.name || 'Vehículo Toyota'}
                                            </span>
                                        </div>

                                        {/* Imagen */}
                                        <div className="flex h-40 w-full items-center justify-center lg:h-66">
                                            {rental.image ? (
                                                <img src={rental.image} alt={rental.name ?? ''} className="h-full object-contain" />
                                            ) : (
                                                <div className="h-full w-full rounded-xl bg-gray-100 lg:w-144.5" />
                                            )}
                                        </div>

                                        {/* Precio */}
                                        <span className="text-sm leading-none text-black" style={{ fontFamily: '"Toyota Type"' }}>
                                            {summarizePrice(rental)}
                                        </span>

                                        {/* Botones */}
                                        <div className="flex w-full flex-col items-stretch gap-2.5 px-5 lg:w-auto lg:flex-row lg:items-center lg:px-0">
                                            {/* Ver detalles del vehículo (si está enlazado) */}
                                            {rental.vehicle_slug && (
                                                <a
                                                    href={`/nuevos/${rental.vehicle_slug}?rental=${rental.id}`}
                                                    className="flex h-12 cursor-pointer items-center justify-between rounded-[60px] border border-transparent bg-black p-1 transition-opacity hover:opacity-80 lg:justify-start"
                                                >
                                                    <span className="pb-0.5 pl-2.5 text-sm leading-none text-white" style={{ fontFamily: '"Toyota Type"' }}>
                                                        Ver detalles vehículo
                                                    </span>
                                                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white lg:ml-2.5">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="14" viewBox="0 0 18 14" fill="none">
                                                            <path d="M0.75 6.75L16.75 6.75M16.75 6.75L10.75 12.75M16.75 6.75L10.75 0.75" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                        </svg>
                                                    </span>
                                                </a>
                                            )}
                                            {/* Solicitar información */}
                                            <button
                                                onClick={() => {
                                                    // Prefer the currently-filtered branch if the rental is there;
                                                    // otherwise pick the first branch the rental is available in.
                                                    const branchForRental =
                                                        selectedBranchId && rental.branch_ids.includes(selectedBranchId)
                                                            ? selectedBranchId
                                                            : rental.branch_ids[0] ?? null;

                                                    setShowForm(true);
                                                    setFormStep(1);
                                                    setFormSucursal(branchForRental ? String(branchForRental) : '');
                                                    setFormVehiculo(String(rental.id));

                                                    // Defer scroll until after the form is rendered.
                                                    requestAnimationFrame(() => {
                                                        formSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                                    });
                                                }}
                                                className="flex h-12 cursor-pointer items-center justify-between rounded-[60px] border border-black p-1 pl-1.5 transition-opacity hover:opacity-80 lg:justify-start"
                                            >
                                                <span className="pb-0.5 pl-2.5 text-sm leading-none text-black" style={{ fontFamily: '"Toyota Type"' }}>
                                                    Solicitar información
                                                </span>
                                                <span className="flex size-10 shrink-0 items-center justify-center rounded-[80px] bg-black lg:ml-2.5" style={{ backdropFilter: 'blur(20px)' }}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="19" height="15" viewBox="0 0 19 15" fill="none">
                                                        <path d="M0.699816 7.28646L18.2554 7.28646M18.2554 7.28646L11.672 13.8698M18.2554 7.28646L11.672 0.703125" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                                                    </svg>
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>
                )}

                {/* Solicita tu arriendo */}
                <section ref={formSectionRef} className="bg-black px-5 py-10 lg:px-15 lg:py-20 scroll-mt-20">
                    <div className="flex flex-col items-center gap-10 rounded-[30px] bg-[#EAEAF1] p-5 lg:gap-20 lg:p-15">
                        {!showForm ? (
                            /* ── Vista inicial ── */
                            <div className="flex flex-col items-start gap-7.5 self-stretch lg:flex-row lg:items-center lg:justify-between lg:gap-10">
                                <div className="order-2 flex flex-col items-start justify-center gap-5 lg:order-1 lg:gap-10">
                                    <h2
                                        className="text-[28px] font-semibold leading-[120%] text-black lg:text-[40px]"
                                        style={{ fontFamily: '"Toyota Type"' }}
                                    >
                                        Solicita tu arriendo<br />Kinto en Musalem
                                    </h2>
                                    <p
                                        className="text-sm leading-[120%] text-black lg:w-115.5 lg:text-base"
                                        style={{ fontFamily: '"Toyota Type"' }}
                                    >
                                        Conoce la opción de arriendo disponible a través de KINTO y déjanos tu solicitud para que un asesor de Musalem te contacte y te ayude a gestionar el proceso según sucursal, disponibilidad y fecha estimada.
                                    </p>
                                    <button
                                        onClick={() => { setShowForm(true); setFormStep(1); }}
                                        className="w-full cursor-pointer rounded-[60px] border border-transparent bg-black px-8 py-4 text-base leading-none text-white transition-opacity hover:opacity-80 lg:w-auto lg:px-15 lg:py-4.75"
                                        style={{ fontFamily: '"Toyota Type"' }}
                                    >
                                        Solicitar arriendo Kinto
                                    </button>
                                </div>
                                <img
                                    src={formImg}
                                    alt="Solicitar arriendo Kinto"
                                    className="order-1 h-65 w-full shrink-0 rounded-[30px] object-cover lg:order-2 lg:h-140 lg:w-140"
                                    style={{ objectPosition: 'center top' }}
                                />
                            </div>
                        ) : formSent ? (
                            /* ── Éxito ── */
                            <div className="flex w-full items-center justify-center py-10 lg:py-20">
                                <div className="flex flex-1 flex-col items-center justify-center gap-7.5 lg:gap-10">
                                    <h3 className="text-center text-2xl font-semibold leading-[120%] text-black" style={{ fontFamily: '"Toyota Type"' }}>
                                        Solicitud enviada con éxito
                                    </h3>
                                    <p className="text-center text-sm leading-[120%] text-black lg:w-122 lg:text-base" style={{ fontFamily: '"Toyota Type"' }}>
                                        Hemos recibido tu solicitud de arriendo y te enviaremos un correo a{' '}
                                        <span className="font-semibold uppercase">{formCorreo}</span>
                                        {' '}con los detalles de tu solicitud.
                                    </p>
                                    <div className="flex w-full flex-col items-stretch gap-3 lg:w-auto lg:gap-5">
                                        <button
                                            onClick={() => { setShowForm(false); setFormSent(false); }}
                                            className="cursor-pointer rounded-[60px] bg-black px-8 py-4 text-base leading-none text-white transition-opacity hover:opacity-80 lg:px-15 lg:py-4.75"
                                            style={{ fontFamily: '"Toyota Type"' }}
                                        >
                                            Volver a inicio
                                        </button>
                                        <button
                                            onClick={() => { setFormSent(false); setFormStep(1); setFormSucursal(''); setFormFecha(''); setFormDuracion(''); setFormVehiculo(''); setFormNombre(''); setFormRut(''); setFormTelefono('+569'); setFormCorreo(''); setFormLicencia(false); }}
                                            className="cursor-pointer rounded-[60px] border border-black bg-transparent px-8 py-4 text-base leading-none text-black transition-opacity hover:opacity-70 lg:px-15 lg:py-4.75"
                                            style={{ fontFamily: '"Toyota Type"' }}
                                        >
                                            Enviar otra solicitud
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            /* ── Vista formulario ── */
                            <div className="flex flex-col gap-10 items-start w-full">

                                {/* Volver + tabs */}
                                <div className="flex flex-col gap-5 items-start w-full">

                                    {/* Botón volver */}
                                    <button
                                        onClick={() => setShowForm(false)}
                                        className="flex items-center gap-2.5 rounded-[60px] border border-black h-9.5 pl-2.5 pr-5 cursor-pointer transition-opacity hover:opacity-70"
                                    >
                                        <span className="flex size-6 items-center justify-center rounded-full">
                                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                                <path d="M12.25 7H1.75M1.75 7L6.125 11.375M1.75 7L6.125 2.625" stroke="#000" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        </span>
                                        <span className="text-sm leading-none text-black" style={{ fontFamily: '"Toyota Type"' }}>Volver</span>
                                    </button>

                                    {/* Tabs */}
                                    <div className="flex h-10 w-full gap-2 lg:h-12 lg:gap-5">
                                        {['Arriendo y sucursal', 'Datos de contacto', 'Confirmar'].map((tab, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setFormStep(i + 1)}
                                                className={`flex h-10 flex-1 items-center justify-center rounded-[60px] text-xs leading-none transition-colors cursor-pointer lg:h-12 lg:text-base ${formStep === i + 1 ? 'bg-black text-white' : 'bg-white text-black'}`}
                                                style={{ fontFamily: '"Toyota Type"' }}
                                            >
                                                <span className="lg:hidden">{i + 1}</span>
                                                <span className="hidden lg:inline">{i + 1}. {tab}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Contenido paso 1 */}
                                {formStep === 1 && (
                                    <div className="flex w-full flex-col items-start gap-7.5 lg:flex-row lg:gap-15">

                                        {/* Mapa OpenStreetMap + card de direcciones abajo */}
                                        <div className="flex w-full shrink-0 flex-col gap-2.5 lg:w-140">
                                            <BranchMap
                                                branch={branches.find((b) => String(b.id) === formSucursal) ?? branches[0] ?? null}
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

                                        {/* Campos del formulario */}
                                        <div className="flex w-full flex-1 flex-col gap-7.5 lg:gap-10">

                                            <div className="flex flex-col gap-2.5">
                                                <h3 className="text-xl font-semibold leading-[120%] text-black lg:text-[24px] lg:leading-none" style={{ fontFamily: '"Toyota Type"' }}>
                                                    Arriendo y sucursal
                                                </h3>
                                                <p className="text-sm leading-[120%] text-black lg:text-base" style={{ fontFamily: '"Toyota Type"' }}>
                                                    Cuéntanos cuándo quieres arrendar, por cuánto tiempo y desde qué sucursal te gustaría gestionar tu solicitud.
                                                </p>
                                            </div>

                                            <div className="flex flex-col gap-5 w-full">

                                                {/* Sucursal */}
                                                <SelectField
                                                    label="Sucursal"
                                                    placeholder="Seleccionar sucursal"
                                                    value={formSucursal}
                                                    onChange={(v) => {
                                                        setFormSucursal(v);
                                                        // Clear vehicle if it's not available in the newly chosen branch
                                                        const stillValid = rentals.some(
                                                            (r) => String(r.id) === formVehiculo && r.branch_ids.includes(Number(v)),
                                                        );
                                                        if (!stillValid) setFormVehiculo('');
                                                    }}
                                                    options={branches.map((b) => ({
                                                        value: String(b.id),
                                                        label: `${b.name} — ${b.city}`,
                                                    }))}
                                                />

                                                {/* Fecha estimada */}
                                                <div className="relative flex flex-col gap-2.5 items-start w-full">
                                                    <span className="text-sm leading-none text-black" style={{ fontFamily: '"Toyota Type Book", "Toyota Type", sans-serif' }}>Fecha estimada</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowCalendar(!showCalendar)}
                                                        className="flex h-10 w-full cursor-pointer items-center justify-between rounded-[60px] border border-transparent bg-white px-5 text-left"
                                                    >
                                                        <span className={`text-sm leading-none ${selectedDate ? 'text-black' : 'text-black/60'}`} style={{ fontFamily: '"Toyota Type Book", "Toyota Type", sans-serif' }}>
                                                            {selectedDate ? format(selectedDate, "d 'de' MMMM yyyy", { locale: es }) : 'Seleccionar fecha'}
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
                                                                    setFormFecha(format(date, 'yyyy-MM-dd'));
                                                                    setShowCalendar(false);
                                                                }}
                                                                locale={es}
                                                                disabled={{ before: new Date() }}
                                                            />
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Duración del arriendo */}
                                                <div className="flex gap-5 items-end w-full">
                                                    <div className="flex flex-col gap-2.5 flex-1">
                                                        <span className="text-sm leading-none text-black" style={{ fontFamily: '"Toyota Type Book", "Toyota Type", sans-serif' }}>Duración del arriendo</span>
                                                        <div className="relative">
                                                            <select
                                                                value={durationType}
                                                                onChange={e => { setDurationType(e.target.value as 'horas' | 'dias'); setFormDuracion(''); }}
                                                                className="w-full h-10 rounded-[60px] bg-white border border-transparent pl-5 pr-10 text-sm leading-none appearance-none cursor-pointer focus:outline-none text-black"
                                                                style={{ fontFamily: '"Toyota Type Book", "Toyota Type", sans-serif' }}
                                                            >
                                                                <option value="horas">Horas</option>
                                                                <option value="dias">Días</option>
                                                            </select>
                                                            <svg className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2" width="6" height="10" viewBox="0 0 6 10" fill="none">
                                                                <path d="M1 1L5 5L1 9" stroke="#000" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                                                            </svg>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col gap-2.5 flex-1">
                                                        <span className="text-sm leading-none text-black" style={{ fontFamily: '"Toyota Type Book", "Toyota Type", sans-serif' }}>
                                                            {durationType === 'horas' ? 'Horas' : 'Días'}
                                                        </span>
                                                        <input
                                                            type="number"
                                                            min="1"
                                                            value={formDuracion}
                                                            onChange={e => setFormDuracion(e.target.value)}
                                                            placeholder="0"
                                                            className="w-full h-10 rounded-[60px] bg-white border border-transparent pl-5 pr-5 text-sm leading-none focus:outline-none"
                                                            style={{ fontFamily: '"Toyota Type Book", "Toyota Type", sans-serif', color: formDuracion ? '#000' : 'rgba(0,0,0,0.60)' }}
                                                        />
                                                    </div>
                                                </div>

                                                {/* Vehículo de interés (filtrado por sucursal) */}
                                                {(() => {
                                                    const available = rentals.filter(
                                                        (r) => !formSucursal || r.branch_ids.includes(Number(formSucursal)),
                                                    );
                                                    const noBranch = !formSucursal;
                                                    const noVehicles = !noBranch && available.length === 0;
                                                    return (
                                                        <SelectField
                                                            label="Vehículo de interés"
                                                            placeholder={
                                                                noBranch
                                                                    ? 'Primero selecciona una sucursal'
                                                                    : noVehicles
                                                                        ? 'No hay vehículos disponibles en esta sucursal'
                                                                        : 'Seleccionar vehículo de interés'
                                                            }
                                                            value={formVehiculo}
                                                            onChange={setFormVehiculo}
                                                            disabled={noBranch || noVehicles}
                                                            hint={noBranch ? undefined : noVehicles ? 'Probá con otra sucursal.' : undefined}
                                                            options={available.map((r) => ({
                                                                value: String(r.id),
                                                                label: r.name ?? 'Vehículo',
                                                            }))}
                                                        />
                                                    );
                                                })()}
                                            </div>

                                            <button
                                                onClick={() => setFormStep(2)}
                                                className="w-full cursor-pointer rounded-[60px] border border-transparent bg-black px-8 py-4 text-base leading-none text-white transition-opacity hover:opacity-80 lg:w-auto lg:self-start lg:px-15 lg:py-4.75"
                                                style={{ fontFamily: '"Toyota Type"' }}
                                            >
                                                Siguiente
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Paso 2 — Datos de contacto */}
                                {formStep === 2 && (
                                    <div className="flex w-full flex-col items-start gap-7.5 lg:flex-row lg:gap-15">

                                        {/* Imagen izquierda */}
                                        <div className="aspect-square w-full shrink-0 overflow-hidden rounded-[30px] lg:h-140 lg:w-140">
                                            <img
                                                src={formStep2Img}
                                                alt="Datos de contacto"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        {/* Campos */}
                                        <div className="flex w-full flex-1 flex-col justify-center gap-7.5 lg:gap-10">

                                            <h3 className="text-xl font-semibold leading-[120%] text-black lg:text-[24px] lg:leading-none" style={{ fontFamily: '"Toyota Type"' }}>
                                                Datos de contacto
                                            </h3>

                                            <div className="flex flex-col gap-5 w-full">

                                                {/* Nombre */}
                                                <div className="flex flex-col gap-2.5 items-start w-full">
                                                    <span className="text-sm leading-none text-black" style={{ fontFamily: '"Toyota Type Book", "Toyota Type", sans-serif' }}>Nombre</span>
                                                    <input
                                                        type="text"
                                                        value={formNombre}
                                                        onChange={e => setFormNombre(e.target.value)}
                                                        placeholder="Nombre y apellido"
                                                        className="w-full h-10 rounded-[60px] bg-white border border-transparent pl-5 pr-5 text-sm leading-none text-black focus:outline-none placeholder:text-black/60"
                                                        style={{ fontFamily: '"Toyota Type Book", "Toyota Type", sans-serif' }}
                                                    />
                                                </div>

                                                {/* Rut */}
                                                <div className="flex flex-col gap-2.5 items-start w-full">
                                                    <span className="text-sm leading-none text-black" style={{ fontFamily: '"Toyota Type Book", "Toyota Type", sans-serif' }}>Rut</span>
                                                    <input
                                                        type="text"
                                                        value={formRut}
                                                        onChange={e => setFormRut(formatRut(e.target.value))}
                                                        placeholder="12.345.678-9"
                                                        className="w-full h-10 rounded-[60px] bg-white border border-transparent pl-5 pr-5 text-sm leading-none text-black focus:outline-none placeholder:text-black/60"
                                                        style={{ fontFamily: '"Toyota Type Book", "Toyota Type", sans-serif' }}
                                                    />
                                                </div>

                                                {/* Teléfono */}
                                                <div className="flex flex-col gap-2.5 items-start w-full">
                                                    <span className="text-sm leading-none text-black" style={{ fontFamily: '"Toyota Type Book", "Toyota Type", sans-serif' }}>Teléfono</span>
                                                    <input
                                                        type="tel"
                                                        value={formTelefono}
                                                        onChange={e => setFormTelefono(e.target.value)}
                                                        className="w-full h-10 rounded-[60px] bg-white border border-transparent pl-5 pr-5 text-sm leading-none text-black focus:outline-none"
                                                        style={{ fontFamily: '"Toyota Type Book", "Toyota Type", sans-serif' }}
                                                    />
                                                </div>

                                                {/* Correo */}
                                                <div className="flex flex-col gap-2.5 items-start w-full">
                                                    <span className="text-sm leading-none text-black" style={{ fontFamily: '"Toyota Type Book", "Toyota Type", sans-serif' }}>Correo</span>
                                                    <input
                                                        type="email"
                                                        value={formCorreo}
                                                        onChange={e => setFormCorreo(e.target.value)}
                                                        placeholder="Correo electrónico"
                                                        className="w-full h-10 rounded-[60px] bg-white border border-transparent pl-5 pr-5 text-sm leading-none text-black focus:outline-none placeholder:text-black/60"
                                                        style={{ fontFamily: '"Toyota Type Book", "Toyota Type", sans-serif' }}
                                                    />
                                                </div>

                                                {/* Checkbox licencia */}
                                                <label className="flex items-center gap-2.5 cursor-pointer">
                                                    <div
                                                        onClick={() => setFormLicencia(!formLicencia)}
                                                        className={`shrink-0 w-4.5 h-4.5 rounded border flex items-center justify-center transition-colors ${formLicencia ? 'bg-black border-black' : 'bg-[#EAEAF1] border-black/80'}`}
                                                    >
                                                        {formLicencia && (
                                                            <svg width="11" height="8" viewBox="0 0 11 8" fill="none">
                                                                <path d="M1 4L4 7L10 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                            </svg>
                                                        )}
                                                    </div>
                                                    <span className="text-sm leading-none text-black" style={{ fontFamily: '"Toyota Type Book", "Toyota Type", sans-serif' }}>
                                                        Cuento con licencia de conducir vigente
                                                    </span>
                                                </label>
                                            </div>

                                            <button
                                                onClick={() => setFormStep(3)}
                                                className="w-full cursor-pointer rounded-[60px] border border-transparent bg-black px-8 py-4 text-base leading-none text-white transition-opacity hover:opacity-80 lg:w-auto lg:self-start lg:px-15 lg:py-4.75"
                                                style={{ fontFamily: '"Toyota Type"' }}
                                            >
                                                Siguiente
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Paso 3 — Confirmar */}
                                {formStep === 3 && (
                                    <div className="flex w-full flex-col items-start gap-7.5 lg:flex-row lg:gap-15">

                                        {/* Imagen izquierda */}
                                        <div className="aspect-square w-full shrink-0 overflow-hidden rounded-[30px] lg:h-140 lg:w-140">
                                            <img
                                                src={formStep3Img}
                                                alt="Confirmar solicitud"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        {/* Resumen + botón */}
                                        <div className="flex w-full flex-1 flex-col justify-center gap-5">

                                            <h3 className="text-xl font-semibold leading-[120%] text-black lg:text-[24px] lg:leading-none" style={{ fontFamily: '"Toyota Type"' }}>
                                                Confirmar solicitud
                                            </h3>
                                            <p className="text-sm leading-[120%] text-black lg:text-base lg:leading-none" style={{ fontFamily: '"Toyota Type"' }}>
                                                Revisa tu información antes de enviarla. Una vez recibida, un asesor de Musalem se pondrá en contacto contigo para continuar la gestión.
                                            </p>

                                            {/* Tarjeta resumen */}
                                            <div className="flex w-full flex-col items-start gap-5 rounded-[20px] bg-white p-5 lg:p-10">
                                                {[
                                                    {
                                                        label: 'Sucursal',
                                                        value: branches.find((b) => String(b.id) === formSucursal)?.name ?? '—',
                                                    },
                                                    {
                                                        label: 'Fecha estimada',
                                                        value: formFecha
                                                            ? new Date(formFecha + 'T12:00:00').toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' })
                                                            : '—',
                                                    },
                                                    {
                                                        label: 'Modalidad y tiempo',
                                                        value: formDuracion
                                                            ? `${durationType === 'horas' ? 'Horas' : 'Días'}, ${formDuracion} ${durationType === 'horas' ? (formDuracion === '1' ? 'hora' : 'horas') : (formDuracion === '1' ? 'día' : 'días')}`
                                                            : '—',
                                                    },
                                                    {
                                                        label: 'Vehículo de interés',
                                                        value: rentals.find((r) => String(r.id) === formVehiculo)?.name ?? '—',
                                                    },
                                                    {
                                                        label: 'Datos de contacto',
                                                        value: [formNombre, formCorreo, formTelefono].filter(Boolean).join(', ') || '—',
                                                    },
                                                ].map(({ label, value }) => (
                                                    <div key={label} className="flex flex-col gap-2.5">
                                                        <span className="text-sm font-semibold leading-none text-black" style={{ fontFamily: '"Toyota Type"' }}>{label}</span>
                                                        <span className="text-sm leading-none text-black" style={{ fontFamily: '"Toyota Type"' }}>{value}</span>
                                                    </div>
                                                ))}
                                            </div>

                                            <label className="flex items-center gap-2.5 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={formPrivacidad}
                                                    onChange={(e) => setFormPrivacidad(e.target.checked)}
                                                    className="size-4.5 shrink-0 appearance-none rounded border border-black/80 bg-white checked:bg-black checked:bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20d%3D%22M2%206l3%203%205-5%22%20stroke%3D%22%23fff%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20fill%3D%22none%22%2F%3E%3C%2Fsvg%3E')] checked:bg-center checked:bg-no-repeat"
                                                />
                                                <span className="text-sm leading-none text-black" style={{ fontFamily: '"Toyota Type"' }}>
                                                    He leído y acepto la política de privacidad de mis datos personales.
                                                </span>
                                            </label>

                                            <button
                                                disabled={submitting || !formPrivacidad}
                                                onClick={() => {
                                                    if (!formPrivacidad) {
                                                        toast.error('Debes aceptar la política de privacidad para continuar.');
                                                        return;
                                                    }
                                                    setSubmitting(true);
                                                    router.post('/kinto/solicitud', {
                                                        sucursal: formSucursal,
                                                        fecha: formFecha,
                                                        duracion: formDuracion,
                                                        duracion_tipo: durationType,
                                                        vehiculo: formVehiculo,
                                                        nombre: formNombre,
                                                        rut: formRut,
                                                        telefono: formTelefono,
                                                        correo: formCorreo,
                                                        privacidad: formPrivacidad,
                                                        _website: '',
                                                    }, {
                                                        preserveState: true,
                                                        onSuccess: () => { setFormSent(true); setSubmitting(false); toast.success('¡Solicitud enviada! Te contactaremos pronto.'); },
                                                        onError: () => { setSubmitting(false); toast.error('Hubo un problema al enviar. Intenta nuevamente.'); },
                                                    });
                                                }}
                                                className="w-full cursor-pointer rounded-[60px] border border-transparent bg-black px-8 py-4 text-base leading-none text-white transition-opacity hover:opacity-80 disabled:opacity-50 lg:w-auto lg:self-start lg:px-15 lg:py-4.75"
                                                style={{ fontFamily: '"Toyota Type"' }}
                                            >
                                                {submitting ? 'Enviando…' : 'Enviar solicitud'}
                                            </button>
                                        </div>
                                    </div>
                                )}

                            </div>
                        )}
                    </div>
                </section>

                <ContactCtaBanner bg="dark" />

            </main>

            {footer && (
                <div className="bg-black">
                    <Footer data={footer} />
                </div>
            )}
        </div>
    );
}
