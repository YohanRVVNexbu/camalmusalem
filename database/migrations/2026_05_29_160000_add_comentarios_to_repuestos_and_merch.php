<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Campo de comentarios manual para repuestos y merch (lo completa el equipo
 * desde el admin o la carga masiva). Aparece como nota en la ficha pública.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('repuestos', function (Blueprint $table) {
            $table->text('comentarios')->nullable()->after('compatible_with');
        });
        Schema::table('merch', function (Blueprint $table) {
            $table->text('comentarios')->nullable()->after('description_tech');
        });
    }

    public function down(): void
    {
        Schema::table('repuestos', function (Blueprint $table) {
            $table->dropColumn('comentarios');
        });
        Schema::table('merch', function (Blueprint $table) {
            $table->dropColumn('comentarios');
        });
    }
};
