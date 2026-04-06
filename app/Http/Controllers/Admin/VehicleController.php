<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Vehicle;
use App\Services\SiteSettingsService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class VehicleController extends Controller
{
    public function __construct(private SiteSettingsService $settings) {}

    public function index()
    {
        return Inertia::render('admin/vehicles/index', [
            'vehicles' => Vehicle::orderBy('order')->orderBy('name')->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/vehicles/form', ['vehicle' => null]);
    }

    public function store(Request $request)
    {
        $data = $this->validated($request);
        $data['slug'] = Str::slug($data['name']);
        $vehicle = Vehicle::create($data);

        if ($request->hasFile('hero_image')) {
            $url = $this->settings->uploadFile($request->file('hero_image'), 'vehicles/' . $vehicle->id);
            $vehicle->update(['hero_image' => $url]);
        }

        return redirect('/admin/vehicles')->with('success', 'Vehículo creado correctamente.');
    }

    public function edit(Vehicle $vehicle)
    {
        return Inertia::render('admin/vehicles/form', ['vehicle' => $vehicle]);
    }

    public function update(Request $request, Vehicle $vehicle)
    {
        $data = $this->validated($request);

        if ($request->hasFile('hero_image')) {
            $this->settings->deleteOldFile($vehicle->hero_image);
            $data['hero_image'] = $this->settings->uploadFile($request->file('hero_image'), 'vehicles/' . $vehicle->id);
        }

        // Handle gallery uploads
        $gallery = $vehicle->gallery ?? [];
        if ($request->hasFile('gallery_new')) {
            foreach ($request->file('gallery_new') as $file) {
                $gallery[] = $this->settings->uploadFile($file, 'vehicles/' . $vehicle->id . '/gallery');
            }
        }
        if ($request->has('gallery_remove')) {
            $toRemove = $request->input('gallery_remove', []);
            foreach ($toRemove as $url) {
                $this->settings->deleteOldFile($url);
            }
            $gallery = array_values(array_filter($gallery, fn($u) => !in_array($u, $toRemove)));
        }
        $data['gallery'] = $gallery;

        $vehicle->update($data);

        return back()->with('success', 'Vehículo actualizado correctamente.');
    }

    public function destroy(Vehicle $vehicle)
    {
        $this->settings->deleteOldFile($vehicle->hero_image);
        foreach ($vehicle->gallery ?? [] as $url) {
            $this->settings->deleteOldFile($url);
        }
        $vehicle->delete();

        return redirect('/admin/vehicles')->with('success', 'Vehículo eliminado.');
    }

    private function validated(Request $request): array
    {
        return $request->validate([
            'name'       => ['required', 'string', 'max:255'],
            'full_name'  => ['nullable', 'string', 'max:255'],
            'subtitle'   => ['nullable', 'string', 'max:255'],
            'type'       => ['nullable', 'string', 'max:100'],
            'fuel'       => ['nullable', 'string', 'max:100'],
            'versions'   => ['nullable', 'array'],
            'highlights' => ['nullable', 'array'],
            'is_visible' => ['boolean'],
            'order'      => ['integer'],
        ]);
    }
}
