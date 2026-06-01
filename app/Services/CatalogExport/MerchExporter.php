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
            'SKU', 'Categoría', 'Imagen (URL)', 'Descripción', 'Precio', 'Comentarios',
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
                $m->category,
                $m->images[0] ?? null,
                $m->name,
                $m->price,
                $m->comentarios,
            ];
        })->values()->toArray();
    }
}
