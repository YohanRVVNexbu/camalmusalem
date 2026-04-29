<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CotizacionVehiculo;
use Inertia\Inertia;

class CotizacionVehiculoController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/cotizaciones-vehiculos/index', [
            'cotizaciones' => CotizacionVehiculo::orderByDesc('created_at')->get(),
        ]);
    }

    public function marcarLeido(CotizacionVehiculo $cotizacion)
    {
        $cotizacion->update(['leido' => true]);
        return back();
    }

    public function destroy(CotizacionVehiculo $cotizacion)
    {
        $cotizacion->delete();
        return back()->with('success', 'Cotización eliminada.');
    }
}
