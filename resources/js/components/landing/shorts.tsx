import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { useInView } from '@/hooks/use-in-view';
import { type ShortItem, detectPlatform, embedSrc, shortThumbnail } from '@/lib/video-embed';
import { SOCIAL_NETWORKS } from '@/lib/social-networks';

// Logo de plataforma derivado de la URL del short (no se sube manual).
const PLATFORM_ICON = {
    youtube: SOCIAL_NETWORKS.find((s) => s.key === 'youtube')!.Icon,
    instagram: SOCIAL_NETWORKS.find((s) => s.key === 'instagram')!.Icon,
    tiktok: SOCIAL_NETWORKS.find((s) => s.key === 'tiktok')!.Icon,
};

function PlatformLogo({ url, className }: { url: string; className?: string }) {
    const platform = detectPlatform(url);
    const Icon = platform in PLATFORM_ICON ? PLATFORM_ICON[platform as keyof typeof PLATFORM_ICON] : null;
    if (!Icon) return null;
    return (
        <span className={`inline-flex text-white [&>svg]:h-full [&>svg]:w-full ${className ?? ''}`}>
            <Icon />
        </span>
    );
}

// Modal que reproduce el short embebido al hacer click. Le da espacio al
// video (en vez de meterlo dentro del card chico). Instagram se ve como su
// tarjeta-post (IG controla ese layout); YouTube/TikTok en vertical 9:16.
function ShortModal({ url, onClose }: { url: string; onClose: () => void }) {
    const embed = embedSrc(url);
    const platform = detectPlatform(url);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', onKey);
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = prev;
        };
    }, [onClose]);

    if (!embed) return null;

    return (
        <div
            className="fixed inset-0 z-100 flex items-center justify-center bg-black/80 p-4 animate-in fade-in"
            onClick={onClose}
        >
            <button
                onClick={onClose}
                aria-label="Cerrar"
                className="absolute right-4 top-4 z-10 flex size-11 cursor-pointer items-center justify-center rounded-full bg-white/15 backdrop-blur transition hover:bg-white/25"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path d="M6 6l12 12M18 6L6 18" stroke="white" strokeWidth="2" strokeLinecap="round" />
                </svg>
            </button>
            <div onClick={(e) => e.stopPropagation()}>
                {platform === 'instagram' ? (
                    <iframe
                        src={embed}
                        className="h-[88vh] max-h-175 w-[min(92vw,420px)] rounded-2xl border-0 bg-white"
                        title="Instagram"
                        allow="autoplay; encrypted-media; clipboard-write; picture-in-picture"
                        allowFullScreen
                    />
                ) : (
                    <div className="aspect-9/16 h-[88vh] max-h-200 w-auto overflow-hidden rounded-2xl bg-black">
                        <iframe
                            src={embed}
                            className="h-full w-full border-0"
                            title="Short"
                            allow="autoplay; encrypted-media; picture-in-picture"
                            allowFullScreen
                        />
                    </div>
                )}
            </div>
        </div>
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

type ShortsData = {
    label: string;
    title: string;
    description: string;
    button_text: string;
    button_href: string;
    logo: string;
    images: string[];
};

export function ShortsCarousel({ data, shorts, variant = 'dark' }: { data: ShortsData; shorts: ShortItem[]; variant?: 'dark' | 'light' }) {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

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
        setActiveIndex(null);
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

    const hasShorts = shorts && shorts.length > 0;

    return (
        <div className="flex flex-col gap-10">
            <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex gap-5">
                    {hasShorts
                        ? shorts.map((short, i) => {
                              const embed = embedSrc(short.url);
                              const thumb = shortThumbnail(short);
                              return (
                                  <button
                                      key={i}
                                      onClick={() => {
                                          if (embed) setActiveIndex(i);
                                          else window.open(short.url, '_blank', 'noopener,noreferrer');
                                      }}
                                      className="relative flex w-75 shrink-0 cursor-pointer flex-col items-end justify-end overflow-hidden rounded-[30px] pt-42.5 pr-[110.875px] pl-[17.5px] md:h-150.5 md:w-auto md:min-w-0 md:basis-[calc(25%-15px)] md:p-0"
                                      style={{
                                          backgroundImage: thumb
                                              ? `linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.2)), url(${thumb})`
                                              : 'linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.2))',
                                          backgroundSize: 'cover',
                                          backgroundPosition: 'center',
                                          backgroundColor: '#000',
                                          gap: '257.75px',
                                      }}
                                  >
                                      <PlatformLogo url={short.url} className="size-14 md:hidden" />
                                      <div className="absolute inset-0 hidden items-center justify-center md:flex">
                                          <PlatformLogo url={short.url} className="size-17" />
                                      </div>
                                  </button>
                              );
                          })
                        : data.images.map((image, index) => (
                              <div
                                  key={index}
                                  className="relative flex w-75 shrink-0 cursor-pointer flex-col items-end justify-end overflow-hidden rounded-[30px] pt-42.5 pr-[110.875px] pl-[17.5px] md:h-150.5 md:w-auto md:min-w-0 md:basis-[calc(25%-15px)] md:p-0"
                                  style={{
                                      backgroundImage: image
                                          ? `linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.2)), url(${image})`
                                          : 'linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.2))',
                                      backgroundSize: 'cover',
                                      backgroundPosition: 'center',
                                      backgroundColor: '#333',
                                      gap: '257.75px',
                                  }}
                              >
                                  {/* Mobile: logo bottom-right */}
                                  <img src={data.logo} alt="YouTube Shorts" className="w-14 md:hidden" />
                                  {/* Desktop: logo centered */}
                                  <div className="absolute inset-0 hidden items-center justify-center md:flex">
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
                    className={`flex size-10 items-center justify-center rounded-full backdrop-blur-[10px] transition ${
                        variant === 'light' ? 'bg-black/10 hover:bg-black/20' : 'bg-white/20 hover:bg-white/30'
                    }`}
                >
                    <ChevronIcon className={`rotate-180 ${variant === 'light' ? 'text-black' : 'text-white'}`} />
                </button>
                <div className="flex items-center gap-5">
                    {scrollSnaps.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => scrollTo(index)}
                            className={`h-2.5 rounded-[20px] transition-all ${
                                index === selectedIndex
                                    ? `w-15 ${variant === 'light' ? 'bg-black' : 'bg-white'}`
                                    : `w-2.5 ${variant === 'light' ? 'bg-black/30' : 'bg-white/40'}`
                            }`}
                        />
                    ))}
                </div>
                <button
                    onClick={scrollNext}
                    className={`flex size-10 items-center justify-center rounded-full backdrop-blur-[10px] transition ${
                        variant === 'light' ? 'bg-black/10 hover:bg-black/20' : 'bg-white/20 hover:bg-white/30'
                    }`}
                >
                    <ChevronIcon className={variant === 'light' ? 'text-black' : 'text-white'} />
                </button>
            </div>

            {activeIndex !== null && shorts[activeIndex] && (
                <ShortModal url={shorts[activeIndex].url} onClose={() => setActiveIndex(null)} />
            )}
        </div>
    );
}

export function Shorts({ data, shorts }: { data: ShortsData; shorts: ShortItem[] }) {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

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
        setActiveIndex(null);
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

    // Usar shorts cargados si hay, sino fallback a imágenes estáticas
    const hasShorts = shorts && shorts.length > 0;
    const { ref: sectionRef, visible } = useInView(0.1);

    return (
        <section ref={sectionRef} className="flex flex-col gap-10 self-stretch bg-black px-5 pt-15 pb-15 md:px-15 md:pb-25">
            {/* Header */}
            <div className={`flex flex-col items-start gap-5 self-stretch transition-all duration-700 ease-out md:flex-row md:items-end md:justify-between md:gap-0 ${visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                <div className="flex flex-col gap-5">
                    <div className="flex flex-col gap-2.5">
                        <span className="text-base leading-[120%] text-white">
                            {data.label}
                        </span>
                        <h2 className="text-2xl leading-[120%] text-white md:text-[32px] md:leading-none">
                            {data.title.split('\n').map((line, i, arr) => (
                                <span key={i}>
                                    {line}
                                    {i < arr.length - 1 && <br />}
                                </span>
                            ))}
                        </h2>
                    </div>
                    <p className="text-base leading-[120%] text-white md:leading-none">
                        {data.description}
                    </p>
                </div>
            </div>

            {/* Carousel */}
            <div className={`flex flex-col gap-10 transition-all duration-700 delay-200 ease-out ${visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <div className="overflow-hidden" ref={emblaRef}>
                    <div className="flex gap-5">
                        {hasShorts
                            ? shorts.map((short, i) => {
                                  const embed = embedSrc(short.url);
                                  const thumb = shortThumbnail(short);
                                  return (
                                      <button
                                          key={i}
                                          onClick={() => {
                                              if (embed) setActiveIndex(i);
                                              else window.open(short.url, '_blank', 'noopener,noreferrer');
                                          }}
                                          className="relative shrink-0 cursor-pointer overflow-hidden rounded-[30px] w-75 h-125 md:h-150.5 md:min-w-0 md:basis-[calc(25%-15px)] md:w-auto"
                                          style={{
                                              backgroundImage: thumb
                                                  ? `linear-gradient(0deg, rgba(0,0,0,0.20) 0%, rgba(0,0,0,0.20) 100%), url(${thumb})`
                                                  : 'linear-gradient(0deg, rgba(0,0,0,0.20) 0%, rgba(0,0,0,0.20) 100%)',
                                              backgroundSize: 'cover',
                                              backgroundPosition: 'center',
                                              backgroundColor: '#000',
                                          }}
                                      >
                                          {/* Mobile: logo bottom-right */}
                                          <div className="absolute inset-0 flex flex-col items-end justify-end p-[17.5px] md:hidden">
                                              <PlatformLogo url={short.url} className="size-14" />
                                          </div>
                                          {/* Desktop: logo centered */}
                                          <div className="absolute inset-0 hidden items-center justify-center md:flex">
                                              <PlatformLogo url={short.url} className="size-17" />
                                          </div>
                                      </button>
                                  );
                              })
                            : data.images.map((image, index) => (
                                  <div
                                      key={index}
                                      className="relative shrink-0 cursor-pointer overflow-hidden rounded-[30px] w-75 h-125 md:h-150.5 md:min-w-0 md:basis-[calc(25%-15px)] md:w-auto"
                                      style={{
                                          backgroundImage: image
                                              ? `linear-gradient(0deg, rgba(0,0,0,0.20) 0%, rgba(0,0,0,0.20) 100%), url(${image})`
                                              : 'linear-gradient(0deg, rgba(0,0,0,0.20) 0%, rgba(0,0,0,0.20) 100%)',
                                          backgroundSize: 'cover',
                                          backgroundPosition: 'center',
                                          backgroundColor: '#333',
                                      }}
                                  >
                                      {/* Mobile: logo bottom-right */}
                                      <div className="absolute inset-0 flex flex-col items-end justify-end p-[17.5px] md:hidden">
                                          <img src={data.logo} alt="YouTube Shorts" className="w-14" />
                                      </div>
                                      {/* Desktop: logo centered */}
                                      <div className="absolute inset-0 hidden items-center justify-center md:flex">
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

            {activeIndex !== null && shorts[activeIndex] && (
                <ShortModal url={shorts[activeIndex].url} onClose={() => setActiveIndex(null)} />
            )}
        </section>
    );
}
