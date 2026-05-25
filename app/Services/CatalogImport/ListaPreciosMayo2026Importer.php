<?php

namespace App\Services\CatalogImport;

use App\Models\Branch;
use App\Models\Brand;
use App\Models\VehicleModel;
use App\Models\VehicleVersion;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use PhpOffice\PhpSpreadsheet\IOFactory;
use Symfony\Component\HttpFoundation\File\UploadedFile;

/**
 * Importa la "Lista de Precios sugeridos Mayo 2026" de Toyota.
 *
 * Estructura del Excel:
 *   - Header en row 8, datos desde row 9 hasta primera fila vacía
 *   - Col B  Clasificación   (SUV / PASAJEROS / COMERCIALES) → body_type
 *   - Col C  Línea           → VehicleModel.name (resuelto/creado)
 *   - Col D  Versión         → VehicleVersion.trim_name (tal cual viene)
 *   - Col F  Precio          → msrp_clp
 *   - Col G  Bono Base TCL   → bono_marca (abs)
 *   - Col J  Bono Crédito    → bono_financiamiento_tradicional (abs)
 *   - Col M  Bono Crédito R9 → bono_financiamiento_r9 (abs)
 *   - Col AQ Material        → material_code (UNIQUE key, identifica la versión)
 *
 * Comportamiento upsert:
 *   - Versión existente (matched por material_code): actualiza SOLO precio y
 *     bonos. NO toca trim_name, slug, year, powertrain, drivetrain ni nada que
 *     el cliente haya editado manualmente.
 *   - Versión nueva: la crea con defaults razonables (powertrain/drivetrain
 *     inferidos del nombre) y el cliente completa el resto a mano después.
 *
 * Ambos casos vinculan la versión a las sucursales seleccionadas en el form
 * vía la tabla pivot `vehicle_version_branches` (syncWithoutDetaching, no
 * pisa otras sucursales ya asociadas).
 */
class ListaPreciosMayo2026Importer
{
    private const HEADER_ROW = 8;
    private const MAX_DATA_ROWS = 500;

    /**
     * @param  array<int>  $branchIds  Sucursales a vincular con las versiones importadas
     */
    public function import(UploadedFile $file, array $branchIds): ImportResult
    {
        $result = new ImportResult;

        if (empty($branchIds)) {
            $result->addError(0, 'Debes seleccionar al menos una sucursal.');

            return $result;
        }

        $validBranchIds = Branch::whereIn('id', $branchIds)->pluck('id')->all();
        if (empty($validBranchIds)) {
            $result->addError(0, 'Las sucursales seleccionadas no existen.');

            return $result;
        }

        // Toyota es la marca por defecto del importador (el Excel es del
        // catálogo Toyota Chile). Si no existe en BD, la creamos al vuelo
        // para que el import funcione en instalaciones limpias sin requerir
        // que el operador la cree a mano antes.
        $brandId = Brand::query()->where('slug', 'toyota')->value('id')
            ?? Brand::query()->where('name', 'Toyota')->value('id');
        if (! $brandId) {
            $brandId = Brand::create([
                'name' => 'Toyota',
                'slug' => 'toyota',
                'is_active' => true,
            ])->id;
        }

        $sheet = IOFactory::load($file->getPathname())->getActiveSheet();
        $row = self::HEADER_ROW + 1;
        $emptyStreak = 0;

        while ($row <= self::HEADER_ROW + self::MAX_DATA_ROWS) {
            $clasif = trim((string) $sheet->getCell('B'.$row)->getValue());
            $linea = trim((string) $sheet->getCell('C'.$row)->getValue());
            $versionD = trim((string) $sheet->getCell('D'.$row)->getValue());
            $opcion = trim((string) $sheet->getCell('E'.$row)->getValue());
            $material = trim((string) $sheet->getCell('AQ'.$row)->getValue());

            if ($linea === '' && $material === '' && $versionD === '') {
                $emptyStreak++;
                if ($emptyStreak >= 3) {
                    break;
                }
                $row++;
                continue;
            }
            $emptyStreak = 0;

            if ($material === '') {
                $result->addError($row, 'Sin código Material — fila ignorada.');
                $row++;
                continue;
            }
            if ($linea === '') {
                $result->addError($row, 'Sin Línea (modelo) — fila ignorada.');
                $row++;
                continue;
            }

            $precio = $this->int($sheet->getCell('F'.$row)->getValue());
            $bonoBase = $this->int($sheet->getCell('G'.$row)->getValue());
            $bonoCredito = $this->int($sheet->getCell('J'.$row)->getValue());
            $bonoCredR9 = $this->int($sheet->getCell('M'.$row)->getValue());

            $priceData = [
                'msrp_clp' => $precio ?? 0,
                'bono_marca' => $bonoBase !== null ? abs($bonoBase) : 0,
                'bono_financiamiento_tradicional' => $bonoCredito !== null ? abs($bonoCredito) : 0,
                'bono_financiamiento_r9' => $bonoCredR9 !== null ? abs($bonoCredR9) : 0,
            ];

            DB::transaction(function () use (
                $material, $opcion, $linea, $clasif, $versionD, $priceData, $brandId, $validBranchIds, $result
            ) {
                $existing = VehicleVersion::query()->where('material_code', $material)->first();

                if ($existing) {
                    // Actualiza precios + el option_code (por si en futuras
                    // listas Toyota lo modificó). NO toca trim_name, slug,
                    // year, etc. — eso lo manejamos para no pisar ediciones
                    // manuales del cliente.
                    $existing->update([
                        ...$priceData,
                        'option_code' => $opcion !== '' ? $opcion : $existing->option_code,
                    ]);
                    $version = $existing;
                    $result->updated++;
                } else {
                    $model = VehicleModel::query()->firstOrCreate(
                        ['name' => $linea],
                        [
                            'brand_id' => $brandId,
                            'slug' => Str::slug($linea),
                            'body_type' => $this->mapBodyType($clasif),
                            'is_active' => true,
                        ]
                    );

                    $trim = $versionD !== '' ? $versionD : $material;
                    $version = VehicleVersion::create([
                        ...$priceData,
                        'material_code' => $material,
                        'option_code' => $opcion !== '' ? $opcion : null,
                        'vehicle_model_id' => $model->id,
                        'trim_name' => $trim,
                        'slug' => Str::slug($trim.'-'.$material),
                        'model_year' => $this->inferYear($trim),
                        'powertrain_type' => $this->inferPowertrain($linea, $trim),
                        'drivetrain' => $this->inferDrivetrain($trim),
                        'transmission_type' => $this->inferTransmission($trim),
                        'is_active' => true,
                    ]);
                    $result->created++;
                }

                $version->branches()->syncWithoutDetaching($validBranchIds);
            });

            $row++;
        }

        return $result;
    }

