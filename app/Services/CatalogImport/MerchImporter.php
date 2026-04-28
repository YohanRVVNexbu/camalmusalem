<?php

namespace App\Services\CatalogImport;

use App\Models\Merch;
use PhpOffice\PhpSpreadsheet\IOFactory;
use Symfony\Component\HttpFoundation\File\UploadedFile;

class MerchImporter
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
                'description'     => $this->str($row[2]),
                'description_tech'=> $this->str($row[3]),
                'category'        => $this->str($row[4]) ?? 'merch',
                'subcategory'     => $this->str($row[6]),
                'size'            => $this->str($row[7]),
                'price'           => $this->str($row[8]),
                'price_offer'     => $this->str($row[9]),
                'status'          => $this->str($row[10]) ?? 'disponible',
                'branch'          => $this->str($row[11]),
                'is_visible'      => true,
            ];

            $existing = $sku ? Merch::where('sku', $sku)->first() : null;
            if ($existing) {
                $existing->update($data);
                $result->updated++;
            } else {
                Merch::create($data);
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
}
