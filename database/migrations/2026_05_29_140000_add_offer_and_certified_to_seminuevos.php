<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Agrega a seminuevos:
 *  - price_offer: precio oferta (opcional, solo dígitos como `price`). Si está
 *    presente, es el precio "rebajado" y `price` se muestra tachado.
 *  - certified: marca el vehículo como "Seminuevo Certificado Toyota Musalem"
 *    para mostrar el distintivo en el card y el detalle.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('seminuevos', function (Blueprint $table) {
            $table->string('price_offer')->nullable()->after('price');
            $table->boolean('certified')->default(false)->after('is_visible');
        });
    }

    public function down(): void
    {
        Schema::table('seminuevos', function (Blueprint $table) {
            $table->dropColumn(['price_offer', 'certified']);
        });
    }
};
