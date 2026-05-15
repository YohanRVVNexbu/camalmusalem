<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class VehicleModel extends Model
{
    use HasFactory;

    protected $fillable = [
        'brand_id', 'name', 'slug', 'body_type', 'segment',
        'generation', 'description', 'hero_image', 'datasheet_url', 'detail_content',
        'is_active', 'display_order',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'detail_content' => 'array',
    ];

    public function brand(): BelongsTo
    {
        return $this->belongsTo(Brand::class);
    }

    public function versions(): HasMany
    {
        return $this->hasMany(VehicleVersion::class);
    }
}
