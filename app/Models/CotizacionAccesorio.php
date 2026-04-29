<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CotizacionAccesorio extends Model
{
    protected $table = 'cotizaciones_accesorios';

    protected $fillable = [
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
