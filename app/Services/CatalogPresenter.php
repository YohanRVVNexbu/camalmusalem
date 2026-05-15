<?php

namespace App\Services;

use App\Models\VehicleModel;
use App\Models\VehicleVersion;

/**
 * Maps the normalized catalog (brands/models/versions + satellites) to the
 * flat shape the public "nuevos" pages expect — same structure that used to
 * live in the old `vehicles` table JSON columns.
 */
class CatalogPresenter
{
    private const BODY_TYPE_LABELS = [
        'sedan' => 'Sedán', 'hatchback' => 'Hatchback', 'suv' => 'SUV',
        'pickup' => 'Pickup', 'crossover' => 'SUV', 'coupe' => 'Coupé',
        'van' => 'Van', 'other' => 'Vehículo',
    ];

    private const POWERTRAIN_LABELS = [
        'gasoline' => 'Gasolina', 'diesel' => 'Diésel', 'hybrid' => 'Híbrido',
        'phev' => 'Híbrido Enchufable', 'bev' => 'Eléctrico',
    ];

    public function presentModel(VehicleModel $model): array
    {
        $model->loadMissing([
            'brand',
            'versions' => fn ($q) => $q->where('is_active', true)->orderBy('display_order'),
            'versions.engine', 'versions.electric', 'versions.dimensions',
            'versions.capacities', 'versions.performance', 'versions.chassis',
            'versions.features', 'versions.colors',
        ]);

        $firstVersion = $model->versions->first();
        $firstPowertrain = $firstVersion?->powertrain_type;

        return [
            'id' => $model->id,
            'name' => $model->name,
            'slug' => $model->slug,
            'full_name' => trim("{$model->brand->name} {$model->name}"),
            'subtitle' => $model->segment ?? $model->generation ?? null,
            'description' => $model->description,
            'type' => self::BODY_TYPE_LABELS[$model->body_type] ?? null,
            'fuel' => $firstPowertrain ? (self::POWERTRAIN_LABELS[$firstPowertrain] ?? null) : null,
            'hero_image' => $model->hero_image,
            'datasheet_url' => $model->datasheet_url,
            // Precios siempre como string de dígitos crudos. El frontend
            // aplica formatCLP() para mostrarlos. Esto evita formato doble y
            // mantiene una sola fuente de verdad para la presentación CLP.
            'price' => $firstVersion?->msrp_clp ? (string) $firstVersion->msrp_clp : 'Consultar',
            'gallery' => [],
            'highlights' => $this->buildHighlights($firstVersion),
            'versions' => $model->versions->map(fn ($v) => $this->presentVersion($v))->values()->all(),
            'is_visible' => $model->is_active,
            'detail_content' => $this->resolveDetailContent($model, $firstVersion),
        ];
    }

    /**
     * Fusiona el detail_content guardado en BD con valores por defecto derivados
     * del catálogo. Los top_specs del hero se calculan automáticamente desde la
     * primera versión (HP, transmisión, combustible) salvo override explícito.
     */
    private function resolveDetailContent(VehicleModel $model, ?VehicleVersion $v): array
    {
        $stored = $model->detail_content ?? [];

        $autoTopSpecs = [];
        if ($v) {
            $hp = $v->engine?->hp ?? $v->electric?->combined_hp;
            if ($hp) {
                $autoTopSpecs[] = ['label' => 'Potencia hasta', 'value' => $hp.' hp'];
            }
            $transmission = $v->transmission_type
                ? (in_array($v->transmission_type, ['MT', 'AT']) ? ($v->transmission_type === 'MT' ? 'Manual' : 'Automática') : $v->transmission_type)
                : null;
            if ($transmission) {
                $autoTopSpecs[] = ['label' => 'Transmisión', 'value' => $transmission];
            }
            $fuel = self::POWERTRAIN_LABELS[$v->powertrain_type] ?? null;
            if ($fuel) {
                $autoTopSpecs[] = ['label' => 'Combustible', 'value' => $fuel];
            }
        }

        return [
            'hero' => [
                'tagline' => $stored['hero']['tagline'] ?? 'Desde',
                'description' => $stored['hero']['description'] ?? $model->description ?? '',
                'top_specs' => $autoTopSpecs,
            ],
            'highlights' => $stored['highlights'] ?? [],
            'viewer_360' => [
                'colors' => $stored['viewer_360']['colors'] ?? [],
                'text_blocks' => $stored['viewer_360']['text_blocks'] ?? self::DEFAULT_360_TEXT_BLOCKS,
            ],
        ];
    }

