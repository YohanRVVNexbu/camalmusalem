<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\CatalogExport\ListaPreciosExporter;
use App\Services\CatalogExport\VehicleVersionsExporter;
use App\Services\CatalogImport\ListaPreciosImporter;
use App\Services\CatalogImport\VehicleVersionsImporter;
use App\Models\ColorType;
use App\Models\Drivetrain;
use App\Models\Feature;
use App\Models\FeatureCategory;
use App\Models\FuelType;
use App\Models\PowertrainType;
use App\Models\TransmissionType;
use App\Models\VehicleModel;
use App\Models\VehicleVersion;
use App\Models\VersionCapacities;
use App\Models\VersionChassis;
use App\Models\VersionColor;
use App\Models\VersionDimensions;
use App\Models\VersionElectric;
use App\Models\VersionEngine;
use App\Models\VersionPerformance;
use App\Services\SiteSettingsService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;

class VehicleVersionController extends Controller
{
    public function __construct(private SiteSettingsService $settings) {}

    public function index(Request $request)
    {
        $query = VehicleVersion::with('model.brand')->orderBy('model_year', 'desc');

        if ($request->filled('model_id')) {
            $query->where('vehicle_model_id', $request->integer('model_id'));
        }

        return Inertia::render('admin/vehicle-versions/index', [
            'versions' => $query->get(),
            'models' => VehicleModel::with('brand')->where('is_active', true)->orderBy('name')->get(['id', 'name', 'brand_id']),
            'filters' => $request->only(['model_id']),
        ]);
    }

    public function create(Request $request)
    {
        $props = $this->formProps(null);
        if ($request->filled('model_id')) {
            $props['prefill_model_id'] = $request->integer('model_id');
        }

        return Inertia::render('admin/vehicle-versions/form', $props);
    }

    public function store(Request $request)
    {
        $data = $this->validated($request);
        $data['slug'] = Str::slug($data['trim_name']);

        $version = DB::transaction(function () use ($request, $data) {
            $version = VehicleVersion::create([
                'vehicle_model_id' => $data['vehicle_model_id'],
                'trim_name' => $data['trim_name'],
                'slug' => $data['slug'],
                'model_year' => $data['model_year'],
                'powertrain_type' => $data['powertrain_type'],
                'drivetrain' => $data['drivetrain'],
                'transmission_type' => $data['transmission_type'] ?? null,
                'transmission_speeds' => $data['transmission_speeds'] ?? null,
                'msrp_clp'                       => $data['msrp_clp'] ?? null,
                'bono_marca'                      => $data['bono_marca'] ?? null,
                'bono_financiamiento_r9'          => $data['bono_financiamiento_r9'] ?? null,
                'bono_financiamiento_tradicional' => $data['bono_financiamiento_tradicional'] ?? null,
                'sales_code' => $data['sales_code'] ?? null,
                'description' => $data['description'] ?? null,
                'is_active' => $data['is_active'] ?? true,
                'display_order' => $data['display_order'] ?? 0,
            ]);

            $this->syncSatellites($version, $request);
            $this->syncFeatures($version, $request->input('feature_ids', []));
            $this->syncColors($version, $request->input('colors', []));

            return $version;
        });

        if ($request->hasFile('hero_image')) {
            $version->update([
                'hero_image' => $this->settings->uploadFile($request->file('hero_image'), 'vehicle-versions/'.$version->id),
            ]);
        }

        return redirect('/admin/vehicle-versions')->with('success', 'Versión creada correctamente.');
    }

    public function edit(VehicleVersion $vehicleVersion)
    {
        return Inertia::render('admin/vehicle-versions/form', $this->formProps($vehicleVersion));
    }

