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

        $model = VehicleModel::create($data);

        if ($request->hasFile('hero_image')) {
            $model->update([
                'hero_image' => $this->settings->uploadFile($request->file('hero_image'), 'vehicle-models/'.$model->id),
            ]);
        }

        if ($request->boolean('add_version_after')) {
            return redirect('/admin/vehicle-versions/create?model_id='.$model->id)
                ->with('success', 'Vehículo creado. Ahora agrega su ficha técnica.');
        }

        return redirect('/admin/vehicle-models')->with('success', 'Vehículo creado correctamente.');
    }

    public function edit(VehicleModel $vehicleModel)
    {
        return Inertia::render('admin/vehicle-models/form', [
            'model' => $vehicleModel,
            'brands' => Brand::where('is_active', true)->orderBy('name')->get(['id', 'name']),
            'bodyTypes' => $this->bodyTypes(),
        ]);
    }

    public function update(Request $request, VehicleModel $vehicleModel)
    {
        $data = $this->validated($request);
        $data['slug'] = Str::slug($data['name']);

        if ($request->hasFile('hero_image')) {
            $this->settings->deleteOldFile($vehicleModel->hero_image);
            $data['hero_image'] = $this->settings->uploadFile($request->file('hero_image'), 'vehicle-models/'.$vehicleModel->id);
        }

        $vehicleModel->update($data);

        return back()->with('success', 'Modelo actualizado correctamente.');
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

}
