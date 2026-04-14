<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('features', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('name_es');
            $table->string('name_en')->nullable();
            $table->enum('category', [
                'safety',
                'tss',
                'comfort',
                'infotainment',
                'exterior',
                'interior',
                'offroad',
                'performance',
                'other',
            ]);
            $table->enum('data_type', ['boolean', 'int', 'string'])->default('boolean');
            $table->string('unit')->nullable();
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('display_order')->default(0);
            $table->timestamps();

            $table->index(['category', 'is_active']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('features');
    }
};
