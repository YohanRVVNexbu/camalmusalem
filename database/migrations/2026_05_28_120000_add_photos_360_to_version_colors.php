<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Agrega `photos_360` a version_colors: el set de fotos del visor 360 por
 * color, ahora a nivel VERSIÓN (antes vivía en vehicle_models.detail_content
 * a nivel modelo). Cada color de cada versión tiene su propio set porque las
 * versiones difieren en llantas y detalles estéticos.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('version_colors', function (Blueprint $table) {
            $table->json('photos_360')->nullable()->after('image_path');
        });
    }

    public function down(): void
    {
        Schema::table('version_colors', function (Blueprint $table) {
            $table->dropColumn('photos_360');
        });
    }
};
