<?php

namespace App\Http\Controllers;

use App\Models\SiteSection;
use App\Models\Vehicle;
use App\Services\YouTubeService;
use Inertia\Inertia;

class NuevosController extends Controller
{
    public function index()
    {
        $section = SiteSection::where('section', 'nuevos_page')->first();
        $footer  = SiteSection::where('section', 'footer')->first();

        return Inertia::render('nuevos', [
            'data'     => $section?->data ?? [],
            'footer'   => $footer?->data ?? [],
            'vehicles' => Vehicle::where('is_visible', true)->orderBy('order')->orderBy('name')->get(),
        ]);
    }

    public function show(string $id, YouTubeService $youtubeService)
    {
        $vehicle = Vehicle::where('slug', $id)
            ->orWhere('id', is_numeric($id) ? (int) $id : 0)
            ->where('is_visible', true)
            ->firstOrFail();

        $footer = SiteSection::where('section', 'footer')->first();
        $shorts = SiteSection::where('section', 'shorts')->first();

        return Inertia::render('nuevos/show', [
            'vehicle'       => $vehicle,
            'footer'        => $footer?->data ?? [],
            'shorts'        => $shorts?->data ?? [],
            'youtubeShorts' => $youtubeService->getShorts(),
        ]);
    }
}
