import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ArrowIcon } from '@/components/landing/arrow-icon';

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

type ShortsData = {
    label: string;
    title: string;
    description: string;
    button_text: string;
    button_href: string;
    logo: string;
    images: string[];
};

export function Shorts({ data }: { data: ShortsData }) {
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
                                {data.label}
                            </span>
                            <h2 className="text-[32px] leading-none text-white">
                                {data.title.split('\n').map((line, i, arr) => (
                                    <span key={i}>
                                        {line}
                                        {i < arr.length - 1 && <br />}
                                    </span>
                                ))}
                            </h2>
                        </div>
                        <p className="text-base leading-none text-white">
                            {data.description}
                        </p>
                    </div>
                </div>
                <a
                    href={data.button_href}
                    className="flex h-12 items-center gap-2.5 rounded-full bg-white py-1 pr-1 pl-6 text-base leading-none text-black transition hover:bg-white/90"
                >
                    {data.button_text}
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-black">
                        <ArrowIcon className="text-white" />
                    </span>
                </a>
            </div>

            {/* Carousel */}
            <div className="flex flex-col gap-10">
                <div className="overflow-hidden" ref={emblaRef}>
                    <div className="flex gap-5">
                        {data.images.map((image, index) => (
                            <div
                                key={index}
                                className="relative h-[602px] min-w-0 shrink-0 basis-[calc(25%-15px)] cursor-pointer overflow-hidden rounded-[30px]"
                                style={{
                                    backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.2)), url(${image})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundColor: '#333',
                                }}
                            >
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <img src={data.logo} alt="YouTube Shorts" className="w-17" />
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
