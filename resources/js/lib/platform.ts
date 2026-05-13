/**
 * Detect the visitor's mobile platform from the User-Agent.
 * Returns 'ios' | 'android' | 'other' (desktop, unknown, bots, etc).
 *
 * Uses the legacy `userAgent` string because it's stable across all browsers.
 * `navigator.userAgentData` is more modern but is Chromium-only and the
 * `platform` field requires a permission prompt on iOS.
 */
export function detectMobilePlatform(): 'ios' | 'android' | 'other' {
    if (typeof navigator === 'undefined') return 'other';
    const ua = navigator.userAgent || (navigator as { vendor?: string }).vendor || '';

    // iPadOS 13+ reports as Mac with touch — distinguish via touch points.
    const isIPadOnMacUA = /Macintosh/.test(ua) && navigator.maxTouchPoints > 1;
    if (/iPad|iPhone|iPod/.test(ua) || isIPadOnMacUA) return 'ios';

    if (/android/i.test(ua)) return 'android';

    return 'other';
}

/**
 * Pick the best store URL for the visitor's device. Returns:
 * - iOS URL if visitor is on iPhone/iPad and an iOS URL is provided
 * - Android URL if visitor is on Android and an Android URL is provided
 * - Otherwise the first non-empty URL (so desktop visitors still get a link)
 */
export function pickStoreUrl(opts: { android?: string | null; ios?: string | null; fallback?: string | null }): string | null {
    const platform = detectMobilePlatform();
    if (platform === 'ios' && opts.ios) return opts.ios;
    if (platform === 'android' && opts.android) return opts.android;
    return opts.android || opts.ios || opts.fallback || null;
}
