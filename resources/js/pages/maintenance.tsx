import { Head } from '@inertiajs/react';
import { useEffect } from 'react';
import { Clock, Mail } from 'lucide-react';

import { useIsMobile } from '@/hooks/use-mobile';
import { pickResponsiveImage } from '@/lib/media';
import logoBlanco from '@images/logo_blanco.png?format=webp';

type Maintenance = {
    title: string;
    description: string;
    eta: string;
    contact_email: string;
    image: string;
    image_mobile: string;
    show_logo: boolean;
};

export default function MaintenancePage({ maintenance }: { maintenance: Maintenance }) {
    const isMobile = useIsMobile();
    const bgImage = pickResponsiveImage(maintenance.image, maintenance.image_mobile, isMobile);

    useEffect(() => {
        const html = document.documentElement;
        const prev = html.style.backgroundColor;
        html.style.backgroundColor = '#000';
        return () => { html.style.backgroundColor = prev; };
    }, []);

    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-black px-5 py-10 text-white">
            <Head title="Sitio en mantenimiento — Toyota Musalem" />

            {bgImage && (
                <div
                    aria-hidden="true"
                    className="absolute inset-0 opacity-30"
                    style={{ background: `url(${bgImage}) center / cover no-repeat` }}
                />
            )}
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-black via-black/85 to-black" />

            <div className="relative z-10 flex w-full max-w-2xl flex-col items-center text-center">
                {maintenance.show_logo && (
                    <img src={logoBlanco} alt="Toyota Musalem" className="mb-10 h-12 w-auto object-contain" />
                )}

                <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-xs uppercase tracking-wider text-white/80" style={{ fontFamily: '"Toyota Type"' }}>
                    <Clock className="size-3.5" />
                    Sitio en mantenimiento
                </span>

                <h1 className="mb-4 text-3xl font-semibold leading-tight lg:text-5xl" style={{ fontFamily: '"Toyota Type"' }}>
                    {maintenance.title}
                </h1>

                <p className="mb-8 max-w-xl text-base leading-relaxed text-white/80 lg:text-lg" style={{ fontFamily: '"Toyota Type"' }}>
                    {maintenance.description}
                </p>

                {maintenance.eta && (
                    <div className="mb-6 rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm text-white/90" style={{ fontFamily: '"Toyota Type"' }}>
                        <span className="uppercase tracking-wider text-white/60">Estimado:</span> {maintenance.eta}
                    </div>
                )}

                {maintenance.contact_email && (
                    <a
                        href={`mailto:${maintenance.contact_email}`}
                        className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition hover:bg-white/90"
                        style={{ fontFamily: '"Toyota Type"' }}
                    >
                        <Mail className="size-4" />
                        {maintenance.contact_email}
                    </a>
                )}
            </div>
        </div>
    );
}
