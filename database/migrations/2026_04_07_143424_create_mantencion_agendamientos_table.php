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
        Schema::create('mantencion_agendamientos', function (Blueprint $table) {
            $table->id();
            $table->string('servicio');
            $table->string('taller');
            $table->date('fecha');
            $table->string('hora');
            $table->string('modelo');
            $table->string('anio');
            $table->string('patente');
            $table->text('comentario')->nullable();
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
        Schema::dropIfExists('mantencion_agendamientos');
    }
};
