<?php

namespace App\Http\Controllers;

use App\Mail\DenunciaConfirmacionMail;
use App\Mail\DenunciaNotificacionMail;
use App\Models\Denuncia;
use App\Models\DenunciaAdjunto;
use App\Models\SiteSection;
use App\Rules\Rut;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

/**
 * Controlador del módulo de Compliance.
 *
 * Agrupa la landing `/compliance` (con descargas administrables: manual
 * de prevención del delito, política Karin, código de ética) y los dos
 * canales de denuncia exigidos por la ley:
 *
 *  - /compliance/denuncia-prevencion-delito  (Ley 20.393)
 *  - /compliance/denuncia-ley-karin          (Ley 21.643)
 *
 * Ambos formularios escriben en la misma tabla `denuncias` (ver modelo
 * Denuncia) diferenciando por la columna `tipo`. La bandeja del admin
 * vive en /admin/compliance/denuncias y la atiende el Encargado de
 * Prevención del Delito.
 *
 * Decisiones de privacidad implementadas aquí:
 *  - Las denuncias anónimas NO guardan nombre/email/teléfono/RUT.
 *  - Los adjuntos van al disco `local` (storage/app/private/denuncias/…),
 *    nunca al disco público — solo se sirven desde admin con auth.
 *  - El correo al encargado NO incluye el contenido de la denuncia
 *    (ver DenunciaNotificacionMail); solo notifica y enlaza al admin.
 *  - El asunto del correo al denunciante es neutro a propósito.
 *  - Honeypot + RateLimiter en cada submit para evitar spam.
 */
class ComplianceController extends Controller
{
    /**
     * Tipos MIME aceptados para adjuntos. Lista alineada con lo que pide
     * la Dirección del Trabajo para denuncias Ley Karin (PDF/JPG) más
     * extensiones comunes que usa el formato Santo Tomás (DOC/XLS/PPT).
     */
    private const MIME_ACEPTADOS = [
        'application/pdf',
        'image/jpeg',
        'image/png',
        'image/webp',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];

    private const MAX_ADJUNTOS = 5;
    private const MAX_SIZE_KB  = 5120; // 5 MB por archivo

    private function section(string $key): ?array
    {
        $section = SiteSection::where('section', $key)->first();
        if (! $section || ! $section->is_visible) {
            return null;
        }

        return $section->data ?? [];
    }

    public function index()
    {
        return Inertia::render('compliance/index', [
            'footer'                  => $this->section('footer'),
            'compliance_hero'         => $this->section('compliance_hero'),
            'compliance_descargas'    => $this->section('compliance_descargas'),
            'compliance_canales'      => $this->section('compliance_canales'),
        ]);
    }

    /**
     * Redirige la ruta vieja /prevencion-delito a la nueva. El cliente
     * ya tenía esta URL en folletos / mails / footer antes de mover todo
     * bajo /compliance, así que mantenemos el redirect permanente.
     */
    public function redirectLegacyPrevencionDelito()
    {
        return redirect('/compliance/denuncia-prevencion-delito', 301);
    }

    // -------- Ley 20.393 (Prevención del Delito) --------

    public function denunciaPrevencionDelito()
    {
        return Inertia::render('compliance/denuncia-prevencion-delito', [
            'footer'            => $this->section('footer'),
            'categorias'        => Denuncia::CATEGORIAS_LEY_20393,
            'relacionesEmpresa' => Denuncia::RELACIONES_EMPRESA,
            'frecuencias'       => Denuncia::FRECUENCIAS,
            'montos'            => Denuncia::MONTOS,
            'evidencia'         => Denuncia::EVIDENCIA,
            'reportadoAntes'    => Denuncia::REPORTADO_ANTES,
            'otrosSaben'        => Denuncia::OTROS_SABEN,
        ]);
    }

    public function denunciaPrevencionDelitoStore(Request $request)
    {
        return $this->storeDenuncia($request, Denuncia::TIPO_LEY_20393);
    }

