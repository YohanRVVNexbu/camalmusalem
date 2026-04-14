<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('version_performance', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vehicle_version_id')->unique()->constrained()->cascadeOnDelete();
            $table->decimal('city_kml', 5, 2)->nullable();
            $table->decimal('highway_kml', 5, 2)->nullable();
            $table->decimal('combined_kml', 5, 2)->nullable();
            $table->unsignedSmallInteger('co2_gkm')->nullable();
            $table->decimal('acceleration_0_100_s', 4, 1)->nullable();
            $table->unsignedSmallInteger('top_speed_kmh')->nullable();
            $table->string('energy_efficiency_label', 5)->nullable();
            $table->string('report_code')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('version_performance');
    }
};
