<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('version_electric', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vehicle_version_id')->unique()->constrained()->cascadeOnDelete();
            $table->string('motor_type')->nullable();
            $table->unsignedSmallInteger('motor_front_kw')->nullable();
            $table->unsignedSmallInteger('motor_rear_kw')->nullable();
            $table->unsignedSmallInteger('combined_kw')->nullable();
            $table->unsignedSmallInteger('combined_hp')->nullable();
            $table->unsignedSmallInteger('combined_torque_nm')->nullable();
            $table->string('battery_type')->nullable();
            $table->decimal('battery_kwh', 6, 2)->nullable();
            $table->unsignedSmallInteger('battery_cells')->nullable();
            $table->unsignedSmallInteger('battery_voltage')->nullable();
            $table->unsignedSmallInteger('range_wltc_km')->nullable();
            $table->decimal('ac_charge_kw', 5, 2)->nullable();
            $table->decimal('dc_charge_kw', 6, 2)->nullable();
            $table->unsignedSmallInteger('ac_charge_minutes')->nullable();
            $table->unsignedSmallInteger('dc_charge_minutes')->nullable();
            $table->string('charge_connector')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('version_electric');
    }
};
