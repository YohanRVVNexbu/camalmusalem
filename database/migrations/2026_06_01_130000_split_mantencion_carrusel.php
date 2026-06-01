<?php

use App\Models\SiteSection;
use Illuminate\Database\Migrations\Migration;

/**
 * Divide la sección mantencion_reserva en dos:
 *  - mantencion_carrusel: datos del carrusel "Servicio técnico Musalem"
 *    (título, descripción, 3 imágenes y 3 textos).
 *  - mantencion_reserva: queda con SOLO los datos del formulario de reserva
 *    (título, descripción, botón, imagen del bloque, imágenes del wizard).
 *
 * Se hace así para que en /admin/paginas/mantencion el carrusel sea un
 * acordeón independiente y descubrible, en vez de estar escondido dentro
 * del card de "Reserva tu hora".
 */
return new class extends Migration {
    public function up(): void
    {
        $reserva = SiteSection::where('section', 'mantencion_reserva')->first();
        $reservaData = $reserva?->data ?? [];

        $carruselKeys = [
            'carousel_title', 'carousel_description',
            'card1_image', 'card1_image_mobile',
            'card2_image', 'card2_image_mobile',
            'card3_image', 'card3_image_mobile',
            'text1_titulo', 'text1_subtitulo', 'text1_desc',
            'text2_titulo', 'text2_subtitulo', 'text2_desc',
            'text3_titulo', 'text3_subtitulo', 'text3_desc',
        ];

        // Defaults: si el reserva ya traía valores migrados, los preservamos;
        // si no, ponemos los textos por defecto que estaban hardcodeados.
        $carruselData = [
            'carousel_title'       => $reservaData['carousel_title']       ?? 'Servicio técnico Musalem',
            'carousel_description' => $reservaData['carousel_description'] ?? 'Nuestro objetivo está enfocado en ofrecer y entregar a nuestros clientes un servicio de alto nivel en calidad y seguridad en cada reparación que realizamos.',
            'card1_image'          => $reservaData['card1_image']          ?? '',
            'card1_image_mobile'   => $reservaData['card1_image_mobile']   ?? '',
            'card2_image'          => $reservaData['card2_image']          ?? '',
            'card2_image_mobile'   => $reservaData['card2_image_mobile']   ?? '',
            'card3_image'          => $reservaData['card3_image']          ?? '',
            'card3_image_mobile'   => $reservaData['card3_image_mobile']   ?? '',
            'text1_titulo'         => $reservaData['text1_titulo']         ?? 'Los inicios',
            'text1_subtitulo'      => $reservaData['text1_subtitulo']      ?? '1968',
            'text1_desc'           => $reservaData['text1_desc']           ?? 'Camal Musalem nace en 1968 con un taller mecánico en Ovalle, dando inicio a su desarrollo en el rubro automotriz en Ovalle y La Serena.',
            'text2_titulo'         => $reservaData['text2_titulo']         ?? 'Reparaciones, revisión y diagnóstico',
            'text2_subtitulo'      => $reservaData['text2_subtitulo']      ?? 'Servicio autorizado y atención experta',
            'text2_desc'           => $reservaData['text2_desc']           ?? 'Contamos con repuestos originales y personal técnico calificado para revisar, diagnosticar y reparar tu vehículo con la confianza y respaldo que necesitas.',
            'text3_titulo'         => $reservaData['text3_titulo']         ?? "Desabolladura\ny pintura",
            'text3_subtitulo'      => $reservaData['text3_subtitulo']      ?? 'Terminaciones de calidad para tu vehículo',
            'text3_desc'           => $reservaData['text3_desc']           ?? 'Realizamos trabajos de desabolladura, cuadratura y pintura con terminaciones óptimas, utilizando equipamiento especializado y tecnología adecuada para cada reparación.',
        ];

        SiteSection::updateOrCreate(
            ['section' => 'mantencion_carrusel'],
            ['data' => $carruselData, 'is_visible' => true, 'order' => 33],
        );

        // Limpia los campos del carrusel del mantencion_reserva (ya viven en
        // mantencion_carrusel).
        if ($reserva) {
            foreach ($carruselKeys as $k) {
                unset($reservaData[$k]);
            }
            $reserva->update(['data' => $reservaData]);
        }
    }

    public function down(): void
    {
        // No-op para no perder datos del admin.
    }
};
