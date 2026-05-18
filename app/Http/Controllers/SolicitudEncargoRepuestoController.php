<?php

namespace App\Http\Controllers;

use App\Mail\SolicitudEncargoRepuestoMail;
use App\Models\SolicitudEncargoRepuesto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\RateLimiter;

class SolicitudEncargoRepuestoController extends Controller
{
    public function store(Request $request)
    {
        $key = 'encargo-repuesto:'.$request->ip();
        if (RateLimiter::tooManyAttempts($key, 5)) {
            $seconds = RateLimiter::availableIn($key);
            return back()->with('error', "Demasiados intentos. Por favor espera {$seconds} segundos.");
        }
        RateLimiter::hit($key, 600);

        if ($request->filled('_website')) {
            return back()->with('success', 'true');
        }

        $request->validate([
            'nombre'          => ['required', 'string', 'max:255'],
            'email'           => ['required', 'email', 'max:255'],
            'telefono'        => ['required', 'string', 'max:50'],
            'sucursal'        => ['required', 'string', 'max:255'],
            'modelo'          => ['nullable', 'string', 'max:100'],
            'marca'           => ['nullable', 'string', 'max:100'],
            'vin'             => ['nullable', 'string', 'max:50'],
            'lista_repuestos' => ['required', 'string'],
            'privacidad'      => ['accepted'],
        ]);

        $solicitud = SolicitudEncargoRepuesto::create($request->only(
            'nombre', 'email', 'telefono', 'sucursal',
            'modelo', 'marca', 'vin', 'lista_repuestos'
        ));

        try {
            Mail::to($solicitud->email)->send(new SolicitudEncargoRepuestoMail($solicitud));
        } catch (\Throwable $e) {
            Log::warning('No se pudo enviar el correo de solicitud encargo repuestos: '.$e->getMessage());
        }

        return back()->with('success', 'true');
    }
}
