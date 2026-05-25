<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Archivo adjunto a una denuncia. El `path` apunta al disco `local`
 * (storage/app/private/denuncias/…), NUNCA al disco público — el contenido
 * es sensible y solo se sirve desde el admin autenticado vía un endpoint
 * que valida la sesión y registra el acceso.
 */
class DenunciaAdjunto extends Model
{
    protected $table = 'denuncia_adjuntos';

    protected $fillable = [
        'denuncia_id',
        'path',
        'original_name',
        'mime_type',
        'size_bytes',
    ];

    public function denuncia(): BelongsTo
    {
        return $this->belongsTo(Denuncia::class);
    }
}
