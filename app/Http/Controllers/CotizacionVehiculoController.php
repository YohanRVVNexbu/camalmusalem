<?php

namespace App\Http\Controllers;

use App\Mail\CotizacionVehiculoMail;
use App\Models\CotizacionVehiculo;
use App\Models\Seminuevo;
use App\Models\VehicleModel;
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
            'nombre'      => ['required', 'string', 'max:255'],
            'email'       => ['required', 'email', 'max:255'],
            'telefono'    => ['required', 'string', 'max:50'],
            'comentarios' => ['nullable', 'string'],
        ]);

        // Snapshot del vehículo
        if ($request->tipo === 'nuevo') {
            $model = VehicleModel::with('versions')->find($request->vehicle_id);
            $nombre = $model?->name ?? 'Vehículo nuevo';
            $firstVersion = $model?->versions->first();
            $precio = $firstVersion?->msrp_clp ? '$'.number_format($firstVersion->msrp_clp, 0, ',', '.') : null;
        } else {
            $seminuevo = Seminuevo::find($request->vehicle_id);
            $nombre = $seminuevo ? "{$seminuevo->brand} {$seminuevo->model} {$seminuevo->year}" : 'Seminuevo';
            $precio = $seminuevo?->price;
        }

        $cotizacion = CotizacionVehiculo::create([
            'tipo'           => $request->tipo,
            'vehicle_id'     => $request->vehicle_id,
            'vehicle_nombre' => $nombre,
            'vehicle_precio' => $precio,
            'nombre'         => $request->nombre,
            'email'          => $request->email,
            'telefono'       => $request->telefono,
            'comentarios'    => $request->comentarios,
        ]);

        try {
            Mail::to($cotizacion->email)->send(new CotizacionVehiculoMail($cotizacion));
        } catch (\Throwable $e) {
            Log::warning('No se pudo enviar el correo de cotización vehículo: '.$e->getMessage());
        }

        return back()->with('success', 'true');
    }
}
