import { Head, router, usePage } from '@inertiajs/react';
import { Trash2, MailOpen, Mail, Calendar, Car, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import AdminLayout from '@/layouts/admin-layout';

type Solicitud = {
    id: number;
    sucursal: string;
    fecha: string;
    duracion: string;
    duracion_tipo: string;
    vehiculo: string;
    nombre: string;
    rut: string;
    telefono: string;
    correo: string;
    leido: boolean;
    created_at: string;
};

const SUCURSAL_LABEL: Record<string, string> = {
    'la-serena': 'Musalem La Serena',
    'ovalle':    'Musalem Ovalle',
};

const VEHICULO_LABEL: Record<string, string> = {
    'corolla-cross': 'Corolla Cross',
    'rav4':          'RAV4',
};

export default function KintoSolicitudesIndex({ solicitudes }: { solicitudes: Solicitud[] }) {
    const { flash } = usePage<{ flash: { success?: string } }>().props;
    const noLeidos = solicitudes.filter((s) => !s.leido).length;

    const marcarLeido = (id: number) => router.patch(`/admin/kinto-solicitudes/${id}/leido`);
    const eliminar = (id: number) => { if (confirm('¿Eliminar esta solicitud?')) router.delete(`/admin/kinto-solicitudes/${id}`); };

    return (
        <AdminLayout breadcrumbs={[{ title: 'Dashboard', href: '/admin' }, { title: 'Solicitudes Kinto', href: '/admin/kinto-solicitudes' }]}>
            <Head title="Admin — Solicitudes Kinto" />
            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">
                        Solicitudes KINTO
                        {noLeidos > 0 && <Badge className="ml-3" variant="destructive">{noLeidos} sin leer</Badge>}
                    </h1>
                </div>

                {flash?.success && (
                    <div className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700">{flash.success}</div>
                )}

                {solicitudes.length === 0 ? (
                    <div className="flex h-40 items-center justify-center rounded-lg border border-dashed text-muted-foreground">
                        No hay solicitudes aún.
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {solicitudes.map((s) => (
                            <div key={s.id} className={`rounded-lg border p-5 transition-colors ${s.leido ? 'bg-background' : 'border-primary/30 bg-primary/5'}`}>
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex flex-1 flex-col gap-3 min-w-0">
                                        {/* Header */}
                                        <div className="flex items-center gap-2 flex-wrap">
                                            {!s.leido && <span className="size-2 rounded-full bg-primary shrink-0" />}
                                            <span className="font-semibold">{s.nombre}</span>
                                            <span className="text-muted-foreground text-sm">·</span>
                                            <span className="text-sm text-muted-foreground">{s.correo}</span>
                                            <span className="text-muted-foreground text-sm">·</span>
                                            <span className="text-sm text-muted-foreground">{s.telefono}</span>
                                            <span className="text-sm text-muted-foreground ml-auto">
                                                {new Date(s.created_at).toLocaleString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>

                                        <Separator />

                                        <div className="grid grid-cols-2 gap-x-8 gap-y-1.5 text-sm">
                                            <div className="flex items-center gap-2">
                                                <Car className="size-3.5 text-muted-foreground shrink-0" />
                                                <span className="text-muted-foreground">Vehículo:</span>
                                                <span className="font-medium">{VEHICULO_LABEL[s.vehiculo] ?? s.vehiculo}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-muted-foreground">Sucursal:</span>
                                                <span className="font-medium">{SUCURSAL_LABEL[s.sucursal] ?? s.sucursal}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Calendar className="size-3.5 text-muted-foreground shrink-0" />
                                                <span className="text-muted-foreground">Fecha estimada:</span>
                                                <span className="font-medium">{s.fecha}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock className="size-3.5 text-muted-foreground shrink-0" />
                                                <span className="text-muted-foreground">Duración:</span>
                                                <span className="font-medium">{s.duracion} {s.duracion_tipo}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-muted-foreground">RUT:</span>
                                                <span className="font-medium">{s.rut}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 shrink-0">
                                        {!s.leido && (
                                            <Button variant="outline" size="sm" onClick={() => marcarLeido(s.id)} title="Marcar como leído">
                                                <MailOpen className="size-4" />
                                            </Button>
                                        )}
                                        {s.leido && <Mail className="size-4 text-muted-foreground" />}
                                        <Button variant="ghost" size="sm" onClick={() => eliminar(s.id)}>
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
