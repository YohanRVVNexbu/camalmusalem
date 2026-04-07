<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class KintoSolicitud extends Model
{
    protected $table = 'kinto_solicitudes';

    protected $fillable = [
        'sucursal', 'fecha', 'duracion', 'duracion_tipo',
        'vehiculo', 'nombre', 'rut', 'telefono', 'correo', 'leido',
    ];

    protected $casts = ['leido' => 'boolean'];
}
