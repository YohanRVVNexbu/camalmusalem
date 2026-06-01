/**
 * Helpers para shorts/reels multi-plataforma (YouTube, Instagram, TikTok).
 *
 * Un short se guarda como { url, thumbnail }. La plataforma se deriva de la
 * URL en render — así no hay que guardar/migrar un campo extra y el cliente
 * solo pega la URL.
 *
 *  - YouTube: miniatura automática (img.youtube.com). Embed directo.
 *  - Instagram / TikTok: no hay miniatura pública → el cliente sube una; el
 *    embed funciona vía iframe.
 */

export type ShortItem = { url: string; thumbnail?: string | null };
export type Platform = 'youtube' | 'instagram' | 'tiktok' | 'other';

export function detectPlatform(url: string): Platform {
    if (/youtube\.com|youtu\.be/.test(url)) return 'youtube';
    if (/instagram\.com/.test(url)) return 'instagram';
    if (/tiktok\.com/.test(url)) return 'tiktok';
    return 'other';
}

function youtubeId(url: string): string | null {
    const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/);
    return m ? m[1] : null;
}

// Instagram: /reel/CODE/, /p/CODE/, /tv/CODE/ → { type, code }
function instagramRef(url: string): { type: string; code: string } | null {
    const m = url.match(/instagram\.com\/(reel|reels|p|tv)\/([A-Za-z0-9_-]+)/);
    if (!m) return null;
    // El embed de IG usa /p/ o /reel/; normalizamos "reels" → "reel".
    const type = m[1] === 'reels' ? 'reel' : m[1];
    return { type, code: m[2] };
}

// TikTok canónico: /@user/video/ID. (Links cortos vm.tiktok.com no exponen el ID.)
function tiktokId(url: string): string | null {
    const m = url.match(/tiktok\.com\/(?:@[^/]+\/video\/|v\/|embed\/v2\/)(\d+)/);
    return m ? m[1] : null;
}

/**
 * URL para el <iframe> que reproduce el short embebido. Null si no se puede
 * resolver (ej. link corto de TikTok sin ID) — el caller debería abrir la URL
 * original en pestaña nueva como fallback.
 */
export function embedSrc(url: string): string | null {
    switch (detectPlatform(url)) {
        case 'youtube': {
            const id = youtubeId(url);
            return id ? `https://www.youtube.com/embed/${id}?autoplay=1&loop=1&playlist=${id}` : null;
        }
        case 'instagram': {
            const ref = instagramRef(url);
            return ref ? `https://www.instagram.com/${ref.type}/${ref.code}/embed` : null;
        }
        case 'tiktok': {
            const id = tiktokId(url);
            return id ? `https://www.tiktok.com/embed/v2/${id}` : null;
        }
        default:
            return null;
    }
}

/**
 * Miniatura del short. Prioridad: la imagen subida por el cliente; si no hay
 * y es YouTube, la miniatura automática; si no, null (el componente cae al
 * logo de la plataforma como placeholder).
 */
export function shortThumbnail(item: ShortItem): string | null {
    if (item.thumbnail) return item.thumbnail;
    if (detectPlatform(item.url) === 'youtube') {
        const id = youtubeId(item.url);
        if (id) return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
    }
    return null;
}
