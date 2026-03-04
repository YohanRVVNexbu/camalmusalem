import { ArrowIcon } from '@/components/landing/arrow-icon';
import { VehicleCard } from '@/components/landing/vehicle-card';

type VehicleData = {
    image: string;
    badge: string;
    year: string;
    brand: string;
    name: string;
    km: string;
    transmission: string;
    fuel: string;
    price: string;
};

type SeminuevosData = {
    title: string;
    description: string;
    button_text: string;
    button_href: string;
    vehicles: VehicleData[];
};

export function Seminuevos({ data }: { data: SeminuevosData }) {
    return (
        <section id="seminuevos" className="bg-black px-15">
            <div className="flex flex-col gap-10 rounded-[30px] bg-[#EAEAF1] p-15">
                {/* Header */}
                <div className="flex items-end justify-between">
                    <div className="flex flex-col gap-6">
                        <h2 className="text-[32px] leading-none text-black">
                            {data.title}
                        </h2>
                        <p className="text-base leading-none text-black">
                            {data.description}
                        </p>
                    </div>
                    <a
                        href={data.button_href}
                        className="flex h-12 items-center gap-2.5 rounded-full bg-black py-1 pr-1 pl-4 text-base leading-none text-white transition hover:bg-black/85"
                    >
                        {data.button_text}
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white">
                            <ArrowIcon className="text-black" />
                        </span>
                    </a>
                </div>

                {/* Cards */}
                <div className="grid w-full grid-cols-3 gap-5">
                    {data.vehicles.map((vehicle, i) => (
                        <VehicleCard key={i} {...vehicle} />
                    ))}
                </div>
            </div>
        </section>
    );
}
