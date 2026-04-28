<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Merch extends Model
{
    protected $table = 'merch';

    protected $fillable = [
        'sku', 'name', 'description', 'description_tech',
        'category', 'subcategory', 'size', 'price', 'price_offer',
        'status', 'branch', 'images', 'is_visible', 'order',
    ];

    protected $casts = [
        'images'     => 'array',
        'is_visible' => 'boolean',
    ];
}
