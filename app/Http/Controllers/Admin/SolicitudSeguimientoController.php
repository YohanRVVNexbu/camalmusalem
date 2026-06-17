<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Contacto;
use App\Models\CotizacionAccesorio;
use App\Models\CotizacionMerch;
use App\Models\CotizacionRepuesto;
use App\Models\CotizacionVehiculo;
use App\Models\KintoSolicitud;
use App\Models\MantencionAgendamiento;
use App\Models\SolicitudEncargoRepuesto;
use App\Support\EstadoSeguimiento;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

/**
 * Actualiza el estado de seguimiento y/o la nota del asesor de cualquier
 * bandeja de solicitudes. Un solo endpoint genérico (en vez de un método por
 * cada controller) — el `tipo` de la URL mapea al modelo correspondiente
 * mediante un whitelist; cualquier otro valor → 404.
 */
class SolicitudSeguimientoController extends Controller
{
    /** Whitelist tipo (slug de la URL) => clase del modelo. */
    private const TIPOS = [
        'contacto'            => Contacto::class,
        'cotizacion-vehiculo' => CotizacionVehiculo::class,
        'cotizacion-accesorio' => CotizacionAccesorio::class,
        'cotizacion-repuesto' => CotizacionRepuesto::class,
        'cotizacion-merch'    => CotizacionMerch::class,
        'mantencion'          => MantencionAgendamiento::class,
        'kinto'               => KintoSolicitud::class,
        'encargo-repuesto'    => SolicitudEncargoRepuesto::class,
    ];

    public function update(Request $request, string $tipo, int $id)
    {
        $modelClass = self::TIPOS[$tipo] ?? abort(404);

        $validated = $request->validate([
            'estado'           => ['nullable', Rule::in(EstadoSeguimiento::valores())],
            'nota_seguimiento' => ['nullable', 'string', 'max:2000'],
        ]);

        $solicitud = $modelClass::findOrFail($id);

        // Solo tocamos lo que venga en el request (permite actualizar solo el
        // estado, o solo la nota, sin pisar el otro).
        if ($request->has('estado') && $validated['estado'] !== null) {
            $solicitud->estado = $validated['estado'];
        }
        if ($request->has('nota_seguimiento')) {
            $solicitud->nota_seguimiento = $validated['nota_seguimiento'] ?: null;
        }
        // Cambiar el estado o dejar nota implica que la solicitud fue vista.
        if (in_array('leido', $solicitud->getFillable(), true)) {
            $solicitud->leido = true;
        }
        $solicitud->save();

        return back()->with('success', 'Seguimiento actualizado.');
    }
}
