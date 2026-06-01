<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Campo de comentarios manual para accesorios (lo completa el equipo desde el
 * admin o la carga masiva). Aparece como nota en la ficha pública del producto.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('accesorios', function (Blueprint $table) {
            $table->text('comentarios')->nullable()->after('compatible_with');
        });
    }

    public function down(): void
    {
        Schema::table('accesorios', function (Blueprint $table) {
            $table->dropColumn('comentarios');
        });
    }
};
