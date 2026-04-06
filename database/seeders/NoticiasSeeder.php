<?php

namespace Database\Seeders;

use App\Models\Noticia;
use Illuminate\Database\Seeder;

class NoticiasSeeder extends Seeder
{
    public function run(): void
    {
        $noticias = [
            [
                'title'        => 'Toyota BZ4X: el eléctrico que redefine la movilidad en Chile',
                'slug'         => 'toyota-bz4x-electrico-movilidad-chile',
                'excerpt'      => 'El Toyota BZ4X llegó para revolucionar la forma en que nos movemos. Con 516 km de autonomía y carga rápida, es el eléctrico más completo del mercado.',
                'content'      => '<p>El Toyota BZ4X representa el futuro de la movilidad eléctrica en Chile. Con una autonomía de hasta 516 km en ciclo WLTP y capacidad de carga rápida de hasta 150 kW, este SUV eléctrico combina tecnología de punta con el confort que caracteriza a Toyota.</p><p>En Camal Musalem, primer concesionario de la Región de Coquimbo en contar con el BZ4X en stock, puedes conocerlo en persona y realizar un test drive sin costo.</p>',
                'image'        => null,
                'published_at' => now()->subDays(5),
                'is_visible'   => true,
                'order'        => 1,
            ],
            [
                'title'        => 'Servicio técnico certificado: mantén tu Toyota en perfectas condiciones',
                'slug'         => 'servicio-tecnico-certificado-toyota-musalem',
                'excerpt'      => 'Nuestro taller cuenta con técnicos certificados por Toyota y repuestos 100% originales para que tu vehículo siempre esté en óptimas condiciones.',
                'content'      => '<p>El servicio técnico de Camal Musalem está equipado con tecnología de diagnóstico oficial Toyota y personal certificado directamente por la marca. Usamos únicamente repuestos originales para garantizar el rendimiento y la garantía de tu vehículo.</p><p>Agenda tu mantención en línea y recibe un descuento especial en tu primera visita.</p>',
                'image'        => null,
                'published_at' => now()->subDays(12),
                'is_visible'   => true,
                'order'        => 2,
            ],
            [
                'title'        => 'Nueva Hilux 2024: más potente, más conectada',
                'slug'         => 'nueva-hilux-2024-potente-conectada',
                'excerpt'      => 'La Hilux 2024 llega con motor 2.8L de 204 HP, nueva pantalla de 9 pulgadas y conectividad inalámbrica para Android Auto y Apple CarPlay.',
                'content'      => '<p>La nueva generación de la Hilux llega con importantes mejoras en desempeño y conectividad. El motor 2.8L turbodiesel ahora entrega 204 HP y 500 Nm de torque, lo que la convierte en la pickup más potente de su segmento.</p><p>La nueva pantalla táctil de 9 pulgadas con Apple CarPlay y Android Auto inalámbrico llevan la conectividad a otro nivel. Visítanos en nuestras sucursales de La Serena y Ovalle para conocerla.</p>',
                'image'        => null,
                'published_at' => now()->subDays(20),
                'is_visible'   => true,
                'order'        => 3,
            ],
        ];

        foreach ($noticias as $n) {
            Noticia::updateOrCreate(['slug' => $n['slug']], $n);
        }
    }
}
