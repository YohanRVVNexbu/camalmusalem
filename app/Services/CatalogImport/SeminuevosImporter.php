<?php

namespace App\Services\CatalogImport;

use App\Models\Seminuevo;
use Illuminate\Support\Str;
use PhpOffice\PhpSpreadsheet\IOFactory;
use Symfony\Component\HttpFoundation\File\UploadedFile;

class SeminuevosImporter
{
    // Cabeceras esperadas (fila 1 contiene subcabeceras, fila 2 contiene datos)
    // La hoja tiene una fila de cabeceras en fila 1 (VU, Marca, Modelo, …)

    public function import(UploadedFile $file): ImportResult
    {
        $result = new ImportResult;
        $spreadsheet = IOFactory::load($file->getPathname());
        $sheet = $spreadsheet->getActiveSheet();
        $rows = $sheet->toArray(null, true, true, false);

        // Fila 1: cabeceras principales, Fila 2+: datos
        foreach (array_slice($rows, 1) as $i => $row) {
            $rowNum = $i + 2;

            $vu    = trim((string) ($row[0] ?? ''));
            $brand = trim((string) ($row[1] ?? ''));
            $model = trim((string) ($row[2] ?? ''));

            // Valores de la fila (null si la celda viene vacía).
            $price     = $this->money($row[9]);   // Precio lista (CLP)
            $financed  = $this->money($row[10]);  // Precio con Financiamiento
            $offer     = $this->money($row[11]);  // Precio Oferta (opcional)
            $year      = (int) ($row[3] ?? 0);
            $color     = $this->str($row[4]);
            $km        = (int) ($row[19] ?? 0);
            $fuel      = $this->str($row[18]);
            $transmission = $this->str($row[14]);
            $traction  = $this->str($row[13]);
            $certCell  = trim((string) ($row[6] ?? ''));
            $specs     = $this->parseSpecs($row);

            // Fila completamente vacía → se omite.
            if ($vu === '' && $brand === '' && $model === '' && $price === null) {
                continue;
            }

            // ── ACTUALIZACIÓN por VU: si el VU ya existe, hacemos un update
            // PARCIAL — solo se tocan las columnas que vienen CON valor. Esto
            // permite la "actualización de precios" cargando solo VU + columnas
            // de precio, sin borrar el resto (km, año, fotos, equipamiento, etc.).
            if ($vu !== '') {
                $existing = Seminuevo::where('vu_code', $vu)->first();
                if ($existing) {
                    $updates = [];
                    if ($price !== null)        $updates['price']        = $price;
                    if ($financed !== null)     $updates['down_payment'] = $financed;
                    if ($offer !== null)        $updates['price_offer']  = $offer;
                    if ($brand !== '')          $updates['brand']        = $brand;
                    if ($model !== '')          $updates['model']        = $model;
                    if ($year > 0)              $updates['year']         = $year;
                    if ($color !== null)        $updates['color']        = $color;
                    if ($km > 0)                $updates['km']           = $km;
                    if ($fuel !== null)         $updates['fuel']         = $fuel;
                    if ($transmission !== null) $updates['transmission'] = $transmission;
                    if ($traction !== null)     $updates['traction']     = $traction;
                    if ($certCell !== '')       $updates['certified']    = $this->parseCertified($certCell);
                    if (! empty($specs))        $updates['specs']        = $specs;

                    if (! empty($updates)) {
                        $existing->update($updates);
                    }
                    $result->updated++;

                    continue;
                }
            }

            // ── CREAR un seminuevo nuevo: aquí sí exigimos Marca + Modelo (no se
            // puede crear un vehículo solo con VU + precio).
            if ($brand === '' || $model === '') {
                $result->addError($rowNum, 'Para crear un vehículo nuevo se requiere Marca y Modelo. Si querías actualizar uno existente, revisa que el VU coincida.');
                continue;
            }

            Seminuevo::create([
                'brand'        => $brand,
                'model'        => $model,
                'vu_code'      => $vu ?: null,
                'slug'         => Str::slug("{$brand}-{$model}-{$year}-".Str::random(4)),
                'year'         => $year ?: null,
                'color'        => $color,
                'km'           => $km,
                'price'        => $price,
                'down_payment' => $financed,
                'price_offer'  => $offer,
                'fuel'         => $fuel,
                'transmission' => $transmission,
                'traction'     => $traction,
                'certified'    => $certCell !== '' ? $this->parseCertified($certCell) : false,
                'specs'        => $specs ?: null,
                'is_visible'   => true,
            ]);
            $result->created++;
        }

        return $result;
    }

    private function parseSpecs(array $row): array
    {
        $labels = [
            20 => 'Sistema de frenos ABS',
            21 => 'Distribución electrónica de frenado (EBD)',
            22 => 'Asistencia de frenado de emergencia (BA)',
            23 => 'Control de estabilidad ESP/VSC',
            24 => 'Control de tracción (TCS/TRC)',
            25 => 'Control estabilidad remolque (TSC)',
            26 => 'Asistente arranque en pendiente (HAC)',
            27 => 'Asistente de descenso (DAC)',
            28 => 'Diferencial electrónico (e-LSD)',
            29 => 'Dirección asistida eléctrica',
            30 => 'Frenos de disco ventilados',
            31 => 'Mandos al volante',
            32 => 'Cámara de retroceso',
            33 => 'Bluetooth',
            34 => 'Android Auto',
            35 => 'Apple CarPlay',
            36 => 'Sensores de retroceso',
            37 => 'Neblineros',
            38 => 'Llantas de aleación',
            39 => 'Espejos eléctricos',
            40 => 'Techo panorámico',
            41 => 'Aire acondicionado',
            42 => 'Climatizador / Bi-zona',
            43 => 'Espejos eléctricos (ext.)',
            44 => 'Dos copias de llave',
        ];

        $specs = [];
        foreach ($labels as $idx => $label) {
            $val = $row[$idx] ?? null;
            if ($val !== null && $val !== '') {
                $specs[$label] = $this->parseBool($val);
            }
        }

        return $specs;
    }

    /**
     * Interpreta la columna "Certificación Toyota Usados". Como puede traer
     * "Si", "X", "Certificado", una fecha o un código, tratamos como
     * certificado cualquier valor NO vacío que no sea explícitamente negativo.
     */
    private function parseCertified(mixed $val): bool
    {
        $v = mb_strtolower(trim((string) ($val ?? '')));

        return $v !== '' && ! in_array($v, ['no', '0', 'false', 'n/a', '-', 'sin', 'sin certificar', 'no certificado']);
    }

    private function parseBool(mixed $val): bool
    {
        if (is_bool($val)) {
            return $val;
        }
        $v = mb_strtolower(trim((string) $val));

        return in_array($v, ['1', 'si', 'sí', 'yes', 'true', 'x', 'ok']);
    }

    private function str(mixed $val): ?string
    {
        $s = trim((string) ($val ?? ''));

        return $s !== '' ? $s : null;
    }

    /**
     * Normaliza un valor monetario a SOLO dígitos (canónico para la BD).
     * Quita separadores de miles, símbolos y espacios ("14,790,000" → "14790000").
     * Devuelve null si no quedan dígitos.
     */
    private function money(mixed $val): ?string
    {
        $digits = preg_replace('/[^0-9]/', '', (string) ($val ?? ''));

        return $digits !== '' ? $digits : null;
    }
}
