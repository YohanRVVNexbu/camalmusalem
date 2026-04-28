<?php

namespace App\Services\CatalogImport;

use App\Models\VehicleVersion;
use PhpOffice\PhpSpreadsheet\IOFactory;
use Symfony\Component\HttpFoundation\File\UploadedFile;

/**
 * Importa únicamente los precios y bonos de vehículos nuevos.
 * Columnas esperadas:
 *   A: ID (vehicle_version.id)
 *   B: Precio Lista CLP (msrp_clp)
 *   C: Bono Marca (bono_marca)
 *   D: Bono R9 (bono_financiamiento_r9)
 *   E: Bono Financiamiento Tradicional (bono_financiamiento_tradicional)
 *
 * Las columnas F en adelante (Marca, Modelo, etc.) son de referencia, se ignoran.
 */
class ListaPreciosImporter
{
    public function import(UploadedFile $file): ImportResult
    {
        $result = new ImportResult;
        $spreadsheet = IOFactory::load($file->getPathname());
        $rows = $spreadsheet->getActiveSheet()->toArray(null, true, true, false);

        foreach (array_slice($rows, 1) as $i => $row) {
            $rowNum = $i + 2;

            $id = $row[0] ?? null;
            if (! is_numeric($id)) {
                continue;
            }

            $version = VehicleVersion::find((int) $id);
            if (! $version) {
                $result->addError($rowNum, "ID {$id} no existe.");
                continue;
            }

            $version->update([
                'msrp_clp'                       => $this->int($row[1] ?? null),
                'bono_marca'                      => $this->int($row[2] ?? null),
                'bono_financiamiento_r9'          => $this->int($row[3] ?? null),
                'bono_financiamiento_tradicional' => $this->int($row[4] ?? null),
            ]);
            $result->updated++;
        }

        return $result;
    }

    private function int(mixed $val): ?int
    {
        if ($val === null || $val === '') {
            return null;
        }
        // Limpiar formato "$39.990.000" → 39990000
        $clean = preg_replace('/[^\d]/', '', (string) $val);

        return $clean !== '' ? (int) $clean : null;
    }
}
