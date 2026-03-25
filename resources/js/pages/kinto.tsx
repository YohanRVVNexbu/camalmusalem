import { Head } from '@inertiajs/react';
import { Footer } from '@/components/landing/footer';
import { Navbar } from '@/components/landing/navbar';
import { ContactCta } from '@/components/landing/contact-cta';
import { useEffect, useState } from 'react';
import { useInView } from '@/hooks/use-in-view';
import heroImg from '@images/kinto/hero_image.png?format=webp';
import car1Img from '@images/kinto/car_1.png?format=webp';
import car2Img from '@images/kinto/car_2.png?format=webp';
import formImg from '@images/kinto/image_form.jpg?format=webp';
import ctaImg from '@images/seminuevos/ejemplo-video.png?format=webp';
import formStep1Img from '@images/mantencion/image_step1.png?format=webp';
import formStep2Img from '@images/mantencion/form_2_image.png?format=webp';
import formStep3Img from '@images/mantencion/form_image_3.png?format=webp';
import card1Img from '@images/kinto/card_1.jpg?format=webp';
import card2Img from '@images/kinto/card_2.jpg?format=webp';
import card3Img from '@images/kinto/card_3.jpg?format=webp';

const pasos = [
    {
        img: card1Img,
        titulo: 'Paso 1:',
        subtitulo: 'Descarga la app KINTO Share y conoce cómo funciona el servicio.',
    },
    {
        img: card2Img,
        titulo: 'Paso 2:',
        subtitulo: 'Completa el formulario con tu interés o solicitud para que podamos orientarte.',
    },
    {
        img: card3Img,
        titulo: 'Paso 3:',
        subtitulo: 'Un asesor de Musalem te contactará para ayudarte a revisar la disponibilidad y continuar la gestión desde la sucursal correspondiente.',
    },
];

function KintoIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="24" viewBox="0 0 22 24" fill="none">
            <path d="M0.0848142 14.309L0.0628316 14.0968L0.0579467 14.0425C0.0155799 13.5722 -0.00357771 13.1 0.000548458 12.6277C0.0225308 4.68251 5.23968 0 15.8767 0H20.7788C21.1027 0 21.4133 0.133082 21.6423 0.369969C21.8713 0.606856 22 0.928144 22 1.26315L21.9976 3.86146C21.3894 14.8522 16.2089 20.2105 7.3451 20.2105H4.13201C3.92194 21.0873 3.76894 21.9777 3.67404 22.8757C3.6564 23.0406 3.60754 23.2003 3.53023 23.3456C3.45293 23.491 3.3487 23.6191 3.22351 23.7228C3.09831 23.8265 2.95459 23.9037 2.80056 23.9499C2.64653 23.9962 2.48521 24.0106 2.32579 23.9923C2.16638 23.9741 2.012 23.9235 1.87147 23.8436C1.73095 23.7636 1.60702 23.6558 1.50677 23.5263C1.40652 23.3968 1.33192 23.2482 1.28721 23.0889C1.2425 22.9296 1.22857 22.7627 1.24622 22.5978C1.38788 21.2774 1.62399 20.0366 1.95454 18.8753L1.81043 18.6909L1.55641 18.3372L1.36468 18.0479L1.14241 17.6778L1.02273 17.4618L0.943347 17.3077C0.749368 16.9265 0.58717 16.5288 0.458514 16.1191L0.370585 15.8197L0.266779 15.4067L0.197168 15.0682L0.144655 14.7625L0.0848142 14.309ZM10.513 8.9507C7.03857 10.5486 4.58509 12.9044 3.05365 16.0029C3.13344 16.1713 3.22218 16.3397 3.31988 16.5082L3.54581 16.8631L3.6313 16.9856C3.729 17.1237 3.83403 17.2623 3.94638 17.4012L4.18697 17.6841H4.97955C6.24598 14.8155 8.37094 12.6997 11.5046 11.2597C11.8007 11.1237 12.0324 10.8717 12.1487 10.559C12.2651 10.2463 12.2565 9.89858 12.125 9.59239C11.9935 9.28619 11.7498 9.04656 11.4475 8.92622C11.1452 8.80588 10.809 8.81469 10.513 8.9507Z" fill="black"/>
        </svg>
    );
}

const vehiculos = [
    { nombre: 'Corolla Cross', precio: 'Desde $18.300 la hora', img: car1Img },
    { nombre: 'Rav4', precio: 'Desde $18.300 la hora', img: car2Img },
];

