<?php

namespace Database\Seeders;

use App\Models\BodyType;
use App\Models\ColorType;
use App\Models\Drivetrain;
use App\Models\FeatureCategory;
use App\Models\FuelType;
use App\Models\LookupItem;
use App\Models\PowertrainType;
use App\Models\TransmissionType;
use Illuminate\Database\Seeder;

class LookupsSeeder extends Seeder
{
    public function run(): void
    {
        $this->seed(FeatureCategory::class, [
            ['safety', 'Seguridad'],
            ['tss', 'Toyota Safety Sense'],
            ['comfort', 'Confort'],
            ['infotainment', 'Infoentretenimiento'],
            ['interior', 'Interior'],
            ['exterior', 'Exterior'],
            ['offroad', 'Off-road'],
            ['performance', 'Rendimiento'],
            ['other', 'Otros'],
        ]);

        $this->seed(BodyType::class, [
            ['sedan', 'Sedán'],
            ['hatchback', 'Hatchback'],
            ['suv', 'SUV'],
            ['pickup', 'Pickup'],
            ['crossover', 'Crossover'],
            ['coupe', 'Coupé'],
            ['van', 'Van'],
            ['other', 'Otro'],
        ]);

        $this->seed(PowertrainType::class, [
            ['gasoline', 'Gasolina'],
            ['diesel', 'Diésel'],
            ['hybrid', 'Híbrido'],
            ['phev', 'Híbrido Enchufable'],
            ['bev', 'Eléctrico'],
        ]);

        $this->seed(Drivetrain::class, [
            ['fwd', 'Delantera (FWD)'],
            ['rwd', 'Trasera (RWD)'],
            ['awd', 'Integral (AWD)'],
            ['4wd', '4x4 (4WD)'],
        ]);

        $this->seed(TransmissionType::class, [
            ['MT', 'Manual (MT)'],
            ['AT', 'Automática (AT)'],
            ['CVT', 'CVT'],
            ['eCVT', 'eCVT'],
            ['DCT', 'Doble embrague (DCT)'],
            ['AMT', 'Automatizada (AMT)'],
        ]);

        $this->seed(ColorType::class, [
            ['solid', 'Sólido'],
            ['metallic', 'Metalizado'],
            ['pearl', 'Perlado'],
            ['matte', 'Mate'],
        ]);

        $this->seed(FuelType::class, [
            ['gasoline', 'Gasolina'],
            ['diesel', 'Diésel'],
            ['lpg', 'GLP'],
            ['cng', 'GNC'],
        ]);
    }

    /**
     * @param  class-string<LookupItem>  $class
     */
    private function seed(string $class, array $rows): void
    {
        foreach ($rows as $i => [$code, $name]) {
            $class::updateOrCreate(
                ['code' => $code],
                ['name_es' => $name, 'display_order' => $i, 'is_active' => true]
            );
        }
    }
}
