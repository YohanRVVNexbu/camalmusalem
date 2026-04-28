import { ArrowIcon } from '@/components/landing/arrow-icon';
import { useInView } from '@/hooks/use-in-view';

type HeroData = {
    background_video: string;
    subtitle: string;
    title: string;
    description: string;
    primary_button: { text: string; href: string };
    secondary_button: { text: string; href: string };
};

export function Hero({ data }: { data: HeroData }) {
    const { ref, visible } = useInView(0.1);

    const fadeIn = visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0';

    return (
        <section ref={ref} className="relative flex h-dvh flex-col items-center justify-end self-stretch px-5 pb-10 lg:px-15 lg:pb-20">
            {/* Background video */}
            <video autoPlay muted loop playsInline className="absolute inset-0 size-full object-cover object-[50%_30%] lg:object-center">
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

            {/* ── Mobile layout: columna única ── */}
            <div className={`relative z-10 flex w-full flex-col gap-3 transition-all duration-1000 ease-out lg:hidden ${fadeIn}`}>
                <span style={{ fontSize: 14, lineHeight: '120%', fontWeight: 400 }} className="text-white">
                    {data.subtitle}
                </span>
                <h1 style={{ fontSize: 28, lineHeight: '120%', fontWeight: 400 }} className="text-white">
                    {data.title.split('\n').map((line, i, arr) => (
                        <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
                    ))}
                </h1>
                <p style={{ fontSize: 16, lineHeight: '120%', fontWeight: 400 }} className="text-white">
                    {data.description.split('\n').map((line, i, arr) => (
                        <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
                    ))}
                </p>
                <div className="mt-10 flex items-center gap-5 self-stretch">
                    <a
                        href={data.primary_button.href}
                        className="flex flex-1 items-center justify-between rounded-full bg-white p-1 text-sm leading-none text-black transition hover:bg-white/90"
                    >
                        <span className="pl-4">{data.primary_button.text}</span>
                        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-black">
                            <ArrowIcon className="text-white" />
                        </span>
                    </a>
                    <a
                        href={data.secondary_button.href}
                        className="flex flex-1 items-center justify-between rounded-full border border-white p-1 text-sm leading-none text-white transition hover:bg-white/10"
                    >
                        <span className="pl-4">{data.secondary_button.text}</span>
                        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white">
                            <ArrowIcon className="text-black" />
                        </span>
                    </a>
                </div>
            </div>

            {/* ── Desktop layout: texto izquierda / botones derecha ── */}
            <div className="relative z-10 hidden w-full items-end justify-between lg:flex">
                <div className={`flex flex-col gap-4 transition-all duration-1000 ease-out ${fadeIn}`}>
                    <span className="text-lg text-white/80">{data.subtitle}</span>
                    <h1 className="text-5xl font-bold leading-tight text-white">
                        {data.title.split('\n').map((line, i, arr) => (
                            <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
                        ))}
                    </h1>
                    <p className="max-w-lg text-base leading-relaxed text-white/70">
                        {data.description.split('\n').map((line, i, arr) => (
                            <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
                        ))}
                    </p>
                </div>

                <div className={`flex items-center gap-4 transition-all duration-1000 delay-300 ease-out ${fadeIn}`}>
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
