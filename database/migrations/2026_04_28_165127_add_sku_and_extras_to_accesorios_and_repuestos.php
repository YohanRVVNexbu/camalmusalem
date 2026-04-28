<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('accesorios', function (Blueprint $table) {
            $table->string('sku')->nullable()->after('id');
            $table->string('price_offer')->nullable()->after('price');
            $table->text('compatible_with')->nullable()->after('price_offer');
        });

        Schema::table('repuestos', function (Blueprint $table) {
            $table->string('price_offer')->nullable()->after('price');
            $table->text('compatible_with')->nullable()->after('price_offer');
        });
    }

    public function down(): void
    {
        Schema::table('accesorios', function (Blueprint $table) {
            $table->dropColumn(['sku', 'price_offer', 'compatible_with']);
        });

        Schema::table('repuestos', function (Blueprint $table) {
            $table->dropColumn(['price_offer', 'compatible_with']);
        });
    }
};
