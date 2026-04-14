<?php

namespace App\Http\Controllers;

use App\Models\SiteSection;
use App\Models\VehicleModel;
use App\Services\CatalogPresenter;
use App\Services\YouTubeService;
use Inertia\Inertia;

class NuevosController extends Controller
{
    public function __construct(private CatalogPresenter $presenter) {}

    public function index()
    {
        $section = SiteSection::where('section', 'nuevos_page')->first();
        $footer = SiteSection::where('section', 'footer')->first();

        $models = VehicleModel::with([
            'brand',
            'versions' => fn ($q) => $q->where('is_active', true)->orderBy('display_order'),
            'versions.engine', 'versions.electric', 'versions.dimensions',
            'versions.capacities', 'versions.performance', 'versions.chassis',
            'versions.features', 'versions.colors',
        ])
            ->where('is_active', true)
            ->orderBy('display_order')
            ->orderBy('name')
            ->get();

        return Inertia::render('nuevos', [
            'data' => $section?->data ?? [],
            'footer' => $footer?->data ?? [],
            'vehicles' => $models->map(fn ($m) => $this->presenter->presentModel($m))->all(),
        ]);
    }

    public function show(string $id, YouTubeService $youtubeService)
    {
        $model = VehicleModel::with([
            'brand',
            'versions' => fn ($q) => $q->where('is_active', true)->orderBy('display_order'),
            'versions.engine', 'versions.electric', 'versions.dimensions',
            'versions.capacities', 'versions.performance', 'versions.chassis',
            'versions.features', 'versions.colors',
        ])
            ->where('is_active', true)
            ->where(function ($q) use ($id) {
                $q->where('slug', $id);
                if (is_numeric($id)) {
                    $q->orWhere('id', (int) $id);
                }
            })
            ->firstOrFail();

        $footer = SiteSection::where('section', 'footer')->first();
        $shorts = SiteSection::where('section', 'shorts')->first();

        return Inertia::render('nuevos/show', [
            'vehicle' => $this->presenter->presentModel($model),
            'footer' => $footer?->data ?? [],
            'shorts' => $shorts?->data ?? [],
            'youtubeShorts' => $youtubeService->getShorts(),
        ]);
    }
}
