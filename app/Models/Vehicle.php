<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Vehicle extends Model
{
    protected $fillable = [
        'name', 'slug', 'full_name', 'subtitle', 'type', 'fuel',
        'hero_image', 'gallery', 'versions', 'highlights',
        'is_visible', 'order',
    ];

    protected $casts = [
        'gallery'    => 'array',
        'versions'   => 'array',
        'highlights' => 'array',
        'is_visible' => 'boolean',
    ];
}
