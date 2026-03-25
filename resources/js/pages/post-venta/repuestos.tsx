import { Head } from '@inertiajs/react';
import { Footer } from '@/components/landing/footer';
import { Navbar } from '@/components/landing/navbar';
import { ContactCta } from '@/components/landing/contact-cta';
import { BranchesSection } from '@/components/landing/branches-section';
import { useEffect, useState } from 'react';
import heroImg from '@images/repuestos/hero_image.png?format=webp';
import section2Img from '@images/repuestos/image_section2.jpg?format=webp';
import section3Img from '@images/repuestos/image_section3.jpg?format=webp';
import ctaImg from '@images/seminuevos/ejemplo-video.png?format=webp';
import visitanos1 from '@images/seminuevos/visitanos_1.png?format=webp';
import visitanos2 from '@images/seminuevos/visitanos_2.png?format=webp';


type SolicitudStep = 'default' | 'form' | 'success';

const modelos = ['Hilux', 'Land Cruiser', 'Corolla', 'Yaris', 'RAV4', 'Fortuner', 'SW4', 'Prado', 'Rush', 'Avanza'];
const marcas = ['Toyota', 'Lexus', 'Ford', 'Chevrolet', 'Hyundai', 'Kia', 'Nissan', 'Volkswagen', 'Mazda', 'Honda'];

