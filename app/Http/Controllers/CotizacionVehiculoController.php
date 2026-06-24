<?php

namespace App\Http\Controllers;

use App\Mail\CotizacionVehiculoMail;
use App\Models\CotizacionVehiculo;
use App\Models\Seminuevo;
use App\Models\VehicleModel;
use App\Models\VehicleVersion;
use App\Rules\Rut;
use App\Rules\Telefono;
use App\Services\NotificationRouter;
use App\Services\Salesforce\CotizacionSyncService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\RateLimiter;

class CotizacionVehiculoController extends Controller
{
    public function store(Request $request)
    {
        $key = 'cotizacion-vehiculo:'.$request->ip();
        if (RateLimiter::tooManyAttempts($key, 5)) {
            $seconds = RateLimiter::availableIn($key);
            return back()->with('error', "Demasiados intentos. Por favor espera {$seconds} segundos.");
        }
        RateLimiter::hit($key, 600);

        if ($request->filled('_website')) {
            return back()->with('success', 'true');
        }

        $request->validate([
            'tipo'        => ['required', 'in:nuevo,seminuevo'],
            'vehicle_id'  => ['required', 'integer'],
            'version_id'     => ['nullable', 'integer', 'exists:vehicle_versions,id'],
            'color'          => ['nullable', 'string', 'max:120'],
            'color_code'     => ['nullable', 'string', 'max:120'],
            'color_internal' => ['nullable', 'string', 'max:120'],
            'branch_id'   => ['nullable', 'integer', 'exists:branches,id'],
            'nombre'      => ['required', 'string', 'max:255'],
            'email'       => ['required', 'email', 'max:255'],
            'telefono'    => ['required', 'string', 'max:50', new Telefono],
            'rut'         => ['required', 'string', 'max:20', new Rut],
            'comentarios' => ['nullable', 'string'],
            'privacidad'  => ['accepted'],
        ]);

        // Snapshot del vehículo. Cuando viene version_id, usamos esa versión
        // específica (la que el cliente clickeó) en vez de la primera del
        // modelo — así el asesor sabe exactamente qué trim le interesa.
        if ($request->tipo === 'nuevo') {
            $model = VehicleModel::with('versions')->find($request->vehicle_id);
            $version = $request->filled('version_id')
                ? VehicleVersion::find($request->integer('version_id'))
                : $model?->versions->first();
            $modelName = $model?->name ?? 'Vehículo nuevo';
            $nombre = $version
                ? trim($modelName.' — '.$version->trim_name)
                : $modelName;
            $precio = $version?->msrp_clp ? '$'.number_format($version->msrp_clp, 0, ',', '.') : null;
        } else {
            $seminuevo = Seminuevo::find($request->vehicle_id);
            $nombre = $seminuevo ? "{$seminuevo->brand} {$seminuevo->model} {$seminuevo->year}" : 'Seminuevo';
            $precio = $seminuevo?->price;
        }

        $cotizacion = CotizacionVehiculo::create([
            'tipo'           => $request->tipo,
            'vehicle_id'     => $request->vehicle_id,
            'branch_id'      => $request->integer('branch_id') ?: null,
            'version_id'     => $request->integer('version_id') ?: null,
            'color'          => $request->filled('color') ? $request->string('color')->trim()->value() : null,
            'color_code'     => $request->filled('color_code') ? $request->string('color_code')->trim()->value() : null,
            'color_internal' => $request->filled('color_internal') ? $request->string('color_internal')->trim()->value() : null,
            'vehicle_nombre' => $nombre,
            'vehicle_precio' => $precio,
            'nombre'         => $request->nombre,
            'email'          => $request->email,
            'telefono'       => $request->telefono,
            'rut'            => $request->rut,
            'comentarios'    => $request->comentarios,
        ]);

        try {
            // Acuse de recibo al cliente
            Mail::to($cotizacion->email)->send(new CotizacionVehiculoMail($cotizacion));

            // Notificación al equipo interno: nuevos → info@..., seminuevos → seminuevos@...
            $teamKey = $cotizacion->tipo === 'nuevo' ? 'vehiculos_nuevos' : 'vehiculos_seminuevos';
            if ($team = NotificationRouter::for($teamKey)) {
                Mail::to($team)->send(new CotizacionVehiculoMail($cotizacion));
            }
        } catch (\Throwable $e) {
            Log::warning('No se pudo enviar el correo de cotización vehículo: '.$e->getMessage());
        }

        // Cotizaciones de vehículo NUEVO se sincronizan a Salesforce vía
        // Mulesoft de forma SÍNCRONA inmediatamente después del email. Si
        // falla por cualquier motivo, la cotización queda con sync_status
        // `pending` o `failed` y el comando `salesforce:sync-pending` la
        // reintenta automáticamente cada cierto tiempo. No bloqueamos la
        // respuesta al usuario por errores de Salesforce.
        if ($cotizacion->tipo === 'nuevo') {
            try {
                app(CotizacionSyncService::class)->syncOne($cotizacion);
            } catch (\Throwable $e) {
                Log::warning('Salesforce sync inicial falló (se reintentará por scheduler)', [
                    'cotizacion_id' => $cotizacion->id,
                    'error'         => $e->getMessage(),
                ]);
            }
        }

        return back()->with('success', 'true');
    }
}
