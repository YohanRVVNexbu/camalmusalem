import { Head, router, usePage } from '@inertiajs/react';
import { Trash2, MailOpen, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import AdminLayout from '@/layouts/admin-layout';

type Solicitud = {
    id: number;
    nombre: string;
    email: string;
    telefono: string;
    sucursal: string;
    modelo: string | null;
    marca: string | null;
    vin: string | null;
    lista_repuestos: string;
    leido: boolean;
    created_at: string;
};

export default function SolicitudesEncargoIndex({ solicitudes }: { solicitudes: Solicitud[] }) {
    const { flash } = usePage<{ flash: { success?: string } }>().props;

    const marcarLeido = (id: number) => router.patch(`/admin/solicitudes-encargo/${id}/leido`);
    const eliminar = (id: number) => {
        if (confirm('¿Eliminar esta solicitud?')) {
            router.delete(`/admin/solicitudes-encargo/${id}`);
        }
    };

    const noLeidos = solicitudes.filter((s) => !s.leido).length;

    return (
        <AdminLayout breadcrumbs={[{ title: 'Dashboard', href: '/admin' }, { title: 'Solicitudes encargo', href: '/admin/solicitudes-encargo' }]}>
            <Head title="Admin — Solicitudes de encargo" />
            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">
                        Solicitudes de encargo de repuestos
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
                                    <div className="flex flex-1 flex-col gap-2 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            {!s.leido && <span className="size-2 rounded-full bg-primary shrink-0" />}
                                            <span className="font-semibold">{s.nombre}</span>
                                            <span className="text-muted-foreground text-sm">·</span>
                                            <span className="text-sm text-muted-foreground">{s.email}</span>
                                            <span className="text-muted-foreground text-sm">·</span>
                                            <span className="text-sm text-muted-foreground">{s.telefono}</span>
                                            <Badge variant="outline" className="ml-1">{s.sucursal}</Badge>
                                            <span className="text-muted-foreground text-sm ml-auto">
                                                {new Date(s.created_at).toLocaleString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                                            {s.modelo && <span><strong className="text-foreground">Modelo:</strong> {s.modelo}</span>}
                                            {s.marca && <span><strong className="text-foreground">Marca:</strong> {s.marca}</span>}
                                            {s.vin && <span><strong className="text-foreground">VIN:</strong> {s.vin}</span>}
                                        </div>
                                        <p className="text-sm whitespace-pre-wrap">{s.lista_repuestos}</p>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        {!s.leido && (
                                            <Button variant="outline" size="sm" onClick={() => marcarLeido(s.id)} title="Marcar como leído">
                                                <MailOpen className="size-4" />
                                            </Button>
                                        )}
                                        {s.leido && (
                                            <span title="Leído">
                                                <Mail className="size-4 text-muted-foreground" />
                                            </span>
                                        )}
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
