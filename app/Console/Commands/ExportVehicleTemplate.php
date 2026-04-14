<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use PhpOffice\PhpSpreadsheet\Cell\DataValidation;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class ExportVehicleTemplate extends Command
{
    protected $signature = 'vehicles:export-template {--path=storage/app/plantilla_vehiculos.xlsx}';

    protected $description = 'Genera una plantilla Excel para que el cliente complete con todas las fichas técnicas de sus vehículos.';

    public function handle(): int
    {
        $spreadsheet = new Spreadsheet;
        $spreadsheet->removeSheetByIndex(0);

        $this->buildInstructions($spreadsheet);
        $this->buildModelsSheet($spreadsheet);
        $this->buildVersionsSheet($spreadsheet);
        $this->buildEngineSheet($spreadsheet);
        $this->buildElectricSheet($spreadsheet);
        $this->buildDimensionsSheet($spreadsheet);
        $this->buildCapacitiesSheet($spreadsheet);
        $this->buildPerformanceSheet($spreadsheet);
        $this->buildChassisSheet($spreadsheet);
        $this->buildFeaturesSheet($spreadsheet);
        $this->buildVersionFeaturesSheet($spreadsheet);
        $this->buildColorsSheet($spreadsheet);
        $this->buildStockSheet($spreadsheet);

        $spreadsheet->setActiveSheetIndex(0);

        $path = base_path($this->option('path'));
        @mkdir(dirname($path), 0775, true);

        $writer = IOFactory::createWriter($spreadsheet, 'Xlsx');
        $writer->save($path);

        $this->info("Plantilla generada en: {$path}");

        return self::SUCCESS;
    }

    private function sheet(Spreadsheet $sb, string $title): Worksheet
    {
        $sheet = new Worksheet($sb, $title);
        $sb->addSheet($sheet);

        return $sheet;
    }

    private function header(Worksheet $sheet, array $headers): void
    {
        $col = 'A';
        foreach ($headers as $h) {
            $sheet->setCellValue("{$col}1", $h);
            $col++;
        }
        $last = chr(ord('A') + count($headers) - 1);
        $sheet->getStyle("A1:{$last}1")->getFont()->setBold(true)->getColor()->setRGB('FFFFFF');
        $sheet->getStyle("A1:{$last}1")->getFill()
            ->setFillType(Fill::FILL_SOLID)->getStartColor()->setRGB('1F4E78');
        $sheet->getStyle("A1:{$last}1")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
        $sheet->getStyle("A1:{$last}1")->getBorders()->getAllBorders()->setBorderStyle(Border::BORDER_THIN);
        $sheet->freezePane('A2');
        foreach (range('A', $last) as $c) {
            $sheet->getColumnDimension($c)->setAutoSize(true);
        }
    }

    private function note(Worksheet $sheet, int $row, array $notes): void
    {
        $col = 'A';
        foreach ($notes as $n) {
            $sheet->setCellValue("{$col}{$row}", $n);
            $col++;
        }
        $last = chr(ord('A') + count($notes) - 1);
        $sheet->getStyle("A{$row}:{$last}{$row}")->getFont()->setItalic(true)->getColor()->setRGB('808080');
    }

    private function dropdown(Worksheet $sheet, string $col, array $options, int $rowsDown = 500): void
    {
        $list = '"' . implode(',', $options) . '"';
        for ($r = 2; $r <= $rowsDown; $r++) {
            $v = $sheet->getCell("{$col}{$r}")->getDataValidation();
            $v->setType(DataValidation::TYPE_LIST)
                ->setErrorStyle(DataValidation::STYLE_WARNING)
                ->setAllowBlank(true)
                ->setShowDropDown(true)
                ->setFormula1($list);
        }
    }

    private function buildInstructions(Spreadsheet $sb): void
    {
        $sheet = $this->sheet($sb, '0. Instrucciones');
        $sheet->setCellValue('A1', 'Plantilla de Carga — Catálogo de Vehículos');
        $sheet->getStyle('A1')->getFont()->setBold(true)->setSize(16);

        $lines = [
            '',
            'Esta planilla permite cargar masivamente el catálogo de vehículos nuevos al sistema.',
            '',
            'Orden de llenado recomendado:',
            '  1. "Modelos" — un modelo por fila (ej: Hilux, RAV4, bZ4X).',
            '  2. "Versiones" — una versión/trim por fila, referenciando "model_slug" de la hoja Modelos.',
            '  3. Hojas satélite (Motor, Eléctrico, Dimensiones, Capacidades, Rendimiento, Chasis): una fila por versión, usando "version_slug" + "model_slug" + "model_year" como llave.',
            '  4. "Features catálogo": ya viene precargada. Solo agregar features nuevas si se necesitan.',
            '  5. "Version-Features": marcar qué versión tiene cada feature.',
            '  6. "Colores": uno o más colores por versión.',
            '  7. "Stock": cada auto FÍSICO en venta (con VIN/patente) — se refiere a una versión pero guarda su propia copia de marca/modelo/precio al momento de ingresar.',
            '',
            'Campos numéricos: solo el número, sin unidad. Campos opcionales: dejar vacío.',
            'Campos con menú desplegable: usar solo los valores ofrecidos.',
            '',
            'Al terminar, guardar como .xlsx y enviar. La importación se hace con: php artisan vehicles:import-template ruta.xlsx',
        ];
        foreach ($lines as $i => $l) {
            $sheet->setCellValue('A' . (3 + $i), $l);
        }
        $sheet->getColumnDimension('A')->setWidth(120);
    }

    private function buildModelsSheet(Spreadsheet $sb): void
    {
        $sheet = $this->sheet($sb, '1. Modelos');
        $this->header($sheet, [
            'brand', 'model_name', 'model_slug', 'body_type', 'segment', 'generation', 'description', 'is_active', 'display_order',
        ]);
        $this->note($sheet, 2, [
            'Toyota', 'Hilux', 'hilux', 'pickup', 'pickup mediano', '8va gen', 'Pickup diésel 4x4', '1', '10',
        ]);
        $this->dropdown($sheet, 'D', ['sedan', 'hatchback', 'suv', 'pickup', 'crossover', 'coupe', 'van', 'other']);
        $this->dropdown($sheet, 'H', ['1', '0']);
    }

    private function buildVersionsSheet(Spreadsheet $sb): void
    {
        $sheet = $this->sheet($sb, '2. Versiones');
        $this->header($sheet, [
            'model_slug', 'trim_name', 'version_slug', 'model_year', 'powertrain_type',
            'drivetrain', 'transmission_type', 'transmission_speeds', 'msrp_clp',
            'sales_code', 'description', 'is_active', 'display_order',
        ]);
        $this->note($sheet, 2, [
            'hilux', 'SR 2.8 4x4 MT', 'sr-2-8-4x4-mt', '2026', 'diesel',
            '4wd', 'MT', '6', '32990000', 'HLX-SR-28-4X4', 'Versión básica 4x4', '1', '10',
        ]);
        $this->dropdown($sheet, 'E', ['gasoline', 'diesel', 'hybrid', 'phev', 'bev']);
        $this->dropdown($sheet, 'F', ['fwd', 'rwd', 'awd', '4wd']);
        $this->dropdown($sheet, 'G', ['MT', 'AT', 'CVT', 'eCVT', 'DCT', 'AMT']);
        $this->dropdown($sheet, 'L', ['1', '0']);
    }

    private function buildEngineSheet(Spreadsheet $sb): void
    {
        $sheet = $this->sheet($sb, '3. Motor');
        $this->header($sheet, [
            'model_slug', 'version_slug', 'model_year',
            'engine_code', 'cylinders', 'layout', 'displacement_cc', 'compression_ratio',
            'fuel_system', 'hp', 'hp_rpm', 'torque_nm', 'torque_rpm_min', 'torque_rpm_max',
            'fuel_type', 'emissions_standard', 'octane_recommended',
        ]);
        $this->note($sheet, 2, [
            'hilux', 'sr-2-8-4x4-mt', '2026',
            '1GD-FTV', '4', 'en línea', '2755', '15.6:1',
            'Common-Rail Turbo Intercooler', '204', '3400', '500', '1600', '2800',
            'diesel', 'Euro 5', '',
        ]);
        $this->dropdown($sheet, 'O', ['gasoline', 'diesel', 'lpg', 'cng']);
    }

    private function buildElectricSheet(Spreadsheet $sb): void
    {
        $sheet = $this->sheet($sb, '4. Eléctrico');
        $this->header($sheet, [
            'model_slug', 'version_slug', 'model_year',
            'motor_type', 'motor_front_kw', 'motor_rear_kw', 'combined_kw', 'combined_hp', 'combined_torque_nm',
            'battery_type', 'battery_kwh', 'battery_cells', 'battery_voltage',
            'range_wltc_km', 'ac_charge_kw', 'dc_charge_kw', 'ac_charge_minutes', 'dc_charge_minutes', 'charge_connector',
        ]);
        $this->note($sheet, 2, [
            'bz4x', 'motion-awd', '2026',
            'Síncrono imanes permanentes', '80', '80', '160', '215', '336.4',
            'Li-ion', '71.4', '96', '355',
            '470', '6.6', '150', '480', '30', 'Tipo 2 CCS2',
        ]);
    }

    private function buildDimensionsSheet(Spreadsheet $sb): void
    {
        $sheet = $this->sheet($sb, '5. Dimensiones');
        $this->header($sheet, [
            'model_slug', 'version_slug', 'model_year',
            'length_mm', 'width_mm', 'height_mm', 'wheelbase_mm', 'ground_clearance_mm',
            'approach_angle', 'departure_angle', 'breakover_angle', 'wading_mm',
            'drag_coefficient', 'turning_radius_mm',
        ]);
        $this->note($sheet, 2, [
            'hilux', 'sr-2-8-4x4-mt', '2026',
            '5325', '1900', '1815', '3085', '216',
            '29', '26', '', '700',
            '', '6400',
        ]);
    }

    private function buildCapacitiesSheet(Spreadsheet $sb): void
    {
        $sheet = $this->sheet($sb, '6. Capacidades');
        $this->header($sheet, [
            'model_slug', 'version_slug', 'model_year',
            'gvwr_kg', 'curb_weight_kg', 'seats', 'seat_rows',
            'trunk_l', 'fuel_tank_l', 'urea_tank_l',
            'towing_braked_kg', 'towing_unbraked_kg', 'payload_kg',
        ]);
        $this->note($sheet, 2, [
            'hilux', 'sr-2-8-4x4-mt', '2026',
            '3210', '2110', '5', '2',
            '', '80', '',
            '3500', '750', '1000',
        ]);
    }

    private function buildPerformanceSheet(Spreadsheet $sb): void
    {
        $sheet = $this->sheet($sb, '7. Rendimiento');
        $this->header($sheet, [
            'model_slug', 'version_slug', 'model_year',
            'city_kml', 'highway_kml', 'combined_kml', 'co2_gkm',
            'acceleration_0_100_s', 'top_speed_kmh',
            'energy_efficiency_label', 'report_code',
        ]);
        $this->note($sheet, 2, [
            'hilux', 'sr-2-8-4x4-mt', '2026',
            '10.5', '14.2', '12.5', '200',
            '', '',
            'C', '3CV-2026-XXXX',
        ]);
        $this->dropdown($sheet, 'J', ['A', 'B', 'C', 'D', 'E', 'F', 'G']);
    }

    private function buildChassisSheet(Spreadsheet $sb): void
    {
        $sheet = $this->sheet($sb, '8. Chasis');
        $this->header($sheet, [
            'model_slug', 'version_slug', 'model_year',
            'steering_type', 'front_suspension', 'rear_suspension',
            'front_brakes', 'rear_brakes', 'parking_brake',
            'front_tire', 'rear_tire', 'wheel_size_in', 'wheel_material',
        ]);
        $this->note($sheet, 2, [
            'hilux', 'sr-2-8-4x4-mt', '2026',
            'Asistida eléctrica', 'Doble horquilla', 'Ballestas',
            'Disco ventilado', 'Tambor', 'Mecánico',
            '265/65R17', '265/65R17', '17', 'aleación',
        ]);
    }

    private function buildFeaturesSheet(Spreadsheet $sb): void
    {
        $sheet = $this->sheet($sb, '9. Features catálogo');
        $this->header($sheet, ['code', 'name_es', 'name_en', 'category', 'data_type', 'unit', 'description', 'is_active']);
        $this->note($sheet, 2, [
            'abs', 'Frenos ABS', 'ABS brakes', 'safety', 'boolean', '', 'Anti-lock braking system', '1',
        ]);
        $this->dropdown($sheet, 'D', ['safety', 'tss', 'comfort', 'infotainment', 'exterior', 'interior', 'offroad', 'performance', 'other']);
        $this->dropdown($sheet, 'E', ['boolean', 'int', 'string']);
        $this->dropdown($sheet, 'H', ['1', '0']);
    }

    private function buildVersionFeaturesSheet(Spreadsheet $sb): void
    {
        $sheet = $this->sheet($sb, '10. Version-Features');
        $this->header($sheet, [
            'model_slug', 'version_slug', 'model_year', 'feature_code',
            'value_bool', 'value_int', 'value_text', 'note',
        ]);
        $this->note($sheet, 2, [
            'hilux', 'sr-2-8-4x4-mt', '2026', 'abs',
            '1', '', '', '',
        ]);
        $this->dropdown($sheet, 'E', ['1', '0']);
    }

    private function buildColorsSheet(Spreadsheet $sb): void
    {
        $sheet = $this->sheet($sb, '11. Colores');
        $this->header($sheet, [
            'model_slug', 'version_slug', 'model_year',
            'name', 'hex', 'type', 'is_available', 'display_order',
        ]);
        $this->note($sheet, 2, [
            'hilux', 'sr-2-8-4x4-mt', '2026',
            'Blanco Perla', '#FFFFFF', 'pearl', '1', '1',
        ]);
        $this->dropdown($sheet, 'F', ['solid', 'metallic', 'pearl', 'matte']);
        $this->dropdown($sheet, 'G', ['1', '0']);
    }

    private function buildStockSheet(Spreadsheet $sb): void
    {
        $sheet = $this->sheet($sb, '12. Stock (unidades físicas)');
        $this->header($sheet, [
            'model_slug', 'version_slug', 'model_year',
            'vin', 'engine_number', 'license_plate',
            'mileage_km', 'condition', 'stock_status',
            'color_name', 'color_hex', 'interior_color',
            'list_price_clp', 'sale_price_clp', 'branch', 'arrival_date', 'notes',
        ]);
        $this->note($sheet, 2, [
            'hilux', 'sr-2-8-4x4-mt', '2026',
            'JTEBZ5XXXX0123456', 'ENG-001', '',
            '0', 'new', 'available',
            'Blanco Perla', '#FFFFFF', 'Negro',
            '32990000', '', 'Coquimbo', '2026-04-10', '',
        ]);
        $this->dropdown($sheet, 'H', ['new', 'used', 'demo', 'certified']);
        $this->dropdown($sheet, 'I', ['available', 'reserved', 'sold', 'in_transit', 'service', 'archived']);
    }
}
