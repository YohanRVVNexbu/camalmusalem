<?php

use App\Models\SiteSection;
use Illuminate\Database\Migrations\Migration;

/**
 * Reestructura `whatsapp_button.data` para soportar múltiples contactos.
 *
 * Antes:
 *   data = { phone: "+56...", message: "..." }
 *
 * Ahora:
 *   data = {
 *     contacts: [
 *       { label: "Ventas La Serena", phone: "+56...", message: "..." },
 *       { label: "Ventas Ovalle",    phone: "+56...", message: "..." },
 *     ]
 *   }
 *
 * El frontend muestra un único enlace directo cuando hay un solo contacto,
 * y un menú desplegable cuando hay dos o más.
 *
 * La migración convierte registros viejos a la estructura nueva preservando
 * los datos. Si ya tiene `contacts`, no toca nada (idempotente).
 */
return new class extends Migration {
    public function up(): void
    {
        foreach (['data', 'default_data'] as $bucket) {
            $this->migrateBucket($bucket);
        }
    }

    public function down(): void
    {
        // No revert: la estructura nueva es estrictamente superior. Si la
        // sección queda con varios contactos, no se puede colapsar a uno.
    }

    private function migrateBucket(string $bucket): void
    {
        $section = SiteSection::where('section', 'whatsapp_button')->first();
        if (! $section) {
            return;
        }

        $payload = $section->{$bucket};
        if (! is_array($payload)) {
            return;
        }

        // Ya tiene contacts → idempotente, no hacer nada.
        if (isset($payload['contacts']) && is_array($payload['contacts'])) {
            return;
        }

        $oldPhone = $payload['phone'] ?? '';
        $oldMessage = $payload['message'] ?? '';

        $newPayload = [
            'contacts' => $oldPhone !== '' ? [
                [
                    'label'   => 'Contacto',
                    'phone'   => $oldPhone,
                    'message' => $oldMessage,
                ],
            ] : [],
        ];

        $section->update([$bucket => $newPayload]);
    }
};
