<?php

namespace Database\Seeders;

use App\Models\Branch;
use Illuminate\Database\Seeder;

class BranchesSeeder extends Seeder
{
    public function run(): void
    {
        $branches = [
            [
                'slug' => 'la-serena',
                'name' => 'Sucursal La Serena',
                'address' => 'Av. Francisco de Aguirre #070',
                'city' => 'La Serena',
                'maps_url' => 'https://www.google.com/maps/search/Av.+Francisco+de+Aguirre+070,+La+Serena,+Chile',
                'phone' => '(51) 2 543 775',
                'phone_sucursal' => '(51) 2 543 775',
                'phone_repuestos' => '(51) 2 543 775',
                'phones_servicio_tecnico' => ['(51) 2 544 710', '(51) 2 544 711'],
            ],
            [
                'slug' => 'ovalle',
                'name' => 'Sucursal Ovalle',
                'address' => 'Ariztía #358',
                'city' => 'Ovalle',
                'maps_url' => 'https://www.google.com/maps/search/Ariztia+358,+Ovalle,+Chile',
                'phone' => '(53) 2 433 277',
                'phone_sucursal' => '(53) 2 433 277',
                'phone_repuestos' => '(53) 2 433 223',
                'phones_servicio_tecnico' => ['(53) 2 433 229'],
            ],
        ];

        foreach ($branches as $i => $b) {
            Branch::updateOrCreate(['slug' => $b['slug']], [
                ...$b,
                'display_order' => $i,
                'is_active' => true,
            ]);
        }
    }
}
