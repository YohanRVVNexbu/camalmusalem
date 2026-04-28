<?php

namespace App\Services\CatalogImport;

use App\Models\Brand;
use App\Models\Feature;
use App\Models\FeatureCategory;
use App\Models\VehicleModel;
use App\Models\VehicleVersion;
use App\Models\VersionCapacities;
use App\Models\VersionChassis;
use App\Models\VersionColor;
use App\Models\VersionDimensions;
use App\Models\VersionElectric;
use App\Models\VersionEngine;
use App\Models\VersionPerformance;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use PhpOffice\PhpSpreadsheet\IOFactory;
use Symfony\Component\HttpFoundation\File\UploadedFile;

class VehicleVersionsImporter
{
    // Mapa de código lookup → categoría feature para las columnas de equipamiento
    private const FEATURE_COLS = [
        73 => ['category' => 'safety',        'col_label' => 'Seguridad'],
        74 => ['category' => 'tss',            'col_label' => 'Toyota Safety Sense'],
        75 => ['category' => 'comfort',        'col_label' => 'Confort'],
        76 => ['category' => 'infotainment',   'col_label' => 'Infoentretenimiento'],
        77 => ['category' => 'interior',       'col_label' => 'Interior'],
        78 => ['category' => 'exterior',       'col_label' => 'Exterior'],
        79 => ['category' => 'offroad',        'col_label' => 'Off-road'],
    ];

    public function import(UploadedFile $file): ImportResult
    {
        $result = new ImportResult;
        $spreadsheet = IOFactory::load($file->getPathname());
        $sheet = $spreadsheet->getActiveSheet();
        $rows = $sheet->toArray(null, true, true, false);

        // Asegurar que existen las categorías de feature en la tabla lookups
        $this->ensureFeatureCategories();

        foreach (array_slice($rows, 1) as $i => $row) {
            $rowNum = $i + 2;

            $brandName = trim((string) ($row[1] ?? ''));
            $modelName = trim((string) ($row[2] ?? ''));
            $trimName  = trim((string) ($row[6] ?? ''));

            if ($brandName === '' || $modelName === '' || $trimName === '') {
                continue;
            }

            try {
                DB::transaction(function () use ($row, $rowNum, $result, $brandName, $modelName, $trimName) {
                    $brand = Brand::firstOrCreate(
                        ['name' => $brandName],
                        ['slug' => Str::slug($brandName), 'is_active' => true]
                    );

                    $vehicleModel = VehicleModel::firstOrCreate(
                        ['brand_id' => $brand->id, 'name' => $modelName],
                        [
                            'slug'      => Str::slug("{$brandName}-{$modelName}"),
                            'body_type' => $this->str($row[3]),
                            'segment'   => $this->str($row[4]),
                            'is_active' => true,
                        ]
                    );

                    $year = (int) ($row[7] ?? 0);
                    $existingVersion = VehicleVersion::where('vehicle_model_id', $vehicleModel->id)
                        ->where('trim_name', $trimName)
                        ->where('model_year', $year)
                        ->first();

                    $versionData = [
                        'vehicle_model_id'   => $vehicleModel->id,
                        'trim_name'          => $trimName,
                        'slug'               => Str::slug("{$trimName}-{$year}"),
                        'model_year'         => $year,
                        'powertrain_type'    => $this->lookupCode($row[12] ?? null) ?? 'gasoline',
                        'drivetrain'         => $this->lookupCode($row[13] ?? null) ?? 'fwd',
                        'transmission_type'  => $this->lookupCode($row[14] ?? null),
                        'transmission_speeds'=> $this->int($row[15] ?? null),
                        'msrp_clp'           => $this->int($row[10] ?? null),
                        'sales_code'         => $this->str($row[8]),
                        'is_active'          => $this->parseBool($row[9] ?? 'Sí'),
                        'display_order'      => 0,
                    ];

                    if ($existingVersion) {
                        $existingVersion->update($versionData);
                        $version = $existingVersion;
                        $result->updated++;
                    } else {
                        $version = VehicleVersion::create($versionData);
                        $result->created++;
                    }

                    $this->syncEngine($version, $row);
                    $this->syncElectric($version, $row);
                    $this->syncDimensions($version, $row);
                    $this->syncCapacities($version, $row);
                    $this->syncPerformance($version, $row);
                    $this->syncChassis($version, $row);
                    $this->syncFeatures($version, $row);
                    $this->syncColors($version, $row);
                });
            } catch (\Throwable $e) {
                $result->addError($rowNum, $e->getMessage());
            }
        }

        return $result;
    }

