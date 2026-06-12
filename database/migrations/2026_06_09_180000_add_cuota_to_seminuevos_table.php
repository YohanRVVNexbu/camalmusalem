<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Valor cuota mensual del seminuevo ("Cuotas desde $412.055"), administrable
 * por vehículo. Pedido de gerencia (jun 2026) replicando el patrón de
 * Bruno Fritsch. String de solo dígitos como el resto de los precios
 * (formatCLP se aplica al renderizar). Nullable: vacío = no se muestra.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('seminuevos', function (Blueprint $table) {
            $table->string('cuota', 100)->nullable()->after('down_payment');
        });
    }

    public function down(): void
    {
        Schema::table('seminuevos', function (Blueprint $table) {
            $table->dropColumn('cuota');
        });
    }
};
