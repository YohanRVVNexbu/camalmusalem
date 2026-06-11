<?php

namespace App\Http\Controllers;

use App\Models\Seminuevo;
use App\Models\VehicleModel;
use App\Services\SiteSettingsService;
use App\Services\YouTubeService;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index(SiteSettingsService $settingsService, YouTubeService $youtubeService)
    {
        $sections = $settingsService->getHomePageData();

        // Enrich about.vehicles[*] with the linked vehicle's slug so the
        // public component can build the "Más detalles" link without a second
        // round-trip to look it up.
        if (isset($sections['about']['vehicles']) && is_array($sections['about']['vehicles'])) {
            $ids = collect($sections['about']['vehicles'])->pluck('vehicle_model_id')->filter()->unique();
            $slugsById = VehicleModel::whereIn('id', $ids)->pluck('slug', 'id');

            $sections['about']['vehicles'] = array_map(function ($v) use ($slugsById) {
                $id = $v['vehicle_model_id'] ?? null;
                $v['vehicle_slug'] = $id && isset($slugsById[$id]) ? $slugsById[$id] : null;
                return $v;
            }, $sections['about']['vehicles']);
        }

        // La sección "Seminuevos" del home no usa el array hardcodeado del
        // admin: pisa `vehicles` con los seminuevos reales (visibles, hasta 6,
        // ordenados como el admin los priorizó). El admin sigue controlando
        // título/descripción/botón desde site_sections, pero las cards salen
        // del catálogo verdadero. Si la tabla está vacía, queda como [] y el
        // componente muestra el empty state "sin vehículos disponibles".
        if (isset($sections['seminuevos']) && is_array($sections['seminuevos'])) {
            $sections['seminuevos']['vehicles'] = Seminuevo::where('is_visible', true)
                ->orderBy('order')
                ->orderBy('brand')
                ->limit(6)
                ->get()
                ->map(function (Seminuevo $s) {
                    $gallery = is_array($s->gallery) ? $s->gallery : [];
                    return [
                        'image' => $gallery[0] ?? '',
                        'badge' => 'Seminuevo',
                        'year' => (string) $s->year,
                        'brand' => $s->brand,
                        'name' => $s->model,
                        'km' => number_format((int) $s->km, 0, ',', '.') . ' Km',
                        'transmission' => $s->transmission ?? '',
                        'fuel' => $s->fuel ?? '',
                        'price' => (string) $s->price,
                        'price_offer' => $s->price_offer ? (string) $s->price_offer : null,
                        'down_payment' => $s->down_payment ? (string) $s->down_payment : null,
                        'href' => '/seminuevos/' . ($s->slug ?? $s->id),
                    ];
                })
                ->values()
                ->all();
        }

        return Inertia::render('welcome', [
            'sections' => $sections,
            'youtubeShorts' => $youtubeService->getShorts(),
        ]);
    }
}
