<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Concerns\TieneSeguimiento;

class KintoSolicitud extends Model
{
    use TieneSeguimiento;

    protected $table = 'kinto_solicitudes';

    protected $fillable = [
        'estado',
        'nota_seguimiento',
        'sucursal', 'fecha', 'duracion', 'duracion_tipo',
        'vehiculo', 'nombre', 'rut', 'telefono', 'correo', 'leido',
    ];

    protected $casts = ['leido' => 'boolean'];
}
