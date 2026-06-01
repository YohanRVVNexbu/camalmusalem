<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Hasta ahora `vehicle_models.hero_image` se reutilizaba en tres
 * lugares con resultados distintos: card chico del listado, tarjetas
 * destacadas de la home y hero grande del detalle. El cliente nos
 * pidió poder diferenciar la foto del hero del detalle (que suele
 * querer ser más escenográfica y panorámica) del card del listado
 * (que necesita un formato más limpio y compacto).
 *
 * `detail_hero_image` solo aplica al hero grande de /nuevos/{slug}.
 * Si está NULL, el frontend cae al `hero_image` como fallback.
 */
return new class extends Migration {
    public function up(): void
    {
        Schema::table('vehicle_models', function (Blueprint $t) {
            $t->string('detail_hero_image')->nullable()->after('hero_image');
        });
    }

    public function down(): void
    {
        Schema::table('vehicle_models', function (Blueprint $t) {
            $t->dropColumn('detail_hero_image');
        });
    }
};
