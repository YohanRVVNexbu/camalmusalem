import imageGrid1 from '@images/image_grid1.png?format=webp';
import imageGrid2 from '@images/image_grid2.png?format=webp';
import imageGrid3 from '@images/image_grid3.png?format=webp';
import imageGrid4 from '@images/image_grid4.png?format=webp';
import imageGrid5 from '@images/image_grid5.png?format=webp';
import { ArrowIcon } from '@/components/landing/arrow-icon';

function ProgramCard({
    title,
    description,
    className = '',
    image,
    bgPosition = 'bg-center',
    showContent = true,
}: {
    title: string;
    description?: string;
    className?: string;
    image: string;
    bgPosition?: string;
    showContent?: boolean;
}) {
    return (
        <div
            className={`group relative flex flex-col justify-end overflow-hidden rounded-[20px] p-6 ${className}`}
        >
            {/* Background image */}
            <div
                className={`absolute inset-0 bg-cover ${bgPosition} transition-all duration-700 ease-out group-hover:scale-105 group-hover:opacity-80`}
                style={{ backgroundImage: `url(${image})` }}
            />
            {/* Gradient overlay */}
            {showContent && (
                <div
                    className="absolute inset-0"
                    style={{
                        background:
                            'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 60%, rgba(0,0,0,0.2) 100%)',
                    }}
                />
            )}
            {/* Content */}
            <div className={`relative z-10 flex items-end ${showContent ? 'justify-between' : 'justify-end'}`}>
                {showContent && (
                    <div className="flex flex-col gap-2">
                        <h3 className="text-[28px] font-semibold leading-none text-white">
                            {title}
                        </h3>
                        {description && (
                            <p className="max-w-xs text-lg font-bold leading-none text-white">
                                {description}
                            </p>
                        )}
                    </div>
                )}
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
                    <div className="group relative flex flex-513 flex-col items-start justify-end gap-2.5 self-stretch overflow-hidden rounded-[20px] px-5 py-7.5">
                        {/* Background image */}
                        <div
                            className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-out group-hover:scale-105 group-hover:opacity-80"
                            style={{ backgroundImage: `url(${imageGrid1})` }}
                        />
                        {/* Gradient overlay */}
                        <div
                            className="absolute inset-0"
                            style={{
                                background:
                                    'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 60%, rgba(0,0,0,0.2) 100%)',
                            }}
                        />
                        {/* Content */}
                        <div className="relative z-10 flex flex-col gap-2.5">
                            <h3 className="text-xl font-semibold leading-none text-white">
                                Descubre
                                <br />
                                <span className="text-[#EB0A1E]">Mundo Toyota</span>
                            </h3>
                            <p className="text-base font-normal leading-none text-white">
                                Descarga y crea tu cuenta App Mundo Toyota y en Musalem te regalamos un chequeo preventivo.
                            </p>
                            <p className="text-xs font-normal leading-none text-white/60">
                                Disponible en App Store y Google Play
                            </p>
                        </div>
                        <a
                            href="#descargar"
                            className="relative z-10 flex h-11 items-center justify-center self-stretch rounded-[60px] bg-[#EB0A1E] px-5 py-3 text-base font-normal leading-none text-white transition hover:bg-[#c0000f]"
                        >
                            Descargar App
                        </a>
                    </div>
                    <ProgramCard
                        title=""
                        className="flex-313"
                        image={imageGrid4}
                        showContent={false}
                    />
                </div>

                {/* Right column */}
                <div className="flex flex-1 flex-col gap-5">
                    <div className="flex flex-457 gap-5">
                        <ProgramCard
                            title="Llamado a revisión"
                            description="Ingresa y conoce si tu Toyota puede acceder a una revisión gratuita de seguridad."
                            className="flex-1"
                            image={imageGrid2}
                        />
                        <ProgramCard
                            title="Reserva tu hora"
                            description="Servicio técnico"
                            className="flex-1"
                            image={imageGrid3}
                        />
                    </div>
                    {/* KINTO - solo imagen, sin textos */}
                    <ProgramCard
                        title=""
                        className="flex-369"
                        image={imageGrid5}
                        bgPosition="bg-top"
                        showContent={false}
                    />
                </div>
            </div>
        </section>
    );
}
