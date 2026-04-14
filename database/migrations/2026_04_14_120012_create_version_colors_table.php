<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('version_colors', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vehicle_version_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('hex', 7)->nullable();
            $table->enum('type', ['solid', 'metallic', 'pearl', 'matte'])->default('solid');
            $table->string('image_path')->nullable();
            $table->boolean('is_available')->default(true);
            $table->integer('display_order')->default(0);
            $table->timestamps();

            $table->index('vehicle_version_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('version_colors');
    }
};
