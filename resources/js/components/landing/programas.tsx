import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useEffect, useState } from 'react';
import { ArrowIcon } from '@/components/landing/arrow-icon';
import { useInView } from '@/hooks/use-in-view';

type GridItem = {
    id: string;
    type: 'mundo_toyota' | 'card' | 'image';
    x: number;
    y: number;
    w: number;
    h: number;
    content: Record<string, string>;
};

type ProgramasData = {
    title: string;
    button_text: string;
    button_href: string;
    grid_items: GridItem[];
};

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

function MundoToyotaCard({ content }: { content: Record<string, string> }) {
    return (
        <div className="group relative flex h-full flex-col items-start justify-end gap-2.5 overflow-hidden rounded-[20px] px-5 py-7.5 md:rounded-[20px]">
            <div
                className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-out group-hover:scale-105 group-hover:opacity-80"
                style={{ backgroundImage: `url(${content.image})` }}
            />
            <div
                className="absolute inset-0"
                style={{
                    background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 60%, rgba(0,0,0,0.2) 100%)',
                }}
            />
            <div className="relative z-10 flex flex-col gap-2.5">
                <h3 className="text-xl font-semibold leading-none text-white">
                    {content.title_line1}
                    <br />
                    <span className="text-[#EB0A1E]">{content.title_line2}</span>
                </h3>
                <p className="text-base font-normal leading-none text-white">
                    {content.description}
                </p>
                <p className="text-xs font-normal leading-none text-white/60">
                    {content.subtitle}
                </p>
            </div>
            <a
                href={content.button_href}
                className="relative z-10 flex h-11 items-center justify-center self-stretch rounded-[60px] bg-[#EB0A1E] px-5 py-3 text-base font-normal leading-none text-white transition hover:bg-[#c0000f]"
            >
                {content.button_text}
            </a>
        </div>
    );
}

function ContentCard({ content }: { content: Record<string, string> }) {
    return (
        <div className="group relative flex h-full flex-col justify-end overflow-hidden rounded-[20px] p-6">
            <div
                className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-out group-hover:scale-105 group-hover:opacity-80"
                style={{ backgroundImage: `url(${content.image})` }}
            />
            <div
                className="absolute inset-0"
                style={{
                    background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 60%, rgba(0,0,0,0.2) 100%)',
                }}
            />
            <div className="relative z-10 flex items-end justify-between">
                <div className="flex flex-col gap-2">
                    <h3 className="text-[28px] font-semibold leading-none text-white">
                        {content.title}
                    </h3>
                    {content.description && (
                        <p className="max-w-xs text-lg font-bold leading-none text-white">
                            {content.description}
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

function ImageCard({ content }: { content: Record<string, string> }) {
    return (
        <div className="group relative h-full overflow-hidden rounded-[20px]">
            <div
                className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-out group-hover:scale-105 group-hover:opacity-80"
                style={{ backgroundImage: `url(${content.image})` }}
            />
            <div className="relative z-10 flex h-full items-end justify-end p-6">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#E50012] transition group-hover:bg-[#c0000f]">
                    <ArrowIcon className="text-white" />
                </span>
            </div>
        </div>
    );
}

function CardWrapper({ item }: { item: GridItem & { x: number; y: number; w: number; h: number } }) {
    if (item.type === 'mundo_toyota') return <MundoToyotaCard content={item.content} />;
    if (item.type === 'card') return <ContentCard content={item.content} />;
    return <ImageCard content={item.content} />;
}

export function Programas({ data }: { data: ProgramasData }) {
    const { ref, visible } = useInView(0.1);
    const items = data.grid_items.map((item) => ({
        ...item,
        x: Number(item.x),
        y: Number(item.y),
        w: Number(item.w),
        h: Number(item.h),
    }));

    const maxRow = Math.max(...items.map((i) => i.y + i.h));

    // Embla for mobile
    const [emblaRef, emblaApi] = useEmblaCarousel({
        align: 'center',
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
        <section ref={ref} className="flex flex-col gap-10 self-stretch bg-black px-5 pt-15 pb-15 md:px-15 md:pt-25">
            {/* Header */}
            <div className={`flex flex-col items-start gap-5 transition-all duration-700 ease-out md:flex-row md:items-center md:justify-between md:gap-0 ${visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                <h2 className="text-2xl leading-[120%] text-white md:text-[32px] md:leading-none">
                    {data.title}
                </h2>
                <a
                    href={data.button_href}
                    className="flex items-center gap-2.5 rounded-full bg-white p-1 transition hover:bg-white/90"
                >
                    <span className="pl-2.5 text-base leading-none text-black">
                        {data.button_text}
                    </span>
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-black">
                        <ArrowIcon className="text-white" />
                    </span>
                </a>
            </div>

            {/* Mobile carousel */}
            <div className={`flex flex-col gap-10 transition-all duration-700 delay-200 ease-out md:hidden ${visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <div className="overflow-hidden" ref={emblaRef}>
                    <div className="flex gap-5">
                        {items.map((item, i) => (
                            <div
                                key={item.id ?? i}
                                className="shrink-0"
                                style={{ width: '320px', height: '460px', borderRadius: '30px', overflow: 'hidden' }}
                            >
                                <CardWrapper item={item} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Pagination */}
                {scrollSnaps.length > 1 && (
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
                )}
            </div>

            {/* Desktop grid */}
            <div
                className={`hidden h-211.5 gap-5 md:grid transition-all duration-700 delay-200 ease-out ${visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                style={{
                    gridTemplateColumns: 'repeat(6, 1fr)',
                    gridTemplateRows: `repeat(${maxRow}, 1fr)`,
                }}
            >
                {items.map((item, i) => (
                    <div
                        key={item.id}
                        className={`transition-all duration-700 ease-out ${visible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
                        style={{
                            gridColumn: `${item.x + 1} / span ${item.w}`,
                            gridRow: `${item.y + 1} / span ${item.h}`,
                            transitionDelay: visible ? `${200 + i * 80}ms` : '0ms',
                        }}
                    >
                        {item.type === 'mundo_toyota' && <MundoToyotaCard content={item.content} />}
                        {item.type === 'card' && <ContentCard content={item.content} />}
                        {item.type === 'image' && <ImageCard content={item.content} />}
                    </div>
                ))}
            </div>
        </section>
    );
}
