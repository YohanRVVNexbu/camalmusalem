<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Shorts específicos por vehículo (modelo): lista de [{ url, thumbnail }].
 * Soporta YouTube / Instagram / TikTok (plataforma derivada de la URL).
 * Es independiente de la sección de shorts generales del home.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('vehicle_models', function (Blueprint $table) {
            $table->json('shorts')->nullable()->after('detail_content');
        });
    }

    public function down(): void
    {
        Schema::table('vehicle_models', function (Blueprint $table) {
            $table->dropColumn('shorts');
        });
    }
};
