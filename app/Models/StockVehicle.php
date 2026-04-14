<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class StockVehicle extends Model
{
    use SoftDeletes;

    protected $guarded = ['id'];

    protected $casts = [
        'specs_snapshot' => 'array',
        'features_snapshot' => 'array',
        'gallery' => 'array',
        'arrival_date' => 'date',
        'sold_date' => 'date',
        'list_price_clp' => 'integer',
        'sale_price_clp' => 'integer',
        'iva_rate' => 'decimal:2',
    ];

    public function version(): BelongsTo
    {
        return $this->belongsTo(VehicleVersion::class, 'vehicle_version_id');
    }

    /**
     * Snapshot current catalog data onto this stock vehicle — call before save
     * to freeze brand/model/version/specs/features at time of listing.
     */
    public function captureSnapshotFromVersion(VehicleVersion $version): void
    {
        $version->loadMissing(['model.brand', 'engine', 'electric', 'dimensions', 'capacities', 'performance', 'chassis', 'features']);

        $this->vehicle_version_id = $version->id;
        $this->brand_name_snapshot = $version->model->brand->name;
        $this->model_name_snapshot = $version->model->name;
        $this->version_name_snapshot = $version->trim_name;
        $this->powertrain_snapshot = $version->powertrain_type;
        $this->transmission_snapshot = $version->transmission_type;
        $this->drivetrain_snapshot = $version->drivetrain;

        $this->specs_snapshot = [
            'engine' => $version->engine?->toArray(),
            'electric' => $version->electric?->toArray(),
            'dimensions' => $version->dimensions?->toArray(),
            'capacities' => $version->capacities?->toArray(),
            'performance' => $version->performance?->toArray(),
            'chassis' => $version->chassis?->toArray(),
        ];

        $this->features_snapshot = $version->features->map(fn ($f) => [
            'code' => $f->code,
            'name' => $f->name_es,
            'category' => $f->category,
            'value_bool' => $f->pivot->value_bool,
            'value_int' => $f->pivot->value_int,
            'value_text' => $f->pivot->value_text,
        ])->all();
    }
}
