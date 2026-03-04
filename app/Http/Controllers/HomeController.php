<?php

namespace App\Http\Controllers;

use App\Services\SiteSettingsService;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index(SiteSettingsService $settingsService)
    {
        return Inertia::render('welcome', [
            'sections' => $settingsService->getHomePageData(),
        ]);
    }
}
