<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class VehicleVersion extends Model
{
    use HasFactory;

    protected $fillable = [
        'vehicle_model_id', 'trim_name', 'slug', 'model_year',
        'powertrain_type', 'drivetrain', 'transmission_type', 'transmission_speeds',
        'msrp_clp', 'bono_marca', 'bono_financiamiento_r9', 'bono_financiamiento_tradicional',
        'sales_code', 'material_code', 'option_code', 'description', 'hero_image',
        'multimedia', 'is_active', 'display_order',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'model_year' => 'integer',
        'multimedia' => 'array',
    ];

    public function model(): BelongsTo
    {
        return $this->belongsTo(VehicleModel::class, 'vehicle_model_id');
    }

    public function engine(): HasOne
    {
        return $this->hasOne(VersionEngine::class);
    }

    public function electric(): HasOne
    {
        return $this->hasOne(VersionElectric::class);
    }

    public function dimensions(): HasOne
    {
        return $this->hasOne(VersionDimensions::class);
    }

    public function capacities(): HasOne
    {
        return $this->hasOne(VersionCapacities::class);
    }

    public function performance(): HasOne
    {
        return $this->hasOne(VersionPerformance::class);
    }

    public function chassis(): HasOne
    {
        return $this->hasOne(VersionChassis::class);
    }

    public function features(): BelongsToMany
    {
        return $this->belongsToMany(Feature::class, 'version_features')
            ->withPivot(['value_bool', 'value_int', 'value_text', 'note'])
            ->withTimestamps();
    }

    public function colors(): HasMany
    {
        return $this->hasMany(VersionColor::class);
    }

    public function documents(): HasMany
    {
        return $this->hasMany(VehicleDocument::class);
    }

    public function branches(): BelongsToMany
    {
        return $this->belongsToMany(Branch::class, 'vehicle_version_branches')
            ->withTimestamps();
    }
}
