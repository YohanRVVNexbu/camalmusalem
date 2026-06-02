<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Branch;
use App\Models\Rental;
use App\Models\VehicleModel;
use App\Services\SiteSettingsService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class RentalController extends Controller
{
    public function __construct(private SiteSettingsService $settings) {}

    public function index()
    {
        $rentals = Rental::with(['vehicleModel.brand', 'branches'])
            ->orderBy('display_order')
            ->orderBy('id', 'desc')
            ->get()
            ->map(fn (Rental $r) => [
                'id' => $r->id,
                'name' => $r->display_name,
                'vehicle_model' => $r->vehicleModel
                    ? ($r->vehicleModel->brand?->name.' '.$r->vehicleModel->name)
                    : null,
                'card_image' => $r->display_image,
                'price_day' => $r->price_day,
                'branches' => $r->branches->pluck('name')->all(),
                'is_active' => $r->is_active,
                'display_order' => $r->display_order,
            ]);

        return Inertia::render('admin/rentals/index', [
            'rentals' => $rentals,
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/rentals/form', [
            'rental' => null,
            'vehicle_models' => $this->vehicleModelsForPicker(),
            'branches' => $this->branchesForPicker(),
        ]);
    }

    public function store(Request $request)
    {
        $data = $this->validated($request);
        $data['slug'] = $this->uniqueSlug($data['name'] ?? 'arriendo');

        $rental = Rental::create($data);

        if ($request->filled('card_image_url')) {
            $rental->update(['card_image' => $request->input('card_image_url')]);
        } elseif ($request->hasFile('card_image')) {
            $rental->update([
                'card_image' => $this->settings->uploadFile($request->file('card_image'), 'rentals/'.$rental->id),
            ]);
        }

        $rental->branches()->sync($request->input('branch_ids', []));

        return redirect('/admin/rentals')->with('success', 'Arriendo creado correctamente.');
    }

    public function edit(Rental $rental)
    {
        $rental->load(['branches']);

        return Inertia::render('admin/rentals/form', [
            'rental' => [
                'id' => $rental->id,
                'vehicle_model_id' => $rental->vehicle_model_id,
                'name' => $rental->name,
                'description' => $rental->description,
                'card_image' => $rental->card_image,
                'price_hour' => $rental->price_hour,
                'price_day' => $rental->price_day,
                'price_week' => $rental->price_week,
                'price_month' => $rental->price_month,
                'is_active' => $rental->is_active,
                'display_order' => $rental->display_order,
                'branch_ids' => $rental->branches->pluck('id')->all(),
            ],
            'vehicle_models' => $this->vehicleModelsForPicker(),
            'branches' => $this->branchesForPicker(),
        ]);
    }

    public function update(Request $request, Rental $rental)
    {
        $data = $this->validated($request);
        if (! empty($data['name'])) {
            $data['slug'] = $this->uniqueSlug($data['name'], $rental->id);
        }

        if ($request->has('card_image_url')) {
            $data['card_image'] = $request->input('card_image_url') ?: null;
        } elseif ($request->hasFile('card_image')) {
            $this->settings->deleteOldFile($rental->card_image);
            $data['card_image'] = $this->settings->uploadFile($request->file('card_image'), 'rentals/'.$rental->id);
        } elseif ($request->boolean('card_image_remove')) {
            $this->settings->deleteOldFile($rental->card_image);
            $data['card_image'] = null;
        }

        $rental->update($data);
        $rental->branches()->sync($request->input('branch_ids', []));

        return back()->with('success', 'Arriendo actualizado correctamente.');
    }

    public function destroy(Rental $rental)
    {
        $this->settings->deleteOldFile($rental->card_image);
        $rental->delete();

        return redirect('/admin/rentals')->with('success', 'Arriendo eliminado.');
    }

    private function validated(Request $request): array
    {
        return $request->validate([
            'vehicle_model_id' => ['nullable', 'exists:vehicle_models,id'],
            'name' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'price_hour' => ['nullable', 'string', 'max:100'],
            'price_day' => ['nullable', 'string', 'max:100'],
            'price_week' => ['nullable', 'string', 'max:100'],
            'price_month' => ['nullable', 'string', 'max:100'],
            'is_active' => ['boolean'],
            'display_order' => ['integer'],
            'branch_ids' => ['array'],
            'branch_ids.*' => ['exists:branches,id'],
        ]);
    }

    private function uniqueSlug(string $base, ?int $excludeId = null): string
    {
        $slug = Str::slug($base);
        $original = $slug;
        $i = 2;
        while (
            Rental::where('slug', $slug)
                ->when($excludeId, fn ($q) => $q->where('id', '!=', $excludeId))
                ->exists()
        ) {
            $slug = "{$original}-{$i}";
            $i++;
        }
        return $slug;
    }

    /**
     * Light-weight payload of vehicle models for the picker, with enough info
     * to auto-fill the rental form when the admin selects one.
     */
    private function vehicleModelsForPicker(): array
    {
        return VehicleModel::with('brand')
            ->where('is_active', true)
            ->orderBy('name')
            ->get()
            ->map(fn (VehicleModel $m) => [
                'id' => $m->id,
                'name' => $m->name,
                'brand_name' => $m->brand?->name,
                'description' => $m->description,
                'hero_image' => $m->hero_image,
            ])
            ->all();
    }

    private function branchesForPicker(): array
    {
        return Branch::where('is_active', true)
            ->orderBy('display_order')
            ->get(['id', 'name', 'city'])
            ->all();
    }
}
