<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Repuesto extends Model
{
    protected $fillable = [
        'name', 'sku', 'description', 'price', 'price_offer', 'compatible_with',
        'category', 'images', 'stock_la_serena', 'stock_ovalle', 'is_visible', 'order',
    ];

    protected $casts = [
        'images'           => 'array',
        'stock_la_serena'  => 'boolean',
        'stock_ovalle'     => 'boolean',
        'is_visible'       => 'boolean',
    ];
}
