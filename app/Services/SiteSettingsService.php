<?php

namespace App\Services;

use App\Models\SiteSection;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\Encoders\WebpEncoder;
use Intervention\Image\ImageManager;
use Throwable;

class SiteSettingsService
{
    /**
     * Imágenes que excedan este ancho/alto se redimensionan hacia abajo.
     * 2400px alcanza para verse nítido en pantallas 4K sin sobrecargar
     * el ancho de banda en mobile.
     */
    private const MAX_DIMENSION = 2400;

    /**
     * Calidad de compresión WebP. 82 es el sweet spot: imperceptible
     * para fotos web, pero pesa ~30-40% menos que JPG calidad 90.
     */
    private const WEBP_QUALITY = 82;

    /** Bytes mínimos para optimizar — si pesa menos no vale la pena el CPU. */
    private const MIN_SIZE_TO_OPTIMIZE = 80 * 1024; // 80 KB

    public function getHomePageData(): array
    {
        return SiteSection::getVisibleSections();
    }

    public function getAllSectionsForAdmin(): array
    {
        return SiteSection::getAllForAdmin();
    }

    public function updateSection(string $section, array $data, bool $isVisible): void
    {
        SiteSection::where('section', $section)->update([
            'data' => $data,
            'is_visible' => $isVisible,
        ]);
    }

    /**
     * Guarda un archivo subido en el disco `public`, aplicando optimización
     * cuando es una imagen rasterizada (JPG/PNG/WebP). La estrategia:
     *
     *  - Redimensiona hacia abajo si excede MAX_DIMENSION.
     *  - Convierte a WebP con calidad 82 (gran ahorro vs JPG/PNG sin pérdida
     *    visual perceptible, soporta transparencia).
     *  - SVG, PDF, y cualquier otro formato pasan intactos.
     *  - Si la imagen ya pesa menos de MIN_SIZE_TO_OPTIMIZE, se sube sin
     *    procesar (no vale gastar CPU).
     *
     * @param  bool  $preserveSize  Si es true, NO se redimensiona (se preserva
     *                              el tamaño original). Útil para fotos del
     *                              visor 360° donde el usuario rota y se notan
     *                              detalles. La compresión WebP igual se
     *                              aplica para no llenar el disco.
     */
    public function uploadFile(UploadedFile $file, string $directory = 'home', bool $preserveSize = false): string
    {
        $extension = strtolower($file->getClientOriginalExtension() ?: ($file->guessExtension() ?? ''));

        if ($this->isOptimizableImage($extension) && $file->getSize() >= self::MIN_SIZE_TO_OPTIMIZE) {
            $optimized = $this->optimize($file, $directory, $extension, $preserveSize);
            if ($optimized !== null) {
                $webpName = Str::random(40).'.webp';
                $webpRelative = $directory.'/'.$webpName;
                Storage::disk('public')->put($webpRelative, $optimized);
                return '/storage/'.$webpRelative;
            }
        }

        $name = Str::random(40).($extension ? '.'.$extension : '');
        $path = $file->storeAs($directory, $name, 'public');
        return '/storage/'.$path;
    }

    public function deleteOldFile(?string $url): void
    {
        if (! $url || ! str_contains($url, '/storage/')) {
            return;
        }

        // Protect seeder defaults: any file under /storage/defaults/ is the
        // canonical "factory reset" asset and must never be deleted, even when
        // a user replaces it from the admin.
        $parsed = parse_url($url, PHP_URL_PATH);
        $path = str_replace('/storage/', '', $parsed ?? $url);

        if (str_starts_with($path, 'defaults/')) {
            return;
        }

        Storage::disk('public')->delete($path);
    }

    private function isOptimizableImage(string $extension): bool
    {
        return in_array($extension, ['jpg', 'jpeg', 'png', 'webp'], true);
    }

    /**
     * Intenta optimizar la imagen con Intervention y devolver bytes WebP.
     * Si por cualquier razón falla (formato corrupto, GD sin soporte,
     * memoria), devuelve null para que el caller haga fallback al upload
     * sin optimizar — vale más subir la imagen sin optimizar que romper
     * el flujo del admin.
     */
    private function optimize(UploadedFile $file, string $directory, string $extension, bool $preserveSize = false): ?string
    {
        try {
            // GD descomprime imágenes a buffer raw (width × height × 4 bytes).
            // Una JPG de 8000×5000 ocupa ~160 MB en memoria, y necesitamos
            // 2-3 copias temporales (decode + scaleDown + encode). El
            // memory_limit default de PHP (128 MB) no alcanza; muchos
            // hostings compartidos lo dejan bajo aunque cPanel muestre otro
            // valor. Forzamos 1 GB para que aguante imágenes muy grandes
            // (típicas en sets de fotos 360° del vehículo).
            ini_set('memory_limit', '1024M');
            // Lo mismo con el tiempo: encodear varias imágenes pesadas
            // en una sola request puede pasar de los 30s default y caer
            // en 504/timeout del web.
            @set_time_limit(300);

            $manager = new ImageManager(new Driver);
            $image = $manager->decodePath($file->getRealPath());

            // scaleDown nunca agranda — si la imagen ya es chica, deja como está.
            // Si el caller pidió preserveSize (típicamente fotos del visor 360°
            // donde el usuario rota y se notan detalles), saltamos el resize y
            // solo aplicamos compresión WebP.
            if (! $preserveSize) {
                $image->scaleDown(width: self::MAX_DIMENSION, height: self::MAX_DIMENSION);
            }

            $encoded = (string) $image->encode(new WebpEncoder(quality: self::WEBP_QUALITY));

            $originalBytes = $file->getSize();
            $optimizedBytes = strlen($encoded);

            // Si por algún motivo WebP quedó más grande que el original
            // (raro pero pasa con PNGs pequeños muy comprimidos),
            // devolvemos null y se sube el original tal cual.
            if ($optimizedBytes >= $originalBytes) {
                return null;
            }

            Log::info('SiteSettingsService: imagen optimizada a WebP', [
                'directory' => $directory,
                'original_format' => $extension,
                'original_kb' => round($originalBytes / 1024, 1),
                'optimized_kb' => round($optimizedBytes / 1024, 1),
                'savings_pct' => round((1 - $optimizedBytes / $originalBytes) * 100, 1),
            ]);

            return $encoded;
        } catch (Throwable $e) {
            Log::warning('SiteSettingsService: fallo al optimizar imagen, se sube sin optimizar', [
                'directory' => $directory,
                'extension' => $extension,
                'error' => $e->getMessage(),
            ]);
            return null;
        }
    }
}
