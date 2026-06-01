/**
 * Compresión de imágenes en el navegador antes del upload.
 *
 * Por qué existe: el LSAPI del hosting tiene memory_limit = 128 MB por
 * proceso (no se puede subir desde el código). Una foto del visor 360°
 * de 4093×2894 ocupa ~96 MB en memoria GD raw + 2-3 copias temporales =
 * ~300 MB, lo que mata el proceso y devuelve 403. La solución es
 * pre-procesar la imagen acá con Canvas API, así el server recibe algo
 * que sí puede manejar.
 *
 * Estrategia:
 *  - Si la imagen excede `maxDimension` en cualquier lado, se reduce
 *    proporcionalmente (nunca se agranda).
 *  - Se reencoda como JPG con la calidad indicada (default 92, calidad
 *    visual indistinguible del original para fotos web).
 *  - Si por cualquier motivo falla (formato exótico, OOM en el browser,
 *    etc.), se devuelve el archivo original sin modificar — preferimos
 *    que el upload intente que romper la UI.
 *  - Si la imagen ya es chica o no es raster, no se procesa.
 */

export type CompressOptions = {
    /** Lado máximo del bounding box después del resize. Default 3000px. */
    maxDimension?: number;
    /** Calidad de la JPG resultante, 0-1. Default 0.92. */
    quality?: number;
    /**
     * Tamaño mínimo en bytes para activar la compresión por peso (incluso
     * si la imagen no necesita resize). Default 800 KB — fotos del visor
     * 360 pesadas se recomprimen aunque sus dimensiones sean razonables,
     * porque el problema en prod suele ser el body size del request, no
     * la resolución de cada imagen.
     */
    minSizeBytes?: number;
};

const DEFAULT_MAX_DIMENSION = 3000;
const DEFAULT_QUALITY = 0.92;
const DEFAULT_MIN_SIZE = 800 * 1024; // 800 KB

const COMPRESSIBLE_MIMES = new Set([
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
]);

/**
 * Comprime una imagen si es necesario. Si la imagen no es comprimible
 * (SVG, GIF animado, formato exótico) o ya es chica, devuelve el archivo
 * original sin modificar.
 *
 * Formato de salida según el input:
 *  - PNG / WebP (formatos con alpha) → WebP (preserva transparencia)
 *  - JPG → JPG (no necesita alpha)
 *
 * Convertir un PNG con fondo transparente a JPG rellena el alpha con
 * negro (JPG no soporta canal alpha). El visor 360° del front muestra
 * los autos sobre fondo claro, así que ese fondo negro se ve roto.
 */
