import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ArrowIcon } from '@/components/landing/arrow-icon';
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

type ShortsData = {
    label: string;
    title: string;
    description: string;
    button_text: string;
    button_href: string;
    logo: string;
    images: string[];
};

type YouTubeShort = {
    id: string;
    title: string;
    thumbnail: string;
    url: string;
};

export function ShortsCarousel({ data, videos, variant = 'dark' }: { data: ShortsData; videos: YouTubeShort[]; variant?: 'dark' | 'light' }) {
    const [activeVideo, setActiveVideo] = useState<YouTubeShort | null>(null);

    useEffect(() => {
        if (activeVideo) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [activeVideo]);

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

    const hasVideos = videos && videos.length > 0;

    return (
        <>
            <div className="flex flex-col gap-10">
                <div className="overflow-hidden" ref={emblaRef}>
                    <div className="flex gap-5">
                        {hasVideos
                            ? videos.map((video) => (
                                  <button
                                      key={video.id}
                                      onClick={() => setActiveVideo(video)}
                                      className="relative h-[602px] min-w-0 shrink-0 basis-[calc(25%-15px)] cursor-pointer overflow-hidden rounded-[30px]"
                                      style={{
                                          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.2)), url(${video.thumbnail})`,
                                          backgroundSize: 'cover',
                                          backgroundPosition: 'center',
                                          backgroundColor: '#333',
                                      }}
                                  >
                                      <div className="absolute inset-0 flex items-center justify-center">
                                          <img src={data.logo} alt="YouTube Shorts" className="w-17" />
                                      </div>
                                  </button>
                              ))
                            : data.images.map((image, index) => (
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
            </div>

            {/* Modal */}
            {activeVideo && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
                    onClick={() => setActiveVideo(null)}
                >
                    <div
                        className="relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setActiveVideo(null)}
                            className="absolute -top-12 right-0 flex size-10 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-white/30"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                        <iframe
                            src={`https://www.youtube.com/embed/${activeVideo.id}?autoplay=1&loop=1`}
                            className="h-[80vh] w-[45vh] rounded-2xl"
                            allow="autoplay; encrypted-media"
                            allowFullScreen
                        />
                    </div>
                </div>
            )}
        </>
    );
}

export function Shorts({ data, videos }: { data: ShortsData; videos: YouTubeShort[] }) {
    const [activeVideo, setActiveVideo] = useState<YouTubeShort | null>(null);

    useEffect(() => {
        if (activeVideo) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [activeVideo]);

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

    // Usar videos de YouTube si hay, sino fallback a imágenes estáticas
    const hasVideos = videos && videos.length > 0;
    const { ref: sectionRef, visible } = useInView(0.1);

    return (
        <section ref={sectionRef} className="flex flex-col gap-10 self-stretch bg-black px-15 pt-15 pb-25">
            {/* Header */}
            <div className={`flex items-end justify-between self-stretch transition-all duration-700 ease-out ${visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
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
            <div className={`flex flex-col gap-10 transition-all duration-700 delay-200 ease-out ${visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <div className="overflow-hidden" ref={emblaRef}>
                    <div className="flex gap-5">
                        {hasVideos
                            ? videos.map((video) => (
                                  <button
                                      key={video.id}
                                      onClick={() => setActiveVideo(video)}
                                      className="relative h-[602px] min-w-0 shrink-0 basis-[calc(25%-15px)] cursor-pointer overflow-hidden rounded-[30px]"
                                      style={{
                                          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.2)), url(${video.thumbnail})`,
                                          backgroundSize: 'cover',
                                          backgroundPosition: 'center',
                                          backgroundColor: '#333',
                                      }}
                                  >
                                      <div className="absolute inset-0 flex items-center justify-center">
                                          <img src={data.logo} alt="YouTube Shorts" className="w-17" />
                                      </div>
                                  </button>
                              ))
                            : data.images.map((image, index) => (
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

            {/* Modal */}
            {activeVideo && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
                    onClick={() => setActiveVideo(null)}
                >
                    <div
                        className="relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setActiveVideo(null)}
                            className="absolute -top-12 right-0 flex size-10 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-white/30"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                        <iframe
                            src={`https://www.youtube.com/embed/${activeVideo.id}?autoplay=1&loop=1`}
                            className="h-[80vh] w-[45vh] rounded-2xl"
                            allow="autoplay; encrypted-media"
                            allowFullScreen
                        />
                    </div>
                </div>
            )}
        </section>
    );
}
