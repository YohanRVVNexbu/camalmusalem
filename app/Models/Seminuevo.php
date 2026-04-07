<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Seminuevo extends Model
{
    protected $fillable = [
        'brand', 'model', 'slug', 'year', 'km', 'price', 'down_payment',
        'fuel', 'transmission', 'traction', 'doors', 'seats',
        'color', 'description', 'gallery', 'featured_gallery', 'specs',
        'is_visible', 'order',
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
}
