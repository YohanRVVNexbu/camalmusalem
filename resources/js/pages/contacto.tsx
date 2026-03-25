import { Head } from '@inertiajs/react';
import { Footer } from '@/components/landing/footer';
import { Navbar } from '@/components/landing/navbar';
import { BranchesSection } from '@/components/landing/branches-section';
import { useEffect } from 'react';
import visitanos1 from '@images/seminuevos/visitanos_1.png?format=webp';
import visitanos2 from '@images/seminuevos/visitanos_2.png?format=webp';
import formImg from '@images/contacto/form_image.png?format=webp';

export default function Contacto({ footer }: { footer: any }) {
    useEffect(() => {
        const html = document.documentElement;
        const prev = html.style.backgroundColor;
        html.style.backgroundColor = '#000';
        return () => { html.style.backgroundColor = prev; };
    }, []);

    return (
        <div className="min-h-screen bg-black">
            <Head title="Contacto — Toyota Musalem" />
            <Navbar variant="white" />

            <main className="flex flex-col bg-black">

                {/* Hero + Form */}
                <section className="px-15 pb-20 pt-32" style={{ background: 'linear-gradient(180deg, #000000 0%, #ffffff 100%)' }}>
                    <div className="flex overflow-hidden rounded-[30px] shadow-2xl">

                        {/* Left: Image */}
                        <div
                            className="flex shrink-0 flex-col items-stretch justify-end gap-2.5 pb-15 pl-7.5 pr-7.5 pt-7.5"
                            style={{
                                width: '50%',
                                height: '860px',
                                background: `url(${formImg}) lightgray -41.714px -299.096px / 111.496% 134.746% no-repeat`,
                            }}
                        >
                            {/* Horario de atención */}
                            <div
                                className="flex flex-col gap-2.5 items-start justify-center self-stretch overflow-hidden rounded-2xl p-5"
                                style={{ background: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(30px)' }}
                            >
                                <div className="flex flex-col gap-4 items-start self-stretch">
                                    <span className="text-xl font-semibold uppercase leading-none text-white" style={{ fontFamily: '"Toyota Type"' }}>
                                        Horario de atención
                                    </span>
                                    <div className="flex items-center justify-between self-stretch h-3.5">
                                        <span className="text-sm leading-none text-white" style={{ fontFamily: '"Toyota Type"' }}>Lunes a Viernes</span>
                                        <span className="text-sm leading-none text-white" style={{ fontFamily: '"Toyota Type"' }}>09:00 a 13:30 - 14:45 a 18:30</span>
                                    </div>
                                    <div className="flex items-center justify-between self-stretch h-3.5">
                                        <span className="text-sm leading-none text-white" style={{ fontFamily: '"Toyota Type"' }}>Domingo</span>
                                        <span className="text-sm leading-none text-white" style={{ fontFamily: '"Toyota Type"' }}>Cerrado</span>
                                    </div>
                                </div>
                            </div>

                            {/* Contacto directo */}
                            <div
                                className="flex flex-col gap-2.5 items-start justify-center self-stretch overflow-hidden rounded-2xl p-5"
                                style={{ background: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(30px)' }}
                            >
                                <div className="flex flex-col gap-4 items-start self-stretch">
                                    <span className="text-xl font-semibold uppercase leading-none text-white" style={{ fontFamily: '"Toyota Type"' }}>
                                        Contacto directo
                                    </span>
                                    <div className="flex items-center justify-between self-stretch h-3.5">
                                        <span className="text-sm leading-none text-white" style={{ fontFamily: '"Toyota Type"' }}>Correo electrónico</span>
                                        <span className="text-sm leading-none text-white" style={{ fontFamily: '"Toyota Type"' }}>info@camalmusalem.cl</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right: Form */}
                        <div className="flex flex-1 flex-col items-start justify-center gap-2.5 overflow-hidden bg-[#EAEAF1] px-10 pb-2.5 pt-20">
                            <div className="flex w-full flex-col gap-10 items-end justify-center">
                                <div className="flex w-full flex-col gap-5 items-start">

                                    {/* Header text */}
                                    <div className="flex flex-col gap-5 items-start self-stretch">
                                        <h1
                                            className="text-[24px] font-semibold leading-[120%] text-black"
                                            style={{ fontFamily: '"Toyota Type"' }}
                                        >
                                            Contacto
                                        </h1>
                                        <p
                                            className="text-lg leading-[120%] text-black"
                                            style={{ fontFamily: '"Toyota Type"' }}
                                        >
                                            ¿En qué te podemos ayudar?
                                        </p>
                                        <p
                                            className="text-base leading-[120%] text-black"
                                            style={{ fontFamily: '"Toyota Type"' }}
                                        >
                                            Completa el formulario y nuestro equipo se pondrá en contacto contigo a la brevedad.
                                        </p>
                                    </div>

                                    {/* Form fields */}
                                    <div className="flex w-full flex-col gap-5 items-start self-stretch">

                                        {/* Nombre completo */}
                                        <div className="flex w-full flex-col gap-2.5 items-start self-stretch">
                                            <label
                                                className="text-sm leading-none text-black"
                                                style={{ fontFamily: '"Toyota Type"' }}
                                            >
                                                Nombre completo
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Ingresa tu nombre completo"
                                                className="h-10 w-full rounded-[60px] border border-transparent bg-white px-5 text-sm leading-none text-black placeholder-black/60 outline-none"
                                                style={{ fontFamily: '"Toyota Type"' }}
                                            />
                                        </div>

                                        {/* Asunto */}
                                        <div className="flex w-full flex-col gap-2.5 items-start self-stretch">
                                            <label
                                                className="text-sm leading-none text-black"
                                                style={{ fontFamily: '"Toyota Type"' }}
                                            >
                                                Asunto
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Escribe el motivo de tu consulta"
                                                className="h-10 w-full rounded-[60px] border border-transparent bg-white px-5 text-sm leading-none text-black placeholder-black/60 outline-none"
                                                style={{ fontFamily: '"Toyota Type"' }}
                                            />
                                        </div>

                                        {/* Email + Teléfono */}
                                        <div className="flex w-full flex-row gap-5 items-center self-stretch">
                                            <div className="flex flex-1 flex-col gap-2.5 items-start">
                                                <label
                                                    className="text-sm leading-none text-black"
                                                    style={{ fontFamily: '"Toyota Type"' }}
                                                >
                                                    Email
                                                </label>
                                                <input
                                                    type="email"
                                                    placeholder="Correo electrónico"
                                                    className="h-10 w-full rounded-[60px] border border-transparent bg-white px-5 text-sm leading-none text-black placeholder-black/60 outline-none"
                                                    style={{ fontFamily: '"Toyota Type"' }}
                                                />
                                            </div>
                                            <div className="flex flex-1 flex-col gap-2.5 items-start">
                                                <label
                                                    className="text-sm leading-none text-black"
                                                    style={{ fontFamily: '"Toyota Type"' }}
                                                >
                                                    Teléfono
                                                </label>
                                                <input
                                                    type="tel"
                                                    placeholder="+569"
                                                    className="h-10 w-full rounded-[60px] border border-transparent bg-white px-5 text-sm leading-none text-black placeholder-black/60 outline-none"
                                                    style={{ fontFamily: '"Toyota Type"' }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Mensaje */}
                                    <div className="flex w-full flex-col gap-2.5 items-start self-stretch">
                                        <label
                                            className="text-sm leading-none text-black"
                                            style={{ fontFamily: '"Toyota Type"' }}
                                        >
                                            Mensaje
                                        </label>
                                        <textarea
                                            placeholder="Cuéntanos en qué podemos ayudarte"
                                            rows={5}
                                            className="h-28.5 w-full resize-none rounded-[20px] border border-transparent bg-white p-5 text-sm leading-none text-black placeholder-black/60 outline-none"
                                            style={{ fontFamily: '"Toyota Type"' }}
                                        />
                                    </div>

                                    {/* Checkbox */}
                                    <div className="flex flex-row gap-2.5 items-center">
                                        <input
                                            type="checkbox"
                                            className="size-4.5 shrink-0 appearance-none rounded border border-black/80 bg-[#EAEAF1] checked:bg-white checked:bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20d%3D%22M2%206l3%203%205-5%22%20stroke%3D%22%23000%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20fill%3D%22none%22%2F%3E%3C%2Fsvg%3E')] checked:bg-center checked:bg-no-repeat"
                                        />
                                        <span
                                            className="text-sm leading-none text-black"
                                            style={{ fontFamily: '"Toyota Type"' }}
                                        >
                                            He leído y acepto la política de privacidad de mis datos personales.
                                        </span>
                                    </div>
                                </div>

                                {/* Submit button */}
                                <button
                                    type="button"
                                    className="flex h-12 w-50 items-center justify-center rounded-[60px] bg-black px-5"
                                >
                                    <span
                                        className="text-base leading-none text-white"
                                        style={{ fontFamily: '"Toyota Type"' }}
                                    >
                                        Enviar solicitud
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                <BranchesSection
                    image1={visitanos1}
                    image2={visitanos2}
                    title="Contacto Sucursales"
                    backgroundStyle="linear-gradient(180deg, #ffffff 0%, #000000 90%)"
                    textColor="text-black"
                />

            </main>

            <div className="bg-black">
                <Footer data={footer} />
            </div>
        </div>
    );
}
