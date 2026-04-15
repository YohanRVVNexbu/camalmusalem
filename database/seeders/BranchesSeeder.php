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
                'phone' => null,
            ],
            [
                'slug' => 'ovalle',
                'name' => 'Sucursal Ovalle',
                'address' => 'Ariztía #358',
                'city' => 'Ovalle',
                'maps_url' => 'https://www.google.com/maps/search/Ariztia+358,+Ovalle,+Chile',
                'phone' => null,
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
