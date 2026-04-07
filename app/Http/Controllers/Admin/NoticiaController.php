<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Noticia;
use App\Services\SiteSettingsService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class NoticiaController extends Controller
{
    public function __construct(private SiteSettingsService $settings) {}

    public function index()
    {
        return Inertia::render('admin/noticias/index', [
            'noticias' => Noticia::orderBy('order')->orderByDesc('published_at')->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/noticias/form', ['noticia' => null]);
    }

    public function store(Request $request)
    {
        $data = $this->validated($request);
        $data['slug'] = $this->uniqueSlug($data['title']);
        $sections = $this->processSections($request, null);
        $data['sections'] = $sections;

        // Use first hero image as cover image
        $data['image'] = $this->firstImage($sections);

        $noticia = Noticia::create($data);

        return redirect('/admin/noticias')->with('success', 'Noticia creada correctamente.');
    }

    public function edit(Noticia $noticia)
    {
        return Inertia::render('admin/noticias/form', ['noticia' => $noticia]);
    }

    public function update(Request $request, Noticia $noticia)
    {
        $data = $this->validated($request);
        $sections = $this->processSections($request, $noticia);
        $data['sections'] = $sections;
        $data['image'] = $this->firstImage($sections) ?? $noticia->image;

        $noticia->update($data);

        return back()->with('success', 'Noticia actualizada correctamente.');
    }

    public function destroy(Noticia $noticia)
    {
        // Delete all section images
        foreach ($noticia->sections ?? [] as $section) {
            foreach ($section['images'] ?? [] as $url) {
                $this->settings->deleteOldFile($url);
            }
        }
        $noticia->delete();

        return redirect('/admin/noticias')->with('success', 'Noticia eliminada.');
    }

    private function processSections(Request $request, ?Noticia $noticia): array
    {
        $sections = json_decode($request->input('sections', '[]'), true) ?? [];
        $uploadedFiles = $request->file('section_images', []);

        foreach ($sections as $idx => &$section) {
            if (in_array($section['type'], ['hero', 'gallery'])) {
                $existing = $section['images'] ?? [];
                $new = [];

                if (isset($uploadedFiles[$idx])) {
                    $files = is_array($uploadedFiles[$idx]) ? $uploadedFiles[$idx] : [$uploadedFiles[$idx]];
                    foreach ($files as $file) {
                        $new[] = $this->settings->uploadFile($file, 'noticias/sections');
                    }
                }

                $section['images'] = array_merge($existing, $new);
            }
        }

        return $sections;
    }

    private function firstImage(array $sections): ?string
    {
        foreach ($sections as $section) {
            if (in_array($section['type'], ['hero', 'gallery']) && !empty($section['images'][0])) {
                return $section['images'][0];
            }
        }
        return null;
    }

    private function uniqueSlug(string $title, ?int $excludeId = null): string
    {
        $base = Str::slug($title);
        $slug = $base;
        $i = 2;
        while (
            Noticia::where('slug', $slug)
                ->when($excludeId, fn($q) => $q->where('id', '!=', $excludeId))
                ->exists()
        ) {
            $slug = "{$base}-{$i}";
            $i++;
        }
        return $slug;
    }

    private function validated(Request $request): array
    {
        return $request->validate([
            'title'        => ['required', 'string', 'max:255'],
            'categoria'    => ['nullable', 'string', 'max:100'],
            'excerpt'      => ['nullable', 'string'],
            'published_at' => ['nullable', 'date'],
            'is_visible'   => ['boolean'],
            'order'        => ['integer'],
        ]);
    }
}
