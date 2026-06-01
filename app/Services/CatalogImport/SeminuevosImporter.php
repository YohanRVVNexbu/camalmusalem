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

            if ($brand === '' && $model === '') {
                continue;
            }
            if ($brand === '' || $model === '') {
                $result->addError($rowNum, 'Marca o modelo vacíos, fila omitida.');
                continue;
            }

            $year      = (int) ($row[3] ?? 0);
            $color     = $this->str($row[4]);
            $price     = $this->money($row[9]);   // Precio lista (CLP)
            $financed  = $this->money($row[11]);  // Precio Lista + Bono (= "Precio con Financiamiento")
            $km        = (int) ($row[19] ?? 0);
            $certified = $this->parseCertified($row[6] ?? null); // Certificación Toyota Usados

            // Mapeo de características booleanas desde la columna U (índice 20) en adelante
            $specs = $this->parseSpecs($row);

            $data = [
                'brand'        => $brand,
                'model'        => $model,
                'vu_code'      => $vu ?: null,
                'slug'         => Str::slug("{$brand}-{$model}-{$year}-".Str::random(4)),
                'year'         => $year ?: null,
                'color'        => $color,
                'km'           => $km,
                'price'        => $price,
                'down_payment' => $financed,
                'fuel'         => $this->str($row[18]),
                'transmission' => $this->str($row[14]),
                'traction'     => $this->str($row[13]),
                'certified'    => $certified,
                'specs'        => $specs ?: null,
                'is_visible'   => true,
            ];

            // Upsert por VU (código interno único) si está presente: si ya existe
            // un seminuevo con ese VU, se actualiza; si no, se crea uno nuevo.
            if ($vu !== '') {
                $existing = Seminuevo::where('vu_code', $vu)->first();
                if ($existing) {
                    unset($data['slug']); // Preservar slug existente
                    $existing->update($data);
                    $result->updated++;

                    continue;
                }
            }

            Seminuevo::create($data);
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
