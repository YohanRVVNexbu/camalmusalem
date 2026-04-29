import { Head, Link } from '@inertiajs/react';
import { Footer } from '@/components/landing/footer';
import { Navbar } from '@/components/landing/navbar';
import { ContactCtaBanner } from '@/components/landing/contact-cta-banner';
import { BranchesSection } from '@/components/landing/branches-section';
import { useEffect, useState } from 'react';
import heroImg from '@images/repuestos/hero_image.png?format=webp';
import section2Img from '@images/repuestos/image_section2.jpg?format=webp';
import section3Img from '@images/repuestos/image_section3.jpg?format=webp';
import ctaImg from '@images/seminuevos/ejemplo-video.png?format=webp';
import visitanos1 from '@images/seminuevos/visitanos_1.png?format=webp';
import visitanos2 from '@images/seminuevos/visitanos_2.png?format=webp';


type SolicitudStep = 'default' | 'form' | 'success';

type Repuesto = {
    id: number;
    name: string;
    sku: string | null;
    price: string | null;
    category: string;
    images: string[];
    stock_la_serena: boolean;
    stock_ovalle: boolean;
};

const modelos = ['Hilux', 'Land Cruiser', 'Corolla', 'Yaris', 'RAV4', 'Fortuner', 'SW4', 'Prado', 'Rush', 'Avanza'];
const marcas = ['Toyota', 'Lexus', 'Ford', 'Chevrolet', 'Hyundai', 'Kia', 'Nissan', 'Volkswagen', 'Mazda', 'Honda'];
const sucursales = ['La Serena — Av. Francisco de Aguirre #070', 'Ovalle — Aristía #358'];

