<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PrevencionDelito extends Model
{
    protected $table = 'prevencion_delitos';

    protected $fillable = [
        'nombre',
        'asunto',
        'email',
        'telefono',
        'rut',
        'mensaje',
        'leido',
    ];

    protected $casts = [
        'leido' => 'boolean',
    ];
}
