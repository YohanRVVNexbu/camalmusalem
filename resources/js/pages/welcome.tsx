import { Head, usePage } from '@inertiajs/react';
import { About } from '@/components/landing/about';
import { Features } from '@/components/landing/features';
import { Footer } from '@/components/landing/footer';
import { Hero } from '@/components/landing/hero';
import { Navbar } from '@/components/landing/navbar';
import { Programas } from '@/components/landing/programas';
import { Seminuevos } from '@/components/landing/seminuevos';
import { Shorts } from '@/components/landing/shorts';
import { WhatsappButton } from '@/components/landing/whatsapp-button';

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

    return (
        <>
            <Head title="Inicio" />
            <div className="min-h-screen bg-background text-foreground">
                <Navbar />
                {sections.hero && <Hero data={sections.hero as any} />}
                {sections.features && <Features data={sections.features as any} />}
                {sections.about && <About data={sections.about as any} />}
                {sections.seminuevos && <Seminuevos data={sections.seminuevos as any} />}
                {sections.programas && <Programas data={sections.programas as any} />}
                {sections.shorts && <Shorts data={sections.shorts as any} videos={youtubeShorts || []} />}
                {sections.footer && <Footer data={sections.footer as any} />}
                <WhatsappButton />
            </div>
        </>
    );
}
