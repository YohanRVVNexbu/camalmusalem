<?php

namespace App\Models\Concerns;

use App\Support\EstadoSeguimiento;
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
 *
 * Los estados válidos viven en App\Support\EstadoSeguimiento (clase normal):
 * las constantes de un trait NO se pueden acceder llamando un método estático
 * directamente sobre el trait, por eso no se definen aquí.
 */
trait TieneSeguimiento
{
    /** Excluye las solicitudes cerradas (las activas pendientes de gestión). */
    public function scopeNoCerradas(Builder $query): Builder
    {
        return $query->where('estado', '!=', EstadoSeguimiento::CERRADA);
    }
}
