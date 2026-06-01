import { Head } from '@inertiajs/react';
import { useEffect } from 'react';

import { DenunciaForm } from '@/components/compliance/denuncia-form';
import { Footer } from '@/components/landing/footer';
import { Navbar } from '@/components/landing/navbar';

type Props = {
    footer: any | null;
    categorias: Record<string, string>;
    relacionesEmpresa?: Record<string, string>;
    frecuencias?: Record<string, string>;
    montos?: Record<string, string>;
    evidencia?: Record<string, string>;
    reportadoAntes?: Record<string, string>;
    otrosSaben?: Record<string, string>;
};

export default function DenunciaPrevencionDelito({
    footer,
    categorias,
    relacionesEmpresa,
    frecuencias,
    montos,
    evidencia,
    reportadoAntes,
    otrosSaben,
}: Props) {
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
                                        Ley 20.393 y Ley 19.913
                                    </h2>
                                </div>
                                <p className="text-sm leading-relaxed text-white/80" style={{ fontFamily: '"Toyota Type"' }}>
                                    Canal de denuncias de Toyota Camal Musalem implementado para que empleados,
                                    proveedores, clientes y terceros puedan reportar, de manera segura y
                                    confidencial, posibles infracciones relacionadas con la Ley 20.393 sobre
                                    Responsabilidad Penal de las Personas Jurídicas y la Ley 19.913 sobre
                                    Lavado de Activos y Financiamiento del Terrorismo.
                                </p>
                                <div className="rounded-2xl bg-white/5 p-4">
                                    <span className="mb-1 block text-xs uppercase tracking-wider text-white/60" style={{ fontFamily: '"Toyota Type"' }}>
                                        Compromiso de confidencialidad
                                    </span>
                                    <ul className="flex flex-col gap-1 text-sm text-white/80" style={{ fontFamily: '"Toyota Type"' }}>
                                        <li>• Toda la información será tratada con la máxima reserva.</li>
                                        <li>• Solo el Encargado de Prevención del Delito tendrá acceso.</li>
                                        <li>• No se tomarán represalias contra denunciantes de buena fe.</li>
                                        <li>• Tu identidad se protege salvo requerimiento judicial expreso.</li>
                                    </ul>
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
                                    title="Formulario de Denuncia"
                                    subtitle="Delitos Económicos y Lavado de Activos — Toyota Camal Musalem"
                                    intro="Tu denuncia es fundamental para mantener los más altos estándares éticos y contribuir a la prevención de delitos económicos y medioambientales. Los campos marcados con asterisco son obligatorios."
                                    categorias={categoriasArr}
                                    variant="completo"
                                    relacionesEmpresa={relacionesEmpresa}
                                    frecuencias={frecuencias}
                                    montos={montos}
                                    evidencia={evidencia}
                                    reportadoAntes={reportadoAntes}
                                    otrosSaben={otrosSaben}
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
