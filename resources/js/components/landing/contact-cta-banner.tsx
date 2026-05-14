import { usePage } from '@inertiajs/react';
import { ArrowIcon } from '@/components/landing/arrow-icon';
import { useIsMobile } from '@/hooks/use-mobile';
import { pickResponsiveImage } from '@/lib/media';
import ejemploVideo from '@images/seminuevos/ejemplo-video.png?format=webp';

type SharedBanner = {
    text?: string;
    button_label?: string;
    button_href?: string;
    image?: string;
    image_mobile?: string;
} | null;

interface ContactCtaBannerProps {
    /** Visual layout. */
    rounded?: 'all' | 'bottom';
    bg?: 'light' | 'dark';
}

export function ContactCtaBanner({
    rounded = 'all',
    bg = 'light',
}: ContactCtaBannerProps) {
    const shared = (usePage().props.contactCtaBanner ?? null) as SharedBanner;
    const isMobile = useIsMobile();

    if (shared === null) return null;

    const text = shared.text || 'Contáctanos para recibir asesoría personalizada';
    const ctaLabel = shared.button_label || 'Contactar ventas';
    const href = shared.button_href || '/contacto';
    const responsiveImage = pickResponsiveImage(shared.image, shared.image_mobile, isMobile);
    const image = responsiveImage || ejemploVideo;

    const wrapperRounded = rounded === 'bottom' ? 'rounded-b-[30px]' : '';
    const wrapperBg = bg === 'dark' ? 'bg-black' : 'bg-[#EAEAF1]';

    return (
        <div className={`flex flex-col items-center px-5 py-10 lg:p-15 ${wrapperBg} ${wrapperRounded}`}>
            <div className="relative flex h-115 w-full flex-col items-start justify-end gap-2.5 overflow-hidden rounded-[30px] bg-neutral-900 p-5 lg:h-85 lg:p-7.5">
                <img
                    src={image}
                    alt=""
                    aria-hidden
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = ejemploVideo; }}
                    className="absolute inset-0 h-full w-full object-cover object-center"
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
