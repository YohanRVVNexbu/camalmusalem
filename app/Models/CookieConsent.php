<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CookieConsent extends Model
{
    protected $fillable = [
        'consent_uuid',
        'action',
        'categories',
        'policy_version',
        'ip_hash',
        'user_agent',
        'url',
    ];

    protected $casts = [
        'categories' => 'array',
    ];
}
