<?php

namespace Database\Seeders;

use App\Models\SiteSection;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

class SiteSectionsSeeder extends Seeder
{
    public function run(): void
    {
        $this->copyAssets();
        $this->copyDefaults();

        // Devolvemos paths RELATIVOS (/storage/...) en vez de absolutos
        // (https://APP_URL/storage/...). Esto evita que la BD quede
        // contaminada con el dominio del entorno donde se corrió el seeder:
        // si seedeás en local con APP_URL=http://camalmusalem.test, antes
        // los <img src> apuntaban a ese host hardcodeado y rompían en prod.
        // Los paths relativos se resuelven contra el host actual de cada
        // request, así la misma data funciona en local, staging y prod.
        $url = fn (string $path) => '/storage/' . ltrim($path, '/');

        SiteSection::updateOrCreate(['section' => 'hero'], [
            'data' => [
                'background_video' => $url('home/hero/hero_video.mp4'),
                'subtitle' => 'Concesionario Toyota',
                'title' => "Tu próximo auto,\nte espera en Musalem",
                'description' => "Vehículos nuevos, seminuevos certificados y servicio técnico de excelencia.\nMás de 25 años siendo líderes en la Región de Coquimbo.",
                'primary_button' => ['text' => 'Ver catálogo', 'href' => '/nuevos'],
                'secondary_button' => ['text' => 'Cotizar', 'href' => '/contacto'],
            ],
            'is_visible' => true,
            'order' => 1,
        ]);

        SiteSection::updateOrCreate(['section' => 'features'], [
            'data' => [
                'heading' => 'Encuentra todo en un solo lugar',
                'cards' => [
                    [
                        'title' => 'Nuevos',
                        'description' => 'Explora la gama Toyota disponible en Musalem',
                        'button_label' => 'Ir a nuevos',
                        'href' => '/nuevos',
                        'image' => $url('home/features/imagen_nuevos.png'),
                        'video' => $url('home/features/nuevos.mp4'),
                    ],
                    [
                        'title' => 'Semi nuevos',
                        'description' => 'Stock certificado por Musalem',
                        'button_label' => 'Ir a semi nuevos',
                        'href' => '/seminuevos',
                        'image' => $url('home/features/imagen_seminuevos.png'),
                        'video' => $url('home/features/usados.mp4'),
                    ],
                    [
                        'title' => 'Post venta',
                        'description' => 'Servicios, repuestos y Merch oficial',
                        'button_label' => 'Ir a post venta',
                        'href' => '/post-venta/agendar-mantencion',
                        'image' => $url('home/features/image_postventa.png'),
                        'video' => $url('home/features/postventa.mp4'),
                    ],
                ],
            ],
            'is_visible' => true,
            'order' => 2,
        ]);

        SiteSection::updateOrCreate(['section' => 'about'], [
            'data' => [
                'cta_text' => 'Más detalles',
                'cta_href' => '#detalles',
                'vehicles' => [
                    [
                        'name' => 'BZ4X',
                        'subtitle' => '100% Eléctrico, nuevo',
                        'headline' => "MÁS QUE UN ELÉCTRICO,\nUN ELÉCTRICO TOYOTA.",
                        'image' => $url('home/about/BZ4X.png'),
                        'video' => $url('home/about/BZ4X.mp4'),
                        'background_image' => null,
                        'duration' => null,
                    ],
                    [
                        'name' => '4RUNNER',
                        'subtitle' => 'Nueva generación,',
                        'headline' => "AVENTURA SIN LÍMITES\nCON 4RUNNER.",
                        'image' => $url('home/about/4RUNNER.png'),
                        'video' => $url('home/about/4RUNNER.mp4'),
                        'background_image' => null,
                        'duration' => null,
                    ],
                    [
                        'name' => 'HILUX',
                        'subtitle' => 'La más vendida,',
                        'headline' => "POTENCIA Y DURABILIDAD\nEN CADA CAMINO.",
                        'image' => $url('home/about/HILUX.png'),
                        'video' => null,
                        'background_image' => $url('home/about/video.png'),
                        'duration' => 5,
                    ],
                ],
            ],
            'is_visible' => true,
            'order' => 3,
        ]);

        SiteSection::updateOrCreate(['section' => 'seminuevos'], [
            'data' => [
                'title' => 'Seminuevos',
                'description' => 'Seminuevos Certificados y listos para su entrega.',
                'button_text' => 'Ver todos',
                'button_href' => '/seminuevos',
                'vehicles' => [
                    [
                        'image' => $url('home/seminuevos/imagen_seminuevos.png'),
                        'badge' => 'Seminuevo',
                        'year' => '2023',
                        'brand' => 'BMW',
                        'name' => "Bmw x1 sdrive 18l 1.5 T\nConfort",
                        'km' => '53.000 Km',
                        'transmission' => 'AT',
                        'fuel' => 'Diesel',
                        'price' => '$ 29.990.000',
                    ],
                    [
                        'image' => $url('home/seminuevos/imagen_seminuevos.png'),
                        'badge' => 'Seminuevo',
                        'year' => '2022',
                        'brand' => 'Toyota',
                        'name' => "Toyota Corolla Cross\n2.0 SEG CVT",
                        'km' => '32.000 Km',
                        'transmission' => 'AT',
                        'fuel' => 'Bencina',
                        'price' => '$ 22.490.000',
                    ],
                    [
                        'image' => $url('home/seminuevos/imagen_seminuevos.png'),
                        'badge' => 'Seminuevo',
                        'year' => '2024',
                        'brand' => 'Toyota',
                        'name' => "Toyota Hilux 2.8 SRX\n4x4 AT",
                        'km' => '12.000 Km',
                        'transmission' => 'AT',
                        'fuel' => 'Diesel',
                        'price' => '$ 35.990.000',
                    ],
                ],
            ],
            'is_visible' => true,
            'order' => 4,
        ]);

        SiteSection::updateOrCreate(['section' => 'programas'], [
            'data' => [
                'title' => 'Programas Toyota',
                'button_text' => 'Ver todos',
                'button_href' => '#programas',
                'grid_items' => [
                    [
                        'id' => 'mundo-toyota',
                        'type' => 'mundo_toyota',
                        'x' => 0, 'y' => 0, 'w' => 2, 'h' => 6,
                        'content' => [
                            'title_line1' => 'Descubre',
                            'title_line2' => 'Mundo Toyota',
                            'description' => 'Descarga y crea tu cuenta App Mundo Toyota y en Musalem te regalamos un chequeo preventivo.',
                            'subtitle' => 'Disponible en App Store y Google Play',
                            'button_text' => 'Descargar App',
                            'button_href' => '#descargar',
                            'image' => $url('home/programas/image_grid1.png'),
                        ],
                    ],
                    [
                        'id' => 'card-1',
                        'type' => 'card',
                        'x' => 2, 'y' => 0, 'w' => 2, 'h' => 6,
                        'content' => [
                            'title' => 'Llamado a revisión',
                            'description' => 'Ingresa y conoce si tu Toyota puede acceder a una revisión gratuita de seguridad.',
                            'image' => $url('home/programas/image_grid2.png'),
                            'href' => '#',
                        ],
                    ],
                    [
                        'id' => 'card-2',
                        'type' => 'card',
                        'x' => 4, 'y' => 0, 'w' => 2, 'h' => 6,
                        'content' => [
                            'title' => 'Reserva tu hora',
                            'description' => 'Servicio técnico',
                            'image' => $url('home/programas/image_grid3.png'),
                            'href' => '#',
                        ],
                    ],
                    [
                        'id' => 'promo-image',
                        'type' => 'image',
                        'x' => 0, 'y' => 6, 'w' => 2, 'h' => 4,
                        'content' => [
                            'image' => $url('home/programas/image_grid4.png'),
                        ],
                    ],
                    [
                        'id' => 'bottom-image',
                        'type' => 'image',
                        'x' => 2, 'y' => 6, 'w' => 4, 'h' => 4,
                        'content' => [
                            'image' => $url('home/programas/image_grid5.png'),
                        ],
                    ],
                ],
            ],
            'is_visible' => true,
            'order' => 5,
        ]);

        SiteSection::updateOrCreate(['section' => 'nuevos_page'], [
            'data' => [
                'banner_image' => $url('home/features/imagen_nuevos.png'),
                'title' => 'Vehículos Nuevos',
                'description' => 'Explora la gama completa de Toyota disponible en Musalem. Encuentra el vehículo perfecto para ti.',
                'categories' => ['SUV', 'Sedán', 'Camioneta', 'Hatchback', 'Comercial'],
                'hero_cards' => [
                    ['vehicle_model_id' => null, 'image_override' => null, 'show_electric_badge' => 'auto'],
                    ['vehicle_model_id' => null, 'image_override' => null, 'show_electric_badge' => 'auto'],
                    ['vehicle_model_id' => null, 'image_override' => null, 'show_electric_badge' => 'auto'],
                    ['vehicle_model_id' => null, 'image_override' => null, 'show_electric_badge' => 'auto'],
                ],
                'vehicles' => [
                    [
                        'image' => $url('home/about/BZ4X.png'),
                        'name' => 'Toyota BZ4X',
                        'category' => 'SUV Eléctrico',
                        'price' => 'Desde $32.990.000',
                        'href' => '#',
                    ],
                    [
                        'image' => $url('home/about/4RUNNER.png'),
                        'name' => 'Toyota 4Runner',
                        'category' => 'SUV',
                        'price' => 'Desde $42.990.000',
                        'href' => '#',
                    ],
                    [
                        'image' => $url('home/about/HILUX.png'),
                        'name' => 'Toyota Hilux',
                        'category' => 'Camioneta',
                        'price' => 'Desde $24.990.000',
                        'href' => '#',
                    ],
                    [
                        'image' => $url('home/about/BZ4X.png'),
                        'name' => 'Toyota Corolla',
                        'category' => 'Sedán',
                        'price' => 'Desde $16.990.000',
                        'href' => '#',
                    ],
                    [
                        'image' => $url('home/about/4RUNNER.png'),
                        'name' => 'Toyota RAV4',
                        'category' => 'SUV',
                        'price' => 'Desde $28.990.000',
                        'href' => '#',
                    ],
                    [
                        'image' => $url('home/about/HILUX.png'),
                        'name' => 'Toyota Yaris Cross',
                        'category' => 'SUV',
                        'price' => 'Desde $18.490.000',
                        'href' => '#',
                    ],
                ],
            ],
            'is_visible' => true,
            'order' => 10,
        ]);

        SiteSection::updateOrCreate(['section' => 'seminuevos_page'], [
            'data' => [
                'banner_image' => $url('home/features/imagen_seminuevos.png'),
                'title' => 'Seminuevos Certificados',
                'description' => 'Vehículos inspeccionados y certificados por Musalem, listos para su entrega inmediata.',
                'filters' => ['Toyota', 'SUV', 'Sedán', 'Camioneta', 'Diesel', 'Bencina'],
                'vehicles' => [
                    [
                        'image' => $url('home/seminuevos/imagen_seminuevos.png'),
                        'badge' => 'Seminuevo',
                        'year' => '2023',
                        'brand' => 'BMW',
                        'name' => "Bmw x1 sdrive 18l 1.5 T\nConfort",
                        'km' => '53.000 Km',
                        'transmission' => 'AT',
                        'fuel' => 'Diesel',
                        'price' => '$ 29.990.000',
                    ],
                    [
                        'image' => $url('home/seminuevos/imagen_seminuevos.png'),
                        'badge' => 'Seminuevo',
                        'year' => '2022',
                        'brand' => 'Toyota',
                        'name' => "Toyota Corolla Cross\n2.0 SEG CVT",
                        'km' => '32.000 Km',
                        'transmission' => 'AT',
                        'fuel' => 'Bencina',
                        'price' => '$ 22.490.000',
                    ],
                    [
                        'image' => $url('home/seminuevos/imagen_seminuevos.png'),
                        'badge' => 'Seminuevo',
                        'year' => '2024',
                        'brand' => 'Toyota',
                        'name' => "Toyota Hilux 2.8 SRX\n4x4 AT",
                        'km' => '12.000 Km',
                        'transmission' => 'AT',
                        'fuel' => 'Diesel',
                        'price' => '$ 35.990.000',
                    ],
                    [
                        'image' => $url('home/seminuevos/imagen_seminuevos.png'),
                        'badge' => 'Seminuevo',
                        'year' => '2023',
                        'brand' => 'Toyota',
                        'name' => "Toyota RAV4 2.5\nHybrid XLE",
                        'km' => '18.000 Km',
                        'transmission' => 'CVT',
                        'fuel' => 'Híbrido',
                        'price' => '$ 31.490.000',
                    ],
                    [
                        'image' => $url('home/seminuevos/imagen_seminuevos.png'),
                        'badge' => 'Seminuevo',
                        'year' => '2021',
                        'brand' => 'Toyota',
                        'name' => "Toyota Yaris 1.5\nSport GLi",
                        'km' => '45.000 Km',
                        'transmission' => 'MT',
                        'fuel' => 'Bencina',
                        'price' => '$ 12.990.000',
                    ],
                    [
                        'image' => $url('home/seminuevos/imagen_seminuevos.png'),
                        'badge' => 'Seminuevo',
                        'year' => '2024',
                        'brand' => 'Toyota',
                        'name' => "Toyota Land Cruiser\nPrado VX",
                        'km' => '8.000 Km',
                        'transmission' => 'AT',
                        'fuel' => 'Diesel',
                        'price' => '$ 48.990.000',
                    ],
                ],
            ],
            'is_visible' => true,
            'order' => 11,
        ]);

        SiteSection::updateOrCreate(['section' => 'shorts'], [
            'data' => [
                'label' => 'Shorts',
                'title' => "Mantente\nactualizado",
                'description' => 'Novedades, modelos y todo lo que está pasando',
                'button_text' => 'Ver todos',
                'button_href' => '#shorts',
                'logo' => $url('home/shorts/logo_short.png'),
                'images' => [
                    $url('home/shorts/imagen_youtube1.png'),
                    $url('home/shorts/imagen_youtube2.png'),
                    $url('home/shorts/imagen_youtube3.png'),
                    $url('home/shorts/imagen_youtube4.png'),
                    $url('home/shorts/imagen_youtube1.png'),
                    $url('home/shorts/imagen_youtube2.png'),
                    $url('home/shorts/imagen_youtube3.png'),
                    $url('home/shorts/imagen_youtube4.png'),
                ],
            ],
            'is_visible' => true,
            'order' => 6,
        ]);

        SiteSection::updateOrCreate(['section' => 'footer'], [
            'data' => [
                'logo' => $url('home/footer/logo_negro.png'),
                'social_links' => [
                    'instagram' => '#',
                    'facebook' => '#',
                    'x' => '#',
                    'tiktok' => '#',
                    'youtube' => '#',
                ],
                'nav_links' => [
                    ['label' => 'Vehículos', 'href' => '/nuevos'],
                    ['label' => 'Seminuevos', 'href' => '/seminuevos'],
                    ['label' => 'Postventa', 'href' => '/post-venta/agendar-mantencion'],
                    ['label' => 'Contáctanos', 'href' => '/contacto'],
                ],
                'locations' => [
                    [
                        'title' => 'La Serena',
                        'items' => [
                            'Av. Francisco de Aguirre #070',
                            'Teléfono: (51) 2 543 775',
                            'Repuestos: (51) 2 544 712',
                            'Servicio técnico:',
                            '(51) 2 544 710',
                            '(51) 2 544 711',
                        ],
                    ],
                    [
                        'title' => 'Ovalle',
                        'items' => [
                            'Ariztía #358',
                            'Teléfono: (53) 2 433 227',
                            'Repuesto: (53) 2 433 223',
                            'Servicio técnico: (53) 2 433 229',
                            'Email: info@camalmusalem.cl',
                        ],
                    ],
                ],
                'legal_links' => [
                    ['label' => 'Aviso legal',                      'href' => '#'],
                    ['label' => 'Bases legales',                    'href' => '#'],
                    ['label' => 'Mapa del sitio',                   'href' => '#'],
                    ['label' => 'Compliance',                       'href' => '/compliance'],
                    ['label' => 'Denuncia Ley Karin',               'href' => '/compliance/denuncia-ley-karin'],
                    ['label' => 'Denuncia Ley 20.393',              'href' => '/compliance/denuncia-prevencion-delito'],
                ],
                'copyright' => 'Copyright Camal Musalem',
            ],
            'is_visible' => true,
            'order' => 7,
        ]);

        SiteSection::updateOrCreate(['section' => 'contact_cta_banner'], [
            'data' => [
                'text'         => 'Contáctanos para recibir asesoría personalizada',
                'button_label' => 'Contactar ventas',
                'button_href'  => '/contacto',
                'image'        => '',
                'image_mobile' => '',
            ],
            'is_visible' => true,
            'order' => 8,
        ]);

        SiteSection::updateOrCreate(['section' => 'whatsapp_button'], [
            'data' => [
                // Lista de contactos. Si hay 1, el botón abre directo WhatsApp;
                // si hay 2+, abre un menú para que el visitante elija.
                'contacts' => [
                    [
                        'label'   => 'Ventas La Serena',
                        'phone'   => '+56912345678',
                        'message' => 'Hola, quisiera información sobre los vehículos Toyota.',
                    ],
                    [
                        'label'   => 'Ventas Ovalle',
                        'phone'   => '+56987654321',
                        'message' => 'Hola, quisiera información sobre los vehículos Toyota.',
                    ],
                ],
            ],
            'is_visible' => true,
            'order' => 9,
        ]);

        SiteSection::updateOrCreate(['section' => 'accesorios_whatsapp'], [
            'data' => [
                'phone'   => '+56912345678',
                'message' => 'Hola, quiero cotizar por el producto',
            ],
            'is_visible' => true,
            'order' => 34,
        ]);

        SiteSection::updateOrCreate(['section' => 'compliance_hero'], [
            'data' => [
                'eyebrow'     => 'Toyota Musalem',
                'title'       => 'Compliance',
                'description' => "Conoce nuestro Modelo de Prevención del Delito (Ley 20.393), nuestra política contra el acoso y la violencia en el trabajo (Ley Karin 21.643) y los canales de denuncia habilitados para reportar cualquier irregularidad de manera confidencial.",
                'image'        => '',
                'image_mobile' => '',
            ],
            'is_visible' => true,
            'order' => 30,
        ]);

        SiteSection::updateOrCreate(['section' => 'compliance_descargas'], [
            'data' => [
                'heading'     => 'Documentos de compliance',
                'description' => 'Descarga aquí los manuales y políticas vigentes de Toyota Musalem.',
                'items' => [
                    ['titulo' => 'Manual de Prevención del Delito (Ley 20.393)', 'descripcion' => 'Versión vigente', 'file' => ''],
                    ['titulo' => 'Política Ley Karin (Ley 21.643)', 'descripcion' => 'Procedimiento de denuncia, investigación y sanción', 'file' => ''],
                    ['titulo' => 'Código de Ética y Conducta', 'descripcion' => 'Valores y conductas esperadas', 'file' => ''],
                ],
            ],
            'is_visible' => true,
            'order' => 31,
        ]);

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

        SiteSection::updateOrCreate(['section' => 'maintenance_mode'], [
            'data' => [
                'title'         => 'Estamos mejorando el sitio',
                'description'   => 'Volveremos en unos minutos. Gracias por tu paciencia.',
                'eta'           => '',
                'contact_email' => 'info@camalmusalem.cl',
                'image'         => '',
                'image_mobile'  => '',
                'show_logo'     => true,
            ],
            'is_visible' => false,
            'order'      => 100,
        ]);

        SiteSection::updateOrCreate(['section' => 'compliance_canales'], [
            'data' => [
                'heading'     => 'Canales de denuncia',
                'description' => 'Ambos canales son confidenciales. El Encargado de Prevención del Delito revisará tu mensaje y se contactará contigo si dejas tus datos.',
                'canales' => [
                    [
                        'titulo'      => 'Denuncia Ley 20.393 — Prevención del Delito',
                        'descripcion' => 'Reporta hechos relacionados con cohecho, lavado de activos, receptación, negociación incompatible y demás delitos de la Ley 20.393.',
                        'button_label' => 'Iniciar denuncia',
                        'button_href'  => '/compliance/denuncia-prevencion-delito',
                    ],
                    [
                        'titulo'      => 'Denuncia Ley Karin — Acoso y violencia en el trabajo',
                        'descripcion' => 'Canal de denuncias para situaciones de acoso laboral, acoso sexual o violencia en el trabajo bajo la Ley 21.643.',
                        'button_label' => 'Iniciar denuncia',
                        'button_href'  => '/compliance/denuncia-ley-karin',
                    ],
                ],
                'seguimiento' => [
                    'titulo'       => '¿Ya hiciste una denuncia?',
                    'descripcion'  => 'Consulta el estado de tu denuncia usando el código de seguimiento que recibiste por correo.',
                    'button_label' => 'Consultar estado',
                    'button_href'  => '/compliance/seguimiento',
                ],
            ],
            'is_visible' => true,
            'order' => 32,
        ]);

        // Snapshot current `data` as `default_data` for any home section that
        // doesn't have one yet, rewriting media URLs from /storage/home/ to
        // /storage/defaults/home/ so the originals live in a protected folder
        // that the admin upload flow never deletes.
        SiteSection::whereNull('default_data')->each(function (SiteSection $s) {
            $s->update(['default_data' => $this->rewriteToDefaults($s->data)]);
        });
    }

