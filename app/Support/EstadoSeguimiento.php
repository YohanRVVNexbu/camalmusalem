<?php

namespace App\Support;

/**
 * Estados de seguimiento de una solicitud (pendiente → en_seguimiento →
 * cerrada). Fuente única de verdad, usada por el trait TieneSeguimiento y por
 * el controller de seguimiento.
 *
 * Es una clase normal (no un trait): las constantes de trait no se pueden
 * acceder llamando un método estático directamente sobre el trait
 * (TieneSeguimiento::valores() → "Cannot access trait constant directly"),
 * así que esta lógica vive aquí.
 */
final class EstadoSeguimiento
{
    public const PENDIENTE      = 'pendiente';
    public const EN_SEGUIMIENTO = 'en_seguimiento';
    public const CERRADA        = 'cerrada';

    /** estado => etiqueta legible. */
    public const LABELS = [
        self::PENDIENTE      => 'Pendiente',
        self::EN_SEGUIMIENTO => 'En seguimiento',
        self::CERRADA        => 'Cerrada',
    ];

    /** @return string[] lista de estados válidos. */
    public static function valores(): array
    {
        return array_keys(self::LABELS);
    }
}
