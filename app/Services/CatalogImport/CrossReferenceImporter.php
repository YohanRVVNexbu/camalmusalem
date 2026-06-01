<?php

namespace App\Services\CatalogImport;

use App\Models\Accesorio;
use App\Models\Merch;
use App\Models\Repuesto;
use PhpOffice\PhpSpreadsheet\IOFactory;
use Symfony\Component\HttpFoundation\File\UploadedFile;

/**
 * Sincroniza PRECIOS desde el archivo "Cross Reference" de Toyota (el mismo que
 * se actualiza a diario), leyendo SOLO la pestaña "Data".
 *
 * Layout nativo de la pestaña "Data" (no se reordena nada):
 *   col 0 = SKU (Número de Material) · col 1 = MSRP (precio) · col 8 = Descriptor (nombre)
 *
 * Como "Data" NO clasifica accesorio/repuesto/merch, este importador solo
 * ACTUALIZA por SKU los productos que ya existen en cualquiera de los 3
 * mantenedores. No crea nuevos (no sabría su categoría). Los SKU que no
 * existan se reportan para que el equipo los cargue a mano con su categoría.
 */
class CrossReferenceImporter
{
    /** @return array{updated:int, matched_skus:int, not_found:array<int,string>, rows:int} */
    public function import(UploadedFile $file): array
    {
        $reader = IOFactory::createReaderForFile($file->getPathname());
        $reader->setReadDataOnly(true); // ignora imágenes/estilos → rápido y liviano
        try {
            $reader->setLoadSheetsOnly(['Data']); // solo la hoja tabular
        } catch (\Throwable $e) {
            // si el reader no soporta filtrar hojas, se carga completo igual
        }

        $spreadsheet = $reader->load($file->getPathname());
        $sheet = $spreadsheet->getSheetByName('Data') ?? $spreadsheet->getActiveSheet();
        $rows = $sheet->toArray(null, true, true, false);

        $updated = 0;
        $matched = 0;
        $notFound = [];
        $dataRows = 0;

        foreach (array_slice($rows, 1) as $row) {
            $sku = trim((string) ($row[0] ?? ''));
            if ($sku === '') {
                continue;
            }
            $dataRows++;

            $price = preg_replace('/[^0-9]/', '', (string) ($row[1] ?? ''));
            // Sin precio o precio 0 → no tocamos (evita borrar un precio real con un MSRP vacío/0)
            if ($price === '' || $price === '0') {
                continue;
            }

            $found = false;
            foreach ([Accesorio::class, Repuesto::class, Merch::class] as $model) {
                foreach ($model::where('sku', $sku)->get() as $item) {
                    $item->update(['price' => $price]);
                    $updated++;
                    $found = true;
                }
            }

            if ($found) {
                $matched++;
            } else {
                $notFound[] = $sku;
            }
        }

        return [
            'updated'      => $updated,
            'matched_skus' => $matched,
            'not_found'    => $notFound,
            'rows'         => $dataRows,
        ];
    }
}