function SelectField({ label, placeholder, options, value, onChange }: {
    label: string;
    placeholder: string;
    options: { value: string; label: string }[];
    value: string;
    onChange: (v: string) => void;
}) {
    return (
        <div className="flex flex-col gap-2.5 items-start self-stretch">
            <span className="text-sm leading-none text-black" style={{ fontFamily: '"Toyota Type Book", "Toyota Type", sans-serif' }}>{label}</span>
            <div className="relative self-stretch">
                <select
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    className="w-full h-10 rounded-[60px] bg-white border border-transparent pl-5 pr-10 text-sm leading-none appearance-none cursor-pointer focus:outline-none"
                    style={{ fontFamily: '"Toyota Type Book", "Toyota Type", sans-serif', color: value ? '#000' : 'rgba(0,0,0,0.60)' }}
                >
                    <option value="" disabled>{placeholder}</option>
                    {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <svg className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2" width="6" height="10" viewBox="0 0 6 10" fill="none">
                    <path d="M1 1L5 5L1 9" stroke="#000" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </div>
        </div>
    );
}

export default function Kinto({ footer }: { footer: any }) {
    const heroInView = useInView(0.1);
    const comoFuncionaInView = useInView(0.1);
    const vehiculosInView = useInView(0.1);
    const [sucursal, setSucursal] = useState<'la-serena' | 'ovalle'>('la-serena');
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
    const [formSent, setFormSent] = useState(false);

    useEffect(() => {
        const html = document.documentElement;
        const prev = html.style.backgroundColor;
        html.style.backgroundColor = '#000';
        return () => { html.style.backgroundColor = prev; };
    }, []);

    return (
        <div className="min-h-screen bg-black">
            <Head title="Arriendo Kinto — Toyota Musalem" />
            <Navbar variant="white" />

            <main className="flex flex-col bg-black">

                {/* Hero */}
                <section ref={heroInView.ref}>
                    <div
                        className={`flex h-165 flex-col items-start justify-end gap-10 rounded-b-[30px] px-10 py-15 transition-all duration-700 ease-out ${heroInView.visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}
                        style={{
                            background: `linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(0,0,0,0.80) 100%), linear-gradient(0deg, rgba(0,0,0,0.30) 0%, rgba(0,0,0,0.30) 100%), url(${heroImg}) lightgray 0px -134.607px / 110.409% 140.677% no-repeat`,
                        }}
                    >
                        <div className="flex items-end justify-between self-stretch">
                            {/* Izquierda: título + descripción */}
                            <div className="flex flex-col gap-10 items-start">
                                <h1
                                    className="text-[48px] font-normal leading-[100%] text-white"
                                    style={{ fontFamily: '"Toyota Type"', fontFeatureSettings: '"liga" off, "clig" off' }}
                                >
                                    Arrienda con KINTO<br />desde Musalem
                                </h1>
                                <p
                                    className="w-124 text-base leading-[120%] text-white"
                                    style={{ fontFamily: '"Toyota Type"' }}
                                >
                                    Con KINTO puedes reservar, retirar y usar un Toyota directamente desde la app. En Musalem te orientamos durante el proceso y te ayudamos a encontrar la alternativa disponible que mejor se adapte a tu necesidad, ya sea por horas, días o semanas.
                                </p>
                            </div>

                            {/* Derecha: botón + nota */}
                            <div className="flex flex-col gap-5 items-start">
                                <button className="flex cursor-pointer items-center rounded-[60px] border border-transparent bg-white p-1 transition-opacity hover:opacity-90">
                                    <span className="pl-2.5 text-base leading-none text-black" style={{ fontFamily: '"Toyota Type"' }}>
                                        Descargar app KINTO
                                    </span>
                                    <span className="ml-2.5 flex size-10 shrink-0 items-center justify-center rounded-full bg-black">
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

                {/* ¿Cómo funciona KINTO? */}
                <section ref={comoFuncionaInView.ref} className="bg-black px-15 py-20">
                    <div className={`flex flex-col items-center gap-10 rounded-[30px] bg-[#EAEAF1] p-10 transition-all duration-700 ease-out ${comoFuncionaInView.visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                        <h2
                            className="text-center text-[32px] font-normal leading-[120%] text-black"
                            style={{ fontFamily: '"Toyota Type"' }}
                        >
                            ¿Cómo funciona KINTO en Musalem?
                        </h2>
                        <div className="flex w-full gap-5">
                            {pasos.map((paso, i) => (
                                <div
                                    key={i}
                                    className="flex flex-1 flex-col items-center justify-center gap-5 rounded-[40.8px] px-10 py-15"
                                    style={{
                                        height: '408px',
                                        background: `linear-gradient(0deg, rgba(0,0,0,0.20) 0%, rgba(0,0,0,0.20) 100%), linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.80) 100%), url(${paso.img}) lightgray 50% / cover no-repeat`,
                                    }}
                                >
                                    <span
                                        className="text-center text-[28px] font-semibold leading-[120%] text-white"
                                        style={{ fontFamily: '"Toyota Type"' }}
                                    >
                                        {paso.titulo}
                                    </span>
                                    <p
                                        className="text-center text-base font-normal leading-[120%] text-white"
                                        style={{ fontFamily: '"Toyota Type"' }}
                                    >
                                        {paso.subtitulo}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Vehículos disponibles */}
                <section ref={vehiculosInView.ref} className="bg-black px-15 py-20">
                    <div className={`flex flex-col gap-10 transition-all duration-700 ease-out ${vehiculosInView.visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>

                        {/* Header con tabs */}
                        <div className="flex items-center justify-between self-stretch">
                            <h2
                                className="text-[32px] font-normal leading-[120%] text-white"
                                style={{ fontFamily: '"Toyota Type"' }}
                            >
                                Vehículos disponibles
                            </h2>
                            <div className="flex items-center gap-1.5 rounded-[60px] bg-white p-1.5">
                                {(['la-serena', 'ovalle'] as const).map((key) => (
                                    <button
                                        key={key}
                                        onClick={() => setSucursal(key)}
                                        className={`h-11 cursor-pointer rounded-[60px] border border-transparent px-5 py-1 text-base leading-none transition-colors ${
                                            sucursal === key
                                                ? 'bg-black text-white'
                                                : 'bg-[#EAEAF1] text-black'
                                        }`}
                                        style={{ fontFamily: '"Toyota Type"' }}
                                    >
                                        {key === 'la-serena' ? 'Musalem La Serena' : 'Musalem Ovalle'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Cards de vehículos */}
                        <div className="flex gap-5">
                            {vehiculos.map((vehiculo) => (
                                <div
                                    key={vehiculo.nombre}
                                    className="flex h-162.5 flex-1 flex-col items-center justify-between overflow-hidden rounded-[30px] bg-white py-15"
                                >
                                    {/* Nombre */}
                                    <div className="flex items-end gap-2.5">
                                        <KintoIcon />
                                        <span
                                            className="text-[32px] font-semibold uppercase leading-none text-black"
                                            style={{ fontFamily: '"Toyota Type"' }}
                                        >
                                            {vehiculo.nombre}
                                        </span>
                                    </div>

                                    {/* Imagen */}
                                    <div className="flex h-66 w-full items-center justify-center">
                                        {vehiculo.img ? (
                                            <img src={vehiculo.img} alt={vehiculo.nombre} className="h-full object-contain" />
                                        ) : (
                                            <div className="h-full w-144.5 rounded-xl bg-gray-100" />
                                        )}
                                    </div>

                                    {/* Precio */}
                                    <span className="text-sm leading-none text-black" style={{ fontFamily: '"Toyota Type"' }}>
                                        {vehiculo.precio}
                                    </span>

                                    {/* Botones */}
                                    <div className="flex items-center gap-2.5">
                                        {/* Ver detalles */}
                                        <button className="flex h-12 cursor-pointer items-center rounded-[60px] border border-transparent bg-black p-1 transition-opacity hover:opacity-80">
                                            <span className="pb-0.5 pl-2.5 text-sm leading-none text-white" style={{ fontFamily: '"Toyota Type"' }}>
                                                Ver detalles vehículo
                                            </span>
                                            <span className="ml-2.5 flex size-10 shrink-0 items-center justify-center rounded-full bg-white">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="14" viewBox="0 0 18 14" fill="none">
                                                    <path d="M0.75 6.75L16.75 6.75M16.75 6.75L10.75 12.75M16.75 6.75L10.75 0.75" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                </svg>
                                            </span>
                                        </button>
                                        {/* Solicitar información */}
                                        <button className="flex h-12 cursor-pointer items-center rounded-[60px] border border-black p-1 pl-1.5 transition-opacity hover:opacity-80">
                                            <span className="pb-0.5 pl-2.5 text-sm leading-none text-black" style={{ fontFamily: '"Toyota Type"' }}>
                                                Solicitar información
                                            </span>
                                            <span className="ml-2.5 flex size-10 shrink-0 items-center justify-center rounded-[80px] bg-black" style={{ backdropFilter: 'blur(20px)' }}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="19" height="15" viewBox="0 0 19 15" fill="none">
                                                    <path d="M0.699816 7.28646L18.2554 7.28646M18.2554 7.28646L11.672 13.8698M18.2554 7.28646L11.672 0.703125" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                                                </svg>
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Solicita tu arriendo */}
                <section className="bg-black px-15 py-20">
                    <div className="rounded-[30px] bg-[#EAEAF1] p-15 flex flex-col gap-20 items-center">
                        {!showForm ? (
                            /* ── Vista inicial ── */
                            <div className="flex items-center justify-between self-stretch">
                                <div className="flex flex-col gap-10 items-start justify-center">
                                    <h2
                                        className="text-[40px] font-semibold leading-[120%] text-black"
                                        style={{ fontFamily: '"Toyota Type"' }}
                                    >
                                        Solicita tu arriendo<br />Kinto en Musalem
                                    </h2>
                                    <p
                                        className="w-115.5 text-base leading-[120%] text-black"
                                        style={{ fontFamily: '"Toyota Type"' }}
                                    >
                                        Conoce la opción de arriendo disponible a través de KINTO y déjanos tu solicitud para que un asesor de Musalem te contacte y te ayude a gestionar el proceso según sucursal, disponibilidad y fecha estimada.
                                    </p>
                                    <button
                                        onClick={() => { setShowForm(true); setFormStep(1); }}
                                        className="cursor-pointer rounded-[60px] border border-transparent bg-black px-15 py-4.75 text-base leading-none text-white transition-opacity hover:opacity-80"
                                        style={{ fontFamily: '"Toyota Type"' }}
                                    >
                                        Solicitar arriendo Kinto
                                    </button>
                                </div>
                                <img
                                    src={formImg}
                                    alt="Solicitar arriendo Kinto"
                                    className="h-140 w-140 shrink-0 rounded-[30px] object-cover"
                                />
                            </div>
                        ) : formSent ? (
                            /* ── Éxito ── */
                            <div className="flex items-center justify-center w-full py-20">
                                <div className="flex flex-col gap-10 items-center justify-center flex-1">
                                    <h3 className="text-[24px] font-semibold leading-none text-black" style={{ fontFamily: '"Toyota Type"' }}>
                                        Solicitud enviada con éxito
                                    </h3>
                                    <p className="text-base leading-[120%] text-black text-center w-122" style={{ fontFamily: '"Toyota Type"' }}>
                                        Hemos recibido tu solicitud de arriendo y te enviaremos un correo a{' '}
                                        <span className="font-semibold uppercase">{formCorreo}</span>
                                        {' '}con los detalles de tu solicitud.
                                    </p>
                                    <div className="flex flex-col gap-5 items-stretch">
                                        <button
                                            onClick={() => { setShowForm(false); setFormSent(false); }}
                                            className="cursor-pointer rounded-[60px] bg-black px-15 py-4.75 text-base leading-none text-white transition-opacity hover:opacity-80"
                                            style={{ fontFamily: '"Toyota Type"' }}
                                        >
                                            Volver a inicio
                                        </button>
                                        <button
                                            onClick={() => { setFormSent(false); setFormStep(1); setFormSucursal(''); setFormFecha(''); setFormDuracion(''); setFormVehiculo(''); setFormNombre(''); setFormRut(''); setFormTelefono('+569'); setFormCorreo(''); setFormLicencia(false); }}
                                            className="cursor-pointer rounded-[60px] border border-black bg-transparent px-15 py-4.75 text-base leading-none text-black transition-opacity hover:opacity-70"
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
                                    <div className="flex gap-5 w-full h-12">
                                        {['Arriendo y sucursal', 'Datos de contacto', 'Confirmar'].map((tab, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setFormStep(i + 1)}
                                                className={`flex-1 h-12 rounded-[60px] text-base leading-none transition-colors cursor-pointer ${formStep === i + 1 ? 'bg-black text-white' : 'bg-white text-black'}`}
                                                style={{ fontFamily: '"Toyota Type"' }}
                                            >
                                                {i + 1}. {tab}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Contenido paso 1 */}
                                {formStep === 1 && (
                                    <div className="flex gap-15 items-start w-full">

                                        {/* Imagen izquierda con overlay sucursales */}
                                        <div className="shrink-0 w-140 h-140 rounded-[30px] bg-white overflow-hidden relative shadow-sm">
                                            <img
                                                src={formStep1Img}
                                                alt="Sucursales"
                                                className="absolute inset-0 w-full h-full object-cover"
                                            />
                                            <div
                                                className="absolute left-7.5 bottom-7.5 w-92.25 rounded-2xl p-5 flex flex-col gap-2.5 overflow-hidden"
                                                style={{ background: 'rgba(0,0,0,0.60)', backdropFilter: 'blur(30px)' }}
                                            >
                                                <div className="flex flex-col gap-4 items-start w-full">
                                                    <span className="text-xl font-semibold uppercase leading-none text-white" style={{ fontFamily: '"Toyota Type"' }}>
                                                        Sucursales
                                                    </span>
                                                    <span className="text-sm leading-none text-white" style={{ fontFamily: '"Toyota Type"' }}>
                                                        Av. Francisco de Aguirre #070, La Serena
                                                    </span>
                                                    <span className="text-sm leading-none text-white" style={{ fontFamily: '"Toyota Type"' }}>
                                                        Aristía #358, Ovalle
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Campos del formulario */}
                                        <div className="flex flex-col gap-10 flex-1">

                                            <div className="flex flex-col gap-2.5">
                                                <h3 className="text-[24px] font-semibold leading-none text-black" style={{ fontFamily: '"Toyota Type"' }}>
                                                    Arriendo y sucursal
                                                </h3>
                                                <p className="text-base leading-[120%] text-black" style={{ fontFamily: '"Toyota Type"' }}>
                                                    Cuéntanos cuándo quieres arrendar, por cuánto tiempo y desde qué sucursal te gustaría gestionar tu solicitud.
                                                </p>
                                            </div>

                                            <div className="flex flex-col gap-5 w-full">

                                                {/* Sucursal */}
                                                <SelectField
                                                    label="Sucursal"
                                                    placeholder="Seleccionar sucursal"
                                                    value={formSucursal}
                                                    onChange={setFormSucursal}
                                                    options={[
                                                        { value: 'la-serena', label: 'La Serena — Av. Francisco de Aguirre #070' },
                                                        { value: 'ovalle', label: 'Ovalle — Aristía #358' },
                                                    ]}
                                                />

                                                {/* Fecha estimada */}
                                                <div className="flex flex-col gap-2.5 items-start w-full">
                                                    <span className="text-sm leading-none text-black" style={{ fontFamily: '"Toyota Type Book", "Toyota Type", sans-serif' }}>Fecha estimada</span>
                                                    <div className="relative w-full">
                                                        <input
                                                            type="datetime-local"
                                                            value={formFecha}
                                                            onChange={e => setFormFecha(e.target.value)}
                                                            className="w-full h-10 rounded-[60px] bg-white border border-transparent pl-5 pr-12 text-sm leading-none appearance-none cursor-pointer focus:outline-none"
                                                            style={{ fontFamily: '"Toyota Type Book", "Toyota Type", sans-serif', color: formFecha ? '#000' : 'rgba(0,0,0,0.60)' }}
                                                            placeholder="Seleccionar fecha y hora"
                                                        />
                                                        <svg className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                            <rect x="3" y="4" width="18" height="18" rx="2" stroke="#000" strokeWidth="1.4"/>
                                                            <path d="M3 9H21" stroke="#000" strokeWidth="1.4"/>
                                                            <path d="M8 2V6M16 2V6" stroke="#000" strokeWidth="1.4" strokeLinecap="round"/>
                                                        </svg>
                                                    </div>
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

                                                {/* Vehículo de interés */}
                                                <SelectField
                                                    label="Vehículo de interés"
                                                    placeholder="Seleccionar vehículo de interés"
                                                    value={formVehiculo}
                                                    onChange={setFormVehiculo}
                                                    options={[
                                                        { value: 'corolla-cross', label: 'Corolla Cross' },
                                                        { value: 'rav4', label: 'Rav4' },
                                                    ]}
                                                />
                                            </div>

                                            <button
                                                onClick={() => setFormStep(2)}
                                                className="self-start cursor-pointer rounded-[60px] border border-transparent bg-black px-15 py-4.75 text-base leading-none text-white transition-opacity hover:opacity-80"
                                                style={{ fontFamily: '"Toyota Type"' }}
                                            >
                                                Siguiente
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Paso 2 — Datos de contacto */}
                                {formStep === 2 && (
                                    <div className="flex gap-15 items-start w-full">

                                        {/* Imagen izquierda */}
                                        <div className="shrink-0 w-140 h-140 rounded-[30px] overflow-hidden">
                                            <img
                                                src={formStep2Img}
                                                alt="Datos de contacto"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        {/* Campos */}
                                        <div className="flex flex-col gap-10 flex-1 justify-center">

                                            <h3 className="text-[24px] font-semibold leading-none text-black" style={{ fontFamily: '"Toyota Type"' }}>
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
                                                        className="w-full h-10 rounded-[60px] bg-white border border-transparent pl-5 pr-5 text-sm leading-none focus:outline-none placeholder:text-black/60"
                                                        style={{ fontFamily: '"Toyota Type Book", "Toyota Type", sans-serif' }}
                                                    />
                                                </div>

                                                {/* Rut */}
                                                <div className="flex flex-col gap-2.5 items-start w-full">
                                                    <span className="text-sm leading-none text-black" style={{ fontFamily: '"Toyota Type Book", "Toyota Type", sans-serif' }}>Rut</span>
                                                    <input
                                                        type="text"
                                                        value={formRut}
                                                        onChange={e => setFormRut(e.target.value)}
                                                        placeholder="12.345.678-9"
                                                        className="w-full h-10 rounded-[60px] bg-white border border-transparent pl-5 pr-5 text-sm leading-none focus:outline-none placeholder:text-black/60"
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
                                                        className="w-full h-10 rounded-[60px] bg-white border border-transparent pl-5 pr-5 text-sm leading-none focus:outline-none"
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
                                                        className="w-full h-10 rounded-[60px] bg-white border border-transparent pl-5 pr-5 text-sm leading-none focus:outline-none placeholder:text-black/60"
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
                                                className="self-start cursor-pointer rounded-[60px] border border-transparent bg-black px-15 py-4.75 text-base leading-none text-white transition-opacity hover:opacity-80"
                                                style={{ fontFamily: '"Toyota Type"' }}
                                            >
                                                Siguiente
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Paso 3 — Confirmar */}
                                {formStep === 3 && (
                                    <div className="flex gap-15 items-start w-full">

                                        {/* Imagen izquierda */}
                                        <div className="shrink-0 w-140 h-140 rounded-[30px] overflow-hidden">
                                            <img
                                                src={formStep3Img}
                                                alt="Confirmar solicitud"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        {/* Resumen + botón */}
                                        <div className="flex flex-col gap-5 flex-1 justify-center">

                                            <h3 className="text-[24px] font-semibold leading-none text-black" style={{ fontFamily: '"Toyota Type"' }}>
                                                Confirmar solicitud
                                            </h3>
                                            <p className="text-base leading-none text-black" style={{ fontFamily: '"Toyota Type"' }}>
                                                Revisa tu información antes de enviarla. Una vez recibida, un asesor de Musalem se pondrá en contacto contigo para continuar la gestión.
                                            </p>

                                            {/* Tarjeta resumen */}
                                            <div className="bg-white rounded-[20px] p-10 flex flex-col gap-5 items-start w-full">
                                                {[
                                                    {
                                                        label: 'Sucursal',
                                                        value: formSucursal === 'la-serena' ? 'Musalem La Serena' : formSucursal === 'ovalle' ? 'Musalem Ovalle' : '—',
                                                    },
                                                    {
                                                        label: 'Fecha estimada',
                                                        value: formFecha
                                                            ? new Date(formFecha).toLocaleString('es-CL', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) + ' hrs.'
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
                                                        value: formVehiculo === 'corolla-cross' ? 'Corolla Cross' : formVehiculo === 'rav4' ? 'Rav4' : '—',
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

                                            <button
                                                onClick={() => setFormSent(true)}
                                                className="self-start cursor-pointer rounded-[60px] border border-transparent bg-black px-15 py-4.75 text-base leading-none text-white transition-opacity hover:opacity-80"
                                                style={{ fontFamily: '"Toyota Type"' }}
                                            >
                                                Enviar solicitud
                                            </button>
                                        </div>
                                    </div>
                                )}

                            </div>
                        )}
                    </div>
                </section>

                <ContactCta backgroundImage={ctaImg} bg="negro" />

            </main>

            <div className="bg-black">
                <Footer data={footer} />
            </div>
        </div>
    );
}
