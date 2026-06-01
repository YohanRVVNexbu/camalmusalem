<?php

use App\Models\SiteSection;
use Illuminate\Database\Migrations\Migration;

/**
 * Convierte el carrusel "Servicio técnico Musalem" de una estructura fija
 * (3 imágenes + 3 textos alternados, con claves planas card1_image, text1_*, etc.)
 * a una lista dinámica `cards: Card[]` donde cada Card es:
 *   { type: 'image', desktop: url, mobile: url }
 *   { type: 'text',  titulo, subtitulo, desc }
 *
 * Así el admin puede agregar/quitar/reordenar cards libremente y el público
 * renderiza la lista tal cual. Migra los datos existentes 1:1 al nuevo formato
 * y limpia las claves viejas.
 */
return new class extends Migration {
    public function up(): void
    {
        $section = SiteSection::where('section', 'mantencion_carrusel')->first();
        if (! $section) {
            return;
        }

        $data = $section->data ?? [];

        // Si ya migrado, no rehacer.
        if (isset($data['cards']) && is_array($data['cards'])) {
            return;
        }

        $cards = [
            ['type' => 'image', 'desktop' => $data['card1_image'] ?? '', 'mobile' => $data['card1_image_mobile'] ?? ''],
            ['type' => 'text',  'titulo' => $data['text1_titulo'] ?? 'Los inicios', 'subtitulo' => $data['text1_subtitulo'] ?? '1968', 'desc' => $data['text1_desc'] ?? 'Camal Musalem nace en 1968 con un taller mecánico en Ovalle, dando inicio a su desarrollo en el rubro automotriz en Ovalle y La Serena.'],
            ['type' => 'image', 'desktop' => $data['card2_image'] ?? '', 'mobile' => $data['card2_image_mobile'] ?? ''],
            ['type' => 'text',  'titulo' => $data['text2_titulo'] ?? 'Reparaciones, revisión y diagnóstico', 'subtitulo' => $data['text2_subtitulo'] ?? 'Servicio autorizado y atención experta', 'desc' => $data['text2_desc'] ?? 'Contamos con repuestos originales y personal técnico calificado para revisar, diagnosticar y reparar tu vehículo con la confianza y respaldo que necesitas.'],
            ['type' => 'image', 'desktop' => $data['card3_image'] ?? '', 'mobile' => $data['card3_image_mobile'] ?? ''],
            ['type' => 'text',  'titulo' => $data['text3_titulo'] ?? "Desabolladura\ny pintura", 'subtitulo' => $data['text3_subtitulo'] ?? 'Terminaciones de calidad para tu vehículo', 'desc' => $data['text3_desc'] ?? 'Realizamos trabajos de desabolladura, cuadratura y pintura con terminaciones óptimas, utilizando equipamiento especializado y tecnología adecuada para cada reparación.'],
        ];

        $newData = [
            'carousel_title'       => $data['carousel_title']       ?? 'Servicio técnico Musalem',
            'carousel_description' => $data['carousel_description'] ?? 'Nuestro objetivo está enfocado en ofrecer y entregar a nuestros clientes un servicio de alto nivel en calidad y seguridad en cada reparación que realizamos.',
            'cards'                => $cards,
        ];

        $section->update(['data' => $newData]);
    }

    public function down(): void
    {
        // No-op para no perder datos.
    }
};
