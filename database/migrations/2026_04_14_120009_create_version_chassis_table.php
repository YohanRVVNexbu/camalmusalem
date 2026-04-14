<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('version_chassis', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vehicle_version_id')->unique()->constrained()->cascadeOnDelete();
            $table->string('steering_type')->nullable();
            $table->string('front_suspension')->nullable();
            $table->string('rear_suspension')->nullable();
            $table->string('front_brakes')->nullable();
            $table->string('rear_brakes')->nullable();
            $table->string('parking_brake')->nullable();
            $table->string('front_tire')->nullable();
            $table->string('rear_tire')->nullable();
            $table->unsignedTinyInteger('wheel_size_in')->nullable();
            $table->string('wheel_material')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('version_chassis');
    }
};
