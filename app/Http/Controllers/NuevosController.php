<?php

namespace App\Http\Controllers;

use App\Models\BodyType;
use App\Models\Drivetrain;
use App\Models\PowertrainType;
use App\Models\SiteSection;
use App\Models\TransmissionType;
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

        $vehicles = $models->map(function ($m) {
            $presented = $this->presenter->presentModel($m);
            // Campos raw para filtrar en el frontend (no usados en la UI visible)
            $presented['_filter'] = [
                'body_type' => $m->body_type,
                'model_slug' => $m->slug,
                'powertrains' => $m->versions->pluck('powertrain_type')->unique()->values()->all(),
                'transmissions' => $m->versions->pluck('transmission_type')->filter()->unique()->values()->all(),
                'drivetrains' => $m->versions->pluck('drivetrain')->unique()->values()->all(),
            ];

            return $presented;
        })->all();

        $heroCards = $this->resolveHeroCards($section?->data['hero_cards'] ?? null, $models);

        return Inertia::render('nuevos', [
            'data' => $section?->data ?? [],
            'footer' => $footer?->data ?? [],
            'vehicles' => $vehicles,
            'heroCards' => $heroCards,
            'filterOptions' => $this->buildFilterOptions($models),
        ]);
    }

    private function buildFilterOptions($models): array
    {
        // Solo incluye códigos que efectivamente tienen vehículos (para no mostrar
        // opciones sin resultados). Combina lookup master con lo presente en BD.
        $lookupMap = fn ($class) => $class::where('is_active', true)
            ->orderBy('display_order')
            ->get(['code', 'name_es'])
            ->map(fn ($l) => ['code' => $l->code, 'label' => $l->name_es])
            ->keyBy('code');

        $bodyTypes = $lookupMap(BodyType::class);
        $powertrains = $lookupMap(PowertrainType::class);
        $transmissions = $lookupMap(TransmissionType::class);
        $drivetrains = $lookupMap(Drivetrain::class);

        $presentBody = $models->pluck('body_type')->filter()->unique()->values();
        $presentPower = $models->flatMap(fn ($m) => $m->versions->pluck('powertrain_type'))->filter()->unique()->values();
        $presentTrans = $models->flatMap(fn ($m) => $m->versions->pluck('transmission_type'))->filter()->unique()->values();
        $presentDrive = $models->flatMap(fn ($m) => $m->versions->pluck('drivetrain'))->filter()->unique()->values();

        $only = function ($lookups, $presentCodes) {
            return $lookups->only($presentCodes)->values()->all();
        };

        $modelOptions = $models->map(fn ($m) => [
            'code' => $m->slug,
            'label' => $m->name,
        ])->values()->all();

        return [
            'gama' => $only($bodyTypes, $presentBody->all()),
            'modelo' => $modelOptions,
            'combustible' => $only($powertrains, $presentPower->all()),
            'transmision' => $only($transmissions, $presentTrans->all()),
            'traccion' => $only($drivetrains, $presentDrive->all()),
        ];
    }

    /**
     * Resuelve los 4 slots del hero a partir de la config del admin. Cada slot
     * apunta a un vehicle_model_id; el admin puede sobrescribir imagen y forzar
     * el badge eléctrico. Slots vacíos se descartan. Si no hay config, fallback
     * a los primeros 4 modelos.
     */
    private function resolveHeroCards(?array $configured, $allModels): array
    {
        if (! $configured) {
            return $allModels->take(4)
                ->map(fn ($m) => $this->presenter->presentModel($m))
                ->values()
                ->all();
        }

        $modelsById = $allModels->keyBy('id');

        return collect($configured)
            ->filter(fn ($slot) => ! empty($slot['vehicle_model_id']))
            ->map(function ($slot) use ($modelsById) {
                $model = $modelsById->get($slot['vehicle_model_id']);
                if (! $model) {
                    return null;
                }
                $card = $this->presenter->presentModel($model);

                if (! empty($slot['image_override'])) {
                    $card['hero_image'] = $slot['image_override'];
                }

                $badgeMode = $slot['show_electric_badge'] ?? 'auto';
                if ($badgeMode === 'on' || $badgeMode === 'off') {
                    $card['force_electric_badge'] = $badgeMode === 'on';
                }

                return $card;
            })
            ->filter()
            ->values()
            ->all();
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
