<?php

namespace Database\Seeders;

use App\Models\SiteSection;
use Illuminate\Database\Seeder;

class PageSectionsSeeder extends Seeder
{
    public function run(): void
    {
        $sections = $this->sections();

        foreach ($sections as $key => $data) {
            SiteSection::updateOrCreate(
                ['section' => $key],
                [
                    'data'         => $data,
                    'default_data' => $data,
                    'is_visible'   => true,
                    'order'        => 0,
                ]
            );
        }
    }

    private function sections(): array
    {
        return [

            // ─── KINTO ───────────────────────────────────────────────────────
            'kinto_hero' => [
                'hero_image'  => '',
                'title'       => "Arrienda con KINTO\ndesde Musalem",
                'description' => 'Con KINTO puedes reservar, retirar y usar un Toyota directamente desde la app. En Musalem te orientamos durante el proceso y te ayudamos a encontrar la alternativa disponible que mejor se adapte a tu necesidad, ya sea por horas, días o semanas.',
                'button_text' => 'Descargar app KINTO',
            ],
            'kinto_pasos' => [
                'title' => '¿Cómo funciona KINTO en Musalem?',
                'pasos' => [
                    ['img' => '', 'titulo' => 'Paso 1:', 'subtitulo' => 'Descarga la app KINTO Share y conoce cómo funciona el servicio.'],
                    ['img' => '', 'titulo' => 'Paso 2:', 'subtitulo' => 'Completa el formulario con tu interés o solicitud para que podamos orientarte.'],
                    ['img' => '', 'titulo' => 'Paso 3:', 'subtitulo' => 'Un asesor de Musalem te contactará para ayudarte a revisar la disponibilidad y continuar la gestión desde la sucursal correspondiente.'],
                ],
            ],
            'kinto_vehiculos' => [
                'title'     => 'Vehículos disponibles',
                'vehiculos' => [
                    ['nombre' => 'Corolla Cross', 'precio' => 'Desde $18.300 la hora', 'img' => ''],
                    ['nombre' => 'Rav4',          'precio' => 'Desde $18.300 la hora', 'img' => ''],
                ],
            ],

            // ─── NOSOTROS ────────────────────────────────────────────────────
            'nosotros_hero' => [
                'hero_image' => '',
                'subtitle'   => 'Nosotros',
                'title'      => 'Camal Musalem',
            ],
            'nosotros_historia' => [
                'title'   => 'Nuestra historia',
                'content' => "Camal Musalem se formó en el año 1968 con un taller mecánico en la ciudad de Ovalle, lo que posteriormente permitió su desarrollo en el rubro automotriz en las ciudades de Ovalle y La Serena.\n\nEn 1986, la empresa se convierte en concesionario oficial de la marca Toyota e incorpora posteriormente las áreas de venta de automóviles y venta de repuestos, emplazándose en Avenida Francisco de Aguirre 350, en La Serena.\n\nMás adelante, se instalan sucursales de servicio técnico autorizado en ambas ciudades y, en 1994, se abre una sucursal adicional exclusiva para servicio técnico en Avenida Francisco de Aguirre 0124, en la capital regional.\n\nEn 2009, se inaugura un centro integral como casa matriz, donde se concentran los servicios de venta de vehículos nuevos, venta de repuestos y servicio técnico. La empresa desarrolla sus labores con herramientas, maquinarias e insumos, bajo normas y condiciones de seguridad y funcionalidad que aseguran el cumplimiento de los estándares establecidos por TOYOTA CHILE S.A.",
            ],
            'nosotros_mision' => [
                'title' => 'Nuestra misión',
                'text'  => '«Camal Musalem, es una empresa del servicio automotriz, orientada a entregar un producto y servicio de calidad, comprometido con la mejora continua de sus procesos (KAIZEN) y preocupada de la fidelización de nuestros clientes.»',
                'image' => '',
            ],
            'nosotros_vision' => [
                'title' => 'Nuestra visión',
                'text'  => '«Llegar a ser líderes en ventas y servicios de la zona norte de nuestro país, apoyados de un crecimiento sustentable en el tiempo y comprometidos con el medio ambiente.»',
                'image' => '',
            ],
            'nosotros_equipo' => [
                'title'   => 'Equipo Musalem',
                'members' => [
                    ['nombre' => 'Gonzalo Inostroza', 'cargo' => 'Asesor de ventas',              'img' => ''],
                    ['nombre' => 'Alex Morales',       'cargo' => 'Asesor de Ventas',              'img' => ''],
                    ['nombre' => 'Fabricio Aponte',    'cargo' => 'Administrativo Telemarketing',  'img' => ''],
                    ['nombre' => 'Rodrigo Espinosa',   'cargo' => 'Asesor de Ventas de Repuestos', 'img' => ''],
                ],
            ],
            'nosotros_reconocimientos' => [
                'title' => 'Reconocimientos',
                'items' => [
                    ['nombre' => 'Nombre reconocimiento', 'año' => '2010', 'img' => ''],
                    ['nombre' => 'Nombre reconocimiento', 'año' => '2012', 'img' => ''],
                    ['nombre' => 'Nombre reconocimiento', 'año' => '2015', 'img' => ''],
                    ['nombre' => 'Nombre reconocimiento', 'año' => '2018', 'img' => ''],
                    ['nombre' => 'Nombre reconocimiento', 'año' => '2020', 'img' => ''],
                    ['nombre' => 'Nombre reconocimiento', 'año' => '2023', 'img' => ''],
                ],
            ],

            // ─── CONTACTO ────────────────────────────────────────────────────
            'contacto_info' => [
                'form_image'    => '',
                // Horario administrable como lista. Esta misma data se
                // comparte vía HandleInertiaRequests y la usan también
                // las páginas de mantención y repuestos (single source).
                'horarios' => [
                    ['label' => 'Lunes a Jueves',  'value' => '09:00 a 13:30 - 14:45 a 18:30'],
                    ['label' => 'Viernes',         'value' => '09:00 a 13:30 - 14:45 a 17:30'],
                    ['label' => 'Sábado',          'value' => '09:00 a 13:00'],
                    ['label' => 'Domingo',         'value' => 'Cerrado'],
                ],
                'email'         => 'info@camalmusalem.cl',
                'form_title'    => 'Contacto',
                'form_subtitle' => '¿En qué te podemos ayudar?',
                'form_desc'     => 'Completa el formulario y nuestro equipo se pondrá en contacto contigo a la brevedad.',
            ],

            // ─── PROGRAMAS ───────────────────────────────────────────────────
            'programas_hero' => [
                'hero_image' => '',
                'title'      => 'Programas Toyota',
            ],
            'programas_grid' => [
                'title' => 'Descubre todos nuestros programas',
                'items' => [
                    ['img' => '', 'title' => 'App Mundo Toyota',   'desc' => 'Accede al historial de mantenciones, revisa pautas y precios, agenda servicios, suma puntos y descubre beneficios, descuentos y comercios asociados desde una sola aplicación.', 'link' => '#'],
                    ['img' => '', 'title' => 'Kinto',              'desc' => 'Movilidad flexible, directo desde tu celular. Con Kinto SHARE puedes reservar, retirar y usar tu Toyota desde la app, sin trámites ni complicaciones.', 'link' => '#'],
                    ['img' => '', 'title' => 'Kinto One',          'desc' => 'Programa de arriendo Toyota que contempla dos modalidades: Business, orientado a empresas con necesidad de flota, y Personal, con periodos de 12, 24, 36 y 48 meses.', 'link' => '#'],
                    ['img' => '', 'title' => 'Beyond Zero',        'desc' => 'Una iniciativa de Toyota que reúne su visión de movilidad sostenible a través de vehículos híbridos y eléctricos, orientada a reducir el impacto ambiental y avanzar hacia la neutralidad de carbono.', 'link' => '#'],
                    ['img' => '', 'title' => 'Toyota 10 Relax',    'desc' => 'Entrega una cobertura adicional de hasta 5 años o 200.000 km, lo que ocurra primero.', 'link' => '#'],
                    ['img' => '', 'title' => 'Llamado a revisión', 'desc' => 'Campañas de revisión y reemplazo preventivo para ciertos modelos Toyota, realizadas con repuestos originales y orientadas a mantener la seguridad de tu vehículo.', 'link' => '#'],
                ],
            ],
            'programas_mantenimiento' => [
                'image'        => '',
                'image_mobile' => '',
                'title'        => '¿Buscas mantenimiento?',
                'description'  => "Reserva tu hora aquí mismo\n\nRealizamos los chequeos y cambios necesarios según el kilometraje indicado para mantener tu vehículo en óptimas condiciones y conservar la garantía vigente.",
                'button_label' => 'Ir a reservar',
                'button_href'  => '/post-venta/agendar-mantencion',
            ],

            // ─── NOTICIAS ────────────────────────────────────────────────────
            'noticias_hero' => [
                'hero_image' => '',
                'title'      => 'Noticias / Blog Musalem',
            ],

            // ─── SHORTS ──────────────────────────────────────────────────────
            'shorts_hero' => [
                'hero_image' => '',
                'title'      => 'Shorts Musalem',
                'subtitle'   => 'Contenido corto y dinámico sobre el mundo Toyota.',
            ],

            // ─── SEMINUEVOS ──────────────────────────────────────────────────
            'seminuevos_hero' => [
                'banner_image' => '',
                'title'        => 'Seminuevos Toyota',
                'description'  => 'Encuentra tu próximo vehículo entre nuestra selección de seminuevos certificados.',
            ],

            // ─── POST-VENTA REPUESTOS ─────────────────────────────────────────
            'repuestos_hero' => [
                'hero_image'  => '',
                'title'       => 'Repuestos',
                'description' => 'Encuentra los repuestos originales Toyota que necesitas.',
            ],

            // ─── POST-VENTA ACCESORIOS ────────────────────────────────────────
            'accesorios_hero' => [
                'hero_image'  => '',
                'title'       => 'Accesorios y Merch',
                'description' => 'Personaliza tu Toyota con nuestros accesorios originales.',
            ],

            // ─── MANTENCIÓN ──────────────────────────────────────────────────
            'mantencion_hero' => [
                'hero_image'  => '',
                'title'       => 'Servicio técnico',
                'description' => 'Reserva tu hora de mantención de forma rápida y sencilla.',
            ],
        ];
    }
}
