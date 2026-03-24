<?php

namespace App\Http\Controllers;

use App\Models\SiteSection;
use App\Services\YouTubeService;
use Inertia\Inertia;

class NuevosController extends Controller
{
    public function index()
    {
        $section = SiteSection::where('section', 'nuevos_page')->first();
        $footer = SiteSection::where('section', 'footer')->first();

        return Inertia::render('nuevos', [
            'data' => $section?->data ?? [],
            'footer' => $footer?->data ?? [],
        ]);
    }

    public function show(string $id, YouTubeService $youtubeService)
    {
        $footer = SiteSection::where('section', 'footer')->first();
        $shorts = SiteSection::where('section', 'shorts')->first();

        return Inertia::render('nuevos/show', [
            'vehicleId' => $id,
            'footer' => $footer?->data ?? [],
            'shorts' => $shorts?->data ?? [],
            'youtubeShorts' => $youtubeService->getShorts(),
        ]);
    }
}
