<?php

namespace App\Services;

use App\Models\Seminuevo;
use App\Models\VehicleVersion;
use Illuminate\Support\Collection;

/**
 * Normaliza vehículos (Seminuevo y VehicleVersion+satélites) al mismo shape
 * para el comparador. El frontend recibe `{ id, tipo, brand, model, version,
 * year, price, image, slug, specs: { label: value } }` sin importar el origen
 * y completa la tabla buscando por label.
 *
 * IDs unificados:
 *   - `s-{id}` = Seminuevo
 *   - `v-{id}` = VehicleVersion (nuevo)
 *
 * Si un campo no existe en BD se devuelve "—" para que el frontend lo muestre
 * sin lógica adicional.
 */
class VehiculoComparadorService
{
    public const DASH = '—';

    /** Etiquetas de la tabla comparativa — deben matchear el frontend. */
    public const SECTIONS = [
        'Principales' => [
            'Estado del vehículo',
            'Tipo de powertrain',
            'Año del modelo',
        ],
        'Motor' => [
            'Combustible',
            'Cilindrada',
            'Potencia',
            'Torque',
            'Alimentación',
            'Cilindros',
            'Disposición',
            'Norma de emisiones',
        ],
        'Performance' => [
            'Aceleración 0-100 km/h',
            'Rendimiento en ciudad',
            'Rendimiento en ruta',
            'Rendimiento mixto',
            'Velocidad máxima',
            'Etiqueta eficiencia',
        ],
        'Transmisión y chasis' => [
            'Tracción',
            'Transmisión',
            'Neumáticos delanteros',
            'Neumáticos traseros',
            'Frenos (delanteros - traseros)',
            'Suspensión delantera',
            'Suspensión trasera',
            'Dirección',
            'Llantas',
        ],
        'Dimensiones' => [
            'Largo',
            'Ancho',
            'Alto',
            'Distancia entre ejes',
            'Despeje del suelo',
        ],
        'Equipamiento' => [
            // Se llena dinámicamente desde features (nuevos) y specs.equipment (seminuevos).
            // Las labels que se mostrarán salen del union de ambos en runtime — el
            // frontend hace merge de claves desde los vehículos seleccionados.
        ],
    ];

    /**
     * Convierte un identificador unificado a su entidad cargada, o null.
     * Formato: "s-123" o "v-45".
     */
    public function resolve(string $unifiedId): ?array
    {
        if (preg_match('/^s-(\d+)$/', $unifiedId, $m)) {
            $seminuevo = Seminuevo::where('id', (int) $m[1])->where('is_visible', true)->first();
            return $seminuevo ? $this->mapSeminuevo($seminuevo) : null;
        }
        if (preg_match('/^v-(\d+)$/', $unifiedId, $m)) {
            $version = VehicleVersion::with(['engine', 'electric', 'dimensions', 'capacities', 'performance', 'chassis', 'features', 'model.brand'])
                ->where('id', (int) $m[1])
                ->where('is_active', true)
                ->first();
            return $version ? $this->mapVersion($version) : null;
        }
        return null;
    }

    /**
     * Mapea CSV de ids unificados (?ids=s-1,v-2) a sus arrays normalizados.
     * Filtra nulls (ids inexistentes o no visibles) silenciosamente.
     *
     * @return array<int,array<string,mixed>>
     */
    public function resolveMany(string $csv): array
    {
        if (trim($csv) === '') return [];
        $ids = array_filter(array_map('trim', explode(',', $csv)));
        $out = [];
        foreach ($ids as $id) {
            $row = $this->resolve($id);
            if ($row) $out[] = $row;
        }
        return $out;
    }

    /**
     * Catálogo de TODOS los vehículos disponibles para elegir en el modal.
     * Se devuelve compacto (sin specs completos — solo lo necesario para los
     * dropdowns y el thumbnail).
     */
    public function catalogo(): array
    {
        $seminuevos = Seminuevo::where('is_visible', true)
            ->orderBy('brand')->orderBy('model')->orderBy('year', 'desc')
            ->get()
            ->map(fn (Seminuevo $s) => [
                'id'      => 's-' . $s->id,
                'tipo'    => 'seminuevo',
                'estado'  => 'Semi Nuevo',
                'brand'   => $s->brand,
                'model'   => $s->model,
                'version' => trim("{$s->year} · " . ($s->transmission ?: '') . ' · ' . ($s->fuel ?: ''), ' ·'),
                'year'    => (int) $s->year,
                'price'   => (int) $s->price,
                'image'   => $this->primeraImagen($s->gallery, $s->featured_gallery),
                'slug'    => $s->slug,
                'href'    => '/seminuevos/' . ($s->slug ?: $s->id),
            ]);

        $versions = VehicleVersion::with('model.brand')
            ->where('is_active', true)
            ->orderBy('display_order')
            ->get()
            ->map(fn (VehicleVersion $v) => [
                'id'      => 'v-' . $v->id,
                'tipo'    => 'nuevo',
                'estado'  => 'Nuevo',
                'brand'   => $v->model?->brand?->name ?? '',
                'model'   => $v->model?->name ?? '',
                'version' => $v->trim_name,
                'year'    => (int) $v->model_year,
                'price'   => (int) ($v->msrp_clp ?? 0),
                'image'   => $this->resolveImage($v->hero_image),
                'slug'    => $v->slug,
                'href'    => '/nuevos/' . ($v->model?->slug ?? $v->slug),
            ]);

        return $seminuevos->concat($versions)->values()->all();
    }

