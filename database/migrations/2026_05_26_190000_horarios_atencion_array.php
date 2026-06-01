<?php

use App\Models\SiteSection;
use Illuminate\Database\Migrations\Migration;

/**
 * Convierte el horario de atención en `contacto_info.data` a un array
 * `horarios: [{label, value}]` administrable como lista editable, en
 * lugar de los dos campos fijos `horario_lv` y `horario_sab`.
 *
 * Motivación: el cliente cambió a horarios distintos para Lun-Jueves,
 * Viernes y Sábado. Con los dos campos fijos no se podía representar.
 *
 * Compatibilidad: este horario es la fuente única de verdad para todas
 * las páginas del sitio (contacto, mantención, repuestos). El middleware
 * Inertia lo comparte como prop global `horariosAtencion` para que cada
 * página lo lea de un solo lugar.
 *
 * La migración preserva los valores viejos: convierte horario_lv en
 * "Lunes a Viernes" y horario_sab en "Sábado / Domingo". El admin
 * después puede dividirlos como quiera (ej. Lun-Jue / Vie / Sáb).
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
        // No revert: la estructura nueva es estrictamente superior.
    }

    private function migrateBucket(string $bucket): void
    {
        $section = SiteSection::where('section', 'contacto_info')->first();
        if (! $section) {
            return;
        }

        $payload = $section->{$bucket};
        if (! is_array($payload)) {
            return;
        }

        // Si ya tiene `horarios`, no tocamos (migración idempotente).
        if (isset($payload['horarios']) && is_array($payload['horarios'])) {
            return;
        }

        $items = [];
        if (! empty($payload['horario_lv'])) {
            $items[] = ['label' => 'Lunes a Viernes', 'value' => $payload['horario_lv']];
        }
        if (! empty($payload['horario_sab'])) {
            $items[] = ['label' => 'Sábado / Domingo', 'value' => $payload['horario_sab']];
        }
        // Default si no había nada
        if (empty($items)) {
            $items = [
                ['label' => 'Lunes a Viernes', 'value' => '09:00 a 13:30 - 14:45 a 18:30'],
                ['label' => 'Sábado / Domingo', 'value' => 'Cerrado'],
            ];
        }

        $payload['horarios'] = $items;
        // Mantenemos horario_lv / horario_sab por backwards-compat hasta
        // que todas las vistas del frontend usen el array. La próxima
        // migración los puede quitar limpio si querés.

        $section->update([$bucket => $payload]);
    }
};
