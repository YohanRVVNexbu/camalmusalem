<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cotizaciones_vehiculos', function (Blueprint $table) {
            $table->id();
            // 'nuevo' apunta a vehicle_models, 'seminuevo' apunta a seminuevos
            $table->enum('tipo', ['nuevo', 'seminuevo']);
            $table->unsignedBigInteger('vehicle_id'); // id del modelo (nuevos) o del seminuevo
            $table->string('vehicle_nombre'); // snapshot del nombre al momento de cotizar
            $table->string('vehicle_precio')->nullable(); // snapshot del precio
            $table->string('nombre');
            $table->string('email');
            $table->string('telefono');
            $table->text('comentarios')->nullable();
            $table->boolean('leido')->default(false);
            $table->timestamps();

            $table->index(['tipo', 'vehicle_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cotizaciones_vehiculos');
    }
};
