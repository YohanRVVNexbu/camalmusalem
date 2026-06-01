<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CotizacionMerch extends Model
{
    protected $table = 'cotizaciones_merch';

    protected $fillable = [
        'merch_id',
        'merch_nombre',
        'merch_precio',
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

    public function merch(): BelongsTo
    {
        return $this->belongsTo(Merch::class);
    }
}
