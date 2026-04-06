<?php

namespace Database\Seeders;

use App\Models\Repuesto;
use Illuminate\Database\Seeder;

class RepuestosSeeder extends Seeder
{
    public function run(): void
    {
        $repuestos = [
            ['name' => 'Filtro de aceite Hilux 2.8', 'sku' => 'TOY-04152-YZZA6', 'description' => 'Filtro de aceite original Toyota para motor 2.8L diésel Hilux.', 'price' => '$ 18.500', 'category' => 'Filtros', 'images' => [], 'stock_la_serena' => true, 'stock_ovalle' => true, 'order' => 1],
            ['name' => 'Filtro de aire BZ4X', 'sku' => 'TOY-17801-YZZ20', 'description' => 'Filtro de aire original para Toyota BZ4X eléctrico.', 'price' => '$ 24.900', 'category' => 'Filtros', 'images' => [], 'stock_la_serena' => true, 'stock_ovalle' => false, 'order' => 2],
            ['name' => 'Pastillas de freno delanteras Corolla', 'sku' => 'TOY-04465-02220', 'description' => 'Set pastillas de freno delanteras originales para Corolla.', 'price' => '$ 45.000', 'category' => 'Frenos', 'images' => [], 'stock_la_serena' => true, 'stock_ovalle' => true, 'order' => 3],
            ['name' => 'Discos de freno traseros Hilux', 'sku' => 'TOY-43512-0K030', 'description' => 'Par de discos de freno traseros para Hilux SR5.', 'price' => '$ 89.000', 'category' => 'Frenos', 'images' => [], 'stock_la_serena' => true, 'stock_ovalle' => true, 'order' => 4],
            ['name' => 'Amortiguador delantero RAV4', 'sku' => 'TOY-48510-0R030', 'description' => 'Amortiguador delantero original Toyota para RAV4.', 'price' => '$ 125.000', 'category' => 'Suspensión', 'images' => [], 'stock_la_serena' => true, 'stock_ovalle' => false, 'order' => 5],
            ['name' => 'Correa de distribución Yaris', 'sku' => 'TOY-13568-69085', 'description' => 'Correa de distribución original para Toyota Yaris 1.5L.', 'price' => '$ 35.000', 'category' => 'Motor', 'images' => [], 'stock_la_serena' => true, 'stock_ovalle' => true, 'order' => 6],
            ['name' => 'Bujías iridium Corolla', 'sku' => 'TOY-90919-01253', 'description' => 'Set de 4 bujías de iridio originales Toyota para Corolla.', 'price' => '$ 28.000', 'category' => 'Motor', 'images' => [], 'stock_la_serena' => true, 'stock_ovalle' => true, 'order' => 7],
            ['name' => 'Aceite Motor 5W30 5L', 'sku' => 'TOY-ACEITE-5W30', 'description' => 'Aceite de motor sintético Toyota 5W30 lata 5 litros.', 'price' => '$ 32.000', 'category' => 'Lubricantes', 'images' => [], 'stock_la_serena' => true, 'stock_ovalle' => true, 'order' => 8],
        ];

        foreach ($repuestos as $r) {
            Repuesto::updateOrCreate(['sku' => $r['sku']], $r);
        }
    }
}
