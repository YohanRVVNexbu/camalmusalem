<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Concerns\TieneSeguimiento;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CotizacionMerch extends Model
{
    use TieneSeguimiento;

    protected $table = 'cotizaciones_merch';

    protected $fillable = [
        'estado',
        'nota_seguimiento',
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
