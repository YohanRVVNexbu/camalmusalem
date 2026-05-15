<?php

namespace App\Http\Controllers;

use App\Models\Seminuevo;
use App\Models\SiteSection;
use App\Services\VehiculoComparadorService;
use Illuminate\Http\Request;
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

    /**
     * Comparador unificado de Nuevos + Seminuevos.
     * Query: ?ids=s-1,v-2,v-3 — preselecciona esos vehículos al cargar.
     * Catalog: stock disponible para el modal "Añadir vehículo".
     */
    public function compare(Request $request, VehiculoComparadorService $comparador)
    {
        $ids = (string) $request->query('ids', '');
        $preselected = $comparador->resolveMany($ids);

        return Inertia::render('seminuevos/compare', [
            'preselected' => $preselected,
            'catalog'     => $comparador->catalogo(),
            'sections'    => VehiculoComparadorService::SECTIONS,
            'footer'      => $this->visibleSection('footer'),
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
