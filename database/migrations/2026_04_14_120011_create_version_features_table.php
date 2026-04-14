<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('version_features', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vehicle_version_id')->constrained()->cascadeOnDelete();
            $table->foreignId('feature_id')->constrained()->cascadeOnDelete();
            $table->boolean('value_bool')->default(true);
            $table->integer('value_int')->nullable();
            $table->string('value_text')->nullable();
            $table->string('note')->nullable();
            $table->timestamps();

            $table->unique(['vehicle_version_id', 'feature_id']);
            $table->index('feature_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('version_features');
    }
};
