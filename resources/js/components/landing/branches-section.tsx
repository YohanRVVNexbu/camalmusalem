import { usePage } from '@inertiajs/react';
import fallback1 from '@images/seminuevos/visitanos_1.png?format=webp';
import fallback2 from '@images/seminuevos/visitanos_2.png?format=webp';

export type BranchData = {
    id?: number;
    name: string;
    address: string | null;
    maps_url: string | null;
    phone_sucursal: string | null;
    phone_repuestos: string | null;
    phones_servicio_tecnico: string[] | null;
    image_path?: string | null;
};

interface BranchesSectionProps {
    title?: string;
    background?: string;
    backgroundStyle?: string;
    textColor?: string;
}

const cardStyle = {
    background: 'linear-gradient(to left, rgba(0,0,0,0.2), rgba(0,0,0,0.2))',
    backdropFilter: 'blur(30px)',
};

const FALLBACK_IMAGES = [fallback1, fallback2];

export function BranchesSection({ title, background, backgroundStyle, textColor }: BranchesSectionProps) {
    const shared = usePage().props as { branchesShared?: BranchData[] };
    const effectiveBranches = shared.branchesShared ?? [];

    const bg = backgroundStyle ? '' : (background ?? 'bg-black');
    const color = textColor ?? 'text-white';
    const heading = title ?? 'Visítanos en\nnuestras sucursales';

    if (effectiveBranches.length === 0) {
        return null;
    }

    return (
        <div className={`flex flex-col items-center gap-7.5 px-5 py-15 lg:gap-10 lg:px-15 lg:py-20 ${bg}`} style={backgroundStyle ? { background: backgroundStyle } : undefined}>
            <h2 className={`text-center text-2xl leading-[120%] lg:text-[32px] ${color}`}>
                {heading.split('\n').map((line, i, arr) => (
                    <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
                ))}
            </h2>
            <div className="flex w-full flex-col gap-5 lg:flex-row">
                {effectiveBranches.map((branch, i) => {
                    const img = branch.image_path || FALLBACK_IMAGES[i % FALLBACK_IMAGES.length];
                    const hasMaps = !!branch.maps_url;
                    const phones = branch.phones_servicio_tecnico ?? [];

                    return (
                        <div key={branch.id ?? branch.name} className="group relative flex-1 overflow-hidden rounded-[20px]">
                            {img && (
                                <img src={img} alt={`Sucursal ${branch.name}`} className="h-100 w-full object-cover lg:h-135" />
                            )}

                            {/* Card acordeón */}
                            <div
                                className="absolute right-2.5 bottom-2.5 left-2.5 overflow-hidden rounded-2xl p-5 transition-all duration-500 ease-in-out lg:right-auto lg:bottom-5 lg:left-5 lg:w-92.25"
                                style={cardStyle}
                            >
                                <div className="flex flex-col gap-4">
                                    {/* Nombre */}
                                    <span className="text-xl font-semibold uppercase leading-none text-white" style={{ fontFamily: '"Toyota Type"' }}>
                                        {branch.name}
                                    </span>

                                    {/* Dirección + link maps */}
                                    <div className="flex flex-col items-start justify-between gap-2 lg:flex-row lg:items-center">
                                        <span className="text-sm leading-none text-white" style={{ fontFamily: '"Toyota Type"' }}>
                                            {branch.address ?? '—'}
                                        </span>
                                        {hasMaps && (
                                            <a
                                                href={branch.maps_url!}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={(e) => e.stopPropagation()}
                                                className="max-w-xs overflow-hidden whitespace-nowrap text-xs font-semibold leading-[120%] text-white underline underline-offset-2 opacity-100 transition-all duration-500 hover:text-white/80 lg:max-w-0 lg:opacity-0 lg:group-hover:max-w-xs lg:group-hover:opacity-100"
                                                style={{ fontFamily: '"Toyota Type"' }}
                                            >
                                                Ver en Google Maps
                                            </a>
                                        )}
                                    </div>

                                    {/* Contenido expandible con teléfonos — siempre abierto en mobile */}
                                    <div className="grid grid-rows-[1fr] transition-all duration-500 ease-in-out lg:grid-rows-[0fr] lg:group-hover:grid-rows-[1fr]">
                                        <div className="overflow-hidden">
                                            <div className="flex flex-col gap-4 pt-0">
                                                <div className="hidden items-center justify-between lg:flex">
                                                    <span className="text-sm font-semibold leading-none text-white" style={{ fontFamily: '"Toyota Type"' }}>
                                                        Ver teléfonos sucursal
                                                    </span>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="17" viewBox="0 0 18 17" fill="none">
                                                        <path d="M0.390625 8H17.1648" stroke="white" />
                                                        <path d="M8.39062 0V16.7742" stroke="white" />
                                                    </svg>
                                                </div>

                                                {branch.phone_sucursal && (
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm leading-none text-white" style={{ fontFamily: '"Toyota Type"' }}>Teléfono sucursal:</span>
                                                        <a href={`tel:${branch.phone_sucursal.replace(/\s|\(|\)/g, '')}`} className="text-sm leading-none text-white hover:text-white/80" style={{ fontFamily: '"Toyota Type"' }}>
                                                            {branch.phone_sucursal}
                                                        </a>
                                                    </div>
                                                )}

                                                {branch.phone_repuestos && (
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm leading-none text-white" style={{ fontFamily: '"Toyota Type"' }}>Teléfono Repuestos:</span>
                                                        <a href={`tel:${branch.phone_repuestos.replace(/\s|\(|\)/g, '')}`} className="text-sm leading-none text-white hover:text-white/80" style={{ fontFamily: '"Toyota Type"' }}>
                                                            {branch.phone_repuestos}
                                                        </a>
                                                    </div>
                                                )}

                                                {phones.length > 0 && (
                                                    <div className="flex items-start justify-between gap-4">
                                                        <span className="text-sm leading-none text-white" style={{ fontFamily: '"Toyota Type"' }}>Teléfono Servicio Técnico:</span>
                                                        <div className="flex flex-col items-end gap-2.5">
                                                            {phones.map((tel) => (
                                                                <a
                                                                    key={tel}
                                                                    href={`tel:${tel.replace(/\s|\(|\)/g, '')}`}
                                                                    className="text-sm leading-none text-white hover:text-white/80"
                                                                    style={{ fontFamily: '"Toyota Type"' }}
                                                                >
                                                                    {tel}
                                                                </a>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Ver detalles — solo en desktop, se oculta en hover */}
                                    <div className="hidden lg:grid grid-rows-[1fr] transition-all duration-500 ease-in-out lg:group-hover:grid-rows-[0fr]">
                                        <div className="overflow-hidden">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-semibold leading-none text-white" style={{ fontFamily: '"Toyota Type"' }}>
                                                    Ver detalles sucursal
                                                </span>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="17" viewBox="0 0 18 17" fill="none">
                                                    <path d="M0.390625 8H17.1648" stroke="white" />
                                                    <path d="M8.39062 0V16.7742" stroke="white" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
