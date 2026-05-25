<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

class GenerateSampleExcels extends Command
{
    protected $signature   = 'catalog:samples {--out=storage/app/samples}';
    protected $description = 'Genera excels de prueba para todos los importadores';

    private string $outDir;

    public function handle(): int
    {
        $this->outDir = base_path($this->option('out'));
        if (! is_dir($this->outDir)) {
            mkdir($this->outDir, 0755, true);
        }

        $this->generateCatalogo();
        $this->generateSeminuevos();
        $this->generateRepuestos();
        $this->generateAccesorios();
        $this->generateMerch();

        $this->info('✓ Excels generados en: '.$this->outDir);
        $this->table(['Archivo'], array_map(fn ($f) => [$f], array_map('basename', glob($this->outDir.'/*.xlsx'))));

        return 0;
    }

    // ─── Catálogo vehículos nuevos (79 columnas) ────────────────────────────

    private function generateCatalogo(): void
    {
        // Cabeceras del catálogo histórico (79 columnas, índices 0-78). Hoy
        // el catálogo se importa desde el Excel mensual de Toyota usando
        // ListaPreciosMayo2026Importer — este comando queda como referencia
        // del formato anterior.
        $headers = [
            'ID', 'Marca', 'Modelo', 'Tipo carrocería', 'Segmento', 'Generación',
            'Trim / Versión', 'Año', 'Código ventas', 'Activo',
            'Precio lista (CLP)', 'Imagen hero',          // [10] msrp_clp  [11] ignorado
            'Propulsión', 'Tracción', 'Transmisión', 'N° velocidades',   // [12-15]
            'Código motor', 'Cilindros', 'Configuración', 'Cilindrada (cc)',   // [16-19]
            'Relación compresión', 'Alimentación',                             // [20-21]
            'Potencia (HP)', 'Potencia RPM',                                   // [22-23]
            'Torque (Nm)', 'Torque RPM min', 'Torque RPM max',                 // [24-26]
            'Combustible motor', 'Norma emisiones',                            // [27-28]
            'Motor eléctrico tipo',                                            // [29]
            'Motor delantero (kW)', 'Motor trasero (kW)',                      // [30-31]
            'Potencia combinada (kW)', 'Potencia combinada (HP)',              // [32-33]
            'Tipo batería', 'Capacidad batería (kWh)',                         // [34-35]
            'Autonomía WLTC (km)',                                             // [36]
            'Carga AC (kW)', 'Carga DC (kW)', 'Conector de carga',            // [37-39]
            'Largo (mm)', 'Ancho (mm)', 'Alto (mm)',                           // [40-42]
            'Distancia ejes (mm)', 'Despeje (mm)',                             // [43-44]
            'Ángulo ataque', 'Ángulo salida', 'Vadeo (mm)', 'Radio giro (mm)',// [45-48]
            'Peso vacío (kg)', 'Peso bruto (kg)',                              // [49-50]
            'Asientos', 'Maletero (L)', 'Estanque combustible (L)',           // [51-53]
            'Remolque con freno (kg)', 'Carga útil (kg)',                     // [54-55]
            'Consumo ciudad (km/l)', 'Consumo carretera (km/l)',              // [56-57]
            'Consumo mixto (km/l)', 'Emisiones CO₂ (g/km)',                   // [58-59]
            '0-100 km/h (s)', 'Velocidad máxima (km/h)',                      // [60-61]
            'Etiqueta eficiencia',                                             // [62]
            'Dirección', 'Suspensión delantera', 'Suspensión trasera',        // [63-65]
            'Frenos delanteros', 'Frenos traseros',                           // [66-67]
            'Neumático', 'Llantas (pulg.)', 'Material llanta',               // [68-70]
            'Seguridad', 'Toyota Safety Sense', 'Confort',                    // [71-73]
            'Infoentretenimiento', 'Interior', 'Exterior', 'Off-road',        // [74-77]
            'Colores disponibles',                                             // [78]
        ];

        $rows = [
            // Toyota Corolla XEI 2025 — motor a gasolina, sin eléctrico
            [
                '',              // [0]  ID (vacío = crear nuevo)
                'Toyota',        // [1]  Marca
                'Corolla',       // [2]  Modelo
                'sedan',         // [3]  Tipo carrocería
                'Sedán compacto',// [4]  Segmento
                '',              // [5]  Generación
                'XEI',           // [6]  Trim
                2025,            // [7]  Año
                'ZRE210',        // [8]  Código ventas
                'Sí',            // [9]  Activo
                18990000,        // [10] Precio lista CLP
                '',              // [11] Imagen hero (ignorado en import)
                'gasoline',      // [12] Propulsión
                'fwd',           // [13] Tracción
                'AT',            // [14] Transmisión
                6,               // [15] N° velocidades
                '2ZR-FE',        // [16] Código motor
                4,               // [17] Cilindros
                'Inline',        // [18] Configuración
                1798,            // [19] Cilindrada cc
                10.2,            // [20] Relación compresión
                'PFI',           // [21] Alimentación
                140,             // [22] HP
                6200,            // [23] HP RPM
                171,             // [24] Torque Nm
                4000,            // [25] Torque RPM min
                5200,            // [26] Torque RPM max
                'gasolina',      // [27] Combustible motor
                'Euro 6',        // [28] Norma emisiones
                // Eléctrico — vacío (no es BEV/PHEV)
                '', '', '', '', '', '', '', '', '', '', '',  // [29-39]
                // Dimensiones
                4620,            // [40] Largo mm
                1775,            // [41] Ancho mm
                1435,            // [42] Alto mm
                2700,            // [43] Distancia ejes mm
                130,             // [44] Despeje mm
                '', '', '', '',  // [45-48] ángulos/vadeo/radio
                // Capacidades
                1340,            // [49] Peso vacío kg
                1770,            // [50] Peso bruto kg
                5,               // [51] Asientos
                370,             // [52] Maletero L
                50,              // [53] Estanque L
                '', '',          // [54-55] remolque/carga útil
                // Rendimiento
                11.0,            // [56] Ciudad km/l
                15.5,            // [57] Carretera km/l
                12.8,            // [58] Mixto km/l
                '',              // [59] CO2
                10.8,            // [60] 0-100 s
                180,             // [61] Vel. máx.
                'C',             // [62] Etiqueta
                // Chasis
                'EPS',           // [63] Dirección
                'MacPherson',    // [64] Susp. delantera
                'Torsion Beam',  // [65] Susp. trasera
                'Disco ventilado',// [66] Frenos del.
                'Tambor',        // [67] Frenos tras.
                '205/55R16',     // [68] Neumático
                16,              // [69] Llantas pulg.
                'Aleación',      // [70] Material
                // Equipamiento CSV
                'ABS,Airbags frontales,Airbags laterales',        // [71] Seguridad
                'Pre-Colisión Automático,Control carril',         // [72] TSS
                'Aire acondicionado,Asientos de tela',            // [73] Confort
                'Android Auto,Apple CarPlay,Pantalla táctil 8"',  // [74] Infoentret.
                'Volante multifunción,Cámara de retroceso',       // [75] Interior
                'Espejos eléctricos,Llantas de aleación',         // [76] Exterior
                '',                                               // [77] Off-road
                'Blanco Perla,Negro Mica,Rojo Metálico,Gris Oscuro', // [78] Colores
            ],
            // Toyota RAV4 GX 2025 — híbrido
            [
                '',              // [0]  ID
                'Toyota',        // [1]  Marca
                'RAV4',          // [2]  Modelo
                'suv',           // [3]  Tipo carrocería
                'SUV mediano',   // [4]  Segmento
                '',              // [5]  Generación
                'GX',            // [6]  Trim
                2025,            // [7]  Año
                'AXAH54',        // [8]  Código ventas
                'Sí',            // [9]  Activo
                29990000,        // [10] Precio lista CLP
                '',              // [11] Imagen hero
                'hybrid',        // [12] Propulsión
                'awd',           // [13] Tracción
                'eCVT',          // [14] Transmisión
                '',              // [15] N° velocidades
                'A25A-FXS',      // [16] Código motor
                4,               // [17] Cilindros
                'Inline',        // [18] Configuración
                2487,            // [19] Cilindrada cc
                13.0,            // [20] Relación compresión
                'PFI+DI',        // [21] Alimentación
                176,             // [22] HP
                5700,            // [23] HP RPM
                221,             // [24] Torque Nm
                3600,            // [25] Torque RPM min
                5200,            // [26] Torque RPM max
                'gasolina',      // [27] Combustible motor
                'Euro 6',        // [28] Norma emisiones
                // Eléctrico (híbrido no enchufable)
                'AC síncrono',   // [29] Tipo motor elec.
                88,              // [30] Motor frontal kW
                40,              // [31] Motor trasero kW
                120,             // [32] Potencia comb. kW
                222,             // [33] HP combinados
                'Ni-MH',         // [34] Tipo batería
                1.6,             // [35] Batería kWh
                '',              // [36] Autonomía WLTC km
                '',              // [37] Carga AC kW
                '',              // [38] Carga DC kW
                '',              // [39] Conector carga
                // Dimensiones
                4600,            // [40] Largo mm
                1855,            // [41] Ancho mm
                1685,            // [42] Alto mm
                2690,            // [43] Distancia ejes mm
                200,             // [44] Despeje mm
                18, 25, '', '',  // [45-48]
                // Capacidades
                1790,            // [49] Peso vacío kg
                2150,            // [50] Peso bruto kg
                5,               // [51] Asientos
                580,             // [52] Maletero L
                55,              // [53] Estanque L
                1650, '',        // [54-55]
                // Rendimiento
                14.5,            // [56] Ciudad
                16.0,            // [57] Carretera
                15.2,            // [58] Mixto
                120,             // [59] CO2
                8.1,             // [60] 0-100 s
                180,             // [61] Vel. máx.
                'A',             // [62] Etiqueta
                // Chasis
                'EPS',                  // [63]
                'MacPherson',           // [64]
                'Doble horquilla',      // [65]
                'Disco ventilado',      // [66]
                'Disco',                // [67]
                '225/60R18',            // [68]
                18,                     // [69]
                'Aleación',             // [70]
                // Equipamiento CSV
                'ABS,Control estabilidad,7 airbags',                        // [71]
                'Pre-Colisión,Alerta carril,Cruise Control adaptativo',     // [72]
                'Climatizador bi-zona,Asientos cuero',                      // [73]
                'Android Auto,Apple CarPlay,JBL 9 parlantes',               // [74]
                'Techo panorámico,Head-up display',                         // [75]
                'Llantas 18",Retrovisores abatibles eléctricos',            // [76]
                '',                                                          // [77]
                'Blanco Perla,Negro Mica,Azul Metálico,Plata Metálico',    // [78]
            ],
        ];

        $this->writeExcel('catalogo_vehiculos_nuevos_sample.xlsx', $headers, $rows);
    }

