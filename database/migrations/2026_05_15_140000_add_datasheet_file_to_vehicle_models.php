<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('vehicle_models', function (Blueprint $t) {
            $t->string('datasheet_file', 500)->nullable()->after('datasheet_url');
        });
    }

    public function down(): void
    {
        Schema::table('vehicle_models', function (Blueprint $t) {
            $t->dropColumn('datasheet_file');
        });
    }
};
