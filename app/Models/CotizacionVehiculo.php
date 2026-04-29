<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CotizacionVehiculo extends Model
{
    protected $table = 'cotizaciones_vehiculos';

    protected $fillable = [
        'tipo',
        'vehicle_id',
        'vehicle_nombre',
        'vehicle_precio',
        'nombre',
        'email',
        'telefono',
        'comentarios',
        'leido',
    ];

    protected $casts = [
        'leido' => 'boolean',
    ];
}
