<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('seminuevos', function (Blueprint $table) {
            $table->string('slug')->unique()->nullable()->after('model');
            $table->string('down_payment')->nullable()->after('price');
            $table->json('featured_gallery')->nullable()->after('gallery');
            $table->json('specs')->nullable()->after('featured_gallery');
        });
    }

    public function down(): void
    {
        Schema::table('seminuevos', function (Blueprint $table) {
            $table->dropColumn(['slug', 'down_payment', 'featured_gallery', 'specs']);
        });
    }
};
