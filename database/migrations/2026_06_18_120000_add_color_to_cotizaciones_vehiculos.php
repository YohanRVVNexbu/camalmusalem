<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Color de interés capturado en la cotización de vehículos nuevos. Se obtiene
 * del API de colores de Salesforce/Mulesoft (por option_code de la versión).
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('cotizaciones_vehiculos', function (Blueprint $table) {
            $table->string('color', 120)->nullable()->after('version_id');
        });
    }

    public function down(): void
    {
        Schema::table('cotizaciones_vehiculos', function (Blueprint $table) {
            $table->dropColumn('color');
        });
    }
};
