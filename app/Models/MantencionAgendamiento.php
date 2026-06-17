<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Concerns\TieneSeguimiento;

class MantencionAgendamiento extends Model
{
    use TieneSeguimiento;

    protected $fillable = [
        'estado',
        'nota_seguimiento',
        'servicio', 'taller', 'fecha', 'hora',
        'modelo', 'anio', 'patente', 'comentario',
        'nombre', 'rut', 'telefono', 'correo', 'leido',
    ];

    protected $casts = ['leido' => 'boolean'];
}
