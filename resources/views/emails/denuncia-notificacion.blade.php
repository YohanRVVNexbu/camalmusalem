@extends('emails.layout')

@section('subject', 'Nueva denuncia recibida — Canal de Compliance')

@section('content')
    <h1>Nueva denuncia recibida</h1>
    <p>
        Se ha recibido una nueva denuncia en el canal de compliance.
        Adjuntamos el <strong>detalle completo en PDF</strong> y los archivos
        que haya entregado el denunciante. También puedes revisarla en el panel
        administrativo. Trátala con la máxima confidencialidad.
    </p>

    <div class="summary">
        <div class="summary-row">
            <span class="summary-label">Marco legal</span>
            <span class="summary-value">{{ $tipoLabel }}</span>
        </div>
        <div class="summary-row">
            <span class="summary-label">Modalidad</span>
            <span class="summary-value">
                @switch($modalidad)
                    @case('identificada') Identificada @break
                    @case('reserva') Con reserva de identidad @break
                    @case('anonima') Anónima @break
                    @default {{ $modalidad }}
                @endswitch
            </span>
        </div>
        <div class="summary-row">
            <span class="summary-label">Código de seguimiento</span>
            <span class="summary-value" style="font-family: monospace;">{{ $tracking }}</span>
        </div>
        <div class="summary-row">
            <span class="summary-label">Recibida</span>
            <span class="summary-value">{{ $denuncia->created_at->format('d-m-Y H:i') }}</span>
        </div>
    </div>

    <p style="text-align: center; margin-top: 24px;">
        <a class="button" href="{{ $adminUrl }}">Ver denuncia en el panel</a>
    </p>

    <div class="divider"></div>
    <p style="font-size: 12px; color: rgba(0,0,0,0.6);">
        Este correo es una notificación automática. La denuncia debe ser
        tratada con confidencialidad bajo el protocolo de compliance de
        Toyota Musalem.
    </p>
@endsection
