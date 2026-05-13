<?php

namespace App\Http\Controllers;

use App\Models\VehicleModel;
use App\Services\SiteSettingsService;
use App\Services\YouTubeService;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index(SiteSettingsService $settingsService, YouTubeService $youtubeService)
    {
        $sections = $settingsService->getHomePageData();

        // Enrich about.vehicles[*] with the linked vehicle's slug so the
        // public component can build the "Más detalles" link without a second
        // round-trip to look it up.
        if (isset($sections['about']['vehicles']) && is_array($sections['about']['vehicles'])) {
            $ids = collect($sections['about']['vehicles'])->pluck('vehicle_model_id')->filter()->unique();
            $slugsById = VehicleModel::whereIn('id', $ids)->pluck('slug', 'id');

            $sections['about']['vehicles'] = array_map(function ($v) use ($slugsById) {
                $id = $v['vehicle_model_id'] ?? null;
                $v['vehicle_slug'] = $id && isset($slugsById[$id]) ? $slugsById[$id] : null;
                return $v;
            }, $sections['about']['vehicles']);
        }

        return Inertia::render('welcome', [
            'sections' => $sections,
            'youtubeShorts' => $youtubeService->getShorts(),
        ]);
    }
}
