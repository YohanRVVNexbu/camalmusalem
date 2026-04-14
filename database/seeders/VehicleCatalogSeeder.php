<?php

namespace Database\Seeders;

use App\Models\Brand;
use App\Models\Feature;
use App\Models\VehicleModel;
use App\Models\VehicleVersion;
use App\Models\VersionCapacities;
use App\Models\VersionChassis;
use App\Models\VersionColor;
use App\Models\VersionDimensions;
use App\Models\VersionElectric;
use App\Models\VersionEngine;
use App\Models\VersionPerformance;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class VehicleCatalogSeeder extends Seeder
{
    public function run(): void
    {
        $jsonPath = database_path('seeders/data/toyota_specs.json');

        if (! file_exists($jsonPath)) {
            $this->command->warn("No se encontró {$jsonPath}. Saltando siembra de catálogo.");

            return;
        }

        $data = json_decode(file_get_contents($jsonPath), true);

        if (! is_array($data) || ! isset($data['models'])) {
            $this->command->error('JSON inválido.');

            return;
        }

        foreach ($data['models'] as $modelData) {
            $brand = Brand::updateOrCreate(
                ['slug' => Str::slug($modelData['brand'])],
                ['name' => $modelData['brand'], 'is_active' => true]
            );

            $model = VehicleModel::updateOrCreate(
                ['brand_id' => $brand->id, 'slug' => $modelData['model_slug']],
                [
                    'name' => $modelData['model_name'],
                    'body_type' => $modelData['body_type'] ?? null,
                    'segment' => $modelData['segment'] ?? null,
                    'description' => $modelData['description'] ?? null,
                    'is_active' => true,
                ]
            );

            foreach ($modelData['versions'] ?? [] as $versionData) {
                $this->seedVersion($model, $versionData);
            }
        }

        $this->command->info('Catálogo sembrado desde toyota_specs.json');
    }

    private function seedVersion(VehicleModel $model, array $v): void
    {
        $slug = $v['slug'] ?? Str::slug($v['trim_name']);

        $validTrans = ['MT', 'AT', 'CVT', 'eCVT', 'DCT', 'AMT'];
        $trans = $v['transmission_type'] ?? null;
        if ($trans && ! in_array($trans, $validTrans, true)) {
            $trans = null;
        }

        $version = VehicleVersion::updateOrCreate(
            [
                'vehicle_model_id' => $model->id,
                'slug' => $slug,
                'model_year' => $v['model_year'],
            ],
            [
                'trim_name' => $v['trim_name'],
                'powertrain_type' => $v['powertrain_type'],
                'drivetrain' => $v['drivetrain'],
                'transmission_type' => $trans,
                'transmission_speeds' => $v['transmission_speeds'] ?? null,
                'msrp_clp' => $v['msrp_clp'] ?? null,
                'is_active' => true,
            ]
        );

        $sections = [
            'engine' => VersionEngine::class,
            'electric' => VersionElectric::class,
            'dimensions' => VersionDimensions::class,
            'capacities' => VersionCapacities::class,
            'performance' => VersionPerformance::class,
            'chassis' => VersionChassis::class,
        ];

        $aliasMap = [
            'electric' => [
                'charge_ac_kw' => 'ac_charge_kw',
                'charge_dc_kw' => 'dc_charge_kw',
            ],
        ];

        foreach ($sections as $key => $modelClass) {
            if (! empty($v[$key]) && is_array($v[$key])) {
                $payload = $v[$key];
                foreach ($aliasMap[$key] ?? [] as $from => $to) {
                    if (array_key_exists($from, $payload)) {
                        $payload[$to] = $payload[$from];
                        unset($payload[$from]);
                    }
                }
                $modelClass::updateOrCreate(
                    ['vehicle_version_id' => $version->id],
                    $payload
                );
            }
        }

        foreach ($v['features'] ?? [] as $code) {
            $feature = Feature::where('code', $code)->first();
            if ($feature) {
                $version->features()->syncWithoutDetaching([
                    $feature->id => ['value_bool' => true],
                ]);
            }
        }

        $typeMap = ['mica' => 'pearl', 'perla' => 'pearl', 'metalizado' => 'metallic', 'solido' => 'solid', 'mate' => 'matte'];
        $validTypes = ['solid', 'metallic', 'pearl', 'matte'];

        $version->colors()->delete();
        foreach ($v['colors'] ?? [] as $i => $c) {
            $type = strtolower($c['type'] ?? 'solid');
            $type = $typeMap[$type] ?? $type;
            if (! in_array($type, $validTypes, true)) {
                $type = 'solid';
            }
            VersionColor::create([
                'vehicle_version_id' => $version->id,
                'name' => $c['name'],
                'hex' => $c['hex'] ?? null,
                'type' => $type,
                'display_order' => $i,
            ]);
        }
    }
}
