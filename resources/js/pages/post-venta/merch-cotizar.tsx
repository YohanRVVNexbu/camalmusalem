import { Head, Link, router } from '@inertiajs/react';
import { toast } from 'sonner';
import { Footer } from '@/components/landing/footer';
import { Navbar } from '@/components/landing/navbar';
import { useEffect, useState } from 'react';
import { formatCLP } from '@/lib/format';

type Merch = { id: number; name: string; price: string | null; size: string | null; images: string[]; };

const sucursales = ['La Serena', 'Ovalle'];

const BRANCHES = [
    { name: 'Sucursal La Serena', address: 'Av. Francisco de Aguirre #070', url: 'https://www.google.com/maps/search/Av.+Francisco+de+Aguirre+070,+La+Serena,+Chile' },
    { name: 'Sucursal Ovalle', address: 'Ariztía #358', url: 'https://www.google.com/maps/search/Aristia+358,+Ovalle,+Chile' },
];

export default function MerchCotizar({ merch, footer }: { merch: Merch; footer: any | null }) {
    const [nombre, setNombre] = useState('');
    const [telefono, setTelefono] = useState('');
    const [email, setEmail] = useState('');
    const [sucursal, setSucursal] = useState('');
    const [comentarios, setComentarios] = useState('');
    const [acepta, setAcepta] = useState(false);
    const [enviado, setEnviado] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [website, setWebsite] = useState(''); // honeypot

    useEffect(() => {
        const html = document.documentElement;
        const prev = html.style.backgroundColor;
        html.style.backgroundColor = '#fff';
        return () => { html.style.backgroundColor = prev; };
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (submitting) return;
        if (!acepta) {
            toast.error('Debes aceptar la política de privacidad para continuar.');
            return;
        }
        setSubmitting(true);
        router.post(`/post-venta/merch/${merch.id}/cotizar`, {
            nombre,
            email,
            telefono,
            sucursal,
            comentarios,
            privacidad: acepta,
            _website: website,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setEnviado(true);
                setSubmitting(false);
            },
            onError: () => {
                setSubmitting(false);
                toast.error('Hubo un problema al enviar. Revisa los campos e intenta nuevamente.');
            },
        });
    };

    return (
        <>
            <Head title="Cotizar merch — Toyota Musalem" />
            <div className="min-h-screen bg-white">
                <Navbar variant="white" />

                <div className="px-5 pt-25 pb-10 lg:px-15 lg:pt-30 lg:pb-20">
                    {/* Volver */}
                    <Link
                        href={`/post-venta/merch/${merch.id}`}
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
                    <div className="mt-5 flex flex-col items-stretch gap-5 lg:flex-row lg:items-start">

                        {/* Left: Form card */}
                        <div className="flex flex-1 flex-col gap-2.5 rounded-[20px] bg-[#EAEAF1] p-5 lg:p-10">
                            {!enviado ? (
                                <form onSubmit={handleSubmit} className="flex flex-col gap-10 items-end self-stretch">
                                    {/* Honeypot */}
                                    <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }}>
                                        <label htmlFor="_website">No rellenar</label>
                                        <input id="_website" type="text" name="_website" value={website} onChange={(e) => setWebsite(e.target.value)} tabIndex={-1} autoComplete="off" />
                                    </div>
                                    <div className="flex flex-col gap-5 items-start self-stretch">

                                        {/* Title */}
                                        <h1 className="text-2xl font-semibold leading-none text-black" style={{ fontFamily: '"Toyota Type"' }}>
                                            Cotizar producto
                                        </h1>

                                        <div className="flex flex-col gap-5 items-start self-stretch">
                                            {/* Nombre completo */}
                                            <div className="flex flex-col gap-2.5 items-start self-stretch">
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
                                                <div className="flex flex-1 flex-col gap-2.5 items-start">
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
                                                <div className="flex flex-1 flex-col gap-2.5 items-start">
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

                                            {/* Sucursal */}
                                            <div className="flex flex-col gap-2.5 items-start self-stretch">
                                                <label className="text-sm leading-none text-black" style={{ fontFamily: '"Toyota Type"' }}>
                                                    Sucursal
                                                </label>
                                                <div className="relative self-stretch">
                                                    <select
                                                        value={sucursal}
                                                        onChange={(e) => setSucursal(e.target.value)}
                                                        className="h-10 w-full appearance-none rounded-[60px] border border-transparent bg-white px-5 pr-10 text-sm leading-none text-black/60 outline-none focus:border-black/20"
                                                        style={{ fontFamily: '"Toyota Type"' }}
                                                        required
                                                    >
                                                        <option value="" disabled>Selecciona la sucursal a la que quieres cotizar</option>
                                                        {sucursales.map((s) => (
                                                            <option key={s} value={s}>{s}</option>
                                                        ))}
                                                    </select>
                                                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
                                                        <svg width="6" height="10" viewBox="0 0 6 10" fill="none">
                                                            <path d="M1 1L5 5L1 9" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Comentarios */}
                                        <div className="flex flex-col gap-2.5 items-start self-stretch">
                                            <p className="text-sm leading-[120%] text-black self-stretch" style={{ fontFamily: '"Toyota Type"' }}>
                                                Si el artículo requiere talla, color u otra especificación, indícalo en los comentarios junto con cualquier detalle adicional que quieras agregar.
                                            </p>
                                            <textarea
                                                value={comentarios}
                                                onChange={(e) => setComentarios(e.target.value)}
                                                placeholder="Escribe aquí tus comentarios"
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
                                                He leído y acepto la política de privacidad de mis datos personales.
                                            </span>
                                        </label>
                                    </div>

                                    {/* Submit button — full-width en mobile, fijo en desktop */}
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="flex h-12 w-full cursor-pointer items-center justify-center rounded-[60px] bg-black text-base leading-none text-white transition hover:bg-black/85 disabled:opacity-60 lg:w-50"
                                        style={{ fontFamily: '"Toyota Type"' }}
                                    >
                                        {submitting ? 'Enviando…' : 'Enviar solicitud'}
                                    </button>
                                </form>
                            ) : (
                                <div className="flex flex-col items-start gap-5">
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
                                        href="/post-venta/accesorios"
                                        className="flex h-12 w-full cursor-pointer items-center justify-center rounded-[60px] bg-black px-8 text-base leading-none text-white transition hover:bg-black/85 lg:w-auto"
                                        style={{ fontFamily: '"Toyota Type"' }}
                                    >
                                        Volver a accesorios y merch
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Right: Summary card */}
                        <div className="flex flex-1 flex-col gap-5 items-center self-stretch rounded-[20px] bg-[#EAEAF1] p-5 lg:px-7.5 lg:py-10">
                            {/* Product name */}
                            <div className="flex items-center justify-center self-stretch">
                                <span className="text-center text-2xl font-semibold leading-[120%] text-black lg:text-[28px] lg:leading-none" style={{ fontFamily: '"Toyota Type"' }}>
                                    {merch.name}
                                </span>
                            </div>

                            {/* Product image */}
                            <div className="flex aspect-square w-full max-w-62 shrink-0 items-center justify-center overflow-hidden rounded-[20px] bg-white lg:h-60 lg:w-62 lg:aspect-auto">
                                {merch.images?.[0] ? (
                                    <img src={merch.images[0]} alt={merch.name} className="size-full object-contain" />
                                ) : (
                                    <span className="text-sm text-black/30" style={{ fontFamily: '"Toyota Type"' }}>Imagen del producto</span>
                                )}
                            </div>

                            {/* Talla */}
                            {merch.size && (
                                <div className="self-stretch rounded-[10px] p-5" style={{ background: 'rgba(0,0,0,0.06)' }}>
                                    <div className="flex items-center justify-between self-stretch">
                                        <span className="text-sm leading-none text-black" style={{ fontFamily: '"Toyota Type"' }}>Talla:</span>
                                        <span className="text-base font-semibold leading-[120%] text-black" style={{ fontFamily: '"Toyota Type"' }}>
                                            {merch.size}
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Price */}
                            <div className="self-stretch rounded-[10px] p-5" style={{ background: 'rgba(0,0,0,0.06)' }}>
                                <div className="flex items-center justify-between self-stretch">
                                    <span className="text-sm leading-none text-black" style={{ fontFamily: '"Toyota Type"' }}>Precio:</span>
                                    <span className="text-base font-semibold leading-[120%] text-black" style={{ fontFamily: '"Toyota Type"' }}>
                                        {merch.price ? formatCLP(merch.price) : '—'}
                                    </span>
                                </div>
                            </div>

                            {/* Divider */}
                            <hr className="self-stretch border-black/10" />

                            {/* Branches */}
                            <div className="flex flex-col gap-1.5 items-start self-stretch">
                                <span className="text-base leading-none text-black/60 lg:text-lg" style={{ fontFamily: '"Toyota Type"' }}>Disponible en:</span>
                                <div className="flex flex-col gap-2.5 self-stretch">
                                    {BRANCHES.map((branch) => (
                                        <a
                                            key={branch.name}
                                            href={branch.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 self-stretch rounded-[10px] p-4 transition hover:opacity-80 lg:gap-5 lg:px-10 lg:py-5"
                                            style={{ background: 'rgba(0,0,0,0.06)' }}
                                        >
                                            <svg className="size-5 shrink-0 lg:size-4.25" viewBox="0 0 17 24" fill="none">
                                                <path d="M8.5 0C3.81 0 0 3.81 0 8.5C0 14.875 8.5 24 8.5 24S17 14.875 17 8.5C17 3.81 13.19 0 8.5 0ZM8.5 11.5C6.84 11.5 5.5 10.16 5.5 8.5S6.84 5.5 8.5 5.5 11.5 6.84 11.5 8.5 10.16 11.5 8.5 11.5Z" fill="#EA4335" />
                                            </svg>
                                            <div className="flex flex-col items-start gap-1 lg:h-9.5 lg:justify-between lg:gap-0">
                                                <span className="text-sm leading-none text-black/60 lg:text-base" style={{ fontFamily: '"Toyota Type"' }}>
                                                    {branch.name}
                                                </span>
                                                <span className="text-sm leading-none text-black/60 underline lg:text-base" style={{ fontFamily: '"Toyota Type"' }}>
                                                    {branch.address}
                                                </span>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </div>
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
