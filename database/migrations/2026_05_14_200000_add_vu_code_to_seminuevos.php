<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('seminuevos', function (Blueprint $t) {
            $t->string('vu_code')->nullable()->after('model');
        });
    }

    public function down(): void
    {
        Schema::table('seminuevos', function (Blueprint $t) {
            $t->dropColumn('vu_code');
        });
    }
};
