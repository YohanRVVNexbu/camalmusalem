<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

/**
 * Una denuncia recibida por los canales de compliance: Ley 20.393
 * (Prevención del Delito) o Ley 21.643 (Ley Karin). La tabla está unificada
 * por las razones que documenta la migración `unify_denuncias_table`:
 * comparten la mayoría de campos y compartir bandeja en el admin es
 * deliberado — el Encargado de Prevención del Delito típicamente es el
 * mismo cargo en empresas de tamaño Musalem.
 *
 * Los campos específicos por ley (catálogo de delito, tipo de acoso, etc.)
 * viven en `payload` JSON para no migrar cada vez que la abogada ajusta
 * un campo.
 */
class Denuncia extends Model
{
    protected $table = 'denuncias';

    public const TIPO_LEY_20393 = 'ley_20393';
    public const TIPO_LEY_KARIN = 'ley_karin';

    public const MODALIDAD_IDENTIFICADA = 'identificada';
    public const MODALIDAD_RESERVA      = 'reserva';
    public const MODALIDAD_ANONIMA      = 'anonima';

    public const ESTADO_RECIBIDA         = 'recibida';
    public const ESTADO_EN_INVESTIGACION = 'en_investigacion';
    public const ESTADO_CERRADA          = 'cerrada';

    /**
     * Catálogo de delitos contemplados en la Ley 20.393 (actualizada por
     * Ley 21.595 de Delitos Económicos). El cliente / abogada puede
     * agregar entradas — los keys se guardan en `categoria` de la
     * denuncia.
     */
    public const CATEGORIAS_LEY_20393 = [
        'cohecho_funcionario'      => 'Cohecho a funcionario público',
        'cohecho_privados'         => 'Cohecho entre particulares',
        'lavado_activos'           => 'Lavado de activos',
        'financiamiento_terrorismo' => 'Financiamiento del terrorismo',
        'receptacion'              => 'Receptación',
        'negociacion_incompatible' => 'Negociación incompatible',
        'delitos_economicos'       => 'Delitos económicos (Ley 21.595)',
        'otro'                     => 'Otro / no estoy seguro',
    ];

    /**
     * Catálogo Ley Karin (Ley 21.643). Pendiente de validación final con
     * la abogada — estos son los tres tipos que la ley reconoce
     * explícitamente.
     */
    public const CATEGORIAS_LEY_KARIN = [
        'acoso_laboral'    => 'Acoso laboral',
        'acoso_sexual'     => 'Acoso sexual',
        'violencia_trabajo' => 'Violencia en el trabajo',
        'otro'             => 'Otro / no estoy seguro',
    ];

    protected $fillable = [
        'tipo',
        'modalidad',
        'tracking_code',
        'nombre',
        'asunto',
        'categoria',
        'email',
        'telefono',
        'rut',
        'hechos_descripcion',
        'hechos_fecha',
        'hechos_lugar',
        'hechos_testigos',
        'denunciado_nombre',
        'denunciado_cargo',
        'denunciado_sucursal',
        'declaracion_veracidad',
        'payload',
        'estado',
        'leido',
    ];

    protected $casts = [
        'leido' => 'boolean',
        'declaracion_veracidad' => 'boolean',
        'hechos_fecha' => 'date',
        'payload' => 'array',
    ];

    public function adjuntos(): HasMany
    {
        return $this->hasMany(DenunciaAdjunto::class);
    }

    public function scopeKarin($query)
    {
        return $query->where('tipo', self::TIPO_LEY_KARIN);
    }

    public function scopeLey20393($query)
    {
        return $query->where('tipo', self::TIPO_LEY_20393);
    }

    public function scopeDeTipo($query, ?string $tipo)
    {
        return $tipo ? $query->where('tipo', $tipo) : $query;
    }

    /**
     * Devuelve la etiqueta legible de la categoría según el tipo de denuncia.
     * Si la categoría no está en el catálogo (porque la abogada cambió el
     * listado y este registro es viejo) devuelve el key crudo para que el
     * admin igual pueda verlo.
     */
    public function categoriaLabel(): ?string
    {
        if (! $this->categoria) {
            return null;
        }
        $catalog = $this->tipo === self::TIPO_LEY_KARIN
            ? self::CATEGORIAS_LEY_KARIN
            : self::CATEGORIAS_LEY_20393;

        return $catalog[$this->categoria] ?? $this->categoria;
    }

    public function tipoLabel(): string
    {
        return match ($this->tipo) {
            self::TIPO_LEY_KARIN => 'Ley Karin',
            self::TIPO_LEY_20393 => 'Ley 20.393',
            default => $this->tipo,
        };
    }

    /**
     * Genera un código de 12 caracteres alfanuméricos en MAYÚSCULAS, único
     * en la tabla. Excluye caracteres ambiguos (0/O, 1/I/L) para que el
     * denunciante pueda transcribirlo sin confusiones. Si por alguna
     * razón se generan 50 códigos colisionados seguidos (imposible en la
     * práctica), tira excepción en vez de loopear infinito.
     */
    public static function generateTrackingCode(): string
    {
        for ($i = 0; $i < 50; $i++) {
            $code = strtoupper(Str::random(12));
            $code = strtr($code, ['0' => 'A', 'O' => 'B', '1' => 'C', 'I' => 'D', 'L' => 'E']);
            if (! self::where('tracking_code', $code)->exists()) {
                return $code;
            }
        }
        throw new \RuntimeException('No se pudo generar tracking_code único después de 50 intentos.');
    }
}
