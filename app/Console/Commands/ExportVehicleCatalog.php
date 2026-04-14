<?php

namespace App\Console\Commands;

use App\Models\VehicleVersion;
use Illuminate\Console\Command;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;

/**
 * Vuelca el catálogo completo (marca + modelo + versión + satélites +
 * features agrupadas por categoría + colores) en una sola hoja plana.
 * Pensado como ejemplo pedagógico de "así se ve una base de datos".
 */
class ExportVehicleCatalog extends Command
{
    protected $signature = 'vehicles:export-catalog {--path=catalogo_vehiculos.xlsx}';

    protected $description = 'Exporta el catálogo completo a un .xlsx con UNA sola hoja plana (1 fila por versión).';

    public function handle(): int
    {
        $versions = VehicleVersion::with([
            'model.brand', 'engine', 'electric', 'dimensions', 'capacities',
            'performance', 'chassis', 'features', 'colors',
        ])->orderBy('vehicle_model_id')->orderBy('display_order')->get();

        if ($versions->isEmpty()) {
            $this->error('No hay versiones sembradas. Corre php artisan db:seed primero.');

            return self::FAILURE;
        }

        $headers = $this->columnHeaders();
        $rows = $versions->map(fn (VehicleVersion $v) => $this->flattenVersion($v))->all();

        $sb = new Spreadsheet;
        $sheet = $sb->getActiveSheet();
        $sheet->setTitle('Catálogo vehículos');

        // Encabezado
        $col = 'A';
        foreach ($headers as $h) {
            $sheet->setCellValue("{$col}1", $h);
            $col = $this->nextCol($col);
        }
        $lastCol = $this->prevCol($col);
        $range = "A1:{$lastCol}1";
        $sheet->getStyle($range)->getFont()->setBold(true)->getColor()->setRGB('FFFFFF');
        $sheet->getStyle($range)->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setRGB('1F4E78');
        $sheet->getStyle($range)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
        $sheet->getStyle($range)->getBorders()->getAllBorders()->setBorderStyle(Border::BORDER_THIN);

        // Filas
        foreach ($rows as $rowIdx => $row) {
            $col = 'A';
            foreach ($row as $value) {
                $sheet->setCellValue("{$col}".($rowIdx + 2), $value);
                $col = $this->nextCol($col);
            }
        }

        // Auto-ancho + freeze primera fila
        for ($c = 'A'; $c !== $this->nextCol($lastCol); $c = $this->nextCol($c)) {
            $sheet->getColumnDimension($c)->setAutoSize(true);
        }
        $sheet->freezePane('D2');

        // Filtro en header
        $sheet->setAutoFilter($range);

        $path = base_path($this->option('path'));
        @mkdir(dirname($path), 0775, true);

        $writer = IOFactory::createWriter($sb, 'Xlsx');
        $writer->save($path);

        $this->info('Catálogo exportado a: '.$path);
        $this->info('  → '.count($rows).' versiones, '.count($headers).' columnas, 1 hoja plana.');

        return self::SUCCESS;
    }

    private function columnHeaders(): array
    {
        return [
            // Identificación
            'ID', 'Marca', 'Modelo', 'Tipo carrocería', 'Segmento', 'Generación',
            'Trim / Versión', 'Año', 'Código ventas', 'Activo',
            // Comercial
            'Precio lista (CLP)', 'Imagen hero',
            // Propulsión / Transmisión
            'Propulsión', 'Tracción', 'Transmisión', 'N° velocidades',
            // Motor
            'Código motor', 'Cilindros', 'Configuración', 'Cilindrada (cc)',
            'Relación compresión', 'Alimentación',
            'Potencia (HP)', 'Potencia RPM',
            'Torque (Nm)', 'Torque RPM min', 'Torque RPM max',
            'Combustible motor', 'Norma emisiones',
            // Eléctrico / Batería
            'Motor eléctrico tipo',
            'Motor delantero (kW)', 'Motor trasero (kW)',
            'Potencia combinada (kW)', 'Potencia combinada (HP)',
            'Tipo batería', 'Capacidad batería (kWh)',
            'Autonomía WLTC (km)',
            'Carga AC (kW)', 'Carga DC (kW)', 'Conector de carga',
            // Dimensiones
            'Largo (mm)', 'Ancho (mm)', 'Alto (mm)',
            'Distancia ejes (mm)', 'Despeje (mm)',
            'Ángulo ataque', 'Ángulo salida', 'Vadeo (mm)', 'Radio giro (mm)',
            // Capacidades
            'Peso vacío (kg)', 'Peso bruto (kg)',
            'Asientos', 'Maletero (L)', 'Estanque combustible (L)',
            'Remolque con freno (kg)', 'Carga útil (kg)',
            // Rendimiento
            'Consumo ciudad (km/l)', 'Consumo carretera (km/l)',
            'Consumo mixto (km/l)', 'Emisiones CO₂ (g/km)',
            '0-100 km/h (s)', 'Velocidad máxima (km/h)',
            'Etiqueta eficiencia',
            // Chasis
            'Dirección', 'Suspensión delantera', 'Suspensión trasera',
            'Frenos delanteros', 'Frenos traseros',
            'Neumático', 'Llantas (pulg.)', 'Material llanta',
            // Equipamiento por categoría
            'Seguridad', 'Toyota Safety Sense', 'Confort',
            'Infoentretenimiento', 'Interior', 'Exterior', 'Off-road',
            // Colores
            'Colores disponibles',
        ];
    }

