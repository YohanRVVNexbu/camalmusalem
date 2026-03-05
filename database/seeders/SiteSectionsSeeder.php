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

        $url = fn (string $path) => Storage::disk('public')->url($path);

        SiteSection::updateOrCreate(['section' => 'hero'], [
            'data' => [
                'background_video' => $url('home/hero/hero_video.mp4'),
                'subtitle' => 'Concesionario Toyota',
                'title' => "Tu próximo auto,\nte espera en Musalem",
                'description' => "Vehículos nuevos, seminuevos certificados y servicio técnico de excelencia.\nMás de 25 años siendo líderes en la Región de Coquimbo.",
                'primary_button' => ['text' => 'Ver catálogo', 'href' => '#vehiculos'],
                'secondary_button' => ['text' => 'Cotizar', 'href' => '#cotizar'],
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
                        'href' => '#vehiculos',
                        'image' => $url('home/features/imagen_nuevos.png'),
                        'video' => $url('home/features/nuevos.mp4'),
                    ],
                    [
                        'title' => 'Semi nuevos',
                        'description' => 'Stock certificado por Musalem',
                        'button_label' => 'Ir a semi nuevos',
                        'href' => '#seminuevos',
                        'image' => $url('home/features/imagen_seminuevos.png'),
                        'video' => $url('home/features/usados.mp4'),
                    ],
                    [
                        'title' => 'Post venta',
                        'description' => 'Servicios, repuestos y Merch oficial',
                        'button_label' => 'Ir a post venta',
                        'href' => '#postventa',
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
                'button_href' => '#seminuevos',
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
                        'x' => 2, 'y' => 0, 'w' => 2, 'h' => 5,
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
                        'x' => 4, 'y' => 0, 'w' => 2, 'h' => 5,
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
                        'x' => 2, 'y' => 5, 'w' => 4, 'h' => 5,
                        'content' => [
                            'image' => $url('home/programas/image_grid5.png'),
                        ],
                    ],
                ],
            ],
            'is_visible' => true,
            'order' => 5,
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
                    ['label' => 'Vehículos', 'href' => '#vehiculos'],
                    ['label' => 'Seminuevos', 'href' => '#seminuevos'],
                    ['label' => 'Postventa', 'href' => '#postventa'],
                    ['label' => 'Contáctanos', 'href' => '#contacto'],
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
                    'Aviso legal',
                    'Ley 20.393',
                    'Mapa del sitio',
                    'Bases legales',
                    'Compliance',
                    'Ley de Prevención del delito',
                ],
                'copyright' => 'Copyright Camal Musalem',
            ],
            'is_visible' => true,
            'order' => 7,
        ]);
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
