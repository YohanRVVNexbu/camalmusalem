<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Base para las tablas lookup simples (feature_categories, body_types, etc.).
 * Todas comparten la misma shape: code, name_es, display_order, is_active.
 */
abstract class LookupItem extends Model
{
    protected $guarded = ['id'];

    protected $casts = [
        'is_active' => 'boolean',
        'display_order' => 'integer',
    ];
}
