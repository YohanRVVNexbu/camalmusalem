import { useIsMobile } from '@/hooks/use-mobile';
import { isVideoUrl, pickResponsiveImage } from '@/lib/media';
import defaultHeroImage from '@images/seminuevos/hero-image.png?format=webp';

type HeroProps = {
    image?: string | null;
    imageMobile?: string | null;
    /** Texto grande debajo de la imagen del hero (H1 de la sección). */
    sectionTitle?: string | null;
    /** Título opcional que se superpone sobre la imagen del hero. */
    title?: string | null;
    description?: string | null;
};

export function Hero({ image, imageMobile, sectionTitle, title, description }: HeroProps) {
    const isMobile = useIsMobile();
    const media = pickResponsiveImage(image ?? '', imageMobile ?? '', isMobile);
    const finalSectionTitle = sectionTitle?.trim() || 'Seminuevos certificados por Musalem';

    // El Hero rompe lateralmente la padding del wrapper de la página
    // (-mx-5 / lg:-mx-15) para ser full-bleed horizontal, y usa el alto del
    // viewport menos la padding superior del wrapper (pt-25 mobile / lg:pt-15)
    // para llenar exactamente lo visible debajo del navbar.
    return (
        <section className="flex flex-col items-center">
            <div className="relative -mx-5 w-[calc(100%+2.5rem)] h-[calc(100dvh-6.25rem)] overflow-hidden lg:-mx-15 lg:w-[calc(100%+7.5rem)] lg:h-[calc(100dvh-3.75rem)]">
                {media && isVideoUrl(media) ? (
                    <video
                        src={media}
                        className="absolute inset-0 size-full object-cover"
                        autoPlay
                        muted
                        loop
                        playsInline
                    />
                ) : (
                    <img
                        src={media || defaultHeroImage}
                        alt={title || 'Seminuevos Musalem'}
                        className="absolute inset-0 size-full object-cover"
                    />
                )}
            </div>
            <h1 className="py-8 text-center text-2xl font-semibold leading-[150%] text-black lg:py-15 lg:text-[40px]">
                {finalSectionTitle}
            </h1>
            {description && (
                <p className="-mt-4 max-w-3xl px-5 pb-8 text-center text-base leading-[150%] text-black/60 lg:-mt-8 lg:pb-15 lg:text-lg">
                    {description}
                </p>
            )}
        </section>
    );
}
