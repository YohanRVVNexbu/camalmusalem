<?php

namespace App\Http\Controllers;

use App\Models\SiteSection;
use Inertia\Inertia;

class SeminuevosController extends Controller
{
    public function index()
    {
        $section = SiteSection::where('section', 'seminuevos_page')->first();
        $footer = SiteSection::where('section', 'footer')->first();

        return Inertia::render('seminuevos', [
            'data' => $section?->data ?? [],
            'footer' => $footer?->data ?? [],
        ]);
    }
}
