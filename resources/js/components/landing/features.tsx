import { useRef, useState } from 'react';
import { ArrowIcon } from '@/components/landing/arrow-icon';

type CardData = {
    title: string;
    description: string;
    button_label: string;
    href: string;
    image: string;
    video: string;
};

type CardProps = CardData & { className?: string };

function CategoryCard({
    title,
    description,
    button_label,
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
            <div
                className={`absolute inset-0 bg-cover bg-center transition-opacity duration-500 ${hovering ? 'opacity-0' : 'opacity-100'}`}
                style={{ backgroundImage: `url(${image})` }}
            />
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
            <div
                className="absolute inset-0"
                style={{
                    background:
                        'linear-gradient(to top, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.3) 100%)',
                }}
            />
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
                    {button_label}
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-black">
                        <ArrowIcon className="text-white" />
                    </span>
                </span>
            </div>
        </a>
    );
}

type FeaturesData = {
    heading: string;
    cards: CardData[];
};

export function Features({ data }: { data: FeaturesData }) {
    return (
        <section
            id="features"
            className="flex flex-col items-center gap-10 self-stretch rounded-[30px] bg-[#EEEFF2] p-15"
        >
            <h2 className="text-[40px] leading-normal text-black">
                {data.heading}
            </h2>

            <div className="flex h-150 w-full gap-5">
                {data.cards[0] && (
                    <div className="flex-1">
                        <CategoryCard {...data.cards[0]} className="h-full" />
                    </div>
                )}

                <div className="flex flex-1 flex-col gap-5">
                    {data.cards[1] && (
                        <CategoryCard {...data.cards[1]} className="flex-1" />
                    )}
                    {data.cards[2] && (
                        <CategoryCard {...data.cards[2]} className="flex-1" />
                    )}
                </div>
            </div>
        </section>
    );
}
