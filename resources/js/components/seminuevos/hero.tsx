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

    // Card de 85vh respetando el layout original (padding lateral del wrapper
    // en desktop con rounded corners + full-bleed lateral en mobile). La
    // imagen siempre object-cover para no deformarse con cualquier ratio.
    return (
        <section className="flex flex-col items-center lg:mt-20">
            <div className="relative -mx-5 h-72 w-[calc(100%+2.5rem)] overflow-hidden lg:mx-0 lg:h-125 lg:w-full lg:rounded-[20px]">
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
                        loading="eager"
                        decoding="sync"
                        fetchPriority="high"
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