    /**
     * Recursively rewrite any `/storage/home/...` URL inside the given value
     * so it points to `/storage/defaults/home/...`.
     */
    private function rewriteToDefaults(mixed $value): mixed
    {
        if (is_array($value)) {
            return array_map(fn ($v) => $this->rewriteToDefaults($v), $value);
        }

        if (is_string($value)) {
            return preg_replace('#(/storage/)home/#', '$1defaults/home/', $value);
        }

        return $value;
    }

    private function copyDefaults(): void
    {
        $imageMap = [
            'home/features' => ['imagen_nuevos.png', 'imagen_seminuevos.png', 'image_postventa.png'],
            'home/about' => ['BZ4X.png', '4RUNNER.png', 'HILUX.png', 'video.png'],
            'home/seminuevos' => ['imagen_seminuevos.png'],
            'home/programas' => ['image_grid1.png', 'image_grid2.png', 'image_grid3.png', 'image_grid4.png', 'image_grid5.png'],
            'home/shorts' => ['imagen_youtube1.png', 'imagen_youtube2.png', 'imagen_youtube3.png', 'imagen_youtube4.png', 'logo_short.png'],
            'home/footer' => ['logo_negro.png'],
        ];

        foreach ($imageMap as $dest => $files) {
            foreach ($files as $file) {
                $source = resource_path("images/{$file}");
                if (file_exists($source) && ! Storage::disk('public')->exists("defaults/{$dest}/{$file}")) {
                    Storage::disk('public')->put("defaults/{$dest}/{$file}", file_get_contents($source));
                }
            }
        }

        $videoMap = [
            'home/hero' => ['hero_video.mp4'],
            'home/features' => ['nuevos.mp4', 'usados.mp4', 'postventa.mp4'],
            'home/about' => ['BZ4X.mp4', '4RUNNER.mp4'],
        ];

        foreach ($videoMap as $dest => $files) {
            foreach ($files as $file) {
                $source = resource_path("videos/{$file}");
                if (file_exists($source) && ! Storage::disk('public')->exists("defaults/{$dest}/{$file}")) {
                    Storage::disk('public')->put("defaults/{$dest}/{$file}", file_get_contents($source));
                }
            }
        }
    }

