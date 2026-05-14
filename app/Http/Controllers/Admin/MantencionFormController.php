<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MantencionVehicleModel;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

/**
 * Mantenedor unificado del formulario de Agendar Mantención.
 * Maneja dos catálogos independientes en una sola UI con pestañas:
 *  - Servicios: los tipos de servicio que ofrece el taller
 *  - Modelos: los modelos de vehículos que entran a reparación
 *
 * Estos modelos son intencionalmente distintos del catálogo de Vehículos
 * Nuevos (/admin/vehicle-models) porque el taller atiende también modelos
 * antiguos o descontinuados que no necesariamente se venden.
 */
class MantencionFormController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/formulario-mantencion/index', [
            'services' => Service::orderBy('display_order')->orderBy('name')->get(),
            'vehicleModels' => MantencionVehicleModel::orderBy('display_order')->orderBy('name')->get(),
        ]);
    }

    // ── Servicios ──────────────────────────────────────────────────────────────
    public function storeService(Request $request)
    {
        $data = $this->validatedService($request);
        $data['slug'] = $this->uniqueServiceSlug($data['name']);
        Service::create($data);
        return back()->with('success', 'Servicio creado.');
    }

    public function updateService(Request $request, Service $service)
    {
        $data = $this->validatedService($request);
        $service->update($data);
        return back()->with('success', 'Servicio actualizado.');
    }

    public function destroyService(Service $service)
    {
        $service->delete();
        return back()->with('success', 'Servicio eliminado.');
    }

    // ── Modelos de vehículo (form mantención) ─────────────────────────────────
    public function storeVehicleModel(Request $request)
    {
        $data = $this->validatedVehicleModel($request);
        MantencionVehicleModel::create($data);
        return back()->with('success', 'Modelo creado.');
    }

    public function updateVehicleModel(Request $request, MantencionVehicleModel $model)
    {
        $data = $this->validatedVehicleModel($request);
        $model->update($data);
        return back()->with('success', 'Modelo actualizado.');
    }

    public function destroyVehicleModel(MantencionVehicleModel $model)
    {
        $model->delete();
        return back()->with('success', 'Modelo eliminado.');
    }

    // ── helpers ────────────────────────────────────────────────────────────────
    private function validatedService(Request $request): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:150'],
            'is_active' => ['boolean'],
            'display_order' => ['integer'],
        ]);
    }

    private function validatedVehicleModel(Request $request): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:150'],
            'is_active' => ['boolean'],
            'display_order' => ['integer'],
        ]);
    }

    private function uniqueServiceSlug(string $name): string
    {
        $base = Str::slug($name);
        $slug = $base;
        $i = 1;
        while (Service::where('slug', $slug)->exists()) {
            $slug = "{$base}-{$i}";
            $i++;
        }
        return $slug;
    }
}
