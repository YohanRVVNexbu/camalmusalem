<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    protected $fillable = ['name', 'slug', 'is_active', 'display_order'];

    protected $casts = [
        'is_active' => 'boolean',
    ];
}
