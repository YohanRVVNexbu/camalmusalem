<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Accesorio extends Model
{
    protected $fillable = [
        'sku', 'name', 'description', 'price', 'price_offer', 'compatible_with',
        'category', 'images', 'is_visible', 'order',
    ];

    protected $casts = [
        'images'     => 'array',
        'is_visible' => 'boolean',
    ];
}
