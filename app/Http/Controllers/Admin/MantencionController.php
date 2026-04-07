<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MantencionAgendamiento;
use Inertia\Inertia;

class MantencionController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/mantenciones/index', [
            'agendamientos' => MantencionAgendamiento::orderByDesc('created_at')->get(),
        ]);
    }

    public function marcarLeido(MantencionAgendamiento $agendamiento)
    {
        $agendamiento->update(['leido' => true]);
        return back();
    }

    public function destroy(MantencionAgendamiento $agendamiento)
    {
        $agendamiento->delete();
        return back()->with('success', 'Agendamiento eliminado.');
    }
}
