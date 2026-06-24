<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Campos extra para enviar el color ESTRUCTURADO a Salesforce (no solo en la
 * descripción) y para guardar el request enviado al API como evidencia.
 *
 * - color_code: código externo del color ("Id Externo Color" en SF), que viene
 *   del endpoint de colores (externalCodeColor). Es el valor que el API espera
 *   en el campo estructurado; el nombre ("Blanco Perlado") es solo para mostrar.
 * - color_internal: color interior (internalColor del endpoint).
 * - salesforce_request: payload JSON exacto que se envió al API (para auditar /
 *   entregar evidencia a Globant ante dudas de un caso puntual).
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('cotizaciones_vehiculos', function (Blueprint $table) {
            $table->string('color_code', 120)->nullable()->after('color');
            $table->string('color_internal', 120)->nullable()->after('color_code');
            $table->json('salesforce_request')->nullable()->after('salesforce_response');
        });
    }

    public function down(): void
    {
        Schema::table('cotizaciones_vehiculos', function (Blueprint $table) {
            $table->dropColumn(['color_code', 'color_internal', 'salesforce_request']);
        });
    }
};
