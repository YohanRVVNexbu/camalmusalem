<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteSection;
use App\Services\SiteSettingsService;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Inertia\Inertia;

class PageContentController extends Controller
{
    // Map page slug → [section keys]
    private const PAGE_SECTIONS = [
        'kinto'        => ['kinto_hero', 'kinto_pasos', 'kinto_vehiculos'],
        'nosotros'     => ['nosotros_hero', 'nosotros_historia', 'nosotros_mision', 'nosotros_vision', 'nosotros_equipo', 'nosotros_reconocimientos'],
        'contacto'     => ['contacto_info'],
        'programas'    => ['programas_hero', 'programas_grid'],
        'noticias'     => ['noticias_hero'],
        'shorts'       => ['shorts_hero'],
        'seminuevos'   => ['seminuevos_hero'],
        'repuestos'    => ['repuestos_hero'],
        'accesorios'   => ['accesorios_hero'],
        'mantencion'   => ['mantencion_hero'],
    ];

    public function __construct(private SiteSettingsService $settingsService) {}

    public function index()
    {
        $pages = [
            ['slug' => 'kinto',      'title' => 'Arriendo KINTO',      'icon' => '🚗'],
            ['slug' => 'nosotros',   'title' => 'Nosotros',            'icon' => '🏢'],
            ['slug' => 'contacto',   'title' => 'Contacto',            'icon' => '📞'],
            ['slug' => 'programas',  'title' => 'Programas Toyota',    'icon' => '📋'],
            ['slug' => 'noticias',   'title' => 'Noticias',            'icon' => '📰'],
            ['slug' => 'shorts',     'title' => 'Shorts',              'icon' => '🎬'],
            ['slug' => 'seminuevos', 'title' => 'Seminuevos',          'icon' => '🔄'],
            ['slug' => 'repuestos',  'title' => 'Repuestos',           'icon' => '🔧'],
            ['slug' => 'accesorios', 'title' => 'Accesorios y Merch',  'icon' => '👕'],
            ['slug' => 'mantencion', 'title' => 'Agendar Mantención',  'icon' => '🛠️'],
        ];

        return Inertia::render('admin/paginas/index', ['pages' => $pages]);
    }

    public function show(string $page)
    {
        abort_unless(array_key_exists($page, self::PAGE_SECTIONS), 404);

        $keys = self::PAGE_SECTIONS[$page];
        $sections = SiteSection::whereIn('section', $keys)
            ->get()
            ->keyBy('section')
            ->map(fn ($s) => [
                'section'      => $s->section,
                'data'         => $s->data,
                'default_data' => $s->default_data,
                'is_visible'   => $s->is_visible,
            ])
            ->toArray();

        return Inertia::render("admin/paginas/{$page}", [
            'page'     => $page,
            'sections' => $sections,
        ]);
    }

    public function update(Request $request, string $page, string $section)
    {
        abort_unless(array_key_exists($page, self::PAGE_SECTIONS), 404);
        abort_unless(in_array($section, self::PAGE_SECTIONS[$page]), 404);

        $siteSection = SiteSection::where('section', $section)->firstOrFail();

        $request->validate([
            'is_visible' => ['required', 'boolean'],
            'data'       => ['required', 'array'],
        ]);

        $data = $request->input('data');
        $files = $request->allFiles();
        $data = $this->processFiles($files, $data, $section, $siteSection->data ?? []);

        $this->settingsService->updateSection($section, $data, $request->boolean('is_visible'));

        return back()->with('success', 'Sección actualizada correctamente.');
    }

    public function reset(string $page, string $section)
    {
        abort_unless(array_key_exists($page, self::PAGE_SECTIONS), 404);
        abort_unless(in_array($section, self::PAGE_SECTIONS[$page]), 404);

        $siteSection = SiteSection::where('section', $section)->firstOrFail();

        if ($siteSection->default_data) {
            $siteSection->update(['data' => $siteSection->default_data]);
        }

        return back()->with('success', 'Sección restaurada a los valores por defecto.');
    }

    private function processFiles(array $files, array $data, string $section, array $oldData): array
    {
        foreach ($files as $key => $file) {
            if (in_array($key, ['data', 'is_visible'])) {
                continue;
            }
            if ($file instanceof UploadedFile) {
                $oldUrl = data_get($oldData, $key);
                $this->settingsService->deleteOldFile($oldUrl);
                $url = $this->settingsService->uploadFile($file, "paginas/{$section}");
                data_set($data, $key, $url);
            }
        }

        return $data;
    }
}
