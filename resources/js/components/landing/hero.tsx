import { ArrowIcon } from '@/components/landing/arrow-icon';

export function Hero() {
    return (
        <section
            className="relative flex h-dvh flex-col items-center justify-end self-stretch px-15 pb-20"
            style={{
                background:
                    'linear-gradient(180deg, rgba(0,0,0,0) 47.96%, #000 100%), radial-gradient(50% 50% at 50% 50%, rgba(0,0,0,0) 0%, rgba(0,0,0,0.40) 100%)',
            }}
        >
            <div className="flex w-full items-end justify-between">
                {/* Left content */}
                <div className="flex flex-col gap-4">
                    <span className="text-lg text-white/80">
                        Concesionario Toyota
                    </span>
                    <h1 className="text-5xl leading-tight font-bold text-white">
                        Tu próximo auto,
                        <br />
                        te espera en Musalem
                    </h1>
                    <p className="max-w-lg text-base leading-relaxed text-white/70">
                        Vehículos nuevos, seminuevos certificados y
                        servicio técnico de excelencia.
                        <br />
                        Más de 25 años siendo líderes en la Región de
                        Coquimbo.
                    </p>
                </div>

                {/* Right buttons */}
                <div className="flex items-center gap-4">
                    {/* Primary button */}
                    <a
                        href="#vehiculos"
                        className="flex h-12 items-center gap-2.5 rounded-full bg-white py-1 pr-1 pl-6 text-lg leading-none text-black transition hover:bg-white/90"
                    >
                        Ver catálogo
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-black">
                            <ArrowIcon className="text-white" />
                        </span>
                    </a>
                    {/* Secondary button */}
                    <a
                        href="#cotizar"
                        className="flex h-12 items-center gap-2.5 rounded-full border border-white py-1 pr-1 pl-6 text-lg leading-none text-white transition hover:bg-white/10"
                    >
                        Cotizar
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white backdrop-blur-[15px]">
                            <ArrowIcon className="text-black" />
                        </span>
                    </a>
                </div>
            </div>
        </section>
    );
}
