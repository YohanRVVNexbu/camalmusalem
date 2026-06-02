<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\CatalogImport\ListaPreciosMayo2026Importer;
use App\Models\Branch;
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
                'material_code' => $data['material_code'] ?? null,
                'option_code' => $data['option_code'] ?? null,
                'description' => $data['description'] ?? null,
                'multimedia' => $this->normalizeMultimedia($data['multimedia'] ?? []),
                'is_active' => $data['is_active'] ?? true,
                'display_order' => $data['display_order'] ?? 0,
            ]);

            $this->syncSatellites($version, $request);
            $this->syncFeatures($version, $request->input('feature_ids', []));
            $this->syncColors($version, $request->input('colors', []));

            return $version;
        });

        if ($request->filled('hero_image_url')) {
            $version->update(['hero_image' => $request->input('hero_image_url')]);
        } elseif ($request->hasFile('hero_image')) {
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
                'material_code' => $data['material_code'] ?? null,
                'option_code' => $data['option_code'] ?? null,
                'description' => $data['description'] ?? null,
                'multimedia' => $this->normalizeMultimedia($data['multimedia'] ?? []),
                'is_active' => $data['is_active'] ?? true,
                'display_order' => $data['display_order'] ?? 0,
            ]);

            $this->syncSatellites($vehicleVersion, $request);
            $this->syncFeatures($vehicleVersion, $request->input('feature_ids', []));
            $this->syncColors($vehicleVersion, $request->input('colors', []));
        });

        if ($request->has('hero_image_url')) {
            $vehicleVersion->update(['hero_image' => $request->input('hero_image_url') ?: null]);
        } elseif ($request->hasFile('hero_image')) {
            $this->settings->deleteOldFile($vehicleVersion->hero_image);
            $vehicleVersion->update([
                'hero_image' => $this->settings->uploadFile($request->file('hero_image'), 'vehicle-versions/'.$vehicleVersion->id),
            ]);
        } elseif ($request->boolean('hero_image_remove')) {
            $this->settings->deleteOldFile($vehicleVersion->hero_image);
            $vehicleVersion->update(['hero_image' => null]);
        }

        return back()->with('success', 'Versión actualizada correctamente.');
    }

    public function destroy(VehicleVersion $vehicleVersion)
    {
        $this->settings->deleteOldFile($vehicleVersion->hero_image);
        $vehicleVersion->delete();

        return redirect('/admin/vehicle-versions')->with('success', 'Versión eliminada.');
    }

    /**
     * Sube UNA foto del visor 360 de una versión (un archivo por request).
     * Mismo patrón que el de modelos: endpoint dedicado para esquivar el
     * MaxReqBodySize del LSWS con batches grandes. El JS ya comprime la
     * imagen; acá guardamos tal cual y devolvemos la URL. La asociación
     * foto→color vive en el state de React hasta que se guarda la versión.
     */
    public function uploadPhoto360(Request $request, VehicleVersion $vehicleVersion)
    {
        $request->validate([
            'file' => ['required', 'file', 'image', 'max:51200'], // 50 MB
        ]);

        $request->session()->save();

        $file = $request->file('file');
        $extension = strtolower($file->getClientOriginalExtension() ?: ($file->guessExtension() ?? 'webp'));
        $name = Str::random(40).'.'.$extension;
        $directory = 'vehicle-versions/'.$vehicleVersion->id.'/360';
        $path = $file->storeAs($directory, $name, 'public');

        return response()->json(['url' => '/storage/'.$path]);
    }

    /**
     * Sube UN archivo (imagen o video) de la sección Multimedia de la versión.
     * Los videos NO se optimizan; las imágenes ya vienen comprimidas del
     * cliente. Las URLs de YouTube no pasan por acá (se guardan como texto).
     */
    public function uploadMedia(Request $request, VehicleVersion $vehicleVersion)
    {
        $request->validate([
            'file' => ['required', 'file', 'mimes:jpg,jpeg,png,webp,mp4,webm,mov,m4v', 'max:153600'], // 150 MB
        ]);

        $request->session()->save();

        $file = $request->file('file');
        $extension = strtolower($file->getClientOriginalExtension() ?: ($file->guessExtension() ?? 'bin'));
        $name = Str::random(40).'.'.$extension;
        $directory = 'vehicle-versions/'.$vehicleVersion->id.'/multimedia';
        $path = $file->storeAs($directory, $name, 'public');

        return response()->json([
            'url' => '/storage/'.$path,
            'is_video' => in_array($extension, ['mp4', 'webm', 'mov', 'm4v'], true),
        ]);
    }

    /**
     * Página de import masivo del Excel "Lista de Precios sugeridos Mayo 2026".
     * Flujo: el admin elige sucursal(es) → sube el archivo → ve un preview con
     * qué versiones se crearán vs. cuáles solo actualizarán precio → confirma.
     */
    public function bulkImport()
    {
        return Inertia::render('admin/vehicle-versions/bulk-import', [
            'branches' => Branch::query()
                ->where('is_active', true)
                ->orderBy('display_order')
                ->get(['id', 'name']),
        ]);
    }

    public function bulkImportPreview(Request $request)
    {
        $request->validate(['file' => ['required', 'file', 'mimes:xlsx,xls']]);
        $data = (new ListaPreciosMayo2026Importer)->preview($request->file('file'));

        return response()->json($data);
    }

    public function bulkImportStore(Request $request)
    {
        $request->validate([
            'file' => ['required', 'file', 'mimes:xlsx,xls'],
            'branch_ids' => ['required', 'array', 'min:1'],
            'branch_ids.*' => ['integer', 'exists:branches,id'],
        ]);

        $result = (new ListaPreciosMayo2026Importer)->import(
            $request->file('file'),
            array_map('intval', $request->input('branch_ids', []))
        );

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
            // Otras versiones del MISMO modelo, para poder replicar colores entre ellas
            'siblings' => $version ? VehicleVersion::where('vehicle_model_id', $version->vehicle_model_id)
                ->where('id', '!=', $version->id)
                ->orderBy('model_year', 'desc')
                ->orderBy('trim_name')
                ->withCount('colors')
                ->get(['id', 'trim_name', 'model_year'])
                ->map(fn ($v) => [
                    'id' => $v->id,
                    'label' => "{$v->trim_name} ({$v->model_year})",
                    'colors_count' => $v->colors_count,
                ])
                ->all() : [],
        ];
    }

    /**
     * Replica los colores (con sus fotos 360) de esta versión a otras versiones
     * del mismo modelo. Útil cuando la marca no entrega PNG por versión y se
     * usa la misma imagen para varias. Reemplaza por completo los colores
     * existentes en las versiones destino.
     */
    public function replicateColors(Request $request, VehicleVersion $vehicleVersion)
    {
        $data = $request->validate([
            'targets'   => ['required', 'array', 'min:1'],
            'targets.*' => ['integer', 'exists:vehicle_versions,id'],
        ]);

        $sourceColors = $vehicleVersion->colors()->orderBy('display_order')->get();
        if ($sourceColors->isEmpty()) {
            return back()->with('error', 'Esta versión no tiene colores para replicar. Guardá los colores antes de replicar.');
        }

        // Filtra destinos: distintos al origen y del mismo modelo (defensa server-side).
        $targets = VehicleVersion::whereIn('id', $data['targets'])
            ->where('id', '!=', $vehicleVersion->id)
            ->where('vehicle_model_id', $vehicleVersion->vehicle_model_id)
            ->get();

        if ($targets->isEmpty()) {
            return back()->with('error', 'No hay versiones destino válidas (deben pertenecer al mismo modelo).');
        }

        DB::transaction(function () use ($sourceColors, $targets) {
            foreach ($targets as $target) {
                VersionColor::where('vehicle_version_id', $target->id)->delete();
                foreach ($sourceColors as $i => $sc) {
                    VersionColor::create([
                        'vehicle_version_id' => $target->id,
                        'name'               => $sc->name,
                        'hex'                => $sc->hex,
                        'type'               => $sc->type ?? 'solid',
                        'is_available'       => (bool) $sc->is_available,
                        'photos_360'         => $sc->photos_360 ?? [],
                        'display_order'      => $i,
                    ]);
                }
            }
        });

        $count = $targets->count();
        return back()->with('success', "Colores replicados a {$count} versión".($count === 1 ? '' : 'es').'.');
    }

    /**
     * Replica la multimedia (imágenes, videos, YouTube) de esta versión a otras
     * del mismo modelo. Reemplaza por completo la multimedia de los destinos.
     */
    public function replicateMultimedia(Request $request, VehicleVersion $vehicleVersion)
    {
        $data = $request->validate([
            'targets'   => ['required', 'array', 'min:1'],
            'targets.*' => ['integer', 'exists:vehicle_versions,id'],
        ]);

        $sourceMultimedia = $vehicleVersion->multimedia ?? [];
        if (empty($sourceMultimedia)) {
            return back()->with('error', 'Esta versión no tiene multimedia para replicar. Guardá la versión con su multimedia antes de replicar.');
        }

        $targets = VehicleVersion::whereIn('id', $data['targets'])
            ->where('id', '!=', $vehicleVersion->id)
            ->where('vehicle_model_id', $vehicleVersion->vehicle_model_id)
            ->get();

        if ($targets->isEmpty()) {
            return back()->with('error', 'No hay versiones destino válidas (deben pertenecer al mismo modelo).');
        }

        DB::transaction(function () use ($sourceMultimedia, $targets) {
            foreach ($targets as $target) {
                $target->update(['multimedia' => $sourceMultimedia]);
            }
        });

        $count = $targets->count();
        return back()->with('success', "Multimedia replicada a {$count} versión".($count === 1 ? '' : 'es').'.');
    }

    /**
     * Replica el equipamiento (features) de esta versión a otras del mismo
     * modelo. Reemplaza por completo el equipamiento de los destinos.
     */
    public function replicateFeatures(Request $request, VehicleVersion $vehicleVersion)
    {
        $data = $request->validate([
            'targets'   => ['required', 'array', 'min:1'],
            'targets.*' => ['integer', 'exists:vehicle_versions,id'],
        ]);

        $sourceFeatureIds = $vehicleVersion->features()->pluck('features.id')->all();
        if (empty($sourceFeatureIds)) {
            return back()->with('error', 'Esta versión no tiene equipamiento para replicar. Guardá la versión con su equipamiento antes de replicar.');
        }

        $targets = VehicleVersion::whereIn('id', $data['targets'])
            ->where('id', '!=', $vehicleVersion->id)
            ->where('vehicle_model_id', $vehicleVersion->vehicle_model_id)
            ->get();

        if ($targets->isEmpty()) {
            return back()->with('error', 'No hay versiones destino válidas (deben pertenecer al mismo modelo).');
        }

        DB::transaction(function () use ($sourceFeatureIds, $targets) {
            foreach ($targets as $target) {
                $target->features()->sync($sourceFeatureIds);
            }
        });

        $count = $targets->count();
        return back()->with('success', "Equipamiento replicado a {$count} versión".($count === 1 ? '' : 'es').'.');
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

    /**
     * Normaliza la lista de multimedia: solo items con type válido
     * (image/video/youtube) y url no vacía, preservando el orden.
     */
    private function normalizeMultimedia(array $items): array
    {
        $valid = ['image', 'video', 'youtube'];
        $out = [];
        foreach ($items as $it) {
            $type = $it['type'] ?? null;
            $url = $it['url'] ?? null;
            if (in_array($type, $valid, true) && is_string($url) && $url !== '') {
                $out[] = ['type' => $type, 'url' => $url];
            }
        }
        return $out;
    }

    private function syncColors(VehicleVersion $version, array $colors): void
    {
        $existingIds = $version->colors()->pluck('id')->all();
        $keepIds = [];

        foreach ($colors as $i => $c) {
            if (empty($c['name'])) {
                continue;
            }
            // photos_360: lista de URLs (ya subidas vía el endpoint dedicado).
            // Filtramos vacíos para no guardar slots sucios.
            $photos360 = array_values(array_filter(
                $c['photos_360'] ?? [],
                fn ($url) => is_string($url) && $url !== '',
            ));
            $row = [
                'vehicle_version_id' => $version->id,
                'name' => $c['name'],
                'hex' => $c['hex'] ?? null,
                'type' => $c['type'] ?? 'solid',
                'is_available' => (bool) ($c['is_available'] ?? true),
                'photos_360' => $photos360,
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
            'material_code' => ['nullable', 'string', 'max:32'],
            'option_code' => ['nullable', 'string', 'max:64'],
            'description' => ['nullable', 'string'],
            'is_active' => ['boolean'],
            'display_order' => ['integer'],
            'engine' => ['nullable', 'array'],
            // Validamos rangos campo-por-campo para que un error tipo "puse 2393
            // en N° cilindros pensando que era cilindrada (cc)" salga como un
            // 422 con mensaje claro en el form, en vez de un 500 SQL feo
            // (cylinders es TINYINT, max 255 — cualquier valor de cilindrada
            // real lo rompía).
            'engine.cylinders'          => ['nullable', 'integer', 'min:1', 'max:16'],
            'engine.displacement_cc'    => ['nullable', 'integer', 'min:0', 'max:65535'],
            'engine.hp'                 => ['nullable', 'integer', 'min:0', 'max:65535'],
            'engine.hp_rpm'             => ['nullable', 'integer', 'min:0', 'max:65535'],
            'engine.torque_nm'          => ['nullable', 'integer', 'min:0', 'max:65535'],
            'engine.torque_rpm_min'     => ['nullable', 'integer', 'min:0', 'max:65535'],
            'engine.torque_rpm_max'     => ['nullable', 'integer', 'min:0', 'max:65535'],
            'electric' => ['nullable', 'array'],
            'dimensions' => ['nullable', 'array'],
            'capacities' => ['nullable', 'array'],
            'performance' => ['nullable', 'array'],
            'chassis' => ['nullable', 'array'],
            'feature_ids' => ['nullable', 'array'],
            'feature_ids.*' => ['integer', 'exists:features,id'],
            'colors' => ['nullable', 'array'],
            'colors.*.photos_360' => ['nullable', 'array'],
            'colors.*.photos_360.*' => ['nullable', 'string'],
            'multimedia' => ['nullable', 'array'],
            'multimedia.*.type' => ['required_with:multimedia.*.url', 'in:image,video,youtube'],
            'multimedia.*.url' => ['required_with:multimedia.*.type', 'string'],
        ]);
    }

}
