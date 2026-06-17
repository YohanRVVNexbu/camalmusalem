<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Concerns\TieneSeguimiento;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CotizacionRepuesto extends Model
{
    use TieneSeguimiento;

    protected $table = 'cotizaciones_repuestos';

    protected $fillable = [
        'estado',
        'nota_seguimiento',
        'repuesto_id',
        'repuesto_nombre',
        'repuesto_precio',
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

    public function repuesto(): BelongsTo
    {
        return $this->belongsTo(Repuesto::class);
    }
}
