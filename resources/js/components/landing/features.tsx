import { useRef, useState } from 'react';
import imagenNuevos from '@images/imagen_nuevos.png?format=webp';
import imagenSeminuevos from '@images/imagen_seminuevos.png?format=webp';
import imagePostventa from '@images/image_postventa.png?format=webp';
import nuevosVideo from '@videos/nuevos.mp4';
import usadosVideo from '@videos/usados.mp4';
import postventaVideo from '@videos/postventa.mp4';
import { ArrowIcon } from '@/components/landing/arrow-icon';

type CardProps = {
    title: string;
    description: string;
    buttonLabel: string;
    href: string;
    image: string;
    video: string;
    className?: string;
};

function CategoryCard({
    title,
    description,
    buttonLabel,
    href,
    image,
    video,
    className = '',
}: CardProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [hovering, setHovering] = useState(false);

    const handleMouseEnter = () => {
        setHovering(true);
        videoRef.current?.play();
    };

    const handleMouseLeave = () => {
        setHovering(false);
        if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
        }
    };

    return (
        <a
            href={href}
            className={`group relative flex flex-col items-center justify-end overflow-hidden rounded-[30px] px-8 py-8 transition-transform duration-500 ease-out hover:scale-[1.03] ${className}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Background image */}
            <div
                className={`absolute inset-0 bg-cover bg-center transition-opacity duration-500 ${hovering ? 'opacity-0' : 'opacity-100'}`}
                style={{ backgroundImage: `url(${image})` }}
            />
            {/* Background video */}
            <video
                ref={videoRef}
                muted
                loop
                playsInline
                preload="none"
                className={`absolute inset-0 size-full object-cover transition-opacity duration-500 ${hovering ? 'opacity-100' : 'opacity-0'}`}
            >
                <source src={video} type="video/mp4" />
            </video>
            {/* Gradient overlay */}
            <div
                className="absolute inset-0"
                style={{
                    background:
                        'linear-gradient(to top, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.3) 100%)',
                }}
            />
            {/* Content */}
            <div className="relative z-10 flex flex-col items-center gap-5">
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
            className="flex flex-col items-center gap-10 self-stretch rounded-[30px] bg-[#EEEFF2] p-15"
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
                        image={imagenNuevos}
                        video={nuevosVideo}
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
                        image={imagenSeminuevos}
                        video={usadosVideo}
                        className="flex-1"
                    />
                    <CategoryCard
                        title="Post venta"
                        description="Servicios, repuestos y Merch oficial"
                        buttonLabel="Ir a post venta"
                        href="#postventa"
                        image={imagePostventa}
                        video={postventaVideo}
                        className="flex-1"
                    />
                </div>
            </div>
        </section>
    );
}
