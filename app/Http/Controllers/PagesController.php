<?php

namespace App\Http\Controllers;

use App\Models\SiteSection;
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

    public function shorts()
    {
        $footer = SiteSection::where('section', 'footer')->first();

        return Inertia::render('shorts', [
            'footer' => $footer?->data ?? [],
        ]);
    }

    public function noticias()
    {
        $footer = SiteSection::where('section', 'footer')->first();

        return Inertia::render('noticias', [
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
            'contenido'   => 'Contenido completo de la noticia...',
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
