import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useEffect, useState } from 'react';
import { ArrowIcon } from '@/components/landing/arrow-icon';
import { useInView } from '@/hooks/use-in-view';
import { pickStoreUrl } from '@/lib/platform';

type GridItem = {
    id: string;
    type: 'mundo_toyota' | 'card' | 'image';
    x: number;
    y: number;
    w: number;
    h: number;
    content: { image?: string; href?: string; [key: string]: string | undefined };
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

function MundoToyotaCard({ content }: { content: GridItem['content'] }) {
    return (
        <div className="group relative flex h-full flex-col items-start justify-end gap-2.5 overflow-hidden rounded-[20px] px-5 py-7.5 md:rounded-[20px]">
            <div
                className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-out group-hover:scale-105 group-hover:opacity-80"
                style={content.image ? { backgroundImage: `url(${content.image})` } : undefined}
            />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 60%, rgba(0,0,0,0.2) 100%)' }} />
            <div className="relative z-10 flex flex-col gap-2.5">
                <h3 className="text-xl font-semibold leading-none text-white">
                    {content.title_line1}
                    {content.title_line1 && content.title_line2 && <br />}
                    {content.title_line2 && <span className="text-[#EB0A1E]">{content.title_line2}</span>}
                </h3>
                {content.description && (
                    <p className="text-base font-normal leading-none text-white">{content.description}</p>
                )}
                {content.subtitle && (
                    <p className="text-xs font-normal leading-none text-white/60">{content.subtitle}</p>
                )}
            </div>
            {content.button_text && (
                <a
                    href={content.button_href || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                        // If admin set Android/iOS URLs separately, redirect to the right
                        // store based on the visitor's device.
                        const smart = pickStoreUrl({
                            android: content.button_href_android,
                            ios: content.button_href_ios,
                            fallback: content.button_href,
                        });
                        if (smart && smart !== content.button_href) {
                            e.preventDefault();
                            window.open(smart, '_blank', 'noopener,noreferrer');
                        }
                    }}
                    className="relative z-10 flex h-11 items-center justify-center self-stretch rounded-[60px] bg-[#EB0A1E] px-5 py-3 text-base font-normal leading-none text-white transition hover:bg-[#c0000f]"
                >
                    {content.button_text}
                </a>
            )}
        </div>
    );
}

function ContentCard({ content }: { content: GridItem['content'] }) {
    const inner = (
        <div className="group relative flex h-full flex-col justify-end overflow-hidden rounded-[20px] p-6">
            <div
                className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-out group-hover:scale-105 group-hover:opacity-80"
                style={content.image ? { backgroundImage: `url(${content.image})` } : undefined}
            />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 60%, rgba(0,0,0,0.2) 100%)' }} />
            <div className="relative z-10 flex items-end justify-between">
                <div className="flex flex-col gap-2">
                    {content.title && (
                        <h3 className="text-[28px] font-semibold leading-none text-white">{content.title}</h3>
                    )}
                    {content.description && (
                        <p className="max-w-xs text-lg font-bold leading-none text-white">{content.description}</p>
                    )}
                </div>
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#E50012] transition group-hover:bg-[#c0000f]">
                    <ArrowIcon className="text-white" />
                </span>
            </div>
        </div>
    );
    return content.href ? <a href={content.href} className="block h-full">{inner}</a> : inner;
}

function ImageCard({ content }: { content: GridItem['content'] }) {
    const inner = (
        <div className="group relative h-full overflow-hidden rounded-[20px]">
            <div
                className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-out group-hover:scale-105 group-hover:opacity-80"
                style={content.image ? { backgroundImage: `url(${content.image})` } : undefined}
            />
            <div className="relative z-10 flex h-full items-end justify-end p-6">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#E50012] transition group-hover:bg-[#c0000f]">
                    <ArrowIcon className="text-white" />
                </span>
            </div>
        </div>
    );
    return content.href ? <a href={content.href} className="block h-full">{inner}</a> : inner;
}

function CardWrapper({ item }: { item: GridItem }) {
    if (item.type === 'mundo_toyota') return <MundoToyotaCard content={item.content} />;
    if (item.type === 'card') return <ContentCard content={item.content} />;
    return <ImageCard content={item.content} />;
}

export function Programas({ data }: { data: ProgramasData }) {
    const { ref, visible } = useInView(0.1);

    const items = data.grid_items;
    const topItems = items.filter((i) => i.type === 'mundo_toyota' || i.type === 'card');
    const bottomItems = items.filter((i) => i.type === 'image');

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

            {/* Desktop fixed layout: top row (3 equal columns) + bottom row (1/3 + 2/3) */}
            <div className={`hidden h-211.5 flex-col gap-5 md:flex transition-all duration-700 delay-200 ease-out ${visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                {topItems.length > 0 && (
                    <div className="grid grid-cols-3 gap-5 flex-5">
                        {topItems.map((item, i) => (
                            <div
                                key={item.id ?? `top-${i}`}
                                className={`transition-all duration-700 ease-out ${visible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
                                style={{ transitionDelay: visible ? `${200 + i * 80}ms` : '0ms' }}
                            >
                                <CardWrapper item={item} />
                            </div>
                        ))}
                    </div>
                )}

                {bottomItems.length > 0 && (
                    <div className="grid grid-cols-3 gap-5 flex-4">
                        {bottomItems.map((item, i) => (
                            <div
                                key={item.id ?? `bottom-${i}`}
                                className={`transition-all duration-700 ease-out ${i === 0 ? '' : 'col-span-2'} ${visible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
                                style={{ transitionDelay: visible ? `${200 + (topItems.length + i) * 80}ms` : '0ms' }}
                            >
                                <CardWrapper item={item} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
