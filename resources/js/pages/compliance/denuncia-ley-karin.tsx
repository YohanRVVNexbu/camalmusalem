import { Head } from '@inertiajs/react';
import { useEffect } from 'react';

import { DenunciaForm } from '@/components/compliance/denuncia-form';
import { Footer } from '@/components/landing/footer';
import { Navbar } from '@/components/landing/navbar';

type Props = {
    footer: any | null;
    categorias: Record<string, string>;
};

export default function DenunciaLeyKarin({ footer, categorias }: Props) {
    useEffect(() => {
        const html = document.documentElement;
        const prev = html.style.backgroundColor;
        html.style.backgroundColor = '#000';
        return () => { html.style.backgroundColor = prev; };
    }, []);

    const categoriasArr = Object.entries(categorias).map(([value, label]) => ({ value, label }));

    return (
        <div className="min-h-screen bg-black">
            <Head title="Denuncia Ley Karin — Toyota Musalem" />
            <Navbar variant="white" />

            <main className="flex flex-col">
                <section className="px-5 pb-10 pt-30 lg:px-15 lg:pb-20 lg:pt-32" style={{ background: 'linear-gradient(180deg, #000 0%, #fff 50%, #000 100%)' }}>
                    <div className="mx-auto max-w-7xl">
                        <div className="grid gap-0 overflow-hidden rounded-3xl shadow-2xl lg:grid-cols-[1fr_1.2fr]">
                            {/* Marco legal */}
                            <aside className="flex flex-col gap-4 bg-black p-7 text-white lg:p-10">
                                <div>
                                    <span className="mb-2 inline-block text-xs uppercase tracking-wider text-white/60" style={{ fontFamily: '"Toyota Type"' }}>
                                        Marco legal
                                    </span>
                                    <h2 className="text-2xl font-semibold lg:text-3xl" style={{ fontFamily: '"Toyota Type"' }}>
                                        Ley 21.643 — Ley Karin
                                    </h2>
                                </div>
                                <p className="text-sm leading-relaxed text-white/80" style={{ fontFamily: '"Toyota Type"' }}>
                                    Canal de denuncias para situaciones de acoso laboral, acoso sexual o violencia
                                    en el trabajo, en cumplimiento de la Ley 21.643 (Ley Karin) y el protocolo
                                    interno de Toyota Musalem para la prevención, investigación y sanción de estas
                                    conductas.
                                </p>
                                <div className="rounded-2xl bg-white/5 p-4">
                                    <span className="mb-1 block text-xs uppercase tracking-wider text-white/60" style={{ fontFamily: '"Toyota Type"' }}>
                                        Confidencialidad
                                    </span>
                                    <p className="text-sm text-white/80" style={{ fontFamily: '"Toyota Type"' }}>
                                        Tu identidad será conocida sólo por las personas que conduzcan la
                                        investigación. La ley garantiza la confidencialidad del procedimiento, la
                                        prohibición de represalias y, si corresponde, atención psicológica
                                        temprana.
                                    </p>
                                </div>
                                <div className="rounded-2xl bg-white/5 p-4">
                                    <span className="mb-1 block text-xs uppercase tracking-wider text-white/60" style={{ fontFamily: '"Toyota Type"' }}>
                                        Plazo de investigación
                                    </span>
                                    <p className="text-sm text-white/80" style={{ fontFamily: '"Toyota Type"' }}>
                                        El procedimiento de investigación tiene una duración máxima de 30 días
                                        corridos desde recibida la denuncia. Recibirás un código de seguimiento
                                        para consultar su estado.
                                    </p>
                                </div>
                            </aside>

                            {/* Formulario */}
                            <div className="bg-[#EAEAF1] p-6 lg:p-10">
                                <DenunciaForm
                                    submitUrl="/compliance/denuncia-ley-karin"
                                    title="Denuncia — Ley Karin"
                                    subtitle="Canal contra acoso y violencia en el trabajo"
                                    intro="Si necesitas reportar acoso laboral, acoso sexual o violencia en el trabajo, completa este formulario. La ley garantiza confidencialidad y prohíbe represalias."
                                    categorias={categoriasArr}
                                />
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {footer && (
                <div className="bg-black">
                    <Footer data={footer} />
                </div>
            )}
        </div>
    );
}
