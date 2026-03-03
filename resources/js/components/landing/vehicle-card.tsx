import { ArrowIcon } from '@/components/landing/arrow-icon';

type VehicleCardProps = {
    image: string;
    badge: string;
    year: string;
    brand: string;
    name: string;
    km: string;
    transmission: string;
    fuel: string;
    price: string;
    href?: string;
};

export function VehicleCard({
    image,
    badge,
    year,
    brand,
    name,
    km,
    transmission,
    fuel,
    price,
    href = '#',
}: VehicleCardProps) {
    return (
        <div className="flex flex-col overflow-hidden rounded-[20px] border border-black/5 bg-white">
            {/* Image */}
            <div
                className="flex h-60 flex-col p-2.5"
                style={{
                    background: `url(${image}) center / cover no-repeat`,
                }}
            >
                <div className="flex items-center justify-between">
                    <span className="rounded-full bg-black/50 px-2.5 py-1.5 text-sm leading-none text-white backdrop-blur-[10px]">
                        {badge}
                    </span>
                    <span className="rounded-full bg-black/50 px-2.5 py-1.5 text-sm leading-none text-white backdrop-blur-[10px]">
                        {year}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="flex flex-col gap-5 px-2.5 py-5">
                <div className="flex flex-col gap-3 px-2.5">
                    <span className="w-fit rounded bg-[#EAEAF1] px-1.5 py-1.5 text-sm leading-none text-black/60">
                        {brand}
                    </span>
                    <h3 className="text-lg leading-[120%] font-semibold uppercase text-black">
                        {name}
                    </h3>
                    <div className="flex gap-1.5">
                        <span className="flex items-center gap-1 rounded bg-[#EAEAF1] px-1.5 py-1.5 text-sm leading-none text-black/60">
                            {km}
                        </span>
                        <span className="flex items-center gap-1 rounded bg-[#EAEAF1] px-1.5 py-1.5 text-sm leading-none text-black/60">
                            {transmission}
                        </span>
                        <span className="flex items-center gap-1 rounded bg-[#EAEAF1] px-1.5 py-1.5 text-sm leading-none text-black/60">
                            {fuel}
                        </span>
                    </div>
                </div>

                <div className="flex items-center justify-between px-2.5">
                    <span className="text-2xl leading-none font-semibold uppercase text-black">
                        {price}
                    </span>
                    <a
                        href={href}
                        className="flex h-10 items-center gap-2.5 rounded-full bg-black py-1 pr-1 pl-4 text-sm leading-none text-white transition hover:bg-black/85"
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
