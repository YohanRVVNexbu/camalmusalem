<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Noticia;
use App\Services\SiteSettingsService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class NoticiaController extends Controller
{
    public function __construct(private SiteSettingsService $settings) {}

    public function index()
    {
        return Inertia::render('admin/noticias/index', [
            'noticias' => Noticia::orderBy('order')->orderByDesc('published_at')->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/noticias/form', ['noticia' => null]);
    }

    public function store(Request $request)
    {
        $data = $this->validated($request);
        $data['slug'] = Str::slug($data['title']);
        $noticia = Noticia::create($data);

        if ($request->hasFile('image')) {
            $noticia->update(['image' => $this->settings->uploadFile($request->file('image'), 'noticias')]);
        }

        return redirect('/admin/noticias')->with('success', 'Noticia creada correctamente.');
    }

    public function edit(Noticia $noticia)
    {
        return Inertia::render('admin/noticias/form', ['noticia' => $noticia]);
    }

    public function update(Request $request, Noticia $noticia)
    {
        $data = $this->validated($request);

        if ($request->hasFile('image')) {
            $this->settings->deleteOldFile($noticia->image);
            $data['image'] = $this->settings->uploadFile($request->file('image'), 'noticias');
        }

        $noticia->update($data);

        return back()->with('success', 'Noticia actualizada correctamente.');
    }

    public function destroy(Noticia $noticia)
    {
        $this->settings->deleteOldFile($noticia->image);
        $noticia->delete();

        return redirect('/admin/noticias')->with('success', 'Noticia eliminada.');
    }

    private function validated(Request $request): array
    {
        return $request->validate([
            'title'        => ['required', 'string', 'max:255'],
            'excerpt'      => ['nullable', 'string'],
            'content'      => ['nullable', 'string'],
            'published_at' => ['nullable', 'date'],
            'is_visible'   => ['boolean'],
            'order'        => ['integer'],
        ]);
    }
}
