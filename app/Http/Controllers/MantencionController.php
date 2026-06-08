<?php

namespace App\Http\Controllers;

use App\Mail\MantencionMail;
use App\Models\MantencionAgendamiento;
use App\Rules\Rut;
use App\Rules\Telefono;
use App\Services\NotificationRouter;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\RateLimiter;

class MantencionController extends Controller
{
    /**
     * Slots horarios que se ofrecen en el formulario (deben coincidir con la
     * lista `allTimeSlots` del frontend en agendar-mantencion.tsx).
     *
     * Decisión de negocio (mayo 2026): el sistema NO bloquea horas ya
     * reservadas. El formulario funciona como un buzón — el cliente elige
     * cualquier slot disponible y el asesor confirma manualmente después.
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
            // Regla pedida por servicio técnico: solo lunes a viernes y con un
            // mínimo de 48 hrs de anticipación. Refuerza la restricción del
            // calendario del front por si el request llega manipulado.
            'fecha'      => ['required', 'date', function ($attribute, $value, $fail) {
                $fecha = Carbon::parse($value);
                if (in_array($fecha->dayOfWeek, [Carbon::SATURDAY, Carbon::SUNDAY], true)) {
                    $fail('Solo se pueden agendar citas de lunes a viernes.');
                    return;
                }
                // Comparamos por día calendario (igual que el calendario del
                // frontend): el día reservado debe ser >= el día de "ahora+48h".
                // Antes se comparaba contra now()+48h con hora exacta, lo que
                // rechazaba fechas que el calendario sí permitía → error al enviar.
                if ($fecha->copy()->startOfDay()->lt(now()->addHours(48)->startOfDay())) {
                    $fail('La reserva debe solicitarse con al menos 48 horas de anticipación.');
                }
            }],
            'hora'       => ['required', 'string', 'max:10'],
            'modelo'     => ['required', 'string', 'max:255'],
            'anio'       => ['required', 'string', 'max:10'],
            'patente'    => ['required', 'string', 'max:20'],
            'comentario' => ['nullable', 'string'],
            'nombre'     => ['required', 'string', 'max:255'],
            'rut'        => ['required', 'string', 'max:20', new Rut],
            'telefono'   => ['required', 'string', 'max:50', new Telefono],
            'correo'     => ['required', 'email', 'max:255'],
            'privacidad' => ['accepted'],
        ]);

        $mantencion = MantencionAgendamiento::create($request->only(
            'servicio', 'taller', 'fecha', 'hora',
            'modelo', 'anio', 'patente', 'comentario',
            'nombre', 'rut', 'telefono', 'correo'
        ));

        try {
            // Acuse de recibo al cliente
            Mail::to($mantencion->correo)->send(new MantencionMail($mantencion));

            // Notificación al servicio técnico según el taller seleccionado
            if ($team = NotificationRouter::for('mantencion', $mantencion->taller)) {
                Mail::to($team)->send(new MantencionMail($mantencion));
            }
        } catch (\Throwable $e) {
            Log::warning('No se pudo enviar el correo de mantención: '.$e->getMessage());
        }

        return back()->with('success', 'true');
    }
}
