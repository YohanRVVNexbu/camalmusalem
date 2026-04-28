<?php

namespace App\Services\CatalogExport;

use App\Models\Repuesto;

class RepuestosExporter extends BaseExporter
{
    public function __construct(private bool $templateOnly = false) {}

    protected function sheetTitle(): string
    {
        return 'Catalogo Repuestos';
    }

    protected function headers(): array
    {
        return [
            'Codigo Interno', 'Nombre Repuesto', 'Descripcion corta',
            'Descripción tecnica', 'Precio', 'Precio Oferta', 'Precio instalado',
            'Categoria', 'Inventario / stock', 'Tiempo estimado de entrega',
            'Compatible con', 'Año vehiculo compatible', 'Disponible en', 'Fotografia',
        ];
    }

    protected function rows(): array
    {
        if ($this->templateOnly) {
            return [];
        }

        return Repuesto::orderBy('order')->orderBy('name')->get()->map(function (Repuesto $r) {
            $disponible = array_filter([
                $r->stock_la_serena ? 'Sucursal La Serena' : null,
                $r->stock_ovalle    ? 'Sucursal Ovalle'    : null,
            ]);

            return [
                $r->sku,
                $r->name,
                $r->description,
                null,
                $r->price,
                $r->price_offer,
                null,
                $r->category,
                null,
                null,
                $r->compatible_with,
                null,
                implode(' / ', $disponible),
                null,
            ];
        })->values()->toArray();
    }
}