    private const DEFAULT_360_TEXT_BLOCKS = [
        ['key' => 'seguridad', 'title' => 'Seguridad', 'text' => ''],
        ['key' => 'conectividad', 'title' => 'Conectividad', 'text' => ''],
        ['key' => 'performance', 'title' => 'Performance', 'text' => ''],
        ['key' => 'autonomia', 'title' => 'Autonomía', 'text' => ''],
    ];

    public function presentVersion(VehicleVersion $v): array
    {
        $pricing = $this->buildPricing($v);

        return [
            'id'       => $v->id,
            'name'     => $v->trim_name,
            'price'    => $pricing['precio_lista'] ?? 'Consultar',
            'electric' => $v->powertrain_type === 'bev',
            'bonos'    => [
                'bono_marca'                      => $v->bono_marca,
                'bono_financiamiento_r9'          => $v->bono_financiamiento_r9,
                'bono_financiamiento_tradicional' => $v->bono_financiamiento_tradicional,
            ],
            'pricing'      => $pricing['rows'],
            'motor'        => $this->motorRows($v),
            'interior'     => $this->interiorRows($v),
            'exterior'     => $this->exteriorRows($v),
            'seguridad'    => $this->safetyRows($v),
            'rendimiento'  => $this->performanceRows($v),
        ];
    }

    /**
     * Genera los 4 precios según la lógica de negocio:
     *   Precio Lista CLP
     *   Precio Bono Marca = lista - bono_marca
     *   Precio Bono R9    = lista - bono_marca - bono_r9
     *   Precio Bono Financiamiento Tradicional = lista - bono_marca - bono_trad
     */
    private function buildPricing(VehicleVersion $v): array
    {
        // Devolvemos siempre dígitos crudos (como string). El frontend aplica
        // formatCLP() para presentar como "$18.990.000". Esto evita formatear
        // dos veces y deja una sola fuente de verdad de la presentación CLP.
        $raw = fn (?int $val) => $val !== null ? (string) $val : null;

        $lista  = $v->msrp_clp;
        $bMarca = $v->bono_marca;
        $bR9    = $v->bono_financiamiento_r9;
        $bTrad  = $v->bono_financiamiento_tradicional;

        $precioLista  = $lista ? $raw($lista) : null;
        $precioBono   = ($lista && $bMarca)            ? $raw($lista - $bMarca)         : null;
        $precioR9     = ($lista && $bMarca && $bR9)    ? $raw($lista - $bMarca - $bR9)  : null;
        $precioTrad   = ($lista && $bMarca && $bTrad)  ? $raw($lista - $bMarca - $bTrad): null;

        $rows = array_values(array_filter([
            $precioLista ? ['label' => 'Precio de lista',                        'value' => $precioLista, 'highlight' => false] : null,
            $precioBono  ? ['label' => 'Precio Bono Marca',                      'value' => $precioBono,  'highlight' => true,  'bono' => $raw($bMarca)] : null,
            $precioR9    ? ['label' => 'Precio Bono Financiamiento R9',          'value' => $precioR9,    'highlight' => true,  'bono' => $raw($bMarca + $bR9)] : null,
            $precioTrad  ? ['label' => 'Precio Bono Financiamiento Tradicional', 'value' => $precioTrad,  'highlight' => true,  'bono' => $raw($bMarca + $bTrad)] : null,
        ]));

        return [
            'precio_lista' => $precioLista ?? 'Consultar',
            'rows'         => $rows,
        ];
    }

    private function buildHighlights(?VehicleVersion $v): array
    {
        if (! $v) {
            return [];
        }

        $highlights = [];
        if ($v->engine?->hp) {
            $highlights[] = ['title' => 'Potencia', 'value' => $v->engine->hp.' HP'];
        }
        if ($v->performance?->combined_kml) {
            $highlights[] = ['title' => 'Rendimiento', 'value' => $v->performance->combined_kml.' km/l'];
        }
        if ($v->capacities?->seats) {
            $highlights[] = ['title' => 'Asientos', 'value' => (string) $v->capacities->seats];
        }
        if ($v->electric?->range_wltc_km) {
            $highlights[] = ['title' => 'Autonomía', 'value' => $v->electric->range_wltc_km.' km'];
        }

        return $highlights;
    }

