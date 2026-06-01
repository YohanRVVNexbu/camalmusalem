<?php

namespace App\Services\CatalogImport;

use App\Models\Accesorio;
use PhpOffice\PhpSpreadsheet\IOFactory;
use Symfony\Component\HttpFoundation\File\UploadedFile;

class AccesoriosImporter
{
    /**
     * Columnas esperadas (fila 1 = cabeceras, fila 2+ = datos):
     *   0 SKU · 1 Categoría · 2 Imagen (URL) · 3 Descripción (nombre) ·
     *   4 Precio · 5 Versión (compatible) · 6 Comentarios
     */
    public function import(UploadedFile $file): ImportResult
    {
        $result = new ImportResult;
        $spreadsheet = IOFactory::load($file->getPathname());
        $sheet = $spreadsheet->getActiveSheet();
        $rows = $sheet->toArray(null, true, true, false);

        foreach (array_slice($rows, 1) as $i => $row) {
            $rowNum = $i + 2;

            $sku  = trim((string) ($row[0] ?? ''));
            $name = trim((string) ($row[3] ?? '')); // "Descripción" es el nombre del artículo

            if ($name === '' && $sku === '') {
                continue;
            }
            if ($name === '') {
                $result->addError($rowNum, 'Descripción (nombre) vacía, fila omitida.');
                continue;
            }

            $data = [
                'sku'             => $sku ?: null,
                'category'        => $this->str($row[1]) ?? 'General',
                'name'            => $name,
                'price'           => $this->money($row[4]),
                'compatible_with' => $this->str($row[5]),
                'comentarios'     => $this->str($row[6]),
                'is_visible'      => true,
            ];

            // La imagen es una URL; solo la seteamos si viene, para no borrar
            // las fotos ya cargadas cuando la columna está vacía en una recarga.
            $image = $this->str($row[2]);
            if ($image !== null) {
                $data['images'] = [$image];
            }

            $existing = $sku ? Accesorio::where('sku', $sku)->first() : null;
            if ($existing) {
                $existing->update($data);
                $result->updated++;
            } else {
                Accesorio::create($data);
                $result->created++;
            }
        }

        return $result;
    }

    private function str(mixed $val): ?string
    {
        $s = trim((string) ($val ?? ''));

        return $s !== '' ? $s : null;
    }

    /**
     * Normaliza un valor monetario a SOLO dígitos ("14,790,000" → "14790000").
     */
    private function money(mixed $val): ?string
    {
        $digits = preg_replace('/[^0-9]/', '', (string) ($val ?? ''));

        return $digits !== '' ? $digits : null;
    }
}
