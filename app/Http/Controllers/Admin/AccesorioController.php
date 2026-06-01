<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Accesorio;
use App\Services\CatalogExport\AccesoriosExporter;
use App\Services\CatalogImport\AccesoriosImporter;
use App\Services\SiteSettingsService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AccesorioController extends Controller
{
    public function __construct(private SiteSettingsService $settings) {}

    public function index()
    {
        return Inertia::render('admin/accesorios/index', [
            'accesorios' => Accesorio::orderBy('order')->orderBy('name')->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/accesorios/form', ['accesorio' => null]);
    }

    public function store(Request $request)
    {
        $data = $this->validated($request);
        $accesorio = Accesorio::create($data);
        $this->handleImages($request, $accesorio);

        return redirect('/admin/accesorios')->with('success', 'Accesorio creado correctamente.');
    }

    public function edit(Accesorio $accesorio)
    {
        return Inertia::render('admin/accesorios/form', ['accesorio' => $accesorio]);
    }

    public function update(Request $request, Accesorio $accesorio)
    {
        $data = $this->validated($request);
        $accesorio->update($data);
        $this->handleImages($request, $accesorio);

        return back()->with('success', 'Accesorio actualizado correctamente.');
    }

    public function destroy(Accesorio $accesorio)
    {
        foreach ($accesorio->images ?? [] as $url) {
            $this->settings->deleteOldFile($url);
        }
        $accesorio->delete();

        return redirect('/admin/accesorios')->with('success', 'Accesorio eliminado.');
    }

    public function import(Request $request)
    {
        $request->validate(['file' => ['required', 'file', 'mimes:xlsx,xls']]);
        $result = (new AccesoriosImporter)->import($request->file('file'));

        return redirect('/admin/accesorios')->with('success', $result->toFlashMessage());
    }

    public function export()
    {
        return (new AccesoriosExporter)->download('accesorios_'.date('Y-m-d').'.xlsx');
    }

    public function template()
    {
        return (new AccesoriosExporter(templateOnly: true))->download('plantilla_accesorios.xlsx');
    }

    private function handleImages(Request $request, Accesorio $accesorio): void
    {
        $images = $accesorio->images ?? [];

        if ($request->hasFile('images_new')) {
            foreach ($request->file('images_new') as $file) {
                $images[] = $this->settings->uploadFile($file, 'accesorios/' . $accesorio->id);
            }
        }

        if ($request->has('images_remove')) {
            $toRemove = $request->input('images_remove', []);
            foreach ($toRemove as $url) {
                $this->settings->deleteOldFile($url);
            }
            $images = array_values(array_filter($images, fn($u) => !in_array($u, $toRemove)));
        }

        $accesorio->update(['images' => $images]);
    }

    private function validated(Request $request): array
    {
        $data = $request->validate([
            'name'        => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'comentarios' => ['nullable', 'string'],
            'price'       => ['nullable', 'string', 'max:100'],
            'category'    => ['required', 'string', 'max:100'],
            'is_visible'  => ['boolean'],
            'order'       => ['integer'],
        ]);

        // Normaliza el precio a sólo dígitos para que la BD guarde valor
        // canónico — el frontend formatea con formatCLP() al mostrar.
        if (isset($data['price'])) {
            $data['price'] = preg_replace('/[^0-9]/', '', (string) $data['price']) ?: null;
        }

        return $data;
    }
}
