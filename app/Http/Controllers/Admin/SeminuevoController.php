<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Seminuevo;
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
        return Inertia::render('admin/seminuevos/form', ['seminuevo' => null]);
    }

    public function store(Request $request)
    {
        $data = $this->validated($request);
        $data['slug'] = $this->uniqueSlug($data['brand'], $data['model'], $data['year']);
        $seminuevo = Seminuevo::create($data);
        $this->handleGallery($request, $seminuevo);
        $this->handleFeaturedGallery($request, $seminuevo);

        return redirect('/admin/seminuevos')->with('success', 'Seminuevo creado correctamente.');
    }

    public function edit(Seminuevo $seminuevo)
    {
        return Inertia::render('admin/seminuevos/form', ['seminuevo' => $seminuevo]);
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
        $gallery = $seminuevo->gallery ?? [];

        if ($request->hasFile('gallery_new')) {
            foreach ($request->file('gallery_new') as $file) {
                $gallery[] = $this->settings->uploadFile($file, 'seminuevos/' . $seminuevo->id);
            }
        }

        if ($request->has('gallery_remove')) {
            $toRemove = $request->input('gallery_remove', []);
            foreach ($toRemove as $url) {
                $this->settings->deleteOldFile($url);
            }
            $gallery = array_values(array_filter($gallery, fn($u) => !in_array($u, $toRemove)));
        }

        $seminuevo->update(['gallery' => $gallery]);
    }

    private function handleFeaturedGallery(Request $request, Seminuevo $seminuevo): void
    {
        $featured = $seminuevo->featured_gallery ?? [];

        if ($request->hasFile('featured_new')) {
            foreach ($request->file('featured_new') as $file) {
                $featured[] = $this->settings->uploadFile($file, 'seminuevos/' . $seminuevo->id . '/featured');
            }
        }

        if ($request->has('featured_remove')) {
            $toRemove = $request->input('featured_remove', []);
            foreach ($toRemove as $url) {
                $this->settings->deleteOldFile($url);
            }
            $featured = array_values(array_filter($featured, fn($u) => !in_array($u, $toRemove)));
        }

        $seminuevo->update(['featured_gallery' => $featured]);
    }

    private function validated(Request $request): array
    {
        $data = $request->validate([
            'brand'        => ['required', 'string', 'max:100'],
            'model'        => ['required', 'string', 'max:255'],
            'slug'         => ['nullable', 'string', 'max:255'],
            'year'         => ['required', 'integer', 'min:1990', 'max:2030'],
            'km'           => ['required', 'integer', 'min:0'],
            'price'        => ['required', 'string', 'max:100'],
            'down_payment' => ['nullable', 'string', 'max:100'],
            'fuel'         => ['nullable', 'string', 'max:100'],
            'transmission' => ['nullable', 'string', 'max:100'],
            'traction'     => ['nullable', 'string', 'max:50'],
            'doors'        => ['integer', 'min:2', 'max:6'],
            'seats'        => ['integer', 'min:2', 'max:9'],
            'color'        => ['nullable', 'string', 'max:100'],
            'description'  => ['nullable', 'string'],
            'is_visible'   => ['boolean'],
            'order'        => ['integer'],
        ]);

        // specs comes as a JSON string from FormData
        if ($request->has('specs')) {
            $decoded = json_decode($request->input('specs'), true);
            $data['specs'] = is_array($decoded) ? $decoded : null;
        }

        return $data;
    }
}
