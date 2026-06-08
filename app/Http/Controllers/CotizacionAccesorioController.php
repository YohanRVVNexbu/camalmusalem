<?php

namespace App\Http\Controllers;

use App\Mail\CotizacionAccesorioMail;
use App\Models\Accesorio;
use App\Models\CotizacionAccesorio;
use App\Rules\Telefono;
use App\Services\NotificationRouter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\RateLimiter;

class CotizacionAccesorioController extends Controller
{
    public function store(Request $request, string $id)
    {
        $key = 'cotizacion-accesorio:'.$request->ip();
        if (RateLimiter::tooManyAttempts($key, 5)) {
            $seconds = RateLimiter::availableIn($key);
            return back()->with('error', "Demasiados intentos. Por favor espera {$seconds} segundos.");
        }
        RateLimiter::hit($key, 600);

        if ($request->filled('_website')) {
            return back()->with('success', 'true');
        }

        $accesorio = Accesorio::findOrFail($id);

        $request->validate([
            'nombre'      => ['required', 'string', 'max:255'],
            'email'       => ['required', 'email', 'max:255'],
            'telefono'    => ['required', 'string', 'max:50', new Telefono],
            'sucursal'    => ['required', 'string', 'max:100'],
            'comentarios' => ['nullable', 'string'],
            'privacidad'  => ['accepted'],
        ]);

        $cotizacion = CotizacionAccesorio::create([
            'accesorio_id'      => $accesorio->id,
            'accesorio_nombre'  => $accesorio->name,
            'accesorio_precio'  => $accesorio->price,
            'nombre'            => $request->nombre,
            'email'             => $request->email,
            'telefono'          => $request->telefono,
            'sucursal'          => $request->sucursal,
            'comentarios'       => $request->comentarios,
        ]);

        try {
            // Acuse de recibo al cliente
            Mail::to($cotizacion->email)->send(new CotizacionAccesorioMail($cotizacion));

            // Notificación al equipo (Accesorios y Merch comparten correo con
            // Repuestos según el PDF del cliente, separado por sucursal).
            if ($team = NotificationRouter::for('accesorios', $cotizacion->sucursal)) {
                Mail::to($team)->send(new CotizacionAccesorioMail($cotizacion));
            }
        } catch (\Throwable $e) {
            Log::warning('No se pudo enviar el correo de cotización accesorio: '.$e->getMessage());
        }

        return back()->with('success', 'true');
    }
}
