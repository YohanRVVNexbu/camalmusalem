import { ArrowIcon } from '@/components/landing/arrow-icon';
import { VehicleCard } from '@/components/landing/vehicle-card';

const vehicles = [
    {
        image: '/images/imagen_seminuevos.png',
        badge: 'Seminuevo',
        year: '2023',
        brand: 'BMW',
        name: 'Bmw x1 sdrive 18l 1.5 T\nConfort',
        km: '53.000 Km',
        transmission: 'AT',
        fuel: 'Diesel',
        price: '$ 29.990.000',
    },
    {
        image: '/images/imagen_seminuevos.png',
        badge: 'Seminuevo',
        year: '2022',
        brand: 'Toyota',
        name: 'Toyota Corolla Cross\n2.0 SEG CVT',
        km: '32.000 Km',
        transmission: 'AT',
        fuel: 'Bencina',
        price: '$ 22.490.000',
    },
    {
        image: '/images/imagen_seminuevos.png',
        badge: 'Seminuevo',
        year: '2024',
        brand: 'Toyota',
        name: 'Toyota Hilux 2.8 SRX\n4x4 AT',
        km: '12.000 Km',
        transmission: 'AT',
        fuel: 'Diesel',
        price: '$ 35.990.000',
    },
];

export function Seminuevos() {
    return (
        <section
            id="seminuevos"
            className="flex flex-col gap-10 rounded-[30px] bg-[#EAEAF1] p-15"
        >
            {/* Header */}
            <div className="flex items-end justify-between">
                <div className="flex flex-col gap-6">
                    <h2 className="text-[32px] leading-none text-black">
                        Seminuevos
                    </h2>
                    <p className="text-base leading-none text-black">
                        Seminuevos Certificados y listos para su
                        entrega.
                    </p>
                </div>
                <a
                    href="#seminuevos"
                    className="flex h-12 items-center gap-2.5 rounded-full bg-black py-1 pr-1 pl-4 text-base leading-none text-white transition hover:bg-black/85"
                >
                    Ver todos
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white">
                        <ArrowIcon className="text-black" />
                    </span>
                </a>
            </div>

            {/* Cards */}
            <div className="grid w-full grid-cols-3 gap-5">
                {vehicles.map((vehicle, i) => (
                    <VehicleCard key={i} {...vehicle} />
                ))}
            </div>
        </section>
    );
}
