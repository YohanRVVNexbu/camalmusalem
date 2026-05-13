<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteSection;
use App\Services\SiteSettingsService;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Inertia\Inertia;

class HomeContentController extends Controller
{
    public function __construct(
        private SiteSettingsService $settingsService,
    ) {}

    public function index()
    {
        return Inertia::render('admin/home/index', [
            'sections' => $this->settingsService->getAllSectionsForAdmin(),
            'vehicle_models' => \App\Models\VehicleModel::with('brand')
                ->where('is_active', true)
                ->orderBy('name')
                ->get()
                ->map(fn ($m) => [
                    'id' => $m->id,
                    'name' => $m->name,
                    'slug' => $m->slug,
                    'brand_name' => $m->brand?->name,
                ])
                ->all(),
        ]);
    }

    public function update(Request $request, string $section)
    {
        $siteSection = SiteSection::where('section', $section)->firstOrFail();

        $request->validate([
            'is_visible' => ['required', 'boolean'],
            'data' => ['required', 'array'],
        ]);

        $data = $request->input('data');

        // Ensure grid_items positions are integers
        if (isset($data['grid_items']) && is_array($data['grid_items'])) {
            foreach ($data['grid_items'] as &$item) {
                foreach (['x', 'y', 'w', 'h'] as $key) {
                    if (isset($item[$key])) {
                        $item[$key] = (int) $item[$key];
                    }
                }
            }
            unset($item);
        }

        // Process file uploads
        $files = $request->allFiles();
        $data = $this->processFiles($files, $data, $section, $siteSection->data);

        $this->settingsService->updateSection($section, $data, $request->boolean('is_visible'));

        return back()->with('success', 'Sección actualizada correctamente.');
    }

    public function reset(string $section)
    {
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
            if ($key === 'data' || $key === 'is_visible') {
                continue;
            }

            $oldUrl = data_get($oldData, $key);
            $this->settingsService->deleteOldFile($oldUrl);
            $url = $this->settingsService->uploadFile($file, "home/{$section}");
            data_set($data, $key, $url);
        }

        return $data;
    }

    /**
     * Recursively flatten nested file arrays (from bracket-notation form
     * fields like cards[0][image]) into dot-notation keys (cards.0.image).
     */
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
