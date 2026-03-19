import { ArrowIcon } from '@/components/landing/arrow-icon';
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
    certificateBadge,
    href = '#',
}: ProductCardProps) {
    return (
        <div className="relative flex w-81.75 flex-col rounded-[20px] border border-black/5 bg-white">
            {/* Image */}
            <div
                className="h-59.25 rounded-t-[14px] bg-cover bg-center bg-no-repeat p-2.5"
                style={{ backgroundImage: `url(${image})` }}
            >
                <span className="inline-block rounded-full bg-black/50 px-2.5 py-1.5 text-sm leading-none text-white backdrop-blur-[10px]">
                    {badge}
                </span>
            </div>

            {/* Content */}
            <div className="flex flex-col gap-5 px-2.5 py-5">
                <div className="flex flex-col gap-3 px-2.5">
                    {/* Brand + Year + Certificate */}
                    <div className="flex items-center gap-1.5">
                        <span className="rounded bg-[#EAEAF1] px-1.5 py-1.5 text-sm leading-none text-black/60">
                            {brand}
                        </span>
                        <span className="rounded bg-[#EAEAF1] px-1.5 py-1.5 text-sm leading-none text-black/60">
                            {year}
                        </span>
                        {certificateBadge && (
                            <img
                                src={certificateBadge}
                                alt="Certificado"
                                className="-mt-10 ml-auto size-17.5 object-contain"
                            />
                        )}
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
                <div className="flex items-center justify-between px-2.5">
                    <div className="flex flex-col items-end">
                        {originalPrice && (
                            <span className="text-sm font-normal uppercase leading-none text-[#EB0A1E] line-through">
                                {originalPrice}
                            </span>
                        )}
                        <span className="text-2xl font-semibold uppercase leading-none text-black">
                            {price}
                        </span>
                    </div>
                    <a
                        href={href}
                        className="flex h-10 cursor-pointer items-center gap-2.5 rounded-full bg-black p-1 pl-4 text-sm leading-none text-white transition hover:bg-black/85"
                    >
                        Ver más
                        <span className="flex size-7.5 shrink-0 items-center justify-center rounded-full bg-white">
                            <ArrowIcon className="scale-75 text-black" />
                        </span>
                    </a>
                </div>
            </div>
        </div>
    );
}
