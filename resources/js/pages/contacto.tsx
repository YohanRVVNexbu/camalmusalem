import { Head, useForm, usePage } from '@inertiajs/react';
import { Footer } from '@/components/landing/footer';
import { Navbar } from '@/components/landing/navbar';
import { BranchesSection } from '@/components/landing/branches-section';
import { useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { pickResponsiveImage } from '@/lib/media';
import { formatRut, isValidRut } from '@/lib/rut';
import { formatTelefono, isValidTelefono } from '@/lib/format';
import { toast } from 'sonner';
import formImgDefault from '@images/contacto/form_image.png?format=webp';

export default function Contacto({ footer, contacto_info }: { footer: any | null; contacto_info?: any | null }) {
    const info = contacto_info ?? {};
    const { horariosAtencion } = usePage<{ horariosAtencion?: { label: string; value: string }[] }>().props;
    const horarios = horariosAtencion ?? [];
    const isMobile = useIsMobile();
    const formImg = pickResponsiveImage(info.form_image, info.form_image_mobile, isMobile) || formImgDefault;
    const { flash } = usePage<{ flash: { success?: string; error?: string } }>().props;

    const { data, setData, post, processing, errors, reset } = useForm({
        nombre: '',
        asunto: '',
        email: '',
        telefono: '',
        rut: '',
        mensaje: '',
        privacidad: false,
        _website: '', // honeypot — debe quedar vacío
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/contacto', {
            onSuccess: () => {
                reset();
                toast.success('¡Mensaje enviado! Nos pondremos en contacto contigo a la brevedad.');
            },
            onError: () => toast.error('Por favor revisa los campos e inténtalo nuevamente.'),
        });
    };

    useEffect(() => {
        if (flash?.error) toast.error(flash.error);
    }, [flash?.error]);

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
                {contacto_info && (
                <section className="pb-10 lg:px-15 lg:pb-20 lg:pt-32" style={{ background: 'linear-gradient(180deg, #000000 0%, #ffffff 100%)' }}>
                    <div className="flex flex-col overflow-hidden shadow-2xl lg:flex-row lg:rounded-[30px]">

                        {/* Left: Image */}
                        <div
                            className="flex aspect-3/4 w-full shrink-0 flex-col items-stretch justify-end gap-2 p-3 lg:aspect-auto lg:h-215 lg:w-1/2 lg:gap-2.5 lg:px-7.5 lg:pt-7.5 lg:pb-15"
                            style={{
                                background: `url(${formImg}) lightgray center / cover no-repeat`,
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
                                    {horarios.map((h, i) => (
                                        <div key={i} className="flex items-center justify-between gap-3 self-stretch">
                                            <span className="text-sm leading-none text-white" style={{ fontFamily: '"Toyota Type"' }}>{h.label}</span>
                                            <span className="text-sm leading-none text-white text-right" style={{ fontFamily: '"Toyota Type"' }}>{h.value}</span>
                                        </div>
                                    ))}
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
                                    <div className="flex h-3.5 items-center justify-between self-stretch">
                                        <span className="text-sm leading-none text-white" style={{ fontFamily: '"Toyota Type"' }}>Correo electrónico</span>
                                        <span className="text-sm leading-none text-white" style={{ fontFamily: '"Toyota Type"' }}>{info.email ?? 'info@camalmusalem.cl'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right: Form */}
                        <form onSubmit={submit} className="flex flex-1 flex-col items-start justify-center gap-2.5 overflow-hidden bg-[#EAEAF1] px-5 py-7.5 lg:px-10 lg:pt-20 lg:pb-2.5">
                            <div className="flex w-full flex-col gap-10 items-end justify-center">
                                <div className="flex w-full flex-col gap-5 items-start">

                                    {/* Header text */}
                                    <div className="flex flex-col gap-3 items-start self-stretch lg:gap-5">
                                        <h1
                                            className="text-2xl font-semibold leading-[120%] text-black lg:text-[24px]"
                                            style={{ fontFamily: '"Toyota Type"' }}
                                        >
                                            {info.form_title ?? 'Contacto'}
                                        </h1>
                                        <p
                                            className="text-base leading-[120%] text-black lg:text-lg"
                                            style={{ fontFamily: '"Toyota Type"' }}
                                        >
                                            {info.form_subtitle ?? '¿En qué te podemos ayudar?'}
                                        </p>
                                        <p
                                            className="text-sm leading-[120%] text-black lg:text-base"
                                            style={{ fontFamily: '"Toyota Type"' }}
                                        >
                                            {info.form_desc ?? 'Completa el formulario y nuestro equipo se pondrá en contacto contigo a la brevedad.'}
                                        </p>
                                    </div>

                                    {/* Honeypot — invisible para humanos, bots lo rellenan */}
                                    <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }}>
                                        <label htmlFor="_website">No rellenar</label>
                                        <input
                                            id="_website"
                                            type="text"
                                            name="_website"
                                            value={data._website}
                                            onChange={(e) => setData('_website', e.target.value)}
                                            tabIndex={-1}
                                            autoComplete="off"
                                        />
                                    </div>

                                    {/* Form fields */}
                                    <div className="flex w-full flex-col gap-5 items-start self-stretch">

                                        {/* Nombre completo */}
                                        <div className="flex w-full flex-col gap-2.5 items-start self-stretch">
                                            <label className="text-sm leading-none text-black" style={{ fontFamily: '"Toyota Type"' }}>
                                                Nombre completo
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Ingresa tu nombre completo"
                                                value={data.nombre}
                                                onChange={(e) => setData('nombre', e.target.value)}
                                                required
                                                className="h-10 w-full rounded-[60px] border border-transparent bg-white px-5 text-sm leading-none text-black placeholder-black/60 outline-none"
                                                style={{ fontFamily: '"Toyota Type"' }}
                                            />
                                            {errors.nombre && <span className="text-xs text-red-500">{errors.nombre}</span>}
                                        </div>

                                        {/* Asunto */}
                                        <div className="flex w-full flex-col gap-2.5 items-start self-stretch">
                                            <label className="text-sm leading-none text-black" style={{ fontFamily: '"Toyota Type"' }}>
                                                Asunto
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Escribe el motivo de tu consulta"
                                                value={data.asunto}
                                                onChange={(e) => setData('asunto', e.target.value)}
                                                required
                                                className="h-10 w-full rounded-[60px] border border-transparent bg-white px-5 text-sm leading-none text-black placeholder-black/60 outline-none"
                                                style={{ fontFamily: '"Toyota Type"' }}
                                            />
                                            {errors.asunto && <span className="text-xs text-red-500">{errors.asunto}</span>}
                                        </div>

                                        {/* Email + Teléfono */}
                                        <div className="flex w-full flex-col gap-5 self-stretch lg:flex-row lg:items-center">
                                            <div className="flex flex-1 flex-col gap-2.5 items-start">
                                                <label className="text-sm leading-none text-black" style={{ fontFamily: '"Toyota Type"' }}>
                                                    Email
                                                </label>
                                                <input
                                                    type="email"
                                                    placeholder="Correo electrónico"
                                                    value={data.email}
                                                    onChange={(e) => setData('email', e.target.value)}
                                                    required
                                                    className="h-10 w-full rounded-[60px] border border-transparent bg-white px-5 text-sm leading-none text-black placeholder-black/60 outline-none"
                                                    style={{ fontFamily: '"Toyota Type"' }}
                                                />
                                                {errors.email && <span className="text-xs text-red-500">{errors.email}</span>}
                                            </div>
                                            <div className="flex flex-1 flex-col gap-2.5 items-start">
                                                <label className="text-sm leading-none text-black" style={{ fontFamily: '"Toyota Type"' }}>
                                                    Teléfono
                                                </label>
                                                <input
                                                    type="tel"
                                                    placeholder="+56 9 1234 5678"
                                                    value={data.telefono}
                                                    onChange={(e) => setData('telefono', formatTelefono(e.target.value))}
                                                    className="h-10 w-full rounded-[60px] border border-transparent bg-white px-5 text-sm leading-none text-black placeholder-black/60 outline-none"
                                                    style={{ fontFamily: '"Toyota Type"' }}
                                                />
                                                {data.telefono && !isValidTelefono(data.telefono) && (
                                                    <span className="text-xs text-red-500">Ingresa un teléfono válido (ej: +56 9 1234 5678).</span>
                                                )}
                                                {errors.telefono && <span className="text-xs text-red-500">{errors.telefono}</span>}
                                            </div>
                                        </div>

                                        {/* RUT */}
                                        <div className="flex w-full flex-col gap-2.5 items-start self-stretch">
                                            <label className="text-sm leading-none text-black" style={{ fontFamily: '"Toyota Type"' }}>
                                                RUT
                                            </label>
                                            <input
                                                type="text"
                                                inputMode="text"
                                                placeholder="12.345.678-9"
                                                value={data.rut}
                                                onChange={(e) => setData('rut', formatRut(e.target.value))}
                                                maxLength={12}
                                                required
                                                className="h-10 w-full rounded-[60px] border border-transparent bg-white px-5 text-sm leading-none text-black placeholder-black/60 outline-none"
                                                style={{ fontFamily: '"Toyota Type"' }}
                                            />
                                            {data.rut && !isValidRut(data.rut) && (
                                                <span className="text-xs text-red-500">Ingresa un RUT válido (ej: 12.345.678-9).</span>
                                            )}
                                            {errors.rut && <span className="text-xs text-red-500">{errors.rut}</span>}
                                        </div>
                                    </div>

                                    {/* Mensaje */}
                                    <div className="flex w-full flex-col gap-2.5 items-start self-stretch">
                                        <label className="text-sm leading-none text-black" style={{ fontFamily: '"Toyota Type"' }}>
                                            Mensaje
                                        </label>
                                        <textarea
                                            placeholder="Cuéntanos en qué podemos ayudarte"
                                            rows={5}
                                            value={data.mensaje}
                                            onChange={(e) => setData('mensaje', e.target.value)}
                                            required
                                            className="h-28.5 w-full resize-none rounded-[20px] border border-transparent bg-white p-5 text-sm leading-none text-black placeholder-black/60 outline-none"
                                            style={{ fontFamily: '"Toyota Type"' }}
                                        />
                                        {errors.mensaje && <span className="text-xs text-red-500">{errors.mensaje}</span>}
                                    </div>

                                    {/* Checkbox */}
                                    <div className="flex flex-row gap-2.5 items-center">
                                        <input
                                            type="checkbox"
                                            checked={data.privacidad}
                                            onChange={(e) => setData('privacidad', e.target.checked)}
                                            required
                                            className="size-4.5 shrink-0 appearance-none rounded border border-black/80 bg-[#EAEAF1] checked:bg-white checked:bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20d%3D%22M2%206l3%203%205-5%22%20stroke%3D%22%23000%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20fill%3D%22none%22%2F%3E%3C%2Fsvg%3E')] checked:bg-center checked:bg-no-repeat"
                                        />
                                        <span className="text-sm leading-none text-black" style={{ fontFamily: '"Toyota Type"' }}>
                                            He leído y acepto la política de privacidad de mis datos personales.
                                        </span>
                                    </div>
                                </div>

                                {/* Submit button */}
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex h-12 w-full items-center justify-center rounded-[60px] bg-black px-5 disabled:opacity-60 lg:w-50"
                                >
                                    <span className="text-base leading-none text-white" style={{ fontFamily: '"Toyota Type"' }}>
                                        {processing ? 'Enviando…' : 'Enviar solicitud'}
                                    </span>
                                </button>
                            </div>
                        </form>
                    </div>
                </section>
                )}

                <BranchesSection
                    title="Contacto Sucursales"
                    backgroundStyle="linear-gradient(180deg, #ffffff 0%, #000000 90%)"
                    textColor="text-black"
                />

            </main>

            {footer && (
                <div className="bg-black">
                    <Footer data={footer} />
                </div>
            )}
        </div>
    );
}
