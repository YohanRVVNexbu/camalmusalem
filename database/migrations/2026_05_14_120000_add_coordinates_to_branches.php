<?php

use App\Models\Branch;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('branches', function (Blueprint $t) {
            $t->decimal('latitude', 10, 7)->nullable()->after('maps_url');
            $t->decimal('longitude', 10, 7)->nullable()->after('latitude');
        });

        // Backfill known coordinates for the seeded sucursales so the public
        // arriendo form has a sensible default map pin out of the box.
        Branch::where('slug', 'sucursal-la-serena')
            ->update(['latitude' => -29.9050, 'longitude' => -71.2510]);
        Branch::where('slug', 'sucursal-ovalle')
            ->update(['latitude' => -30.5995, 'longitude' => -71.2008]);
    }

    public function down(): void
    {
        Schema::table('branches', function (Blueprint $t) {
            $t->dropColumn(['latitude', 'longitude']);
        });
    }
};
