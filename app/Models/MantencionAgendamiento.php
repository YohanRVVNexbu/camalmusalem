<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MantencionAgendamiento extends Model
{
    protected $fillable = [
        'servicio', 'taller', 'fecha', 'hora',
        'modelo', 'anio', 'patente', 'comentario',
        'nombre', 'rut', 'telefono', 'correo', 'leido',
    ];

    protected $casts = ['leido' => 'boolean'];
}
