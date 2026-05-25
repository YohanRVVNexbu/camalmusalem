<?php

use App\Models\SiteSection;
use Illuminate\Database\Migrations\Migration;

/**
 * Crea las secciones administrables de la página /compliance en
 * instalaciones existentes (sin tener que re-correr el seeder maestro).
 *
 * Las mismas keys también están en SiteSectionsSeeder para instalaciones
 * limpias; este migration es idempotente (updateOrCreate) — si las
 * secciones ya existen, no las pisa.
 */
return new class extends Migration {
    public function up(): void
    {
        SiteSection::updateOrCreate(['section' => 'compliance_hero'], [
            'data' => [
                'eyebrow'      => 'Toyota Musalem',
                'title'        => 'Compliance',
                'description'  => "Conoce nuestro Modelo de Prevención del Delito (Ley 20.393), nuestra política contra el acoso y la violencia en el trabajo (Ley Karin 21.643) y los canales de denuncia habilitados para reportar cualquier irregularidad de manera confidencial.",
                'image'        => '',
                'image_mobile' => '',
            ],
            'is_visible' => true,
            'order' => 30,
        ]);

        SiteSection::updateOrCreate(['section' => 'compliance_descargas'], [
            'data' => [
                'heading'     => 'Documentos de compliance',
                'description' => 'Descarga aquí los manuales y políticas vigentes de Toyota Musalem.',
                'items' => [
                    ['titulo' => 'Manual de Prevención del Delito (Ley 20.393)', 'descripcion' => 'Versión vigente', 'file' => ''],
                    ['titulo' => 'Política Ley Karin (Ley 21.643)',              'descripcion' => 'Procedimiento de denuncia, investigación y sanción', 'file' => ''],
                    ['titulo' => 'Código de Ética y Conducta',                    'descripcion' => 'Valores y conductas esperadas', 'file' => ''],
                ],
            ],
            'is_visible' => true,
            'order' => 31,
        ]);

        SiteSection::updateOrCreate(['section' => 'compliance_canales'], [
            'data' => [
                'heading'     => 'Canales de denuncia',
                'description' => 'Ambos canales son confidenciales. El Encargado de Prevención del Delito revisará tu mensaje y se contactará contigo si dejas tus datos.',
                'canales' => [
                    [
                        'titulo'       => 'Denuncia Ley 20.393 — Prevención del Delito',
                        'descripcion'  => 'Reporta hechos relacionados con cohecho, lavado de activos, receptación, negociación incompatible y demás delitos de la Ley 20.393.',
                        'button_label' => 'Iniciar denuncia',
                        'button_href'  => '/compliance/denuncia-prevencion-delito',
                    ],
                    [
                        'titulo'       => 'Denuncia Ley Karin — Acoso y violencia en el trabajo',
                        'descripcion'  => 'Canal de denuncias para situaciones de acoso laboral, acoso sexual o violencia en el trabajo bajo la Ley 21.643.',
                        'button_label' => 'Iniciar denuncia',
                        'button_href'  => '/compliance/denuncia-ley-karin',
                    ],
                ],
                'seguimiento' => [
                    'titulo'       => '¿Ya hiciste una denuncia?',
                    'descripcion'  => 'Consulta el estado de tu denuncia usando el código de seguimiento que recibiste por correo.',
                    'button_label' => 'Consultar estado',
                    'button_href'  => '/compliance/seguimiento',
                ],
            ],
            'is_visible' => true,
            'order' => 32,
        ]);
    }

    public function down(): void
    {
        SiteSection::whereIn('section', [
            'compliance_hero',
            'compliance_descargas',
            'compliance_canales',
        ])->delete();
    }
};
