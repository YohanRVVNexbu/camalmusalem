<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

/**
 * Unifica las denuncias de Ley 20.393 (Prevención del Delito) y Ley 21.643
 * (Ley Karin) en una sola tabla `denuncias`.
 *
 * Diseño:
 *  - Una columna `tipo` distingue 'ley_20393' | 'ley_karin'.
 *  - Una columna `modalidad` registra si la denuncia es identificada, con
 *    reserva de identidad, o anónima (lo exige la Ley Karin; lo permite
 *    la Ley 20.393).
 *  - Un `tracking_code` único de 12 chars permite al denunciante consultar
 *    el estado sin volver a identificarse (mismo patrón que la Dirección
 *    del Trabajo).
 *  - `payload` JSON guarda campos específicos del tipo (catálogo de
 *    delitos para 20.393, tipo de acoso para Karin, etc.) sin forzar
 *    migraciones cada vez que la abogada ajusta un campo.
 *  - `denuncia_adjuntos` almacena los archivos adjuntos. Los paths
 *    apuntan al disco `local` (storage/app/private/denuncias/…), NUNCA al
 *    disco público — el contenido es sensible y solo se descarga desde
 *    admin con autenticación.
 *
 * Las denuncias de Ley 20.393 que ya estaban en `prevencion_delitos` se
 * preservan: se les setea tipo=ley_20393, modalidad=identificada y se
 * genera un tracking_code retroactivo.
 */
return new class extends Migration {
    public function up(): void
    {
        // 1) Renombrar la tabla existente
        if (Schema::hasTable('prevencion_delitos') && ! Schema::hasTable('denuncias')) {
            Schema::rename('prevencion_delitos', 'denuncias');
        }

        // 2) Agregar columnas nuevas si no existen
        Schema::table('denuncias', function (Blueprint $t) {
            if (! Schema::hasColumn('denuncias', 'tipo')) {
                $t->string('tipo', 30)->default('ley_20393')->after('id')->index();
            }
            if (! Schema::hasColumn('denuncias', 'modalidad')) {
                $t->string('modalidad', 20)->default('identificada')->after('tipo');
            }
            if (! Schema::hasColumn('denuncias', 'tracking_code')) {
                $t->string('tracking_code', 12)->nullable()->after('modalidad');
            }
            if (! Schema::hasColumn('denuncias', 'categoria')) {
                $t->string('categoria')->nullable()->after('asunto');
            }
            if (! Schema::hasColumn('denuncias', 'denunciado_nombre')) {
                $t->string('denunciado_nombre')->nullable();
            }
            if (! Schema::hasColumn('denuncias', 'denunciado_cargo')) {
                $t->string('denunciado_cargo')->nullable();
            }
            if (! Schema::hasColumn('denuncias', 'denunciado_sucursal')) {
                $t->string('denunciado_sucursal')->nullable();
            }
            if (! Schema::hasColumn('denuncias', 'hechos_fecha')) {
                $t->date('hechos_fecha')->nullable();
            }
            if (! Schema::hasColumn('denuncias', 'hechos_lugar')) {
                $t->string('hechos_lugar')->nullable();
            }
            if (! Schema::hasColumn('denuncias', 'hechos_testigos')) {
                $t->text('hechos_testigos')->nullable();
            }
            if (! Schema::hasColumn('denuncias', 'declaracion_veracidad')) {
                $t->boolean('declaracion_veracidad')->default(false);
            }
            if (! Schema::hasColumn('denuncias', 'payload')) {
                $t->json('payload')->nullable();
            }
            if (! Schema::hasColumn('denuncias', 'estado')) {
                $t->string('estado', 30)->default('recibida')->index();
            }
        });

        // 3) Renombrar `mensaje` → `hechos_descripcion` (sin perder datos)
        if (Schema::hasColumn('denuncias', 'mensaje') && ! Schema::hasColumn('denuncias', 'hechos_descripcion')) {
            Schema::table('denuncias', function (Blueprint $t) {
                $t->renameColumn('mensaje', 'hechos_descripcion');
            });
        }

        // 4) Backfill tracking_code para registros existentes (sin código)
        DB::table('denuncias')->whereNull('tracking_code')->orderBy('id')->each(function ($row) {
            DB::table('denuncias')->where('id', $row->id)->update([
                'tracking_code' => self::generateUniqueTrackingCode(),
            ]);
        });

        // 5) Forzar unique + NOT NULL en tracking_code después del backfill
        Schema::table('denuncias', function (Blueprint $t) {
            $t->string('tracking_code', 12)->nullable(false)->change();
            $t->unique('tracking_code');
        });

        // 6) Tabla de adjuntos (separada porque puede haber varios por denuncia)
        if (! Schema::hasTable('denuncia_adjuntos')) {
            Schema::create('denuncia_adjuntos', function (Blueprint $t) {
                $t->id();
                $t->foreignId('denuncia_id')->constrained('denuncias')->cascadeOnDelete();
                $t->string('path');                  // ruta relativa al disco `local`
                $t->string('original_name');         // nombre original mostrado al admin
                $t->string('mime_type', 100)->nullable();
                $t->unsignedInteger('size_bytes')->default(0);
                $t->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('denuncia_adjuntos');

        // Revertir cambios estructurales en denuncias (mejor esfuerzo).
        if (Schema::hasTable('denuncias')) {
            Schema::table('denuncias', function (Blueprint $t) {
                foreach ([
                    'tipo', 'modalidad', 'tracking_code', 'categoria',
                    'denunciado_nombre', 'denunciado_cargo', 'denunciado_sucursal',
                    'hechos_fecha', 'hechos_lugar', 'hechos_testigos',
                    'declaracion_veracidad', 'payload', 'estado',
                ] as $col) {
                    if (Schema::hasColumn('denuncias', $col)) {
                        $t->dropColumn($col);
                    }
                }
            });

            if (Schema::hasColumn('denuncias', 'hechos_descripcion') && ! Schema::hasColumn('denuncias', 'mensaje')) {
                Schema::table('denuncias', function (Blueprint $t) {
                    $t->renameColumn('hechos_descripcion', 'mensaje');
                });
            }

            if (! Schema::hasTable('prevencion_delitos')) {
                Schema::rename('denuncias', 'prevencion_delitos');
            }
        }
    }

    /**
     * Genera un código de 12 caracteres alfanuméricos en MAYÚSCULAS, único
     * en la tabla denuncias. Se usa solo para backfill — en el modelo se
     * llama a Denuncia::generateTrackingCode() que tiene la misma lógica.
     */
    private static function generateUniqueTrackingCode(): string
    {
        do {
            $code = strtoupper(Str::random(12));
            // Excluir caracteres ambiguos (0/O, 1/I/L) para que el usuario
            // pueda transcribirlo sin errores.
            $code = strtr($code, ['0' => 'A', 'O' => 'B', '1' => 'C', 'I' => 'D', 'L' => 'E']);
            $exists = DB::table('denuncias')->where('tracking_code', $code)->exists();
        } while ($exists);

        return $code;
    }
};
