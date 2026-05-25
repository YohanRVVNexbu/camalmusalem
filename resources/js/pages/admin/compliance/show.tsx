import { Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowLeft, Download, FileText, Trash2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import AdminLayout from '@/layouts/admin-layout';

type Adjunto = { id: number; original_name: string; mime_type: string | null; size_bytes: number };

type Denuncia = {
    id: number;
    tipo: 'ley_20393' | 'ley_karin';
    tipo_label: string;
    modalidad: 'identificada' | 'reserva' | 'anonima';
    tracking_code: string;
    nombre: string | null;
    email: string | null;
    telefono: string | null;
    rut: string | null;
    asunto: string | null;
    categoria: string | null;
    categoria_label: string | null;
    hechos_descripcion: string;
    hechos_fecha: string | null;
    hechos_lugar: string | null;
    hechos_testigos: string | null;
    denunciado_nombre: string | null;
    denunciado_cargo: string | null;
    denunciado_sucursal: string | null;
    payload: Record<string, any> | null;
    estado: 'recibida' | 'en_investigacion' | 'cerrada';
    created_at: string;
    adjuntos: Adjunto[];
};

const MODALIDAD_LABEL: Record<Denuncia['modalidad'], string> = {
    identificada: 'Identificada',
    reserva: 'Con reserva de identidad',
    anonima: 'Anónima',
};

export default function ComplianceShow({ denuncia, estados }: { denuncia: Denuncia; estados: Record<string, string> }) {
    const { flash } = usePage<{ flash: { success?: string } }>().props;

    const updateEstado = (estado: string) => {
        router.patch(`/admin/compliance/denuncias/${denuncia.id}/estado`, { estado }, { preserveScroll: true });
    };

    const eliminar = () => {
        if (confirm('¿Eliminar esta denuncia y todos sus adjuntos? Esta acción no se puede deshacer.')) {
            router.delete(`/admin/compliance/denuncias/${denuncia.id}`);
        }
    };

    return (
        <AdminLayout breadcrumbs={[
            { title: 'Dashboard', href: '/admin' },
            { title: 'Compliance', href: '/admin/compliance/denuncias' },
            { title: `#${denuncia.id}`, href: '#' },
        ]}>
            <Head title={`Denuncia #${denuncia.id} — Compliance`} />

            <div className="flex flex-col gap-6 p-4">
                <header className="flex items-start justify-between gap-4">
                    <div>
                        <Button asChild variant="ghost" size="sm" className="mb-2 -ml-2">
                            <Link href="/admin/compliance/denuncias">
                                <ArrowLeft className="mr-1 size-4" />Volver a la bandeja
                            </Link>
                        </Button>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-semibold">Denuncia #{denuncia.id}</h1>
                            <Badge variant={denuncia.tipo === 'ley_karin' ? 'destructive' : 'default'}>{denuncia.tipo_label}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Recibida el {new Date(denuncia.created_at).toLocaleString('es-CL')}
                        </p>
                    </div>
                    <Button variant="ghost" onClick={eliminar} className="text-destructive">
                        <Trash2 className="mr-1 size-4" />Eliminar
                    </Button>
                </header>

                {flash?.success && (
                    <div className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700">{flash.success}</div>
                )}

                {/* Estado */}
                <section className="rounded-lg border bg-card p-5">
                    <h2 className="mb-3 text-base font-semibold">Estado</h2>
                    <div className="flex flex-wrap gap-2">
                        {Object.entries(estados).map(([key, label]) => (
                            <Button
                                key={key}
                                variant={denuncia.estado === key ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => updateEstado(key)}
                            >
                                {label}
                            </Button>
                        ))}
                    </div>
                </section>

                {/* Identificación */}
                <section className="rounded-lg border bg-card p-5">
                    <h2 className="mb-3 text-base font-semibold">Denunciante</h2>
                    <dl className="grid gap-2 text-sm md:grid-cols-2">
                        <Row label="Modalidad" value={MODALIDAD_LABEL[denuncia.modalidad]} />
                        <Row label="Código de seguimiento" value={<span className="font-mono">{denuncia.tracking_code}</span>} />
                        {denuncia.modalidad !== 'anonima' ? (
                            <>
                                <Row label="Nombre" value={denuncia.nombre} />
                                <Row label="Email" value={denuncia.email} />
                                <Row label="Teléfono" value={denuncia.telefono} />
                                <Row label="RUT" value={denuncia.rut} />
                            </>
                        ) : (
                            <p className="text-sm text-muted-foreground italic md:col-span-2">Denuncia anónima — no se registró información de contacto del denunciante.</p>
                        )}
                    </dl>
                </section>

                {/* Categoría */}
                <section className="rounded-lg border bg-card p-5">
                    <h2 className="mb-3 text-base font-semibold">Categoría</h2>
                    <dl className="grid gap-2 text-sm">
                        <Row label="Categoría" value={denuncia.categoria_label} />
                        {denuncia.asunto && <Row label="Asunto" value={denuncia.asunto} />}
                    </dl>
                </section>

                {/* Denunciado */}
                {(denuncia.denunciado_nombre || denuncia.denunciado_cargo || denuncia.denunciado_sucursal) && (
                    <section className="rounded-lg border bg-card p-5">
                        <h2 className="mb-3 text-base font-semibold">Denunciado</h2>
                        <dl className="grid gap-2 text-sm md:grid-cols-3">
                            <Row label="Nombre" value={denuncia.denunciado_nombre} />
                            <Row label="Cargo / relación" value={denuncia.denunciado_cargo} />
                            <Row label="Sucursal / área" value={denuncia.denunciado_sucursal} />
                        </dl>
                    </section>
                )}

                {/* Hechos */}
                <section className="rounded-lg border bg-card p-5">
                    <h2 className="mb-3 text-base font-semibold">Hechos denunciados</h2>
                    <dl className="grid gap-2 text-sm md:grid-cols-2">
                        <Row label="Fecha" value={denuncia.hechos_fecha} />
                        <Row label="Lugar" value={denuncia.hechos_lugar} />
                    </dl>
                    {denuncia.hechos_testigos && (
                        <>
                            <Separator className="my-3" />
                            <h3 className="mb-1 text-sm font-medium text-muted-foreground">Testigos</h3>
                            <p className="whitespace-pre-wrap text-sm">{denuncia.hechos_testigos}</p>
                        </>
                    )}
                    <Separator className="my-3" />
                    <h3 className="mb-1 text-sm font-medium text-muted-foreground">Descripción</h3>
                    <p className="whitespace-pre-wrap text-sm">{denuncia.hechos_descripcion}</p>
                </section>

                {/* Adjuntos */}
                <section className="rounded-lg border bg-card p-5">
                    <h2 className="mb-3 text-base font-semibold">Adjuntos</h2>
                    {denuncia.adjuntos.length === 0 ? (
                        <p className="text-sm text-muted-foreground">Sin archivos adjuntos.</p>
                    ) : (
                        <ul className="flex flex-col gap-2">
                            {denuncia.adjuntos.map((a) => (
                                <li key={a.id} className="flex items-center gap-3 rounded-md border p-3">
                                    <FileText className="size-5 text-muted-foreground" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">{a.original_name}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {a.mime_type ?? 'application/octet-stream'} · {(a.size_bytes / 1024).toFixed(0)} KB
                                        </p>
                                    </div>
                                    <Button asChild variant="outline" size="sm">
                                        <a href={`/admin/compliance/denuncias/${denuncia.id}/adjuntos/${a.id}`} target="_blank" rel="noopener noreferrer">
                                            <Download className="mr-1 size-4" />Descargar
                                        </a>
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            </div>
        </AdminLayout>
    );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-0.5">
            <dt className="text-xs uppercase tracking-wider text-muted-foreground">{label}</dt>
            <dd className="text-sm">{value ?? <span className="text-muted-foreground italic">—</span>}</dd>
        </div>
    );
}
