<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('version_capacities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vehicle_version_id')->unique()->constrained()->cascadeOnDelete();
            $table->unsignedSmallInteger('gvwr_kg')->nullable();
            $table->unsignedSmallInteger('curb_weight_kg')->nullable();
            $table->unsignedTinyInteger('seats')->nullable();
            $table->unsignedTinyInteger('seat_rows')->nullable();
            $table->unsignedSmallInteger('trunk_l')->nullable();
            $table->unsignedSmallInteger('fuel_tank_l')->nullable();
            $table->unsignedSmallInteger('urea_tank_l')->nullable();
            $table->unsignedSmallInteger('towing_braked_kg')->nullable();
            $table->unsignedSmallInteger('towing_unbraked_kg')->nullable();
            $table->unsignedSmallInteger('payload_kg')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('version_capacities');
    }
};
