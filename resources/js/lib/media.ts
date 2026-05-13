export function isVideoUrl(url: string | null | undefined): boolean {
    if (!url) return false;
    return /\.(mp4|webm|mov|m4v|ogg)(\?|$)/i.test(url);
}