    // ─── Seminuevos (47 columnas) ────────────────────────────────────────────

    private function generateSeminuevos(): void
    {
        $headers = [
            'VU (ID)', 'Marca', 'Modelo', 'Año', 'Color', 'Versión', 'Tipo carrocería',
            'Motor', 'Combustible', 'Precio lista', 'Enganche/Bono',
            'Descripción', 'Observaciones', 'Tracción', 'Transmisión',
            'Puertas', 'Cilindrada cc', 'Asientos', 'Combustible (detalle)',
            'km', 'ABS', 'EBD', 'BA', 'ESP/VSC', 'TCS/TRC', 'TSC', 'HAC', 'DAC',
            'e-LSD', 'Dirección asistida elec.', 'Frenos disco vent.',
            'Mandos al volante', 'Cámara retroceso', 'Bluetooth',
            'Android Auto', 'Apple CarPlay', 'Sensores retroceso',
            'Neblineros', 'Llantas aleación', 'Espejos eléctricos',
            'Techo panorámico', 'Aire acondicionado', 'Climatizador bi-zona',
            'Espejos ext.', 'Dos llaves',
        ];

        $rows = [
            [
                '', 'Toyota', 'Hilux', 2022, 'Blanco', 'SRV 4x4', 'Pickup',
                '2GD-FTV 2.8 Turbodiesel', 'Diésel', '$24.990.000', '$1.200.000',
                'Camioneta en excelente estado', '',
                '4x4', 'Automática', 4, 2755, 5, 'Diésel',
                45000,
                'Sí', 'Sí', 'Sí', 'Sí', 'Sí', 'Sí', 'Sí', 'Sí',
                '', 'Sí', 'Sí',
                'Sí', 'Sí', 'Sí',
                'Sí', 'Sí', 'Sí',
                'Sí', 'Sí', 'Sí',
                'Sí', 'Sí', '',
                'Sí', 'Sí',
            ],
            [
                '', 'Toyota', 'Yaris', 2021, 'Rojo', 'S CVT', 'Hatchback',
                '1NZ-FE 1.5', 'Gasolina', '$9.490.000', '$500.000',
                'En buen estado, único dueño', '',
                'FWD', 'CVT', 4, 1497, 5, 'Gasolina',
                62000,
                'Sí', 'Sí', 'Sí', 'Sí', 'Sí', '', '', '',
                '', 'Sí', '',
                'Sí', 'Sí', 'Sí',
                'Sí', 'Sí', 'Sí',
                'Sí', 'Sí', 'Sí',
                '', 'Sí', '',
                'Sí', 'Sí',
            ],
        ];

        $this->writeExcel('seminuevos_sample.xlsx', $headers, $rows);
    }

