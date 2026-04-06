<?php

namespace Database\Seeders;

use App\Models\Accesorio;
use Illuminate\Database\Seeder;

class AccesoriosSeeder extends Seeder
{
    public function run(): void
    {
        $accesorios = [
            ['name' => 'Polera Toyota Logo', 'description' => 'Polera de algodón con logo Toyota bordado. Disponible en tallas S, M, L, XL.', 'price' => '$ 15.000', 'category' => 'Ropa', 'images' => [], 'order' => 1],
            ['name' => 'Chaqueta Toyota Racing', 'description' => 'Chaqueta cortavientos con logo Toyota Racing. Tallas S a XXL.', 'price' => '$ 45.000', 'category' => 'Ropa', 'images' => [], 'order' => 2],
            ['name' => 'Gorro Toyota Cap', 'description' => 'Gorro con visera y logo Toyota bordado. Talla única ajustable.', 'price' => '$ 12.000', 'category' => 'Accesorios', 'images' => [], 'order' => 3],
            ['name' => 'Llavero Toyota Metal', 'description' => 'Llavero metálico con logo Toyota en relieve.', 'price' => '$ 8.000', 'category' => 'Accesorios', 'images' => [], 'order' => 4],
            ['name' => 'Taza Toyota Cerámica', 'description' => 'Taza de cerámica 350ml con logo Toyota. Apta para lavavajillas.', 'price' => '$ 9.500', 'category' => 'Hogar', 'images' => [], 'order' => 5],
            ['name' => 'Auto a Escala Hilux 1:18', 'description' => 'Réplica a escala 1:18 del Toyota Hilux. Detalles metálicos.', 'price' => '$ 35.000', 'category' => 'Juguetes', 'images' => [], 'order' => 6],
            ['name' => 'Auto a Escala Corolla 1:18', 'description' => 'Réplica a escala 1:18 del Toyota Corolla. Colores auténticos.', 'price' => '$ 32.000', 'category' => 'Juguetes', 'images' => [], 'order' => 7],
            ['name' => 'Mochila Toyota', 'description' => 'Mochila de poliéster con logo Toyota. Capacidad 25L, compartimento laptop.', 'price' => '$ 28.000', 'category' => 'Accesorios', 'images' => [], 'order' => 8],
        ];

        foreach ($accesorios as $a) {
            Accesorio::updateOrCreate(['name' => $a['name']], $a);
        }
    }
}
