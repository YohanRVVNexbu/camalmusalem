@extends('emails.layout')

@section('subject', 'Recibimos tu mensaje — Toyota Musalem')

@section('content')
    <h1>Recibimos tu mensaje</h1>
    <p>
        Gracias por contactarnos. Tu solicitud fue recibida en el canal de
        compliance de Toyota Musalem y será tratada con la mayor
        confidencialidad por el Encargado de Prevención del Delito.
    </p>

    <div class="summary">
        <div class="summary-row">
            <span class="summary-label">Código de seguimiento</span>
            <span class="summary-value" style="font-family: monospace; letter-spacing: 1px;">
                {{ $tracking }}
            </span>
        </div>
        <div class="summary-row">
            <span class="summary-label">Marco legal</span>
            <span class="summary-value">{{ $tipoLabel }}</span>
        </div>
        <div class="summary-row">
            <span class="summary-label">Recibida</span>
            <span class="summary-value">{{ $denuncia->created_at->format('d-m-Y H:i') }}</span>
        </div>
    </div>

    <p>
        Guarda este código: lo necesitarás si quieres consultar el estado
        de tu solicitud más adelante. Por confidencialidad no incluimos
        aquí el contenido de tu mensaje.
    </p>

    <div class="divider"></div>
    <p style="font-size: 12px; color: rgba(0,0,0,0.6);">
        Si recibiste este correo por error, simplemente ignóralo.
    </p>
@endsection
