<?php

namespace App\Http\Controllers;

use App\Mail\CotizacionMerchMail;
use App\Models\CotizacionMerch;
use App\Models\Merch;
use App\Rules\Telefono;
use App\Services\NotificationRouter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\RateLimiter;

class CotizacionMerchController extends Controller
{
    public function store(Request $request, string $id)
    {
        $key = 'cotizacion-merch:'.$request->ip();
        if (RateLimiter::tooManyAttempts($key, 5)) {
            $seconds = RateLimiter::availableIn($key);
            return back()->with('error', "Demasiados intentos. Por favor espera {$seconds} segundos.");
        }
        RateLimiter::hit($key, 600);

        if ($request->filled('_website')) {
            return back()->with('success', 'true');
        }

        $merch = Merch::findOrFail($id);

        $request->validate([
            'nombre'      => ['required', 'string', 'max:255'],
            'email'       => ['required', 'email', 'max:255'],
            'telefono'    => ['required', 'string', 'max:50', new Telefono],
            'sucursal'    => ['required', 'string', 'max:100'],
            'comentarios' => ['nullable', 'string'],
            'privacidad'  => ['accepted'],
        ]);

        $cotizacion = CotizacionMerch::create([
            'merch_id'     => $merch->id,
            'merch_nombre' => $merch->name,
            'merch_precio' => $merch->price,
            'nombre'       => $request->nombre,
            'email'        => $request->email,
            'telefono'     => $request->telefono,
            'sucursal'     => $request->sucursal,
            'comentarios'  => $request->comentarios,
        ]);

        try {
            // Acuse de recibo al cliente
            Mail::to($cotizacion->email)->send(new CotizacionMerchMail($cotizacion));

            // Notificación al equipo (Merch comparte correo con Accesorios y
            // Repuestos según el PDF del cliente, separado por sucursal).
            if ($team = NotificationRouter::for('accesorios', $cotizacion->sucursal)) {
                Mail::to($team)->send(new CotizacionMerchMail($cotizacion));
            }
        } catch (\Throwable $e) {
            Log::warning('No se pudo enviar el correo de cotización merch: '.$e->getMessage());
        }

        return back()->with('success', 'true');
    }
}
