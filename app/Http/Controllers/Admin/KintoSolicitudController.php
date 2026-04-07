<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\KintoSolicitud;
use Inertia\Inertia;

class KintoSolicitudController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/kinto-solicitudes/index', [
            'solicitudes' => KintoSolicitud::orderByDesc('created_at')->get(),
        ]);
    }

    public function marcarLeido(KintoSolicitud $solicitud)
    {
        $solicitud->update(['leido' => true]);
        return back();
    }

    public function destroy(KintoSolicitud $solicitud)
    {
        $solicitud->delete();
        return back()->with('success', 'Solicitud eliminada.');
    }
}
