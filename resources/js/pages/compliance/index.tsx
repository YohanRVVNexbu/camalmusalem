import { Head } from '@inertiajs/react';
import { useEffect } from 'react';
import { FileText, ShieldAlert, ShieldCheck, Search } from 'lucide-react';

import { Footer } from '@/components/landing/footer';
import { Navbar } from '@/components/landing/navbar';
import { useIsMobile } from '@/hooks/use-mobile';
import { pickResponsiveImage } from '@/lib/media';

type Hero = {
    eyebrow?: string;
    title?: string;
    description?: string;
    image?: string;
    image_mobile?: string;
};

type DescargaItem = { titulo: string; descripcion?: string; file?: string };
type Descargas = { heading?: string; description?: string; items?: DescargaItem[] };

type Canal = { titulo: string; descripcion?: string; button_label?: string; button_href?: string };
type Canales = {
    heading?: string;
    description?: string;
    canales?: Canal[];
    seguimiento?: { titulo?: string; descripcion?: string; button_label?: string; button_href?: string };
};

type Props = {
    footer: any | null;
    compliance_hero: Hero | null;
    compliance_descargas: Descargas | null;
    compliance_canales: Canales | null;
};

export default function ComplianceIndex({ footer, compliance_hero, compliance_descargas, compliance_canales }: Props) {
    const isMobile = useIsMobile();
    const heroImg = pickResponsiveImage(compliance_hero?.image, compliance_hero?.image_mobile, isMobile);

    useEffect(() => {
        const html = document.documentElement;
        const prev = html.style.backgroundColor;
        html.style.backgroundColor = '#fff';
        return () => { html.style.backgroundColor = prev; };
    }, []);

    return (
        <div className="min-h-screen bg-white">
            <Head title="Compliance — Toyota Musalem" />
            <Navbar variant="white" />

            <main className="flex flex-col">
                {/* Hero */}
                {compliance_hero && (
                    <section className="relative overflow-hidden bg-black px-5 pb-15 pt-30 text-white lg:px-15 lg:pb-25 lg:pt-40">
                        {heroImg && (
                            <div
                                className="absolute inset-0 opacity-30"
                                style={{ background: `url(${heroImg}) center / cover no-repeat` }}
                            />
                        )}
                        <div className="relative mx-auto max-w-5xl">
                            {compliance_hero.eyebrow && (
                                <span className="mb-3 inline-block text-sm uppercase tracking-wide opacity-80" style={{ fontFamily: '"Toyota Type"' }}>
                                    {compliance_hero.eyebrow}
                                </span>
                            )}
                            <h1 className="mb-5 text-4xl font-semibold leading-tight lg:text-6xl" style={{ fontFamily: '"Toyota Type"' }}>
                                {compliance_hero.title ?? 'Compliance'}
                            </h1>
                            <p className="max-w-3xl text-base leading-relaxed lg:text-lg" style={{ fontFamily: '"Toyota Type"' }}>
                                {compliance_hero.description}
                            </p>
                        </div>
                    </section>
                )}

                {/* Canales de denuncia */}
                {compliance_canales && (
                    <section className="bg-[#EAEAF1] px-5 py-15 lg:px-15 lg:py-25">
                        <div className="mx-auto max-w-5xl">
                            <header className="mb-10 lg:mb-15">
                                <h2 className="mb-3 text-2xl font-semibold text-black lg:text-4xl" style={{ fontFamily: '"Toyota Type"' }}>
                                    {compliance_canales.heading ?? 'Canales de denuncia'}
                                </h2>
                                {compliance_canales.description && (
                                    <p className="max-w-3xl text-sm text-black/70 lg:text-base" style={{ fontFamily: '"Toyota Type"' }}>
                                        {compliance_canales.description}
                                    </p>
                                )}
                            </header>

                            <div className="grid gap-5 lg:grid-cols-2">
                                {(compliance_canales.canales ?? []).map((c, i) => (
                                    <article key={i} className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm lg:p-8">
                                        <div className="flex size-12 items-center justify-center rounded-full bg-black text-white">
                                            {i === 0 ? <ShieldCheck className="size-6" /> : <ShieldAlert className="size-6" />}
                                        </div>
                                        <h3 className="text-xl font-semibold text-black" style={{ fontFamily: '"Toyota Type"' }}>
                                            {c.titulo}
                                        </h3>
                                        <p className="text-sm text-black/70" style={{ fontFamily: '"Toyota Type"' }}>
                                            {c.descripcion}
                                        </p>
                                        <a
                                            href={c.button_href ?? '#'}
                                            className="mt-auto inline-flex h-11 items-center justify-center rounded-full bg-black px-6 text-sm font-medium text-white transition hover:bg-black/85"
                                            style={{ fontFamily: '"Toyota Type"' }}
                                        >
                                            {c.button_label ?? 'Iniciar denuncia'}
                                        </a>
                                    </article>
                                ))}
                            </div>

                            {compliance_canales.seguimiento && (
                                <div className="mt-8 flex flex-col items-start gap-3 rounded-2xl border border-black/10 bg-white p-6 lg:flex-row lg:items-center lg:justify-between lg:p-8">
                                    <div className="flex items-start gap-4">
                                        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-black/5">
                                            <Search className="size-5 text-black" />
                                        </div>
                                        <div>
                                            <h3 className="mb-1 text-base font-semibold text-black" style={{ fontFamily: '"Toyota Type"' }}>
                                                {compliance_canales.seguimiento.titulo}
                                            </h3>
                                            <p className="text-sm text-black/70" style={{ fontFamily: '"Toyota Type"' }}>
                                                {compliance_canales.seguimiento.descripcion}
                                            </p>
                                        </div>
                                    </div>
                                    <a
                                        href={compliance_canales.seguimiento.button_href ?? '/compliance/seguimiento'}
                                        className="inline-flex h-10 items-center justify-center rounded-full border border-black px-5 text-sm font-medium text-black transition hover:bg-black hover:text-white"
                                        style={{ fontFamily: '"Toyota Type"' }}
                                    >
                                        {compliance_canales.seguimiento.button_label ?? 'Consultar estado'}
                                    </a>
                                </div>
                            )}
                        </div>
                    </section>
                )}

                {/* Descargas (manuales, políticas, código de ética) */}
                {compliance_descargas && (
                    <section className="bg-white px-5 py-15 lg:px-15 lg:py-25">
                        <div className="mx-auto max-w-5xl">
                            <header className="mb-8">
                                <h2 className="mb-3 text-2xl font-semibold text-black lg:text-4xl" style={{ fontFamily: '"Toyota Type"' }}>
                                    {compliance_descargas.heading ?? 'Documentos de compliance'}
                                </h2>
                                {compliance_descargas.description && (
                                    <p className="text-sm text-black/70 lg:text-base" style={{ fontFamily: '"Toyota Type"' }}>
                                        {compliance_descargas.description}
                                    </p>
                                )}
                            </header>

                            <ul className="flex flex-col gap-3">
                                {(compliance_descargas.items ?? []).map((item, i) => {
                                    const hasFile = item.file && item.file.length > 0;
                                    return (
                                        <li key={i} className="flex items-center gap-4 rounded-xl border border-black/10 bg-white p-4 transition hover:border-black/30 lg:p-5">
                                            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-black/5">
                                                <FileText className="size-5 text-black" />
                                            </div>
                                            <div className="flex flex-1 flex-col">
                                                <span className="text-sm font-medium text-black lg:text-base" style={{ fontFamily: '"Toyota Type"' }}>
                                                    {item.titulo}
                                                </span>
                                                {item.descripcion && (
                                                    <span className="text-xs text-black/60 lg:text-sm" style={{ fontFamily: '"Toyota Type"' }}>
                                                        {item.descripcion}
                                                    </span>
                                                )}
                                            </div>
                                            {hasFile ? (
                                                <a
                                                    href={item.file}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="shrink-0 rounded-full bg-black px-4 py-2 text-xs font-medium text-white transition hover:bg-black/85"
                                                    style={{ fontFamily: '"Toyota Type"' }}
                                                >
                                                    Descargar
                                                </a>
                                            ) : (
                                                <span className="shrink-0 text-xs text-black/40" style={{ fontFamily: '"Toyota Type"' }}>
                                                    Próximamente
                                                </span>
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </section>
                )}
            </main>

            {footer && (
                <div className="bg-white">
                    <Footer data={footer} />
                </div>
            )}
        </div>
    );
}
