<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Seminuevo extends Model
{
    protected $fillable = [
        'brand', 'model', 'year', 'km', 'price',
        'fuel', 'transmission', 'traction', 'doors', 'seats',
        'color', 'description', 'gallery', 'is_visible', 'order',
    ];

    protected $casts = [
        'gallery'    => 'array',
        'is_visible' => 'boolean',
        'year'       => 'integer',
        'km'         => 'integer',
        'doors'      => 'integer',
        'seats'      => 'integer',
    ];
}
