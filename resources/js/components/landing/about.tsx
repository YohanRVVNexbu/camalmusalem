import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowIcon } from '@/components/landing/arrow-icon';
import { useInView } from '@/hooks/use-in-view';

type Vehicle = {
    name: string;
    subtitle: string;
    headline: string;
    image: string;
    video?: string | null;
    background_image?: string | null;
    duration?: number | null;
};

type AboutData = {
    cta_text: string;
    cta_href: string;
    vehicles: Vehicle[];
};

const RING_RADIUS = 20;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

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

function PauseIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
        </svg>
    );
}

function PlaySmallIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 5v14l11-7z" />
        </svg>
    );
}

export function About({ data }: { data: AboutData }) {
    const vehicles = data.vehicles;
    const [activeIndex, setActiveIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const [progress, setProgress] = useState(0);
    const videoRef = useRef<HTMLVideoElement>(null);

    const activeVehicle = vehicles[activeIndex];
    const hasVideo = !!activeVehicle?.video;
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const startTimeRef = useRef(0);
    const elapsedRef = useRef(0);

    const clearImageTimer = useCallback(() => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    }, []);

    const startImageTimer = useCallback(() => {
        const duration = activeVehicle?.duration ?? 5;
        startTimeRef.current = Date.now() - elapsedRef.current * 1000;

        timerRef.current = setInterval(() => {
            const elapsed = (Date.now() - startTimeRef.current) / 1000;
            const p = Math.min(elapsed / duration, 1);
            setProgress(p);
            if (p >= 1) {
                clearImageTimer();
                setProgress(0);
                elapsedRef.current = 0;
                setActiveIndex((prev) => (prev + 1) % vehicles.length);
            }
        }, 50);
    }, [activeVehicle, clearImageTimer, vehicles.length]);

    useEffect(() => {
        setProgress(0);
        elapsedRef.current = 0;

        if (hasVideo) {
            clearImageTimer();
            const video = videoRef.current;
            if (!video) return;
            video.load();
            if (isPlaying) {
                video.play().catch(() => {});
            }
        } else {
            if (isPlaying) {
                startImageTimer();
            }
        }

        return () => clearImageTimer();
    }, [activeIndex]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleTimeUpdate = useCallback(() => {
        const video = videoRef.current;
        if (!video || !video.duration) return;
        setProgress(video.currentTime / video.duration);
    }, []);

    const handleEnded = useCallback(() => {
        setProgress(0);
        setActiveIndex((prev) => (prev + 1) % vehicles.length);
    }, [vehicles.length]);

    const togglePlayPause = () => {
        if (hasVideo) {
            const video = videoRef.current;
            if (!video) return;

            if (isPlaying) {
                video.pause();
                setIsPlaying(false);
            } else {
                video.play().catch(() => {});
                setIsPlaying(true);
            }
        } else {
            if (isPlaying) {
                elapsedRef.current = (Date.now() - startTimeRef.current) / 1000;
                clearImageTimer();
                setIsPlaying(false);
            } else {
                setIsPlaying(true);
                startImageTimer();
            }
        }
    };

    const goTo = (index: number) => {
        setActiveIndex(index);
        setIsPlaying(true);
    };

    const goPrev = () => {
        setActiveIndex((prev) => (prev - 1 + vehicles.length) % vehicles.length);
        setIsPlaying(true);
    };

    const goNext = () => {
        setActiveIndex((prev) => (prev + 1) % vehicles.length);
        setIsPlaying(true);
    };

    const strokeDashoffset = RING_CIRCUMFERENCE * (1 - progress);

    const { ref: sectionRef, visible } = useInView(0.1);

    if (!activeVehicle) return null;

    return (
        <section ref={sectionRef} id="about" className="relative flex h-dvh flex-col justify-end bg-black">
            {hasVideo ? (
                <video
                    ref={videoRef}
                    muted
                    playsInline
                    onTimeUpdate={handleTimeUpdate}
                    onEnded={handleEnded}
                    className="absolute inset-0 size-full object-cover"
                >
                    <source src={activeVehicle.video!} type="video/mp4" />
                </video>
            ) : (
                <img
                    src={activeVehicle.background_image ?? ''}
                    alt={activeVehicle.name}
                    className="absolute inset-0 size-full object-cover"
                />
            )}

            <div className="absolute inset-0 bg-linear-to-b from-black/0 via-black/20 to-black/80" />

            <div className="relative z-10 flex items-end justify-between px-15 pb-15">
                <div className={`flex w-147 flex-col gap-7.5 transition-all duration-1000 ease-out ${visible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
                    <div className="flex flex-col gap-5">
                        <p className="text-base leading-none text-white">
                            <span>{activeVehicle.subtitle} </span>
                            <span className="font-bold">{activeVehicle.name}</span>
                        </p>
                        <h2 className="text-5xl leading-none text-white">
                            {activeVehicle.headline.split('\n').map((line, i) => (
                                <span key={i}>
                                    {line}
                                    {i === 0 && <br />}
                                </span>
                            ))}
                        </h2>
                    </div>
                    <a
                        href={data.cta_href}
                        className="flex h-11 w-fit items-center gap-2.5 rounded-full bg-white py-0.5 pr-0.5 pl-4 text-base leading-none text-black transition hover:bg-white/90"
                    >
                        {data.cta_text}
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-black">
                            <ArrowIcon className="text-white" />
                        </span>
                    </a>
                </div>

                <div className={`flex flex-col items-end gap-5 transition-all duration-1000 delay-300 ease-out ${visible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
                    <button
                        onClick={togglePlayPause}
                        className="relative flex size-12 cursor-pointer items-center justify-center"
                    >
                        <svg className="absolute inset-0 size-full -rotate-90" viewBox="0 0 48 48">
                            <circle cx="24" cy="24" r={RING_RADIUS} fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
                            <circle cx="24" cy="24" r={RING_RADIUS} fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeDasharray={RING_CIRCUMFERENCE} strokeDashoffset={strokeDashoffset} style={{ transition: 'stroke-dashoffset 0.15s linear' }} />
                        </svg>
                        <span className="relative z-10 text-white">
                            {isPlaying ? <PauseIcon /> : <PlaySmallIcon />}
                        </span>
                    </button>

                    <div className="flex gap-2.5">
                        {vehicles.map((vehicle, index) => {
                            const isActive = index === activeIndex;
                            return (
                                <button
                                    key={vehicle.name}
                                    onClick={() => goTo(index)}
                                    className={`group/card flex h-31.25 w-47.25 flex-col items-center justify-center gap-0.5 overflow-hidden rounded-[14px] border backdrop-blur-[17px] transition-all duration-300 ${
                                        isActive
                                            ? 'border-white bg-white/20'
                                            : 'border-white/10 bg-white/5 hover:bg-white/15'
                                    }`}
                                >
                                    <div className="flex h-[74px] w-full items-center justify-center overflow-hidden">
                                        <img
                                            src={vehicle.image}
                                            alt={vehicle.name}
                                            className={`w-auto object-contain transition-all duration-300 ${isActive ? 'h-full scale-110' : 'h-[85%] group-hover/card:scale-110'}`}
                                        />
                                    </div>
                                    <span className="text-[11px] leading-none font-bold text-white">
                                        {vehicle.name}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    <div className="flex w-full items-center justify-between">
                        <button onClick={goPrev} className="flex size-10 cursor-pointer items-center justify-center rounded-full bg-white/10 backdrop-blur-[10px] transition hover:bg-white/20">
                            <ChevronIcon className="rotate-180 text-white" />
                        </button>
                        <button onClick={goNext} className="flex size-10 cursor-pointer items-center justify-center rounded-full bg-white/10 backdrop-blur-[10px] transition hover:bg-white/20">
                            <ChevronIcon className="text-white" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