    private function motorRows(VehicleVersion $v): array
    {
        $rows = [];
        $push = function (string $label, $value) use (&$rows) {
            if ($value !== null && $value !== '') {
                $rows[] = ['label' => $label, 'value' => (string) $value];
            }
        };

        $transmission = $v->transmission_type;
        if ($transmission && $v->transmission_speeds) {
            $transmission .= ' '.$v->transmission_speeds.' vel.';
        }
        $push('Transmisión', $transmission);
        $push('Combustible', self::POWERTRAIN_LABELS[$v->powertrain_type] ?? null);
        $push('Cilindrada', $v->engine?->displacement_cc ? $v->engine->displacement_cc.' cc' : null);
        $push('Potencia', $v->engine?->hp ? $v->engine->hp.' HP'.($v->engine->hp_rpm ? ' @ '.$v->engine->hp_rpm.' rpm' : '') : ($v->electric?->combined_hp ? $v->electric->combined_hp.' HP' : null));
        $push('Torque', $v->engine?->torque_nm ? $v->engine->torque_nm.' Nm' : ($v->electric?->combined_torque_nm ? $v->electric->combined_torque_nm.' Nm' : null));
        $push('Tracción', strtoupper($v->drivetrain));
        $push('Autonomía WLTC', $v->electric?->range_wltc_km ? $v->electric->range_wltc_km.' km' : null);
        $push('Capacidad batería', $v->electric?->battery_kwh ? $v->electric->battery_kwh.' kWh' : null);

        return $rows;
    }

    private function interiorRows(VehicleVersion $v): array
    {
        $rows = [];
        $push = function (string $l, $val) use (&$rows) {
            if ($val !== null && $val !== '') {
                $rows[] = ['label' => $l, 'value' => (string) $val];
            }
        };

        $push('Capacidad de pasajeros', $v->capacities?->seats);
        $push('Maletero', $v->capacities?->trunk_l ? $v->capacities->trunk_l.' L' : null);
        $push('Estanque combustible', $v->capacities?->fuel_tank_l ? $v->capacities->fuel_tank_l.' L' : null);

        foreach ($v->features->whereIn('category', ['interior', 'comfort', 'infotainment']) as $f) {
            $rows[] = ['label' => $f->name_es, 'value' => '✓'];
        }

        return $rows;
    }

    private function exteriorRows(VehicleVersion $v): array
    {
        $rows = [];
        $push = function (string $l, $val) use (&$rows) {
            if ($val !== null && $val !== '') {
                $rows[] = ['label' => $l, 'value' => (string) $val];
            }
        };

        $push('Largo', $v->dimensions?->length_mm ? $v->dimensions->length_mm.' mm' : null);
        $push('Ancho', $v->dimensions?->width_mm ? $v->dimensions->width_mm.' mm' : null);
        $push('Alto', $v->dimensions?->height_mm ? $v->dimensions->height_mm.' mm' : null);
        $push('Distancia entre ejes', $v->dimensions?->wheelbase_mm ? $v->dimensions->wheelbase_mm.' mm' : null);
        $push('Despeje', $v->dimensions?->ground_clearance_mm ? $v->dimensions->ground_clearance_mm.' mm' : null);
        $push('Neumáticos', $v->chassis?->front_tire);
        $push('Llantas', $v->chassis?->wheel_size_in ? $v->chassis->wheel_size_in.'"' : null);

        foreach ($v->features->where('category', 'exterior') as $f) {
            $rows[] = ['label' => $f->name_es, 'value' => '✓'];
        }

        return $rows;
    }

    private function safetyRows(VehicleVersion $v): array
    {
        $rows = [];
        foreach ($v->features->whereIn('category', ['safety', 'tss']) as $f) {
            $rows[] = ['label' => $f->name_es, 'value' => '✓'];
        }

        return $rows;
    }

    private function performanceRows(VehicleVersion $v): array
    {
        $rows = [];
        $push = function (string $l, $val) use (&$rows) {
            if ($val !== null && $val !== '') {
                $rows[] = ['label' => $l, 'value' => (string) $val];
            }
        };

        $push('Consumo ciudad', $v->performance?->city_kml ? $v->performance->city_kml.' km/l' : null);
        $push('Consumo carretera', $v->performance?->highway_kml ? $v->performance->highway_kml.' km/l' : null);
        $push('Consumo mixto', $v->performance?->combined_kml ? $v->performance->combined_kml.' km/l' : null);
        $push('Emisiones CO₂', $v->performance?->co2_gkm ? $v->performance->co2_gkm.' g/km' : null);
        $push('Aceleración 0-100 km/h', $v->performance?->acceleration_0_100_s ? $v->performance->acceleration_0_100_s.' s' : null);
        $push('Velocidad máxima', $v->performance?->top_speed_kmh ? $v->performance->top_speed_kmh.' km/h' : null);
        $push('Etiqueta eficiencia energética', $v->performance?->energy_efficiency_label);

        return $rows;
    }
}
