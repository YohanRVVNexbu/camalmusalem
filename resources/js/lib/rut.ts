/**
 * Utilities for Chilean RUT (Rol Único Tributario) handling.
 *
 * Format: NN.NNN.NNN-V where V is a check digit (0-9 or K).
 */

/** Strip dots, hyphen, and spaces. Uppercase the check digit if present. */
export function cleanRut(value: string): string {
    return value.replace(/[.\s-]/g, '').toUpperCase();
}

/**
 * Format a RUT as the user types: adds dots and hyphen.
 * Accepts partial input (during typing) and returns the formatted version.
 * E.g. "12345678K" → "12.345.678-K"
 */
export function formatRut(value: string): string {
    const cleaned = cleanRut(value);
    if (cleaned.length === 0) return '';
    if (cleaned.length === 1) return cleaned;

    const body = cleaned.slice(0, -1);
    const dv = cleaned.slice(-1);

    // Apply thousands separator to the body (right to left)
    const bodyWithDots = body.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `${bodyWithDots}-${dv}`;
}

/**
 * Computes the expected check digit ("dígito verificador") for a RUT body.
 * Returns a string '0'-'9' or 'K'.
 */
function computeCheckDigit(body: string): string {
    let sum = 0;
    let multiplier = 2;
    for (let i = body.length - 1; i >= 0; i--) {
        sum += parseInt(body[i], 10) * multiplier;
        multiplier = multiplier === 7 ? 2 : multiplier + 1;
    }
    const mod = 11 - (sum % 11);
    if (mod === 11) return '0';
    if (mod === 10) return 'K';
    return String(mod);
}

/**
 * Validates a full Chilean RUT (with check digit).
 * Returns true only if the digit matches and the body is reasonable (7-8 digits).
 */
export function isValidRut(value: string): boolean {
    const cleaned = cleanRut(value);
    if (!/^\d{7,8}[0-9K]$/.test(cleaned)) return false;

    const body = cleaned.slice(0, -1);
    const dv = cleaned.slice(-1);
    return computeCheckDigit(body) === dv;
}
