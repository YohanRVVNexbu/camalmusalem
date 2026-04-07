import { Head, Link } from '@inertiajs/react';
import { Footer } from '@/components/landing/footer';
import { Navbar } from '@/components/landing/navbar';
import { ArrowIcon } from '@/components/landing/arrow-icon';
import { CompareDetailIcon } from '@/components/icons/compare-detail-icon';
import { ShareIcon } from '@/components/icons/share-icon';
import { FuelElectricIcon } from '@/components/icons/fuel-electric-icon';
import { FuelGasIcon } from '@/components/icons/fuel-gas-icon';
import { FuelHybridIcon } from '@/components/icons/fuel-hybrid-icon';
import { SpeedometerIcon } from '@/components/icons/speedometer-icon';
import { TransmissionIcon } from '@/components/icons/transmission-icon';
import certificateImg from '@images/seminuevos/certificate-toyota.png?format=webp';
import visitanos1 from '@images/seminuevos/visitanos_1.png?format=webp';
import visitanos2 from '@images/seminuevos/visitanos_2.png?format=webp';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';

type SpecRow = { label: string; value: string };
type Specs = { general: SpecRow[]; equipment: SpecRow[]; downloads: SpecRow[] };

type Seminuevo = {
    id: number;
    brand: string;
    model: string;
    slug: string | null;
    year: number;
    km: number;
    price: string;
    down_payment: string | null;
    fuel: string | null;
    transmission: string | null;
    traction: string | null;
    doors: number;
    seats: number;
    color: string | null;
    description: string | null;
    gallery: string[];
    featured_gallery: string[];
    specs: Specs | null;
    is_visible: boolean;
};

function FuelIcon({ fuel, className = '' }: { fuel: string; className?: string }) {
    const lower = fuel.toLowerCase();
    if (lower.includes('eléctrico') || lower.includes('electrico')) return <FuelElectricIcon className={className} />;
    if (lower.includes('híbrido') || lower.includes('hibrido')) return <FuelHybridIcon className={className} />;
    return <FuelGasIcon className={className} />;
}

function formatKm(km: number) {
    return km.toLocaleString('es-CL') + ' Km';
}

type DetailsTab = 'general' | 'equipment' | 'downloads';

