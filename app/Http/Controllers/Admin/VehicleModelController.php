<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BodyType;
use App\Models\Brand;
use App\Models\VehicleModel;
use App\Services\SiteSettingsService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class VehicleModelController extends Controller
{
    public function __construct(private SiteSettingsService $settings) {}

    public function index()
    {
        $models = VehicleModel::with('brand')
            ->withCount('versions')
            ->orderBy('display_order')
            ->orderBy('name')
            ->get();

        return Inertia::render('admin/vehicle-models/index', [
            'models' => $models,
            'bodyTypes' => $this->bodyTypes(),
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/vehicle-models/form', [
            'model' => null,
            'brands' => Brand::where('is_active', true)->orderBy('name')->get(['id', 'name']),
            'bodyTypes' => $this->bodyTypes(),
        ]);
    }

    private function bodyTypes(): array
    {
        return BodyType::where('is_active', true)
            ->orderBy('display_order')
            ->pluck('name_es', 'code')
            ->all();
    }

    public function store(Request $request)
    {
        $data = $this->validated($request);
        $data['slug'] = Str::slug($data['name']);

        $detailContent = $this->resolveDetailContent($request, null);
        if ($detailContent !== null) {
            $data['detail_content'] = $detailContent;
        }

        $model = VehicleModel::create($data);

        if ($request->hasFile('hero_image')) {
            $model->update([
                'hero_image' => $this->settings->uploadFile($request->file('hero_image'), 'vehicle-models/'.$model->id),
            ]);
        }

        $this->processDetailUploads($request, $model);

        if ($request->boolean('add_version_after')) {
            return redirect('/admin/vehicle-versions/create?model_id='.$model->id)
                ->with('success', 'Vehículo creado. Ahora agrega su ficha técnica.');
        }

        return redirect('/admin/vehicle-models')->with('success', 'Vehículo creado correctamente.');
    }

    public function edit(VehicleModel $vehicleModel)
    {
        $vehicleModel->load(['versions' => fn ($q) => $q->orderBy('display_order')->orderBy('model_year', 'desc')]);

        return Inertia::render('admin/vehicle-models/form', [
            'model' => $vehicleModel,
            'brands' => Brand::where('is_active', true)->orderBy('name')->get(['id', 'name']),
            'bodyTypes' => $this->bodyTypes(),
            'versions' => $vehicleModel->versions->map(fn ($v) => [
                'id' => $v->id,
                'trim_name' => $v->trim_name,
                'model_year' => $v->model_year,
                'powertrain_type' => $v->powertrain_type,
                'drivetrain' => $v->drivetrain,
                'msrp_clp' => $v->msrp_clp,
                'is_active' => $v->is_active,
            ]),
        ]);
    }

    public function update(Request $request, VehicleModel $vehicleModel)
    {
        $data = $this->validated($request);
        $data['slug'] = Str::slug($data['name']);

        if ($request->hasFile('hero_image')) {
            $this->settings->deleteOldFile($vehicleModel->hero_image);
            $data['hero_image'] = $this->settings->uploadFile($request->file('hero_image'), 'vehicle-models/'.$vehicleModel->id);
        } elseif ($request->boolean('hero_image_remove')) {
            $this->settings->deleteOldFile($vehicleModel->hero_image);
            $data['hero_image'] = null;
        }

        $detailContent = $this->resolveDetailContent($request, $vehicleModel);
        if ($detailContent !== null) {
            $data['detail_content'] = $detailContent;
        }

        $vehicleModel->update($data);

        $this->processDetailUploads($request, $vehicleModel);

        return back()->with('success', 'Vehículo actualizado correctamente.');
    }

    public function destroy(VehicleModel $vehicleModel)
    {
        if ($vehicleModel->versions()->exists()) {
            return back()->with('error', 'No se puede eliminar: el modelo tiene versiones asociadas.');
        }

        $this->settings->deleteOldFile($vehicleModel->hero_image);
        $vehicleModel->delete();

        return redirect('/admin/vehicle-models')->with('success', 'Modelo eliminado.');
    }

    private function validated(Request $request): array
    {
        return $request->validate([
            'brand_id' => ['required', 'exists:brands,id'],
            'name' => ['required', 'string', 'max:255'],
            'body_type' => ['nullable', 'string', 'exists:body_types,code'],
            'segment' => ['nullable', 'string', 'max:100'],
            'generation' => ['nullable', 'string', 'max:100'],
            'description' => ['nullable', 'string'],
            'is_active' => ['boolean'],
            'display_order' => ['integer'],
        ]);
    }

    /**
     * Normaliza el detail_content enviado, preservando URLs de imagen
     * existentes si no se suben nuevos archivos.
     */
    private function resolveDetailContent(Request $request, ?VehicleModel $existing): ?array
    {
        if (! $request->has('detail_content')) {
            return null;
        }

        $payload = $request->input('detail_content', []);
        $stored = $existing?->detail_content ?? [];

        $highlights = $payload['highlights'] ?? [];
        $normalizedHighlights = [];
        foreach ($highlights as $i => $h) {
            $normalizedHighlights[] = [
                'image' => $h['image'] ?? ($stored['highlights'][$i]['image'] ?? null),
                'title' => $h['title'] ?? '',
                'text' => $h['text'] ?? '',
            ];
        }

        $colors = $payload['viewer_360']['colors'] ?? [];
        $normalizedColors = [];
        foreach ($colors as $i => $c) {
            $normalizedColors[] = [
                'name' => $c['name'] ?? '',
                'hex' => $c['hex'] ?? null,
                'photos' => $c['photos'] ?? ($stored['viewer_360']['colors'][$i]['photos'] ?? []),
            ];
        }

        $textBlocks = $payload['viewer_360']['text_blocks'] ?? [];
        $normalizedBlocks = [];
        foreach ($textBlocks as $b) {
            $normalizedBlocks[] = [
                'key' => $b['key'] ?? Str::slug($b['title'] ?? '', '_'),
                'title' => $b['title'] ?? '',
                'text' => $b['text'] ?? '',
            ];
        }

        return [
            'hero' => [
                'tagline' => $payload['hero']['tagline'] ?? $stored['hero']['tagline'] ?? 'Desde',
                'description' => $payload['hero']['description'] ?? $stored['hero']['description'] ?? '',
            ],
            'highlights' => $normalizedHighlights,
            'viewer_360' => [
                'colors' => $normalizedColors,
                'text_blocks' => $normalizedBlocks,
            ],
        ];
    }

    /**
     * Procesa uploads en claves dot-notation bajo detail_content.*. Los mueve
     * al storage público y reemplaza el valor correspondiente dentro del JSON.
     */
    private function processDetailUploads(Request $request, VehicleModel $model): void
    {
        $detail = $model->detail_content ?? [];
        $touched = false;

        foreach ($request->allFiles() as $key => $file) {
            if ($key === 'hero_image') {
                continue;
            }
            if (! str_starts_with($key, 'detail_content.')) {
                continue;
            }
            if (! $file instanceof \Illuminate\Http\UploadedFile) {
                continue;
            }

            $path = substr($key, strlen('detail_content.'));
            $oldUrl = data_get($detail, $path);
            $this->settings->deleteOldFile($oldUrl);
            $url = $this->settings->uploadFile($file, 'vehicle-models/'.$model->id);

            data_set($detail, $path, $url);
            $touched = true;
        }

        if ($touched) {
            $model->update(['detail_content' => $detail]);
        }
    }
}
