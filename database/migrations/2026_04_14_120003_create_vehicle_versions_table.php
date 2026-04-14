<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vehicle_versions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vehicle_model_id')->constrained()->cascadeOnDelete();
            $table->string('trim_name');
            $table->string('slug');
            $table->year('model_year');
            $table->enum('powertrain_type', ['gasoline', 'diesel', 'hybrid', 'phev', 'bev']);
            $table->enum('drivetrain', ['fwd', 'rwd', 'awd', '4wd']);
            $table->enum('transmission_type', ['MT', 'AT', 'CVT', 'eCVT', 'DCT', 'AMT'])->nullable();
            $table->unsignedTinyInteger('transmission_speeds')->nullable();
            $table->unsignedBigInteger('msrp_clp')->nullable();
            $table->string('sales_code')->nullable();
            $table->text('description')->nullable();
            $table->string('hero_image')->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('display_order')->default(0);
            $table->timestamps();

            $table->unique(['vehicle_model_id', 'slug', 'model_year']);
            $table->index(['powertrain_type', 'drivetrain']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vehicle_versions');
    }
};
