<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SiteSection extends Model
{
    protected $fillable = ['section', 'data', 'is_visible', 'order'];

    protected $casts = [
        'data' => 'array',
        'is_visible' => 'boolean',
    ];

    public static function getSection(string $section): ?self
    {
        return static::where('section', $section)->first();
    }

    public static function getVisibleSections(): array
    {
        return static::where('is_visible', true)
            ->orderBy('order')
            ->get()
            ->pluck('data', 'section')
            ->toArray();
    }

    public static function getAllForAdmin(): array
    {
        return static::orderBy('order')
            ->get()
            ->map(fn ($s) => [
                'id' => $s->id,
                'section' => $s->section,
                'data' => $s->data,
                'is_visible' => $s->is_visible,
                'order' => $s->order,
            ])
            ->keyBy('section')
            ->toArray();
    }
}
