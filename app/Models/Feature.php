<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Feature extends Model
{
    protected $fillable = [
        'code', 'name_es', 'name_en', 'category',
        'data_type', 'unit', 'description', 'is_active', 'display_order',
    ];

    protected $casts = ['is_active' => 'boolean'];

    public function versions(): BelongsToMany
    {
        return $this->belongsToMany(VehicleVersion::class, 'version_features')
            ->withPivot(['value_bool', 'value_int', 'value_text', 'note'])
            ->withTimestamps();
    }
}
