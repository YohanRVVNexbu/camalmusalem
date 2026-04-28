import { useRef, useState } from 'react';
import { ArrowIcon } from '@/components/landing/arrow-icon';
import { useInView } from '@/hooks/use-in-view';

type CardData = {
    title: string;
    description: string;
    button_label: string;
    href: string;
    image: string;
    video: string;
};

type CardProps = CardData & { className?: string };

function CategoryCard({ title, description, button_label, href, image, video, className = '' }: CardProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [hovering, setHovering] = useState(false);

    const handleMouseEnter = () => { setHovering(true); videoRef.current?.play(); };
    const handleMouseLeave = () => {
        setHovering(false);
        if (videoRef.current) { videoRef.current.pause(); videoRef.current.currentTime = 0; }
    };

    return (
        <a
            href={href}
            className={`group relative flex flex-col items-center justify-end overflow-hidden rounded-[30px] transition-transform duration-500 ease-out hover:scale-[1.03]
                px-8 py-7.5 gap-2.5
                lg:px-8 lg:py-8 lg:gap-5
                ${className}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div
                className={`absolute inset-0 bg-cover bg-center transition-opacity duration-500 ${hovering ? 'opacity-0' : 'opacity-100'}`}
                style={{ backgroundImage: `url(${image})` }}
            />
            <video
                ref={videoRef}
                muted loop playsInline preload="none"
                className={`absolute inset-0 size-full object-cover transition-opacity duration-500 ${hovering ? 'opacity-100' : 'opacity-0'}`}
            >
                <source src={video} type="video/mp4" />
            </video>
            <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.3) 100%)' }}
            />
            <div className="relative z-10 flex flex-col items-center gap-2.5 lg:gap-5">
                <div className="flex flex-col items-center gap-2.5 text-center">
                    <h3 className="text-[28px] uppercase text-white">{title}</h3>
                    <p className="text-base font-light text-white">{description}</p>
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
    const { ref, visible } = useInView(0.1);

    return (
        <section
            ref={ref}
            id="features"
            className="flex flex-col items-center gap-6 self-stretch rounded-[30px] bg-[#EEEFF2] px-5 py-10 lg:gap-10 lg:p-15"
        >
            {/* Título */}
            <h2
                className={`text-center transition-all duration-700 ease-out ${visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}
                    text-[24px] leading-[120%] font-normal text-black
                    lg:text-[40px] lg:leading-normal`}
            >
                {data.heading}
            </h2>

            {/* ── Mobile: cards apilados ── */}
            <div className="flex w-full flex-col gap-4 lg:hidden">
                {data.cards.map((card, i) => (
                    <div
                        key={i}
                        className={`transition-all duration-700 ease-out ${visible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}
                        style={{ transitionDelay: visible ? `${200 + i * 100}ms` : '0ms' }}
                    >
                        <CategoryCard {...card} className="h-67.75" />
                    </div>
                ))}
            </div>

            {/* ── Desktop: grid original ── */}
            <div className="hidden h-150 w-full gap-5 lg:flex">
                {data.cards[0] && (
                    <div className={`flex-1 transition-all duration-700 delay-200 ease-out ${visible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
                        <CategoryCard {...data.cards[0]} className="h-full" />
                    </div>
                )}
                <div className="flex flex-1 flex-col gap-5">
                    {data.cards[1] && (
                        <div className={`flex-1 transition-all duration-700 delay-300 ease-out ${visible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
                            <CategoryCard {...data.cards[1]} className="h-full" />
                        </div>
                    )}
                    {data.cards[2] && (
                        <div className={`flex-1 transition-all duration-700 delay-[450ms] ease-out ${visible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
                            <CategoryCard {...data.cards[2]} className="h-full" />
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
