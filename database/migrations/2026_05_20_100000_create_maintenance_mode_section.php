<?php

use App\Models\SiteSection;
use Illuminate\Database\Migrations\Migration;

/**
 * Crea la sección `maintenance_mode`, que controla el modo mantenimiento
 * administrable desde el panel.
 *
 * Convención del proyecto: cada sección usa `is_visible` como flag de
 * "esta sección está activa". Aquí mantenemos esa convención —
 *
 *   is_visible=true  → modo mantenimiento ACTIVO (los clientes ven la
 *                       vista de mantenimiento, los admins logeados
 *                       pasan)
 *   is_visible=false → sitio operando normal
 *
 * El default es `false` para que la migración sea segura en cualquier
 * entorno (incluyendo producción): nadie quiere que correr migraciones
 * baje el sitio sin querer.
 */
return new class extends Migration {
    public function up(): void
    {
        SiteSection::updateOrCreate(['section' => 'maintenance_mode'], [
            'data' => [
                'title'         => 'Estamos mejorando el sitio',
                'description'   => 'Volveremos en unos minutos. Gracias por tu paciencia.',
                'eta'           => '',
                'contact_email' => 'info@camalmusalem.cl',
                'image'         => '',
                'image_mobile'  => '',
                'show_logo'     => true,
            ],
            'is_visible' => false,
            'order'      => 100,
        ]);
    }

    public function down(): void
    {
        SiteSection::where('section', 'maintenance_mode')->delete();
    }
};
