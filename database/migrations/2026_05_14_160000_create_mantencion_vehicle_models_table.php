<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('mantencion_vehicle_models', function (Blueprint $t) {
            $t->id();
            $t->string('name');
            $t->boolean('is_active')->default(true);
            $t->integer('display_order')->default(0);
            $t->timestamps();
        });

        // Seed con los 7 modelos que estaban hardcoded en el formulario, más
        // espacio para que el admin agregue cualquier otro que llegue al taller.
        $now = now();
        \DB::table('mantencion_vehicle_models')->insert([
            ['name' => 'Corolla',      'is_active' => true, 'display_order' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Hilux',        'is_active' => true, 'display_order' => 2, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'RAV4',         'is_active' => true, 'display_order' => 3, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'bZ4X',         'is_active' => true, 'display_order' => 4, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Yaris',        'is_active' => true, 'display_order' => 5, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Camry',        'is_active' => true, 'display_order' => 6, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Land Cruiser', 'is_active' => true, 'display_order' => 7, 'created_at' => $now, 'updated_at' => $now],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('mantencion_vehicle_models');
    }
};
