<?php

namespace App\Models\Concerns;

use Illuminate\Database\Eloquent\Builder;

/**
 * Seguimiento de una solicitud por parte del equipo: estado de gestión y nota
 * del asesor. Lo comparten todas las bandejas del admin (contactos,
 * cotizaciones, mantenciones, kinto, encargos) para no perder el seguimiento
 * y que las solicitudes cerradas no se acumulen.
 *
 * Requiere que la tabla tenga las columnas `estado` (default 'pendiente') y
 * `nota_seguimiento` (nullable) — ver migración add_seguimiento_to_solicitudes.
 * El modelo debe incluir 'estado' y 'nota_seguimiento' en su $fillable.
 */
trait TieneSeguimiento
{
    public const ESTADO_PENDIENTE      = 'pendiente';
    public const ESTADO_EN_SEGUIMIENTO = 'en_seguimiento';
    public const ESTADO_CERRADA        = 'cerrada';

    /** Catálogo estado => etiqueta legible. */
    public const ESTADOS_SEGUIMIENTO = [
        self::ESTADO_PENDIENTE      => 'Pendiente',
        self::ESTADO_EN_SEGUIMIENTO => 'En seguimiento',
        self::ESTADO_CERRADA        => 'Cerrada',
    ];

    public static function estadosSeguimientoValidos(): array
    {
        return array_keys(self::ESTADOS_SEGUIMIENTO);
    }

    /** Excluye las solicitudes cerradas (las activas pendientes de gestión). */
    public function scopeNoCerradas(Builder $query): Builder
    {
        return $query->where('estado', '!=', self::ESTADO_CERRADA);
    }
}
