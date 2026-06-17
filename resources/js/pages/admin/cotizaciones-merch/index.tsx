import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Trash2, MailOpen, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import AdminLayout from '@/layouts/admin-layout';
import { EstadoBadge, SeguimientoControls, SeguimientoTabs, filtrarSeguimiento, type SeguimientoFiltro } from '@/components/admin/seguimiento-controls';

type Cotizacion = {
    id: number;
    merch_id: number | null;
    merch_nombre: string;
    merch_precio: string | null;
    nombre: string;
    email: string;
    telefono: string;
    sucursal: string;
    comentarios: string | null;
    leido: boolean;
    created_at: string;
    estado?: string | null;
    nota_seguimiento?: string | null;
};

export default function CotizacionesMerchIndex({ cotizaciones }: { cotizaciones: Cotizacion[] }) {
    const { flash } = usePage<{ flash: { success?: string } }>().props;
    const [filtro, setFiltro] = useState<SeguimientoFiltro>('activas');
    const visibles = filtrarSeguimiento(cotizaciones, filtro);

    const marcarLeido = (id: number) => router.patch(`/admin/cotizaciones-merch/${id}/leido`);
    const eliminar = (id: number) => {
        if (confirm('¿Eliminar esta cotización?')) {
            router.delete(`/admin/cotizaciones-merch/${id}`);
        }
    };

    const noLeidos = cotizaciones.filter((c) => !c.leido).length;

    return (
        <AdminLayout breadcrumbs={[{ title: 'Dashboard', href: '/admin' }, { title: 'Cotizaciones merch', href: '/admin/cotizaciones-merch' }]}>
            <Head title="Admin — Cotizaciones de merch" />
            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">
                        Cotizaciones de merch
                        {noLeidos > 0 && <Badge className="ml-3" variant="destructive">{noLeidos} sin leer</Badge>}
                    </h1>
                </div>

                {flash?.success && (
                    <div className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700">{flash.success}</div>
                )}

                <SeguimientoTabs items={cotizaciones} value={filtro} onChange={setFiltro} />

                {visibles.length === 0 ? (
                    <div className="flex h-40 items-center justify-center rounded-lg border border-dashed text-muted-foreground">
                        No hay cotizaciones aún.
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {visibles.map((c) => (
                            <div key={c.id} className={`rounded-lg border p-5 transition-colors ${c.leido ? 'bg-background' : 'border-primary/30 bg-primary/5'}`}>
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex flex-1 flex-col gap-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            {!c.leido && <span className="size-2 rounded-full bg-primary shrink-0" />}
                                            <span className="font-semibold">{c.nombre}</span>
                                            <span className="text-muted-foreground text-sm">·</span>
                                            <span className="text-sm text-muted-foreground">{c.email}</span>
                                            <span className="text-muted-foreground text-sm">·</span>
                                            <span className="text-sm text-muted-foreground">{c.telefono}</span>
                                            <Badge variant="outline" className="ml-1">{c.sucursal}</Badge>
                                            <EstadoBadge estado={c.estado} />
                                            <span className="text-muted-foreground text-sm ml-auto">
                                                {new Date(c.created_at).toLocaleString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <p className="font-medium">{c.merch_nombre}{c.merch_precio ? ` — ${c.merch_precio}` : ''}</p>
                                        {c.comentarios && <p className="text-sm text-muted-foreground whitespace-pre-wrap">{c.comentarios}</p>}
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        {!c.leido && (
                                            <Button variant="outline" size="sm" onClick={() => marcarLeido(c.id)} title="Marcar como leído">
                                                <MailOpen className="size-4" />
                                            </Button>
                                        )}
                                        {c.leido && (
                                            <span title="Leído">
                                                <Mail className="size-4 text-muted-foreground" />
                                            </span>
                                        )}
                                        <Button variant="ghost" size="sm" onClick={() => eliminar(c.id)}>
                                            <Trash2 className="size-4 text-destructive" />
                                        </Button>
                                    </div>
                                </div>
                                <SeguimientoControls tipo="cotizacion-merch" id={c.id} estado={c.estado} nota={c.nota_seguimiento} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
