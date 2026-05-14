<?php

use App\Models\SiteSection;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration {
    public function up(): void
    {
        $defaults = [
            'text'         => 'Contáctanos para recibir asesoría personalizada',
            'button_label' => 'Contactar ventas',
            'button_href'  => '/contacto',
            'image'        => '',
            'image_mobile' => '',
        ];

        SiteSection::updateOrCreate(
            ['section' => 'contact_cta_banner'],
            [
                'data'         => $defaults,
                'default_data' => $defaults,
                'is_visible'   => true,
                'order'        => 8,
            ],
        );
    }

    public function down(): void
    {
        SiteSection::where('section', 'contact_cta_banner')->delete();
    }
};
