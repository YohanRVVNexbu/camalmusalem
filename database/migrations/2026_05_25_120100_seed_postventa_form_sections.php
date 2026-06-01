<?php

use App\Models\SiteSection;
use Illuminate\Database\Migrations\Migration;

/**
 * Crea las secciones administrables que hasta ahora estaban hardcoded en
 * las páginas /post-venta/agendar-mantencion, /post-venta/repuestos y
 * /post-venta/accesorios. Sigue el mismo patrón que kinto_formulario:
 * solo guarda paths y textos, las imágenes default viven en
 * `resources/images/...` (Vite las resuelve si la sección viene vacía).
 *
 * Tres secciones:
 *  - mantencion_reserva  → bloque "Reserva tu hora" + carrusel + step images
 *  - repuestos_seccion   → bloque "Encargo de repuestos" + form de encargo
 *  - accesorios_seccion  → bloque "Merch Oficial Toyota"
 */
return new class extends Migration {
    public function up(): void
    {
        SiteSection::updateOrCreate(['section' => 'mantencion_reserva'], [
            'data' => [
                'carousel_title'        => 'Servicio técnico Musalem',
                'carousel_description'  => 'Nuestro objetivo está enfocado en ofrecer y entregar a nuestros clientes un servicio de alto nivel en calidad y seguridad en cada reparación que realizamos.',
                'title'                 => 'Reserva tu hora',
                'description'           => 'Ahorra tiempo programando el servicio aquí mismo. Después de enviar el formulario, nos pondremos en contacto para confirmar su cita de servicio.',
                'button_text'           => 'Ir a agendar servicio',
                'image'                 => '',
                'image_mobile'          => '',
                'step2_image'           => '',
                'step2_image_mobile'    => '',
                'step4_image'           => '',
                'step4_image_mobile'    => '',
            ],
            'is_visible' => true,
            'order' => 34,
        ]);

        SiteSection::updateOrCreate(['section' => 'repuestos_seccion'], [
            'data' => [
                'title'              => "Repuestos\nCamal Musalem",
                'description'        => 'Disponemos de repuestos, accesorios y equipamiento para mantener y mejorar su vehículo, con opciones en seguridad, conectividad, audio y soluciones certificadas para faenas industriales y mineras.',
                'card_title'         => "Encargo\nde repuestos",
                'card_text'          => "Solicitamos el repuesto que necesites\n\nSi el repuesto no se encuentra disponible en nuestras dependencias, lo gestionamos directamente con las bodegas centrales de Toyota. El plazo de llegada es de 24 horas hábiles, con un abono mínimo del 50% del valor del repuesto.\nTambién ofrecemos despacho a domicilio o a la oficina de transportes que el cliente indique.",
                'card_subtext'       => 'Pedidos después de las 16:00 horas se consideran para la solicitud del día siguiente.',
                'image'              => '',
                'image_mobile'       => '',
                'form_title'         => "Solicitud de encargo\nde repuestos",
                'form_description'   => 'Ahorra tiempo cotizando sus repuestos aquí mismo. Después de enviar el formulario, nos pondremos en contacto para entregarle información.',
                'form_button_text'   => 'Solicitar repuestos',
                'form_image'         => '',
                'form_image_mobile'  => '',
            ],
            'is_visible' => true,
            'order' => 35,
        ]);

        SiteSection::updateOrCreate(['section' => 'accesorios_seccion'], [
            'data' => [
                'title'        => "Merch\nOficial Toyota",
                'description'  => 'Accesorios, prendas y productos oficiales que reflejan el estilo Toyota. Visítanos en nuestras sucursales Musalem y encuentra tus favoritos.',
                'image'        => '',
                'image_mobile' => '',
            ],
            'is_visible' => true,
            'order' => 36,
        ]);
    }

    public function down(): void
    {
        SiteSection::whereIn('section', [
            'mantencion_reserva',
            'repuestos_seccion',
            'accesorios_seccion',
        ])->delete();
    }
};