    /**
     * @return array{
     *   id:string, tipo:string, estado:string, brand:string, model:string, version:string,
     *   year:int, price:int, image:?string, slug:?string, href:string,
     *   specs: array<string,string>, equipment: array<string,string>
     * }
     */
    public function mapSeminuevo(Seminuevo $s): array
    {
        $specs = [
            'Estado del vehículo'   => 'Semi Nuevo',
            'Tipo de powertrain'    => self::DASH,
            'Año del modelo'        => (string) $s->year,

            'Combustible'           => $s->fuel ?: self::DASH,
            'Cilindrada'            => self::DASH,
            'Potencia'              => self::DASH,
            'Torque'                => self::DASH,
            'Alimentación'          => self::DASH,
            'Cilindros'             => self::DASH,
            'Disposición'           => self::DASH,
            'Norma de emisiones'    => self::DASH,

            'Aceleración 0-100 km/h'=> self::DASH,
            'Rendimiento en ciudad' => self::DASH,
            'Rendimiento en ruta'   => self::DASH,
            'Rendimiento mixto'     => self::DASH,
            'Velocidad máxima'      => self::DASH,
            'Etiqueta eficiencia'   => self::DASH,

            'Tracción'              => $s->traction ?: self::DASH,
            'Transmisión'           => $s->transmission ?: self::DASH,
            'Neumáticos delanteros' => self::DASH,
            'Neumáticos traseros'   => self::DASH,
            'Frenos (delanteros - traseros)' => self::DASH,
            'Suspensión delantera'  => self::DASH,
            'Suspensión trasera'    => self::DASH,
            'Dirección'             => self::DASH,
            'Llantas'               => self::DASH,

            'Largo'                 => self::DASH,
            'Ancho'                 => self::DASH,
            'Alto'                  => self::DASH,
            'Distancia entre ejes'  => self::DASH,
            'Despeje del suelo'     => self::DASH,
        ];

        // specs.general[] viene del admin con campos libres (Motor / Rendimiento)
        // pero rara vez tiene valor. Se conserva por si admin lo carga.
        foreach (($s->specs['general'] ?? []) as $kv) {
            if (! empty($kv['label']) && ! empty($kv['value'])) {
                $specs[$kv['label']] = $kv['value'];
            }
        }

        // Equipment del seminuevo → bucket separado para que el frontend lo
        // muestre como sección de checkmarks.
        $equipment = [];
        foreach (($s->specs['equipment'] ?? []) as $kv) {
            if (! empty($kv['label'])) {
                $equipment[$kv['label']] = $kv['value'] ?: 'Sí';
            }
        }

        return [
            'id'        => 's-' . $s->id,
            'tipo'      => 'seminuevo',
            'estado'    => 'Semi Nuevo',
            'brand'     => $s->brand,
            'model'     => $s->model,
            'version'   => trim("{$s->year} · " . ($s->transmission ?: '') . ' · ' . ($s->fuel ?: ''), ' ·'),
            'year'      => (int) $s->year,
            'price'     => (int) $s->price,
            'image'     => $this->primeraImagen($s->gallery, $s->featured_gallery),
            'slug'      => $s->slug,
            'href'      => '/seminuevos/' . ($s->slug ?: $s->id),
            'km'        => $s->km !== null ? number_format($s->km, 0, ',', '.') . ' km' : self::DASH,
            'transmision_short' => $s->transmission ?: self::DASH,
            'fuel_short'        => $s->fuel ?: self::DASH,
            'specs'     => $specs,
            'equipment' => $equipment,
        ];
    }

