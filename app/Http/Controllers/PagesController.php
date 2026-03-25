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
