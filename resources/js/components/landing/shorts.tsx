import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ArrowIcon } from '@/components/landing/arrow-icon';

const shorts = [
    { image: '/images/shorts/short-1.jpg', label: 'TENEMOS' },
    { image: '/images/shorts/short-2.jpg', label: 'A PARTIR DE AHORA' },
    { image: '/images/shorts/short-3.jpg', label: '¿Chequeo gratuito para tu Toyota?' },
    { image: '/images/shorts/short-4.jpg', label: 'VIAJA' },
    { image: '/images/shorts/short-5.jpg', label: 'DESCUBRE' },
    { image: '/images/shorts/short-6.jpg', label: 'NUEVO' },
];

function PlayIcon() {
    return (
        <svg
            width="68"
            height="48"
            viewBox="0 0 68 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M66.52 7.74C65.7 4.59 63.24 2.1 60.12 1.27C54.88 0 34 0 34 0C34 0 13.12 0 7.88 1.27C4.76 2.1 2.3 4.59 1.48 7.74C0.24 13.04 0.24 24 0.24 24C0.24 24 0.24 34.96 1.48 40.26C2.3 43.41 4.76 45.9 7.88 46.73C13.12 48 34 48 34 48C34 48 54.88 48 60.12 46.73C63.24 45.9 65.7 43.41 66.52 40.26C67.76 34.96 67.76 24 67.76 24C67.76 24 67.76 13.04 66.52 7.74Z"
                fill="#FF0000"
            />
            <path d="M27.2 34.29L44.88 24L27.2 13.71V34.29Z" fill="white" />
        </svg>
    );
}

function ChevronIcon({ className }: { className?: string }) {
    return (
        <svg
            width="12"
            height="24"
            viewBox="0 0 12 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <path
                d="M1.5 1.5L10.5 12L1.5 22.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export function Shorts() {
    const [emblaRef, emblaApi] = useEmblaCarousel({
        align: 'start',
        slidesToScroll: 1,
        containScroll: 'trimSnaps',
    });

    const [selectedIndex, setSelectedIndex] = useState(0);
    const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

    const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
    const scrollTo = useCallback(
        (index: number) => emblaApi?.scrollTo(index),
        [emblaApi],
    );

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setSelectedIndex(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        setScrollSnaps(emblaApi.scrollSnapList());
        emblaApi.on('select', onSelect);
        onSelect();
        return () => {
            emblaApi.off('select', onSelect);
        };
    }, [emblaApi, onSelect]);

    return (
        <section className="flex flex-col gap-10 self-stretch bg-black px-15 pt-15 pb-25">
            {/* Header */}
            <div className="flex items-end justify-between self-stretch">
                <div className="flex flex-col gap-10">
                    <div className="flex flex-col gap-5">
                        <div className="flex flex-col gap-2.5">
                            <span className="text-xl leading-none text-white">
                                Shorts
                            </span>
                            <h2 className="text-[32px] leading-none text-white">
                                Mantente
                                <br />
                                actualizado
                            </h2>
                        </div>
                        <p className="text-base leading-none text-white">
                            Novedades, modelos y todo lo que está pasando
                        </p>
                    </div>
                </div>
                <a
                    href="#shorts"
                    className="flex h-12 items-center gap-2.5 rounded-full bg-white py-1 pr-1 pl-6 text-base leading-none text-black transition hover:bg-white/90"
                >
                    Ver todos
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-black">
                        <ArrowIcon className="text-white" />
                    </span>
                </a>
            </div>

            {/* Carousel */}
            <div className="flex flex-col gap-10">
                <div className="overflow-hidden" ref={emblaRef}>
                    <div className="flex gap-5">
                        {shorts.map((short, index) => (
                            <div
                                key={index}
                                className="relative h-[602px] min-w-0 shrink-0 basis-[calc(25%-15px)] cursor-pointer overflow-hidden rounded-[30px]"
                                style={{
                                    backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.2)), url(${short.image})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundColor: '#333',
                                }}
                            >
                                {/* Play icon */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <PlayIcon />
                                </div>
                                {/* Label */}
                                <div className="absolute bottom-6 left-6">
                                    <span className="text-sm font-normal text-white">
                                        {short.label}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between">
                    <button
                        onClick={scrollPrev}
                        className="flex size-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-[10px] transition hover:bg-white/30"
                    >
                        <ChevronIcon className="rotate-180 text-white" />
                    </button>
                    <div className="flex items-center gap-5">
                        {scrollSnaps.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => scrollTo(index)}
                                className={`h-2.5 rounded-[20px] transition-all ${
                                    index === selectedIndex
                                        ? 'w-15 bg-white'
                                        : 'w-2.5 bg-white/40'
                                }`}
                            />
                        ))}
                    </div>
                    <button
                        onClick={scrollNext}
                        className="flex size-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-[10px] transition hover:bg-white/30"
                    >
                        <ChevronIcon className="text-white" />
                    </button>
                </div>
            </div>
        </section>
    );
}
