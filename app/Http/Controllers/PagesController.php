<?php

namespace App\Http\Controllers;

use App\Models\Noticia;
use App\Models\SiteSection;
use App\Services\YouTubeService;
use Inertia\Inertia;

class PagesController extends Controller
{
    private function section(string $key): array
    {
        return SiteSection::where('section', $key)->first()?->data ?? [];
    }

    public function programas()
    {
        return Inertia::render('programas', [
            'footer'         => $this->section('footer'),
            'programas'      => $this->section('programas'),
            'programas_hero' => $this->section('programas_hero'),
            'programas_grid' => $this->section('programas_grid'),
        ]);
    }

    public function shorts(YouTubeService $youtubeService)
    {
        return Inertia::render('shorts', [
            'footer'      => $this->section('footer'),
            'shorts_hero' => $this->section('shorts_hero'),
            'videos'      => $youtubeService->getShorts(16),
        ]);
    }

    public function noticias()
    {
        $noticias = Noticia::where('is_visible', true)
            ->orderBy('published_at', 'desc')
            ->get()
            ->map(fn ($n) => [
                'id'          => $n->id,
                'slug'        => $n->slug,
                'titulo'      => $n->title,
                'categoria'   => $n->categoria ?? 'Noticias',
                'fecha'       => $n->published_at?->format('d/m/y') ?? '',
                'descripcion' => $n->excerpt ?? '',
                'img'         => $n->image ?? '',
            ])
            ->toArray();

        return Inertia::render('noticias', [
            'footer'        => $this->section('footer'),
            'noticias_hero' => $this->section('noticias_hero'),
            'noticias'      => $noticias,
        ]);
    }

    public function noticiaShow(string $slug)
    {
        $noticia = Noticia::where('slug', $slug)->where('is_visible', true)->firstOrFail();

        // Backwards compat: if no sections yet, wrap old content as a text section
        $sections = $noticia->sections ?? [];
        if (empty($sections) && $noticia->content) {
            $sections = [['type' => 'text', 'content' => $noticia->content]];
        }

        $relacionadas = Noticia::where('is_visible', true)
            ->where('id', '!=', $noticia->id)
            ->orderByDesc('published_at')
            ->limit(3)
            ->get()
            ->map(fn($n) => [
                'id'          => $n->id,
                'slug'        => $n->slug,
                'titulo'      => $n->title,
                'categoria'   => $n->categoria ?? 'Noticias',
                'fecha'       => $n->published_at?->format('d/m/y') ?? '',
                'descripcion' => $n->excerpt ?? '',
                'img'         => $n->image ?? '',
            ]);

        return Inertia::render('noticias/show', [
            'footer'      => $this->section('footer'),
            'relacionadas' => $relacionadas,
            'noticia'     => [
                'slug'      => $noticia->slug,
                'titulo'    => $noticia->title,
                'categoria' => $noticia->categoria ?? 'Noticias',
                'fecha'     => $noticia->published_at?->format('d/m/y') ?? '',
                'sections'  => $sections,
            ],
        ]);
    }

    public function contacto()
    {
        return Inertia::render('contacto', [
            'footer'        => $this->section('footer'),
            'contacto_info' => $this->section('contacto_info'),
        ]);
    }

    public function nosotros()
    {
        return Inertia::render('nosotros', [
            'footer'                    => $this->section('footer'),
            'nosotros_hero'             => $this->section('nosotros_hero'),
            'nosotros_historia'         => $this->section('nosotros_historia'),
            'nosotros_mision'           => $this->section('nosotros_mision'),
            'nosotros_vision'           => $this->section('nosotros_vision'),
            'nosotros_equipo'           => $this->section('nosotros_equipo'),
            'nosotros_reconocimientos'  => $this->section('nosotros_reconocimientos'),
        ]);
    }

    public function kinto()
    {
        return Inertia::render('kinto', [
            'footer'           => $this->section('footer'),
            'kinto_hero'       => $this->section('kinto_hero'),
            'kinto_pasos'      => $this->section('kinto_pasos'),
            'kinto_vehiculos'  => $this->section('kinto_vehiculos'),
        ]);
    }

    public function valoresMantencion()
    {
        return Inertia::render('valores-mantencion', [
            'footer' => $this->section('footer'),
        ]);
    }
}