export default function Repuestos({ footer }: { footer: any }) {
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
                            Repuestos
                        </span>
                    </div>
                </section>

                {/* Repuestos section */}
                <section className="flex flex-col items-start gap-20 bg-white px-15 py-20">
                    {/* Header */}
                    <div className="flex w-full flex-row items-end justify-between">
                        <h2
                            className="w-[461px] text-[40px] font-semibold leading-[120%] text-black"
                            style={{ fontFamily: '"Toyota Type"' }}
                        >
                            Repuestos
                            <br />
                            Camal Musalem
                        </h2>
                        <p
                            className="w-[520px] text-base leading-[120%] text-black"
                            style={{ fontFamily: '"Toyota Type"' }}
                        >
                            Disponemos de repuestos, accesorios y equipamiento para mantener y
                            mejorar su vehículo, con opciones en seguridad, conectividad, audio y
                            soluciones certificadas para faenas industriales y mineras.
                        </p>
                    </div>

                    {/* Image and Card */}
                    <div className="flex w-full flex-row items-stretch gap-5">
                        <div
                            className="flex flex-1 flex-col items-start justify-end rounded-[30px] p-[30px]"
                            style={{
                                background: `linear-gradient(0deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 100%), linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.20) 100%), url(${section2Img}) lightgray 50% / cover no-repeat`,
                                minHeight: '483px',
                            }}
                        />
                        <div className="flex h-[483px] flex-1 flex-col items-start gap-10 rounded-[30px] bg-[#EAEAF1] px-10 py-15">
                            <h3
                                className="text-[32px] font-semibold leading-[120%] text-black"
                                style={{ fontFamily: '"Toyota Type"' }}
                            >
                                Encargo
                                <br />
                                de repuestos
                            </h3>
                            <div className="self-stretch text-base leading-[120%] text-black">
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
                <section className="bg-white px-15 py-20">
                    <div className="rounded-[30px] bg-[#EAEAF1] p-15">
                        <div
                            className="transition-opacity duration-300"
                            style={{ opacity: visible ? 1 : 0 }}
                        >
                            {/* Estado default */}
                            {step === 'default' && (
                                <div className="flex w-full flex-row items-center justify-between">
                                    <div className="flex shrink-0 flex-col items-start justify-center gap-10">
                                        <h2
                                            className="text-[40px] font-semibold leading-[120%] text-black"
                                            style={{ fontFamily: '"Toyota Type"' }}
                                        >
                                            Solicitud de encargo
                                            <br />
                                            de repuestos
                                        </h2>
                                        <p className="w-[520px] text-base leading-[120%] text-black">
                                            Ahorra tiempo cotizando sus repuestos aquí mismo. Después de enviar el
                                            formulario, nos pondremos en contacto para entregarle información.
                                        </p>
                                        <button
                                            onClick={() => goTo('form')}
                                            className="flex h-12 cursor-pointer items-center gap-2.5 rounded-[60px] bg-black px-5 text-base leading-[120%] text-white"
                                        >
                                            Solicitar repuestos
                                        </button>
                                    </div>
                                    <div
                                        className="relative flex size-[560px] shrink-0 flex-col items-start justify-end overflow-hidden rounded-[30px] p-[30px]"
                                        style={{ background: `url(${section3Img}) center / cover no-repeat` }}
                                    >
                                        <div
                                            className="flex w-[369px] flex-col gap-4 rounded-2xl p-5"
                                            style={{
                                                background: 'linear-gradient(to left, rgba(0,0,0,0.2), rgba(0,0,0,0.2))',
                                                backdropFilter: 'blur(30px)',
                                            }}
                                        >
                                            <span className="text-xl font-semibold uppercase leading-none text-white" style={{ fontFamily: '"Toyota Type"' }}>
                                                Horario de atención
                                            </span>
                                            <div className="flex items-center justify-between text-sm leading-none text-white">
                                                <span>Lunes a Viernes</span>
                                                <span>09:00 a 13:30 - 14:45 a 18:30</span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm leading-none text-white">
                                                <span>Domingo</span>
                                                <span>Cerrado</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Estado form */}
                            {step === 'form' && (
                                <div key={formKey} className="flex flex-col items-end gap-10">
                                    {/* Breadcrumb */}
                                    <div className="flex w-full items-center">
                                        <div className="flex h-12 flex-1 items-center justify-center rounded-[60px] bg-black px-5">
                                            <span className="text-base leading-[120%] text-white">Solicitud de repuestos</span>
                                        </div>
                                    </div>

                                    {/* Campos */}
                                    <div className="flex w-full flex-col gap-5">
                                        <h3 className="text-2xl font-semibold leading-[120%] text-black" style={{ fontFamily: '"Toyota Type"' }}>
                                            Solicitud de repuestos
                                        </h3>
                                        <div className="flex gap-10">
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
                                                    <select className="h-10 w-full appearance-none rounded-[60px] bg-white px-5 text-sm text-black/60 outline-none">
                                                        <option value="">Modelo del vehículo</option>
                                                        {modelos.map(m => <option key={m} value={m}>{m}</option>)}
                                                    </select>
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
                                                    <label className="text-sm leading-none text-black">Marca</label>
                                                    <select className="h-10 w-full appearance-none rounded-[60px] bg-white px-5 text-sm text-black/60 outline-none">
                                                        <option value="">Marca</option>
                                                        {marcas.map(m => <option key={m} value={m}>{m}</option>)}
                                                    </select>
                                                </div>
                                                <div className="flex flex-col gap-2.5">
                                                    <label className="text-sm leading-none text-black">Vin o Chasis</label>
                                                    <input
                                                        type="text"
                                                        placeholder="Vin o Chasis"
                                                        className="h-10 w-full rounded-[60px] bg-white px-5 text-sm text-black/60 outline-none"
                                                    />
                                                </div>
                                            </div>
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
                                            <input type="checkbox" className="size-[18px] shrink-0 cursor-pointer appearance-none rounded border border-black bg-white checked:bg-white checked:bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%2012%2010%22%20fill%3D%22none%22%3E%3Cpath%20d%3D%22M1%205l3.5%203.5L11%201%22%20stroke%3D%22%23000%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] checked:bg-center checked:bg-no-repeat" />
                                            <span className="text-sm leading-none text-black">He leído y acepto la política de privacidad de mis datos personales.</span>
                                        </label>
                                    </div>

                                    {/* Botón enviar */}
                                    <button
                                        onClick={() => goTo('success')}
                                        className="flex h-12 w-[200px] cursor-pointer items-center justify-center rounded-[60px] bg-black text-base leading-[120%] text-white"
                                    >
                                        Enviar solicitud
                                    </button>
                                </div>
                            )}

                            {/* Estado success */}
                            {step === 'success' && (
                                <div className="flex w-full items-center justify-center">
                                    <div className="flex flex-col items-center gap-10">
                                        <h3 className="text-2xl font-semibold leading-[120%] text-black" style={{ fontFamily: '"Toyota Type"' }}>
                                            Solicitud enviada
                                        </h3>
                                        <p className="w-[368px] text-center text-base leading-[120%] text-black">
                                            Un asesor de servicio se comunicará con usted dentro de las próximas 48 horas.
                                        </p>
                                        <div className="flex flex-col gap-5">
                                            <a
                                                href="/"
                                                className="flex h-12 items-center justify-center rounded-[60px] bg-black px-15 text-base leading-[120%] text-white"
                                            >
                                                Volver a inicio
                                            </a>
                                            <button
                                                onClick={() => goTo('form', true)}
                                                className="flex h-12 cursor-pointer items-center justify-center rounded-[60px] border border-black bg-transparent px-15 text-base leading-[120%] text-black"
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


                <ContactCta backgroundImage={ctaImg} />
                <BranchesSection image1={visitanos1} image2={visitanos2} />

            </main>

            <div className="bg-black">
                <Footer data={footer} />
            </div>
        </div>
    );
}
