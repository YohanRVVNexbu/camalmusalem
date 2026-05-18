<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CotizacionVehiculo extends Model
{
    protected $table = 'cotizaciones_vehiculos';

    protected $fillable = [
        'tipo',
        'vehicle_id',
        'branch_id',
        'version_id',
        'vehicle_nombre',
        'vehicle_precio',
        'nombre',
        'email',
        'telefono',
        'rut',
        'comentarios',
        'leido',
        'sync_status',
        'synced_at',
        'salesforce_opportunity_id',
        'salesforce_quote_id',
        'salesforce_response',
        'sync_last_error',
        'sync_attempts',
    ];

    protected $casts = [
        'leido' => 'boolean',
        'synced_at' => 'datetime',
        'salesforce_response' => 'array',
        'sync_attempts' => 'integer',
    ];

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    public function version(): BelongsTo
    {
        return $this->belongsTo(VehicleVersion::class, 'version_id');
    }
}
