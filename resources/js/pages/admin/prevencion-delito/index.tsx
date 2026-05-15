import { Head, router, usePage } from '@inertiajs/react';
import { Trash2, MailOpen, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import AdminLayout from '@/layouts/admin-layout';

type Denuncia = {
    id: number;
    nombre: string;
    asunto: string;
    email: string;
    telefono: string | null;
    rut: string | null;
    mensaje: string;
    leido: boolean;
    created_at: string;
};

export default function PrevencionDelitoIndex({ denuncias }: { denuncias: Denuncia[] }) {
    const { flash } = usePage<{ flash: { success?: string } }>().props;

    const marcarLeido = (id: number) => {
        router.patch(`/admin/prevencion-delito/${id}/leido`);
    };

    const eliminar = (id: number) => {
        if (confirm('¿Eliminar esta denuncia?')) {
            router.delete(`/admin/prevencion-delito/${id}`);
        }
    };

    const noLeidos = denuncias.filter((d) => !d.leido).length;

    return (
        <AdminLayout breadcrumbs={[
            { title: 'Dashboard', href: '/admin' },
            { title: 'Prevención del Delito', href: '/admin/prevencion-delito' },
        ]}>
            <Head title="Admin — Prevención del Delito" />
            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">
                            Prevención del Delito (Ley 20.393)
                            {noLeidos > 0 && (
                                <Badge className="ml-3" variant="destructive">{noLeidos} sin leer</Badge>
                            )}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Canal de denuncias recibidas a través del formulario público. Estos mensajes son
                            confidenciales y deben revisarse exclusivamente por el Encargado de Prevención de
                            Delitos.
                        </p>
                    </div>
                </div>

                {flash?.success && (
                    <div className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700">{flash.success}</div>
                )}

                {denuncias.length === 0 ? (
                    <div className="flex h-40 items-center justify-center rounded-lg border border-dashed text-muted-foreground">
                        No hay denuncias recibidas aún.
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {denuncias.map((d) => (
                            <div
                                key={d.id}
                                className={`rounded-lg border p-5 transition-colors ${d.leido ? 'bg-background' : 'border-primary/30 bg-primary/5'}`}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex flex-1 flex-col gap-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            {!d.leido && <span className="size-2 rounded-full bg-primary shrink-0" />}
                                            <span className="font-semibold">{d.nombre}</span>
                                            <span className="text-muted-foreground text-sm">·</span>
                                            <span className="text-sm text-muted-foreground">{d.email}</span>
                                            {d.telefono && (
                                                <>
                                                    <span className="text-muted-foreground text-sm">·</span>
                                                    <span className="text-sm text-muted-foreground">{d.telefono}</span>
                                                </>
                                            )}
                                            {d.rut && (
                                                <>
                                                    <span className="text-muted-foreground text-sm">·</span>
                                                    <span className="text-sm text-muted-foreground">RUT {d.rut}</span>
                                                </>
                                            )}
                                            <span className="text-muted-foreground text-sm ml-auto">
                                                {new Date(d.created_at).toLocaleString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <p className="font-medium">{d.asunto}</p>
                                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{d.mensaje}</p>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        {!d.leido && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => marcarLeido(d.id)}
                                                title="Marcar como leído"
                                            >
                                                <MailOpen className="size-4" />
                                            </Button>
                                        )}
                                        {d.leido && (
                                            <span title="Leído">
                                                <Mail className="size-4 text-muted-foreground" />
                                            </span>
                                        )}
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => eliminar(d.id)}
                                        >
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
