import { Head } from '@inertiajs/react';
import { Footer } from '@/components/landing/footer';
import { Navbar } from '@/components/landing/navbar';
import { useEffect, useState } from 'react';
import { useInView } from '@/hooks/use-in-view';
import heroImg from '@images/shorts/hero_image.png?format=webp';

type YouTubeShort = {
    id: string;
    title: string;
    thumbnail: string;
    url: string;
};

function PlayIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
            <circle cx="24" cy="24" r="24" fill="white" fillOpacity="0.85" />
            <path d="M20 16L34 24L20 32V16Z" fill="#FF0000" />
        </svg>
    );
}

export default function Shorts({ footer, videos = [] }: { footer: any; videos: YouTubeShort[] }) {
    const heroInView = useInView(0.1);
    const gridInView = useInView(0.05);
    const [activeVideo, setActiveVideo] = useState<YouTubeShort | null>(null);

    useEffect(() => {
        const html = document.documentElement;
        const prev = html.style.backgroundColor;
        html.style.backgroundColor = '#EAEAF1';
        return () => { html.style.backgroundColor = prev; };
    }, []);

    useEffect(() => {
        document.body.style.overflow = activeVideo ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [activeVideo]);

    return (
        <div className="min-h-screen bg-[#EAEAF1]">
            <Head title="Shorts — Toyota Musalem" />
            <Navbar variant="white" />

            <main className="flex flex-col bg-[#EAEAF1]">

                {/* Hero */}
                <section ref={heroInView.ref}>
                    <div
                        className={`flex h-165 flex-col items-start justify-end gap-10 rounded-b-[30px] px-10 py-15 transition-all duration-700 ease-out ${heroInView.visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}
                        style={{
                            background: `linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(0,0,0,0.80) 100%), linear-gradient(0deg, rgba(0,0,0,0.20) 0%, rgba(0,0,0,0.20) 100%), url(${heroImg}) lightgray 50% / cover no-repeat`,
                        }}
                    >
                        <span
                            className="text-[48px] font-normal leading-[100%] text-white"
                            style={{ fontFamily: '"Toyota Type"', fontFeatureSettings: '"liga" off, "clig" off' }}
                        >
                            Shorts Musalem
                        </span>
                    </div>
                </section>

                {/* Grid de shorts */}
                <section ref={gridInView.ref} className="px-15 py-20">
                    <div className={`grid grid-cols-4 gap-5 transition-all duration-700 ease-out ${gridInView.visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                        {videos.map((video) => (
                            <button
                                key={video.id}
                                onClick={() => setActiveVideo(video)}
                                className="group relative cursor-pointer overflow-hidden rounded-[30px]"
                                style={{ width: '100%', aspectRatio: '317.442 / 504' }}
                            >
                                <img
                                    src={video.thumbnail}
                                    alt={video.title}
                                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/10 transition-colors duration-300 group-hover:bg-black/20">
                                    <PlayIcon />
                                </div>
                            </button>
                        ))}
                    </div>
                </section>

            </main>

            {/* Modal */}
            {activeVideo && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
                    onClick={() => setActiveVideo(null)}
                >
                    <div className="relative" onClick={(e) => e.stopPropagation()}>
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

            <div className="bg-[#EAEAF1]">
                <Footer data={footer} />
            </div>
        </div>
    );
}
