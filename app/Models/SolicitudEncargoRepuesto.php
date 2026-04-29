<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SolicitudEncargoRepuesto extends Model
{
    protected $table = 'solicitudes_encargo_repuestos';

    protected $fillable = [
        'nombre',
        'email',
        'telefono',
        'sucursal',
        'modelo',
        'marca',
        'vin',
        'lista_repuestos',
        'leido',
    ];

    protected $casts = [
        'leido' => 'boolean',
    ];
}
