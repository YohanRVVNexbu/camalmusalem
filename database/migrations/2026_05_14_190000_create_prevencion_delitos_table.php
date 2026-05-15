<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('prevencion_delitos', function (Blueprint $t) {
            $t->id();
            $t->string('nombre');
            $t->string('asunto');
            $t->string('email');
            $t->string('telefono')->nullable();
            $t->string('rut', 20)->nullable();
            $t->text('mensaje');
            $t->boolean('leido')->default(false);
            $t->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('prevencion_delitos');
    }
};
