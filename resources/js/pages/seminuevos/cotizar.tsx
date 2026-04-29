import { Head, Link } from '@inertiajs/react';
import { Footer } from '@/components/landing/footer';
import { Navbar } from '@/components/landing/navbar';
import { useEffect, useState } from 'react';

type Branch = {
    id: number;
    name: string;
    address: string | null;
    maps_url: string | null;
};

type Seminuevo = {
    id: number;
    slug: string | null;
    brand: string;
    model: string;
    year: number;
    price: string | null;
    gallery: string[];
    branch?: Branch | null;
};

export default function SeminuevoCotizar({ seminuevo, footer }: { seminuevo: Seminuevo; footer: any }) {
    const [nombre, setNombre] = useState('');
    const [telefono, setTelefono] = useState('');
    const [email, setEmail] = useState('');
    const [comentarios, setComentarios] = useState('');
    const [acepta, setAcepta] = useState(false);
    const [enviado, setEnviado] = useState(false);

    useEffect(() => {
        const html = document.documentElement;
        const prev = html.style.backgroundColor;
        html.style.backgroundColor = '#fff';
        return () => { html.style.backgroundColor = prev; };
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setEnviado(true);
    };

    const backHref = `/seminuevos/${seminuevo.slug ?? seminuevo.id}`;
    const titleDisplay = `${seminuevo.brand} ${seminuevo.model} ${seminuevo.year}`.toUpperCase();
    const branch = seminuevo.branch;

    return (
        <>
            <Head title={`Cotizar ${titleDisplay} — Toyota Musalem`} />
            <div className="min-h-screen overflow-x-hidden bg-white">
                <Navbar variant="white" />

                <div className="px-5 pt-25 pb-10 lg:px-15 lg:pt-30 lg:pb-20">
                    {/* Volver */}
                    <Link
                        href={backHref}
                        className="inline-flex h-9.5 cursor-pointer items-center gap-2.5 rounded-[60px] border border-black py-2.5 pr-5 pl-2.5 text-sm leading-none text-black transition hover:bg-black/5"
                        style={{ fontFamily: '"Toyota Type"' }}
                    >
                        <span className="flex size-6 items-center justify-center rounded-full bg-black">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="9" viewBox="0 0 12 9" fill="none">
                                <path d="M10.6016 4.34961H0.601563M0.601563 4.34961L4.35156 8.09961M0.601563 4.34961L4.35156 0.599609" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </span>
                        Volver
                    </Link>

                    {/* Two columns: stack en mobile, lado a lado en desktop */}
                    <div className="mt-5 flex flex-col items-stretch gap-5 lg:flex-row lg:items-stretch">

                        {/* Left: Form card — en mobile va segundo */}
                        <div className="order-2 flex flex-1 flex-col items-center justify-center self-stretch rounded-[20px] bg-[#EAEAF1] p-5 lg:order-1 lg:p-10">
                            {!enviado ? (
                                <form onSubmit={handleSubmit} className="flex flex-col items-end justify-center gap-10 self-stretch">
                                    <div className="flex flex-col items-start justify-start gap-5 self-stretch">

                                        {/* Title */}
                                        <h1 className="text-2xl font-semibold leading-none text-black" style={{ fontFamily: '"Toyota Type"' }}>
                                            Cotizar vehículo
                                        </h1>

                                        <div className="flex flex-col items-start justify-start gap-5 self-stretch">
                                            {/* Nombre completo */}
                                            <div className="flex flex-col items-start justify-start gap-2.5 self-stretch">
                                                <label className="text-sm leading-none text-black" style={{ fontFamily: '"Toyota Type"' }}>
                                                    Nombre completo
                                                </label>
                                                <input
                                                    type="text"
                                                    value={nombre}
                                                    onChange={(e) => setNombre(e.target.value)}
                                                    placeholder="Ingresa tu nombre completo"
                                                    className="h-10 w-full rounded-[60px] border border-transparent bg-white px-5 text-sm leading-none text-black outline-none placeholder:text-black/60 focus:border-black/20"
                                                    style={{ fontFamily: '"Toyota Type"' }}
                                                    required
                                                />
                                            </div>

                                            {/* Email + Teléfono */}
                                            <div className="flex flex-col gap-5 self-stretch lg:flex-row lg:items-center">
                                                <div className="flex flex-1 flex-col items-start gap-2.5">
                                                    <label className="text-sm leading-none text-black" style={{ fontFamily: '"Toyota Type"' }}>
                                                        Email
                                                    </label>
                                                    <input
                                                        type="email"
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                        placeholder="Correo electrónico"
                                                        className="h-10 w-full rounded-[60px] border border-transparent bg-white px-5 text-sm leading-none text-black outline-none placeholder:text-black/60 focus:border-black/20"
                                                        style={{ fontFamily: '"Toyota Type"' }}
                                                        required
                                                    />
                                                </div>
                                                <div className="flex flex-1 flex-col items-start gap-2.5">
                                                    <label className="text-sm leading-none text-black" style={{ fontFamily: '"Toyota Type"' }}>
                                                        Teléfono
                                                    </label>
                                                    <input
                                                        type="tel"
                                                        value={telefono}
                                                        onChange={(e) => setTelefono(e.target.value)}
                                                        placeholder="+569"
                                                        className="h-10 w-full rounded-[60px] border border-transparent bg-white px-5 text-sm leading-none text-black outline-none placeholder:text-black/60 focus:border-black/20"
                                                        style={{ fontFamily: '"Toyota Type"' }}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Comentarios */}
                                        <div className="flex flex-col items-start gap-2.5 self-stretch">
                                            <label className="self-stretch text-sm leading-[120%] text-black" style={{ fontFamily: '"Toyota Type"' }}>
                                                Comentarios
                                            </label>
                                            <textarea
                                                value={comentarios}
                                                onChange={(e) => setComentarios(e.target.value)}
                                                placeholder="Si tienes algún comentario adicional déjalo aquí"
                                                className="h-28.5 w-full resize-none rounded-[20px] border border-transparent bg-white p-5 text-sm leading-none text-black outline-none placeholder:text-black/60 focus:border-black/20"
                                                style={{ fontFamily: '"Toyota Type"' }}
                                            />
                                        </div>

                                        {/* Checkbox */}
                                        <label className="flex cursor-pointer items-center gap-2.5">
                                            <div className="relative shrink-0">
                                                <input
                                                    type="checkbox"
                                                    checked={acepta}
                                                    onChange={(e) => setAcepta(e.target.checked)}
                                                    className="size-4.5 cursor-pointer appearance-none rounded border border-black/80 bg-[#EAEAF1] checked:bg-black"
                                                    required
                                                />
                                                {acepta && (
                                                    <svg className="pointer-events-none absolute inset-0 m-auto" width="10" height="8" viewBox="0 0 10 8" fill="none">
                                                        <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                )}
                                            </div>
                                            <span className="text-sm leading-none text-black" style={{ fontFamily: '"Toyota Type"' }}>
                                                Acepto recibir comunicaciones de parte de Musalem.{' '}
                                                <a href="#" className="underline">Revisa nuestras políticas de privacidad.</a>
                                            </span>
                                        </label>
                                    </div>

                                    {/* Submit button */}
                                    <button
                                        type="submit"
                                        className="flex h-12 w-full cursor-pointer items-center justify-center rounded-[60px] bg-black text-base leading-none text-white transition hover:bg-black/85 lg:w-50"
                                        style={{ fontFamily: '"Toyota Type"' }}
                                    >
                                        Enviar solicitud
                                    </button>
                                </form>
                            ) : (
                                <div className="flex flex-col items-start gap-5 self-stretch">
                                    <div className="flex size-14 items-center justify-center rounded-full bg-black">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <path d="M5 12L10 17L19 8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                    <h2 className="text-2xl font-semibold leading-[120%] text-black lg:text-[28px] lg:leading-none" style={{ fontFamily: '"Toyota Type"' }}>
                                        ¡Solicitud enviada!
                                    </h2>
                                    <p className="text-sm leading-[120%] text-black/60 lg:text-base" style={{ fontFamily: '"Toyota Type"' }}>
                                        Hemos recibido tu cotización. Un asesor de Toyota Musalem se pondrá en contacto contigo a la brevedad.
                                    </p>
                                    <Link
                                        href="/seminuevos"
                                        className="flex h-12 w-full cursor-pointer items-center justify-center rounded-[60px] bg-black px-8 text-base leading-none text-white transition hover:bg-black/85 lg:w-auto"
                                        style={{ fontFamily: '"Toyota Type"' }}
                                    >
                                        Volver a seminuevos
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Right: Summary card — en mobile va primero */}
                        <div className="order-1 flex flex-1 flex-col items-center gap-5 self-stretch overflow-hidden rounded-[20px] bg-[#EAEAF1] p-5 lg:order-2 lg:px-7.5 lg:pt-5 lg:pb-7.5">
                            {/* Vehicle info card (white) */}
                            <div className="flex w-full max-w-130 shrink-0 flex-col items-center gap-3 overflow-hidden rounded-[20px] bg-white p-5 lg:gap-5">
                                <span className="text-center text-xl font-semibold uppercase leading-[120%] text-black lg:text-[28px] lg:leading-none" style={{ fontFamily: '"Toyota Type"' }}>
                                    {titleDisplay}
                                </span>
                                {seminuevo.gallery?.[0] && (
                                    <img
                                        src={seminuevo.gallery[0]}
                                        alt={titleDisplay}
                                        className="aspect-5/3 w-full max-w-100 rounded-[20px] object-cover"
                                    />
                                )}
                            </div>

                            {/* Pricing — single "Precio lista" row */}
                            {seminuevo.price && (
                                <div className="flex w-full flex-col items-start gap-3.5 self-stretch rounded-[10px] bg-white p-4 lg:bg-[#EAEAF1] lg:p-5">
                                    <div className="flex items-center justify-between gap-3 self-stretch">
                                        <span className="text-sm leading-[120%] text-black" style={{ fontFamily: '"Toyota Type"' }}>
                                            Precio lista
                                        </span>
                                        <span className="shrink-0 text-right text-sm font-semibold leading-[120%] text-black lg:text-base" style={{ fontFamily: '"Toyota Type"' }}>
                                            {seminuevo.price}
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Divider */}
                            {branch && <hr className="w-full self-stretch border-black/10" />}

                            {/* Disponible en — solo la sucursal del seminuevo */}
                            {branch && (
                                <div className="flex flex-col items-start gap-1.5 self-stretch rounded-[10px]">
                                    <span className="text-base leading-none text-black/60 lg:text-lg" style={{ fontFamily: '"Toyota Type"' }}>
                                        Disponible en:
                                    </span>
                                    {branch.maps_url ? (
                                        <a
                                            href={branch.maps_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center gap-3 self-stretch rounded-[10px] bg-white p-4 transition hover:opacity-80 lg:gap-5 lg:bg-[#EAEAF1] lg:px-10 lg:py-5"
                                        >
                                            <svg className="size-5 shrink-0 lg:size-4.25" viewBox="0 0 17 24" fill="none">
                                                <path d="M8.5 0C3.81 0 0 3.81 0 8.5C0 14.875 8.5 24 8.5 24S17 14.875 17 8.5C17 3.81 13.19 0 8.5 0ZM8.5 11.5C6.84 11.5 5.5 10.16 5.5 8.5S6.84 5.5 8.5 5.5 11.5 6.84 11.5 8.5 10.16 11.5 8.5 11.5Z" fill="#EA4335" />
                                            </svg>
                                            <div className="flex flex-1 flex-col items-start gap-1 lg:h-9.5 lg:flex-none lg:justify-between lg:gap-0">
                                                <span className="text-sm leading-none text-black/60 lg:text-base" style={{ fontFamily: '"Toyota Type"' }}>
                                                    {branch.name}
                                                </span>
                                                {branch.address && (
                                                    <span className="text-sm leading-none text-black/60 underline lg:text-base" style={{ fontFamily: '"Toyota Type"' }}>
                                                        {branch.address}
                                                    </span>
                                                )}
                                            </div>
                                        </a>
                                    ) : (
                                        <div className="flex items-center justify-center gap-3 self-stretch rounded-[10px] bg-white p-4 lg:gap-5 lg:bg-[#EAEAF1] lg:px-10 lg:py-5">
                                            <svg className="size-5 shrink-0 lg:size-4.25" viewBox="0 0 17 24" fill="none">
                                                <path d="M8.5 0C3.81 0 0 3.81 0 8.5C0 14.875 8.5 24 8.5 24S17 14.875 17 8.5C17 3.81 13.19 0 8.5 0ZM8.5 11.5C6.84 11.5 5.5 10.16 5.5 8.5S6.84 5.5 8.5 5.5 11.5 6.84 11.5 8.5 10.16 11.5 8.5 11.5Z" fill="#EA4335" />
                                            </svg>
                                            <div className="flex flex-1 flex-col items-start gap-1 lg:h-9.5 lg:flex-none lg:justify-between lg:gap-0">
                                                <span className="text-sm leading-none text-black/60 lg:text-base" style={{ fontFamily: '"Toyota Type"' }}>
                                                    {branch.name}
                                                </span>
                                                {branch.address && (
                                                    <span className="text-sm leading-none text-black/60 lg:text-base" style={{ fontFamily: '"Toyota Type"' }}>
                                                        {branch.address}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                    </div>
                </div>

                <div className="bg-white">
                    {footer && <Footer data={footer} />}
                </div>
            </div>
        </>
    );
}
