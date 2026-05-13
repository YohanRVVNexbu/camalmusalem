<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Rental extends Model
{
    use HasFactory;

    protected $fillable = [
        'vehicle_model_id', 'name', 'slug', 'card_image', 'description',
        'price_hour', 'price_day', 'price_week', 'price_month',
        'is_active', 'display_order',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function vehicleModel(): BelongsTo
    {
        return $this->belongsTo(VehicleModel::class);
    }

    public function branches(): BelongsToMany
    {
        return $this->belongsToMany(Branch::class);
    }

    // Display accessors — fall back to vehicle_model fields when override is empty.

    public function getDisplayNameAttribute(): ?string
    {
        return $this->name ?: $this->vehicleModel?->name;
    }

    public function getDisplayImageAttribute(): ?string
    {
        return $this->card_image ?: $this->vehicleModel?->hero_image;
    }

    public function getDisplayDescriptionAttribute(): ?string
    {
        return $this->description ?: $this->vehicleModel?->description;
    }
}
