<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Accesorio extends Model
{
    protected $fillable = [
        'name', 'description', 'price', 'category',
        'images', 'is_visible', 'order',
    ];

    protected $casts = [
        'images'     => 'array',
        'is_visible' => 'boolean',
    ];
}
