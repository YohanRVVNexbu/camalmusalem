import { ArrowIcon } from '@/components/landing/arrow-icon';

function ProgramCard({
    title,
    description,
    className = '',
    image,
    bgPosition = 'bg-center',
    showContent = true,
}: {
    title: string;
    description?: string;
    className?: string;
    image: string;
    bgPosition?: string;
    showContent?: boolean;
}) {
    return (
        <div
            className={`group relative flex flex-col justify-end overflow-hidden rounded-[20px] p-6 ${className}`}
        >
            <div
                className={`absolute inset-0 bg-cover ${bgPosition} transition-all duration-700 ease-out group-hover:scale-105 group-hover:opacity-80`}
                style={{ backgroundImage: `url(${image})` }}
            />
            {showContent && (
                <div
                    className="absolute inset-0"
                    style={{
                        background:
                            'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 60%, rgba(0,0,0,0.2) 100%)',
                    }}
                />
            )}
            <div className={`relative z-10 flex items-end ${showContent ? 'justify-between' : 'justify-end'}`}>
                {showContent && (
                    <div className="flex flex-col gap-2">
                        <h3 className="text-[28px] font-semibold leading-none text-white">
                            {title}
                        </h3>
                        {description && (
                            <p className="max-w-xs text-lg font-bold leading-none text-white">
                                {description}
                            </p>
                        )}
                    </div>
                )}
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#E50012] transition group-hover:bg-[#c0000f]">
                    <ArrowIcon className="text-white" />
                </span>
            </div>
        </div>
    );
}

type ProgramasData = {
    title: string;
    button_text: string;
    button_href: string;
    mundo_toyota: {
        title_line1: string;
        title_line2: string;
        description: string;
        subtitle: string;
        button_text: string;
        button_href: string;
        image: string;
    };
    promo_image: string;
    cards: { title: string; description: string; image: string; href: string }[];
    bottom_image: string;
};

export function Programas({ data }: { data: ProgramasData }) {
    return (
        <section className="flex flex-col gap-10 self-stretch bg-black px-15 pt-25 pb-15">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-[32px] leading-none text-white">
                    {data.title}
                </h2>
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

            {/* Cards layout */}
            <div className="flex h-211.5 gap-5">
                {/* Left column */}
                <div className="flex w-101 shrink-0 flex-col gap-5">
                    <div className="group relative flex flex-513 flex-col items-start justify-end gap-2.5 self-stretch overflow-hidden rounded-[20px] px-5 py-7.5">
                        <div
                            className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-out group-hover:scale-105 group-hover:opacity-80"
                            style={{ backgroundImage: `url(${data.mundo_toyota.image})` }}
                        />
                        <div
                            className="absolute inset-0"
                            style={{
                                background:
                                    'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 60%, rgba(0,0,0,0.2) 100%)',
                            }}
                        />
                        <div className="relative z-10 flex flex-col gap-2.5">
                            <h3 className="text-xl font-semibold leading-none text-white">
                                {data.mundo_toyota.title_line1}
                                <br />
                                <span className="text-[#EB0A1E]">{data.mundo_toyota.title_line2}</span>
                            </h3>
                            <p className="text-base font-normal leading-none text-white">
                                {data.mundo_toyota.description}
                            </p>
                            <p className="text-xs font-normal leading-none text-white/60">
                                {data.mundo_toyota.subtitle}
                            </p>
                        </div>
                        <a
                            href={data.mundo_toyota.button_href}
                            className="relative z-10 flex h-11 items-center justify-center self-stretch rounded-[60px] bg-[#EB0A1E] px-5 py-3 text-base font-normal leading-none text-white transition hover:bg-[#c0000f]"
                        >
                            {data.mundo_toyota.button_text}
                        </a>
                    </div>
                    <ProgramCard
                        title=""
                        className="flex-313"
                        image={data.promo_image}
                        showContent={false}
                    />
                </div>

                {/* Right column */}
                <div className="flex flex-1 flex-col gap-5">
                    <div className="flex flex-457 gap-5">
                        {data.cards.map((card, i) => (
                            <ProgramCard
                                key={i}
                                title={card.title}
                                description={card.description}
                                className="flex-1"
                                image={card.image}
                            />
                        ))}
                    </div>
                    <ProgramCard
                        title=""
                        className="flex-369"
                        image={data.bottom_image}
                        bgPosition="bg-center"
                        showContent={false}
                    />
                </div>
            </div>
        </section>
    );
}
