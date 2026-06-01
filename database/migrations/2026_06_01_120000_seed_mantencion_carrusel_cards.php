<?php

use App\Models\SiteSection;
use Illuminate\Database\Migrations\Migration;

/**
 * Hace editables las 3 imágenes y los 3 textos del carrusel "Servicio técnico
 * Musalem" en /post-venta/agendar-mantencion. Antes estaban hardcodeados.
 * Solo se agregan claves nuevas al data JSON existente: no se sobreescribe
 * nada de lo que el admin ya pueda haber guardado.
 */
return new class extends Migration {
    public function up(): void
    {
        $section = SiteSection::where('section', 'mantencion_reserva')->first();
        if (! $section) {
            return;
        }

        $data = $section->data ?? [];
        $defaults = [
            'card1_image'        => '',
            'card1_image_mobile' => '',
            'card2_image'        => '',
            'card2_image_mobile' => '',
            'card3_image'        => '',
            'card3_image_mobile' => '',
            'text1_titulo'       => 'Los inicios',
            'text1_subtitulo'    => '1968',
            'text1_desc'         => 'Camal Musalem nace en 1968 con un taller mecánico en Ovalle, dando inicio a su desarrollo en el rubro automotriz en Ovalle y La Serena.',
            'text2_titulo'       => 'Reparaciones, revisión y diagnóstico',
            'text2_subtitulo'    => 'Servicio autorizado y atención experta',
            'text2_desc'         => 'Contamos con repuestos originales y personal técnico calificado para revisar, diagnosticar y reparar tu vehículo con la confianza y respaldo que necesitas.',
            'text3_titulo'       => "Desabolladura\ny pintura",
            'text3_subtitulo'    => 'Terminaciones de calidad para tu vehículo',
            'text3_desc'         => 'Realizamos trabajos de desabolladura, cuadratura y pintura con terminaciones óptimas, utilizando equipamiento especializado y tecnología adecuada para cada reparación.',
        ];

        // Solo agrega las claves que aún no existen (no pisa lo que el admin
        // ya haya guardado).
        foreach ($defaults as $k => $v) {
            if (! array_key_exists($k, $data)) {
                $data[$k] = $v;
            }
        }

        $section->update(['data' => $data]);
    }

    public function down(): void
    {
        // No-op: mantenemos los campos en BD para no perder datos del admin.
    }
};
