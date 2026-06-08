/**
 * Format a value as a Chilean peso string: `$18.300`.
 *
 * Accepts already-formatted inputs ("$ 18.300", "18.300", "$18300") and raw
 * digit strings ("18300"). Non-digit characters are stripped before
 * reformatting, so the output is always consistent regardless of how the
 * admin entered the value.
 */
export function formatCLP(value: string | number | null | undefined): string {
    if (value == null || value === '') return '';
    const digits = String(value).replace(/[^0-9]/g, '');
    if (!digits) return String(value);
    const grouped = digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `$${grouped}`;
}

/**
 * Strip everything but digits. Use in admin forms before sending to the
 * backend so the DB always stores a canonical numeric string ("18300").
 */
export function cleanCLP(value: string | number | null | undefined): string {
    if (value == null) return '';
    return String(value).replace(/[^0-9]/g, '');
}

// ─── Teléfono chileno ───────────────────────────────────────────────────────
// El backend (App\Rules\Telefono) valida: 9 dígitos locales, con/sin código país.

/**
 * Deja solo los dígitos locales del número (quita el código país 56).
 *
 * Quitamos SIEMPRE un "56" inicial: ningún número local chileno (móvil 9… ni
 * fijo por área) empieza con 56, así que ese "56" sólo puede ser el código país
 * o el prefijo "+56" que inyecta el formateador. Quitarlo siempre evita que el
 * "+56" se re-absorba en cada tecla (lo que duplicaba dígitos) y permite borrar
 * sin que reaparezca como "+56 5 6".
 */
export function cleanTelefono(value: string | null | undefined): string {
    const digits = String(value ?? '').replace(/\D/g, '');
    return digits.startsWith('56') ? digits.slice(2) : digits;
}

/** Formatea progresivamente a "+56 9 1234 5678" mientras se escribe. */
export function formatTelefono(value: string | null | undefined): string {
    const digits = cleanTelefono(value).slice(0, 9);
    if (digits.length === 0) return '';
    const parts = [digits.slice(0, 1), digits.slice(1, 5), digits.slice(5, 9)].filter(Boolean);
    return `+56 ${parts.join(' ')}`;
}

/** Válido = 9 dígitos locales. Mismo criterio que App\Rules\Telefono. */
export function isValidTelefono(value: string | null | undefined): boolean {
    return /^\d{9}$/.test(cleanTelefono(value));
}
