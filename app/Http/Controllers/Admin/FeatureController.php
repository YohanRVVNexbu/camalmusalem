<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Feature;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class FeatureController extends Controller
{
    public function index()
    {
        $features = Feature::orderBy('category')
            ->orderBy('display_order')
            ->orderBy('name_es')
            ->get();

        return Inertia::render('admin/features/index', [
            'features' => $features,
            'categories' => self::CATEGORIES,
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/features/form', [
            'feature' => null,
            'categories' => self::CATEGORIES,
        ]);
    }

    public function store(Request $request)
    {
        $data = $this->validated($request);
        if (empty($data['code'])) {
            $data['code'] = Str::slug($data['name_es'], '_');
        }

        Feature::create($data);

        return redirect('/admin/features')->with('success', 'Equipamiento creado correctamente.');
    }

    public function edit(Feature $feature)
    {
        return Inertia::render('admin/features/form', [
            'feature' => $feature,
            'categories' => self::CATEGORIES,
        ]);
    }

    public function update(Request $request, Feature $feature)
    {
        $data = $this->validated($request);
        $feature->update($data);

        return back()->with('success', 'Equipamiento actualizado correctamente.');
    }

    public function destroy(Feature $feature)
    {
        $feature->delete();

        return redirect('/admin/features')->with('success', 'Equipamiento eliminado.');
    }

    private function validated(Request $request): array
    {
        return $request->validate([
            'code' => ['nullable', 'string', 'max:100', "unique:features,code,{$request->route('feature')?->id}"],
            'name_es' => ['required', 'string', 'max:255'],
            'name_en' => ['nullable', 'string', 'max:255'],
            'category' => ['required', 'string', 'in:'.implode(',', array_keys(self::CATEGORIES))],
            'data_type' => ['required', 'string', 'in:boolean,int,string'],
            'unit' => ['nullable', 'string', 'max:50'],
            'description' => ['nullable', 'string'],
            'is_active' => ['boolean'],
            'display_order' => ['integer'],
        ]);
    }

    private const CATEGORIES = [
        'safety' => 'Seguridad',
        'tss' => 'Toyota Safety Sense',
        'comfort' => 'Confort',
        'infotainment' => 'Infoentretenimiento',
        'interior' => 'Interior',
        'exterior' => 'Exterior',
        'offroad' => 'Off-road',
        'performance' => 'Rendimiento',
        'other' => 'Otros',
    ];
}
