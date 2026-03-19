<?php

namespace App\Http\Controllers;

use App\Models\SiteSection;
use Inertia\Inertia;

class SeminuevosController extends Controller
{
    public function index()
    {
        $section = SiteSection::where('section', 'seminuevos_page')->first();
        $footer = SiteSection::where('section', 'footer')->first();

        return Inertia::render('seminuevos', [
            'data' => $section?->data ?? [],
            'footer' => $footer?->data ?? [],
        ]);
    }

    public function compare()
    {
        $footer = SiteSection::where('section', 'footer')->first();

        return Inertia::render('seminuevos/compare', [
            'footer' => $footer?->data ?? [],
        ]);
    }

    public function show(string $id)
    {
        $footer = SiteSection::where('section', 'footer')->first();

        return Inertia::render('seminuevos/show', [
            'vehicleId' => $id,
            'footer' => $footer?->data ?? [],
        ]);
    }
}
