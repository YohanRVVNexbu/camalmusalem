<?php

use App\Models\SiteSection;
use Illuminate\Database\Migrations\Migration;

/**
 * Crea la sección `seminuevos_whatsapp` que controla el botón de WhatsApp del
 * detalle (show) de Seminuevos. Mismo patrón que `accesorios_whatsapp`:
 *  - `is_visible = false` → el botón desaparece del show.
 *  - `contacts` = uno o más números por sucursal; con 2+ el cliente elige.
 *  - `message` es la base del texto; el front reemplaza `{producto}` por el
 *    nombre del vehículo.
 *
 * Para que el botón funcione de inmediato, copiamos los números que el cliente
 * ya tenga cargados en el botón flotante (whatsapp_button); si no hay, se deja
 * con las dos sucursales y teléfonos vacíos para que los complete en el admin.
 */
return new class extends Migration {
    public function up(): void
    {
        $wa = SiteSection::where('section', 'whatsapp_button')->first();
        $waData = $wa?->data ?? [];

        $contacts = [];
        if (! empty($waData['contacts']) && is_array($waData['contacts'])) {
            $contacts = array_values(array_map(fn ($c) => [
                'label' => $c['label'] ?? 'WhatsApp',
                'phone' => $c['phone'] ?? '',
            ], $waData['contacts']));
        } elseif (! empty($waData['phone'])) {
            $contacts = [['label' => 'WhatsApp', 'phone' => $waData['phone']]];
        } else {
            $contacts = [
                ['label' => 'Sucursal La Serena', 'phone' => ''],
                ['label' => 'Sucursal Ovalle', 'phone' => ''],
            ];
        }

        SiteSection::updateOrCreate(['section' => 'seminuevos_whatsapp'], [
            'data' => [
                'contacts' => $contacts,
                'message'  => 'Hola, me interesa este vehículo: {producto}',
            ],
            'is_visible' => true,
            'order' => 24,
        ]);
    }

    public function down(): void
    {
        SiteSection::where('section', 'seminuevos_whatsapp')->delete();
    }
};
