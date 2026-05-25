import { Head } from '@inertiajs/react';
import { useEffect } from 'react';

import { DenunciaForm } from '@/components/compliance/denuncia-form';
import { Footer } from '@/components/landing/footer';
import { Navbar } from '@/components/landing/navbar';

type Props = {
    footer: any | null;
    categorias: Record<string, string>;
};

export default function DenunciaPrevencionDelito({ footer, categorias }: Props) {
    useEffect(() => {
        const html = document.documentElement;
        const prev = html.style.backgroundColor;
        html.style.backgroundColor = '#000';
        return () => { html.style.backgroundColor = prev; };
    }, []);

    const categoriasArr = Object.entries(categorias).map(([value, label]) => ({ value, label }));

    return (
        <div className="min-h-screen bg-black">
            <Head title="Denuncia Ley 20.393 — Toyota Musalem" />
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
                                        Ley 20.393
                                    </h2>
                                </div>
                                <p className="text-sm leading-relaxed text-white/80" style={{ fontFamily: '"Toyota Type"' }}>
                                    Modelo de Prevención del Delito de Toyota Musalem. Canal habilitado para
                                    denuncias o consultas relacionadas con lavado de activos, financiamiento del
                                    terrorismo, cohecho a funcionarios públicos y entre particulares, receptación,
                                    negociación incompatible y los demás delitos contemplados en la Ley 20.393
                                    (actualizada por la Ley 21.595 de Delitos Económicos).
                                </p>
                                <div className="rounded-2xl bg-white/5 p-4">
                                    <span className="mb-1 block text-xs uppercase tracking-wider text-white/60" style={{ fontFamily: '"Toyota Type"' }}>
                                        Confidencialidad
                                    </span>
                                    <p className="text-sm text-white/80" style={{ fontFamily: '"Toyota Type"' }}>
                                        Tu denuncia es revisada exclusivamente por el Encargado de Prevención del
                                        Delito. La identidad del denunciante se mantiene en reserva y no se permite
                                        ningún tipo de represalia por denunciar de buena fe.
                                    </p>
                                </div>
                                <div className="rounded-2xl bg-white/5 p-4">
                                    <span className="mb-1 block text-xs uppercase tracking-wider text-white/60" style={{ fontFamily: '"Toyota Type"' }}>
                                        Seguimiento
                                    </span>
                                    <p className="text-sm text-white/80" style={{ fontFamily: '"Toyota Type"' }}>
                                        Al enviar tu denuncia recibirás un código de seguimiento. Guárdalo: te
                                        permitirá consultar el estado de la investigación sin tener que volver a
                                        identificarte.
                                    </p>
                                </div>
                            </aside>

                            {/* Formulario */}
                            <div className="bg-[#EAEAF1] p-6 lg:p-10">
                                <DenunciaForm
                                    submitUrl="/compliance/denuncia-prevencion-delito"
                                    title="Denuncia — Ley 20.393"
                                    subtitle="Canal de Prevención del Delito"
                                    intro="Completa los datos a continuación. Mientras más detalle aportes, mejor podremos investigar."
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
