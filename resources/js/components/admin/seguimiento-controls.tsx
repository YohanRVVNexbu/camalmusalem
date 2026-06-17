import { router } from '@inertiajs/react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

/**
 * Controles de seguimiento de una solicitud (estado + nota del asesor) y
 * utilidades para filtrar/pestañas. Lo comparten todas las bandejas del admin
 * (contactos, cotizaciones, mantenciones, kinto, encargos) — pedido del
 * cliente para gestionar el contacto y que las cerradas no se acumulen.
 *
 * `tipo` es el slug que entiende SolicitudSeguimientoController:
 *   contacto | cotizacion-vehiculo | cotizacion-accesorio | cotizacion-repuesto
 *   | cotizacion-merch | mantencion | kinto | encargo-repuesto
 */

export type SeguimientoEstado = 'pendiente' | 'en_seguimiento' | 'cerrada';
export type SeguimientoFiltro = 'activas' | 'cerradas' | 'todas';

type ConSeguimiento = { id: number; estado?: string | null; nota_seguimiento?: string | null };

const ESTADOS: { key: SeguimientoEstado; label: string; cls: string }[] = [
    { key: 'pendiente', label: 'Pendiente', cls: 'bg-amber-500 text-white hover:bg-amber-500' },
    { key: 'en_seguimiento', label: 'En seguimiento', cls: 'bg-blue-600 text-white hover:bg-blue-600' },
    { key: 'cerrada', label: 'Cerrada', cls: 'bg-green-600 text-white hover:bg-green-600' },
];

const estadoOf = (e?: string | null) => ESTADOS.find((x) => x.key === e) ?? ESTADOS[0];

/** Badge de color según el estado de la solicitud. */
export function EstadoBadge({ estado }: { estado?: string | null }) {
    const e = estadoOf(estado);
    return <Badge className={e.cls}>{e.label}</Badge>;
}

/** Filtra una lista según la pestaña seleccionada (activas = no cerradas). */
export function filtrarSeguimiento<T extends ConSeguimiento>(items: T[], filtro: SeguimientoFiltro): T[] {
    if (filtro === 'todas') return items;
    if (filtro === 'cerradas') return items.filter((i) => i.estado === 'cerrada');
    return items.filter((i) => i.estado !== 'cerrada'); // activas
}

/** Pestañas Activas / Cerradas / Todas con contadores. */
export function SeguimientoTabs<T extends ConSeguimiento>({
    items,
    value,
    onChange,
}: {
    items: T[];
    value: SeguimientoFiltro;
    onChange: (f: SeguimientoFiltro) => void;
}) {
    const cerradas = items.filter((i) => i.estado === 'cerrada').length;
    const tabs: { key: SeguimientoFiltro; label: string; count: number }[] = [
        { key: 'activas', label: 'Activas', count: items.length - cerradas },
        { key: 'cerradas', label: 'Cerradas', count: cerradas },
        { key: 'todas', label: 'Todas', count: items.length },
    ];
    return (
        <div className="flex gap-2 border-b pb-px">
            {tabs.map((t) => (
                <button
                    key={t.key}
                    onClick={() => onChange(t.key)}
                    className={`-mb-px rounded-t-md border-x border-t px-4 py-2 text-sm font-medium transition-colors ${
                        value === t.key
                            ? 'border-border bg-background text-foreground'
                            : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                >
                    {t.label}
                    <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">{t.count}</span>
                </button>
            ))}
        </div>
    );
}

/** Selector de estado (3 botones) + nota de seguimiento con guardar. */
export function SeguimientoControls({
    tipo,
    id,
    estado,
    nota,
}: {
    tipo: string;
    id: number;
    estado?: string | null;
    nota?: string | null;
}) {
    const [notaVal, setNotaVal] = useState(nota ?? '');
    const [saving, setSaving] = useState(false);
    const base = `/admin/solicitudes/${tipo}/${id}/seguimiento`;
    const notaCambiada = (notaVal ?? '') !== (nota ?? '');

    const setEstado = (nuevo: SeguimientoEstado) => {
        router.patch(base, { estado: nuevo }, { preserveScroll: true });
    };
    const guardarNota = () => {
        setSaving(true);
        router.patch(base, { nota_seguimiento: notaVal }, {
            preserveScroll: true,
            onFinish: () => setSaving(false),
        });
    };

    return (
        <div className="mt-3 flex flex-col gap-2 rounded-md border bg-muted/30 p-3">
            <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground">Estado:</span>
                {ESTADOS.map((e) => (
                    <Button
                        key={e.key}
                        type="button"
                        size="sm"
                        variant={estado === e.key ? 'default' : 'outline'}
                        className={estado === e.key ? e.cls : ''}
                        onClick={() => setEstado(e.key)}
                    >
                        {e.label}
                    </Button>
                ))}
            </div>
            <div className="flex flex-col gap-1.5">
                <textarea
                    value={notaVal}
                    onChange={(e) => setNotaVal(e.target.value)}
                    rows={2}
                    placeholder="Nota de seguimiento (ej. 'Cliente llamó', 'Pendiente devolver llamada')"
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-ring"
                />
                <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    className="self-start"
                    disabled={saving || !notaCambiada}
                    onClick={guardarNota}
                >
                    {saving ? 'Guardando…' : 'Guardar nota'}
                </Button>
            </div>
        </div>
    );
}
