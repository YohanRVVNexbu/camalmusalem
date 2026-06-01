import { Head, Link } from '@inertiajs/react';
import { Footer } from '@/components/landing/footer';
import { Navbar } from '@/components/landing/navbar';
import { ContactCtaBanner } from '@/components/landing/contact-cta-banner';
import { BranchesSection } from '@/components/landing/branches-section';
import { PostventaWhatsapp, type PostventaWhatsappConfig } from '@/components/landing/postventa-whatsapp';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { formatCLP } from '@/lib/format';

type Accesorio = {
    id: number;
    name: string;
    description: string | null;
    comentarios: string | null;
    price: string | null;
    category: string;
    images: string[];
};

const BRANCHES = [
    { name: 'Sucursal La Serena', address: 'Av. Francisco de Aguirre #070', mapsUrl: 'https://www.google.com/maps/search/Av.+Francisco+de+Aguirre+070,+La+Serena,+Chile' },
    { name: 'Sucursal Ovalle', address: 'Ariztía #358', mapsUrl: 'https://www.google.com/maps/search/Aristia+358,+Ovalle,+Chile' },
];

export default function AccesorioShow({ accesorio, footer, whatsapp = null }: { accesorio: Accesorio; footer: any | null; whatsapp?: PostventaWhatsappConfig }) {
    const [currentImage, setCurrentImage] = useState(0);
    const images = accesorio.images?.length ? accesorio.images : [];

    useEffect(() => {
        const html = document.documentElement;
        const prev = html.style.backgroundColor;
        html.style.backgroundColor = '#fff';
        return () => { html.style.backgroundColor = prev; };
    }, []);

    const prevImage = () => setCurrentImage((prev) => (prev === 0 ? Math.max(images.length - 1, 0) : prev - 1));
    const nextImage = () => setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));

    return (
        <>
            <Head title={`${accesorio.name} — Accesorios Toyota Musalem`} />
            <div className="min-h-screen overflow-x-hidden bg-white">
                <Navbar variant="white" />
                <div className="px-5 pt-25 pb-15 lg:px-15 lg:pt-15 lg:pb-50">
                    {/* Top toolbar */}
                    <div className="flex items-center justify-between gap-2.5 lg:mt-20">
                        <Link
                            href="/post-venta/accesorios"
                            className="flex h-9.5 cursor-pointer items-center gap-2.5 rounded-[60px] border border-black py-2.5 pr-5 pl-2.5 text-sm leading-none text-black transition hover:bg-black/5"
                        >
                            <span className="flex size-6 items-center justify-center rounded-full bg-black" style={{ backdropFilter: 'blur(9.375px)' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="9" viewBox="0 0 12 9" fill="none">
                                    <path d="M10.6016 4.34961H0.601563M0.601563 4.34961L4.35156 8.09961M0.601563 4.34961L4.35156 0.599609" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </span>
                            Volver
                        </Link>
                        <button className="flex h-9.5 cursor-pointer items-center gap-2.5 rounded-[60px] border border-black px-5 py-2.5 text-sm leading-none text-black transition hover:bg-black hover:text-white">
                            <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" />
                            </svg>
                            Compartir
                        </button>
                    </div>

                    {/* ───────── Mobile layout ───────── */}
                    <div className="mt-7.5 flex flex-col gap-5 lg:hidden">
                        {/* Title */}
                        <h1 className="text-2xl font-semibold uppercase leading-[120%] text-black" style={{ fontFamily: '"Toyota Type"' }}>
                            {accesorio.name}
                        </h1>

                        {/* Main image */}
                        <div className="relative overflow-hidden rounded-[20px]">
                            {images[currentImage] ? (
                                <img src={images[currentImage]} alt={accesorio.name} className="aspect-square w-full bg-white object-contain" />
                            ) : (
                                <div className="flex aspect-square w-full items-center justify-center bg-gray-100">
                                    <span className="text-base text-black/30">Sin imagen</span>
                                </div>
                            )}
                        </div>

                        {/* Thumbnails + arrows */}
                        {images.length > 1 && (
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={prevImage}
                                    className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-black/20 bg-white"
                                    aria-label="Anterior"
                                >
                                    <ChevronLeft className="size-4 text-black" />
                                </button>
                                <div className="flex flex-1 gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
                                    {images.map((img, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setCurrentImage(i)}
                                            className={`aspect-square h-15 shrink-0 cursor-pointer overflow-hidden rounded-lg bg-gray-100 transition ${i === currentImage ? 'ring-2 ring-black' : 'opacity-60'}`}
                                        >
                                            <img src={img} alt="" className="size-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                                <button
                                    onClick={nextImage}
                                    className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-black/20 bg-white"
                                    aria-label="Siguiente"
                                >
                                    <ChevronRight className="size-4 text-black" />
                                </button>
                            </div>
                        )}

                        {/* Price */}
                        <div className="flex flex-col gap-1.5">
                            <span className="text-base leading-none text-black/60" style={{ fontFamily: '"Toyota Type"' }}>Precio:</span>
                            <div className="rounded-[10px] bg-[#EAEAF1] p-4">
                                <span className="text-2xl font-semibold uppercase leading-none text-black" style={{ fontFamily: '"Toyota Type"' }}>{accesorio.price ? formatCLP(accesorio.price) : '—'}</span>
                            </div>
                            <span className="text-xs leading-none text-black/50" style={{ fontFamily: '"Toyota Type"' }}>*Los valores no incluyen instalación.</span>
                        </div>

                        {/* CTAs */}
                        <div className="flex flex-col gap-2.5">
                            <Link
                                href={`/post-venta/accesorios/${accesorio.id}/cotizar`}
                                className="flex h-12 cursor-pointer items-center justify-center rounded-[60px] bg-black text-base leading-none text-white transition hover:bg-black/85"
                                style={{ fontFamily: '"Toyota Type"' }}
                            >
                                Cotizar
                            </Link>
                            <PostventaWhatsapp config={whatsapp} productName={accesorio.name} />
                        </div>

                        {/* Branches */}
                        <div className="flex flex-col gap-1.5">
                            <span className="text-base leading-none text-black/60" style={{ fontFamily: '"Toyota Type"' }}>Disponible en:</span>
                            <div className="flex flex-col gap-2.5">
                                {BRANCHES.map((branch) => (
                                    <a
                                        key={branch.name}
                                        href={branch.mapsUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 rounded-[10px] bg-[#EAEAF1] p-4 transition hover:bg-[#dddde6]"
                                    >
                                        <svg className="size-5 shrink-0" viewBox="0 0 17 24" fill="none">
                                            <path d="M8.5 0C3.81 0 0 3.81 0 8.5C0 14.875 8.5 24 8.5 24S17 14.875 17 8.5C17 3.81 13.19 0 8.5 0ZM8.5 11.5C6.84 11.5 5.5 10.16 5.5 8.5S6.84 5.5 8.5 5.5 11.5 6.84 11.5 8.5 10.16 11.5 8.5 11.5Z" fill="#EA4335" />
                                        </svg>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-sm leading-none text-black/60" style={{ fontFamily: '"Toyota Type"' }}>{branch.name}</span>
                                            <span className="text-sm leading-none text-black/60 underline" style={{ fontFamily: '"Toyota Type"' }}>{branch.address}</span>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Descripción */}
                        {accesorio.description && (
                            <div className="mt-2.5 flex flex-col gap-5 rounded-[20px] bg-[#EAEAF1] p-5">
                                <h2 className="text-xl font-semibold leading-[120%] text-black" style={{ fontFamily: '"Toyota Type"' }}>
                                    Descripción
                                </h2>
                                <p className="whitespace-pre-line text-sm leading-[120%] text-black" style={{ fontFamily: '"Toyota Type"' }}>
                                    {accesorio.description}
                                </p>
                            </div>
                        )}

                        {/* Comentarios */}
                        {accesorio.comentarios && (
                            <div className="flex flex-col gap-2.5 rounded-[20px] bg-[#EAEAF1] p-5">
                                <h2 className="text-xl font-semibold leading-[120%] text-black" style={{ fontFamily: '"Toyota Type"' }}>
                                    Comentarios
                                </h2>
                                <p className="whitespace-pre-line text-sm leading-[120%] text-black" style={{ fontFamily: '"Toyota Type"' }}>
                                    {accesorio.comentarios}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* ───────── Desktop layout ───────── */}
                    <div className="mt-10 hidden items-start gap-5 lg:flex">
                        {/* Left column: gallery + description */}
                        <div className="flex w-[65%] flex-col gap-5">
                            {/* Main image */}
                            <div className="relative overflow-hidden rounded-[20px]">
                                {images[currentImage] ? (
                                    <img src={images[currentImage]} alt={accesorio.name} className="h-120 w-full bg-white object-contain" />
                                ) : (
                                    <div className="flex h-120 w-full items-center justify-center bg-gray-100">
                                        <span className="text-base text-black/30">Sin imagen</span>
                                    </div>
                                )}
                                {images.length > 1 && (
                                    <>
                                        <button onClick={prevImage} className="absolute left-4 top-1/2 flex size-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-[60px] bg-black/80 backdrop-blur-[10px] transition hover:bg-black/60">
                                            <ChevronLeft className="size-5 text-white" />
                                        </button>
                                        <button onClick={nextImage} className="absolute right-4 top-1/2 flex size-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-[60px] bg-black/80 backdrop-blur-[10px] transition hover:bg-black/60">
                                            <ChevronRight className="size-5 text-white" />
                                        </button>
                                    </>
                                )}
                            </div>

                            {/* Thumbnails */}
                            {images.length > 1 && (
                                <div className="flex gap-3">
                                    {images.map((img, i) => (
                                        <button key={i} onClick={() => setCurrentImage(i)}
                                            className={`h-20 w-25 cursor-pointer overflow-hidden rounded-xl bg-gray-100 transition ${i === currentImage ? 'ring-2 ring-black' : 'opacity-60 hover:opacity-100'}`}
                                        >
                                            <img src={img} alt="" className="h-full w-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Descripción */}
                            {accesorio.description && (
                                <div className="mt-5 flex flex-col gap-5 rounded-[20px] bg-[#EAEAF1] p-7.5">
                                    <h2 className="text-2xl font-semibold leading-none text-black" style={{ fontFamily: '"Toyota Type"' }}>
                                        Descripción
                                    </h2>
                                    <p className="whitespace-pre-line text-sm leading-[120%] text-black" style={{ fontFamily: '"Toyota Type"' }}>
                                        {accesorio.description}
                                    </p>
                                </div>
                            )}

                            {accesorio.comentarios && (
                                <div className="mt-5 flex flex-col gap-5 rounded-[20px] bg-[#EAEAF1] p-7.5">
                                    <h2 className="text-2xl font-semibold leading-none text-black" style={{ fontFamily: '"Toyota Type"' }}>
                                        Comentarios
                                    </h2>
                                    <p className="whitespace-pre-line text-sm leading-[120%] text-black" style={{ fontFamily: '"Toyota Type"' }}>
                                        {accesorio.comentarios}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Right: Info card */}
                        <div className="flex w-[35%] flex-col gap-5 rounded-[20px] bg-[#EAEAF1] px-7.5 pt-7.5 pb-7.5">
                            {/* Title */}
                            <h1 className="text-[28px] font-semibold uppercase leading-none text-black" style={{ fontFamily: '"Toyota Type"' }}>
                                {accesorio.name}
                            </h1>

                            {/* Price */}
                            <div className="flex flex-col gap-1.5">
                                <span className="text-lg leading-none text-black/60" style={{ fontFamily: '"Toyota Type"' }}>Precio:</span>
                                <div className="rounded-[10px] p-4" style={{ background: 'rgba(0,0,0,0.06)' }}>
                                    <span className="text-[28px] font-semibold uppercase leading-none text-black" style={{ fontFamily: '"Toyota Type"' }}>{accesorio.price ? formatCLP(accesorio.price) : '—'}</span>
                                </div>
                                <span className="text-xs leading-none text-black/50" style={{ fontFamily: '"Toyota Type"' }}>*Los valores no incluyen instalación.</span>
                            </div>

                            <hr className="border-black/10" />

                            {/* CTA buttons */}
                            <div className="flex flex-col gap-2.5">
                                <Link
                                    href={`/post-venta/accesorios/${accesorio.id}/cotizar`}
                                    className="flex h-12 cursor-pointer items-center justify-center rounded-[60px] bg-black text-base leading-none text-white transition hover:bg-black/85"
                                    style={{ fontFamily: '"Toyota Type"' }}
                                >
                                    Cotizar
                                </Link>
                                <PostventaWhatsapp config={whatsapp} productName={accesorio.name} />
                            </div>

                            {/* Branches */}
                            <div className="flex flex-col gap-1.5">
                                <span className="text-lg leading-none text-black/60" style={{ fontFamily: '"Toyota Type"' }}>Disponible en:</span>
                                <div className="flex flex-col gap-2.5">
                                    {BRANCHES.map((branch) => (
                                        <a
                                            key={branch.name}
                                            href={branch.mapsUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-5 rounded-[10px] px-10 py-5 transition"
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
                </div>

                <ContactCtaBanner />
                <BranchesSection />

                <div className="bg-black">
                    {footer && <Footer data={footer} />}
                </div>
            </div>
        </>
    );
}
