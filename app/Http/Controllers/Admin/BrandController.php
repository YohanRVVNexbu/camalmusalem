<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Services\SiteSettingsService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class BrandController extends Controller
{
    public function __construct(private SiteSettingsService $settings) {}

    public function index()
    {
        return Inertia::render('admin/brands/index', [
            'brands' => Brand::withCount('models')->orderBy('name')->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/brands/form', ['brand' => null]);
    }

    public function store(Request $request)
    {
        $data = $this->validated($request);
        $data['slug'] = Str::slug($data['name']);

        $brand = Brand::create($data);

        if ($request->hasFile('logo')) {
            $brand->update([
                'logo_path' => $this->settings->uploadFile($request->file('logo'), 'brands/'.$brand->id),
            ]);
        }

        return redirect('/admin/brands')->with('success', 'Marca creada correctamente.');
    }

    public function edit(Brand $brand)
    {
        return Inertia::render('admin/brands/form', ['brand' => $brand]);
    }

    public function update(Request $request, Brand $brand)
    {
        $data = $this->validated($request);
        $data['slug'] = Str::slug($data['name']);

        if ($request->hasFile('logo')) {
            $this->settings->deleteOldFile($brand->logo_path);
            $data['logo_path'] = $this->settings->uploadFile($request->file('logo'), 'brands/'.$brand->id);
        }

        $brand->update($data);

        return back()->with('success', 'Marca actualizada correctamente.');
    }

    public function destroy(Brand $brand)
    {
        if ($brand->models()->exists()) {
            return back()->with('error', 'No se puede eliminar: la marca tiene modelos asociados.');
        }

        $this->settings->deleteOldFile($brand->logo_path);
        $brand->delete();

        return redirect('/admin/brands')->with('success', 'Marca eliminada.');
    }

    private function validated(Request $request): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'is_active' => ['boolean'],
        ]);
    }
}
