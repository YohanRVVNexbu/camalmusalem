<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Branch;
use App\Models\Seminuevo;
use App\Services\CatalogExport\SeminuevosExporter;
use App\Services\CatalogImport\SeminuevosImporter;
use App\Services\SiteSettingsService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class SeminuevoController extends Controller
{
    public function __construct(private SiteSettingsService $settings) {}

    public function index()
    {
        return Inertia::render('admin/seminuevos/index', [
            'seminuevos' => Seminuevo::orderBy('order')->orderByDesc('year')->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/seminuevos/form', [
            'seminuevo' => null,
            'branches' => Branch::where('is_active', true)->orderBy('display_order')->get(['id', 'name', 'city']),
        ]);
    }

    public function store(Request $request)
    {
        $data = $this->validated($request);
        $data['slug'] = $this->uniqueSlug($data['brand'], $data['model'], $data['year']);
        $seminuevo = Seminuevo::create($data);
        $this->handleGallery($request, $seminuevo);
        $this->handleFeaturedGallery($request, $seminuevo);
        $this->handleDownloads($request, $seminuevo);

        return redirect('/admin/seminuevos')->with('success', 'Seminuevo creado correctamente.');
    }

    public function edit(Seminuevo $seminuevo)
    {
        return Inertia::render('admin/seminuevos/form', [
            'seminuevo' => $seminuevo,
            'branches' => Branch::where('is_active', true)->orderBy('display_order')->get(['id', 'name', 'city']),
        ]);
    }

    public function update(Request $request, Seminuevo $seminuevo)
    {
        $data = $this->validated($request);
        // Only regenerate slug if not provided or if brand/model changed
        if (empty($data['slug'])) {
            $data['slug'] = $this->uniqueSlug($data['brand'], $data['model'], $data['year'], $seminuevo->id);
        }
        $seminuevo->update($data);
        $this->handleGallery($request, $seminuevo);
        $this->handleFeaturedGallery($request, $seminuevo);
        $this->handleDownloads($request, $seminuevo);

        return back()->with('success', 'Seminuevo actualizado correctamente.');
    }

    public function destroy(Seminuevo $seminuevo)
    {
        foreach ($seminuevo->gallery ?? [] as $url) {
            $this->settings->deleteOldFile($url);
        }
        foreach ($seminuevo->featured_gallery ?? [] as $url) {
            $this->settings->deleteOldFile($url);
        }
        $seminuevo->delete();

        return redirect('/admin/seminuevos')->with('success', 'Seminuevo eliminado.');
    }

    public function import(Request $request)
    {
        $request->validate(['file' => ['required', 'file', 'mimes:xlsx,xls']]);
        $result = (new SeminuevosImporter)->import($request->file('file'));

        return redirect('/admin/seminuevos')->with('success', $result->toFlashMessage());
    }

    public function export()
    {
        return (new SeminuevosExporter)->download('seminuevos_'.date('Y-m-d').'.xlsx');
    }

    public function template()
    {
        return (new SeminuevosExporter(templateOnly: true))->download('plantilla_seminuevos.xlsx');
    }

    private function uniqueSlug(string $brand, string $model, int $year, ?int $excludeId = null): string
    {
        $base = Str::slug("{$brand} {$model} {$year}");
        $slug = $base;
        $i = 2;
        while (
            Seminuevo::where('slug', $slug)
                ->when($excludeId, fn($q) => $q->where('id', '!=', $excludeId))
                ->exists()
        ) {
            $slug = "{$base}-{$i}";
            $i++;
        }
        return $slug;
    }

    private function handleGallery(Request $request, Seminuevo $seminuevo): void
    {
        // gallery_order ahora es la lista FINAL de URLs (el front sube por
        // Base64 al elegir, así que ya viene con todas las URLs en el orden
        // que el admin definió). Diff vs lo que está en BD para borrar lo
        // que el admin quitó.
        $newGallery = $request->input('gallery_order', null);
        if (! is_array($newGallery)) {
            return;
        }
        $newGallery = array_values(array_filter($newGallery, fn ($u) => is_string($u) && $u !== ''));
        foreach (array_diff($seminuevo->gallery ?? [], $newGallery) as $url) {
            $this->settings->deleteOldFile($url);
        }
        $seminuevo->update(['gallery' => $newGallery]);
    }

    private function handleFeaturedGallery(Request $request, Seminuevo $seminuevo): void
    {
        $newFeatured = $request->input('featured_order', null);
        if (! is_array($newFeatured)) {
            return;
        }
        $newFeatured = array_values(array_filter($newFeatured, fn ($u) => is_string($u) && $u !== ''));
        foreach (array_diff($seminuevo->featured_gallery ?? [], $newFeatured) as $url) {
            $this->settings->deleteOldFile($url);
        }
        $seminuevo->update(['featured_gallery' => $newFeatured]);
    }

    /**
     * Reordena las URLs existentes según el orden enviado desde el admin.
     * Solo considera URLs que realmente existen; cualquier URL existente que
     * no venga en el orden se agrega al final (defensa contra desincronización).
     */
    private function reorderExisting(array $existing, $order): array
    {
        if (! is_array($order) || empty($order)) {
            return $existing;
        }

        $ordered = array_values(array_filter($order, fn ($u) => in_array($u, $existing, true)));
        foreach ($existing as $u) {
            if (! in_array($u, $ordered, true)) {
                $ordered[] = $u;
            }
        }

        return $ordered;
    }

    /**
     * Procesa los archivos descargables. Trabaja sobre specs.downloads que ya
     * fue deserializado por validated(): elimina las URLs marcadas para borrar,
     * sube los archivos nuevos con su etiqueta y persiste el specs actualizado.
     */
    private function handleDownloads(Request $request, Seminuevo $seminuevo): void
    {
        $specs = $seminuevo->specs ?? [];
        $downloads = $specs['downloads'] ?? [];

        // Remover entradas cuya URL figura en downloads_remove
        if ($request->has('downloads_remove')) {
            $toRemove = $request->input('downloads_remove', []);
            foreach ($toRemove as $url) {
                $this->settings->deleteOldFile($url);
            }
            $downloads = array_values(array_filter(
                $downloads,
                fn ($d) => ! in_array($d['url'] ?? null, $toRemove, true)
            ));
        }

        // Agregar nuevos uploads
        $newInputs = $request->input('downloads_new', []);
        $newFiles = $request->file('downloads_new', []);
        foreach ($newFiles as $i => $entry) {
            $file = $entry['file'] ?? null;
            if (! $file instanceof \Illuminate\Http\UploadedFile) {
                continue;
            }
            $label = $newInputs[$i]['label'] ?? $file->getClientOriginalName();
            $url = $this->settings->uploadFile($file, 'seminuevos/'.$seminuevo->id.'/downloads');
            $downloads[] = ['label' => $label, 'url' => $url];
        }

        $specs['downloads'] = array_values($downloads);
        $seminuevo->update(['specs' => $specs]);
    }

    private function validated(Request $request): array
    {
        $data = $request->validate([
            'brand'        => ['required', 'string', 'max:100'],
            'model'        => ['required', 'string', 'max:255'],
            'vu_code'      => ['nullable', 'string', 'max:50'],
            'slug'         => ['nullable', 'string', 'max:255'],
            'year'         => ['required', 'integer', 'min:1990', 'max:2030'],
            'km'           => ['required', 'integer', 'min:0'],
            'price'        => ['required', 'string', 'max:100'],
            'price_offer'  => ['nullable', 'string', 'max:100'],
            'down_payment' => ['nullable', 'string', 'max:100'],
            'fuel'         => ['nullable', 'string', 'max:100'],
            'transmission' => ['nullable', 'string', 'max:100'],
            'traction'     => ['nullable', 'string', 'max:50'],
            'doors'        => ['integer', 'min:2', 'max:6'],
            'seats'        => ['integer', 'min:2', 'max:9'],
            'color'        => ['nullable', 'string', 'max:100'],
            'description'  => ['nullable', 'string'],
            'is_visible'   => ['boolean'],
            'certified'    => ['boolean'],
            'order'        => ['integer'],
            'branch_id'    => ['nullable', 'exists:branches,id'],
        ]);

        // specs comes as a JSON string from FormData
        if ($request->has('specs')) {
            $decoded = json_decode($request->input('specs'), true);
            $data['specs'] = is_array($decoded) ? $decoded : null;
        }

        // Normaliza precios a sólo dígitos para que la BD siempre guarde el
        // valor canónico — el front formatea con formatCLP() al mostrar.
        $data['price'] = $this->onlyDigits($data['price'] ?? '');
        if (isset($data['price_offer'])) {
            $data['price_offer'] = $this->onlyDigits($data['price_offer']) ?: null;
        }
        if (isset($data['down_payment'])) {
            $data['down_payment'] = $this->onlyDigits($data['down_payment']) ?: null;
        }

        return $data;
    }

    private function onlyDigits(?string $value): string
    {
        return preg_replace('/[^0-9]/', '', (string) $value);
    }
}