    private function copyAssets(): void
    {
        $imageMap = [
            'home/features' => ['imagen_nuevos.png', 'imagen_seminuevos.png', 'image_postventa.png'],
            'home/about' => ['BZ4X.png', '4RUNNER.png', 'HILUX.png', 'video.png'],
            'home/seminuevos' => ['imagen_seminuevos.png'],
            'home/programas' => ['image_grid1.png', 'image_grid2.png', 'image_grid3.png', 'image_grid4.png', 'image_grid5.png'],
            'home/shorts' => ['imagen_youtube1.png', 'imagen_youtube2.png', 'imagen_youtube3.png', 'imagen_youtube4.png', 'logo_short.png'],
            'home/footer' => ['logo_negro.png'],
        ];

        foreach ($imageMap as $dest => $files) {
            foreach ($files as $file) {
                $source = resource_path("images/{$file}");
                if (file_exists($source) && ! Storage::disk('public')->exists("{$dest}/{$file}")) {
                    Storage::disk('public')->put("{$dest}/{$file}", file_get_contents($source));
                }
            }
        }

        $videoMap = [
            'home/hero' => ['hero_video.mp4'],
            'home/features' => ['nuevos.mp4', 'usados.mp4', 'postventa.mp4'],
            'home/about' => ['BZ4X.mp4', '4RUNNER.mp4'],
        ];

        foreach ($videoMap as $dest => $files) {
            foreach ($files as $file) {
                $source = resource_path("videos/{$file}");
                if (file_exists($source) && ! Storage::disk('public')->exists("{$dest}/{$file}")) {
                    Storage::disk('public')->put("{$dest}/{$file}", file_get_contents($source));
                }
            }
        }
    }
}
