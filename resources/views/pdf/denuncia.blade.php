@php
    use App\Models\Denuncia;

    $p = $denuncia->payload ?? [];
    $dash = fn ($v) => ($v === null || $v === '') ? '—' : $v;
    $lookup = fn (array $map, $k) => $k ? ($map[$k] ?? $k) : '—';

    $modalidades = [
        Denuncia::MODALIDAD_IDENTIFICADA => 'Identificada',
        Denuncia::MODALIDAD_RESERVA      => 'Con reserva de identidad',
        Denuncia::MODALIDAD_ANONIMA      => 'Anónima',
    ];
    $estados = [
        Denuncia::ESTADO_RECIBIDA         => 'Recibida',
        Denuncia::ESTADO_EN_INVESTIGACION => 'En investigación',
        Denuncia::ESTADO_CERRADA          => 'Cerrada',
    ];
    $esAnonima = $denuncia->modalidad === Denuncia::MODALIDAD_ANONIMA;
@endphp
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        * { box-sizing: border-box; }
        body { font-family: 'DejaVu Sans', sans-serif; font-size: 11px; color: #1a1a1a; margin: 0; }
        .head { border-bottom: 3px solid #EB0A1E; padding-bottom: 10px; margin-bottom: 6px; }
        h1 { font-size: 17px; margin: 0 0 3px; }
        .muted { color: #666; font-size: 10px; }
        .section { margin-top: 14px; }
        .section h2 { font-size: 12px; background: #111; color: #fff; padding: 5px 9px; margin: 0 0 6px; }
        table { width: 100%; border-collapse: collapse; }
        td { padding: 3px 6px; vertical-align: top; border-bottom: 1px solid #eee; }
        td.k { width: 34%; color: #555; font-weight: bold; }
        .box { border: 1px solid #ddd; background: #fafafa; padding: 9px; white-space: pre-wrap; line-height: 1.4; }
        .pill { display: inline-block; background: #EB0A1E; color: #fff; padding: 2px 8px; border-radius: 10px; font-size: 10px; }
        .footnote { margin-top: 18px; color: #888; font-size: 9px; border-top: 1px solid #ddd; padding-top: 8px; }
    </style>
</head>
<body>
    <div class="head">
        <h1>Denuncia — Canal de Compliance</h1>
        <div class="muted">
            <span class="pill">{{ $denuncia->tipoLabel() }}</span>
            &nbsp; Código de seguimiento: <strong>{{ $denuncia->tracking_code }}</strong>
        </div>
        <div class="muted" style="margin-top:4px">
            Recibida: {{ $denuncia->created_at?->format('d-m-Y H:i') }} &nbsp;·&nbsp;
            Modalidad: {{ $lookup($modalidades, $denuncia->modalidad) }} &nbsp;·&nbsp;
            Estado: {{ $lookup($estados, $denuncia->estado) }}
        </div>
    </div>

    {{-- Identificación del denunciante --}}
    <div class="section">
        <h2>Denunciante</h2>
        @if ($esAnonima)
            <p class="muted">Denuncia anónima — el denunciante optó por no entregar datos de identificación.</p>
        @else
            <table>
                <tr><td class="k">Nombre</td><td>{{ $dash($denuncia->nombre) }}</td></tr>
                <tr><td class="k">Email</td><td>{{ $dash($denuncia->email) }}</td></tr>
                <tr><td class="k">Teléfono</td><td>{{ $dash($denuncia->telefono) }}</td></tr>
                <tr><td class="k">RUT</td><td>{{ $dash($denuncia->rut) }}</td></tr>
                <tr><td class="k">Relación con la empresa</td><td>{{ $lookup(Denuncia::RELACIONES_EMPRESA, $p['relacion_empresa'] ?? null) }}{{ !empty($p['relacion_empresa_otro']) ? ' — '.$p['relacion_empresa_otro'] : '' }}</td></tr>
                @if (!empty($p['recibir_actualizaciones']))
                    <tr><td class="k">Desea actualizaciones</td><td>Sí</td></tr>
                @endif
            </table>
        @endif
    </div>

    {{-- Clasificación --}}
    <div class="section">
        <h2>Clasificación</h2>
        <table>
            <tr><td class="k">Asunto</td><td>{{ $dash($denuncia->asunto) }}</td></tr>
            <tr><td class="k">Categoría</td><td>{{ $dash($denuncia->categoriaLabel()) }}{{ !empty($p['categoria_otro']) ? ' — '.$p['categoria_otro'] : '' }}</td></tr>
        </table>
    </div>

    {{-- Hechos --}}
    <div class="section">
        <h2>Descripción de los hechos</h2>
        <div class="box">{{ $dash($denuncia->hechos_descripcion) }}</div>
        <table style="margin-top:6px">
            <tr><td class="k">Fecha del hecho</td><td>{{ $denuncia->hechos_fecha ? $denuncia->hechos_fecha->format('d-m-Y') : '—' }}</td></tr>
            @if (!empty($p['hechos_periodo_desde']) || !empty($p['hechos_periodo_hasta']))
                <tr><td class="k">Periodo</td><td>{{ $dash($p['hechos_periodo_desde'] ?? null) }} → {{ $dash($p['hechos_periodo_hasta'] ?? null) }}</td></tr>
            @endif
            @if (!empty($p['hechos_continua']))
                <tr><td class="k">¿Continúa ocurriendo?</td><td>Sí</td></tr>
            @endif
            @if (!empty($p['hechos_fechas_desconocidas']))
                <tr><td class="k">Fechas</td><td>Desconocidas</td></tr>
            @endif
            <tr><td class="k">Lugar</td><td>{{ $dash($denuncia->hechos_lugar) }}</td></tr>
            <tr><td class="k">Testigos</td><td>{{ $dash($denuncia->hechos_testigos) }}</td></tr>
            @if (!empty($p['frecuencia']))
                <tr><td class="k">Frecuencia</td><td>{{ $lookup(Denuncia::FRECUENCIAS, $p['frecuencia']) }}</td></tr>
            @endif
        </table>
    </div>

    {{-- Denunciado --}}
    <div class="section">
        <h2>Persona / área denunciada</h2>
        <table>
            <tr><td class="k">Nombre</td><td>{{ $dash($denuncia->denunciado_nombre) }}</td></tr>
            <tr><td class="k">Cargo</td><td>{{ $dash($denuncia->denunciado_cargo) }}</td></tr>
            @if (!empty($p['denunciado_area']))
                <tr><td class="k">Área</td><td>{{ $p['denunciado_area'] }}</td></tr>
            @endif
            <tr><td class="k">Sucursal</td><td>{{ $dash($denuncia->denunciado_sucursal) }}</td></tr>
        </table>
    </div>

    {{-- Monto / evidencia / antecedentes --}}
    @if (!empty($p['monto_estimado']) || !empty($p['tiene_evidencia']) || !empty($p['evidencia_descripcion']) || !empty($p['reportado_antes']) || !empty($p['otros_saben']))
    <div class="section">
        <h2>Antecedentes adicionales</h2>
        <table>
            @if (!empty($p['monto_estimado']))
                <tr><td class="k">Monto estimado</td><td>{{ $lookup(Denuncia::MONTOS, $p['monto_estimado']) }}</td></tr>
            @endif
            @if (!empty($p['tiene_evidencia']))
                <tr><td class="k">¿Tiene evidencia?</td><td>{{ $lookup(Denuncia::EVIDENCIA, $p['tiene_evidencia']) }}</td></tr>
            @endif
            @if (!empty($p['evidencia_descripcion']))
                <tr><td class="k">Descripción evidencia</td><td>{{ $p['evidencia_descripcion'] }}</td></tr>
            @endif
            @if (!empty($p['reportado_antes']))
                <tr><td class="k">¿Reportado antes?</td><td>{{ $lookup(Denuncia::REPORTADO_ANTES, $p['reportado_antes']) }}{{ !empty($p['reportado_a_quien']) ? ' — '.$p['reportado_a_quien'] : '' }}</td></tr>
            @endif
            @if (!empty($p['otros_saben']))
                <tr><td class="k">¿Otros saben?</td><td>{{ $lookup(Denuncia::OTROS_SABEN, $p['otros_saben']) }}</td></tr>
            @endif
        </table>
    </div>
    @endif

    {{-- Observaciones --}}
    @if (!empty($p['observaciones']))
    <div class="section">
        <h2>Observaciones</h2>
        <div class="box">{{ $p['observaciones'] }}</div>
    </div>
    @endif

    {{-- Adjuntos --}}
    <div class="section">
        <h2>Archivos adjuntos</h2>
        @if ($denuncia->adjuntos->isEmpty())
            <p class="muted">Sin archivos adjuntos.</p>
        @else
            <table>
                @foreach ($denuncia->adjuntos as $a)
                    <tr><td class="k">{{ $loop->iteration }}.</td><td>{{ $a->original_name }} <span class="muted">({{ $a->mime_type }}, {{ number_format(($a->size_bytes ?? 0) / 1024, 0) }} KB)</span></td></tr>
                @endforeach
            </table>
            <p class="muted" style="margin-top:4px">Los archivos van adjuntos en este mismo correo.</p>
        @endif
    </div>

    <div class="footnote">
        El denunciante declaró bajo el formulario que la información entregada es veraz.
        Documento generado automáticamente por el Canal de Compliance de Toyota Musalem — confidencial.
    </div>
</body>
</html>
