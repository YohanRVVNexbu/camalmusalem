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

    private function processFiles(array $files, array $data, string $section, array $oldData): array
    {
        foreach ($files as $key => $file) {
            if ($key === 'data' || $key === 'is_visible') {
                continue;
            }

            if ($file instanceof UploadedFile) {
                $oldUrl = data_get($oldData, $key);
                $this->settingsService->deleteOldFile($oldUrl);
                $url = $this->settingsService->uploadFile($file, "home/{$section}");
                data_set($data, $key, $url);
            }
        }

        return $data;
    }
}