    private function flattenVersion(VehicleVersion $v): array
    {
        $model = $v->model;
        $brand = $model->brand;
        $e = $v->engine;
        $el = $v->electric;
        $d = $v->dimensions;
        $c = $v->capacities;
        $p = $v->performance;
        $ch = $v->chassis;

        $featuresByCategory = $v->features->groupBy('category')
            ->map(fn ($g) => $g->pluck('name_es')->implode(', '));

        $colors = $v->colors->pluck('name')->implode(', ');

        return [
            $v->id,
            $brand->name,
            $model->name,
            $model->body_type,
            $model->segment,
            $model->generation,
            $v->trim_name,
            $v->model_year,
            $v->sales_code,
            $v->is_active ? 'Sí' : 'No',

            $v->msrp_clp,
            $v->hero_image,

            $v->powertrain_type,
            $v->drivetrain,
            $v->transmission_type,
            $v->transmission_speeds,

            $e?->engine_code,
            $e?->cylinders,
            $e?->layout,
            $e?->displacement_cc,
            $e?->compression_ratio,
            $e?->fuel_system,
            $e?->hp,
            $e?->hp_rpm,
            $e?->torque_nm,
            $e?->torque_rpm_min,
            $e?->torque_rpm_max,
            $e?->fuel_type,
            $e?->emissions_standard,

            $el?->motor_type,
            $el?->motor_front_kw,
            $el?->motor_rear_kw,
            $el?->combined_kw,
            $el?->combined_hp,
            $el?->battery_type,
            $el?->battery_kwh,
            $el?->range_wltc_km,
            $el?->ac_charge_kw,
            $el?->dc_charge_kw,
            $el?->charge_connector,

            $d?->length_mm,
            $d?->width_mm,
            $d?->height_mm,
            $d?->wheelbase_mm,
            $d?->ground_clearance_mm,
            $d?->approach_angle,
            $d?->departure_angle,
            $d?->wading_mm,
            $d?->turning_radius_mm,

            $c?->curb_weight_kg,
            $c?->gvwr_kg,
            $c?->seats,
            $c?->trunk_l,
            $c?->fuel_tank_l,
            $c?->towing_braked_kg,
            $c?->payload_kg,

            $p?->city_kml,
            $p?->highway_kml,
            $p?->combined_kml,
            $p?->co2_gkm,
            $p?->acceleration_0_100_s,
            $p?->top_speed_kmh,
            $p?->energy_efficiency_label,

            $ch?->steering_type,
            $ch?->front_suspension,
            $ch?->rear_suspension,
            $ch?->front_brakes,
            $ch?->rear_brakes,
            $ch?->front_tire,
            $ch?->wheel_size_in,
            $ch?->wheel_material,

            $featuresByCategory['safety'] ?? '',
            $featuresByCategory['tss'] ?? '',
            $featuresByCategory['comfort'] ?? '',
            $featuresByCategory['infotainment'] ?? '',
            $featuresByCategory['interior'] ?? '',
            $featuresByCategory['exterior'] ?? '',
            $featuresByCategory['offroad'] ?? '',

            $colors,
        ];
    }

    private function nextCol(string $col): string
    {
        return \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex(
            \PhpOffice\PhpSpreadsheet\Cell\Coordinate::columnIndexFromString($col) + 1
        );
    }

    private function prevCol(string $col): string
    {
        return \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex(
            \PhpOffice\PhpSpreadsheet\Cell\Coordinate::columnIndexFromString($col) - 1
        );
    }
}
