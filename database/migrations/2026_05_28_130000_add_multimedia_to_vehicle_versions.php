<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Multimedia por VERSIÓN: lista mixta ordenada de items
 * [{ type: 'image'|'video'|'youtube', url }]. Antes vivía a nivel modelo
 * (vehicle_models.detail_content.multimedia); ahora cada versión tiene la
 * suya y soporta también URLs de YouTube además de archivos subidos.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('vehicle_versions', function (Blueprint $table) {
            $table->json('multimedia')->nullable()->after('hero_image');
        });
    }

    public function down(): void
    {
        Schema::table('vehicle_versions', function (Blueprint $table) {
            $table->dropColumn('multimedia');
        });
    }
};
