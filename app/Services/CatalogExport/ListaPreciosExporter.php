<?php

namespace App\Services\CatalogExport;

use App\Models\VehicleVersion;

class ListaPreciosExporter extends BaseExporter
{
    protected function sheetTitle(): string
    {
        return 'Lista de Precios';
    }

    protected function headers(): array
    {
        return [
            'ID',
            'Precio Lista CLP',
            'Bono Marca',
            'Bono Financiamiento R9',
            'Bono Financiamiento Tradicional',
            // Referencia (solo lectura, no se importa)
            'Marca', 'Modelo', 'Versión', 'Año',
            // Precios calculados (solo referencia)
            'Precio Bono Marca*',
            'Precio Bono R9*',
            'Precio Bono Financiamiento Trad.*',
        ];
    }

    protected function rows(): array
    {
        return VehicleVersion::with('model.brand')
            ->where('is_active', true)
            ->orderBy('vehicle_model_id')
            ->orderBy('display_order')
            ->get()
            ->map(function (VehicleVersion $v) {
                $precioBono    = $v->msrp_clp && $v->bono_marca
                    ? $v->msrp_clp - $v->bono_marca : null;
                $precioR9      = $precioBono && $v->bono_financiamiento_r9
                    ? $precioBono - $v->bono_financiamiento_r9 : null;
                $precioTrad    = $precioBono && $v->bono_financiamiento_tradicional
                    ? $precioBono - $v->bono_financiamiento_tradicional : null;

                return [
                    $v->id,
                    $v->msrp_clp,
                    $v->bono_marca,
                    $v->bono_financiamiento_r9,
                    $v->bono_financiamiento_tradicional,
                    $v->model->brand->name,
                    $v->model->name,
                    $v->trim_name,
                    $v->model_year,
                    $precioBono,
                    $precioR9,
                    $precioTrad,
                ];
            })->values()->toArray();
    }
}
