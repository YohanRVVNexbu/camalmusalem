<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Seguimiento de solicitudes (pedido del cliente, jun 2026): cada solicitud
 * lleva un ESTADO (pendiente → en_seguimiento → cerrada) y una NOTA de
 * seguimiento del asesor, para que el equipo gestione el contacto y las
 * cerradas no se acumulen en la bandeja. Mismo patrón que las denuncias.
 */
return new class extends Migration
{
    private array $tables = [
        'contactos',
        'cotizaciones_vehiculos',
        'cotizaciones_accesorios',
        'cotizaciones_repuestos',
        'cotizaciones_merch',
        'mantencion_agendamientos',
        'kinto_solicitudes',
        'solicitudes_encargo_repuestos',
    ];

    public function up(): void
    {
        foreach ($this->tables as $table) {
            if (! Schema::hasTable($table)) {
                continue;
            }
            Schema::table($table, function (Blueprint $t) use ($table) {
                if (! Schema::hasColumn($table, 'estado')) {
                    $t->string('estado', 30)->default('pendiente')->index();
                }
                if (! Schema::hasColumn($table, 'nota_seguimiento')) {
                    $t->text('nota_seguimiento')->nullable();
                }
            });
        }
    }

    public function down(): void
    {
        foreach ($this->tables as $table) {
            if (! Schema::hasTable($table)) {
                continue;
            }
            Schema::table($table, function (Blueprint $t) use ($table) {
                if (Schema::hasColumn($table, 'estado')) {
                    $t->dropColumn('estado');
                }
                if (Schema::hasColumn($table, 'nota_seguimiento')) {
                    $t->dropColumn('nota_seguimiento');
                }
            });
        }
    }
};
