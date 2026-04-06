<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Noticia extends Model
{
    protected $fillable = [
        'title', 'slug', 'excerpt', 'content',
        'image', 'published_at', 'is_visible', 'order',
    ];

    protected $casts = [
        'published_at' => 'datetime',
        'is_visible'   => 'boolean',
    ];
}