export async function compressImage(file: File, opts: CompressOptions = {}): Promise<File> {
    const maxDimension = opts.maxDimension ?? DEFAULT_MAX_DIMENSION;
    const quality = opts.quality ?? DEFAULT_QUALITY;
    const minSizeBytes = opts.minSizeBytes ?? DEFAULT_MIN_SIZE;

    if (! COMPRESSIBLE_MIMES.has(file.type)) return file;
    if (file.size < minSizeBytes) return file;

    try {
        const bitmap = await loadBitmap(file);
        const needsResize = Math.max(bitmap.width, bitmap.height) > maxDimension;

        // Si la imagen NI excede maxDimension NI pesa más de minSizeBytes,
        // no vale gastar CPU — el server la maneja bien tal cual.
        if (! needsResize && file.size < minSizeBytes) {
            bitmap.close?.();
            return file;
        }

        // Si necesita resize: aplicamos la nueva dimensión.
        // Si NO necesita resize pero pesa mucho: solo recomprimimos
        // manteniendo las dimensiones originales.
        const ratio = needsResize ? maxDimension / Math.max(bitmap.width, bitmap.height) : 1;
        const targetW = Math.round(bitmap.width * ratio);
        const targetH = Math.round(bitmap.height * ratio);

        const canvas = document.createElement('canvas');
        canvas.width = targetW;
        canvas.height = targetH;
        const ctx = canvas.getContext('2d');
        if (! ctx) {
            bitmap.close?.();
            return file;
        }
        ctx.drawImage(bitmap, 0, 0, targetW, targetH);
        bitmap.close?.();

        // Decidir formato de salida según el input. PNG y WebP pueden
        // tener transparencia → exportamos WebP para conservar el alpha.
        // JPG no tiene alpha → exportamos JPG (más chico que WebP para
        // fotos sin transparencia).
        const hasAlpha = file.type === 'image/png' || file.type === 'image/webp';
        const outputMime = hasAlpha ? 'image/webp' : 'image/jpeg';
        const outputExt = hasAlpha ? 'webp' : 'jpg';

        const blob = await canvasToBlob(canvas, outputMime, quality);
        if (! blob) return file;

        // Si por algún motivo el blob quedó más grande que el original
        // (raro pero pasa con imágenes ya muy comprimidas), preferimos el
        // original.
        if (blob.size >= file.size) return file;

        const newName = file.name.replace(/\.[^.]+$/, '') + '.' + outputExt;
        return new File([blob], newName, {
            type: outputMime,
            lastModified: file.lastModified,
        });
    } catch {
        // Cualquier error en Canvas API: caemos al archivo original. El
        // server tendrá que arreglárselas (mejor 403 que pantalla rota).
        return file;
    }
}

/**
 * Comprime varias imágenes en paralelo. Devuelve la lista en el mismo
 * orden de entrada para no romper el orden del usuario.
 */
export async function compressImages(files: File[], opts: CompressOptions = {}): Promise<File[]> {
    return Promise.all(files.map((f) => compressImage(f, opts)));
}

/**
 * Comprime una imagen con varios pases progresivamente más agresivos
 * hasta que entre debajo de `targetMaxBytes`. Útil para garantizar que
 * cada request individual pase por debajo del límite del LiteSpeed
 * `MaxReqBodySize` (~10 MB en muchos hostings).
 *
 * Pases (en orden):
 *   1. Calidad 0.92, max 3000px   (compresión normal)
 *   2. Calidad 0.85, max 2400px   (segundo pase si el primero no alcanza)
 *   3. Calidad 0.78, max 2000px   (tercer pase agresivo)
 *
 * Si después del tercer pase sigue por encima del target, devuelve el
 * último resultado igual — mejor un upload que pueda fallar que ningún
 * upload. El caller debería avisar al usuario en ese caso.
 */
export async function compressUntilUnder(file: File, targetMaxBytes: number): Promise<File> {
    const passes: CompressOptions[] = [
        { maxDimension: 3000, quality: 0.92, minSizeBytes: 0 },
        { maxDimension: 2400, quality: 0.85, minSizeBytes: 0 },
        { maxDimension: 2000, quality: 0.78, minSizeBytes: 0 },
    ];

    let current = file;
    for (const opts of passes) {
        if (current.size <= targetMaxBytes) return current;
        current = await compressImage(current, opts);
    }
    return current;
}

// ─── Internals ────────────────────────────────────────────────────────

async function loadBitmap(file: File): Promise<ImageBitmap | HTMLImageElement> {
    // createImageBitmap es ~3-5× más rápido que <img> y no bloquea el main
    // thread tanto, pero algunos browsers (Safari viejos) no lo soportan.
    if (typeof createImageBitmap === 'function') {
        try {
            return await createImageBitmap(file);
        } catch {
            // Fallback a <img>
        }
    }
    return await loadHTMLImage(file);
}

function loadHTMLImage(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(file);
        img.onload = () => {
            URL.revokeObjectURL(url);
            resolve(img);
        };
        img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error('No se pudo cargar la imagen'));
        };
        img.src = url;
    });
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob | null> {
    return new Promise((resolve) => {
        canvas.toBlob((b) => resolve(b), type, quality);
    });
}
