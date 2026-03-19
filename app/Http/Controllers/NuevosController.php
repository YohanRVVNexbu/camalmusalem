<?php

namespace App\Http\Controllers;

use App\Models\SiteSection;
use Inertia\Inertia;

class NuevosController extends Controller
{
    public function index()
    {
        $section = SiteSection::where('section', 'nuevos_page')->first();
        $footer = SiteSection::where('section', 'footer')->first();

        return Inertia::render('nuevos', [
            'data' => $section?->data ?? [],
            'footer' => $footer?->data ?? [],
        ]);
    }
}