    private function syncEngine(VehicleVersion $v, array $row): void
    {
        $data = array_filter([
            'vehicle_version_id' => $v->id,
            'engine_code'        => $this->str($row[16] ?? null),
            'cylinders'          => $this->int($row[17] ?? null),
            'layout'             => $this->str($row[18] ?? null),
            'displacement_cc'    => $this->int($row[19] ?? null),
            'compression_ratio'  => $this->str($row[20] ?? null),
            'fuel_system'        => $this->str($row[21] ?? null),
            'hp'                 => $this->int($row[22] ?? null),
            'hp_rpm'             => $this->int($row[23] ?? null),
            'torque_nm'          => $this->int($row[24] ?? null),
            'torque_rpm_min'     => $this->int($row[25] ?? null),
            'torque_rpm_max'     => $this->int($row[26] ?? null),
            'fuel_type'          => $this->str($row[27] ?? null),
            'emissions_standard' => $this->str($row[28] ?? null),
        ], fn ($v) => $v !== null);

        unset($data['vehicle_version_id']);
        if (empty($data)) {
            VersionEngine::where('vehicle_version_id', $v->id)->delete();

            return;
        }
        $data['vehicle_version_id'] = $v->id;
        VersionEngine::updateOrCreate(['vehicle_version_id' => $v->id], $data);
    }

    private function syncElectric(VehicleVersion $v, array $row): void
    {
        $data = array_filter([
            'motor_type'    => $this->str($row[29] ?? null),
            'motor_front_kw'=> $this->float($row[30] ?? null),
            'motor_rear_kw' => $this->float($row[31] ?? null),
            'combined_kw'   => $this->float($row[32] ?? null),
            'combined_hp'   => $this->int($row[33] ?? null),
            'battery_type'  => $this->str($row[34] ?? null),
            'battery_kwh'   => $this->float($row[35] ?? null),
            'range_wltc_km' => $this->int($row[36] ?? null),
            'ac_charge_kw'  => $this->float($row[37] ?? null),
            'dc_charge_kw'  => $this->float($row[38] ?? null),
            'charge_connector' => $this->str($row[39] ?? null),
        ], fn ($v) => $v !== null);

        if (empty($data)) {
            VersionElectric::where('vehicle_version_id', $v->id)->delete();

            return;
        }
        $data['vehicle_version_id'] = $v->id;
        VersionElectric::updateOrCreate(['vehicle_version_id' => $v->id], $data);
    }

    private function syncDimensions(VehicleVersion $v, array $row): void
    {
        $data = array_filter([
            'length_mm'            => $this->int($row[40] ?? null),
            'width_mm'             => $this->int($row[41] ?? null),
            'height_mm'            => $this->int($row[42] ?? null),
            'wheelbase_mm'         => $this->int($row[43] ?? null),
            'ground_clearance_mm'  => $this->int($row[44] ?? null),
            'approach_angle'       => $this->str($row[45] ?? null),
            'departure_angle'      => $this->str($row[46] ?? null),
            'wading_mm'            => $this->int($row[47] ?? null),
            'turning_radius_mm'    => $this->int($row[48] ?? null),
        ], fn ($v) => $v !== null);

        if (empty($data)) {
            VersionDimensions::where('vehicle_version_id', $v->id)->delete();

            return;
        }
        $data['vehicle_version_id'] = $v->id;
        VersionDimensions::updateOrCreate(['vehicle_version_id' => $v->id], $data);
    }

    private function syncCapacities(VehicleVersion $v, array $row): void
    {
        $data = array_filter([
            'curb_weight_kg'    => $this->int($row[49] ?? null),
            'gvwr_kg'           => $this->int($row[50] ?? null),
            'seats'             => $this->int($row[51] ?? null),
            'trunk_l'           => $this->int($row[52] ?? null),
            'fuel_tank_l'       => $this->int($row[53] ?? null),
            'towing_braked_kg'  => $this->int($row[54] ?? null),
            'payload_kg'        => $this->int($row[55] ?? null),
        ], fn ($v) => $v !== null);

        if (empty($data)) {
            VersionCapacities::where('vehicle_version_id', $v->id)->delete();

            return;
        }
        $data['vehicle_version_id'] = $v->id;
        VersionCapacities::updateOrCreate(['vehicle_version_id' => $v->id], $data);
    }

    private function syncPerformance(VehicleVersion $v, array $row): void
    {
        $data = array_filter([
            'city_kml'                  => $this->float($row[56] ?? null),
            'highway_kml'               => $this->float($row[57] ?? null),
            'combined_kml'              => $this->float($row[58] ?? null),
            'co2_gkm'                   => $this->int($row[59] ?? null),
            'acceleration_0_100_s'      => $this->float($row[60] ?? null),
            'top_speed_kmh'             => $this->int($row[61] ?? null),
            'energy_efficiency_label'   => $this->str($row[62] ?? null),
        ], fn ($v) => $v !== null);

        if (empty($data)) {
            VersionPerformance::where('vehicle_version_id', $v->id)->delete();

            return;
        }
        $data['vehicle_version_id'] = $v->id;
        VersionPerformance::updateOrCreate(['vehicle_version_id' => $v->id], $data);
    }

