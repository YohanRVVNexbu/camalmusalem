<?php

namespace App\Services;

use App\Models\SiteSection;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

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
        $extension = $file->getClientOriginalExtension() ?: $file->guessExtension();
        $name = Str::random(40).($extension ? '.'.$extension : '');
        $path = $file->storeAs($directory, $name, 'public');

        return '/storage/'.$path;
    }

    public function deleteOldFile(?string $url): void
    {
        if (! $url || ! str_contains($url, '/storage/')) {
            return;
        }

        // Protect seeder defaults: any file under /storage/defaults/ is the
        // canonical "factory reset" asset and must never be deleted, even when
        // a user replaces it from the admin.
        $parsed = parse_url($url, PHP_URL_PATH);
        $path = str_replace('/storage/', '', $parsed ?? $url);

        if (str_starts_with($path, 'defaults/')) {
            return;
        }

        Storage::disk('public')->delete($path);
    }
}
