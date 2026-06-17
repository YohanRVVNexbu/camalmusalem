<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Concerns\TieneSeguimiento;

class SolicitudEncargoRepuesto extends Model
{
    use TieneSeguimiento;

    protected $table = 'solicitudes_encargo_repuestos';

    protected $fillable = [
        'estado',
        'nota_seguimiento',
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