export default function Repuestos({ footer, repuestos_hero, repuestos = [] }: { footer: any; repuestos_hero?: any; repuestos: Repuesto[] }) {
    const hero = repuestos_hero ?? {};
    const [step, setStep] = useState<SolicitudStep>('default');
    const [visible, setVisible] = useState(true);
    const [formKey, setFormKey] = useState(0);

    function goTo(next: SolicitudStep, resetForm = false) {
        setVisible(false);
        setTimeout(() => {
            if (resetForm) setFormKey(k => k + 1);
            setStep(next);
            setVisible(true);
        }, 300);
    }

    useEffect(() => {
        const html = document.documentElement;
        const prev = html.style.backgroundColor;
        html.style.backgroundColor = '#000';
        return () => { html.style.backgroundColor = prev; };
    }, []);

    return (
        <div className="min-h-screen bg-black">
            <Head title="Repuestos — Toyota Musalem" />
            <Navbar variant="white" />

            <main className="flex flex-col bg-black">

                {/* Hero */}
                <section className="bg-white pb-10 lg:pb-20">
                    <div
                        className="relative h-100 shrink-0 overflow-hidden rounded-b-[30px] lg:h-119.25"
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
                            className="absolute left-1/2 -translate-x-1/2 text-center text-[28px] leading-[110%] font-normal text-white lg:text-[48px] lg:leading-[100%]"
                            style={{
                                top: 'calc(50% + 31.5px)',
                                fontFamily: '"Toyota Type"',
                            }}
                        >
                            {hero.title || 'Repuestos'}
                        </span>
                    </div>
                </section>

                {/* Repuestos section */}
                <section className="flex flex-col items-start gap-10 bg-white px-5 py-10 lg:gap-20 lg:px-15 lg:py-20">
                    {/* Header */}
                    <div className="flex w-full flex-col items-start gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-0">
                        <h2
                            className="text-[28px] font-semibold leading-[120%] text-black lg:w-115.25 lg:text-[40px]"
                            style={{ fontFamily: '"Toyota Type"' }}
                        >
                            Repuestos
                            <br />
                            Camal Musalem
                        </h2>
                        <p
                            className="text-sm leading-[120%] text-black lg:w-130 lg:text-base"
                            style={{ fontFamily: '"Toyota Type"' }}
                        >
                            Disponemos de repuestos, accesorios y equipamiento para mantener y
                            mejorar su vehículo, con opciones en seguridad, conectividad, audio y
                            soluciones certificadas para faenas industriales y mineras.
                        </p>
                    </div>

                    {/* Grid de repuestos */}
                    <div className="flex w-full flex-col items-stretch gap-7.5 lg:items-end lg:gap-10">
                        {/* Filtros */}
                        <div className="flex w-full flex-col items-stretch gap-3 lg:w-auto lg:flex-row lg:items-center lg:gap-2.5">
                            {/* Modelo de vehículo */}
                            <div className="relative w-full lg:w-80.5">
                                <select
                                    className="h-11 w-full cursor-pointer appearance-none rounded-[60px] border border-black bg-[#EAEAF1] px-5 py-2.5 pr-10 text-base leading-none text-black outline-none"
                                    style={{ fontFamily: '"Toyota Type"' }}
                                >
                                    <option value="">Modelo de vehículo: Todos</option>
                                    {modelos.map(m => <option key={m} value={m}>Modelo de vehículo: {m}</option>)}
                                </select>
                                <svg className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2" width="6" height="10" viewBox="0 0 6 10" fill="none">
                                    <path d="M1 1L5 5L1 9" stroke="#000" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                            {/* Ordenar */}
                            <div className="relative w-full lg:w-65">
                                <select
                                    className="h-11 w-full cursor-pointer appearance-none rounded-[60px] border border-black bg-[#EAEAF1] px-5 py-2.5 pr-10 text-base leading-none text-black outline-none"
                                    style={{ fontFamily: '"Toyota Type"' }}
                                >
                                    <option value="">Ordenar:</option>
                                    <option value="menor">Menor precio</option>
                                    <option value="mayor">Mayor precio</option>
                                </select>
                                <svg className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2" width="6" height="10" viewBox="0 0 6 10" fill="none">
                                    <path d="M1 1L5 5L1 9" stroke="#000" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                        </div>

                        {/* Cards */}
                        <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {repuestos.length === 0 && (
                                <p className="col-span-full py-10 text-center text-black/50">No hay repuestos disponibles.</p>
                            )}
                            {repuestos.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex flex-col overflow-hidden rounded-[20px] border border-black/5 bg-white"
                                >
                                    {item.images?.[0] ? (
                                        <img src={item.images[0]} alt={item.name} className="aspect-3/2 w-full rounded-t-[14px] object-cover lg:aspect-auto lg:h-59.5" />
                                    ) : (
                                        <div className="aspect-3/2 w-full rounded-t-[14px] bg-gray-100 lg:aspect-auto lg:h-59.5" />
                                    )}

                                    {/* Info */}
                                    <div className="flex flex-col gap-5 px-5 py-5">
                                        <span
                                            className="line-clamp-2 px-2.5 text-base font-semibold leading-[120%] text-black lg:text-lg"
                                            style={{ fontFamily: '"Toyota Type"' }}
                                        >
                                            {item.name}
                                        </span>
                                        <div className="flex items-center justify-between gap-2 px-2.5">
                                            <span
                                                className="text-xl font-semibold uppercase leading-none text-black lg:text-2xl"
                                                style={{ fontFamily: '"Toyota Type"' }}
                                            >
                                                {item.price ?? '—'}
                                            </span>
                                            <Link href={`/post-venta/repuestos/${item.id}`} className="flex h-10 shrink-0 items-center gap-2.5 rounded-[60px] bg-black p-1 pl-3.5 transition-opacity hover:opacity-80">
                                                <span className="pb-0.5 text-sm leading-none text-white" style={{ fontFamily: '"Toyota Type Book", "Toyota Type", sans-serif' }}>
                                                    Ver más
                                                </span>
                                                <span className="flex size-7.5 items-center justify-center rounded-[60px] bg-white">
                                                    <svg width="14" height="11" viewBox="0 0 14 11" fill="none">
                                                        <path d="M0.5 5.5L13.5 5.5M13.5 5.5L8.625 10.5M13.5 5.5L8.625 0.5" stroke="black" strokeLinecap="round" strokeLinejoin="round"/>
                                                    </svg>
                                                </span>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Paginación */}
                        <div className="flex w-full items-center justify-between rounded-[60px] border border-black/20 p-2.5 lg:w-auto lg:gap-5">
                            <button className="flex size-7.5 cursor-pointer items-center justify-center rounded-[60px] opacity-40">
                                <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
                                    <path d="M7 1L1 7L7 13" stroke="#000" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </button>
                            <span className="text-sm leading-none text-black/80" style={{ fontFamily: '"Toyota Type"' }}>
                                Página 1 de 20
                            </span>
                            <button className="flex size-7.5 cursor-pointer items-center justify-center rounded-[60px]">
                                <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
                                    <path d="M1 1L7 7L1 13" stroke="#000" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Image and Card */}
                    <div className="flex w-full flex-col items-stretch gap-5 lg:flex-row">
                        <div
                            className="flex aspect-3/2 flex-1 flex-col items-start justify-end rounded-[30px] p-5 lg:aspect-auto lg:p-7.5"
                            style={{
                                background: `linear-gradient(0deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 100%), linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.20) 100%), url(${section2Img}) lightgray 50% / cover no-repeat`,
                                minHeight: '0',
                            }}
                        />
                        <div className="flex flex-1 flex-col items-start gap-5 rounded-[30px] bg-[#EAEAF1] px-5 py-7.5 lg:h-120.75 lg:gap-10 lg:px-10 lg:py-15">
                            <h3
                                className="text-2xl font-semibold leading-[120%] text-black lg:text-[32px]"
                                style={{ fontFamily: '"Toyota Type"' }}
                            >
                                Encargo
                                <br />
                                de repuestos
                            </h3>
                            <div className="self-stretch text-sm leading-[120%] text-black lg:text-base">
                                Solicitamos el repuesto que necesites
                                <br />
                                <br />
                                Si el repuesto no se encuentra disponible en nuestras dependencias,
                                lo gestionamos directamente con las bodegas centrales de Toyota.
                                El plazo de llegada es de 24 horas hábiles, con un abono mínimo del
                                50% del valor del repuesto.
                                También ofrecemos despacho a domicilio o a la oficina de transportes
                                que el cliente indique.
                            </div>
                            <p className="text-xs leading-[120%] text-black">
                                Pedidos después de las 16:00 horas se consideran para la solicitud del
                                día siguiente.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Solicitud de encargo */}
                <section className="bg-white px-5 py-10 lg:px-15 lg:py-20">
                    <div className="rounded-[30px] bg-[#EAEAF1] p-5 lg:p-15">
                        <div
                            className="transition-opacity duration-300"
                            style={{ opacity: visible ? 1 : 0 }}
                        >
                            {/* Estado default */}
                            {step === 'default' && (
                                <div className="flex w-full flex-col items-start gap-7.5 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
                                    <div className="flex shrink-0 flex-col items-start justify-center gap-5 lg:gap-10">
                                        <h2
                                            className="text-[28px] font-semibold leading-[120%] text-black lg:text-[40px]"
                                            style={{ fontFamily: '"Toyota Type"' }}
                                        >
                                            Solicitud de encargo
                                            <br />
                                            de repuestos
                                        </h2>
                                        <p className="text-sm leading-[120%] text-black lg:w-130 lg:text-base">
                                            Ahorra tiempo cotizando sus repuestos aquí mismo. Después de enviar el
                                            formulario, nos pondremos en contacto para entregarle información.
                                        </p>
                                        <button
                                            onClick={() => goTo('form')}
                                            className="flex h-12 w-full cursor-pointer items-center justify-center gap-2.5 rounded-[60px] bg-black px-8 text-base leading-[120%] text-white lg:w-auto lg:px-5"
                                        >
                                            Solicitar repuestos
                                        </button>
                                    </div>
                                    <div
                                        className="relative flex aspect-square w-full shrink-0 flex-col items-start justify-end overflow-hidden rounded-[30px] p-3 lg:size-140 lg:aspect-auto lg:p-7.5"
                                        style={{ background: `url(${section3Img}) center / cover no-repeat` }}
                                    >
                                        <div
                                            className="flex w-full flex-col gap-4 rounded-2xl p-5 lg:w-92.25"
                                            style={{
                                                background: 'linear-gradient(to left, rgba(0,0,0,0.2), rgba(0,0,0,0.2))',
                                                backdropFilter: 'blur(30px)',
                                            }}
                                        >
                                            <span className="text-xl font-semibold uppercase leading-none text-white" style={{ fontFamily: '"Toyota Type"' }}>
                                                Horario de atención
                                            </span>
                                            <div className="flex h-3.5 items-center justify-between self-stretch text-sm leading-none text-white">
                                                <span>Lunes a Viernes</span>
                                                <span>09:00 a 13:30 - 14:45 a 18:30</span>
                                            </div>
                                            <div className="flex h-3.5 items-center justify-between self-stretch text-sm leading-none text-white">
                                                <span>Domingo</span>
                                                <span>Cerrado</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Estado form */}
                            {step === 'form' && (
                                <div key={formKey} className="flex flex-col items-end gap-7.5 lg:gap-10">
                                    {/* Breadcrumb */}
                                    <div className="flex w-full items-center">
                                        <div className="flex h-10 flex-1 items-center justify-center rounded-[60px] bg-black px-5 lg:h-12">
                                            <span className="text-sm leading-[120%] text-white lg:text-base">Solicitud de repuestos</span>
                                        </div>
                                    </div>

                                    {/* Campos */}
                                    <div className="flex w-full flex-col gap-5">
                                        <h3 className="text-xl font-semibold leading-[120%] text-black lg:text-2xl" style={{ fontFamily: '"Toyota Type"' }}>
                                            Solicitud de repuestos
                                        </h3>
                                        <div className="flex flex-col gap-5 lg:flex-row lg:gap-10">
                                            {/* Columna izquierda */}
                                            <div className="flex flex-1 flex-col gap-5">
                                                <div className="flex flex-col gap-2.5">
                                                    <label className="text-sm leading-none text-black">Nombre completo</label>
                                                    <input
                                                        type="text"
                                                        placeholder="Nombre completo"
                                                        className="h-10 w-full rounded-[60px] bg-white px-5 text-sm text-black/60 outline-none"
                                                    />
                                                </div>
                                                <div className="flex flex-col gap-2.5">
                                                    <label className="text-sm leading-none text-black">Teléfono</label>
                                                    <input
                                                        type="text"
                                                        placeholder="+569"
                                                        className="h-10 w-full rounded-[60px] bg-white px-5 text-sm text-black/60 outline-none"
                                                    />
                                                </div>
                                                <div className="flex flex-col gap-2.5">
                                                    <label className="text-sm leading-none text-black">Modelo del vehículo</label>
                                                    <div className="relative">
                                                        <select className="h-10 w-full cursor-pointer appearance-none rounded-[60px] bg-white px-5 pr-10 text-sm text-black/60 outline-none">
                                                            <option value="">Modelo del vehículo</option>
                                                            {modelos.map(m => <option key={m} value={m}>{m}</option>)}
                                                        </select>
                                                        <svg className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2" width="6" height="10" viewBox="0 0 6 10" fill="none">
                                                            <path d="M1 1L5 5L1 9" stroke="#000" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Columna derecha */}
                                            <div className="flex flex-1 flex-col gap-5">
                                                <div className="flex flex-col gap-2.5">
                                                    <label className="text-sm leading-none text-black">Email</label>
                                                    <input
                                                        type="email"
                                                        placeholder="Correo electrónico"
                                                        className="h-10 w-full rounded-[60px] bg-white px-5 text-sm text-black/60 outline-none"
                                                    />
                                                </div>
                                                <div className="flex flex-col gap-2.5">
                                                    <label className="text-sm leading-none text-black">Sucursal</label>
                                                    <div className="relative">
                                                        <select className="h-10 w-full cursor-pointer appearance-none rounded-[60px] bg-white px-5 pr-10 text-sm text-black/60 outline-none">
                                                            <option value="">Selecciona la sucursal con la que te quieres comunicar</option>
                                                            {sucursales.map(s => <option key={s} value={s}>{s}</option>)}
                                                        </select>
                                                        <svg className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2" width="6" height="10" viewBox="0 0 6 10" fill="none">
                                                            <path d="M1 1L5 5L1 9" stroke="#000" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col gap-2.5">
                                                    <label className="text-sm leading-none text-black">Marca</label>
                                                    <div className="relative">
                                                        <select className="h-10 w-full cursor-pointer appearance-none rounded-[60px] bg-white px-5 pr-10 text-sm text-black/60 outline-none">
                                                            <option value="">Marca</option>
                                                            {marcas.map(m => <option key={m} value={m}>{m}</option>)}
                                                        </select>
                                                        <svg className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2" width="6" height="10" viewBox="0 0 6 10" fill="none">
                                                            <path d="M1 1L5 5L1 9" stroke="#000" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Vin o Chasis — full width */}
                                        <div className="flex flex-col gap-2.5">
                                            <label className="text-sm leading-none text-black">Vin o Chasis</label>
                                            <input
                                                type="text"
                                                placeholder="Vin o Chasis"
                                                className="h-10 w-full rounded-[60px] bg-white px-5 text-sm text-black/60 outline-none"
                                            />
                                        </div>

                                        {/* Textarea */}
                                        <div className="flex flex-col gap-2.5">
                                            <label className="text-sm leading-none text-black">Lista de repuestos</label>
                                            <textarea
                                                placeholder="Escribe aquí la lista de repuestos que quieres cotizar o solicitar"
                                                className="h-[114px] w-full resize-none rounded-[20px] bg-white p-5 text-sm text-black/60 outline-none"
                                            />
                                        </div>

                                        {/* Checkbox */}
                                        <label className="flex cursor-pointer items-center gap-2.5">
                                            <input type="checkbox" className="size-[18px] shrink-0 cursor-pointer appearance-none rounded border border-black bg-[#EAEAF1] checked:bg-[#EAEAF1] checked:bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%2012%2010%22%20fill%3D%22none%22%3E%3Cpath%20d%3D%22M1%205l3.5%203.5L11%201%22%20stroke%3D%22%23000%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] checked:bg-center checked:bg-no-repeat" />
                                            <span className="text-sm leading-none text-black">He leído y acepto la política de privacidad de mis datos personales.</span>
                                        </label>
                                    </div>

                                    {/* Botón enviar */}
                                    <button
                                        onClick={() => goTo('success')}
                                        className="flex h-12 w-full cursor-pointer items-center justify-center rounded-[60px] bg-black text-base leading-[120%] text-white lg:w-50"
                                    >
                                        Enviar solicitud
                                    </button>
                                </div>
                            )}

                            {/* Estado success */}
                            {step === 'success' && (
                                <div className="flex w-full items-center justify-center">
                                    <div className="flex flex-col items-center gap-7.5 lg:gap-10">
                                        <h3 className="text-2xl font-semibold leading-[120%] text-black" style={{ fontFamily: '"Toyota Type"' }}>
                                            Solicitud enviada
                                        </h3>
                                        <p className="text-center text-sm leading-[120%] text-black lg:w-92 lg:text-base">
                                            Un asesor de servicio se comunicará con usted dentro de las próximas 48 horas.
                                        </p>
                                        <div className="flex w-full flex-col items-stretch gap-3 lg:w-auto lg:gap-5">
                                            <a
                                                href="/"
                                                className="flex h-12 items-center justify-center rounded-[60px] bg-black px-8 text-base leading-[120%] text-white lg:px-15"
                                            >
                                                Volver a inicio
                                            </a>
                                            <button
                                                onClick={() => goTo('form', true)}
                                                className="flex h-12 cursor-pointer items-center justify-center rounded-[60px] border border-black bg-transparent px-8 text-base leading-[120%] text-black lg:px-15"
                                            >
                                                Enviar otra solicitud
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </section>


                <ContactCtaBanner image={ctaImg} />
                <BranchesSection image1={visitanos1} image2={visitanos2} />

            </main>

            <div className="bg-black">
                <Footer data={footer} />
            </div>
        </div>
    );
}
