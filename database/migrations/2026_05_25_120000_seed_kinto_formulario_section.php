<?php

use App\Models\SiteSection;
use Illuminate\Database\Migrations\Migration;

/**
 * Crea la sección `kinto_formulario` que controla la sección
 * "Solicita tu arriendo Kinto en Musalem" en /kinto y las imágenes de los
 * pasos 2 y 3 del wizard de solicitud. Hasta ahora estos textos e
 * imágenes estaban hardcoded en kinto.tsx.
 *
 * Mantiene el patrón del resto del sitio: la sección guarda solo paths a
 * archivos subidos por admin. Si el campo viene vacío, el frontend cae al
 * import default que Vite resuelve desde `resources/images/`.
 */
return new class extends Migration {
    public function up(): void
    {
        SiteSection::updateOrCreate(['section' => 'kinto_formulario'], [
            'data' => [
                'title'              => "Solicita tu arriendo\nKinto en Musalem",
                'description'        => 'Conoce la opción de arriendo disponible a través de KINTO y déjanos tu solicitud para que un asesor de Musalem te contacte y te ayude a gestionar el proceso según sucursal, disponibilidad y fecha estimada.',
                'button_text'        => 'Solicitar arriendo Kinto',
                'image'              => '',
                'image_mobile'       => '',
                'step2_image'        => '',
                'step2_image_mobile' => '',
                'step3_image'        => '',
                'step3_image_mobile' => '',
            ],
            'is_visible' => true,
            'order' => 33,
        ]);
    }

    public function down(): void
    {
        SiteSection::where('section', 'kinto_formulario')->delete();
    }
};
