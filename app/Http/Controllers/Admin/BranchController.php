<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Branch;
use App\Services\SiteSettingsService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class BranchController extends Controller
{
    public function __construct(private SiteSettingsService $settingsService) {}

    public function index()
    {
        return Inertia::render('admin/branches/index', [
            'branches' => Branch::orderBy('display_order')->orderBy('name')->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/branches/form', ['branch' => null]);
    }

    public function store(Request $request)
    {
        $data = $this->validated($request);
        $data['slug'] = Str::slug($data['name']);
        $data['image_path'] = $this->handleImageUpload($request, null);

        Branch::create($data);

        return redirect('/admin/branches')->with('success', 'Sucursal creada correctamente.');
    }

    public function edit(Branch $branch)
    {
        // Position among active branches (sorted as in the public view) — used to
        // pick the right fallback image preview when no custom image is uploaded.
        $position = Branch::where('is_active', true)
            ->orderBy('display_order')
            ->pluck('id')
            ->search($branch->id);

        return Inertia::render('admin/branches/form', [
            'branch' => $branch,
            'fallbackPosition' => $position === false ? 0 : $position,
        ]);
    }

    public function update(Request $request, Branch $branch)
    {
        $data = $this->validated($request);
        $data['slug'] = Str::slug($data['name']);
        $data['image_path'] = $this->handleImageUpload($request, $branch);

        $branch->update($data);

        return back()->with('success', 'Sucursal actualizada correctamente.');
    }

    public function destroy(Branch $branch)
    {
        if ($branch->seminuevos()->exists()) {
            return back()->with('error', 'No se puede eliminar: la sucursal tiene seminuevos asociados.');
        }

        if ($branch->image_path) {
            $this->settingsService->deleteOldFile($branch->image_path);
        }

        $branch->delete();

        return redirect('/admin/branches')->with('success', 'Sucursal eliminada.');
    }

    private function handleImageUpload(Request $request, ?Branch $branch): ?string
    {
        if ($request->hasFile('image')) {
            if ($branch?->image_path) {
                $this->settingsService->deleteOldFile($branch->image_path);
            }
            return $this->settingsService->uploadFile($request->file('image'), 'branches');
        }

        return $branch?->image_path;
    }

    private function validated(Request $request): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:150'],
            'address' => ['nullable', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:100'],
            'maps_url' => ['nullable', 'url', 'max:500'],
            'latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180'],
            'phone' => ['nullable', 'string', 'max:50'],
            'phone_sucursal' => ['nullable', 'string', 'max:50'],
            'phone_repuestos' => ['nullable', 'string', 'max:50'],
            'phones_servicio_tecnico' => ['nullable', 'array'],
            'phones_servicio_tecnico.*' => ['string', 'max:50'],
            'image' => ['nullable', 'image', 'max:5120'],
            'is_active' => ['boolean'],
            'display_order' => ['integer'],
        ]);
    }
}
