<?php

namespace App\Http\Controllers;

use App\Models\Contacto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;

class ContactoController extends Controller
{
    public function store(Request $request)
    {
        // Rate limiting: máx 5 envíos por IP cada 10 minutos
        $key = 'contacto:' . $request->ip();
        if (RateLimiter::tooManyAttempts($key, 5)) {
            $seconds = RateLimiter::availableIn($key);
            return back()->withErrors(['_general' => "Demasiados intentos. Por favor espera {$seconds} segundos."]);
        }
        RateLimiter::hit($key, 600);

        // Honeypot: si el campo trampa viene relleno, es un bot — responder OK sin guardar
        if ($request->filled('_website')) {
            return back()->with('success', '¡Mensaje enviado! Nos pondremos en contacto contigo a la brevedad.');
        }

        $request->validate([
            'nombre'   => ['required', 'string', 'max:255'],
            'asunto'   => ['required', 'string', 'max:255'],
            'email'    => ['required', 'email', 'max:255'],
            'telefono' => ['nullable', 'string', 'max:50'],
            'mensaje'  => ['required', 'string'],
        ]);

        Contacto::create($request->only('nombre', 'asunto', 'email', 'telefono', 'mensaje'));

        return back()->with('success', '¡Mensaje enviado! Nos pondremos en contacto contigo a la brevedad.');
    }
}
