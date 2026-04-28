<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('vehicle_versions', function (Blueprint $table) {
            $table->unsignedBigInteger('bono_marca')->nullable()->after('msrp_clp');
            $table->unsignedBigInteger('bono_financiamiento_r9')->nullable()->after('bono_marca');
            $table->unsignedBigInteger('bono_financiamiento_tradicional')->nullable()->after('bono_financiamiento_r9');
        });
    }

    public function down(): void
    {
        Schema::table('vehicle_versions', function (Blueprint $table) {
            $table->dropColumn(['bono_marca', 'bono_financiamiento_r9', 'bono_financiamiento_tradicional']);
        });
    }
};
