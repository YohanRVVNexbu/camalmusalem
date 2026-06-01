<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * `denuncias.asunto` quedó como NOT NULL heredado de la tabla original
 * `prevencion_delitos`, pero el formulario unificado (que ahora usa
 * `categoria` para clasificar la denuncia) no lo pide al usuario. Lo
 * dejamos nullable para que las denuncias del nuevo flujo se persistan
 * sin error.
 */
return new class extends Migration {
    public function up(): void
    {
        Schema::table('denuncias', function (Blueprint $t) {
            $t->string('asunto')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('denuncias', function (Blueprint $t) {
            $t->string('asunto')->nullable(false)->change();
        });
    }
};
