<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Branch extends Model
{
    protected $fillable = [
        'name', 'slug', 'address', 'city', 'maps_url',
        'phone', 'is_active', 'display_order',
    ];

    protected $casts = ['is_active' => 'boolean'];

    public function seminuevos(): HasMany
    {
        return $this->hasMany(Seminuevo::class);
    }
}
