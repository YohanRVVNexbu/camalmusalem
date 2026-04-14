<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('version_engine', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vehicle_version_id')->unique()->constrained()->cascadeOnDelete();
            $table->string('engine_code')->nullable();
            $table->unsignedTinyInteger('cylinders')->nullable();
            $table->string('layout')->nullable();
            $table->unsignedSmallInteger('displacement_cc')->nullable();
            $table->string('compression_ratio')->nullable();
            $table->string('fuel_system')->nullable();
            $table->unsignedSmallInteger('hp')->nullable();
            $table->unsignedSmallInteger('hp_rpm')->nullable();
            $table->unsignedSmallInteger('torque_nm')->nullable();
            $table->unsignedSmallInteger('torque_rpm_min')->nullable();
            $table->unsignedSmallInteger('torque_rpm_max')->nullable();
            $table->enum('fuel_type', ['gasoline', 'diesel', 'lpg', 'cng'])->nullable();
            $table->string('emissions_standard')->nullable();
            $table->string('octane_recommended')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('version_engine');
    }
};
