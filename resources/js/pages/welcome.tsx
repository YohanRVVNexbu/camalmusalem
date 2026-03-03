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

export default function Welcome() {
    const { auth } = usePage().props;

    return (
        <>
            <Head title="Inicio" />
            <div className="min-h-screen bg-background text-foreground">
                <Navbar isAuthenticated={!!auth.user} />
                <Hero />
                <Features />
                <About />
                <Seminuevos />
                <Programas />
                <Shorts />
                <Footer />
                <WhatsappButton />
            </div>
        </>
    );
}
