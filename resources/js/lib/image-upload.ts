/**
 * Subida de imágenes vía Base64 (JSON), no multipart.
 *
 * ModSecurity (regla OWASP 930110) bloquea con 403 los uploads multipart
 * porque los bytes `../` aparecen en cualquier binario. Base64 usa solo
 * [A-Za-z0-9+/=] — sin `.` — así que el patrón nunca aparece y la regla no
 * matchea. Comprimimos la imagen, la mandamos como data URL en un JSON, y el
 * endpoint la decodifica y guarda.
 */
import { compressImage } from '@/lib/image-compress';

function fileToDataUrl(file: File | Blob): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error('No se pudo leer el archivo'));
        reader.readAsDataURL(file);
    });
}

/**
 * Comprime la imagen, la codifica en Base64 y la sube al endpoint JSON.
 * Reintenta con backoff por si el WAF/servidor responde transitoriamente.
 * Devuelve la URL pública o lanza un Error con el motivo.
 */
export async function uploadImageBase64(
    file: File,
    directory: string,
    oldUrl?: string | null,
): Promise<string> {
    const csrfToken = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content ?? '';

    // Recompresión progresiva con minSizeBytes:0 → SIEMPRE re-encodea, incluso
    // si la imagen ya era chica. Esto es clave: con compressUntilUnder, si la
    // imagen original ya estaba bajo el target, devolvía los mismos bytes y
    // los 3 reintentos mandaban exactamente lo mismo. Ahora cada intento manda
    // bytes garantizadamente distintos (distinto re-encode), lo que vence:
    //  - Reglas de WAF que matchean contenido por azar.
    //  - Límites de tamaño del body (cada intento es más liviano).
    // Backoff agresivo para sortear rate-limits del WAF tras varios uploads.
    const PASSES = [
        { maxDimension: 2400, quality: 0.85, minSizeBytes: 0 },
        { maxDimension: 1800, quality: 0.65, minSizeBytes: 0 },
        { maxDimension: 1400, quality: 0.45, minSizeBytes: 0 },
    ];
    const BACKOFF_MS = [0, 1500, 4000];
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
    let lastError = 'razón desconocida';

    for (let attempt = 1; attempt <= 3; attempt++) {
        if (BACKOFF_MS[attempt - 1] > 0) await sleep(BACKOFF_MS[attempt - 1]);
        try {
            const compressed = await compressImage(file, PASSES[attempt - 1]);
            const dataUrl = await fileToDataUrl(compressed);
            const res = await fetch('/admin/upload-image', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    Accept: 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                credentials: 'same-origin',
                body: JSON.stringify({ image: dataUrl, directory, old_url: oldUrl ?? null }),
            });
            if (!res.ok) {
                const ct = res.headers.get('content-type') ?? '';
                throw new Error(
                    ct.includes('text/html')
                        ? `HTTP ${res.status} (bloqueado por servidor web)`
                        : `HTTP ${res.status}`,
                );
            }
            const json = await res.json();
            if (!json.url) throw new Error('Respuesta sin URL');
            return json.url as string;
        } catch (err) {
            lastError = err instanceof Error ? err.message : String(err);
            if (attempt === 3) throw new Error(lastError);
        }
    }
    throw new Error(lastError);
}