    // -------- Ley Karin (21.643) --------
    // Nota: la abogada va a confirmar los campos exactos en los próximos
    // días. El shell de abajo usa la estructura universal (modalidad,
    // identificación, denunciado, hechos, declaración) que ambas leyes
    // comparten y deja `categoria` con el catálogo Karin por defecto.

    public function denunciaLeyKarin()
    {
        return Inertia::render('compliance/denuncia-ley-karin', [
            'footer'     => $this->section('footer'),
            'categorias' => Denuncia::CATEGORIAS_LEY_KARIN,
        ]);
    }

    public function denunciaLeyKarinStore(Request $request)
    {
        return $this->storeDenuncia($request, Denuncia::TIPO_LEY_KARIN);
    }

    // -------- Seguimiento por tracking code --------

    public function seguimiento(Request $request)
    {
        $code = trim((string) $request->query('code', ''));
        $denuncia = null;

        if ($code !== '') {
            // Buscamos solo los campos públicos — el denunciante consulta
            // estado, NO el contenido completo.
            $found = Denuncia::where('tracking_code', strtoupper($code))->first();
            if ($found) {
                $denuncia = [
                    'tracking_code' => $found->tracking_code,
                    'tipo'          => $found->tipo,
                    'tipo_label'    => $found->tipoLabel(),
                    'estado'        => $found->estado,
                    'recibida_en'   => $found->created_at?->format('d-m-Y'),
                ];
            }
        }

        return Inertia::render('compliance/seguimiento', [
            'footer'   => $this->section('footer'),
            'code'     => $code,
            'denuncia' => $denuncia,
            'notFound' => $code !== '' && $denuncia === null,
        ]);
    }

    // -------- Lógica compartida --------

