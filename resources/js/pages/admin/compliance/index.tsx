import { Head, Link, router, usePage } from '@inertiajs/react';
import { Eye, Mail, MailOpen, Trash2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AdminLayout from '@/layouts/admin-layout';

type Denuncia = {
    id: number;
    tipo: 'ley_20393' | 'ley_karin';
    tipo_label: string;
    modalidad: 'identificada' | 'reserva' | 'anonima';
    tracking_code: string;
    nombre: string | null;
    asunto: string | null;
    categoria: string | null;
    categoria_label: string | null;
    email: string | null;
    telefono: string | null;
    rut: string | null;
    estado: 'recibida' | 'en_investigacion' | 'cerrada';
    leido: boolean;
    created_at: string;
};

type Counts = {
    total: number;
    no_leidas: number;
    ley_karin: number;
    ley_20393: number;
    recibidas: number;
    en_investigacion: number;
    cerradas: number;
};

type Props = {
    denuncias: Denuncia[];
    filters: { tipo: string | null; estado: string | null };
    counts: Counts;
};

const MODALIDAD_LABEL: Record<Denuncia['modalidad'], string> = {
    identificada: 'Identificada',
    reserva: 'Reserva de identidad',
    anonima: 'Anónima',
};

const ESTADO_VARIANT: Record<Denuncia['estado'], 'default' | 'secondary' | 'outline'> = {
    recibida: 'default',
    en_investigacion: 'secondary',
    cerrada: 'outline',
};

const ESTADO_LABEL: Record<Denuncia['estado'], string> = {
    recibida: 'Recibida',
    en_investigacion: 'En investigación',
    cerrada: 'Cerrada',
};

export default function ComplianceIndex({ denuncias, filters, counts }: Props) {
    const { flash } = usePage<{ flash: { success?: string } }>().props;

    const filterByTipo = (tipo: string | null) => {
        router.get('/admin/compliance/denuncias', { ...filters, tipo: tipo ?? undefined }, { preserveState: true });
    };

    const filterByEstado = (estado: string | null) => {
        router.get('/admin/compliance/denuncias', { ...filters, estado: estado ?? undefined }, { preserveState: true });
    };

    const marcarLeido = (id: number) => router.patch(`/admin/compliance/denuncias/${id}/leido`);
    const eliminar = (id: number) => {
        if (confirm('¿Eliminar esta denuncia y todos sus adjuntos? Esta acción no se puede deshacer.')) {
            router.delete(`/admin/compliance/denuncias/${id}`);
        }
    };

    return (
        <AdminLayout breadcrumbs={[
            { title: 'Dashboard', href: '/admin' },
            { title: 'Compliance', href: '/admin/compliance/denuncias' },
        ]}>
            <Head title="Admin — Compliance" />

            <div className="flex flex-col gap-4 p-4">
                <header>
                    <h1 className="text-2xl font-semibold">
                        Canal de denuncias
                        {counts.no_leidas > 0 && (
                            <Badge className="ml-3" variant="destructive">{counts.no_leidas} sin leer</Badge>
                        )}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Bandeja unificada de denuncias recibidas por los canales públicos (Ley 20.393 y Ley Karin).
                        Confidencial — solo debe ser revisada por el Encargado de Prevención del Delito.
                    </p>
                </header>

                {flash?.success && (
                    <div className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700">{flash.success}</div>
                )}

                {/* Filtros */}
                <div className="grid gap-3 lg:grid-cols-2">
                    <FilterRow label="Marco legal" current={filters.tipo} onChange={filterByTipo} options={[
                        { value: null, label: `Todas (${counts.total})` },
                        { value: 'ley_20393', label: `Ley 20.393 (${counts.ley_20393})` },
                        { value: 'ley_karin', label: `Ley Karin (${counts.ley_karin})` },
                    ]} />
                    <FilterRow label="Estado" current={filters.estado} onChange={filterByEstado} options={[
                        { value: null, label: 'Todos' },
                        { value: 'recibida', label: `Recibidas (${counts.recibidas})` },
                        { value: 'en_investigacion', label: `En investigación (${counts.en_investigacion})` },
                        { value: 'cerrada', label: `Cerradas (${counts.cerradas})` },
                    ]} />
                </div>

                {denuncias.length === 0 ? (
                    <div className="flex h-40 items-center justify-center rounded-lg border border-dashed text-muted-foreground">
                        No hay denuncias con los filtros actuales.
                    </div>
                ) : (
                    <div className="rounded-lg border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-8"></TableHead>
                                    <TableHead>Fecha</TableHead>
                                    <TableHead>Marco</TableHead>
                                    <TableHead>Modalidad</TableHead>
                                    <TableHead>Categoría</TableHead>
                                    <TableHead>Denunciante</TableHead>
                                    <TableHead>Estado</TableHead>
                                    <TableHead>Tracking</TableHead>
                                    <TableHead className="text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {denuncias.map((d) => (
                                    <TableRow key={d.id} className={d.leido ? '' : 'bg-primary/5'}>
                                        <TableCell>{!d.leido && <span className="block size-2 rounded-full bg-primary" />}</TableCell>
                                        <TableCell className="text-xs text-muted-foreground">
                                            {new Date(d.created_at).toLocaleString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={d.tipo === 'ley_karin' ? 'destructive' : 'default'}>{d.tipo_label}</Badge>
                                        </TableCell>
                                        <TableCell className="text-xs">{MODALIDAD_LABEL[d.modalidad]}</TableCell>
                                        <TableCell className="text-sm">{d.categoria_label ?? '—'}</TableCell>
                                        <TableCell className="text-sm">
                                            {d.modalidad === 'anonima' ? (
                                                <span className="text-muted-foreground italic">Anónima</span>
                                            ) : (
                                                <div className="flex flex-col">
                                                    <span>{d.nombre ?? '—'}</span>
                                                    {d.email && <span className="text-xs text-muted-foreground">{d.email}</span>}
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={ESTADO_VARIANT[d.estado]}>{ESTADO_LABEL[d.estado]}</Badge>
                                        </TableCell>
                                        <TableCell className="font-mono text-xs">{d.tracking_code}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-1">
                                                <Button asChild variant="ghost" size="sm" title="Ver detalle">
                                                    <Link href={`/admin/compliance/denuncias/${d.id}`}>
                                                        <Eye className="size-4" />
                                                    </Link>
                                                </Button>
                                                {!d.leido ? (
                                                    <Button variant="ghost" size="sm" onClick={() => marcarLeido(d.id)} title="Marcar leído">
                                                        <MailOpen className="size-4" />
                                                    </Button>
                                                ) : (
                                                    <span title="Leído" className="inline-flex size-8 items-center justify-center">
                                                        <Mail className="size-4 text-muted-foreground" />
                                                    </span>
                                                )}
                                                <Button variant="ghost" size="sm" onClick={() => eliminar(d.id)} title="Eliminar">
                                                    <Trash2 className="size-4 text-destructive" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}

function FilterRow({
    label, current, options, onChange,
}: {
    label: string;
    current: string | null;
    options: { value: string | null; label: string }[];
    onChange: (v: string | null) => void;
}) {
    return (
        <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs uppercase text-muted-foreground">{label}:</span>
            {options.map((o) => (
                <Button
                    key={o.value ?? 'all'}
                    type="button"
                    variant={current === o.value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onChange(o.value)}
                >
                    {o.label}
                </Button>
            ))}
        </div>
    );
}
