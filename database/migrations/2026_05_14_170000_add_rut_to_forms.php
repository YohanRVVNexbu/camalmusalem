<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('contactos', function (Blueprint $t) {
            $t->string('rut', 20)->nullable()->after('telefono');
        });

        Schema::table('cotizaciones_vehiculos', function (Blueprint $t) {
            $t->string('rut', 20)->nullable()->after('telefono');
        });
    }

    public function down(): void
    {
        Schema::table('contactos', function (Blueprint $t) {
            $t->dropColumn('rut');
        });
        Schema::table('cotizaciones_vehiculos', function (Blueprint $t) {
            $t->dropColumn('rut');
        });
    }
};
