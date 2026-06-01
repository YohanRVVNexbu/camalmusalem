<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\Encoders\WebpEncoder;
use Intervention\Image\ImageManager;
use Throwable;

/**
 * Recorre todas las imágenes del disco `public` y las convierte a WebP
 * cuando hay un ahorro significativo. Sirve para "limpiar" el storage
 * después de instalar la optimización automática en uploads — los
 * archivos viejos no pasan por SiteSettingsService, así que este comando
 * los actualiza retroactivamente.
 *
 * Pasos por archivo:
 *  1. Lee la imagen original.
 *  2. La redimensiona a max 2400px y la codifica a WebP calidad 82.
 *  3. Si el WebP es más chico, escribe el .webp con un nombre nuevo.
 *  4. Actualiza TODAS las referencias en la BD (URL vieja → URL nueva).
 *  5. Borra el archivo original.
 *
 * Nunca toca `storage/app/public/defaults/` — son los assets canónicos
 * del seeder.
 *
 * Uso:
 *   php artisan media:optimize              # Modo dry-run interactivo (default)
 *   php artisan media:optimize --apply      # Aplica los cambios (con confirmación)
 *   php artisan media:optimize --apply -y   # Aplica sin confirmar
 *   php artisan media:optimize --min-kb=200 # Sube threshold mínimo a 200KB
 */
class MediaOptimizeCommand extends Command
{
    protected $signature = 'media:optimize
        {--apply : Aplica los cambios en disco y BD (por defecto solo es preview)}
        {--y|yes : Salta la confirmación interactiva}
        {--min-kb=80 : Tamaño mínimo del archivo para procesarlo (KB)}';

    protected $description = 'Convierte imágenes existentes del disco public a WebP y actualiza referencias en BD.';

    /**
     * Tablas / columnas que contienen URLs de imágenes (o que pueden tenerlas
     * dentro de JSON). El comando hace UPDATE … REPLACE() en cada una para
     * que cualquier "/storage/foo/bar.png" referenciado se actualice a
     * "/storage/foo/bar.webp" cuando convertimos el archivo.
     */
    private const URL_COLUMNS = [
        'site_sections'   => ['data', 'default_data'],
        'brands'          => ['logo_path'],
        'repuestos'       => ['images'],
        'accesorios'      => ['images'],
        'merch'           => ['images'],
        'seminuevos'      => ['gallery', 'featured_gallery', 'specs'],
        'vehicle_models'  => ['hero_image', 'detail_content', 'datasheet_url', 'datasheet_file'],
        'vehicle_versions' => ['hero_image'],
        'version_colors'  => ['image_path'],
        'branches'        => ['image_path'],
        'noticias'        => ['image', 'sections'],
        'rentals'         => ['card_image'],
    ];

    private const MAX_DIMENSION = 2400;
    private const WEBP_QUALITY = 82;

