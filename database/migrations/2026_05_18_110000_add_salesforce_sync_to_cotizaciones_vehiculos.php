<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('cotizaciones_vehiculos', function (Blueprint $t) {
            // Sucursal hacia la que se manda la cotización en Salesforce
            // (puede ser distinta del modelo de vehículo cotizado — el cliente
            // elige a qué concesionario quiere acercarse).
            $t->foreignId('branch_id')->nullable()->after('vehicle_id')->constrained('branches')->nullOnDelete();
            $t->foreignId('version_id')->nullable()->after('branch_id')->constrained('vehicle_versions')->nullOnDelete();

            // Tracking de la sincronización con Salesforce.
            $t->string('sync_status', 20)->default('pending')->after('leido'); // pending | synced | failed
            $t->timestamp('synced_at')->nullable()->after('sync_status');
            $t->string('salesforce_opportunity_id', 64)->nullable()->after('synced_at');
            $t->string('salesforce_quote_id', 64)->nullable()->after('salesforce_opportunity_id');
            $t->json('salesforce_response')->nullable()->after('salesforce_quote_id');
            $t->text('sync_last_error')->nullable()->after('salesforce_response');
            $t->unsignedTinyInteger('sync_attempts')->default(0)->after('sync_last_error');
        });
    }

    public function down(): void
    {
        Schema::table('cotizaciones_vehiculos', function (Blueprint $t) {
            $t->dropForeign(['branch_id']);
            $t->dropForeign(['version_id']);
            $t->dropColumn([
                'branch_id', 'version_id',
                'sync_status', 'synced_at',
                'salesforce_opportunity_id', 'salesforce_quote_id',
                'salesforce_response', 'sync_last_error', 'sync_attempts',
            ]);
        });
    }
};
