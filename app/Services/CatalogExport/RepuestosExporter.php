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
            'SKU', 'Categoría', 'Imagen (URL)', 'Descripción', 'Precio',
            'Versión (compatible)', 'Comentarios',
        ];
    }

    protected function rows(): array
    {
        if ($this->templateOnly) {
            return [];
        }

        return Repuesto::orderBy('order')->orderBy('name')->get()->map(function (Repuesto $r) {
            return [
                $r->sku,
                $r->category,
                $r->images[0] ?? null,
                $r->name,
                $r->price,
                $r->compatible_with,
                $r->comentarios,
            ];
        })->values()->toArray();
    }
}
