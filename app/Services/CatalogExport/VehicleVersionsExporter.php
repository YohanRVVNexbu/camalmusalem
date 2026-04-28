<?php

namespace App\Services\CatalogExport;

use App\Models\VehicleVersion;

class VehicleVersionsExporter extends BaseExporter
{
    public function __construct(private bool $templateOnly = false) {}

    protected function sheetTitle(): string
    {
        return 'Catálogo vehículos';
    }

    protected function headers(): array
    {
        return [
            'ID', 'Marca', 'Modelo', 'Tipo carrocería', 'Segmento', 'Generación',
            'Trim / Versión', 'Año', 'Código ventas', 'Activo',
            'Precio lista (CLP)', 'Imagen hero',
            'Propulsión', 'Tracción', 'Transmisión', 'N° velocidades',
            'Código motor', 'Cilindros', 'Configuración', 'Cilindrada (cc)',
            'Relación compresión', 'Alimentación',
            'Potencia (HP)', 'Potencia RPM',
            'Torque (Nm)', 'Torque RPM min', 'Torque RPM max',
            'Combustible motor', 'Norma emisiones',
            'Motor eléctrico tipo',
            'Motor delantero (kW)', 'Motor trasero (kW)',
            'Potencia combinada (kW)', 'Potencia combinada (HP)',
            'Tipo batería', 'Capacidad batería (kWh)',
            'Autonomía WLTC (km)',
            'Carga AC (kW)', 'Carga DC (kW)', 'Conector de carga',
            'Largo (mm)', 'Ancho (mm)', 'Alto (mm)',
            'Distancia ejes (mm)', 'Despeje (mm)',
            'Ángulo ataque', 'Ángulo salida', 'Vadeo (mm)', 'Radio giro (mm)',
            'Peso vacío (kg)', 'Peso bruto (kg)',
            'Asientos', 'Maletero (L)', 'Estanque combustible (L)',
            'Remolque con freno (kg)', 'Carga útil (kg)',
            'Consumo ciudad (km/l)', 'Consumo carretera (km/l)',
            'Consumo mixto (km/l)', 'Emisiones CO₂ (g/km)',
            '0-100 km/h (s)', 'Velocidad máxima (km/h)',
            'Etiqueta eficiencia',
            'Dirección', 'Suspensión delantera', 'Suspensión trasera',
            'Frenos delanteros', 'Frenos traseros',
            'Neumático', 'Llantas (pulg.)', 'Material llanta',
            'Seguridad', 'Toyota Safety Sense', 'Confort',
            'Infoentretenimiento', 'Interior', 'Exterior', 'Off-road',
            'Colores disponibles',
        ];
    }

    protected function rows(): array
    {
        if ($this->templateOnly) {
            return [];
        }

        return VehicleVersion::with([
            'model.brand', 'engine', 'electric', 'dimensions', 'capacities',
            'performance', 'chassis', 'features', 'colors',
        ])->orderBy('vehicle_model_id')->orderBy('display_order')->get()
            ->map(fn (VehicleVersion $v) => $this->flatten($v))
            ->values()->toArray();
    }

    private function flatten(VehicleVersion $v): array
    {
        $m  = $v->model;
        $b  = $m->brand;
        $e  = $v->engine;
        $el = $v->electric;
        $d  = $v->dimensions;
        $c  = $v->capacities;
        $p  = $v->performance;
        $ch = $v->chassis;

        $byCategory = $v->features->groupBy('category')
            ->map(fn ($g) => $g->pluck('name_es')->implode(', '));

        return [
            $v->id, $b->name, $m->name, $m->body_type, $m->segment, $m->generation,
            $v->trim_name, $v->model_year, $v->sales_code, $v->is_active ? 'Sí' : 'No',
            $v->msrp_clp, $v->hero_image,
            $v->powertrain_type, $v->drivetrain, $v->transmission_type, $v->transmission_speeds,
            $e?->engine_code, $e?->cylinders, $e?->layout, $e?->displacement_cc,
            $e?->compression_ratio, $e?->fuel_system,
            $e?->hp, $e?->hp_rpm, $e?->torque_nm, $e?->torque_rpm_min, $e?->torque_rpm_max,
            $e?->fuel_type, $e?->emissions_standard,
            $el?->motor_type, $el?->motor_front_kw, $el?->motor_rear_kw,
            $el?->combined_kw, $el?->combined_hp,
            $el?->battery_type, $el?->battery_kwh, $el?->range_wltc_km,
            $el?->ac_charge_kw, $el?->dc_charge_kw, $el?->charge_connector,
            $d?->length_mm, $d?->width_mm, $d?->height_mm,
            $d?->wheelbase_mm, $d?->ground_clearance_mm,
            $d?->approach_angle, $d?->departure_angle, $d?->wading_mm, $d?->turning_radius_mm,
            $c?->curb_weight_kg, $c?->gvwr_kg, $c?->seats, $c?->trunk_l,
            $c?->fuel_tank_l, $c?->towing_braked_kg, $c?->payload_kg,
            $p?->city_kml, $p?->highway_kml, $p?->combined_kml, $p?->co2_gkm,
            $p?->acceleration_0_100_s, $p?->top_speed_kmh, $p?->energy_efficiency_label,
            $ch?->steering_type, $ch?->front_suspension, $ch?->rear_suspension,
            $ch?->front_brakes, $ch?->rear_brakes,
            $ch?->front_tire, $ch?->wheel_size_in, $ch?->wheel_material,
            $byCategory['safety'] ?? '',
            $byCategory['tss'] ?? '',
            $byCategory['comfort'] ?? '',
            $byCategory['infotainment'] ?? '',
            $byCategory['interior'] ?? '',
            $byCategory['exterior'] ?? '',
            $byCategory['offroad'] ?? '',
            $v->colors->pluck('name')->implode(', '),
        ];
    }
}
