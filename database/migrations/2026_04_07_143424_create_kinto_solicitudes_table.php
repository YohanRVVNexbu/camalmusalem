<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('kinto_solicitudes', function (Blueprint $table) {
            $table->id();
            $table->string('sucursal');
            $table->string('fecha');
            $table->string('duracion');
            $table->string('duracion_tipo');
            $table->string('vehiculo');
            $table->string('nombre');
            $table->string('rut');
            $table->string('telefono');
            $table->string('correo');
            $table->boolean('leido')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kinto_solicitudes');
    }
};
