import { ArrowIcon } from '@/components/landing/arrow-icon';

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

function MundoToyotaCard({ content }: { content: Record<string, string> }) {
    return (
        <div className="group relative flex h-full flex-col items-start justify-end gap-2.5 overflow-hidden rounded-[20px] px-5 py-7.5">
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

export function Programas({ data }: { data: ProgramasData }) {
    const items = data.grid_items.map((item) => ({
        ...item,
        x: Number(item.x),
        y: Number(item.y),
        w: Number(item.w),
        h: Number(item.h),
    }));

    const maxRow = Math.max(...items.map((i) => i.y + i.h));

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

            {/* Dynamic grid */}
            <div
                className="grid h-211.5 gap-5"
                style={{
                    gridTemplateColumns: 'repeat(6, 1fr)',
                    gridTemplateRows: `repeat(${maxRow}, 1fr)`,
                }}
            >
                {items.map((item) => (
                    <div
                        key={item.id}
                        style={{
                            gridColumn: `${item.x + 1} / span ${item.w}`,
                            gridRow: `${item.y + 1} / span ${item.h}`,
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