    private function syncChassis(VehicleVersion $v, array $row): void
    {
        $data = array_filter([
            'steering_type'      => $this->str($row[63] ?? null),
            'front_suspension'   => $this->str($row[64] ?? null),
            'rear_suspension'    => $this->str($row[65] ?? null),
            'front_brakes'       => $this->str($row[66] ?? null),
            'rear_brakes'        => $this->str($row[67] ?? null),
            'front_tire'         => $this->str($row[68] ?? null),
            'wheel_size_in'      => $this->int($row[69] ?? null),
            'wheel_material'     => $this->str($row[70] ?? null),
        ], fn ($v) => $v !== null);

        if (empty($data)) {
            VersionChassis::where('vehicle_version_id', $v->id)->delete();

            return;
        }
        $data['vehicle_version_id'] = $v->id;
        VersionChassis::updateOrCreate(['vehicle_version_id' => $v->id], $data);
    }

    private function syncFeatures(VehicleVersion $v, array $row): void
    {
        // Índices en el array: col BT = índice 71, BU=72, BV=73, BW=74, BX=75, BY=76, BZ=77, CA=78
        // Pero el array es 0-based: A=0, B=1 ... BT=71, BU=72 ...
        // Excel col 72 = BT (Seguridad), etc. — ajustado al array 0-based
        $colMap = [
            71 => 'safety',
            72 => 'tss',
            73 => 'comfort',
            74 => 'infotainment',
            75 => 'interior',
            76 => 'exterior',
            77 => 'offroad',
        ];

        $featureIds = [];

        foreach ($colMap as $colIdx => $category) {
            $cellValue = $this->str($row[$colIdx] ?? null);
            if (! $cellValue) {
                continue;
            }

            $items = array_filter(array_map('trim', explode(',', $cellValue)));
            foreach ($items as $itemName) {
                $code    = Str::slug($itemName, '_');
                $feature = Feature::firstOrCreate(
                    ['code' => $code],
                    ['name_es' => $itemName, 'category' => $category, 'data_type' => 'boolean', 'is_active' => true]
                );
                $featureIds[$feature->id] = ['value_bool' => true];
            }
        }

        $v->features()->sync($featureIds);
    }

    private function syncColors(VehicleVersion $v, array $row): void
    {
        $cellValue = $this->str($row[78] ?? null);
        if (! $cellValue) {
            return;
        }

        $names = array_filter(array_map('trim', explode(',', $cellValue)));
        VersionColor::where('vehicle_version_id', $v->id)->delete();

        foreach ($names as $i => $name) {
            VersionColor::create([
                'vehicle_version_id' => $v->id,
                'name'               => $name,
                'type'               => 'solid',
                'is_available'       => true,
                'display_order'      => $i,
            ]);
        }
    }

    private function ensureFeatureCategories(): void
    {
        $categories = [
            ['code' => 'safety',       'name_es' => 'Seguridad',           'display_order' => 1],
            ['code' => 'tss',          'name_es' => 'Toyota Safety Sense', 'display_order' => 2],
            ['code' => 'comfort',      'name_es' => 'Confort',             'display_order' => 3],
            ['code' => 'infotainment', 'name_es' => 'Infoentretenimiento', 'display_order' => 4],
            ['code' => 'interior',     'name_es' => 'Interior',            'display_order' => 5],
            ['code' => 'exterior',     'name_es' => 'Exterior',            'display_order' => 6],
            ['code' => 'offroad',      'name_es' => 'Off-road',            'display_order' => 7],
        ];

        foreach ($categories as $cat) {
            FeatureCategory::firstOrCreate(['code' => $cat['code']], [
                'name_es'       => $cat['name_es'],
                'display_order' => $cat['display_order'],
                'is_active'     => true,
            ]);
        }
    }

    private function lookupCode(mixed $val): ?string
    {
        return $this->str($val) ? Str::slug((string) $val, '_') : null;
    }

    private function str(mixed $val): ?string
    {
        $s = trim((string) ($val ?? ''));

        return $s !== '' ? $s : null;
    }

    private function int(mixed $val): ?int
    {
        if ($val === null || $val === '') {
            return null;
        }

        return is_numeric($val) ? (int) $val : null;
    }

    private function float(mixed $val): ?float
    {
        if ($val === null || $val === '') {
            return null;
        }

        return is_numeric($val) ? (float) $val : null;
    }

    private function parseBool(mixed $val): bool
    {
        $v = mb_strtolower(trim((string) ($val ?? '')));

        return in_array($v, ['1', 'si', 'sí', 'yes', 'true', 'x', 'ok']);
    }
}
