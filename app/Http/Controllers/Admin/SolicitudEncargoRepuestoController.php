<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SolicitudEncargoRepuesto;
use Inertia\Inertia;

class SolicitudEncargoRepuestoController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/solicitudes-encargo/index', [
            'solicitudes' => SolicitudEncargoRepuesto::orderByDesc('created_at')->get(),
        ]);
    }

    public function marcarLeido(SolicitudEncargoRepuesto $solicitud)
    {
        $solicitud->update(['leido' => true]);
        return back();
    }

    public function destroy(SolicitudEncargoRepuesto $solicitud)
    {
        $solicitud->delete();
        return back()->with('success', 'Solicitud eliminada.');
    }
}
