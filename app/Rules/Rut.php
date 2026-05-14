<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

/**
 * Valida un RUT chileno (con dígito verificador). Acepta formato libre:
 * "12.345.678-9", "12345678-9" o "123456789" — internamente limpia puntos,
 * guiones y espacios antes de calcular el DV.
 */
class Rut implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (! is_string($value)) {
            $fail('El RUT debe ser un texto.');
            return;
        }

        $clean = strtoupper(preg_replace('/[.\s-]/', '', $value));

        if (! preg_match('/^\d{7,8}[0-9K]$/', $clean)) {
            $fail('El RUT no es válido.');
            return;
        }

        $body = substr($clean, 0, -1);
        $dv = substr($clean, -1);

        $sum = 0;
        $multiplier = 2;
        for ($i = strlen($body) - 1; $i >= 0; $i--) {
            $sum += (int) $body[$i] * $multiplier;
            $multiplier = $multiplier === 7 ? 2 : $multiplier + 1;
        }

        $mod = 11 - ($sum % 11);
        $expected = match ($mod) {
            11 => '0',
            10 => 'K',
            default => (string) $mod,
        };

        if ($dv !== $expected) {
            $fail('El RUT ingresado no es válido (dígito verificador incorrecto).');
        }
    }
}
