<?php

namespace Database\Seeders;

use App\Models\Seminuevo;
use Illuminate\Database\Seeder;

class SeminuevosSeeder extends Seeder
{
    public function run(): void
    {
        $seminuevos = [
            ['brand' => 'Toyota', 'model' => 'Hilux SR5 4x4', 'year' => 2022, 'km' => 45000, 'price' => '$ 22.500.000', 'fuel' => 'Diésel', 'transmission' => 'Automática', 'traction' => '4x4', 'doors' => 4, 'seats' => 5, 'color' => 'Blanco Perla', 'description' => null, 'gallery' => [], 'order' => 1],
            ['brand' => 'Toyota', 'model' => 'Corolla XEI 2.0', 'year' => 2023, 'km' => 18000, 'price' => '$ 14.900.000', 'fuel' => 'Gasolina', 'transmission' => 'Automática CVT', 'traction' => '4x2', 'doors' => 4, 'seats' => 5, 'color' => 'Negro Attitude', 'description' => null, 'gallery' => [], 'order' => 2],
            ['brand' => 'Toyota', 'model' => 'RAV4 Hybrid', 'year' => 2021, 'km' => 62000, 'price' => '$ 19.800.000', 'fuel' => 'Híbrido', 'transmission' => 'Automática CVT', 'traction' => '4x4', 'doors' => 5, 'seats' => 5, 'color' => 'Rojo Barcelona', 'description' => null, 'gallery' => [], 'order' => 3],
            ['brand' => 'Toyota', 'model' => 'Yaris GR Sport', 'year' => 2023, 'km' => 8000, 'price' => '$ 11.200.000', 'fuel' => 'Gasolina', 'transmission' => 'Automática CVT', 'traction' => '4x2', 'doors' => 5, 'seats' => 5, 'color' => 'Azul Celestial', 'description' => null, 'gallery' => [], 'order' => 4],
            ['brand' => 'Toyota', 'model' => 'Fortuner 4x4', 'year' => 2020, 'km' => 78000, 'price' => '$ 25.500.000', 'fuel' => 'Diésel', 'transmission' => 'Automática 6V', 'traction' => '4x4', 'doors' => 5, 'seats' => 7, 'color' => 'Blanco Glaciar', 'description' => null, 'gallery' => [], 'order' => 5],
            ['brand' => 'Toyota', 'model' => 'Land Cruiser Prado', 'year' => 2019, 'km' => 95000, 'price' => '$ 32.000.000', 'fuel' => 'Diésel', 'transmission' => 'Automática 6V', 'traction' => '4x4', 'doors' => 5, 'seats' => 7, 'color' => 'Gris Gunmetal', 'description' => null, 'gallery' => [], 'order' => 6],
        ];

        foreach ($seminuevos as $s) {
            Seminuevo::create($s);
        }
    }
}
