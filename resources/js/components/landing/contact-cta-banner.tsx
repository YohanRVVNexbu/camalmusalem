import { ArrowIcon } from '@/components/landing/arrow-icon';
import ejemploVideo from '@images/seminuevos/ejemplo-video.png?format=webp';

interface ContactCtaBannerProps {
    image?: string;
    href?: string;
    text?: string;
    ctaLabel?: string;
    rounded?: 'all' | 'bottom';
}

export function ContactCtaBanner({
    image,
    href = '#',
    text = 'Contáctanos para recibir asesoría personalizada',
    ctaLabel = 'Contactar ventas',
    rounded = 'all',
}: ContactCtaBannerProps) {
    const wrapperRounded = rounded === 'bottom' ? 'rounded-b-[30px]' : '';

    return (
        <div className={`flex flex-col items-center bg-[#EAEAF1] px-5 py-10 lg:p-15 ${wrapperRounded}`}>
            <div className="relative flex h-115 w-full flex-col items-start justify-end gap-2.5 overflow-hidden rounded-[30px] p-5 lg:h-85 lg:p-7.5">
                <img
                    src={image || ejemploVideo}
                    alt=""
                    aria-hidden
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = ejemploVideo; }}
                    className="absolute inset-0 h-full w-full object-cover object-center"
                    style={{ objectPosition: 'center 30%' }}
                />
                <div
                    className="absolute inset-0"
                    style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.10) 0%, rgba(0,0,0,0.65) 100%)' }}
                />
                <div className="relative flex w-full flex-col items-start justify-end gap-7.5 lg:w-auto">
                    <p className="text-2xl leading-[120%] font-semibold text-white lg:w-90 lg:font-normal">
                        {text}
                    </p>
                    <a
                        href={href}
                        className="flex w-full cursor-pointer items-center justify-between self-stretch rounded-[60px] border border-transparent bg-white p-1 transition hover:bg-white/90 lg:w-fit lg:gap-2.5 lg:justify-start lg:self-auto lg:pl-3.5"
                    >
                        <span className="pl-2.5 text-base leading-none text-black lg:pl-0">{ctaLabel}</span>
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-black">
                            <ArrowIcon className="scale-75 text-white" />
                        </span>
                    </a>
                </div>
            </div>
        </div>
    );
}
