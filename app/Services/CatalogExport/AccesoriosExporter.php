<?php

namespace App\Services\CatalogExport;

use App\Models\Accesorio;

class AccesoriosExporter extends BaseExporter
{
    public function __construct(private bool $templateOnly = false) {}

    protected function sheetTitle(): string
    {
        return 'Catalogo Accesorios';
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

        return Accesorio::orderBy('order')->orderBy('name')->get()->map(function (Accesorio $a) {
            return [
                $a->sku,
                $a->name,
                $a->description,
                null,
                $a->price,
                $a->price_offer,
                null,
                $a->category,
                null,
                null,
                $a->compatible_with,
                null,
                null,
                null,
            ];
        })->values()->toArray();
    }
}
