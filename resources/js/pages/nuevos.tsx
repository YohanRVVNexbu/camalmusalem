import { Head } from '@inertiajs/react';
import { ArrowIcon } from '@/components/landing/arrow-icon';
import { Footer } from '@/components/landing/footer';
import { Navbar } from '@/components/landing/navbar';
import { WhatsappButton } from '@/components/landing/whatsapp-button';

type Vehicle = {
    image: string;
    name: string;
    category: string;
    price: string;
    href: string;
};

type NuevosData = {
    banner_image: string;
    title: string;
    description: string;
    categories: string[];
    vehicles: Vehicle[];
};

function VehicleNewCard({ vehicle }: { vehicle: Vehicle }) {
    return (
        <div className="group flex flex-col overflow-hidden rounded-[20px] bg-white">
            <div className="relative flex h-56 items-center justify-center bg-[#F5F5F5] p-6">
                <img
                    src={vehicle.image}
                    alt={vehicle.name}
                    className="h-full w-auto object-contain transition-transform duration-500 group-hover:scale-105"
                />
            </div>
            <div className="flex flex-col gap-4 p-5">
                <span className="w-fit rounded bg-[#EAEAF1] px-2 py-1 text-sm leading-none text-black/60">
                    {vehicle.category}
                </span>
                <h3 className="text-lg font-semibold leading-tight text-black">
                    {vehicle.name}
                </h3>
                <div className="flex items-center justify-between">
                    <span className="text-xl font-semibold text-black">
                        {vehicle.price}
                    </span>
                    <a
                        href={vehicle.href}
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

export default function Nuevos({ data, footer }: { data: NuevosData; footer: any }) {
    const categories = data.categories ?? [];
    const vehicles = data.vehicles ?? [];

    return (
        <>
            <Head title="Vehículos Nuevos" />
            <div className="min-h-screen bg-[#1A1A1A] text-foreground">
                <Navbar variant="white" />

                {/* Hero banner */}
                <div
                    className="relative flex h-[400px] items-end bg-cover bg-center"
                    style={{ backgroundImage: `url(${data.banner_image})` }}
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="relative z-10 flex w-full flex-col gap-4 px-15 pb-15">
                        <h1 className="text-5xl font-bold leading-none text-white">
                            {data.title}
                        </h1>
                        <p className="max-w-xl text-lg leading-snug text-white/80">
                            {data.description}
                        </p>
                    </div>
                </div>

                {/* Filters */}
                {categories.length > 0 && (
                    <div className="flex gap-3 px-15 pt-10">
                        <button className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black transition hover:bg-white/90">
                            Todos
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                className="rounded-full border border-white/20 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-white/10"
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                )}

                {/* Grid */}
                <div className="grid grid-cols-1 gap-5 px-15 py-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {vehicles.map((vehicle, i) => (
                        <VehicleNewCard key={i} vehicle={vehicle} />
                    ))}
                </div>

                {footer && <Footer data={footer} />}
                <WhatsappButton />
            </div>
        </>
    );
}
