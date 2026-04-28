<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('branches', function (Blueprint $t) {
            $t->string('phone_sucursal')->nullable()->after('phone');
            $t->string('phone_repuestos')->nullable()->after('phone_sucursal');
            $t->json('phones_servicio_tecnico')->nullable()->after('phone_repuestos');
            $t->string('image_path')->nullable()->after('phones_servicio_tecnico');
        });
    }

    public function down(): void
    {
        Schema::table('branches', function (Blueprint $t) {
            $t->dropColumn(['phone_sucursal', 'phone_repuestos', 'phones_servicio_tecnico', 'image_path']);
        });
    }
};
