<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('merch', function (Blueprint $table) {
            $table->id();
            $table->string('sku')->nullable()->unique();
            $table->string('name');
            $table->text('description')->nullable();
            $table->text('description_tech')->nullable();
            $table->string('category')->default('merch');
            $table->string('subcategory')->nullable();
            $table->string('size')->nullable();
            $table->string('price')->nullable();
            $table->string('price_offer')->nullable();
            $table->string('status')->default('disponible');
            $table->string('branch')->nullable();
            $table->json('images')->nullable();
            $table->boolean('is_visible')->default(true);
            $table->integer('order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('merch');
    }
};
