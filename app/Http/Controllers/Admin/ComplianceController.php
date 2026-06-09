<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Denuncia;
use App\Models\DenunciaAdjunto;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\StreamedResponse;

/**
 * Bandeja administrativa unificada para denuncias de Ley 20.393 y Ley
 * Karin. La atiende el Encargado de Prevención del Delito.
 *
 * La página `index` lista todas las denuncias con filtros por `tipo` y
 * `estado`. El `show` muestra el detalle completo (incluyendo
 * denunciante, denunciado, hechos, adjuntos) — esto es lo único que NO
 * sale por correo. Los adjuntos viven en el disco `local` (storage/app/
 * private/) y se descargan vía `downloadAdjunto` que verifica que el
 * adjunto pertenezca a una denuncia existente antes de servirlo.
 */
class ComplianceController extends Controller
{
    public function index(Request $request)
    {
        $tipo = $request->string('tipo')->toString() ?: null;
        $estado = $request->string('estado')->toString() ?: null;

        $denuncias = Denuncia::query()
            ->when($tipo, fn ($q) => $q->where('tipo', $tipo))
            ->when($estado, fn ($q) => $q->where('estado', $estado))
            ->orderByDesc('created_at')
            ->get()
            ->map(fn (Denuncia $d) => [
                'id'             => $d->id,
                'tipo'           => $d->tipo,
                'tipo_label'     => $d->tipoLabel(),
                'modalidad'      => $d->modalidad,
                'tracking_code'  => $d->tracking_code,
                'nombre'         => $d->nombre,
                'asunto'         => $d->asunto,
                'categoria'      => $d->categoria,
                'categoria_label' => $d->categoriaLabel(),
                'email'          => $d->email,
                'telefono'       => $d->telefono,
                'rut'            => $d->rut,
                'estado'         => $d->estado,
                'leido'          => (bool) $d->leido,
                'created_at'     => $d->created_at?->toIso8601String(),
            ]);

        return Inertia::render('admin/compliance/index', [
            'denuncias' => $denuncias,
            'filters'   => [
                'tipo'   => $tipo,
                'estado' => $estado,
            ],
            'counts'    => [
                'total'         => Denuncia::count(),
                'no_leidas'     => Denuncia::where('leido', false)->count(),
                'ley_karin'     => Denuncia::karin()->count(),
                'ley_20393'     => Denuncia::ley20393()->count(),
                'recibidas'     => Denuncia::where('estado', Denuncia::ESTADO_RECIBIDA)->count(),
                'en_investigacion' => Denuncia::where('estado', Denuncia::ESTADO_EN_INVESTIGACION)->count(),
                'cerradas'      => Denuncia::where('estado', Denuncia::ESTADO_CERRADA)->count(),
            ],
        ]);
    }

    public function show(Denuncia $denuncia)
    {
        // Marcar como leída al abrir el detalle. Audit log más serio lo
        // implementamos cuando se decida con la abogada si retenemos o
        // no logs de acceso.
        if (! $denuncia->leido) {
            $denuncia->update(['leido' => true]);
        }

        $denuncia->load('adjuntos');

        return Inertia::render('admin/compliance/show', [
            'denuncia' => [
                'id'                   => $denuncia->id,
                'tipo'                 => $denuncia->tipo,
                'tipo_label'           => $denuncia->tipoLabel(),
                'modalidad'            => $denuncia->modalidad,
                'tracking_code'        => $denuncia->tracking_code,
                'nombre'               => $denuncia->nombre,
                'email'                => $denuncia->email,
                'telefono'             => $denuncia->telefono,
                'rut'                  => $denuncia->rut,
                'asunto'               => $denuncia->asunto,
                'categoria'            => $denuncia->categoria,
                'categoria_label'      => $denuncia->categoriaLabel(),
                'hechos_descripcion'   => $denuncia->hechos_descripcion,
                'hechos_fecha'         => $denuncia->hechos_fecha?->format('Y-m-d'),
                'hechos_lugar'         => $denuncia->hechos_lugar,
                'hechos_testigos'      => $denuncia->hechos_testigos,
                'denunciado_nombre'    => $denuncia->denunciado_nombre,
                'denunciado_cargo'     => $denuncia->denunciado_cargo,
                'denunciado_sucursal'  => $denuncia->denunciado_sucursal,
                'payload'              => $denuncia->payload,
                'estado'               => $denuncia->estado,
                'created_at'           => $denuncia->created_at?->toIso8601String(),
                'adjuntos' => $denuncia->adjuntos->map(fn (DenunciaAdjunto $a) => [
                    'id'            => $a->id,
                    'original_name' => $a->original_name,
                    'mime_type'     => $a->mime_type,
                    'size_bytes'    => $a->size_bytes,
                ])->all(),
            ],
            'estados' => [
                Denuncia::ESTADO_RECIBIDA         => 'Recibida',
                Denuncia::ESTADO_EN_INVESTIGACION => 'En investigación',
                Denuncia::ESTADO_CERRADA          => 'Cerrada',
            ],
        ]);
    }

    public function marcarLeido(Denuncia $denuncia)
    {
        $denuncia->update(['leido' => true]);
        return back();
    }

    public function updateEstado(Request $request, Denuncia $denuncia)
    {
        $data = $request->validate([
            'estado' => ['required', 'in:'.implode(',', [
                Denuncia::ESTADO_RECIBIDA,
                Denuncia::ESTADO_EN_INVESTIGACION,
                Denuncia::ESTADO_CERRADA,
            ])],
        ]);
        $denuncia->update(['estado' => $data['estado']]);
        return back()->with('success', 'Estado actualizado.');
    }

    public function destroy(Denuncia $denuncia)
    {
        // Borrar adjuntos físicos del disco local antes de borrar el
        // registro (cascade en BD se encarga de la fila pero no del
        // archivo).
        foreach ($denuncia->adjuntos as $adjunto) {
            Storage::disk('local')->delete($adjunto->path);
        }
        $denuncia->delete();
        return redirect('/admin/compliance/denuncias')->with('success', 'Denuncia eliminada.');
    }

    /**
     * Streamea un adjunto desde el disco `local`. Solo accesible bajo el
     * middleware admin (configurado en routes/admin.php). Verifica que
     * el adjunto pertenezca a la denuncia indicada en la URL para evitar
     * que alguien cambie el ID y descargue adjuntos de otra denuncia.
     */
    public function downloadAdjunto(Denuncia $denuncia, DenunciaAdjunto $adjunto): StreamedResponse
    {
        abort_unless($adjunto->denuncia_id === $denuncia->id, 404);
        abort_unless(Storage::disk('local')->exists($adjunto->path), 404);

        return Storage::disk('local')->download($adjunto->path, $adjunto->original_name, [
            'Content-Type' => $adjunto->mime_type ?? 'application/octet-stream',
        ]);
    }

    /**
     * Descarga la denuncia completa en PDF (el mismo documento que se
     * adjunta al correo del encargado). Útil para imprimir/archivar.
     */
    public function downloadPdf(Denuncia $denuncia)
    {
        $denuncia->load('adjuntos');

        return Pdf::loadView('pdf.denuncia', ['denuncia' => $denuncia])
            ->download("denuncia-{$denuncia->tracking_code}.pdf");
    }
}