    /**
     * Valida y persiste una denuncia. La forma de validar depende del
     * tipo y de la modalidad: una denuncia anónima no exige nombre, una
     * identificada sí. Si todo pasa: persiste, guarda adjuntos al disco
     * `local`, dispara los dos correos (neutro al encargado, neutro al
     * denunciante si dejó email) y vuelve al formulario con success.
     */
    private function storeDenuncia(Request $request, string $tipo)
    {
        $key = "compliance:{$tipo}:".$request->ip();
        if (RateLimiter::tooManyAttempts($key, 3)) {
            $seconds = RateLimiter::availableIn($key);
            return back()->withErrors(['_general' => "Demasiados intentos. Por favor espera {$seconds} segundos."]);
        }
        RateLimiter::hit($key, 600);

        // Honeypot: si un bot llenó el campo invisible `_website`,
        // fingimos éxito para no darle pistas.
        if ($request->filled('_website')) {
            return back()->with('success', 'Hemos recibido tu solicitud.');
        }

        $catalog = $tipo === Denuncia::TIPO_LEY_KARIN
            ? Denuncia::CATEGORIAS_LEY_KARIN
            : Denuncia::CATEGORIAS_LEY_20393;

        $modalidad = $request->input('modalidad', Denuncia::MODALIDAD_IDENTIFICADA);
        $esAnonima = $modalidad === Denuncia::MODALIDAD_ANONIMA;

        $rules = [
            'modalidad'             => ['required', 'in:identificada,reserva,anonima'],
            'categoria'             => ['required', 'string', 'in:'.implode(',', array_keys($catalog))],
            'asunto'                => ['nullable', 'string', 'max:255'],
            'hechos_descripcion'    => ['required', 'string', 'min:50'],
            'hechos_fecha'          => ['nullable', 'date'],
            'hechos_lugar'          => ['nullable', 'string', 'max:255'],
            'hechos_testigos'       => ['nullable', 'string', 'max:1000'],
            'denunciado_nombre'     => ['nullable', 'string', 'max:255'],
            'denunciado_cargo'      => ['nullable', 'string', 'max:255'],
            'denunciado_sucursal'   => ['nullable', 'string', 'max:255'],
            'declaracion_veracidad' => ['accepted'],
            'privacidad'            => ['accepted'],
            'adjuntos'              => ['nullable', 'array', 'max:'.self::MAX_ADJUNTOS],
            'adjuntos.*'            => ['file', 'max:'.self::MAX_SIZE_KB, 'mimetypes:'.implode(',', self::MIME_ACEPTADOS)],

            // Campos extra del "Formulario de Denuncia MUSALEM" (Ley 20.393 +
            // Ley 19.913). Todos opcionales para mantener compat con Ley Karin
            // que sigue usando el formulario simplificado. Se guardan en el
            // payload JSON, no en columnas dedicadas.
            'categoria_otro'                 => ['nullable', 'string', 'max:255'],
            'relacion_empresa'               => ['nullable', 'string', 'in:'.implode(',', array_keys(Denuncia::RELACIONES_EMPRESA))],
            'relacion_empresa_otro'          => ['nullable', 'string', 'max:255'],
            'reserva_total'                  => ['nullable', 'boolean'],
            'hechos_periodo_desde'           => ['nullable', 'date'],
            'hechos_periodo_hasta'           => ['nullable', 'date'],
            'hechos_continua'                => ['nullable', 'boolean'],
            'hechos_fechas_desconocidas'     => ['nullable', 'boolean'],
            'denunciado_area'                => ['nullable', 'string', 'max:255'],
            'frecuencia'                     => ['nullable', 'string', 'in:'.implode(',', array_keys(Denuncia::FRECUENCIAS))],
            'monto_estimado'                 => ['nullable', 'string', 'in:'.implode(',', array_keys(Denuncia::MONTOS))],
            'evidencia_descripcion'          => ['nullable', 'string', 'max:2000'],
            'tiene_evidencia'                => ['nullable', 'string', 'in:'.implode(',', array_keys(Denuncia::EVIDENCIA))],
            'reportado_antes'                => ['nullable', 'string', 'in:'.implode(',', array_keys(Denuncia::REPORTADO_ANTES))],
            'reportado_a_quien'              => ['nullable', 'string', 'max:255'],
            'otros_saben'                    => ['nullable', 'string', 'in:'.implode(',', array_keys(Denuncia::OTROS_SABEN))],
            'recibir_actualizaciones'        => ['nullable', 'boolean'],
            'observaciones'                  => ['nullable', 'string', 'max:2000'],
        ];

        // Identificación: requerida salvo que la denuncia sea anónima.
        if (! $esAnonima) {
            $rules['nombre']   = ['required', 'string', 'max:255'];
            $rules['email']    = ['required', 'email', 'max:255'];
            $rules['telefono'] = ['nullable', 'string', 'max:50'];
            $rules['rut']      = ['nullable', 'string', 'max:20', new Rut];
        }

        $data = $request->validate($rules);

        // Campos del payload (form oficial MUSALEM). Solo guardamos los que
        // tienen valor — null vacío no aporta nada al JSON.
        $payload = array_filter([
            'categoria_otro'             => $data['categoria_otro'] ?? null,
            'relacion_empresa'           => $data['relacion_empresa'] ?? null,
            'relacion_empresa_otro'      => $data['relacion_empresa_otro'] ?? null,
            'reserva_total'              => $request->boolean('reserva_total') ?: null,
            'hechos_periodo_desde'       => $data['hechos_periodo_desde'] ?? null,
            'hechos_periodo_hasta'       => $data['hechos_periodo_hasta'] ?? null,
            'hechos_continua'            => $request->boolean('hechos_continua') ?: null,
            'hechos_fechas_desconocidas' => $request->boolean('hechos_fechas_desconocidas') ?: null,
            'denunciado_area'            => $data['denunciado_area'] ?? null,
            'frecuencia'                 => $data['frecuencia'] ?? null,
            'monto_estimado'             => $data['monto_estimado'] ?? null,
            'evidencia_descripcion'      => $data['evidencia_descripcion'] ?? null,
            'tiene_evidencia'            => $data['tiene_evidencia'] ?? null,
            'reportado_antes'            => $data['reportado_antes'] ?? null,
            'reportado_a_quien'          => $data['reportado_a_quien'] ?? null,
            'otros_saben'                => $data['otros_saben'] ?? null,
            'recibir_actualizaciones'    => $request->boolean('recibir_actualizaciones') ?: null,
            'observaciones'              => $data['observaciones'] ?? null,
        ], fn ($v) => $v !== null && $v !== '');

        $denuncia = Denuncia::create([
            'tipo'                 => $tipo,
            'modalidad'            => $modalidad,
            'tracking_code'        => Denuncia::generateTrackingCode(),
            'asunto'               => $data['asunto'] ?? null,
            'categoria'            => $data['categoria'],
            'nombre'               => $esAnonima ? null : ($data['nombre'] ?? null),
            'email'                => $esAnonima ? null : ($data['email'] ?? null),
            'telefono'             => $esAnonima ? null : ($data['telefono'] ?? null),
            'rut'                  => $esAnonima ? null : ($data['rut'] ?? null),
            'hechos_descripcion'   => $data['hechos_descripcion'],
            'hechos_fecha'         => $data['hechos_fecha'] ?? null,
            'hechos_lugar'         => $data['hechos_lugar'] ?? null,
            'hechos_testigos'      => $data['hechos_testigos'] ?? null,
            'denunciado_nombre'    => $data['denunciado_nombre'] ?? null,
            'denunciado_cargo'     => $data['denunciado_cargo'] ?? null,
            'denunciado_sucursal'  => $data['denunciado_sucursal'] ?? null,
            'declaracion_veracidad' => true,
            'payload'              => $payload ?: null,
            'estado'               => Denuncia::ESTADO_RECIBIDA,
        ]);

        // Adjuntos al disco `local` (private), no al disco público.
        foreach ((array) $request->file('adjuntos', []) as $file) {
            /** @var UploadedFile $file */
            $stored = $file->storeAs(
                "denuncias/{$denuncia->id}",
                Str::random(20).'.'.$file->getClientOriginalExtension(),
                'local'
            );
            DenunciaAdjunto::create([
                'denuncia_id'   => $denuncia->id,
                'path'          => $stored,
                'original_name' => $file->getClientOriginalName(),
                'mime_type'     => $file->getMimeType(),
                'size_bytes'    => $file->getSize(),
            ]);
        }

        // Notificar al encargado (sin contenido). Si falla el envío, no
        // bloqueamos al usuario — la denuncia ya está guardada.
        $this->enviarNotificacionAlEncargado($denuncia);

        // Confirmación al denunciante si dejó email.
        if (! $esAnonima && $denuncia->email) {
            try {
                Mail::to($denuncia->email)->send(new DenunciaConfirmacionMail($denuncia));
            } catch (\Throwable $e) {
                Log::warning('Compliance: error enviando confirmación al denunciante', [
                    'denuncia_id' => $denuncia->id,
                    'error'       => $e->getMessage(),
                ]);
            }
        }

        return back()->with([
            'success'       => '¡Recibimos tu denuncia! Será revisada con la mayor confidencialidad.',
            'tracking_code' => $denuncia->tracking_code,
        ]);
    }

    private function enviarNotificacionAlEncargado(Denuncia $denuncia): void
    {
        $email = $denuncia->tipo === Denuncia::TIPO_LEY_KARIN
            ? (config('services.compliance.encargado_email_karin') ?: config('services.compliance.encargado_email'))
            : config('services.compliance.encargado_email');

        if (! $email) {
            Log::warning('Compliance: no hay correo de encargado configurado en services.compliance', [
                'denuncia_id' => $denuncia->id,
                'tipo'        => $denuncia->tipo,
            ]);
            return;
        }

        try {
            Mail::to($email)->send(new DenunciaNotificacionMail($denuncia));
        } catch (\Throwable $e) {
            Log::warning('Compliance: error notificando al encargado', [
                'denuncia_id' => $denuncia->id,
                'error'       => $e->getMessage(),
            ]);
        }
    }
}
