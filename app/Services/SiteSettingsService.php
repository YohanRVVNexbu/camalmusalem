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

        return '/storage/'.$path;
    }

    public function deleteOldFile(?string $url): void
    {
        if (! $url || ! str_contains($url, '/storage/')) {
            return;
        }

        // Handle both relative paths and legacy absolute URLs
        $parsed = parse_url($url, PHP_URL_PATH);
        $path = str_replace('/storage/', '', $parsed ?? $url);
        Storage::disk('public')->delete($path);
    }
}
