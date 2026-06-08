import { Head, router, usePage } from '@inertiajs/react';
import { Trash2, MailOpen, Mail, RefreshCw, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import AdminLayout from '@/layouts/admin-layout';

type Cotizacion = {
    id: number;
    tipo: 'nuevo' | 'seminuevo';
    vehicle_id: number;
    vehicle_nombre: string;
    vehicle_precio: string | null;
    nombre: string;
    email: string;
    telefono: string;
    rut: string | null;
    comentarios: string | null;
    leido: boolean;
    created_at: string;
    branch?: { id: number; name: string } | null;
    version?: { id: number; trim_name: string; material_code: string | null; option_code: string | null } | null;
    sync_status: 'pending' | 'synced' | 'failed';
    synced_at: string | null;
    salesforce_opportunity_id: string | null;
    salesforce_quote_id: string | null;
    sync_last_error: string | null;
    sync_attempts: number;
};

// Mensaje genérico para fallos de sincronización con Salesforce. El detalle
// técnico NO se muestra al cliente — queda en los logs del servidor (ver
// CotizacionSyncService).
const SYNC_ERROR_MSG = 'Hubo un error al enviar el formulario.';

export default function CotizacionesVehiculosIndex({ cotizaciones }: { cotizaciones: Cotizacion[] }) {
    const { flash } = usePage<{ flash: { success?: string } }>().props;

    const marcarLeido = (id: number) => router.patch(`/admin/cotizaciones-vehiculos/${id}/leido`);
    const eliminar = (id: number) => {
        if (confirm('¿Eliminar esta cotización?')) {
            router.delete(`/admin/cotizaciones-vehiculos/${id}`);
        }
    };
    const reintentarSync = (id: number) => router.post(`/admin/cotizaciones-vehiculos/${id}/reintentar-sync`);

    const renderSyncBadge = (c: Cotizacion) => {
        if (c.tipo !== 'nuevo') return null;
        if (c.sync_status === 'synced') {
            return (
                <Badge className="gap-1 bg-green-600 text-white hover:bg-green-600" title={`Sincronizado a Salesforce${c.synced_at ? ' el '+new Date(c.synced_at).toLocaleString('es-CL') : ''}`}>
                    <CheckCircle2 className="size-3" />SF sincronizado
                </Badge>
            );
        }
        if (c.sync_status === 'failed') {
            return (
                <Badge variant="destructive" className="gap-1" title={SYNC_ERROR_MSG}>
                    <XCircle className="size-3" />SF falló{c.sync_attempts > 0 ? ` (${c.sync_attempts}x)` : ''}
                </Badge>
            );
        }
        return (
            <Badge variant="outline" className="gap-1">
                <Clock className="size-3" />SF pendiente
            </Badge>
        );
    };

    const noLeidos = cotizaciones.filter((c) => !c.leido).length;

    return (
        <AdminLayout breadcrumbs={[{ title: 'Dashboard', href: '/admin' }, { title: 'Cotizaciones vehículos', href: '/admin/cotizaciones-vehiculos' }]}>
            <Head title="Admin — Cotizaciones de vehículos" />
            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">
                        Cotizaciones de vehículos
                        {noLeidos > 0 && (
                            <Badge className="ml-3" variant="destructive">{noLeidos} sin leer</Badge>
                        )}
                    </h1>
                </div>

                {flash?.success && (
                    <div className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700">{flash.success}</div>
                )}

                {cotizaciones.length === 0 ? (
                    <div className="flex h-40 items-center justify-center rounded-lg border border-dashed text-muted-foreground">
                        No hay cotizaciones aún.
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {cotizaciones.map((c) => (
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
                                            {c.rut && (
                                                <>
                                                    <span className="text-muted-foreground text-sm">·</span>
                                                    <span className="text-sm text-muted-foreground">RUT {c.rut}</span>
                                                </>
                                            )}
                                            <Badge variant="outline" className="ml-1">{c.tipo === 'nuevo' ? 'Nuevo' : 'Seminuevo'}</Badge>
                                            {renderSyncBadge(c)}
                                            <span className="text-muted-foreground text-sm ml-auto">
                                                {new Date(c.created_at).toLocaleString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <p className="font-medium">{c.vehicle_nombre}{c.vehicle_precio ? ` — ${c.vehicle_precio}` : ''}</p>
                                        {(c.branch || c.version?.option_code || c.version?.material_code) && (
                                            <p className="text-xs text-muted-foreground">
                                                {c.branch && <>Sucursal: <strong>{c.branch.name}</strong></>}
                                                {c.branch && (c.version?.option_code || c.version?.material_code) && ' · '}
                                                {c.version?.option_code && <>Opción (SF): <code>{c.version.option_code}</code></>}
                                                {c.version?.option_code && c.version?.material_code && ' · '}
                                                {c.version?.material_code && <>Material: <code>{c.version.material_code}</code></>}
                                            </p>
                                        )}
                                        {c.sync_status === 'failed' && (
                                            <p className="text-xs text-amber-600">⚠ {SYNC_ERROR_MSG}</p>
                                        )}
                                        {c.comentarios && <p className="text-sm text-muted-foreground whitespace-pre-wrap">{c.comentarios}</p>}
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        {c.tipo === 'nuevo' && c.sync_status === 'failed' && (
                                            <Button variant="outline" size="sm" onClick={() => reintentarSync(c.id)} title="Reintentar sincronización Salesforce">
                                                <RefreshCw className="size-4" />
                                            </Button>
                                        )}
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
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
