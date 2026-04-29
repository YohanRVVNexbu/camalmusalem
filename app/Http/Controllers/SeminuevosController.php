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
        $seminuevo = Seminuevo::with('branch')
            ->where(function ($q) use ($slug) {
                $q->where('slug', $slug);
                if (is_numeric($slug)) {
                    $q->orWhere('id', (int) $slug);
                }
            })
            ->where('is_visible', true)
            ->firstOrFail();

        $footer = SiteSection::where('section', 'footer')->first();

        return Inertia::render('seminuevos/show', [
            'seminuevo' => $seminuevo,
            'footer'    => $footer?->data ?? [],
        ]);
    }

    public function cotizar(string $slug)
    {
        $seminuevo = Seminuevo::with('branch')
            ->where(function ($q) use ($slug) {
                $q->where('slug', $slug);
                if (is_numeric($slug)) {
                    $q->orWhere('id', (int) $slug);
                }
            })
            ->where('is_visible', true)
            ->firstOrFail();

        return Inertia::render('seminuevos/cotizar', [
            'seminuevo' => $seminuevo,
            'footer'    => SiteSection::where('section', 'footer')->first()?->data ?? [],
        ]);
    }
}
