import { Head, Link } from '@inertiajs/react';
import { Footer } from '@/components/landing/footer';
import { Navbar } from '@/components/landing/navbar';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';

type Repuesto = { id: number; name: string; price: string | null; images: string[]; stock_la_serena: boolean; stock_ovalle: boolean; };

const sucursales = ['La Serena', 'Ovalle'];

export default function RepuestoCotizar({ repuesto, footer }: { repuesto: Repuesto; footer: any }) {
    const [nombre, setNombre] = useState('');
    const [telefono, setTelefono] = useState('');
    const [email, setEmail] = useState('');
    const [sucursal, setSucursal] = useState('');
    const [comentarios, setComentarios] = useState('');
    const [acepta, setAcepta] = useState(false);
    const [enviado, setEnviado] = useState(false);
    const [currentImage, setCurrentImage] = useState(0);

    const images = repuesto.images ?? [];

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

    const prevImage = () => setCurrentImage((p) => (p === 0 ? Math.max(images.length - 1, 0) : p - 1));
    const nextImage = () => setCurrentImage((p) => (p === images.length - 1 ? 0 : p + 1));

    return (
        <>
            <Head title="Cotizar repuesto — Toyota Musalem" />
            <div className="min-h-screen bg-white">
                <Navbar variant="white" />

                <div className="px-15 pb-20" style={{ paddingTop: '120px' }}>
                    {/* Volver */}
                    <Link
                        href={`/post-venta/repuestos/${repuestoId}`}
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

                    {/* Two columns */}
                    <div className="mt-5 flex items-start gap-5">

                        {/* Left: Form card */}
                        <div className="flex flex-1 flex-col gap-2.5 rounded-[20px] bg-[#EAEAF1] p-10">
                            {!enviado ? (
                                <form onSubmit={handleSubmit} className="flex flex-col gap-10 items-end self-stretch">
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
                                            <div className="flex gap-5 items-center self-stretch">
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
                                                        <option value="" disabled>Sucursal La Serena</option>
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
                                            <label className="text-sm leading-[120%] text-black" style={{ fontFamily: '"Toyota Type"' }}>
                                                Comentarios
                                            </label>
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

                                    {/* Submit button — right aligned */}
                                    <button
                                        type="submit"
                                        className="flex h-12 w-50 cursor-pointer items-center justify-center rounded-[60px] bg-black text-base leading-none text-white transition hover:bg-black/85"
                                        style={{ fontFamily: '"Toyota Type"' }}
                                    >
                                        Enviar solicitud
                                    </button>
                                </form>
                            ) : (
                                <div className="flex flex-col items-start gap-5">
                                    <div className="flex size-14 items-center justify-center rounded-full bg-black">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <path d="M5 12L10 17L19 8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                    <h2 className="text-[28px] font-semibold leading-none text-black" style={{ fontFamily: '"Toyota Type"' }}>
                                        ¡Solicitud enviada!
                                    </h2>
                                    <p className="text-base leading-[120%] text-black/60" style={{ fontFamily: '"Toyota Type"' }}>
                                        Hemos recibido tu cotización. Un asesor de Toyota Musalem se pondrá en contacto contigo a la brevedad.
                                    </p>
                                    <Link
                                        href="/post-venta/repuestos"
                                        className="flex h-12 cursor-pointer items-center justify-center rounded-[60px] bg-black px-8 text-base leading-none text-white transition hover:bg-black/85"
                                        style={{ fontFamily: '"Toyota Type"' }}
                                    >
                                        Volver a repuestos
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Right: Summary card */}
                        <div className="flex flex-1 flex-col gap-5 items-center rounded-[20px] bg-[#EAEAF1] px-7.5 py-10 self-stretch">
                            {/* Product name */}
                            <div className="flex items-center justify-center self-stretch">
                                <span className="text-[28px] font-semibold leading-none text-black" style={{ fontFamily: '"Toyota Type"' }}>
                                    {repuesto.name}
                                </span>
                            </div>

                            {/* Image gallery */}
                            <div className="rounded-[20px] bg-white p-px self-stretch overflow-hidden">
                                <div className="relative h-83.25 w-full rounded-[20px] overflow-hidden bg-gray-100 flex items-center justify-center">
                                    <span className="text-sm text-black/30" style={{ fontFamily: '"Toyota Type"' }}>Imagen del repuesto</span>
                                    {/* Arrows */}
                                    <div className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 items-center justify-between px-4">
                                        <button
                                            onClick={prevImage}
                                            className="flex size-10 cursor-pointer items-center justify-center rounded-[60px] bg-black/80 backdrop-blur-[10px] transition hover:bg-black/60"
                                        >
                                            <ChevronLeft className="size-5 text-white" />
                                        </button>
                                        <button
                                            onClick={nextImage}
                                            className="flex size-10 cursor-pointer items-center justify-center rounded-[60px] bg-black/80 backdrop-blur-[10px] transition hover:bg-black/60"
                                        >
                                            <ChevronRight className="size-5 text-white" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Price */}
                            <div className="rounded-[10px] bg-[#EAEAF1] p-5 self-stretch" style={{ background: 'rgba(0,0,0,0.06)' }}>
                                <div className="flex items-center justify-between self-stretch">
                                    <span className="text-sm leading-none text-black" style={{ fontFamily: '"Toyota Type"' }}>Precio:</span>
                                    <span className="text-base font-semibold leading-[120%] text-black" style={{ fontFamily: '"Toyota Type"' }}>
                                        {repuesto.price ?? '—'}
                                    </span>
                                </div>
                            </div>

                            {/* Divider */}
                            <hr className="self-stretch border-black/10" />

                            {/* Branch */}
                            <div className="flex flex-col gap-1.5 items-start self-stretch">
                                <span className="text-lg leading-none text-black/60" style={{ fontFamily: '"Toyota Type"' }}>Disponible en:</span>
                                {[
                                    { key: 'la_serena', show: repuesto.stock_la_serena, name: 'Sucursal La Serena', address: 'Av. Francisco de Aguirre #070', url: 'https://www.google.com/maps/search/Av.+Francisco+de+Aguirre+070,+La+Serena' },
                                    { key: 'ovalle', show: repuesto.stock_ovalle, name: 'Sucursal Ovalle', address: 'Ariztía #358', url: 'https://www.google.com/maps/search/Aristia+358,+Ovalle' },
                                ].filter(b => b.show).map(branch => (
                                    <a key={branch.key} href={branch.url} target="_blank" rel="noopener noreferrer"
                                        className="flex items-center gap-5 rounded-[10px] self-stretch px-10 py-5 transition hover:bg-black/10"
                                        style={{ background: 'rgba(0,0,0,0.06)' }}
                                    >
                                        <svg className="size-4.25 shrink-0" viewBox="0 0 17 24" fill="none">
                                            <path d="M8.5 0C3.81 0 0 3.81 0 8.5C0 14.875 8.5 24 8.5 24S17 14.875 17 8.5C17 3.81 13.19 0 8.5 0ZM8.5 11.5C6.84 11.5 5.5 10.16 5.5 8.5S6.84 5.5 8.5 5.5 11.5 6.84 11.5 8.5 10.16 11.5 8.5 11.5Z" fill="#EA4335" />
                                        </svg>
                                        <div className="flex h-9.5 flex-col items-start justify-between">
                                            <span className="text-base leading-none text-black/60" style={{ fontFamily: '"Toyota Type"' }}>{branch.name}</span>
                                            <span className="text-base leading-none text-black/60 underline" style={{ fontFamily: '"Toyota Type"' }}>{branch.address}</span>
                                        </div>
                                    </a>
                                ))}
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
