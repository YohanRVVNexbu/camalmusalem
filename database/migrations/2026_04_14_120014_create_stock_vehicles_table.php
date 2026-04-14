<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('stock_vehicles', function (Blueprint $table) {
            $table->id();

            $table->foreignId('vehicle_version_id')->nullable()->constrained()->nullOnDelete();

            $table->string('vin', 17)->unique();
            $table->string('engine_number')->nullable();
            $table->string('license_plate')->nullable()->unique();
            $table->year('model_year');
            $table->unsignedInteger('mileage_km')->default(0);
            $table->enum('condition', ['new', 'used', 'demo', 'certified'])->default('new');
            $table->enum('stock_status', ['available', 'reserved', 'sold', 'in_transit', 'service', 'archived'])->default('available');

            $table->string('brand_name_snapshot');
            $table->string('model_name_snapshot');
            $table->string('version_name_snapshot');
            $table->string('powertrain_snapshot')->nullable();
            $table->string('transmission_snapshot')->nullable();
            $table->string('drivetrain_snapshot')->nullable();

            $table->string('color_name_snapshot');
            $table->string('color_hex_snapshot', 7)->nullable();
            $table->string('interior_color_snapshot')->nullable();

            $table->unsignedBigInteger('list_price_clp')->nullable();
            $table->unsignedBigInteger('sale_price_clp')->nullable();
            $table->string('currency', 3)->default('CLP');
            $table->decimal('iva_rate', 5, 2)->default(19.00);

            $table->date('arrival_date')->nullable();
            $table->date('sold_date')->nullable();
            $table->string('branch')->nullable();
            $table->string('technical_sheet_pdf_path')->nullable();
            $table->json('specs_snapshot')->nullable();
            $table->json('features_snapshot')->nullable();
            $table->json('gallery')->nullable();
            $table->text('notes')->nullable();

            $table->timestamps();
            $table->softDeletes();

            $table->index(['stock_status', 'condition']);
            $table->index('vehicle_version_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stock_vehicles');
    }
};