    public function update(Request $request, VehicleVersion $vehicleVersion)
    {
        $data = $this->validated($request);
        $data['slug'] = Str::slug($data['trim_name']);

        DB::transaction(function () use ($request, $data, $vehicleVersion) {
            $vehicleVersion->update([
                'vehicle_model_id' => $data['vehicle_model_id'],
                'trim_name' => $data['trim_name'],
                'slug' => $data['slug'],
                'model_year' => $data['model_year'],
                'powertrain_type' => $data['powertrain_type'],
                'drivetrain' => $data['drivetrain'],
                'transmission_type' => $data['transmission_type'] ?? null,
                'transmission_speeds' => $data['transmission_speeds'] ?? null,
                'msrp_clp'                       => $data['msrp_clp'] ?? null,
                'bono_marca'                      => $data['bono_marca'] ?? null,
                'bono_financiamiento_r9'          => $data['bono_financiamiento_r9'] ?? null,
                'bono_financiamiento_tradicional' => $data['bono_financiamiento_tradicional'] ?? null,
                'sales_code' => $data['sales_code'] ?? null,
                'description' => $data['description'] ?? null,
                'is_active' => $data['is_active'] ?? true,
                'display_order' => $data['display_order'] ?? 0,
            ]);

            $this->syncSatellites($vehicleVersion, $request);
            $this->syncFeatures($vehicleVersion, $request->input('feature_ids', []));
            $this->syncColors($vehicleVersion, $request->input('colors', []));
        });

        if ($request->hasFile('hero_image')) {
            $this->settings->deleteOldFile($vehicleVersion->hero_image);
            $vehicleVersion->update([
                'hero_image' => $this->settings->uploadFile($request->file('hero_image'), 'vehicle-versions/'.$vehicleVersion->id),
            ]);
        }

        return back()->with('success', 'Versión actualizada correctamente.');
    }

    public function destroy(VehicleVersion $vehicleVersion)
    {
        $this->settings->deleteOldFile($vehicleVersion->hero_image);
        $vehicleVersion->delete();

        return redirect('/admin/vehicle-versions')->with('success', 'Versión eliminada.');
    }

    public function import(Request $request)
    {
        $request->validate(['file' => ['required', 'file', 'mimes:xlsx,xls']]);
        $result = (new VehicleVersionsImporter)->import($request->file('file'));

        return redirect('/admin/vehicle-versions')->with('success', $result->toFlashMessage());
    }

    public function export()
    {
        return (new VehicleVersionsExporter)->download('vehiculos_nuevos_'.date('Y-m-d').'.xlsx');
    }

    public function template()
    {
        return (new VehicleVersionsExporter(templateOnly: true))->download('plantilla_vehiculos_nuevos.xlsx');
    }

    public function preciosExport()
    {
        return (new ListaPreciosExporter)->download('lista_precios_'.date('Y-m-d').'.xlsx');
    }

    public function preciosImport(Request $request)
    {
        $request->validate(['file' => ['required', 'file', 'mimes:xlsx,xls']]);
        $result = (new ListaPreciosImporter)->import($request->file('file'));

        return redirect('/admin/vehicle-versions')->with('success', $result->toFlashMessage());
    }

    private function formProps(?VehicleVersion $version): array
    {
        $version?->load([
            'engine', 'electric', 'dimensions', 'capacities',
            'performance', 'chassis', 'features', 'colors', 'model.brand',
        ]);

        return [
            'version' => $version ? [
                ...$version->toArray(),
                'feature_ids' => $version->features->pluck('id')->all(),
            ] : null,
            'models' => VehicleModel::with('brand')->where('is_active', true)->orderBy('name')
                ->get(['id', 'name', 'brand_id'])
                ->map(fn ($m) => ['id' => $m->id, 'name' => $m->name, 'brand_name' => $m->brand->name]),
            'features' => Feature::where('is_active', true)
                ->orderBy('category')
                ->orderBy('display_order')
                ->get(['id', 'code', 'name_es', 'category'])
                ->groupBy('category'),
            'enums' => $this->enums(),
            'suggestions' => $this->collectSuggestions(),
        ];
    }

    private function enums(): array
    {
        $map = fn ($class) => $class::where('is_active', true)
            ->orderBy('display_order')
            ->pluck('name_es', 'code')
            ->all();

        return [
            'powertrain' => $map(PowertrainType::class),
            'drivetrain' => $map(Drivetrain::class),
            'transmission' => $map(TransmissionType::class),
            'color_type' => $map(ColorType::class),
            'fuel_type' => $map(FuelType::class),
            'category_labels' => $map(FeatureCategory::class),
        ];
    }

