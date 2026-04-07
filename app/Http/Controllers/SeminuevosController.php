<?php

namespace App\Http\Controllers;

use App\Models\Seminuevo;
use App\Models\SiteSection;
use Inertia\Inertia;

class SeminuevosController extends Controller
{
    public function index()
    {
        $section = SiteSection::where('section', 'seminuevos_page')->first();
        $footer = SiteSection::where('section', 'footer')->first();

        return Inertia::render('seminuevos', [
            'data'       => $section?->data ?? [],
            'footer'     => $footer?->data ?? [],
            'seminuevos' => Seminuevo::where('is_visible', true)
                ->orderBy('order')
                ->orderBy('brand')
                ->get(),
        ]);
    }

    public function compare()
    {
        $footer = SiteSection::where('section', 'footer')->first();

        return Inertia::render('seminuevos/compare', [
            'footer' => $footer?->data ?? [],
        ]);
    }

    public function show(string $slug)
    {
        $seminuevo = Seminuevo::where('slug', $slug)
            ->orWhere('id', is_numeric($slug) ? (int) $slug : 0)
            ->where('is_visible', true)
            ->firstOrFail();

        $footer = SiteSection::where('section', 'footer')->first();

        return Inertia::render('seminuevos/show', [
            'seminuevo' => $seminuevo,
            'footer'    => $footer?->data ?? [],
        ]);
    }
}
