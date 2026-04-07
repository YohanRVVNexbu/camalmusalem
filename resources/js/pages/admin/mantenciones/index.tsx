import { Head, router, usePage } from '@inertiajs/react';
import { Trash2, MailOpen, Mail, Calendar, Car, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import AdminLayout from '@/layouts/admin-layout';

type Agendamiento = {
    id: number;
    servicio: string;
    taller: string;
    fecha: string;
    hora: string;
    modelo: string;
    anio: string;
    patente: string;
    comentario: string | null;
    nombre: string;
    rut: string;
    telefono: string;
    correo: string;
    leido: boolean;
    created_at: string;
};

export default function MantencionesIndex({ agendamientos }: { agendamientos: Agendamiento[] }) {
    const { flash } = usePage<{ flash: { success?: string } }>().props;
    const noLeidos = agendamientos.filter((a) => !a.leido).length;

    const marcarLeido = (id: number) => router.patch(`/admin/mantenciones/${id}/leido`);
    const eliminar = (id: number) => { if (confirm('¿Eliminar este agendamiento?')) router.delete(`/admin/mantenciones/${id}`); };

    return (
        <AdminLayout breadcrumbs={[{ title: 'Dashboard', href: '/admin' }, { title: 'Mantenciones', href: '/admin/mantenciones' }]}>
            <Head title="Admin — Mantenciones" />
            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">
                        Agendamientos de mantención
                        {noLeidos > 0 && <Badge className="ml-3" variant="destructive">{noLeidos} sin leer</Badge>}
                    </h1>
                </div>

                {flash?.success && (
                    <div className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700">{flash.success}</div>
                )}

                {agendamientos.length === 0 ? (
                    <div className="flex h-40 items-center justify-center rounded-lg border border-dashed text-muted-foreground">
                        No hay agendamientos aún.
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {agendamientos.map((a) => (
                            <div key={a.id} className={`rounded-lg border p-5 transition-colors ${a.leido ? 'bg-background' : 'border-primary/30 bg-primary/5'}`}>
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex flex-1 flex-col gap-3 min-w-0">
                                        {/* Header */}
                                        <div className="flex items-center gap-2 flex-wrap">
                                            {!a.leido && <span className="size-2 rounded-full bg-primary shrink-0" />}
                                            <span className="font-semibold">{a.nombre}</span>
                                            <span className="text-muted-foreground text-sm">·</span>
                                            <span className="text-sm text-muted-foreground">{a.correo}</span>
                                            <span className="text-muted-foreground text-sm">·</span>
                                            <span className="text-sm text-muted-foreground">{a.telefono}</span>
                                            <span className="text-sm text-muted-foreground ml-auto">
                                                {new Date(a.created_at).toLocaleString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>

                                        <Separator />

                                        {/* Detalles en grid */}
                                        <div className="grid grid-cols-2 gap-x-8 gap-y-1.5 text-sm">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="size-3.5 text-muted-foreground shrink-0" />
                                                <span className="text-muted-foreground">Cita:</span>
                                                <span className="font-medium">{a.fecha} — {a.hora}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-muted-foreground">Taller:</span>
                                                <span className="font-medium">{a.taller}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-muted-foreground">Servicio:</span>
                                                <span className="font-medium">{a.servicio}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Car className="size-3.5 text-muted-foreground shrink-0" />
                                                <span className="font-medium">{a.modelo} {a.anio} — {a.patente}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <User className="size-3.5 text-muted-foreground shrink-0" />
                                                <span className="text-muted-foreground">RUT:</span>
                                                <span className="font-medium">{a.rut}</span>
                                            </div>
                                        </div>

                                        {a.comentario && (
                                            <p className="text-sm text-muted-foreground italic">"{a.comentario}"</p>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2 shrink-0">
                                        {!a.leido && (
                                            <Button variant="outline" size="sm" onClick={() => marcarLeido(a.id)} title="Marcar como leído">
                                                <MailOpen className="size-4" />
                                            </Button>
                                        )}
                                        {a.leido && <Mail className="size-4 text-muted-foreground" />}
                                        <Button variant="ghost" size="sm" onClick={() => eliminar(a.id)}>
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
