<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BodyType;
use App\Models\ColorType;
use App\Models\Drivetrain;
use App\Models\FeatureCategory;
use App\Models\FuelType;
use App\Models\LookupItem;
use App\Models\PowertrainType;
use App\Models\TransmissionType;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class LookupController extends Controller
{
    /**
     * Registro de lookups editables. `model` es la clase Eloquent, `label`
     * lo que ve el admin en la pestaña, `refs` describe qué tablas usan estos
     * códigos (para mostrar dónde se aplica cada lookup).
     */
    private const LOOKUPS = [
        'feature-categories' => [
            'model' => FeatureCategory::class,
            'label' => 'Categorías de equipamiento',
            'description' => 'Agrupan el equipamiento (Seguridad, Confort, etc.) en el formulario de Versiones.',
            'refs' => 'features.category',
        ],
        'body-types' => [
            'model' => BodyType::class,
            'label' => 'Tipos de carrocería',
            'description' => 'Sedán, SUV, Pickup. Asignado a cada Modelo.',
            'refs' => 'vehicle_models.body_type',
        ],
        'powertrain-types' => [
            'model' => PowertrainType::class,
            'label' => 'Propulsión',
            'description' => 'Gasolina, Diésel, Híbrido, PHEV, Eléctrico. Asignado a cada Versión.',
            'refs' => 'vehicle_versions.powertrain_type',
        ],
        'drivetrains' => [
            'model' => Drivetrain::class,
            'label' => 'Tracción',
            'description' => 'FWD, RWD, AWD, 4WD. Asignado a cada Versión.',
            'refs' => 'vehicle_versions.drivetrain',
        ],
        'transmission-types' => [
            'model' => TransmissionType::class,
            'label' => 'Transmisión',
            'description' => 'MT, AT, CVT, eCVT, etc.',
            'refs' => 'vehicle_versions.transmission_type',
        ],
        'color-types' => [
            'model' => ColorType::class,
            'label' => 'Tipos de pintura',
            'description' => 'Sólido, Metalizado, Perlado, Mate.',
            'refs' => 'version_colors.type',
        ],
        'fuel-types' => [
            'model' => FuelType::class,
            'label' => 'Combustibles del motor',
            'description' => 'Gasolina, Diésel, GLP, GNC. Campo interno de la ficha de motor.',
            'refs' => 'version_engine.fuel_type',
        ],
    ];

    public function index()
    {
        $groups = collect(self::LOOKUPS)->map(function ($cfg, $key) {
            /** @var class-string<LookupItem> $class */
            $class = $cfg['model'];

            return [
                'key' => $key,
                'label' => $cfg['label'],
                'description' => $cfg['description'],
                'refs' => $cfg['refs'],
                'items' => $class::orderBy('display_order')->orderBy('name_es')->get(),
            ];
        })->values();

        return Inertia::render('admin/lookups/index', [
            'groups' => $groups,
        ]);
    }

    public function store(Request $request, string $type)
    {
        $cfg = $this->resolveLookup($type);
        $data = $this->validated($request, $cfg['model']);

        if (empty($data['code'])) {
            $data['code'] = Str::slug($data['name_es'], '_');
        }

        $cfg['model']::create($data);

        return back()->with('success', 'Elemento creado.');
    }

    public function update(Request $request, string $type, int $id)
    {
        $cfg = $this->resolveLookup($type);
        $item = $cfg['model']::findOrFail($id);
        $data = $this->validated($request, $cfg['model'], $id);

        $item->update($data);

        return back()->with('success', 'Elemento actualizado.');
    }

    public function destroy(string $type, int $id)
    {
        $cfg = $this->resolveLookup($type);
        $item = $cfg['model']::findOrFail($id);
        $item->delete();

        return back()->with('success', 'Elemento eliminado.');
    }

    private function resolveLookup(string $type): array
    {
        abort_unless(array_key_exists($type, self::LOOKUPS), 404, 'Lookup desconocido.');

        return self::LOOKUPS[$type];
    }

    /**
     * @param  class-string<LookupItem>  $class
     */
    private function validated(Request $request, string $class, ?int $ignoreId = null): array
    {
        $table = (new $class)->getTable();
        $uniqueRule = "unique:{$table},code".($ignoreId ? ",{$ignoreId}" : '');

        return $request->validate([
            'code' => ['nullable', 'string', 'max:100', $uniqueRule],
            'name_es' => ['required', 'string', 'max:255'],
            'name_en' => ['nullable', 'string', 'max:255'],
            'display_order' => ['integer'],
            'is_active' => ['boolean'],
        ]);
    }
}
