<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rentals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vehicle_model_id')->nullable()->constrained('vehicle_models')->nullOnDelete();
            $table->string('name')->nullable();           // Override; falls back to vehicle_model->name
            $table->string('slug')->unique();
            $table->string('card_image')->nullable();     // Override; falls back to vehicle_model->hero_image
            $table->text('description')->nullable();      // Override
            $table->string('price_hour')->nullable();
            $table->string('price_day')->nullable();
            $table->string('price_week')->nullable();
            $table->string('price_month')->nullable();
            $table->boolean('is_active')->default(true);
            $table->unsignedInteger('display_order')->default(0);
            $table->timestamps();

            $table->index(['is_active', 'display_order']);
        });

        Schema::create('branch_rental', function (Blueprint $table) {
            $table->foreignId('rental_id')->constrained('rentals')->cascadeOnDelete();
            $table->foreignId('branch_id')->constrained('branches')->cascadeOnDelete();
            $table->primary(['rental_id', 'branch_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('branch_rental');
        Schema::dropIfExists('rentals');
    }
};
