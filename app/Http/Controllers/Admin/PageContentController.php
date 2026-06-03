<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteSection;
use App\Models\VehicleModel;
use App\Services\SiteSettingsService;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Inertia\Inertia;

class PageContentController extends Controller
{
    // Map page slug → [section keys]
    private const PAGE_SECTIONS = [
        'nuevos'       => ['nuevos_page'],
        'kinto'        => ['kinto_hero', 'kinto_pasos', 'kinto_vehiculos', 'kinto_formulario'],
        'nosotros'     => ['nosotros_hero', 'nosotros_historia', 'nosotros_mision', 'nosotros_vision', 'nosotros_equipo', 'nosotros_reconocimientos'],
        'contacto'     => ['contacto_info'],
        'programas'    => ['programas_hero', 'programas_grid', 'programas_mantenimiento'],
        'noticias'     => ['noticias_hero'],
        'shorts'       => ['shorts_hero'],
        'seminuevos'   => ['seminuevos_hero'],
        'repuestos'    => ['repuestos_hero', 'repuestos_seccion'],
        'accesorios'   => ['accesorios_hero', 'accesorios_seccion', 'accesorios_whatsapp'],
        'mantencion'   => ['mantencion_hero', 'mantencion_carrusel', 'mantencion_reserva'],
        'compliance'   => ['compliance_hero', 'compliance_descargas', 'compliance_canales'],
        'banner-cta'   => ['contact_cta_banner'],
        'whatsapp'     => ['whatsapp_button'],
    ];

    public function __construct(private SiteSettingsService $settingsService) {}

    public function index()
    {
        $pages = [
            ['slug' => 'nuevos',     'title' => 'Vehículos Nuevos',    'icon' => '🚙'],
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
            ['slug' => 'compliance', 'title' => 'Compliance (legales)', 'icon' => '⚖️'],
            ['slug' => 'banner-cta', 'title' => 'Banner Contáctanos (global)', 'icon' => '📣'],
            ['slug' => 'whatsapp',   'title' => 'Botón WhatsApp (flotante)',   'icon' => '💬'],
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

        $extra = [];
        if ($page === 'nuevos') {
            $extra['vehicle_models'] = VehicleModel::with([
                'brand',
                'versions' => fn ($q) => $q->where('is_active', true)->orderBy('display_order'),
            ])
                ->where('is_active', true)
                ->orderBy('name')
                ->get()
                ->map(fn ($m) => [
                    'id' => $m->id,
                    'name' => $m->name,
                    'brand_name' => $m->brand->name,
                    'hero_image' => $m->hero_image,
                    'is_electric' => $m->versions->contains(fn ($v) => $v->powertrain_type === 'bev'),
                ])->values();
        }

        return Inertia::render("admin/paginas/{$page}", [
            'page'     => $page,
            'sections' => $sections,
            ...$extra,
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

        if (! $siteSection->default_data) {
            return back()->with('error', 'No hay defaults configurados para esta sección.');
        }

        $siteSection->update(['data' => $siteSection->default_data]);

        return back()->with('success', 'Sección restaurada a los valores por defecto.');
    }

    private function processFiles(array $files, array $data, string $section, array $oldData): array
    {
        foreach ($this->flattenFiles($files) as $key => $file) {
            if (in_array($key, ['data', 'is_visible'])) {
                continue;
            }
            $oldUrl = data_get($oldData, $key);
            $this->settingsService->deleteOldFile($oldUrl);
            $url = $this->settingsService->uploadFile($file, "paginas/{$section}");
            data_set($data, $key, $url);
        }

        return $data;
    }

    private function flattenFiles(array $files, string $prefix = ''): array
    {
        $result = [];
        foreach ($files as $key => $value) {
            $path = $prefix === '' ? (string) $key : "{$prefix}.{$key}";
            if ($value instanceof UploadedFile) {
                $result[$path] = $value;
            } elseif (is_array($value)) {
                $result = array_merge($result, $this->flattenFiles($value, $path));
            }
        }
        return $result;
    }
}
