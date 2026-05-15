<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('vehicle_models', function (Blueprint $t) {
            $t->string('datasheet_url', 500)->nullable()->after('hero_image');
        });
    }

    public function down(): void
    {
        Schema::table('vehicle_models', function (Blueprint $t) {
            $t->dropColumn('datasheet_url');
        });
    }
};
