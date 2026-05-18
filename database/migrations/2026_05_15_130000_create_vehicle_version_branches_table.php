<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('vehicle_version_branches', function (Blueprint $t) {
            $t->id();
            $t->foreignId('vehicle_version_id')->constrained('vehicle_versions')->cascadeOnDelete();
            $t->foreignId('branch_id')->constrained('branches')->cascadeOnDelete();
            $t->timestamps();
            $t->unique(['vehicle_version_id', 'branch_id'], 'vvb_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vehicle_version_branches');
    }
};
