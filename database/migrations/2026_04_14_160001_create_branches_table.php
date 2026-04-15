<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('branches', function (Blueprint $t) {
            $t->id();
            $t->string('name');
            $t->string('slug')->unique();
            $t->string('address')->nullable();
            $t->string('city')->nullable();
            $t->string('maps_url')->nullable();
            $t->string('phone')->nullable();
            $t->boolean('is_active')->default(true);
            $t->integer('display_order')->default(0);
            $t->timestamps();
        });

        Schema::table('seminuevos', function (Blueprint $t) {
            $t->foreignId('branch_id')->nullable()->after('order')->constrained('branches')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('seminuevos', function (Blueprint $t) {
            $t->dropConstrainedForeignId('branch_id');
        });
        Schema::dropIfExists('branches');
    }
};
