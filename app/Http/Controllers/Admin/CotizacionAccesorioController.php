<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CotizacionAccesorio;
use Inertia\Inertia;

class CotizacionAccesorioController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/cotizaciones-accesorios/index', [
            'cotizaciones' => CotizacionAccesorio::orderByDesc('created_at')->get(),
        ]);
    }

    public function marcarLeido(CotizacionAccesorio $cotizacion)
    {
        $cotizacion->update(['leido' => true]);
        return back();
    }

    public function destroy(CotizacionAccesorio $cotizacion)
    {
        $cotizacion->delete();
        return back()->with('success', 'Cotización eliminada.');
    }
}
