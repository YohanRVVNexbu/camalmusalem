<?php

namespace App\Http\Controllers;

use App\Mail\CotizacionRepuestoMail;
use App\Models\CotizacionRepuesto;
use App\Models\Repuesto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\RateLimiter;

class CotizacionRepuestoController extends Controller
{
    public function store(Request $request, string $id)
    {
        $key = 'cotizacion-repuesto:'.$request->ip();
        if (RateLimiter::tooManyAttempts($key, 5)) {
            $seconds = RateLimiter::availableIn($key);
            return back()->with('error', "Demasiados intentos. Por favor espera {$seconds} segundos.");
        }
        RateLimiter::hit($key, 600);

        if ($request->filled('_website')) {
            return back()->with('success', 'true');
        }

        $repuesto = Repuesto::findOrFail($id);

        $request->validate([
            'nombre'      => ['required', 'string', 'max:255'],
            'email'       => ['required', 'email', 'max:255'],
            'telefono'    => ['required', 'string', 'max:50'],
            'sucursal'    => ['required', 'string', 'max:100'],
            'comentarios' => ['nullable', 'string'],
        ]);

        $cotizacion = CotizacionRepuesto::create([
            'repuesto_id'      => $repuesto->id,
            'repuesto_nombre'  => $repuesto->name,
            'repuesto_precio'  => $repuesto->price,
            'nombre'           => $request->nombre,
            'email'            => $request->email,
            'telefono'         => $request->telefono,
            'sucursal'         => $request->sucursal,
            'comentarios'      => $request->comentarios,
        ]);

        try {
            Mail::to($cotizacion->email)->send(new CotizacionRepuestoMail($cotizacion));
        } catch (\Throwable $e) {
            Log::warning('No se pudo enviar el correo de cotización repuesto: '.$e->getMessage());
        }

        return back()->with('success', 'true');
    }
}