export default function SeminuevosShow({ seminuevo, footer }: { seminuevo: Seminuevo; footer: any }) {
    const [currentImage, setCurrentImage] = useState(0);
    const [detailsTab, setDetailsTab] = useState<DetailsTab>('general');

    useEffect(() => {
        const html = document.documentElement;
        const prev = html.style.backgroundColor;
        html.style.backgroundColor = '#000';
        return () => { html.style.backgroundColor = prev; };
    }, []);

    const images = seminuevo.gallery ?? [];
    const featuredPhotos = seminuevo.featured_gallery ?? [];
    const specs = seminuevo.specs;

    const prevImage = () => setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    const nextImage = () => setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));

    const title = `${seminuevo.brand} ${seminuevo.model} ${seminuevo.year}`.toUpperCase();
    const vehicleSlug = seminuevo.slug ?? seminuevo.id;

    const tabRows: Record<DetailsTab, SpecRow[]> = {
        general: specs?.general ?? [],
        equipment: specs?.equipment ?? [],
        downloads: specs?.downloads ?? [],
    };

    return (
        <>
            <Head title={title} />
            <div className="min-h-screen bg-[#EAEAF1]">
                <Navbar variant="white" />
                <div style={{ padding: '60px 60px 200px 60px' }}>
                    {/* Top toolbar */}
                    <div className="mt-20 flex items-center justify-between">
                        <Link
                            href="/seminuevos"
                            className="flex h-9.5 cursor-pointer items-center gap-2.5 rounded-[60px] border border-black py-2.5 pr-5 pl-2.5 text-sm leading-none text-black transition hover:bg-black/5"
                        >
                            <span className="flex size-6 items-center justify-center rounded-full bg-black" style={{ backdropFilter: 'blur(9.375px)' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="9" viewBox="0 0 12 9" fill="none">
                                    <path d="M10.6016 4.34961H0.601563M0.601563 4.34961L4.35156 8.09961M0.601563 4.34961L4.35156 0.599609" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </span>
                            Volver
                        </Link>
                        <div className="flex items-center gap-2.5">
                            <Link href={`/seminuevos/comparar?from=/seminuevos/${vehicleSlug}`} className="flex h-9.5 cursor-pointer items-center gap-2.5 rounded-[60px] border border-black px-5 py-2.5 text-sm leading-none text-black transition hover:bg-black hover:text-white">
                                <CompareDetailIcon className="text-current" />
                                Comparar
                            </Link>
                            <button className="flex h-9.5 cursor-pointer items-center gap-2.5 rounded-[60px] border border-black px-5 py-2.5 text-sm leading-none text-black transition hover:bg-black hover:text-white">
                                <ShareIcon className="size-6 text-current" />
                                Compartir
                            </button>
                        </div>
                    </div>

                    {/* Main content */}
                    <div className="mt-10 flex items-start gap-5">
                        {/* Left column: gallery + tabs */}
                        <div className="flex w-[65%] flex-col gap-5">
                            {/* Main image carousel */}
                            <div className="relative overflow-hidden rounded-[20px]">
                                {images.length > 0 ? (
                                    <img
                                        src={images[currentImage]}
                                        alt={title}
                                        className="h-120 w-full object-cover transition-all duration-500"
                                    />
                                ) : (
                                    <div className="h-120 w-full rounded-[20px] bg-[#d0d0d0]" />
                                )}
                                <span className="absolute left-5 top-5 rounded-full bg-black/50 px-3 py-1.5 text-sm leading-none text-white backdrop-blur-[10px]">
                                    Seminuevo
                                </span>
                                {images.length > 1 && (
                                    <>
                                        <button
                                            onClick={prevImage}
                                            className="absolute left-4 top-1/2 flex size-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-[60px] bg-black/80 backdrop-blur-[10px] transition hover:bg-black/60"
                                        >
                                            <ChevronLeft className="size-5 text-white" />
                                        </button>
                                        <button
                                            onClick={nextImage}
                                            className="absolute right-4 top-1/2 flex size-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-[60px] bg-black/80 backdrop-blur-[10px] transition hover:bg-black/60"
                                        >
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
                                            className={`h-20 w-25 cursor-pointer overflow-hidden rounded-xl transition ${
                                                i === currentImage ? 'ring-2 ring-black' : 'opacity-60 hover:opacity-100'
                                            }`}
                                        >
                                            <img src={img} alt="" className="size-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Vehicle details tabs */}
                            <div className="mt-5 flex flex-col gap-5 rounded-[20px] bg-white p-5">
                                <h2 className="text-2xl leading-none text-black">Detalles del vehículo</h2>

                                <div className="flex gap-5">
                                    {([
                                        { key: 'general', label: 'General' },
                                        { key: 'equipment', label: 'Equipamiento y seguridad' },
                                        { key: 'downloads', label: 'Descargables' },
                                    ] as const).map((tab) => (
                                        <button
                                            key={tab.key}
                                            onClick={() => setDetailsTab(tab.key)}
                                            className={`cursor-pointer rounded-[60px] px-5 py-2.5 text-lg leading-none transition ${
                                                detailsTab === tab.key
                                                    ? 'bg-black text-white'
                                                    : 'bg-[#EAEAF1] text-black hover:bg-black/10'
                                            }`}
                                        >
                                            {tab.label}
                                        </button>
                                    ))}
                                </div>

                                <div className="flex flex-col gap-3.5 p-2.5">
                                    {tabRows[detailsTab].length > 0 ? (
                                        tabRows[detailsTab].map((item, i) => (
                                            <div key={i} className="flex items-start justify-between">
                                                <span className="shrink-0 text-sm leading-none text-black">{item.label}</span>
                                                <span className="text-right text-sm leading-[120%] text-black">{item.value}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-black/40">Sin información disponible.</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right: Vehicle info card */}
                        <div className="flex w-[35%] flex-col gap-5 rounded-[20px] bg-white p-7.5">
                            <h1 className="text-[32px] font-bold uppercase leading-none text-black">
                                {title}
                            </h1>

                            {/* Specs pills */}
                            <div className="flex flex-wrap gap-2.5">
                                <span className="flex items-center gap-1.5 rounded-[6px] bg-[#EAEAF1] p-2.5 text-lg leading-none text-black/60">
                                    <SpeedometerIcon className="text-black" />
                                    {formatKm(seminuevo.km)}
                                </span>
                                {seminuevo.transmission && (
                                    <span className="flex items-center gap-1.5 rounded-[6px] bg-[#EAEAF1] p-2.5 text-lg leading-none text-black/60">
                                        <TransmissionIcon className="text-black" />
                                        {seminuevo.transmission}
                                    </span>
                                )}
                                {seminuevo.fuel && (
                                    <span className="flex items-center gap-1.5 rounded-[6px] bg-[#EAEAF1] p-2.5 text-lg leading-none text-black/60">
                                        <FuelIcon fuel={seminuevo.fuel} className="text-black" />
                                        {seminuevo.fuel}
                                    </span>
                                )}
                            </div>

                            {/* Specs table */}
                            <div className="flex flex-col">
                                {[
                                    ['Marca', seminuevo.brand],
                                    ['Modelo', seminuevo.model],
                                    ['Año', String(seminuevo.year)],
                                    seminuevo.traction ? ['Tracción', seminuevo.traction] : null,
                                    seminuevo.color ? ['Color exterior', seminuevo.color] : null,
                                    ['Estado', 'Disponible'],
                                ].filter(Boolean).map(([label, value], i, arr) => (
                                    <div key={label}>
                                        <div className="flex items-center gap-10 py-3">
                                            <span className="w-30 shrink-0 text-base leading-none text-black/60">{label}</span>
                                            <span className="text-base font-semibold leading-none text-black/60">{value}</span>
                                        </div>
                                        {i < arr.length - 1 && <hr className="border-black/10" />}
                                    </div>
                                ))}
                            </div>

                            {/* Price */}
                            <div className="flex flex-col gap-1.5">
                                <span className="text-lg leading-none text-black/60">Precio:</span>
                                <div className="rounded-[10px] bg-[#EAEAF1] p-4">
                                    <span className="text-[28px] font-semibold uppercase leading-none text-black">{seminuevo.price}</span>
                                </div>
                            </div>

                            {/* Down payment */}
                            {seminuevo.down_payment && (
                                <div className="flex items-center gap-1.5 rounded-[10px] bg-[#EAEAF1] px-5 py-2.5">
                                    <span className="text-lg leading-none text-black/60">Pie mínimo</span>
                                    <span className="text-lg font-semibold uppercase leading-none text-black">{seminuevo.down_payment}</span>
                                </div>
                            )}

                            <hr className="border-black/10" />

                            {/* CTA buttons */}
                            <div className="flex flex-col gap-2.5">
                                <a
                                    href="#"
                                    className="flex h-12 cursor-pointer items-center justify-center rounded-[60px] bg-black text-base leading-none text-white transition hover:bg-black/85"
                                >
                                    Cotizar
                                </a>
                                <a
                                    href="#"
                                    className="flex h-12 cursor-pointer items-center justify-center gap-2.5 rounded-[60px] bg-[#40BE4C] text-base leading-none text-white transition hover:bg-[#38a843]"
                                >
                                    <svg className="size-5" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                    </svg>
                                    Whatsapp
                                </a>
                            </div>

                            {/* Branch */}
                            <div className="flex flex-col gap-1.5">
                                <span className="text-lg leading-none text-black/60">Disponible en:</span>
                                <a
                                    href="https://www.google.com/maps/search/Av.+Francisco+de+Aguirre+070,+La+Serena,+Chile"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-5 rounded-[10px] bg-[#EAEAF1] px-10 py-5 transition hover:bg-[#dddde6]"
                                >
                                    <svg className="size-6 shrink-0" viewBox="0 0 17 24" fill="none">
                                        <path d="M8.5 0C3.81 0 0 3.81 0 8.5C0 14.875 8.5 24 8.5 24S17 14.875 17 8.5C17 3.81 13.19 0 8.5 0ZM8.5 11.5C6.84 11.5 5.5 10.16 5.5 8.5S6.84 5.5 8.5 5.5 11.5 6.84 11.5 8.5 10.16 11.5 8.5 11.5Z" fill="#EA4335" />
                                    </svg>
                                    <div className="flex flex-col gap-2">
                                        <span className="text-base leading-none text-black/60">Sucursal La Serena</span>
                                        <span className="text-base leading-none text-black/60 underline">Av. Francisco de Aguirre #070</span>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Featured photos */}
                    {featuredPhotos.length > 0 && (
                        <div className="mt-15 flex flex-col gap-10">
                            <h2 className="text-[32px] leading-none text-black">Fotos destacadas</h2>
                            <div className="flex gap-5">
                                {featuredPhotos.map((img, i) => (
                                    <img
                                        key={i}
                                        src={img}
                                        alt={`Foto destacada ${i + 1}`}
                                        className="h-100 flex-1 rounded-[19px] object-cover"
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Contact CTA banner */}
                <div className="flex flex-col items-center rounded-b-[30px] bg-white p-15">
                    <div
                        className="flex w-full flex-col items-start justify-end rounded-[30px] p-7.5"
                        style={{
                            backgroundImage: images.length > 0
                                ? `linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 100%), url(${images[0]})`
                                : 'linear-gradient(180deg, #888 0%, #333 100%)',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            height: '340px',
                        }}
                    >
                        <div className="flex flex-col gap-7.5">
                            <p className="w-90 text-2xl leading-[120%] text-white">
                                Contáctanos para recibir asesoría personalizada
                            </p>
                            <a
                                href="#"
                                className="flex w-fit cursor-pointer items-center gap-2.5 rounded-[60px] bg-white p-1 pl-3.5 text-base leading-none text-black transition hover:bg-white/90"
                            >
                                Contactar ventas
                                <span className="flex size-10 items-center justify-center rounded-full bg-black">
                                    <ArrowIcon className="scale-75 text-white" />
                                </span>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Branches section */}
                <div className="flex flex-col items-center gap-10 bg-black px-15 py-20">
                    <h2 className="text-center text-[32px] leading-[120%] text-white">
                        Visítanos en
                        <br />
                        nuestras sucursales
                    </h2>
                    <div className="flex w-full gap-5">
                        <div className="relative flex-1 overflow-hidden rounded-[20px]">
                            <img src={visitanos1} alt="Sucursal La Serena" className="h-85 w-full object-cover" />
                            <div className="absolute bottom-5 left-5 flex w-92.25 flex-col gap-2.5 rounded-2xl p-5" style={{ background: 'linear-gradient(0deg, rgba(0,0,0,0.20) 0%, rgba(0,0,0,0.20) 100%), rgba(255,255,255,0.20)', backdropFilter: 'blur(30px)' }}>
                                <span className="text-xl font-semibold uppercase leading-none text-white">La Serena</span>
                                <span className="text-sm leading-none text-white">Av. Francisco de Aguirre #70</span>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-semibold leading-none text-white">Ver detalles sucursal</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="17" viewBox="0 0 18 17" fill="none">
                                        <path d="M0.390625 8H17.1648" stroke="white" />
                                        <path d="M8.39062 0V16.7742" stroke="white" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div className="relative flex-1 overflow-hidden rounded-[20px]">
                            <img src={visitanos2} alt="Sucursal Ovalle" className="h-85 w-full object-cover" />
                            <div className="absolute bottom-5 left-5 flex w-92.25 flex-col gap-2.5 rounded-2xl p-5" style={{ background: 'linear-gradient(0deg, rgba(0,0,0,0.20) 0%, rgba(0,0,0,0.20) 100%), rgba(255,255,255,0.20)', backdropFilter: 'blur(30px)' }}>
                                <span className="text-xl font-semibold uppercase leading-none text-white">Ovalle</span>
                                <span className="text-sm leading-none text-white">Ariztía #358</span>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-semibold leading-none text-white">Ver detalles sucursal</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="17" viewBox="0 0 18 17" fill="none">
                                        <path d="M0.390625 8H17.1648" stroke="white" />
                                        <path d="M8.39062 0V16.7742" stroke="white" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-black">
                    {footer && <Footer data={footer} />}
                </div>
            </div>
        </>
    );
}
