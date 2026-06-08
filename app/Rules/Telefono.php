<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

/**
 * Valida un teléfono chileno. Acepta formato libre (espacios, +, guiones,
 * paréntesis); internamente deja solo dígitos y quita el código país 56 si
 * viene. Un número chileno válido (móvil o fijo) tiene 9 dígitos, ej:
 *   +56 9 1234 5678 · 56912345678 · 912345678 · +56 51 234 5678
 *
 * Rechaza números incompletos como "+569" o "12345", que generaban leads
 * imposibles de contactar.
 */
class Telefono implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $digits = preg_replace('/\D/', '', (string) ($value ?? ''));

        // Quita el código país (56) cuando el número lo incluye.
        if (strlen($digits) === 11 && str_starts_with($digits, '56')) {
            $digits = substr($digits, 2);
        }

        // Todo número chileno (móvil o fijo) queda en 9 dígitos.
        if (! preg_match('/^\d{9}$/', $digits)) {
            $fail('Ingresa un número de teléfono válido (9 dígitos), por ejemplo +56 9 1234 5678.');
        }
    }
}
