import { Link } from '@inertiajs/react';

type NuevosProductCardProps = {
    image: string;
    name: string;
    electric?: boolean;
    tags: string[];
    price: string;
    href?: string;
    on360Click?: () => void;
};

function ElectricIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="11" height="14" viewBox="0 0 11 14" fill="none">
            <path d="M4.79427 8.74999L0.612796 8.22499C0.318741 8.18999 0.127487 8.03249 0.0390351 7.75249C-0.0494168 7.47249 0.0124525 7.23333 0.224643 7.03499L7.44077 0.175C7.49958 0.116667 7.57015 0.0730333 7.65249 0.0440999C7.73482 0.0151666 7.84656 0.000466666 7.98771 0C8.22295 0 8.40245 0.0991666 8.52618 0.2975C8.64992 0.495833 8.65275 0.699999 8.53465 0.909999L6.20573 5.25L10.3872 5.775C10.6813 5.81 10.8725 5.9675 10.961 6.2475C11.0494 6.52749 10.9875 6.76666 10.7754 6.96499L3.55923 13.825C3.50042 13.8833 3.42985 13.9272 3.34751 13.9566C3.26518 13.986 3.15344 14.0005 3.01229 14C2.77705 14 2.59755 13.9008 2.47381 13.7025C2.35008 13.5042 2.34725 13.3 2.46535 13.09L4.79427 8.74999Z" fill="black"/>
        </svg>
    );
}

function ArrowRightIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="11" viewBox="0 0 14 11" fill="none">
            <path d="M0.5 5.5L13.5 5.5M13.5 5.5L8.625 10.5M13.5 5.5L8.625 0.5" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    );
}

function RotateArrowIcon({ color = 'white' }: { color?: string }) {
    return (
        <svg width="22" height="20" viewBox="0 0 34 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.4626 20L9.12519 18.6822L13.158 14.6822C9.49098 14.2025 6.38128 13.3004 3.82878 11.9758C1.27626 10.6511 0 9.14451 0 7.45571C0 5.45011 1.64837 3.70611 4.94511 2.22371C8.24186 0.741237 12.2601 0 17 0C21.7399 0 25.7581 0.741237 29.0549 2.22371C32.3516 3.70611 34 5.45011 34 7.45571C34 8.80891 33.1412 10.0913 31.4236 11.3029C29.7059 12.5144 27.4166 13.4452 24.5556 14.0951V12.2088C26.9796 11.5875 28.8452 10.8189 30.1523 9.90311C31.4594 8.98731 32.1124 8.17151 32.1111 7.45571C32.1111 6.38961 30.7656 5.19111 28.0746 3.86021C25.3835 2.52941 21.692 1.86391 17 1.86391C12.308 1.86391 8.61652 2.52941 5.92541 3.86021C3.23441 5.19111 1.88889 6.38961 1.88889 7.45571C1.88889 8.34541 2.93407 9.34021 5.02444 10.4399C7.11481 11.5409 9.76049 12.3194 12.9616 12.7754L9.12334 8.98971L10.4588 7.67191L16.7072 13.836L10.4626 20Z" fill={color}/>
        </svg>
    );
}

export function NuevosProductCard({
    image,
    name,
    electric = false,
    tags,
    price,
    href = '#',
    on360Click,
}: NuevosProductCardProps) {
    return (
        <div className="relative w-81.75 pt-16">
            {/* Vehicle image - overflows above the card */}
            <div className="absolute left-1/2 -top-4 z-10 flex h-36 w-[85%] -translate-x-1/2 items-center justify-center">
                <img
                    src={image}
                    alt={name}
                    className="max-h-full w-full object-contain"
                />
            </div>

            {/* Card body */}
            <div className="relative rounded-[20px] bg-white px-1 pb-3 pt-2">
                {/* Spacer for image area */}
                <div className="h-10" />

                {/* Content */}
                <div className="flex flex-col gap-3.5 overflow-hidden px-2">
                    <div className="flex flex-col items-center gap-3">
                        {/* Name */}
                        <div className="flex items-end gap-1.5">
                            {electric && <ElectricIcon />}
                            <span className="text-xl font-semibold uppercase leading-none text-black">
                                {name}
                            </span>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap items-start justify-center gap-1.25">
                            {tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="rounded-[3.36px] bg-[#EAEAF1] p-1.25 text-sm leading-none text-black/60"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>

                        {/* Price */}
                        <div className="text-center uppercase text-black">
                            <span className="block text-sm leading-none">Desde</span>
                            <span className="block text-xl font-semibold leading-[150%]">
                                $ {price}
                            </span>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex items-center justify-center gap-4.25">
                        <Link
                            href={href}
                            className="flex h-10 items-center gap-2.5 rounded-[60px] border border-transparent bg-black p-1 transition hover:bg-black/85"
                        >
                            <span className="pl-2.5 text-sm leading-none text-white">
                                Ver detalles
                            </span>
                            <span className="flex size-7.5 shrink-0 items-center justify-center rounded-[60px] border border-white/20 bg-white/10" style={{ backdropFilter: 'blur(15px)' }}>
                                <ArrowRightIcon />
                            </span>
                        </Link>
                        <button
                            onClick={on360Click}
                            className="flex h-13 cursor-pointer items-center gap-3.25 rounded-[78px] border border-black py-1.25 pl-4 pr-2 transition hover:bg-black/5"
                        >
                            <span className="text-lg leading-none text-black">360°</span>
                            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-black" style={{ backdropFilter: 'blur(20px)' }}>
                                <RotateArrowIcon />
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
