/**
 * Recursively append a value to FormData using PHP bracket notation.
 * `appendNested(fd, 'data', { foo: { bar: 1 } })` → fd: data[foo][bar]=1
 */
export function appendNested(fd: FormData, prefix: string, value: unknown): void {
    if (value === null || value === undefined) {
        fd.append(prefix, '');
    } else if (Array.isArray(value)) {
        value.forEach((item, i) => appendNested(fd, `${prefix}[${i}]`, item));
    } else if (value instanceof File || value instanceof Blob) {
        fd.append(prefix, value);
    } else if (typeof value === 'object') {
        Object.entries(value as Record<string, unknown>).forEach(([k, v]) =>
            appendNested(fd, `${prefix}[${k}]`, v),
        );
    } else {
        fd.append(prefix, String(value));
    }
}

/**
 * Convert a dot-notation path into PHP bracket notation.
 * `dotToBracket('cards.0.image')` → `'cards[0][image]'`
 *
 * Required because PHP silently rewrites dots to underscores in form field
 * names, which breaks `data_get()` lookups against the original JSON paths.
 */
export function dotToBracket(key: string): string {
    return key.replace(/\.([^.]+)/g, '[$1]');
}
