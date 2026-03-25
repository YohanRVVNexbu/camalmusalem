import { Head } from '@inertiajs/react';
import { Footer } from '@/components/landing/footer';
import { Navbar } from '@/components/landing/navbar';
import { ContactCta } from '@/components/landing/contact-cta';
import { BranchesSection } from '@/components/landing/branches-section';
import { useEffect } from 'react';
import ctaImg from '@images/seminuevos/ejemplo-video.png?format=webp';
import visitanos1 from '@images/seminuevos/visitanos_1.png?format=webp';
import visitanos2 from '@images/seminuevos/visitanos_2.png?format=webp';

export default function Nosotros({ footer }: { footer: any }) {
    useEffect(() => {
        const html = document.documentElement;
        const prev = html.style.backgroundColor;
        html.style.backgroundColor = '#000';
        return () => { html.style.backgroundColor = prev; };
    }, []);

    return (
        <div className="min-h-screen bg-black">
            <Head title="Nosotros — Toyota Musalem" />
            <Navbar variant="white" />

            <main className="flex flex-col bg-black">

                {/* Hero */}
                <section className="bg-black px-15 pb-0 pt-32">
                    <div className="flex flex-col items-start gap-5">
                        <p className="text-sm uppercase leading-none tracking-widest text-white/50">Toyota Musalem</p>
                        <h1
                            className="text-[56px] font-semibold leading-[110%] text-white"
                            style={{ fontFamily: '"Toyota Type"' }}
                        >
                            Nosotros
                        </h1>
                        <p className="max-w-xl text-base leading-[140%] text-white/60">
                            Somos el concesionario oficial Toyota en la Región de Coquimbo, con más de 30 años acompañando a nuestros clientes.
                        </p>
                    </div>
                </section>

                <ContactCta backgroundImage={ctaImg} />
                <BranchesSection image1={visitanos1} image2={visitanos2} />

            </main>

            <div className="bg-black">
                <Footer data={footer} />
            </div>
        </div>
    );
}
