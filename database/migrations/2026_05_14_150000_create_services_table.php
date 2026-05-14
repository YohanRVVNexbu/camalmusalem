<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('services', function (Blueprint $t) {
            $t->id();
            $t->string('name');
            $t->string('slug')->unique();
            $t->boolean('is_active')->default(true);
            $t->integer('display_order')->default(0);
            $t->timestamps();
        });

        // Seed con los 6 servicios originales del formulario
        $now = now();
        \DB::table('services')->insert([
            ['name' => 'Mantención preventiva',    'slug' => 'mantencion-preventiva',    'is_active' => true, 'display_order' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Diagnóstico electrónico',  'slug' => 'diagnostico-electronico',  'is_active' => true, 'display_order' => 2, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Revisión de frenos',       'slug' => 'revision-de-frenos',       'is_active' => true, 'display_order' => 3, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Alineación y balanceo',    'slug' => 'alineacion-y-balanceo',    'is_active' => true, 'display_order' => 4, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Servicio eléctrico/híbrido','slug' => 'servicio-electrico-hibrido','is_active' => true, 'display_order' => 5, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Desabolladura y pintura',  'slug' => 'desabolladura-y-pintura',  'is_active' => true, 'display_order' => 6, 'created_at' => $now, 'updated_at' => $now],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('services');
    }
};
