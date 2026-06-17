<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Concerns\TieneSeguimiento;

class Contacto extends Model
{
    use TieneSeguimiento;

    protected $fillable = [
        'estado',
        'nota_seguimiento',
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