    private function collectSuggestions(): array
    {
        $distinct = fn (string $table, string $column) => DB::table($table)
            ->whereNotNull($column)
            ->where($column, '!=', '')
            ->distinct()
            ->orderBy($column)
            ->pluck($column)
            ->values()
            ->all();

        return [
            'engine' => [
                'engine_code' => $distinct('version_engine', 'engine_code'),
                'layout' => $distinct('version_engine', 'layout'),
                'fuel_system' => $distinct('version_engine', 'fuel_system'),
                'emissions_standard' => $distinct('version_engine', 'emissions_standard'),
                'compression_ratio' => $distinct('version_engine', 'compression_ratio'),
            ],
            'electric' => [
                'motor_type' => $distinct('version_electric', 'motor_type'),
                'battery_type' => $distinct('version_electric', 'battery_type'),
                'charge_connector' => $distinct('version_electric', 'charge_connector'),
            ],
            'chassis' => [
                'steering_type' => $distinct('version_chassis', 'steering_type'),
                'front_suspension' => $distinct('version_chassis', 'front_suspension'),
                'rear_suspension' => $distinct('version_chassis', 'rear_suspension'),
                'front_brakes' => $distinct('version_chassis', 'front_brakes'),
                'rear_brakes' => $distinct('version_chassis', 'rear_brakes'),
                'parking_brake' => $distinct('version_chassis', 'parking_brake'),
                'front_tire' => $distinct('version_chassis', 'front_tire'),
                'rear_tire' => $distinct('version_chassis', 'rear_tire'),
                'wheel_material' => $distinct('version_chassis', 'wheel_material'),
            ],
            'colors' => [
                'name' => $distinct('version_colors', 'name'),
            ],
        ];
    }

    private function syncSatellites(VehicleVersion $version, Request $request): void
    {
        $sections = [
            'engine' => VersionEngine::class,
            'electric' => VersionElectric::class,
            'dimensions' => VersionDimensions::class,
            'capacities' => VersionCapacities::class,
            'performance' => VersionPerformance::class,
            'chassis' => VersionChassis::class,
        ];

        foreach ($sections as $key => $modelClass) {
            $payload = $request->input($key);
            if (! is_array($payload) || empty(array_filter($payload, fn ($v) => $v !== null && $v !== ''))) {
                $modelClass::where('vehicle_version_id', $version->id)->delete();

                continue;
            }
            $modelClass::updateOrCreate(['vehicle_version_id' => $version->id], $payload);
        }
    }

    private function syncFeatures(VehicleVersion $version, array $featureIds): void
    {
        $sync = collect($featureIds)->mapWithKeys(fn ($id) => [(int) $id => ['value_bool' => true]])->all();
        $version->features()->sync($sync);
    }

    private function syncColors(VehicleVersion $version, array $colors): void
    {
        $existingIds = $version->colors()->pluck('id')->all();
        $keepIds = [];

        foreach ($colors as $i => $c) {
            if (empty($c['name'])) {
                continue;
            }
            $row = [
                'vehicle_version_id' => $version->id,
                'name' => $c['name'],
                'hex' => $c['hex'] ?? null,
                'type' => $c['type'] ?? 'solid',
                'is_available' => (bool) ($c['is_available'] ?? true),
                'display_order' => $i,
            ];
            if (! empty($c['id'])) {
                VersionColor::where('id', $c['id'])->update($row);
                $keepIds[] = (int) $c['id'];
            } else {
                $new = VersionColor::create($row);
                $keepIds[] = $new->id;
            }
        }

        $toDelete = array_diff($existingIds, $keepIds);
        if ($toDelete) {
            VersionColor::whereIn('id', $toDelete)->delete();
        }
    }

    private function validated(Request $request): array
    {
        return $request->validate([
            'vehicle_model_id' => ['required', 'exists:vehicle_models,id'],
            'trim_name' => ['required', 'string', 'max:255'],
            'model_year' => ['required', 'integer', 'min:1990', 'max:2100'],
            'powertrain_type' => ['required', 'string', 'exists:powertrain_types,code'],
            'drivetrain' => ['required', 'string', 'exists:drivetrains,code'],
            'transmission_type' => ['nullable', 'string', 'exists:transmission_types,code'],
            'transmission_speeds' => ['nullable', 'integer', 'min:1', 'max:12'],
            'msrp_clp'                       => ['nullable', 'integer', 'min:0'],
            'bono_marca'                      => ['nullable', 'integer', 'min:0'],
            'bono_financiamiento_r9'          => ['nullable', 'integer', 'min:0'],
            'bono_financiamiento_tradicional' => ['nullable', 'integer', 'min:0'],
            'sales_code' => ['nullable', 'string', 'max:100'],
            'description' => ['nullable', 'string'],
            'is_active' => ['boolean'],
            'display_order' => ['integer'],
            'engine' => ['nullable', 'array'],
            'electric' => ['nullable', 'array'],
            'dimensions' => ['nullable', 'array'],
            'capacities' => ['nullable', 'array'],
            'performance' => ['nullable', 'array'],
            'chassis' => ['nullable', 'array'],
            'feature_ids' => ['nullable', 'array'],
            'feature_ids.*' => ['integer', 'exists:features,id'],
            'colors' => ['nullable', 'array'],
        ]);
    }

}
