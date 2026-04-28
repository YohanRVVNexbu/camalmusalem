<?php

namespace App\Services\CatalogExport;

use App\Models\Merch;

class MerchExporter extends BaseExporter
{
    public function __construct(private bool $templateOnly = false) {}

    protected function sheetTitle(): string
    {
        return 'Catalogo Merch';
    }

    protected function headers(): array
    {
        return [
            'Codigo Interno', 'Nombre Merch', 'Descripcion corta', 'Descripcion tecnica',
            'Categoria principal', 'Compatibilidad', 'Subcategoria', 'Talla',
            'Precio', 'Precio Oferta', 'Estado', 'Disponible en', 'Fotografia',
        ];
    }

    protected function rows(): array
    {
        if ($this->templateOnly) {
            return [];
        }

        return Merch::orderBy('order')->orderBy('name')->get()->map(function (Merch $m) {
            return [
                $m->sku,
                $m->name,
                $m->description,
                $m->description_tech,
                $m->category,
                null,
                $m->subcategory,
                $m->size,
                $m->price,
                $m->price_offer,
                $m->status,
                $m->branch,
                null,
            ];
        })->values()->toArray();
    }
}
