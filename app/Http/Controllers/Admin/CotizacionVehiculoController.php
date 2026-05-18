<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CotizacionVehiculo;
use App\Services\Salesforce\CotizacionSyncService;
use Inertia\Inertia;

class CotizacionVehiculoController extends Controller
{
    public function index()
    {
        $cotizaciones = CotizacionVehiculo::query()
            ->with(['branch:id,name', 'version:id,trim_name,material_code,option_code'])
            ->orderByDesc('created_at')
            ->get();

        return Inertia::render('admin/cotizaciones-vehiculos/index', [
            'cotizaciones' => $cotizaciones,
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
