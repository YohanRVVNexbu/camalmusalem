import { Head, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';

import { Footer } from '@/components/landing/footer';
import { Navbar } from '@/components/landing/navbar';

type DenunciaEstado = {
    tracking_code: string;
    tipo: string;
    tipo_label: string;
    estado: 'recibida' | 'en_investigacion' | 'cerrada';
    recibida_en: string;
};

type Props = {
    footer: any | null;
    code: string;
    denuncia: DenunciaEstado | null;
    notFound: boolean;
};

const ESTADO_LABEL: Record<DenunciaEstado['estado'], string> = {
    recibida: 'Recibida — en revisión inicial',
    en_investigacion: 'En investigación',
    cerrada: 'Investigación cerrada',
};

export default function ComplianceSeguimiento({ footer, code, denuncia, notFound }: Props) {
    const [value, setValue] = useState(code ?? '');

    useEffect(() => {
        const html = document.documentElement;
        const prev = html.style.backgroundColor;
        html.style.backgroundColor = '#fff';
        return () => { html.style.backgroundColor = prev; };
    }, []);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/compliance/seguimiento', { code: value.trim().toUpperCase() }, { preserveState: true });
    };

    return (
        <div className="min-h-screen bg-white">
            <Head title="Seguimiento de denuncia — Toyota Musalem" />
            <Navbar variant="white" />

            <main className="flex flex-col">
                <section className="px-5 py-20 lg:px-15 lg:py-32">
                    <div className="mx-auto max-w-2xl">
                        <h1 className="mb-3 text-3xl font-semibold text-black lg:text-4xl" style={{ fontFamily: '"Toyota Type"' }}>
                            Consulta el estado de tu denuncia
                        </h1>
                        <p className="mb-8 text-sm text-black/70 lg:text-base" style={{ fontFamily: '"Toyota Type"' }}>
                            Ingresa el código de seguimiento que recibiste por correo al enviar tu denuncia.
                        </p>

                        <form onSubmit={submit} className="flex flex-col gap-3 lg:flex-row">
                            <input
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                                placeholder="Ej: A8K2P5RXC9MV"
                                maxLength={12}
                                className="h-12 flex-1 rounded-full border border-black/15 bg-white px-5 font-mono text-sm uppercase text-black outline-none focus:border-black"
                                style={{ fontFamily: '"Toyota Type"' }}
                            />
                            <button
                                type="submit"
                                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-black px-6 text-sm font-medium text-white transition hover:bg-black/85"
                                style={{ fontFamily: '"Toyota Type"' }}
                            >
                                <Search className="size-4" />
                                Consultar
                            </button>
                        </form>

                        {notFound && (
                            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800" style={{ fontFamily: '"Toyota Type"' }}>
                                No encontramos una denuncia con ese código. Verifica que esté escrito tal cual lo recibiste por correo.
                            </div>
                        )}

                        {denuncia && (
                            <div className="mt-6 rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
                                <div className="mb-4 flex items-center justify-between">
                                    <span className="text-xs uppercase tracking-wider text-black/60" style={{ fontFamily: '"Toyota Type"' }}>
                                        Código
                                    </span>
                                    <span className="font-mono text-sm text-black">{denuncia.tracking_code}</span>
                                </div>
                                <div className="mb-4 flex items-center justify-between">
                                    <span className="text-xs uppercase tracking-wider text-black/60" style={{ fontFamily: '"Toyota Type"' }}>
                                        Marco legal
                                    </span>
                                    <span className="text-sm text-black" style={{ fontFamily: '"Toyota Type"' }}>{denuncia.tipo_label}</span>
                                </div>
                                <div className="mb-4 flex items-center justify-between">
                                    <span className="text-xs uppercase tracking-wider text-black/60" style={{ fontFamily: '"Toyota Type"' }}>
                                        Recibida
                                    </span>
                                    <span className="text-sm text-black" style={{ fontFamily: '"Toyota Type"' }}>{denuncia.recibida_en}</span>
                                </div>
                                <div className="rounded-xl bg-black/5 p-4">
                                    <span className="mb-1 block text-xs uppercase tracking-wider text-black/60" style={{ fontFamily: '"Toyota Type"' }}>
                                        Estado actual
                                    </span>
                                    <p className="text-base font-medium text-black" style={{ fontFamily: '"Toyota Type"' }}>
                                        {ESTADO_LABEL[denuncia.estado] ?? denuncia.estado}
                                    </p>
                                </div>
                                <p className="mt-4 text-xs text-black/60" style={{ fontFamily: '"Toyota Type"' }}>
                                    Por confidencialidad, no mostramos aquí el contenido de tu denuncia ni los datos de personas
                                    involucradas. Si necesitas comunicarte con el Encargado de Prevención del Delito, escribe a
                                    nuestro canal de contacto.
                                </p>
                            </div>
                        )}
                    </div>
                </section>
            </main>

            {footer && (
                <div className="bg-white">
                    <Footer data={footer} />
                </div>
            )}
        </div>
    );
}
