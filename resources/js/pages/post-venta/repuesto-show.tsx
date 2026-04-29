import { Head, Link } from '@inertiajs/react';
import { Footer } from '@/components/landing/footer';
import { Navbar } from '@/components/landing/navbar';
import { ContactCtaBanner } from '@/components/landing/contact-cta-banner';
import { BranchesSection } from '@/components/landing/branches-section';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import ctaImg from '@images/seminuevos/ejemplo-video.png?format=webp';
import visitanos1 from '@images/seminuevos/visitanos_1.png?format=webp';
import visitanos2 from '@images/seminuevos/visitanos_2.png?format=webp';

type Repuesto = {
    id: number;
    name: string;
    sku: string | null;
    description: string | null;
    price: string | null;
    category: string;
    images: string[];
    stock_la_serena: boolean;
    stock_ovalle: boolean;
};

export default function RepuestoShow({ repuesto, footer }: { repuesto: Repuesto; footer: any }) {
    const [currentImage, setCurrentImage] = useState(0);
    const images = repuesto.images?.length ? repuesto.images : [];

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
            <Head title={`${repuesto.name} — Repuestos Toyota Musalem`} />
            <div className="min-h-screen overflow-x-hidden bg-white">
                <Navbar variant="white" />
                <div className="px-5 pt-25 pb-15 lg:px-15 lg:pt-15 lg:pb-50">
                    {/* Top toolbar */}
                    <div className="flex items-center justify-between gap-2.5 lg:mt-20">
                        <Link
                            href="/post-venta/repuestos"
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
                            {repuesto.name}
                        </h1>

                        {/* Main image */}
                        <div className="relative overflow-hidden rounded-[20px]">
                            {images[currentImage] ? (
                                <img src={images[currentImage]} alt={repuesto.name} className="aspect-square w-full object-cover" />
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
                                <span className="text-2xl font-semibold uppercase leading-none text-black" style={{ fontFamily: '"Toyota Type"' }}>{repuesto.price ?? '—'}</span>
                            </div>
                        </div>

                        {/* CTAs */}
                        <div className="flex flex-col gap-2.5">
                            <Link
                                href={`/post-venta/repuestos/${repuesto.id}/cotizar`}
                                className="flex h-12 cursor-pointer items-center justify-center rounded-[60px] bg-black text-base leading-none text-white transition hover:bg-black/85"
                                style={{ fontFamily: '"Toyota Type"' }}
                            >
                                Cotizar
                            </Link>
                            <a
                                href="#"
                                className="flex h-12 cursor-pointer items-center justify-center gap-2.5 rounded-[60px] bg-[#40BE4C] text-base leading-none text-white transition hover:bg-[#38a843]"
                                style={{ fontFamily: '"Toyota Type"' }}
                            >
                                <svg className="size-5" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                </svg>
                                Whatsapp
                            </a>
                        </div>

                        {/* Branches */}
                        {(repuesto.stock_la_serena || repuesto.stock_ovalle) && (
                            <div className="flex flex-col gap-1.5">
                                <span className="text-base leading-none text-black/60" style={{ fontFamily: '"Toyota Type"' }}>Disponible en:</span>
                                <div className="flex flex-col gap-2.5">
                                    {[
                                        { name: 'Sucursal La Serena', address: 'Av. Francisco de Aguirre #070', url: 'https://www.google.com/maps/search/Av.+Francisco+de+Aguirre+070,+La+Serena,+Chile', available: repuesto.stock_la_serena },
                                        { name: 'Sucursal Ovalle', address: 'Ariztía #358', url: 'https://www.google.com/maps/search/Ovejos+358,+Ovalle,+Chile', available: repuesto.stock_ovalle },
                                    ].filter(b => b.available).map((branch) => (
                                        <a
                                            key={branch.name}
                                            href={branch.url}
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
                        )}

                        {/* Descripción */}
                        {repuesto.description && (
                            <div className="mt-2.5 flex flex-col gap-5 rounded-[20px] bg-[#EAEAF1] p-5">
                                <h2 className="text-xl font-semibold leading-[120%] text-black" style={{ fontFamily: '"Toyota Type"' }}>
                                    Descripción
                                </h2>
                                <p className="whitespace-pre-line text-sm leading-[120%] text-black" style={{ fontFamily: '"Toyota Type"' }}>
                                    {repuesto.description}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* ───────── Desktop layout ───────── */}
                    <div className="mt-10 hidden items-start gap-5 lg:flex">
                        {/* Left column: gallery + details */}
                        <div className="flex w-[65%] flex-col gap-5">
                            {/* Main image */}
                            <div className="relative overflow-hidden rounded-[20px]">
                                {images[currentImage] ? (
                                    <img src={images[currentImage]} alt={repuesto.name} className="h-120 w-full object-cover" />
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
                                        <button
                                            key={i}
                                            onClick={() => setCurrentImage(i)}
                                            className={`h-20 w-25 cursor-pointer overflow-hidden rounded-xl bg-gray-100 transition ${
                                                i === currentImage ? 'ring-2 ring-black' : 'opacity-60 hover:opacity-100'
                                            }`}
                                        >
                                            <img src={img} alt="" className="h-full w-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Descripción */}
                            {repuesto.description && (
                                <div className="mt-5 flex flex-col gap-5 rounded-[20px] bg-[#EAEAF1] p-7.5">
                                    <h2 className="text-2xl font-semibold leading-none text-black" style={{ fontFamily: '"Toyota Type"' }}>
                                        Descripción
                                    </h2>
                                    <p className="whitespace-pre-line text-sm leading-[120%] text-black" style={{ fontFamily: '"Toyota Type"' }}>
                                        {repuesto.description}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Right: Info card */}
                        <div className="flex w-[35%] flex-col gap-5 rounded-[20px] bg-[#EAEAF1] p-7.5">
                            {/* Title */}
                            <h1 className="text-[28px] font-semibold uppercase leading-none text-black" style={{ fontFamily: '"Toyota Type"' }}>
                                {repuesto.name}
                            </h1>

                            {/* Price */}
                            <div className="flex flex-col gap-1.5">
                                <span className="text-base leading-none text-black/60" style={{ fontFamily: '"Toyota Type"' }}>Precio:</span>
                                <div className="rounded-[10px] bg-white p-4">
                                    <span className="text-[28px] font-semibold uppercase leading-none text-black" style={{ fontFamily: '"Toyota Type"' }}>{repuesto.price ?? '—'}</span>
                                </div>
                            </div>

                            <hr className="border-black/10" />

                            {/* CTA buttons */}
                            <div className="flex flex-col gap-2.5">
                                <Link
                                    href={`/post-venta/repuestos/${repuesto.id}/cotizar`}
                                    className="flex h-12 cursor-pointer items-center justify-center rounded-[60px] bg-black text-base leading-none text-white transition hover:bg-black/85"
                                    style={{ fontFamily: '"Toyota Type"' }}
                                >
                                    Cotizar
                                </Link>
                                <a
                                    href="#"
                                    className="flex h-12 cursor-pointer items-center justify-center gap-2.5 rounded-[60px] bg-[#40BE4C] text-base leading-none text-white transition hover:bg-[#38a843]"
                                    style={{ fontFamily: '"Toyota Type"' }}
                                >
                                    <svg className="size-5" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                    </svg>
                                    Whatsapp
                                </a>
                            </div>

                            {/* Branches */}
                            <div className="flex flex-col gap-1.5">
                                <span className="text-base leading-none text-black/60" style={{ fontFamily: '"Toyota Type"' }}>Disponible en:</span>
                                <div className="flex flex-col gap-2.5">
                                    {[
                                        { name: 'Sucursal La Serena', address: 'Av. Francisco de Aguirre #070', url: 'https://www.google.com/maps/search/Av.+Francisco+de+Aguirre+070,+La+Serena,+Chile', available: repuesto.stock_la_serena },
                                        { name: 'Sucursal Ovalle', address: 'Ariztía #358', url: 'https://www.google.com/maps/search/Ovejos+358,+Ovalle,+Chile', available: repuesto.stock_ovalle },
                                    ].filter(b => b.available).map((branch) => (
                                        <a
                                            key={branch.name}
                                            href={branch.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-5 rounded-[10px] bg-white px-5 py-4 transition hover:bg-white/70"
                                        >
                                            <svg className="size-6 shrink-0" viewBox="0 0 17 24" fill="none">
                                                <path d="M8.5 0C3.81 0 0 3.81 0 8.5C0 14.875 8.5 24 8.5 24S17 14.875 17 8.5C17 3.81 13.19 0 8.5 0ZM8.5 11.5C6.84 11.5 5.5 10.16 5.5 8.5S6.84 5.5 8.5 5.5 11.5 6.84 11.5 8.5 10.16 11.5 8.5 11.5Z" fill="#EA4335" />
                                            </svg>
                                            <div className="flex flex-col gap-1.5">
                                                <span className="text-sm leading-none text-black" style={{ fontFamily: '"Toyota Type"' }}>{branch.name}</span>
                                                <span className="text-sm leading-none text-black/60 underline" style={{ fontFamily: '"Toyota Type"' }}>{branch.address}</span>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <ContactCtaBanner image={ctaImg} />
                <BranchesSection image1={visitanos1} image2={visitanos2} />

                <div className="bg-black">
                    {footer && <Footer data={footer} />}
                </div>
            </div>
        </>
    );
}
