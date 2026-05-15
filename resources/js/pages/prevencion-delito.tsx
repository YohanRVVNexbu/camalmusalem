import { Head, useForm, usePage } from '@inertiajs/react';
import { Footer } from '@/components/landing/footer';
import { Navbar } from '@/components/landing/navbar';
import { useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { pickResponsiveImage } from '@/lib/media';
import { formatRut } from '@/lib/rut';
import { toast } from 'sonner';
import formImgDefault from '@images/contacto/form_image.png?format=webp';

export default function PrevencionDelito({ footer }: { footer: any | null }) {
    const isMobile = useIsMobile();
    const formImg = pickResponsiveImage(null, null, isMobile) || formImgDefault;
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
        post('/prevencion-delito', {
            onSuccess: () => {
                reset();
                toast.success('¡Denuncia recibida! Será revisada con confidencialidad.');
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
            <Head title="Prevención del Delito — Toyota Musalem" />
            <Navbar variant="white" />

            <main className="flex flex-col bg-black">

                {/* Hero + Form */}
                <section className="pb-10 lg:px-15 lg:pb-20 lg:pt-32" style={{ background: 'linear-gradient(180deg, #000000 0%, #ffffff 100%)' }}>
                    <div className="flex flex-col overflow-hidden shadow-2xl lg:flex-row lg:rounded-[30px]">

                        {/* Left: Image + info legal */}
                        <div
                            className="flex aspect-3/4 w-full shrink-0 flex-col items-stretch justify-end gap-2 p-3 lg:aspect-auto lg:h-215 lg:w-1/2 lg:gap-2.5 lg:px-7.5 lg:pt-7.5 lg:pb-15"
                            style={{
                                background: `url(${formImg}) lightgray center / cover no-repeat`,
                            }}
                        >
                            {/* Marco legal */}
                            <div
                                className="flex flex-col gap-2.5 items-start justify-center self-stretch overflow-hidden rounded-2xl p-5"
                                style={{ background: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(30px)' }}
                            >
                                <div className="flex flex-col gap-4 items-start self-stretch">
                                    <span className="text-xl font-semibold uppercase leading-none text-white" style={{ fontFamily: '"Toyota Type"' }}>
                                        Ley 20.393
                                    </span>
                                    <span className="text-sm leading-[140%] text-white" style={{ fontFamily: '"Toyota Type"' }}>
                                        Sistema de Prevención del Delito de Toyota Musalem. Canal habilitado para denuncias o
                                        consultas relacionadas a lavado de activos, financiamiento del terrorismo, cohecho,
                                        receptación, negociación incompatible y demás delitos comprendidos en la Ley 20.393.
                                    </span>
                                </div>
                            </div>

                            {/* Confidencialidad */}
                            <div
                                className="flex flex-col gap-2.5 items-start justify-center self-stretch overflow-hidden rounded-2xl p-5"
                                style={{ background: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(30px)' }}
                            >
                                <div className="flex flex-col gap-4 items-start self-stretch">
                                    <span className="text-xl font-semibold uppercase leading-none text-white" style={{ fontFamily: '"Toyota Type"' }}>
                                        Confidencialidad
                                    </span>
                                    <span className="text-sm leading-[140%] text-white" style={{ fontFamily: '"Toyota Type"' }}>
                                        Tu denuncia es revisada exclusivamente por el Encargado de Prevención de Delitos. La
                                        identidad del denunciante se mantiene en reserva y no se permite ningún tipo de
                                        represalia por denunciar de buena fe.
                                    </span>
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
                                            Prevención del Delito
                                        </h1>
                                        <p
                                            className="text-base leading-[120%] text-black lg:text-lg"
                                            style={{ fontFamily: '"Toyota Type"' }}
                                        >
                                            Canal de denuncias — Ley 20.393
                                        </p>
                                        <p
                                            className="text-sm leading-[120%] text-black lg:text-base"
                                            style={{ fontFamily: '"Toyota Type"' }}
                                        >
                                            Si tienes conocimiento de una situación que pudiera implicar un delito de los
                                            contemplados en la Ley 20.393, completa el formulario. Tu denuncia será
                                            revisada con la mayor confidencialidad por el Encargado de Prevención de
                                            Delitos de Toyota Musalem.
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
                                                    placeholder="+569"
                                                    value={data.telefono}
                                                    onChange={(e) => setData('telefono', e.target.value)}
                                                    className="h-10 w-full rounded-[60px] border border-transparent bg-white px-5 text-sm leading-none text-black placeholder-black/60 outline-none"
                                                    style={{ fontFamily: '"Toyota Type"' }}
                                                />
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

            </main>

            {footer && (
                <div className="bg-black">
                    <Footer data={footer} />
                </div>
            )}
        </div>
    );
}
