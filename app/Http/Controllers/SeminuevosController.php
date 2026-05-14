<?php

namespace App\Http\Controllers;

use App\Models\Seminuevo;
use App\Models\SiteSection;
use Inertia\Inertia;

class SeminuevosController extends Controller
{
    private function visibleSection(string $key): ?array
    {
        $section = SiteSection::where('section', $key)->first();
        if (! $section || ! $section->is_visible) {
            return null;
        }

        return $section->data ?? [];
    }

    public function index()
    {
        $section = SiteSection::where('section', 'seminuevos_page')->first();

        return Inertia::render('seminuevos', [
            'data'       => $section && $section->is_visible ? ($section->data ?? []) : null,
            'footer'     => $this->visibleSection('footer'),
            'seminuevos' => Seminuevo::where('is_visible', true)
                ->orderBy('order')
                ->orderBy('brand')
                ->get(),
        ]);
    }

    public function compare()
    {
        return Inertia::render('seminuevos/compare', [
            'footer' => $this->visibleSection('footer'),
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

        return Inertia::render('seminuevos/show', [
            'seminuevo' => $seminuevo,
            'footer'    => $this->visibleSection('footer'),
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
            'footer'    => $this->visibleSection('footer'),
        ]);
    }
}