    public function handle(): int
    {
        $apply = (bool) $this->option('apply');
        $skipConfirm = (bool) $this->option('yes');
        $minBytes = ((int) $this->option('min-kb')) * 1024;

        // GD necesita cargar la imagen entera descomprimida en memoria — un PNG
        // de 4000×3000 puede ocupar 50MB+ en RAM. El php.ini de CLI suele tener
        // 128MB. Forzamos un límite generoso solo para este proceso; no
        // afecta el resto del sitio.
        ini_set('memory_limit', '1024M');

        $this->info($apply ? 'Modo APPLY — los cambios se persistirán.' : 'Modo DRY-RUN — no se modifica nada todavía.');
        $this->line('Memory limit del proceso: '.ini_get('memory_limit'));
        $this->line('');

        $files = $this->collectImageFiles($minBytes);
        if (empty($files)) {
            $this->warn('No hay imágenes elegibles para optimizar.');
            return self::SUCCESS;
        }

        $this->info('Encontradas '.count($files).' imágenes elegibles (≥'.($minBytes / 1024).' KB).');

        if ($apply && ! $skipConfirm && ! $this->confirm('¿Continuar y reescribir estas imágenes + actualizar BD?', false)) {
            $this->warn('Cancelado.');
            return self::SUCCESS;
        }

        $manager = new ImageManager(new Driver);
        $totalOriginal = 0;
        $totalOptimized = 0;
        $converted = 0;
        $skipped = 0;
        $failed = 0;

        $bar = $this->output->createProgressBar(count($files));
        $bar->start();

        foreach ($files as $relativePath) {
            $bar->advance();
            try {
                $absPath = Storage::disk('public')->path($relativePath);
                $originalBytes = filesize($absPath);

                $encoded = (string) $manager->decodePath($absPath)
                    ->scaleDown(width: self::MAX_DIMENSION, height: self::MAX_DIMENSION)
                    ->encode(new WebpEncoder(quality: self::WEBP_QUALITY));

                $optimizedBytes = strlen($encoded);

                if ($optimizedBytes >= $originalBytes) {
                    $skipped++;
                    continue;
                }

                $totalOriginal += $originalBytes;
                $totalOptimized += $optimizedBytes;
                $converted++;

                if (! $apply) {
                    continue;
                }

                // Genera un nombre nuevo (con extensión .webp) en el mismo directorio.
                $dir = dirname($relativePath);
                $newRelative = ($dir === '.' ? '' : $dir.'/').Str::random(40).'.webp';

                Storage::disk('public')->put($newRelative, $encoded);

                $oldUrl = '/storage/'.$relativePath;
                $newUrl = '/storage/'.$newRelative;
                $this->updateReferences($oldUrl, $newUrl);

                Storage::disk('public')->delete($relativePath);
            } catch (Throwable $e) {
                $failed++;
                $bar->clear();
                $this->warn("\nFalló optimizar [$relativePath]: ".$e->getMessage());
                $bar->display();
            }
        }

        $bar->finish();
        $this->newLine(2);

        $ahorro = $totalOriginal > 0 ? round((1 - $totalOptimized / $totalOriginal) * 100, 1) : 0;

        $this->table(
            ['Métrica', 'Valor'],
            [
                ['Imágenes procesadas', count($files)],
                ['Convertidas',  $converted],
                ['Saltadas (WebP no daba ahorro)', $skipped],
                ['Fallidas', $failed],
                ['Tamaño original total',  round($totalOriginal / 1024 / 1024, 2).' MB'],
                ['Tamaño optimizado total', round($totalOptimized / 1024 / 1024, 2).' MB'],
                ['Ahorro',  $ahorro.'%'],
                ['Modo', $apply ? 'APPLY ✓' : 'DRY-RUN (corre con --apply)'],
            ],
        );

        return self::SUCCESS;
    }

    /**
     * Recolecta archivos del disco `public` que son imágenes elegibles
     * para optimización. Excluye `defaults/` (assets canónicos del seeder).
     *
     * @return list<string>
     */
    private function collectImageFiles(int $minBytes): array
    {
        $disk = Storage::disk('public');
        $allFiles = $disk->allFiles();

        $result = [];
        foreach ($allFiles as $path) {
            if (str_starts_with($path, 'defaults/')) {
                continue;
            }
            $ext = strtolower(pathinfo($path, PATHINFO_EXTENSION));
            if (! in_array($ext, ['jpg', 'jpeg', 'png'], true)) {
                continue;
            }
            $size = $disk->size($path);
            if ($size < $minBytes) {
                continue;
            }
            $result[] = $path;
        }

        return $result;
    }

    /**
     * Reemplaza todas las ocurrencias de $oldUrl por $newUrl en las
     * columnas declaradas en URL_COLUMNS. Funciona para columnas string,
     * text Y json — en MySQL las columnas json se almacenan como texto, así
     * que REPLACE() opera al nivel de la representación textual.
     */
    private function updateReferences(string $oldUrl, string $newUrl): void
    {
        foreach (self::URL_COLUMNS as $table => $columns) {
            foreach ($columns as $column) {
                DB::table($table)
                    ->where($column, 'like', '%'.$oldUrl.'%')
                    ->update([$column => DB::raw("REPLACE({$column}, ".DB::getPdo()->quote($oldUrl).', '.DB::getPdo()->quote($newUrl).')')]);
            }
        }
    }
}
