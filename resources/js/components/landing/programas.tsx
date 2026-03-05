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

export function Programas({ data }: { data: ProgramasData }) {
    const mundoToyota = data.grid_items.find((i) => i.type === 'mundo_toyota');
    const cards = data.grid_items.filter((i) => i.type === 'card');
    const promoImage = data.grid_items.find((i) => i.id === 'promo-image');
    const bottomImage = data.grid_items.find((i) => i.id === 'bottom-image');

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
                    {mundoToyota && (
                        <div className="group relative flex flex-513 flex-col items-start justify-end gap-2.5 self-stretch overflow-hidden rounded-[20px] px-5 py-7.5">
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-out group-hover:scale-105 group-hover:opacity-80"
                                style={{ backgroundImage: `url(${mundoToyota.content.image})` }}
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
                                    {mundoToyota.content.title_line1}
                                    <br />
                                    <span className="text-[#EB0A1E]">{mundoToyota.content.title_line2}</span>
                                </h3>
                                <p className="text-base font-normal leading-none text-white">
                                    {mundoToyota.content.description}
                                </p>
                                <p className="text-xs font-normal leading-none text-white/60">
                                    {mundoToyota.content.subtitle}
                                </p>
                            </div>
                            <a
                                href={mundoToyota.content.button_href}
                                className="relative z-10 flex h-11 items-center justify-center self-stretch rounded-[60px] bg-[#EB0A1E] px-5 py-3 text-base font-normal leading-none text-white transition hover:bg-[#c0000f]"
                            >
                                {mundoToyota.content.button_text}
                            </a>
                        </div>
                    )}
                    {promoImage && (
                        <ProgramCard
                            title=""
                            className="flex-313"
                            image={promoImage.content.image}
                            showContent={false}
                        />
                    )}
                </div>

                {/* Right column */}
                <div className="flex flex-1 flex-col gap-5">
                    <div className="flex flex-457 gap-5">
                        {cards.map((card) => (
                            <ProgramCard
                                key={card.id}
                                title={card.content.title}
                                description={card.content.description}
                                className="flex-1"
                                image={card.content.image}
                            />
                        ))}
                    </div>
                    {bottomImage && (
                        <ProgramCard
                            title=""
                            className="flex-369"
                            image={bottomImage.content.image}
                            bgPosition="bg-center"
                            showContent={false}
                        />
                    )}
                </div>
            </div>
        </section>
    );
}
