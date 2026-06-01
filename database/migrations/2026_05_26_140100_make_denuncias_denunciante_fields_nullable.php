<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Los campos personales del denunciante (`nombre`, `email`, `telefono`,
 * `rut`) quedaron NOT NULL heredados de `prevencion_delitos`, pero ahora
 * el modelo unificado permite denuncias anónimas (modalidad='anonima')
 * que justamente NO guardan estos datos. Los hacemos nullable para no
 * romper el flujo anónimo.
 */
return new class extends Migration {
    public function up(): void
    {
        Schema::table('denuncias', function (Blueprint $t) {
            $t->string('nombre')->nullable()->change();
            $t->string('email')->nullable()->change();
            $t->string('telefono', 50)->nullable()->change();
            $t->string('rut', 20)->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('denuncias', function (Blueprint $t) {
            $t->string('nombre')->nullable(false)->change();
            $t->string('email')->nullable(false)->change();
        });
    }
};
