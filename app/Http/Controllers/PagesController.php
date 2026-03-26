<?php

namespace App\Http\Controllers;

use App\Models\SiteSection;
use App\Services\YouTubeService;
use Inertia\Inertia;

class PagesController extends Controller
{
    public function programas()
    {
        $footer = SiteSection::where('section', 'footer')->first();
        $programas = SiteSection::where('section', 'programas')->first();

        return Inertia::render('programas', [
            'footer' => $footer?->data ?? [],
            'programas' => $programas?->data ?? [],
        ]);
    }

    public function shorts(YouTubeService $youtubeService)
    {
        $footer = SiteSection::where('section', 'footer')->first();

        return Inertia::render('shorts', [
            'footer'  => $footer?->data ?? [],
            'videos'  => $youtubeService->getShorts(16),
        ]);
    }

    public function noticias()
    {
        $footer = SiteSection::where('section', 'footer')->first();

        return Inertia::render('noticias', [
            'footer' => $footer?->data ?? [],
        ]);
    }

    public function kinto()
    {
        $footer = SiteSection::where('section', 'footer')->first();

        return Inertia::render('kinto', [
            'footer' => $footer?->data ?? [],
        ]);
    }

    public function valoresMantencion()
    {
        $footer = SiteSection::where('section', 'footer')->first();

        return Inertia::render('valores-mantencion', [
            'footer' => $footer?->data ?? [],
        ]);
    }

    public function noticiaShow(string $slug)
    {
        $footer = SiteSection::where('section', 'footer')->first();

        // Placeholder — reemplazar con modelo Noticia cuando exista
        $noticia = [
            'slug'        => $slug,
            'titulo'      => 'Toyota protagoniza el Japan Mobility Show 2025 con su visión de movilidad global',
            'categoria'   => 'Mundo Toyota',
            'fecha'       => '11/12/25',
            'imagen'      => null,
            'descripcion' => 'En el evento realizado en Tokio destacó la presentación de la nueva estrategia global de Toyota Motor Corporation',
            'contenido'   => '<p>Toyota presentó nuevos productos, conceptos y direcciones estratégicas en el Japan Mobility Show 2025, enfocados en desarrollar tecnologías conectadas, automatizadas, compartidas y electrificadas siguiendo su estrategia multivías, la cual contempla diferentes soluciones tecnológicas para la reducción de emisiones, alineada con los tres pilares de Beyond Zero: Beyond Emissions, Beyond Expectations y Beyond Restrictions, con el objetivo de brindar "Movilidad para Todos" y contribuir a una sociedad más segura, verde e inclusiva.</p><p>"\'Movilidad para Todos\', ese es nuestro objetivo. Queremos que todas las personas tengan acceso al movimiento, sin importar quiénes sean o dónde vivan", afirmó Akio Toyoda, presidente de Toyota Motor Corporation. "Contribuir a la cultura mundial significa construir una sociedad mejor a través del entendimiento mutuo y el intercambio de culturas entre distintos países y pueblos", agregó.</p><p><strong>En el evento realizado en Tokio destacó la presentación de la nueva estrategia global de Toyota Motor Corporation, que reorganiza su estructura en torno a cinco marcas: Toyota, Lexus, GR, Century y Daihatsu, como parte de su evolución hacia una empresa integral de movilidad. Estos cambios impactarán en el futuro al mercado chileno, donde la marca ya lidera varios segmentos claves, incluyendo el de vehículos cero y bajas emisiones.</strong></p>',
        ];

        return Inertia::render('noticias/show', [
            'footer'   => $footer?->data ?? [],
            'noticia'  => $noticia,
        ]);
    }

    public function contacto()
    {
        $footer = SiteSection::where('section', 'footer')->first();

        return Inertia::render('contacto', [
            'footer' => $footer?->data ?? [],
        ]);
    }

    public function nosotros()
    {
        $footer = SiteSection::where('section', 'footer')->first();

        return Inertia::render('nosotros', [
            'footer' => $footer?->data ?? [],
        ]);
    }
}
