<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CotizacionRepuesto;
use Inertia\Inertia;

class CotizacionRepuestoController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/cotizaciones-repuestos/index', [
            'cotizaciones' => CotizacionRepuesto::orderByDesc('created_at')->get(),
        ]);
    }

    public function marcarLeido(CotizacionRepuesto $cotizacion)
    {
        $cotizacion->update(['leido' => true]);
        return back();
    }

    public function destroy(CotizacionRepuesto $cotizacion)
    {
        $cotizacion->delete();
        return back()->with('success', 'Cotización eliminada.');
    }
}
