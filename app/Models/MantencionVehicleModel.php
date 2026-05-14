<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MantencionVehicleModel extends Model
{
    protected $fillable = ['name', 'is_active', 'display_order'];

    protected $casts = [
        'is_active' => 'boolean',
    ];
}
