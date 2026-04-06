<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Repuesto;
use App\Services\SiteSettingsService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RepuestoController extends Controller
{
    public function __construct(private SiteSettingsService $settings) {}

    public function index()
    {
        return Inertia::render('admin/repuestos/index', [
            'repuestos' => Repuesto::orderBy('order')->orderBy('name')->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/repuestos/form', ['repuesto' => null]);
    }

    public function store(Request $request)
    {
        $data = $this->validated($request);
        $repuesto = Repuesto::create($data);
        $this->handleImages($request, $repuesto);

        return redirect('/admin/repuestos')->with('success', 'Repuesto creado correctamente.');
    }

    public function edit(Repuesto $repuesto)
    {
        return Inertia::render('admin/repuestos/form', ['repuesto' => $repuesto]);
    }

    public function update(Request $request, Repuesto $repuesto)
    {
        $data = $this->validated($request);
        $repuesto->update($data);
        $this->handleImages($request, $repuesto);

        return back()->with('success', 'Repuesto actualizado correctamente.');
    }

    public function destroy(Repuesto $repuesto)
    {
        foreach ($repuesto->images ?? [] as $url) {
            $this->settings->deleteOldFile($url);
        }
        $repuesto->delete();

        return redirect('/admin/repuestos')->with('success', 'Repuesto eliminado.');
    }

    private function handleImages(Request $request, Repuesto $repuesto): void
    {
        $images = $repuesto->images ?? [];

        if ($request->hasFile('images_new')) {
            foreach ($request->file('images_new') as $file) {
                $images[] = $this->settings->uploadFile($file, 'repuestos/' . $repuesto->id);
            }
        }

        if ($request->has('images_remove')) {
            $toRemove = $request->input('images_remove', []);
            foreach ($toRemove as $url) {
                $this->settings->deleteOldFile($url);
            }
            $images = array_values(array_filter($images, fn($u) => !in_array($u, $toRemove)));
        }

        $repuesto->update(['images' => $images]);
    }

    private function validated(Request $request): array
    {
        return $request->validate([
            'name'            => ['required', 'string', 'max:255'],
            'sku'             => ['nullable', 'string', 'max:100'],
            'description'     => ['nullable', 'string'],
            'price'           => ['nullable', 'string', 'max:100'],
            'category'        => ['required', 'string', 'max:100'],
            'stock_la_serena' => ['boolean'],
            'stock_ovalle'    => ['boolean'],
            'is_visible'      => ['boolean'],
            'order'           => ['integer'],
        ]);
    }
}
