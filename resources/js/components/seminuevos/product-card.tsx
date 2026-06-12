import { Link } from '@inertiajs/react';
import { ArrowIcon } from '@/components/landing/arrow-icon';
import { LazyImage } from '@/components/ui/lazy-image';
import { formatCLP, lowestPrice } from '@/lib/format';
import { FuelElectricIcon } from '@/components/icons/fuel-electric-icon';
import { FuelGasIcon } from '@/components/icons/fuel-gas-icon';
import { FuelHybridIcon } from '@/components/icons/fuel-hybrid-icon';
import { SpeedometerIcon } from '@/components/icons/speedometer-icon';
import { TransmissionIcon } from '@/components/icons/transmission-icon';

type ProductCardProps = {
    image: string;
    badge: string;
    year: string;
    brand: string;
    name: string;
    km: string;
    transmission: string;
    fuel: string;
    price: string;
    originalPrice?: string;
    downPayment?: string | null;
    certificateBadge?: string;
    href?: string;
};

function FuelIcon({ fuel }: { fuel: string }) {
    const lower = fuel.toLowerCase();
    if (lower.includes('eléctrico') || lower.includes('electrico')) return <FuelElectricIcon className="text-black" />;
    if (lower.includes('híbrido') || lower.includes('hibrido')) return <FuelHybridIcon className="text-black" />;
    return <FuelGasIcon className="text-black" />;
}

