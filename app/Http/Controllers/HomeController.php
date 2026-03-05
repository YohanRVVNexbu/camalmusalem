<?php

namespace App\Http\Controllers;

use App\Services\SiteSettingsService;
use App\Services\YouTubeService;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index(SiteSettingsService $settingsService, YouTubeService $youtubeService)
    {
        return Inertia::render('welcome', [
            'sections' => $settingsService->getHomePageData(),
            'youtubeShorts' => $youtubeService->getShorts(),
        ]);
    }
}
