<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Seminuevo extends Model
{
    protected $fillable = [
        'brand', 'model', 'vu_code', 'slug', 'year', 'km', 'price', 'down_payment',
        'fuel', 'transmission', 'traction', 'doors', 'seats',
        'color', 'description', 'gallery', 'featured_gallery', 'specs',
        'is_visible', 'order', 'branch_id',
    ];

    protected $casts = [
        'gallery'          => 'array',
        'featured_gallery' => 'array',
        'specs'            => 'array',
        'is_visible'       => 'boolean',
        'year'             => 'integer',
        'km'               => 'integer',
        'doors'            => 'integer',
        'seats'            => 'integer',
    ];

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }
}
