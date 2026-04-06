<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('seminuevos', function (Blueprint $table) {
            $table->id();
            $table->string('brand');
            $table->string('model');
            $table->integer('year');
            $table->integer('km');
            $table->string('price');
            $table->string('fuel')->nullable();
            $table->string('transmission')->nullable();
            $table->string('traction')->nullable();
            $table->integer('doors')->default(5);
            $table->integer('seats')->default(5);
            $table->string('color')->nullable();
            $table->text('description')->nullable();
            $table->json('gallery')->nullable();
            $table->boolean('is_visible')->default(true);
            $table->integer('order')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('seminuevos');
    }
};
