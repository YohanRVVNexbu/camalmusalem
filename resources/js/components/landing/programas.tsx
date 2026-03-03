import { ArrowIcon } from '@/components/landing/arrow-icon';

function ProgramCard({
    title,
    description,
    className = '',
    bgColor = 'bg-[#1a1a1a]',
}: {
    title: string;
    description?: string;
    className?: string;
    bgColor?: string;
}) {
    return (
        <div
            className={`group relative flex flex-col justify-end overflow-hidden rounded-[20px] p-6 ${bgColor} ${className}`}
        >
            <div className="flex items-end justify-between">
                <div className="flex flex-col gap-2">
                    <h3 className="text-xl font-semibold text-white">
                        {title}
                    </h3>
                    {description && (
                        <p className="max-w-xs text-sm text-white/70">
                            {description}
                        </p>
                    )}
                </div>
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#E50012] transition group-hover:bg-[#c0000f]">
                    <ArrowIcon className="text-white" />
                </span>
            </div>
        </div>
    );
}

export function Programas() {
    return (
        <section className="flex flex-col gap-10 self-stretch bg-black px-15 pt-25 pb-15">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-[32px] leading-none text-white">
                    Programas Toyota
                </h2>
                <a
                    href="#programas"
                    className="flex h-12 items-center gap-2.5 rounded-full bg-white py-1 pr-1 pl-6 text-base leading-none text-black transition hover:bg-white/90"
                >
                    Ver todos
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-black">
                        <ArrowIcon className="text-white" />
                    </span>
                </a>
            </div>

            {/* Cards layout */}
            <div className="flex h-211.5 gap-5">
                {/* Left column */}
                <div className="flex w-101 shrink-0 flex-col gap-5">
                    <ProgramCard
                        title="Descubre Mundo Toyota"
                        description="Descarga y crea tu cuenta App Mundo Toyota y en Musalem te regalamos un chequeo preventivo."
                        className="flex-513"
                        bgColor="bg-[#2a2a2a]"
                    />
                    <ProgramCard
                        title="Toyota 10"
                        description="5 años de garantía + 5 años de cobertura adicional"
                        className="flex-313"
                        bgColor="bg-[#E50012]"
                    />
                </div>

                {/* Right column */}
                <div className="flex flex-1 flex-col gap-5">
                    <div className="flex flex-457 gap-5">
                        <ProgramCard
                            title="Llamado a revisión"
                            description="Ingresa y conoce si tu Toyota puede acceder a una revisión gratuita de seguridad."
                            className="flex-1"
                            bgColor="bg-[#2a2a2a]"
                        />
                        <ProgramCard
                            title="Reserva tu hora"
                            description="Servicio técnico"
                            className="flex-1"
                            bgColor="bg-[#2a2a2a]"
                        />
                    </div>
                    <ProgramCard
                        title="¡Descarga KINTO y muévete en el Toyota que Siempre Soñaste!"
                        description="La nueva App que te permite disfrutar el Toyota que quieras, desde un híbrido hasta una Hilux."
                        className="flex-369"
                        bgColor="bg-[#2a2a2a]"
                    />
                </div>
            </div>
        </section>
    );
}
