import { Head, usePage } from '@inertiajs/react';
import { About } from '@/components/landing/about';
import { Features } from '@/components/landing/features';
import { Footer } from '@/components/landing/footer';
import { Hero } from '@/components/landing/hero';
import { Navbar } from '@/components/landing/navbar';
import { Programas } from '@/components/landing/programas';
import { Seminuevos } from '@/components/landing/seminuevos';
import { Shorts } from '@/components/landing/shorts';

type YouTubeShort = {
    id: string;
    title: string;
    thumbnail: string;
    url: string;
};

type WelcomeProps = {
    sections: Record<string, unknown>;
    youtubeShorts: YouTubeShort[];
};

export default function Welcome({ sections, youtubeShorts }: WelcomeProps) {
    const { auth } = usePage().props;

    // Preload de la imagen del hero: el browser empieza a descargarla en
    // paralelo con el JS, no después. Solo aplica si el media es imagen
    // (los videos se manejan con <video preload="auto"> nativo). El header
    // viaja con el HTML de Inertia, así que el navegador la ve sin esperar.
    const heroData = sections.hero as { background_video?: string; background_video_mobile?: string } | undefined;
    const heroImage = heroData?.background_video && !/\.(mp4|webm|mov|m4v|ogg)(\?|$)/i.test(heroData.background_video)
        ? heroData.background_video
        : null;
    const heroImageMobile = heroData?.background_video_mobile && !/\.(mp4|webm|mov|m4v|ogg)(\?|$)/i.test(heroData.background_video_mobile)
        ? heroData.background_video_mobile
        : null;

    return (
        <>
            <Head title="Inicio">
                {heroImage && (
                    <link rel="preload" as="image" href={heroImage} media="(min-width: 1024px)" fetchPriority="high" />
                )}
                {heroImageMobile && (
                    <link rel="preload" as="image" href={heroImageMobile} media="(max-width: 1023px)" fetchPriority="high" />
                )}
            </Head>
            <div className="min-h-screen bg-background text-foreground">
                <Navbar />
                {sections.hero && <Hero data={sections.hero as any} />}
                {sections.features && <Features data={sections.features as any} />}
                {sections.about && <About data={sections.about as any} />}
                {sections.seminuevos && <Seminuevos data={sections.seminuevos as any} />}
                {sections.programas && <Programas data={sections.programas as any} />}
                {sections.shorts && <Shorts data={sections.shorts as any} shorts={(sections.shorts as any).shorts ?? []} />}
                {sections.footer && <Footer data={sections.footer as any} />}
            </div>
        </>
    );
}