    // ─── Repuestos ────────────────────────────────────────────────────────────

    private function generateRepuestos(): void
    {
        $headers = [
            'SKU', 'Nombre', 'Descripción corta', 'Descripción larga',
            'Precio', 'Precio oferta', 'Unidad', 'Categoría',
            'Subcategoría', 'Marca parte', 'Modelos compatibles', 'Años compatibles',
            'Disponible en',
        ];

        $rows = [
            ['REP-001', 'Filtro de aceite Hilux', 'Filtro original Toyota', 'Filtro de aceite para motor 2GD-FTV y 1GD-FTV', '12500', '9900', 'unidad', 'Filtros', 'Aceite', 'Toyota', 'Hilux,Land Cruiser', '2015-2025', 'La Serena,Ovalle'],
            ['REP-002', 'Pastillas de freno delantera Corolla', 'Juego pastillas delantera', '', '35000', '', 'juego', 'Frenos', 'Pastillas', 'Toyota', 'Corolla', '2019-2025', 'La Serena'],
            ['REP-003', 'Correa distribución RAV4', '', 'Kit distribución original', '89000', '75000', 'kit', 'Motor', 'Distribución', 'Toyota', 'RAV4,Camry', '2018-2024', 'Ovalle'],
        ];

        $this->writeExcel('repuestos_sample.xlsx', $headers, $rows);
    }

