<?php

namespace App\Http\Controllers;

use App\Models\SiteSection;
use Inertia\Inertia;

class PostVentaController extends Controller
{
    public function agendarMantencion()
    {
        $footer = SiteSection::where('section', 'footer')->first();
        return Inertia::render('post-venta/agendar-mantencion', [
            'footer' => $footer?->data ?? [],
        ]);
    }

    public function accesorios()
    {
        $footer = SiteSection::where('section', 'footer')->first();
        return Inertia::render('post-venta/accesorios', [
            'footer' => $footer?->data ?? [],
        ]);
    }

    public function repuestos()
    {
        $footer = SiteSection::where('section', 'footer')->first();
        return Inertia::render('post-venta/repuestos', [
            'footer' => $footer?->data ?? [],
        ]);
    }
}
