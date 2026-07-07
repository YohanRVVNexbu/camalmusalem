<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class IgnoredPriceListMaterial extends Model
{
    protected $fillable = [
        'material_code',
        'linea',
        'version_name',
    ];
}
