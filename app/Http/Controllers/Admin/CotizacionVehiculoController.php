<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CotizacionVehiculo;
use App\Services\Salesforce\CotizacionSyncService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CotizacionVehiculoController extends Controller
{
    /**
     * Bandeja de cotizaciones separada por tipo (?tipo=nuevo|seminuevo).
     * Pedido del cliente (jun 2026): no mezclar las cotizaciones de 0 km
     * con las de seminuevos. Default: nuevo.
     */
    public function index(Request $request)
    {
        $tipo = in_array($request->query('tipo'), ['nuevo', 'seminuevo'], true)
            ? $request->query('tipo')
            : 'nuevo';

        $cotizaciones = CotizacionVehiculo::query()
            ->where('tipo', $tipo)
            ->with(['branch:id,name', 'version:id,trim_name,material_code,option_code'])
            ->orderByDesc('created_at')
            ->get();

        return Inertia::render('admin/cotizaciones-vehiculos/index', [
            'cotizaciones' => $cotizaciones,
            'tipo'         => $tipo,
            // Contadores para los tabs (incluye no-leídas como referencia rápida).
            'counts'       => [
                'nuevo'      => CotizacionVehiculo::where('tipo', 'nuevo')->count(),
                'seminuevo'  => CotizacionVehiculo::where('tipo', 'seminuevo')->count(),
            ],
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

    /**
     * Reintenta sincronizar una cotización con Salesforce de forma síncrona.
     * Útil cuando el operador acaba de cargar el dealer_id que faltaba, o
     * cuando una cotización quedó failed por un error transitorio. La acción
     * espera la respuesta de Salesforce y muestra el resultado inmediatamente.
     */
    public function reintentarSync(CotizacionVehiculo $cotizacion, CotizacionSyncService $service)
    {
        if ($cotizacion->tipo !== 'nuevo') {
            return back()->with('error', 'Solo cotizaciones de vehículos nuevos se sincronizan a Salesforce.');
        }

        // Reset del estado para que el service intente de nuevo desde cero.
        $cotizacion->update([
            'sync_status'     => 'pending',
            'sync_last_error' => null,
        ]);

        try {
            $success = $service->syncOne($cotizacion);
            if ($success) {
                return back()->with('success', 'Cotización sincronizada con Salesforce.');
            }
            return back()->with('error', 'No se pudo sincronizar: '.$cotizacion->fresh()->sync_last_error);
        } catch (\Throwable $e) {
            return back()->with('error', 'Error reintentable: '.$e->getMessage().'. El scheduler la volverá a intentar.');
        }
    }
}
