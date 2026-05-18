<?php

namespace App\Http\Controllers;

use App\Mail\MantencionMail;
use App\Models\MantencionAgendamiento;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;

class MantencionController extends Controller
{
    /**
     * Slots horarios disponibles para agendar (deben coincidir con la lista
     * `allTimeSlots` del frontend en agendar-mantencion.tsx).
     */
    public const TIME_SLOTS = [
        '09:00','09:30','10:00','10:30','11:00','11:30','12:00','12:30','13:00',
        '14:45','15:00','15:30','16:00','16:30','17:00','17:30','18:00',
    ];

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
            'privacidad' => ['accepted'],
        ]);

        // Race-condition guard: si otro usuario tomó el slot mientras éste
        // completaba el formulario, devolvemos un error de validación claro
        // sobre el campo `hora` para que el frontend muestre el mensaje.
        $taken = MantencionAgendamiento::where('taller', $request->input('taller'))
            ->where('fecha', $request->input('fecha'))
            ->where('hora', $request->input('hora'))
            ->exists();
        if ($taken) {
            throw ValidationException::withMessages([
                'hora' => 'Lo sentimos, esa hora acaba de ser reservada por otro cliente. Por favor elige otro horario.',
            ]);
        }

        $mantencion = MantencionAgendamiento::create($request->only(
            'servicio', 'taller', 'fecha', 'hora',
            'modelo', 'anio', 'patente', 'comentario',
            'nombre', 'rut', 'telefono', 'correo'
        ));

        try {
            Mail::to($mantencion->correo)->send(new MantencionMail($mantencion));
        } catch (\Throwable $e) {
            Log::warning('No se pudo enviar el correo de mantención: '.$e->getMessage());
        }

        return back()->with('success', 'true');
    }

    /**
     * Devuelve las horas ocupadas para un taller específico desde hoy hasta
     * `days` días adelante (default 60). El frontend usa esta data para:
     *  - Deshabilitar los slots horarios que ya están reservados.
     *  - Marcar como deshabilitado el día completo cuando TODAS las horas
     *    del taller están reservadas.
     *
     * Filtra por taller porque las reservas en una sucursal no bloquean la
     * disponibilidad en la otra.
     */
    public function bookedSlots(Request $request)
    {
        $request->validate([
            'taller' => ['required', 'string', 'max:255'],
            'days'   => ['nullable', 'integer', 'min:1', 'max:180'],
        ]);

        $taller = $request->input('taller');
        $days   = (int) $request->input('days', 60);

        $from = now()->startOfDay();
        $to   = $from->copy()->addDays($days);

        $rows = MantencionAgendamiento::query()
            ->where('taller', $taller)
            ->whereBetween('fecha', [$from->toDateString(), $to->toDateString()])
            ->get(['fecha', 'hora']);

        // Agrupa por fecha en formato 'YYYY-MM-DD' → ['09:00','09:30',...]
        $byDate = [];
        foreach ($rows as $r) {
            $date = \Illuminate\Support\Carbon::parse($r->fecha)->toDateString();
            $byDate[$date] = $byDate[$date] ?? [];
            if (! in_array($r->hora, $byDate[$date], true)) {
                $byDate[$date][] = $r->hora;
            }
        }

        $totalSlots = count(self::TIME_SLOTS);
        $fullDays = [];
        foreach ($byDate as $date => $taken) {
            if (count($taken) >= $totalSlots) {
                $fullDays[] = $date;
            }
        }

        return response()->json([
            'taller'      => $taller,
            'timeSlots'   => self::TIME_SLOTS,
            'bookedSlots' => $byDate,
            'fullDays'    => $fullDays,
        ]);
    }
}
