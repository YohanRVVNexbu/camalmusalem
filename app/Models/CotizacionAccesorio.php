<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Concerns\TieneSeguimiento;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CotizacionAccesorio extends Model
{
    use TieneSeguimiento;

    protected $table = 'cotizaciones_accesorios';

    protected $fillable = [
        'estado',
        'nota_seguimiento',
        'accesorio_id',
        'accesorio_nombre',
        'accesorio_precio',
        'nombre',
        'email',
        'telefono',
        'sucursal',
        'comentarios',
        'leido',
    ];

    protected $casts = [
        'leido' => 'boolean',
    ];

    public function accesorio(): BelongsTo
    {
        return $this->belongsTo(Accesorio::class);
    }
}
