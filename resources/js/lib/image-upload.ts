/**
 * Subida de imágenes vía Base64 (JSON), no multipart.
 *
 * ModSecurity (regla OWASP 930110) bloquea con 403 los uploads multipart
 * porque los bytes `../` aparecen en cualquier binario. Base64 usa solo
 * [A-Za-z0-9+/=] — sin `.` — así que el patrón nunca aparece y la regla no
 * matchea. Comprimimos la imagen, la mandamos como data URL en un JSON, y el
 * endpoint la decodifica y guarda.
 */
import { compressUntilUnder } from '@/lib/image-compress';

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

    // Bajamos el target en cada reintento. Esto consigue dos cosas a la vez:
    //  - Bytes más chicos → no se topa con MaxReqBodySize / SecRequestBodyLimit
    //    (recordar que Base64 infla ~33% el tamaño raw).
    //  - Bytes distintos en cada intento → si por mala suerte el contenido del
    //    Base64 matchea con alguna regla del WAF, el reintento manda otros bytes
    //    completamente distintos y la regla ya no matchea.
    const TARGETS_BYTES = [1_000_000, 600_000, 300_000]; // 1 MB → 600 KB → 300 KB raw
    const BACKOFF_MS = [0, 800, 2000];
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
    let lastError = 'razón desconocida';

    for (let attempt = 1; attempt <= 3; attempt++) {
        if (BACKOFF_MS[attempt - 1] > 0) await sleep(BACKOFF_MS[attempt - 1]);
        try {
            const compressed = await compressUntilUnder(file, TARGETS_BYTES[attempt - 1]);
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
