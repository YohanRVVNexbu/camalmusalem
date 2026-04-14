<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VersionElectric extends Model
{
    protected $table = 'version_electric';

    protected $guarded = ['id'];

    public function version(): BelongsTo
    {
        return $this->belongsTo(VehicleVersion::class, 'vehicle_version_id');
    }
}
