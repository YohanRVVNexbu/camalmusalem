import { ArrowIcon } from '@/components/landing/arrow-icon';

type HeroData = {
    background_video: string;
    subtitle: string;
    title: string;
    description: string;
    primary_button: { text: string; href: string };
    secondary_button: { text: string; href: string };
};

export function Hero({ data }: { data: HeroData }) {
    return (
        <section className="relative flex h-dvh flex-col items-center justify-end self-stretch px-15 pb-20">
            {/* Background video */}
            <video
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 size-full object-cover"
            >
                <source src={data.background_video} type="video/mp4" />
            </video>
            {/* Gradient overlay */}
            <div
                className="absolute inset-0"
                style={{
                    background:
                        'linear-gradient(180deg, rgba(0,0,0,0) 47.96%, #000 100%), radial-gradient(50% 50% at 50% 50%, rgba(0,0,0,0) 0%, rgba(0,0,0,0.40) 100%)',
                }}
            />
            <div className="relative z-10 flex w-full items-end justify-between">
                {/* Left content */}
                <div className="flex flex-col gap-4">
                    <span className="text-lg text-white/80">
                        {data.subtitle}
                    </span>
                    <h1 className="text-5xl leading-tight font-bold text-white">
                        {data.title.split('\n').map((line, i, arr) => (
                            <span key={i}>
                                {line}
                                {i < arr.length - 1 && <br />}
                            </span>
                        ))}
                    </h1>
                    <p className="max-w-lg text-base leading-relaxed text-white/70">
                        {data.description.split('\n').map((line, i, arr) => (
                            <span key={i}>
                                {line}
                                {i < arr.length - 1 && <br />}
                            </span>
                        ))}
                    </p>
                </div>

                {/* Right buttons */}
                <div className="flex items-center gap-4">
                    <a
                        href={data.primary_button.href}
                        className="flex h-12 items-center gap-2.5 rounded-full bg-white py-1 pr-1 pl-6 text-lg leading-none text-black transition hover:bg-white/90"
                    >
                        {data.primary_button.text}
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-black">
                            <ArrowIcon className="text-white" />
                        </span>
                    </a>
                    <a
                        href={data.secondary_button.href}
                        className="flex h-12 items-center gap-2.5 rounded-full border border-white py-1 pr-1 pl-6 text-lg leading-none text-white transition hover:bg-white/10"
                    >
                        {data.secondary_button.text}
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white backdrop-blur-[15px]">
                            <ArrowIcon className="text-black" />
                        </span>
                    </a>
                </div>
            </div>
        </section>
    );
}
