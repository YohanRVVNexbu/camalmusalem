<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Relaja los ENUMs del esquema a VARCHAR para aceptar valores creados
     * por el cliente desde el mantenedor de lookups. Los datos existentes
     * se preservan (mismos strings, sin transformación).
     */
    public function up(): void
    {
        DB::statement('ALTER TABLE vehicle_models MODIFY body_type VARCHAR(50) NULL');
        DB::statement('ALTER TABLE vehicle_versions MODIFY powertrain_type VARCHAR(50) NOT NULL');
        DB::statement('ALTER TABLE vehicle_versions MODIFY drivetrain VARCHAR(50) NOT NULL');
        DB::statement('ALTER TABLE vehicle_versions MODIFY transmission_type VARCHAR(50) NULL');
        DB::statement('ALTER TABLE version_engine MODIFY fuel_type VARCHAR(50) NULL');
        DB::statement('ALTER TABLE version_colors MODIFY type VARCHAR(50) NOT NULL DEFAULT "solid"');
        DB::statement('ALTER TABLE features MODIFY category VARCHAR(50) NOT NULL');
    }

    public function down(): void
    {
        DB::statement("ALTER TABLE vehicle_models MODIFY body_type ENUM('sedan','hatchback','suv','pickup','crossover','coupe','van','other') NULL");
        DB::statement("ALTER TABLE vehicle_versions MODIFY powertrain_type ENUM('gasoline','diesel','hybrid','phev','bev') NOT NULL");
        DB::statement("ALTER TABLE vehicle_versions MODIFY drivetrain ENUM('fwd','rwd','awd','4wd') NOT NULL");
        DB::statement("ALTER TABLE vehicle_versions MODIFY transmission_type ENUM('MT','AT','CVT','eCVT','DCT','AMT') NULL");
        DB::statement("ALTER TABLE version_engine MODIFY fuel_type ENUM('gasoline','diesel','lpg','cng') NULL");
        DB::statement("ALTER TABLE version_colors MODIFY type ENUM('solid','metallic','pearl','matte') NOT NULL DEFAULT 'solid'");
        DB::statement("ALTER TABLE features MODIFY category ENUM('safety','tss','comfort','infotainment','exterior','interior','offroad','performance','other') NOT NULL");
    }
};