export function ProductCard({
    image,
    badge,
    year,
    brand,
    name,
    km,
    transmission,
    fuel,
    price,
    originalPrice,
    downPayment,
    certificateBadge,
    href = '#',
}: ProductCardProps) {
    // Patrón "Bruno Fritsch" (pedido de gerencia jun 2026): la card muestra
    // el precio MÁS BAJO (financiamiento u oferta) y debajo "Incluye bono $X",
    // donde bono = precio lista − precio mostrado.
    const desde = lowestPrice(price, downPayment) ?? price;
    const listaNum = Number(String(originalPrice ?? price).replace(/[^0-9]/g, '')) || 0;
    const desdeNum = Number(String(desde).replace(/[^0-9]/g, '')) || 0;
    const bono = listaNum > desdeNum ? String(listaNum - desdeNum) : null;
    return (
        <>
            {/* ── Mobile: layout horizontal (imagen izq, contenido der) ── */}
            <div className="flex h-65 w-full overflow-hidden rounded-[20px] border border-black/5 bg-white p-3 lg:hidden">
                <div className="relative h-full w-[42%] shrink-0 overflow-hidden rounded-[14px] p-2">
                    <LazyImage
                        src={image}
                        alt={name}
                        wrapperClassName="absolute inset-0"
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                    <span className="relative inline-block rounded-full bg-black/50 px-2 py-1 text-xs leading-none text-white backdrop-blur-[10px]">
                        {badge}
                    </span>
                    {certificateBadge && (
                        <img
                            src={certificateBadge}
                            alt="Seminuevo Certificado Toyota Musalem"
                            className="absolute right-1.5 top-1.5 size-11 object-contain drop-shadow-md"
                        />
                    )}
                </div>

                <div className="flex flex-1 flex-col gap-2 pl-3">
                    <div className="flex items-center gap-1">
                        <span className="rounded bg-[#EAEAF1] px-1.5 py-1 text-xs leading-none text-black/60">
                            {brand}
                        </span>
                        <span className="rounded bg-[#EAEAF1] px-1.5 py-1 text-xs leading-none text-black/60">
                            {year}
                        </span>
                    </div>

                    <h3 className="line-clamp-2 whitespace-pre-line text-base font-semibold uppercase leading-tight text-black">
                        {name}
                    </h3>

                    <div className="flex flex-wrap gap-1">
                        <span className="flex items-center gap-1 rounded bg-[#EAEAF1] px-1.5 py-1 text-xs leading-none text-black/60">
                            <SpeedometerIcon className="text-black" />
                            {km}
                        </span>
                        <span className="flex items-center gap-1 rounded bg-[#EAEAF1] px-1.5 py-1 text-xs leading-none text-black/60">
                            <TransmissionIcon className="text-black" />
                            {transmission}
                        </span>
                        <span className="flex items-center gap-1 rounded bg-[#EAEAF1] px-1.5 py-1 text-xs leading-none text-black/60">
                            <FuelIcon fuel={fuel} />
                            {fuel}
                        </span>
                    </div>

                    <div className="mt-auto flex flex-col gap-2">
                        <div className="uppercase text-black">
                            <span className="block text-base font-semibold leading-tight">
                                {formatCLP(desde)}
                            </span>
                            {bono && (
                                <span className="mt-0.5 block text-[10px] font-normal normal-case leading-none text-black/70">
                                    Incluye bono <span className="font-semibold text-black">{formatCLP(bono)}</span>
                                </span>
                            )}
                        </div>
                        <Link
                            href={href}
                            className="flex h-9 cursor-pointer items-center justify-between gap-2 rounded-full bg-black px-3 text-xs leading-none text-white transition hover:bg-black/85"
                        >
                            Ver más
                            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-white">
                                <ArrowIcon className="scale-75 text-black" />
                            </span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* ── Desktop: layout vertical original con altura fija ── */}
            <div className="relative hidden w-full flex-col rounded-[20px] border border-black/5 bg-white lg:flex lg:h-130">
                <div className="relative h-59.25 shrink-0 overflow-hidden rounded-t-[14px] p-2.5">
                    <LazyImage
                        src={image}
                        alt={name}
                        wrapperClassName="absolute inset-0"
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                    <span className="relative inline-block rounded-full bg-black/50 px-2.5 py-1.5 text-sm leading-none text-white backdrop-blur-[10px]">
                        {badge}
                    </span>
                    {certificateBadge && (
                        <img
                            src={certificateBadge}
                            alt="Seminuevo Certificado Toyota Musalem"
                            className="absolute right-2.5 top-2.5 size-16 object-contain drop-shadow-md"
                        />
                    )}
                </div>

                <div className="flex flex-1 flex-col gap-5 px-2.5 py-5">
                    <div className="flex flex-col gap-3 px-2.5">
                        <div className="flex items-center gap-1.5">
                            <span className="rounded bg-[#EAEAF1] px-1.5 py-1.5 text-sm leading-none text-black/60">
                                {brand}
                            </span>
                            <span className="rounded bg-[#EAEAF1] px-1.5 py-1.5 text-sm leading-none text-black/60">
                                {year}
                            </span>
                        </div>

                        <h3 className="line-clamp-2 whitespace-pre-line text-lg font-semibold uppercase leading-[120%] text-black">
                            {name}
                        </h3>

                        <div className="flex flex-wrap gap-1.5">
                            <span className="flex items-center gap-1 rounded bg-[#EAEAF1] px-1.5 py-1.5 text-sm leading-none text-black/60">
                                <SpeedometerIcon className="text-black" />
                                {km}
                            </span>
                            <span className="flex items-center gap-1 rounded bg-[#EAEAF1] px-1.5 py-1.5 text-sm leading-none text-black/60">
                                <TransmissionIcon className="text-black" />
                                {transmission}
                            </span>
                            <span className="flex items-center gap-1 rounded bg-[#EAEAF1] px-1.5 py-1.5 text-sm leading-none text-black/60">
                                <FuelIcon fuel={fuel} />
                                {fuel}
                            </span>
                        </div>
                    </div>

                    {/* Price + CTA fijado al fondo del card */}
                    <div className="mt-auto flex flex-col gap-1.5 px-2.5">
                        {downPayment && (
                            <span className="text-xs leading-none text-black/60">
                                Precio con Financiamiento:{' '}
                                <span className="font-semibold text-black">{formatCLP(downPayment)}</span>
                            </span>
                        )}
                        <div className="flex items-center justify-between">
                        <div className="flex flex-col items-start gap-1">
                            <span className="text-2xl font-semibold uppercase leading-none text-black">
                                {formatCLP(desde)}
                            </span>
                            {bono && (
                                <span className="text-xs font-normal leading-none text-black/70">
                                    Incluye bono <span className="font-semibold text-black">{formatCLP(bono)}</span>
                                </span>
                            )}
                        </div>
                        <Link
                            href={href}
                            className="flex h-10 cursor-pointer items-center gap-2.5 rounded-full bg-black p-1 pl-4 text-sm leading-none text-white transition hover:bg-black/85"
                        >
                            Ver más
                            <span className="flex size-7.5 shrink-0 items-center justify-center rounded-full bg-white">
                                <ArrowIcon className="scale-75 text-black" />
                            </span>
                        </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
