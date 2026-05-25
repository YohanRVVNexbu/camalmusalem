<?php

namespace App\Services;

/**
 * Resuelve a qué correo interno se notifica un formulario público.
 *
 * Las claves del config `notifications` están definidas en
 * `config/notifications.php`. Algunas son string plano (un solo correo)
 * y otras son un sub-array con claves `la_serena`, `ovalle`, `default`
 * para los formularios que distinguen por sucursal.
 *
 * El input de la sucursal es texto libre proveniente del formulario
 * ("La Serena", "Ovalle", "LA SERENA"), por lo que la normalización es
 * defensiva: lowercase + sin acentos + match por substring. Si la
 * sucursal no se reconoce, cae al `default` del sub-array.
 *
 * Uso típico desde un controller:
 *
 *   $email = NotificationRouter::for('repuestos', $request->sucursal);
 *   if ($email) {
 *       Mail::to($email)->send(new CotizacionRepuestoMail($cotizacion));
 *   }
 */
class NotificationRouter
{
    /**
     * Devuelve el correo interno al que se debe notificar este formulario.
     * Retorna null si no hay correo configurado (no debe romper el flujo
     * del cliente: el guardado en BD ya ocurrió y se devuelve éxito).
     */
    public static function for(string $type, ?string $branchHint = null): ?string
    {
        $config = config("notifications.{$type}");

        if (is_string($config) && $config !== '') {
            return $config;
        }

        if (! is_array($config)) {
            return null;
        }

        $slug = self::branchSlug($branchHint);
        return $config[$slug] ?? $config['default'] ?? null;
    }

    /**
     * Normaliza el texto de sucursal a un slug conocido.
     *   "La Serena"  → "la_serena"
     *   "LA SERENA"  → "la_serena"
     *   "Ovalle"     → "ovalle"
     *   null/otro    → null  (el caller cae al default)
     */
    private static function branchSlug(?string $text): ?string
    {
        if (! $text) {
            return null;
        }

        $clean = mb_strtolower(trim($text));
        $clean = strtr($clean, [
            'á' => 'a', 'à' => 'a', 'ä' => 'a', 'â' => 'a',
            'é' => 'e', 'è' => 'e', 'ë' => 'e', 'ê' => 'e',
            'í' => 'i', 'ì' => 'i', 'ï' => 'i', 'î' => 'i',
            'ó' => 'o', 'ò' => 'o', 'ö' => 'o', 'ô' => 'o',
            'ú' => 'u', 'ù' => 'u', 'ü' => 'u', 'û' => 'u',
            'ñ' => 'n',
        ]);

        if (str_contains($clean, 'serena')) {
            return 'la_serena';
        }
        if (str_contains($clean, 'ovalle')) {
            return 'ovalle';
        }

        return null;
    }
}
