<?php

namespace App\Services\CatalogExport;

use App\Models\Seminuevo;

class SeminuevosExporter extends BaseExporter
{
    public function __construct(private bool $templateOnly = false) {}

    protected function sheetTitle(): string
    {
        return 'Catalogo Vehiculos Seminuevos';
    }

    protected function headers(): array
    {
        return [
            'VU', 'Marca', 'Modelo', 'Año', 'Color',
            'Mantenciones', 'Certificación Toyota Usados', 'Segmento', 'Año',
            'Precio lista (CLP)', 'Bono Financiamiento', 'Precio Lista + Bono',
            'Imagen hero', 'Tracción', 'Transmisión', 'Cilindrada (cc)',
            'Potencia', 'Torque', 'Tipo Combustible', 'KM',
            'Sistema de frenos ABS', 'Distribución electrónica de frenado (EBD)',
            'Asistencia de frenado de emergencia (BA)', 'Control de estabilidad ESP/VSC',
            'Control de tracción (TCS/TRC)', 'Control estabilidad remolque (TSC)',
            'Asistente arranque en pendiente (HAC)', 'Asistente de descenso (DAC)',
            'Diferencial electrónico (e-LSD)', 'Dirección asistida eléctrica',
            'Frenos de disco ventilados', 'Mandos al volante',
            'Cámara de retroceso', 'Bluetooth', 'Android Auto', 'Apple CarPlay',
            'Sensores de retroceso', 'Neblineros', 'Llantas de aleación',
            'Espejos eléctricos', 'Techo panorámico', 'Aire acondicionado',
            'Climatizador / Bi-zona', 'Espejos eléctricos (ext.)', 'Dos copias de llave',
            'Número de puertas', 'Número de propietarios',
        ];
    }

    protected function rows(): array
    {
        if ($this->templateOnly) {
            return [];
        }

        $specKeys = [
            'Sistema de frenos ABS',
            'Distribución electrónica de frenado (EBD)',
            'Asistencia de frenado de emergencia (BA)',
            'Control de estabilidad ESP/VSC',
            'Control de tracción (TCS/TRC)',
            'Control estabilidad remolque (TSC)',
            'Asistente arranque en pendiente (HAC)',
            'Asistente de descenso (DAC)',
            'Diferencial electrónico (e-LSD)',
            'Dirección asistida eléctrica',
            'Frenos de disco ventilados',
            'Mandos al volante',
            'Cámara de retroceso',
            'Bluetooth',
            'Android Auto',
            'Apple CarPlay',
            'Sensores de retroceso',
            'Neblineros',
            'Llantas de aleación',
            'Espejos eléctricos',
            'Techo panorámico',
            'Aire acondicionado',
            'Climatizador / Bi-zona',
            'Espejos eléctricos (ext.)',
            'Dos copias de llave',
        ];

        return Seminuevo::orderBy('id')->get()->map(function (Seminuevo $s) use ($specKeys) {
            $specs = $s->specs ?? [];
            $row   = [
                $s->id,
                $s->brand,
                $s->model,
                $s->year,
                $s->color,
                null, null,
                null,
                $s->year,
                $s->price,
                $s->down_payment,
                null, null,
                $s->traction,
                $s->transmission,
                null, null, null,
                $s->fuel,
                $s->km,
            ];

            foreach ($specKeys as $key) {
                $row[] = isset($specs[$key]) ? ($specs[$key] ? 'Si' : 'No') : null;
            }

            $row[] = $s->doors;
            $row[] = null;

            return $row;
        })->values()->toArray();
    }
}
