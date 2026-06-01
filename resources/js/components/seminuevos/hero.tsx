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

    return (
        <section className="flex flex-col items-center lg:mt-20">
            <div className="-mx-5 w-[calc(100%+2.5rem)] lg:mx-0 lg:w-full">
                {media && isVideoUrl(media) ? (
                    <video
                        src={media}
                        className="h-48 w-full object-cover lg:h-auto lg:rounded-[20px]"
                        autoPlay
                        muted
                        loop
                        playsInline
                    />
                ) : (
                    <img
                        src={media || defaultHeroImage}
                        alt={title || 'Seminuevos Musalem'}
                        className="h-48 w-full object-cover lg:h-auto lg:rounded-[20px]"
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
