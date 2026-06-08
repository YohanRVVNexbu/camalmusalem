<?php

namespace App\Services\CatalogImport;

use App\Models\Accesorio;
use App\Models\Merch;
use App\Models\Repuesto;
use PhpOffice\PhpSpreadsheet\IOFactory;
use Symfony\Component\HttpFoundation\File\UploadedFile;

/**
 * Sincroniza PRECIOS y STOCK desde el archivo "Cross Reference" de Toyota (el
 * mismo que se actualiza a diario), leyendo SOLO la pestaña "Data".
 *
 * Layout nativo de la pestaña "Data" (no se reordena nada):
 *   col 0 = SKU (Número de Material) · col 1 = MSRP (precio) ·
 *   col 2 = STOCK (las hojas de catálogo lo traen con =VLOOKUP(SKU,Data!A:C,3,0);
 *           el encabezado es la fecha del snapshot) · col 8 = Descriptor (nombre)
 *
 * Como "Data" NO clasifica accesorio/repuesto/merch, este importador solo
 * ACTUALIZA por SKU los productos que ya existen en cualquiera de los 3
 * mantenedores. No crea nuevos (no sabría su categoría). Los SKU que no
 * existan se reportan para que el equipo los cargue a mano con su categoría.
 *
 * Regla de stock (pedido del cliente): si el stock viene en 0, el producto se
 * despublica (is_visible=false) automáticamente; si vuelve a tener stock (>0),
 * se republica. Un stock vacío/no numérico NO toca la publicación. Ojo: esto
 * puede republicar algo que el admin ocultó a mano si la lista trae stock>0.
 *
 * IVA: el MSRP de la pestaña "Data" viene NETO (sin IVA). El operador ingresa
 * el % de IVA antes de importar y se aplica a cada precio (`MSRP × (1+%/100)`),
 * tanto al crear como al actualizar. Con 0 no se aplica IVA (guarda el neto).
 */
class CrossReferenceImporter
{
    /**
     * @param  float  $ivaPercent  Porcentaje de IVA a aplicar sobre el MSRP neto (ej. 19).
     * @return array{updated:int, matched_skus:int, not_found:array<int,string>, rows:int, hidden:int, shown:int}
     */
    public function import(UploadedFile $file, float $ivaPercent = 0.0): array
    {
        $reader = IOFactory::createReaderForFile($file->getPathname());
        $reader->setReadDataOnly(true); // ignora imágenes/estilos → rápido y liviano

        // Antes de filtrar por la hoja "Data" verificamos que exista. Si pedimos
        // setLoadSheetsOnly(['Data']) en un archivo que no la tiene, PhpSpreadsheet
        // carga 0 hojas y luego revienta con "out of bounds index: 0".
        $availableSheets = [];
        try {
            $availableSheets = $reader->listWorksheetNames($file->getPathname());
        } catch (\Throwable $e) {
            // si el reader no soporta listar (ej. CSV), seguimos con el flujo
            // normal y el error termina siendo capturado más abajo
        }

        if (! empty($availableSheets)) {
            $hasData = in_array('Data', $availableSheets, true);
            if (! $hasData) {
                $names = implode(', ', $availableSheets);
                throw new \RuntimeException(
                    "El archivo no tiene la pestaña 'Data' (requerida por el formato Cross Reference de Toyota). "
                    . "Hojas encontradas: {$names}. "
                    . "Verifica que estés subiendo el archivo Cross Reference original sin renombrar la pestaña."
                );
            }
            try {
                $reader->setLoadSheetsOnly(['Data']);
            } catch (\Throwable $e) {
                // si el reader no soporta filtrar, se carga completo igual
            }
        }

        $spreadsheet = $reader->load($file->getPathname());
        $sheet = $spreadsheet->getSheetByName('Data') ?? $spreadsheet->getActiveSheet();
        $rows = $sheet->toArray(null, true, true, false);

        $updated = 0;
        $matched = 0;
        $notFound = [];
        $dataRows = 0;
        $hidden = 0;
        $shown = 0;

        foreach (array_slice($rows, 1) as $row) {
            $sku = trim((string) ($row[0] ?? ''));
            if ($sku === '') {
                continue;
            }
            $dataRows++;

            $price = preg_replace('/[^0-9]/', '', (string) ($row[1] ?? ''));
            // Precio válido = no vacío y distinto de 0 (evita borrar un precio
            // real con un MSRP vacío/0). OJO: ya NO saltamos la fila acá, porque
            // un producto sin stock suele venir también con precio 0 y hay que
            // procesarlo igual para poder ocultarlo.
            $priceValid = $price !== '' && $price !== '0';
            // El MSRP viene neto; aplicamos el IVA ingresado por el operador.
            $finalPrice = $priceValid
                ? (string) ($ivaPercent > 0 ? (int) round((int) $price * (1 + $ivaPercent / 100)) : (int) $price)
                : null;

            // Stock en col 2 (C). Solo decide publicación cuando es numérico:
            //   0  → ocultar (is_visible=false)
            //   >0 → republicar (is_visible=true)
            //   vacío / no numérico → no se toca la publicación.
            $stockRaw = $row[2] ?? null;
            $visibility = is_numeric($stockRaw) ? ((int) $stockRaw) > 0 : null;

            // Si no hay nada que hacer (ni precio válido ni decisión de stock),
            // no tocamos el producto.
            if (! $priceValid && $visibility === null) {
                continue;
            }

            $found = false;
            foreach ([Accesorio::class, Repuesto::class, Merch::class] as $model) {
                foreach ($model::where('sku', $sku)->get() as $item) {
                    $changes = [];
                    if ($priceValid) {
                        $changes['price'] = $finalPrice;
                    }
                    if ($visibility !== null) {
                        $changes['is_visible'] = $visibility;
                    }
                    if ($changes) {
                        $item->update($changes);
                    }

                    if ($priceValid) {
                        $updated++;
                    }
                    if ($visibility === false) {
                        $hidden++;
                    } elseif ($visibility === true) {
                        $shown++;
                    }
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
            'hidden'       => $hidden,
            'shown'        => $shown,
        ];
    }
}
