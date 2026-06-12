import { Link } from '@inertiajs/react';
import { ArrowIcon } from '@/components/landing/arrow-icon';
import { LazyImage } from '@/components/ui/lazy-image';
import { formatCLP, lowestPrice } from '@/lib/format';
import { FuelElectricIcon } from '@/components/icons/fuel-electric-icon';
import { FuelGasIcon } from '@/components/icons/fuel-gas-icon';
import { FuelHybridIcon } from '@/components/icons/fuel-hybrid-icon';
import { SpeedometerIcon } from '@/components/icons/speedometer-icon';
import { TransmissionIcon } from '@/components/icons/transmission-icon';

type ProductListItemProps = {
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

export function ProductListItem({
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
}: ProductListItemProps) {
    // "Desde": menor entre el precio mostrado (oferta o contado) y el de financiamiento.
    const desde = lowestPrice(price, downPayment) ?? price;
    return (
        <div className="relative flex w-full overflow-hidden rounded-[20px] border border-black/5 bg-white">
            {/* Image */}
            <div className="relative h-50 w-75 shrink-0 overflow-hidden rounded-l-[14px] p-2.5">
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
                        className="absolute right-2.5 top-2.5 size-14 object-contain drop-shadow-md"
                    />
                )}
            </div>

            {/* Content */}
            <div className="flex flex-1 items-center justify-between gap-5 px-7.5 py-5">
                <div className="flex flex-col gap-3">
                    {/* Brand + Year */}
                    <div className="flex items-center gap-1.5">
                        <span className="rounded bg-[#EAEAF1] px-1.5 py-1.5 text-sm leading-none text-black/60">
                            {brand}
                        </span>
                        <span className="rounded bg-[#EAEAF1] px-1.5 py-1.5 text-sm leading-none text-black/60">
                            {year}
                        </span>
                    </div>

                    {/* Name */}
                    <h3 className="whitespace-pre-line text-lg font-semibold uppercase leading-[120%] text-black">
                        {name}
                    </h3>

                    {/* Specs */}
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

                {/* Price + CTA */}
                <div className="flex shrink-0 items-center gap-7.5">
                    <div className="flex flex-col items-end">
                        {originalPrice && (
                            <span className="text-sm font-normal uppercase leading-none text-[#EB0A1E] line-through">
                                {formatCLP(originalPrice)}
                            </span>
                        )}
                        <span className="text-sm uppercase leading-none text-black">Desde</span>
                        <span className="text-2xl font-semibold uppercase leading-none text-black">
                            {formatCLP(desde)}
                        </span>
                        {downPayment && (
                            <span className="mt-0.5 text-xs font-normal normal-case leading-none text-black/60">
                                Financiamiento:{' '}
                                <span className="font-semibold text-black">{formatCLP(downPayment)}</span>
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
    );
}
