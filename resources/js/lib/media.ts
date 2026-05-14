export function isVideoUrl(url: string | null | undefined): boolean {
    if (!url) return false;
    return /\.(mp4|webm|mov|m4v|ogg)(\?|$)/i.test(url);
}

/**
 * Picks the right image URL for the current viewport. If `isMobile` is true and
 * a `mobile` URL is set, use it. Otherwise fall back to `desktop`. If neither
 * is set, returns an empty string so the caller can apply its own fallback.
 */
export function pickResponsiveImage(
    desktop: string | null | undefined,
    mobile: string | null | undefined,
    isMobile: boolean,
): string {
    if (isMobile && mobile) return mobile;
    return desktop || mobile || '';
}
