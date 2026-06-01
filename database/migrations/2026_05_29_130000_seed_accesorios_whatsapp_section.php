<?php

use App\Models\SiteSection;
use Illuminate\Database\Migrations\Migration;

/**
 * Crea la sección `accesorios_whatsapp` que controla el botón de WhatsApp
 * que aparece SOLO en la vista de detalle (show) de Accesorios y Merch.
 *
 * - `is_visible = false` → el botón desaparece de ambos shows.
 * - `message` es la base del texto; el frontend le agrega el nombre del
 *   producto. Si el texto contiene `{producto}`, se reemplaza por el nombre;
 *   si no, el nombre se concatena al final.
 */
return new class extends Migration {
    public function up(): void
    {
        SiteSection::updateOrCreate(['section' => 'accesorios_whatsapp'], [
            'data' => [
                'phone'   => '+56912345678',
                'message' => 'Hola, quiero cotizar por el producto',
            ],
            'is_visible' => true,
            'order' => 34,
        ]);
    }

    public function down(): void
    {
        SiteSection::where('section', 'accesorios_whatsapp')->delete();
    }
};
