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
