<?php

namespace Database\Seeders;

use App\Models\Feature;
use Illuminate\Database\Seeder;

class FeaturesSeeder extends Seeder
{
    public function run(): void
    {
        $features = [
            // Safety - active
            ['abs', 'Frenos ABS', 'safety'],
            ['ebd', 'Distribución electrónica de frenado (EBD)', 'safety'],
            ['brake_assist', 'Asistente de frenado (BA)', 'safety'],
            ['vsc', 'Control de estabilidad (VSC)', 'safety'],
            ['trc', 'Control de tracción (TRC)', 'safety'],
            ['hac', 'Asistente de partida en pendiente (HAC)', 'safety'],
            ['dac', 'Asistente de descenso (DAC)', 'safety'],
            ['tpms', 'Monitor de presión de neumáticos (TPMS)', 'safety'],

            // Airbags
            ['airbag_driver', 'Airbag conductor', 'safety'],
            ['airbag_passenger', 'Airbag pasajero', 'safety'],
            ['airbag_side', 'Airbags laterales', 'safety'],
            ['airbag_curtain', 'Airbags de cortina', 'safety'],
            ['airbag_knee', 'Airbag de rodilla', 'safety'],
            ['isofix', 'Anclajes ISOFIX', 'safety'],

            // Toyota Safety Sense
            ['pre_collision', 'Sistema pre-colisión (PCS)', 'tss'],
            ['lane_departure_alert', 'Alerta cambio de carril (LDA)', 'tss'],
            ['lane_trace_assist', 'Asistente trazado de carril (LTA)', 'tss'],
            ['adaptive_cruise', 'Control crucero adaptativo (DRCC)', 'tss'],
            ['auto_high_beam', 'Luces altas automáticas (AHB)', 'tss'],
            ['blind_spot_monitor', 'Monitor punto ciego (BSM)', 'tss'],
            ['rear_cross_traffic', 'Alerta tráfico cruzado posterior (RCTA)', 'tss'],
            ['parking_support_brake', 'Frenado asistido estacionamiento (PKSB)', 'tss'],

            // Infotainment
            ['touchscreen_7', 'Pantalla táctil 7"', 'infotainment'],
            ['touchscreen_9', 'Pantalla táctil 9"', 'infotainment'],
            ['touchscreen_10_1', 'Pantalla táctil 10.1"', 'infotainment'],
            ['touchscreen_12_3', 'Pantalla táctil 12.3"', 'infotainment'],
            ['apple_carplay', 'Apple CarPlay', 'infotainment'],
            ['android_auto', 'Android Auto', 'infotainment'],
            ['wireless_carplay', 'Apple CarPlay inalámbrico', 'infotainment'],
            ['wireless_android_auto', 'Android Auto inalámbrico', 'infotainment'],
            ['bluetooth', 'Bluetooth', 'infotainment'],
            ['usb_ports', 'Puertos USB', 'infotainment'],
            ['wireless_charger', 'Cargador inalámbrico', 'infotainment'],

            // Comfort
            ['smart_key', 'Llave inteligente', 'comfort'],
            ['push_start', 'Encendido por botón', 'comfort'],
            ['keyless_entry', 'Entrada sin llave', 'comfort'],
            ['cruise_control', 'Control crucero', 'comfort'],
            ['climate_manual', 'Aire acondicionado manual', 'comfort'],
            ['climate_auto', 'Climatizador automático', 'comfort'],
            ['climate_dual', 'Climatizador bi-zona', 'comfort'],
            ['climate_tri', 'Climatizador tri-zona', 'comfort'],
            ['heated_seats', 'Asientos calefaccionados', 'comfort'],
            ['ventilated_seats', 'Asientos ventilados', 'comfort'],
            ['electric_driver_seat', 'Asiento conductor eléctrico', 'comfort'],
            ['electric_passenger_seat', 'Asiento pasajero eléctrico', 'comfort'],
            ['memory_seats', 'Asientos con memoria', 'comfort'],
            ['hud', 'Head-Up Display (HUD)', 'comfort'],
            ['rain_sensor', 'Sensor de lluvia', 'comfort'],
            ['wiper_auto', 'Limpiaparabrisas automáticos', 'comfort'],
            ['parking_brake_electric', 'Freno estacionamiento eléctrico', 'comfort'],
            ['parking_brake_mechanical', 'Freno estacionamiento mecánico', 'comfort'],

            // Interior
            ['leather_seats', 'Tapiz de cuero', 'interior'],
            ['synthetic_leather', 'Cuero sintético', 'interior'],
            ['fabric_seats', 'Tapiz de tela', 'interior'],

            // Exterior / lighting
            ['led_headlights', 'Faros LED', 'exterior'],
            ['halogen_headlights', 'Faros halógenos', 'exterior'],
            ['auto_lights', 'Encendido automático de luces', 'exterior'],
            ['fog_lights', 'Neblineros', 'exterior'],
            ['panoramic_roof', 'Techo panorámico', 'exterior'],
            ['sunroof', 'Techo corredizo', 'exterior'],
            ['roof_rails', 'Barras portaequipaje', 'exterior'],
            ['power_tailgate', 'Portalón eléctrico', 'exterior'],
            ['rear_camera', 'Cámara de retroceso', 'exterior'],
            ['camera_360', 'Cámara 360° (PVM)', 'exterior'],
            ['front_parking_sensor', 'Sensores estacionamiento delanteros', 'exterior'],
            ['rear_parking_sensor', 'Sensores estacionamiento traseros', 'exterior'],

            // Off-road
            ['hill_descent', 'Control de descenso', 'offroad'],
            ['multi_terrain_select', 'Multi-Terrain Select', 'offroad'],
            ['crawl_control', 'Crawl Control', 'offroad'],
            ['diff_lock_rear', 'Bloqueo diferencial trasero', 'offroad'],
            ['diff_lock_center', 'Bloqueo diferencial central', 'offroad'],
            ['tow_hitch', 'Enganche de remolque', 'offroad'],
        ];

        foreach ($features as $index => [$code, $name, $category]) {
            Feature::updateOrCreate(
                ['code' => $code],
                [
                    'name_es' => $name,
                    'category' => $category,
                    'data_type' => 'boolean',
                    'display_order' => $index,
                    'is_active' => true,
                ]
            );
        }
    }
}
