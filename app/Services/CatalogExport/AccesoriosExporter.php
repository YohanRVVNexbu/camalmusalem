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
            'SKU', 'Categoría', 'Imagen (URL)', 'Descripción', 'Precio',
            'Versión (compatible)', 'Comentarios',
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
                $a->category,
                $a->images[0] ?? null,
                $a->name,
                $a->price,
                $a->compatible_with,
                $a->comentarios,
            ];
        })->values()->toArray();
    }
}
