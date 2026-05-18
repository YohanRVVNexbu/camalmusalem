<?php

namespace App\Http\Controllers;

use App\Mail\PrevencionDelitoMail;
use App\Models\PrevencionDelito;
use App\Models\SiteSection;
use App\Rules\Rut;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\RateLimiter;
use Inertia\Inertia;

class PrevencionDelitoController extends Controller
{
    public function show()
    {
        $footer = SiteSection::where('section', 'footer')->first();

        return Inertia::render('prevencion-delito', [
            'footer' => $footer && $footer->is_visible ? ($footer->data ?? []) : null,
        ]);
    }

    public function store(Request $request)
    {
        $key = 'prevencion-delito:'.$request->ip();
        if (RateLimiter::tooManyAttempts($key, 5)) {
            $seconds = RateLimiter::availableIn($key);
            return back()->withErrors(['_general' => "Demasiados intentos. Por favor espera {$seconds} segundos."]);
        }
        RateLimiter::hit($key, 600);

        if ($request->filled('_website')) {
            return back()->with('success', '¡Denuncia recibida! Será revisada con confidencialidad.');
        }

        $request->validate([
            'nombre'   => ['required', 'string', 'max:255'],
            'asunto'   => ['required', 'string', 'max:255'],
            'email'    => ['required', 'email', 'max:255'],
            'telefono' => ['nullable', 'string', 'max:50'],
            'rut'      => ['required', 'string', 'max:20', new Rut],
            'mensaje'  => ['required', 'string'],
            'privacidad' => ['accepted'],
        ]);

        $denuncia = PrevencionDelito::create($request->only('nombre', 'asunto', 'email', 'telefono', 'rut', 'mensaje'));

        try {
            Mail::to($denuncia->email)->send(new PrevencionDelitoMail($denuncia));
        } catch (\Throwable $e) {
            Log::warning('No se pudo enviar el correo de prevención del delito: '.$e->getMessage());
        }

        return back()->with('success', '¡Denuncia recibida! Será revisada con confidencialidad.');
    }
}
