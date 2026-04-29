import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useEffect, useState } from 'react';
import { ArrowIcon } from '@/components/landing/arrow-icon';
import { VehicleCard } from '@/components/landing/vehicle-card';
import { useInView } from '@/hooks/use-in-view';

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

type VehicleData = {
    image: string;
    badge: string;
    year: string;
    brand: string;
    name: string;
    km: string;
    transmission: string;
    fuel: string;
    price: string;
};

type SeminuevosData = {
    title: string;
    description: string;
    button_text: string;
    button_href: string;
    vehicles: VehicleData[];
};

export function Seminuevos({ data }: { data: SeminuevosData }) {
    const { ref, visible } = useInView(0.1);

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
        emblaApi.on('reInit', onSelect);
        onSelect();
        return () => {
            emblaApi.off('select', onSelect);
            emblaApi.off('reInit', onSelect);
        };
    }, [emblaApi, onSelect]);

    return (
        <section ref={ref} id="seminuevos" className="bg-black md:px-15">
            <div className="flex flex-col items-start justify-center gap-10 self-stretch rounded-[30px] bg-[#EAEAF1] px-5 py-12.25 md:p-15">
                {/* Header */}
                <div className={`flex w-full flex-col items-center gap-5 transition-all duration-700 ease-out md:flex-row md:items-end md:justify-between md:gap-0 ${visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                    <div className="flex flex-col items-center gap-6 md:items-start">
                        <h2
                            className="text-center text-2xl leading-[120%] text-black md:text-left md:text-[32px] md:leading-none"
                            style={{ fontFamily: '"Toyota Type"' }}
                        >
                            {data.title}
                        </h2>
                        <p
                            className="text-center text-base leading-[120%] text-black md:text-left md:leading-none"
                            style={{ fontFamily: '"Toyota Type"' }}
                        >
                            {data.description}
                        </p>
                    </div>
                    <a
                        href={data.button_href}
                        className="flex items-center gap-2.5 rounded-full bg-black p-1 transition hover:bg-black/85"
                    >
                        <span
                            className="px-3.5 text-base leading-none text-white"
                            style={{ fontFamily: '"Toyota Type Book", "Toyota Type", sans-serif' }}
                        >
                            {data.button_text}
                        </span>
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white">
                            <ArrowIcon className="text-black" />
                        </span>
                    </a>
                </div>

                {/* Carousel */}
                <div className={`flex w-full flex-col gap-10 transition-all duration-700 delay-200 ease-out ${visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                    <div className="overflow-hidden" ref={emblaRef}>
                        <div className="flex gap-5">
                            {data.vehicles?.map((vehicle, i) => (
                                <div
                                    key={i}
                                    className="min-w-0 shrink-0 basis-full md:basis-[calc(33.333%-13.333px)]"
                                >
                                    <VehicleCard {...vehicle} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Pagination */}
                    {scrollSnaps.length > 1 && (
                        <div className="flex items-center justify-between">
                            <button
                                onClick={scrollPrev}
                                className="flex size-10 items-center justify-center rounded-full bg-black/20 backdrop-blur-[10px] transition hover:bg-black/30"
                            >
                                <ChevronIcon className="rotate-180 text-black" />
                            </button>
                            <div className="flex items-center gap-5">
                                {scrollSnaps.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => scrollTo(index)}
                                        className={`h-2.5 rounded-[20px] transition-all ${
                                            index === selectedIndex
                                                ? 'w-15 bg-black'
                                                : 'w-2.5 bg-black/40'
                                        }`}
                                    />
                                ))}
                            </div>
                            <button
                                onClick={scrollNext}
                                className="flex size-10 items-center justify-center rounded-full bg-black/20 backdrop-blur-[10px] transition hover:bg-black/30"
                            >
                                <ChevronIcon className="text-black" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
