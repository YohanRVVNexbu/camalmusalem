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
        $desde = $this->computeDesde($model);

        return [
            'id' => $model->id,
            'name' => $model->name,
            'slug' => $model->slug,
            'full_name' => trim("{$model->brand->name} {$model->name}"),
            'subtitle' => $model->segment ?? $model->generation ?? null,
            'description' => $model->description ?: (data_get($model->detail_content, 'hero.description') ?: null),
            'type' => self::BODY_TYPE_LABELS[$model->body_type] ?? null,
            'fuel' => $firstPowertrain ? (self::POWERTRAIN_LABELS[$firstPowertrain] ?? null) : null,
            'hero_image' => $model->hero_image,
            // Imagen exclusiva del hero del detalle. El frontend hace
            // fallback a hero_image si esta es null.
            'detail_hero_image' => $model->detail_hero_image,
            'datasheet_url' => $model->datasheet_file ?: $model->datasheet_url,
            // Precios siempre como string de dígitos crudos. El frontend
            // aplica formatCLP() para mostrarlos. Esto evita formato doble y
            // mantiene una sola fuente de verdad para la presentación CLP.
            'price' => $firstVersion?->msrp_clp ? (string) $firstVersion->msrp_clp : 'Consultar',
            // "Desde": precio MENOR entre versiones con el bono total aplicado,
            // y el bono de esa versión. Usado en los cards destacados de /nuevos.
            'desde_price' => $desde['price'],
            'desde_bono'  => $desde['bono'],
            'gallery' => [],
            'highlights' => $this->buildHighlights($firstVersion),
            'versions' => $model->versions->map(fn ($v) => $this->presentVersion($v))->values()->all(),
            'is_visible' => $model->is_active,
            'detail_content' => $this->resolveDetailContent($model, $firstVersion),
            // Shorts específicos de este vehículo (lista de {url, thumbnail}).
            'shorts' => is_array($model->shorts) ? array_values($model->shorts) : [],
        ];
    }

    /**
     * Calcula el precio "Desde" del modelo: el MENOR precio real entre todas
     * sus versiones, y el bono total de esa versión.
     *
     * Los bonos STACKEAN según la lista de precios oficial de Toyota
     * (confirmado por el cliente con la tabla de junio 2026): la columna
     * "Precio BONO Base+Crédito R9" = Precio − Bono Base TCL − Bono Crédito
     * − Bono Crédito R9. Ej. Raize i MT: 13.990.000 − 1.500.000 − 500.000
     * − 1.000.000 = 10.990.000 (bono total $3.000.000). Por eso el desde
     * por versión es lista − (marca + tradicional + r9), igual que el
     * "Precio Bono Financiamiento R9" de buildPricing().
     *
     * Devuelve dígitos crudos como string (el frontend aplica formatCLP).
     * Si ninguna versión tiene msrp, price = null (el card muestra "Consultar").
     */
    private function computeDesde(VehicleModel $model): array
    {
        $bestPrice = null;
        $bestBono = 0;

        foreach ($model->versions as $v) {
            if (! $v->msrp_clp) {
                continue;
            }
            $bono = (int) $v->bono_marca
                + (int) $v->bono_financiamiento_tradicional
                + (int) $v->bono_financiamiento_r9;
            $price = (int) $v->msrp_clp - $bono;

            if ($bestPrice === null || $price < $bestPrice) {
                $bestPrice = $price;
                $bestBono = $bono;
            }
        }

        return [
            'price' => $bestPrice !== null ? (string) $bestPrice : null,
            // Solo exponemos el bono si es > 0 (para no mostrar "Incluye bono $0").
            'bono'  => $bestBono > 0 ? (string) $bestBono : null,
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
                'heading' => $stored['viewer_360']['heading'] ?? '',
                'colors' => $stored['viewer_360']['colors'] ?? [],
                'text_blocks' => $stored['viewer_360']['text_blocks'] ?? self::DEFAULT_360_TEXT_BLOCKS,
            ],
            'multimedia' => [
                'video' => $stored['multimedia']['video'] ?? null,
                'images' => array_values(array_filter($stored['multimedia']['images'] ?? [])),
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
            // Colores del visor 360 de ESTA versión, cada uno con su set de
            // fotos. El frontend del detalle arma el 360 con version+color.
            'colors_360'   => $v->colors->map(fn ($c) => [
                'name'   => $c->name,
                'hex'    => $c->hex,
                'photos' => is_array($c->photos_360) ? array_values($c->photos_360) : [],
            ])->values()->all(),
            // Multimedia de ESTA versión: lista mixta [{type, url}] con
            // type image|video|youtube. El frontend la renderiza por tipo.
            'multimedia'   => is_array($v->multimedia) ? array_values($v->multimedia) : [],
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
        // Casteamos a int: los bonos pueden venir null y los usamos en restas.
        $bMarca = (int) $v->bono_marca;
        $bR9    = (int) $v->bono_financiamiento_r9;
        $bTrad  = (int) $v->bono_financiamiento_tradicional;

        // Cada precio con bono se muestra si SU propio bono existe, sin
        // depender de bono_marca. Los bonos STACKEAN según la lista de
        // precios oficial de Toyota (tabla del cliente, jun 2026):
        //   Precio BONO Base+Crédito    = lista − Base TCL − Bono Crédito
        //   Precio BONO Base+Crédito R9 = lista − Base TCL − Bono Crédito − Bono Crédito R9
        // Es decir, el R9 acumula TAMBIÉN el bono crédito tradicional (antes
        // se calculaba lista − marca − r9 y el R9 quedaba $500K más caro que
        // la lista oficial: Raize i MT 11.490.000 vs 10.990.000 reales).
        $precioLista  = $lista ? $raw($lista) : null;
        $precioBono   = ($lista && $bMarca > 0) ? $raw($lista - $bMarca)                  : null;
        $precioR9     = ($lista && $bR9 > 0)    ? $raw($lista - $bMarca - $bTrad - $bR9)  : null;
        $precioTrad   = ($lista && $bTrad > 0)  ? $raw($lista - $bMarca - $bTrad)         : null;

        $rows = array_values(array_filter([
            $precioLista ? ['label' => 'Precio de lista',                        'value' => $precioLista, 'highlight' => false] : null,
            $precioBono  ? ['label' => 'Precio Bono Marca',                      'value' => $precioBono,  'highlight' => true,  'bono' => $raw($bMarca)] : null,
            $precioR9    ? ['label' => 'Precio Bono Financiamiento R9',          'value' => $precioR9,    'highlight' => true,  'bono' => $raw($bMarca + $bTrad + $bR9)] : null,
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
