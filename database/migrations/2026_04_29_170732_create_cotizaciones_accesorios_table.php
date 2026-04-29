<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cotizaciones_accesorios', function (Blueprint $table) {
            $table->id();
            $table->foreignId('accesorio_id')->nullable()->constrained('accesorios')->nullOnDelete();
            $table->string('accesorio_nombre'); // snapshot
            $table->string('accesorio_precio')->nullable(); // snapshot
            $table->string('nombre');
            $table->string('email');
            $table->string('telefono');
            $table->string('sucursal');
            $table->text('comentarios')->nullable();
            $table->boolean('leido')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cotizaciones_accesorios');
    }
};
