<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('version_dimensions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vehicle_version_id')->unique()->constrained()->cascadeOnDelete();
            $table->unsignedSmallInteger('length_mm')->nullable();
            $table->unsignedSmallInteger('width_mm')->nullable();
            $table->unsignedSmallInteger('height_mm')->nullable();
            $table->unsignedSmallInteger('wheelbase_mm')->nullable();
            $table->unsignedSmallInteger('ground_clearance_mm')->nullable();
            $table->decimal('approach_angle', 4, 1)->nullable();
            $table->decimal('departure_angle', 4, 1)->nullable();
            $table->decimal('breakover_angle', 4, 1)->nullable();
            $table->unsignedSmallInteger('wading_mm')->nullable();
            $table->decimal('drag_coefficient', 3, 2)->nullable();
            $table->unsignedSmallInteger('turning_radius_mm')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('version_dimensions');
    }
};
