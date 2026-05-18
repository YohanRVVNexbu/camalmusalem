<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * `option_code` corresponde a la columna E "Opción" del Excel de
     * Toyota — formato alfanumérico tipo `BZ4XLTD42-25PC`. Es el "número
     * antiguo de material" en terminología SAP que Salesforce espera en el
     * campo `products[].version` al crear oportunidades.
     *
     * Diferenciar de `material_code`:
     *   - `material_code` (col AQ): numérico 8 dígitos (`70002066`). Es la
     *     key única de upsert en imports masivos del Excel.
     *   - `option_code` (col E): alfanumérico. Es el valor que viaja a
     *     Salesforce en cada cotización.
     *
     * No es unique porque Toyota podría reutilizar el mismo código Opción
     * en distintas líneas/años. El indexado simple es suficiente para
     * lookups rápidos.
     */
    public function up(): void
    {
        Schema::table('vehicle_versions', function (Blueprint $t) {
            $t->string('option_code', 64)->nullable()->after('material_code');
            $t->index('option_code');
        });
    }

    public function down(): void
    {
        Schema::table('vehicle_versions', function (Blueprint $t) {
            $t->dropIndex(['option_code']);
            $t->dropColumn('option_code');
        });
    }
};
