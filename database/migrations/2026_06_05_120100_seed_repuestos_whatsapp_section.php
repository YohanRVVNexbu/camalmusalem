<?php

use App\Models\SiteSection;
use Illuminate\Database\Migrations\Migration;

/**
 * Crea la sección `repuestos_whatsapp` para el botón de WhatsApp del detalle
 * (show) de Repuestos. Mismo patrón que seminuevos/accesorios. Copia los
 * números del botón flotante si ya existen, para que funcione de inmediato.
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

        SiteSection::updateOrCreate(['section' => 'repuestos_whatsapp'], [
            'data' => [
                'contacts' => $contacts,
                'message'  => 'Hola, quiero consultar por el repuesto: {producto}',
            ],
            'is_visible' => true,
            'order' => 26,
        ]);
    }

    public function down(): void
    {
        SiteSection::where('section', 'repuestos_whatsapp')->delete();
    }
};
