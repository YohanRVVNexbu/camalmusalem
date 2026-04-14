<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Tablas lookup editables desde el panel admin. Reemplazan los valores
     * hardcodeados en ENUMs a lo largo del esquema. Todas comparten shape.
     */
    private array $tables = [
        'feature_categories',
        'body_types',
        'powertrain_types',
        'drivetrains',
        'transmission_types',
        'color_types',
        'fuel_types',
    ];

    public function up(): void
    {
        foreach ($this->tables as $table) {
            Schema::create($table, function (Blueprint $t) {
                $t->id();
                $t->string('code')->unique();
                $t->string('name_es');
                $t->string('name_en')->nullable();
                $t->integer('display_order')->default(0);
                $t->boolean('is_active')->default(true);
                $t->timestamps();
            });
        }
    }

    public function down(): void
    {
        foreach (array_reverse($this->tables) as $table) {
            Schema::dropIfExists($table);
        }
    }
};
