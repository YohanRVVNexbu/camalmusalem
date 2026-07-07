<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Códigos "Material" de la lista de precios que el cliente decidió NO crear
 * como versión del sitio (típicamente versiones descontinuadas que Toyota
 * igual incluye en la lista mensual). Una vez ignorado, el importador deja de
 * ofrecerlo como "Crear" en el preview de los meses siguientes — hasta que el
 * cliente lo reactive manualmente desde /admin/vehicle-versions/bulk-import.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ignored_price_list_materials', function (Blueprint $table) {
            $table->id();
            $table->string('material_code')->unique();
            // Guardamos línea/versión tal como venían en el Excel al momento de
            // ignorar, solo para mostrarlas en el listado de "ignorados" sin
            // tener que volver a abrir el Excel de ese mes.
            $table->string('linea')->nullable();
            $table->string('version_name')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ignored_price_list_materials');
    }
};