    // ─── Accesorios ───────────────────────────────────────────────────────────

    private function generateAccesorios(): void
    {
        $headers = [
            'SKU', 'Nombre', 'Descripción corta', 'Descripción larga',
            'Precio', 'Precio oferta', 'Unidad', 'Categoría',
            'Subcategoría', 'Marca', 'Modelos compatibles', 'Años compatibles',
            'Disponible en',
        ];

        $rows = [
            ['ACC-001', 'Deflectores de viento Hilux', 'Set 4 deflectores', 'Deflectores acrílicos originales Toyota para ventanas', '45000', '38000', 'set', 'Protección', 'Deflectores', 'Toyota', 'Hilux', '2016-2025', 'La Serena,Ovalle'],
            ['ACC-002', 'Estriberas laterales RAV4', 'Estriberas acero inox.', '', '120000', '', 'par', 'Exterior', 'Estriberas', 'Toyota', 'RAV4', '2019-2025', 'La Serena'],
            ['ACC-003', 'Alfombras premium Corolla', 'Set alfombras velour', 'Alfombras originales Toyota con logo bordado', '35000', '28000', 'set', 'Interior', 'Alfombras', 'Toyota', 'Corolla', '2020-2025', 'La Serena,Ovalle'],
        ];

        $this->writeExcel('accesorios_sample.xlsx', $headers, $rows);
    }

    // ─── Merch ────────────────────────────────────────────────────────────────

    private function generateMerch(): void
    {
        $headers = [
            'SKU', 'Nombre', 'Descripción', 'Descripción técnica',
            'Categoría', 'Color', 'Subcategoría', 'Talla',
            'Precio', 'Precio oferta', 'Estado', 'Sucursal',
        ];

        $rows = [
            ['MER-001', 'Polera Toyota Racing', 'Polera oficial Toyota Gazoo Racing', '100% algodón, serigrafía resistente', 'ropa', 'Blanco', 'poleras', 'M', '12900', '', 'disponible', 'La Serena'],
            ['MER-002', 'Gorra Toyota bordada', 'Gorra con logo Toyota bordado', 'Material: poliéster, ajuste velcro', 'accesorios', 'Negro', 'gorros', 'Única', '8900', '6900', 'disponible', 'La Serena,Ovalle'],
            ['MER-003', 'Termo acero inox. Toyota', 'Termo 500ml con logo', 'Acero inoxidable doble pared, mantiene temperatura 12h', 'accesorios', '', 'termos', 'Única', '15900', '', 'disponible', 'Ovalle'],
        ];

        $this->writeExcel('merch_sample.xlsx', $headers, $rows);
    }

    // ─── Helper ───────────────────────────────────────────────────────────────

    private function writeExcel(string $filename, array $headers, array $rows): void
    {
        $spreadsheet = new Spreadsheet;
        $sheet = $spreadsheet->getActiveSheet();

        // Cabecera con fondo azul
        foreach ($headers as $col => $label) {
            $cell = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($col + 1).'1';
            $sheet->setCellValue($cell, $label);
            $sheet->getStyle($cell)->applyFromArray([
                'font'      => ['bold' => true, 'color' => ['rgb' => 'FFFFFF']],
                'fill'      => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => '1F4E79']],
                'alignment' => ['horizontal' => 'center'],
            ]);
        }

        // Datos
        foreach ($rows as $r => $row) {
            foreach ($row as $c => $value) {
                $cell = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($c + 1).($r + 2);
                $sheet->setCellValue($cell, $value);
            }
        }

        // Auto-fit columnas hasta la E
        foreach (range(1, min(count($headers), 20)) as $col) {
            $sheet->getColumnDimensionByColumn($col)->setAutoSize(true);
        }

        $sheet->setAutoFilter('A1:'.\PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex(count($headers)).'1');
        $sheet->freezePane('A2');

        $writer = new Xlsx($spreadsheet);
        $writer->save($this->outDir.'/'.$filename);
        $this->line("  → {$filename}");
    }
}
