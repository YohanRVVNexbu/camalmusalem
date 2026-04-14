<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::dropIfExists('stock_vehicles');
    }

    public function down(): void
    {
        // Irrecoverable drop — no schema recreation on rollback. Use original
        // create_stock_vehicles_table migration if re-adding later.
    }
};