    /**
     * Pre-procesa el Excel sin guardar nada. Devuelve filas con su acción
     * estimada (create / update) para que el frontend muestre el preview.
     *
     * @return array{rows: array<int,array<string,mixed>>, stats: array{create:int, update:int, skip:int}}
     */
    public function preview(UploadedFile $file): array
    {
        $sheet = IOFactory::load($file->getPathname())->getActiveSheet();
        $row = self::HEADER_ROW + 1;
        $emptyStreak = 0;
        $rows = [];
        $stats = ['create' => 0, 'update' => 0, 'skip' => 0];

        $existingMaterials = VehicleVersion::query()
            ->whereNotNull('material_code')
            ->pluck('id', 'material_code')
            ->all();

        while ($row <= self::HEADER_ROW + self::MAX_DATA_ROWS) {
            $linea = trim((string) $sheet->getCell('C'.$row)->getValue());
            $versionD = trim((string) $sheet->getCell('D'.$row)->getValue());
            $material = trim((string) $sheet->getCell('AQ'.$row)->getValue());

            if ($linea === '' && $material === '' && $versionD === '') {
                $emptyStreak++;
                if ($emptyStreak >= 3) {
                    break;
                }
                $row++;
                continue;
            }
            $emptyStreak = 0;

            $precio = $this->int($sheet->getCell('F'.$row)->getValue());
            $action = $material === '' || $linea === ''
                ? 'skip'
                : (isset($existingMaterials[$material]) ? 'update' : 'create');

            $stats[$action]++;

            $rows[] = [
                'excel_row' => $row,
                'linea' => $linea,
                'version' => $versionD,
                'material' => $material,
                'precio' => $precio,
                'action' => $action,
            ];

            $row++;
        }

        return ['rows' => $rows, 'stats' => $stats];
    }

    private function int(mixed $val): ?int
    {
        if ($val === null || $val === '') {
            return null;
        }
        if (is_int($val) || is_float($val)) {
            return (int) $val;
        }
        $clean = preg_replace('/[^\d-]/', '', (string) $val);

        return $clean !== '' && $clean !== '-' ? (int) $clean : null;
    }

    private function mapBodyType(string $clasificacion): string
    {
        return match (strtoupper($clasificacion)) {
            'SUV' => 'suv',
            'PASAJEROS' => 'sedan',
            'COMERCIALES' => 'pickup',
            default => 'other',
        };
    }

    private function inferYear(string $trim): int
    {
        if (preg_match('/-(\d{2})[A-Z]/i', $trim, $m)) {
            return 2000 + (int) $m[1];
        }

        return (int) date('Y');
    }

    private function inferPowertrain(string $linea, string $trim): string
    {
        $haystack = strtoupper($linea.' '.$trim);
        if (str_contains($haystack, 'BZ') || str_contains($haystack, ' EV ') || str_starts_with($haystack, 'EV')) {
            return 'bev';
        }
        if (str_contains($haystack, 'PHEV') || str_contains($haystack, 'PLUG')) {
            return 'phev';
        }
        if (str_contains($haystack, 'HEV') || str_contains($haystack, 'HV')) {
            return 'hybrid';
        }
        if (str_contains($haystack, 'DSL') || str_contains($haystack, 'DIESEL')) {
            return 'diesel';
        }

        return 'gasoline';
    }

    private function inferDrivetrain(string $trim): string
    {
        $up = strtoupper($trim);
        if (str_contains($up, '4X4') || str_contains($up, '4WD')) {
            return '4wd';
        }
        if (str_contains($up, 'AWD')) {
            return 'awd';
        }

        return 'fwd';
    }

    private function inferTransmission(string $trim): ?string
    {
        $up = strtoupper($trim);
        if (str_contains($up, 'CVT')) {
            return 'CVT';
        }
        // TM = Transmisión Manual (es), MT = Manual Transmission (en)
        if (str_contains($up, ' TM ') || str_contains($up, ' MT ') || str_contains($up, 'MANUAL')) {
            return 'MT';
        }
        // TA = Transmisión Automática (es), AT = Automatic Transmission (en)
        if (str_contains($up, ' TA ') || str_contains($up, ' AT ')) {
            return 'AT';
        }

        return null;
    }
}
