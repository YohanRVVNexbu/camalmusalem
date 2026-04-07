<?php

namespace App\Http\Controllers;

use App\Models\MantencionAgendamiento;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;

class MantencionController extends Controller
{
    public function store(Request $request)
    {
        $key = 'mantencion:' . $request->ip();
        if (RateLimiter::tooManyAttempts($key, 5)) {
            $seconds = RateLimiter::availableIn($key);
            return back()->with('error', "Demasiados intentos. Por favor espera {$seconds} segundos.");
        }
        RateLimiter::hit($key, 600);

        if ($request->filled('_website')) {
            return back()->with('success', 'true');
        }

        $request->validate([
            'servicio'   => ['required', 'string', 'max:255'],
            'taller'     => ['required', 'string', 'max:255'],
            'fecha'      => ['required', 'date'],
            'hora'       => ['required', 'string', 'max:10'],
            'modelo'     => ['required', 'string', 'max:255'],
            'anio'       => ['required', 'string', 'max:10'],
            'patente'    => ['required', 'string', 'max:20'],
            'comentario' => ['nullable', 'string'],
            'nombre'     => ['required', 'string', 'max:255'],
            'rut'        => ['required', 'string', 'max:20'],
            'telefono'   => ['required', 'string', 'max:50'],
            'correo'     => ['required', 'email', 'max:255'],
        ]);

        MantencionAgendamiento::create($request->only(
            'servicio', 'taller', 'fecha', 'hora',
            'modelo', 'anio', 'patente', 'comentario',
            'nombre', 'rut', 'telefono', 'correo'
        ));

        return back()->with('success', 'true');
    }
}
