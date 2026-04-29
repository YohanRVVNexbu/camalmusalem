<?php

namespace App\Http\Controllers;

use App\Mail\KintoSolicitudMail;
use App\Models\KintoSolicitud;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\RateLimiter;

class KintoSolicitudController extends Controller
{
    public function store(Request $request)
    {
        $key = 'kinto:' . $request->ip();
        if (RateLimiter::tooManyAttempts($key, 5)) {
            $seconds = RateLimiter::availableIn($key);
            return back()->with('error', "Demasiados intentos. Por favor espera {$seconds} segundos.");
        }
        RateLimiter::hit($key, 600);

        if ($request->filled('_website')) {
            return back()->with('success', 'true');
        }

        $request->validate([
            'sucursal'     => ['required', 'string', 'max:100'],
            'fecha'        => ['required', 'string', 'max:50'],
            'duracion'     => ['required', 'string', 'max:50'],
            'duracion_tipo'=> ['required', 'in:horas,dias'],
            'vehiculo'     => ['required', 'string', 'max:100'],
            'nombre'       => ['required', 'string', 'max:255'],
            'rut'          => ['required', 'string', 'max:20'],
            'telefono'     => ['required', 'string', 'max:50'],
            'correo'       => ['required', 'email', 'max:255'],
        ]);

        $solicitud = KintoSolicitud::create($request->only(
            'sucursal', 'fecha', 'duracion', 'duracion_tipo',
            'vehiculo', 'nombre', 'rut', 'telefono', 'correo'
        ));

        try {
            Mail::to($solicitud->correo)->send(new KintoSolicitudMail($solicitud));
        } catch (\Throwable $e) {
            Log::warning('No se pudo enviar el correo de Kinto: '.$e->getMessage());
        }

        return back()->with('success', 'true');
    }
}
