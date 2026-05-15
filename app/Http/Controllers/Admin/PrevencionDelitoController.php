<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PrevencionDelito;
use Inertia\Inertia;

class PrevencionDelitoController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/prevencion-delito/index', [
            'denuncias' => PrevencionDelito::orderByDesc('created_at')->get(),
        ]);
    }

    public function marcarLeido(PrevencionDelito $denuncia)
    {
        $denuncia->update(['leido' => true]);
        return back();
    }

    public function destroy(PrevencionDelito $denuncia)
    {
        $denuncia->delete();
        return back()->with('success', 'Denuncia eliminada.');
    }
}
