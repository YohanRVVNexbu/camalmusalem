<?php

namespace App\Services\CatalogImport;

use App\Models\Accesorio;
use PhpOffice\PhpSpreadsheet\IOFactory;
use Symfony\Component\HttpFoundation\File\UploadedFile;

class AccesoriosImporter
{
    public function import(UploadedFile $file): ImportResult
    {
        $result = new ImportResult;
        $spreadsheet = IOFactory::load($file->getPathname());
        $sheet = $spreadsheet->getActiveSheet();
        $rows = $sheet->toArray(null, true, true, false);

        foreach (array_slice($rows, 1) as $i => $row) {
            $rowNum = $i + 2;

            $sku  = trim((string) ($row[0] ?? ''));
            $name = trim((string) ($row[1] ?? ''));

            if ($name === '' && $sku === '') {
                continue;
            }
            if ($name === '') {
                $result->addError($rowNum, 'Nombre vacío, fila omitida.');
                continue;
            }

            $data = [
                'sku'             => $sku ?: null,
                'name'            => $name,
                'description'     => $this->str($row[2]) ?? $this->str($row[3]),
                'price'           => $this->str($row[4]),
                'price_offer'     => $this->str($row[5]),
                'category'        => $this->str($row[7]) ?? 'General',
                'compatible_with' => $this->buildCompatible($row[10] ?? null, $row[11] ?? null),
                'is_visible'      => true,
            ];

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

    private function buildCompatible(mixed $models, mixed $years): ?string
    {
        $parts = array_filter([$this->str($models), $this->str($years)]);

        return $parts ? implode(' — ', $parts) : null;
    }
}
