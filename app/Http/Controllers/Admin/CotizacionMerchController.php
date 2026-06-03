<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CotizacionMerch;
use Inertia\Inertia;

class CotizacionMerchController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/cotizaciones-merch/index', [
            'cotizaciones' => CotizacionMerch::orderByDesc('created_at')->get(),
        ]);
    }

    public function marcarLeido(CotizacionMerch $cotizacion)
    {
        $cotizacion->update(['leido' => true]);
        return back();
    }

    public function destroy(CotizacionMerch $cotizacion)
    {
        $cotizacion->delete();
        return back()->with('success', 'Cotización eliminada.');
    }
}
