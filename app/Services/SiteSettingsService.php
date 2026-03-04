<?php

namespace App\Services;

use App\Models\SiteSection;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class SiteSettingsService
{
    public function getHomePageData(): array
    {
        return SiteSection::getVisibleSections();
    }

    public function getAllSectionsForAdmin(): array
    {
        return SiteSection::getAllForAdmin();
    }

    public function updateSection(string $section, array $data, bool $isVisible): void
    {
        SiteSection::where('section', $section)->update([
            'data' => $data,
            'is_visible' => $isVisible,
        ]);
    }

    public function uploadFile(UploadedFile $file, string $directory = 'home'): string
    {
        $path = $file->store($directory, 'public');

        return Storage::disk('public')->url($path);
    }

    public function deleteOldFile(?string $url): void
    {
        if (! $url || ! str_contains($url, '/storage/')) {
            return;
        }

        $path = str_replace('/storage/', '', parse_url($url, PHP_URL_PATH));
        Storage::disk('public')->delete($path);
    }
}
