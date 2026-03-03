import { ArrowIcon } from '@/components/landing/arrow-icon';

type CardProps = {
    title: string;
    description: string;
    buttonLabel: string;
    href: string;
    image: string;
    className?: string;
};

function CategoryCard({
    title,
    description,
    buttonLabel,
    href,
    image,
    className = '',
}: CardProps) {
    return (
        <a
            href={href}
            className={`group flex flex-col items-center justify-end overflow-hidden rounded-[30px] bg-cover bg-center px-8 py-8 ${className}`}
            style={{
                backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.3) 100%), url(${image})`,
            }}
        >
            <div className="flex flex-col items-center gap-5">
                <div className="flex flex-col items-center gap-2.5 text-center">
                    <h3 className="text-[28px] uppercase text-white">
                        {title}
                    </h3>
                    <p className="text-base font-light text-white">
                        {description}
                    </p>
                </div>
                <span className="flex h-12 items-center gap-2.5 rounded-full bg-white py-1 pr-1 pl-6 text-lg leading-none text-black transition group-hover:bg-white/90">
                    {buttonLabel}
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-black">
                        <ArrowIcon className="text-white" />
                    </span>
                </span>
            </div>
        </a>
    );
}

export function Features() {
    return (
        <section
            id="features"
            className="flex flex-col items-center gap-10 self-stretch bg-[#EEEFF2] p-15"
        >
            <h2 className="text-[40px] leading-normal text-black">
                Encuentra todo en un solo lugar
            </h2>

            <div className="flex h-150 w-full gap-5">
                {/* Left - Nuevos (full height) */}
                <div className="flex-1">
                    <CategoryCard
                        title="Nuevos"
                        description="Explora la gama Toyota disponible en Musalem"
                        buttonLabel="Ir a nuevos"
                        href="#vehiculos"
                        image="/images/imagen_nuevos.png"
                        className="h-full"
                    />
                </div>

                {/* Right column - 2 stacked cards */}
                <div className="flex flex-1 flex-col gap-5">
                    <CategoryCard
                        title="Semi nuevos"
                        description="Stock certificado por Musalem"
                        buttonLabel="Ir a semi nuevos"
                        href="#seminuevos"
                        image="/images/imagen_seminuevos.png"
                        className="flex-1"
                    />
                    <CategoryCard
                        title="Post venta"
                        description="Servicios, repuestos y Merch oficial"
                        buttonLabel="Ir a post venta"
                        href="#postventa"
                        image="/images/image_postventa.png"
                        className="flex-1"
                    />
                </div>
            </div>
        </section>
    );
}