    public function mapVersion(VehicleVersion $v): array
    {
        $engine       = $v->engine;
        $perf         = $v->performance;
        $dim          = $v->dimensions;
        $chas         = $v->chassis;

        $cilindradaTxt = $engine?->displacement_cc ? $engine->displacement_cc . ' cc' : self::DASH;
        $potenciaTxt   = $engine?->hp
            ? $engine->hp . ' hp' . ($engine->hp_rpm ? ' @ ' . $engine->hp_rpm . ' rpm' : '')
            : self::DASH;
        $torqueTxt     = $engine?->torque_nm
            ? $engine->torque_nm . ' Nm' . ($engine->torque_rpm_min ? ' @ ' . $engine->torque_rpm_min .
                ($engine->torque_rpm_max ? '-' . $engine->torque_rpm_max : '') . ' rpm' : '')
            : self::DASH;
        $frenos = ($chas?->front_brakes || $chas?->rear_brakes)
            ? (($chas?->front_brakes ?: self::DASH) . ' - ' . ($chas?->rear_brakes ?: self::DASH))
            : self::DASH;

        $specs = [
            'Estado del vehículo'   => 'Nuevo',
            'Tipo de powertrain'    => $v->powertrain_type ?: self::DASH,
            'Año del modelo'        => (string) $v->model_year,

            'Combustible'           => $engine?->fuel_type ?: self::DASH,
            'Cilindrada'            => $cilindradaTxt,
            'Potencia'              => $potenciaTxt,
            'Torque'                => $torqueTxt,
            'Alimentación'          => $engine?->fuel_system ?: self::DASH,
            'Cilindros'             => $engine?->cylinders !== null ? (string) $engine->cylinders : self::DASH,
            'Disposición'           => $engine?->layout ?: self::DASH,
            'Norma de emisiones'    => $engine?->emissions_standard ?: self::DASH,

            'Aceleración 0-100 km/h'=> $perf?->acceleration_0_100_s ? $perf->acceleration_0_100_s . ' s' : self::DASH,
            'Rendimiento en ciudad' => $perf?->city_kml ? $perf->city_kml . ' km/l' : self::DASH,
            'Rendimiento en ruta'   => $perf?->highway_kml ? $perf->highway_kml . ' km/l' : self::DASH,
            'Rendimiento mixto'     => $perf?->combined_kml ? $perf->combined_kml . ' km/l' : self::DASH,
            'Velocidad máxima'      => $perf?->top_speed_kmh ? $perf->top_speed_kmh . ' km/h' : self::DASH,
            'Etiqueta eficiencia'   => $perf?->energy_efficiency_label ?: self::DASH,

            'Tracción'              => $v->drivetrain ?: self::DASH,
            'Transmisión'           => $v->transmission_type
                ? $v->transmission_type . ($v->transmission_speeds ? ' ' . $v->transmission_speeds . ' vel.' : '')
                : self::DASH,
            'Neumáticos delanteros' => $chas?->front_tire ?: self::DASH,
            'Neumáticos traseros'   => $chas?->rear_tire ?: self::DASH,
            'Frenos (delanteros - traseros)' => $frenos,
            'Suspensión delantera'  => $chas?->front_suspension ?: self::DASH,
            'Suspensión trasera'    => $chas?->rear_suspension ?: self::DASH,
            'Dirección'             => $chas?->steering_type ?: self::DASH,
            'Llantas'               => $chas?->wheel_size_in
                ? $chas->wheel_size_in . '"' . ($chas->wheel_material ? ' ' . $chas->wheel_material : '')
                : self::DASH,

            'Largo'                 => $dim?->length_mm ? $dim->length_mm . ' mm' : self::DASH,
            'Ancho'                 => $dim?->width_mm ? $dim->width_mm . ' mm' : self::DASH,
            'Alto'                  => $dim?->height_mm ? $dim->height_mm . ' mm' : self::DASH,
            'Distancia entre ejes'  => $dim?->wheelbase_mm ? $dim->wheelbase_mm . ' mm' : self::DASH,
            'Despeje del suelo'     => $dim?->ground_clearance_mm ? $dim->ground_clearance_mm . ' mm' : self::DASH,
        ];

        // Equipamiento del Nuevo viene de features (BelongsToMany)
        $equipment = [];
        foreach ($v->features as $feature) {
            $equipment[$feature->name_es] = 'Sí';
        }

        return [
            'id'        => 'v-' . $v->id,
            'tipo'      => 'nuevo',
            'estado'    => 'Nuevo',
            'brand'     => $v->model?->brand?->name ?? '',
            'model'     => $v->model?->name ?? '',
            'version'   => $v->trim_name,
            'year'      => (int) $v->model_year,
            'price'     => (int) ($v->msrp_clp ?? 0),
            'image'     => $this->resolveImage($v->hero_image),
            'slug'      => $v->slug,
            'href'      => '/nuevos/' . ($v->model?->slug ?? $v->slug),
            'km'        => '0 km',
            'transmision_short' => $v->transmission_type ?: self::DASH,
            'fuel_short'        => $engine?->fuel_type ?: self::DASH,
            'specs'     => $specs,
            'equipment' => $equipment,
        ];
    }

    /** Primera imagen disponible — usa featured_gallery primero, luego gallery. */
    private function primeraImagen(?array $gallery, ?array $featured): ?string
    {
        return $this->resolveImage(($featured[0] ?? null) ?: ($gallery[0] ?? null));
    }

    /**
     * Normaliza una ruta de imagen a una URL pública usable por el front.
     * Las imágenes subidas vía SiteSettingsService::uploadFile ya vienen con
     * el prefijo `/storage/...`, así que NO hay que volver a anteponerlo (eso
     * generaba `/storage/storage/...` → imagen rota en el comparador). Solo las
     * rutas relativas "peladas" (sin storage) reciben el prefijo.
     */
    private function resolveImage(?string $path): ?string
    {
        if (! $path) return null;
        if (str_starts_with($path, 'http')) return $path;
        if (str_starts_with($path, '/storage/')) return $path;
        if (str_starts_with($path, 'storage/')) return '/' . $path;
        return asset('storage/' . ltrim($path, '/'));
    }
}
