/**
 * Subida de videos vía Base64 (JSON), uno por petición.
 *
 * Motivo: Cloudflare (plan Free/Pro) corta cualquier request > 100 MB. Mandar
 * varios videos juntos en un FormData los sumaba todos y disparaba 413. Acá
 * cada video viaja en su propia petición, así que mientras cada uno pese
 * menos de ~70 MB pasa sin problema.
 */

function fileToDataUrl(file: File | Blob): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error('No se pudo leer el archivo'));
        reader.readAsDataURL(file);
    });
}

export async function uploadVideoBase64(
    file: File,
    directory: string,
    oldUrl?: string | null,
): Promise<string> {
    const csrfToken = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content ?? '';

    // Hard cap del lado cliente: 70 MB binario para dejar margen al overhead
    // Base64 (~33%) y mantenernos por debajo del límite de Cloudflare (100 MB).
    if (file.size > 70 * 1024 * 1024) {
        throw new Error('El video supera los 70 MB. Comprímelo antes de subirlo (HandBrake / ffmpeg).');
    }

    const dataUrl = await fileToDataUrl(file);

    const res = await fetch('/admin/upload-video', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrfToken,
            Accept: 'application/json',
        },
        body: JSON.stringify({
            video: dataUrl,
            directory,
            old_url: oldUrl ?? null,
        }),
    });

    if (!res.ok) {
        let reason = `HTTP ${res.status}`;
        try {
            const body = await res.json();
            if (body?.error) reason = body.error;
        } catch {
            // sin body JSON — usamos el código HTTP
        }
        throw new Error(reason);
    }

    const body = await res.json();
    if (!body?.url) throw new Error('Respuesta inválida del servidor.');
    return body.url as string;
}
