@extends('emails.layout')

@section('subject', 'Solicitud de encargo de repuestos')

@section('content')
    <h2>¡Hola, {{ $solicitud->nombre }}!</h2>
    <p>Recibimos tu solicitud de encargo de repuestos. Un asesor de Toyota Musalem se pondrá en contacto contigo dentro de las próximas 48 horas.</p>

    <div class="summary">
        <div class="summary-row">
            <span class="summary-label">Sucursal</span>
            <span class="summary-value">{{ $solicitud->sucursal }}</span>
        </div>
        @if ($solicitud->modelo)
        <div class="summary-row">
            <span class="summary-label">Modelo</span>
            <span class="summary-value">{{ $solicitud->modelo }}</span>
        </div>
        @endif
        @if ($solicitud->marca)
        <div class="summary-row">
            <span class="summary-label">Marca</span>
            <span class="summary-value">{{ $solicitud->marca }}</span>
        </div>
        @endif
        @if ($solicitud->vin)
        <div class="summary-row">
            <span class="summary-label">VIN / Chasis</span>
            <span class="summary-value">{{ $solicitud->vin }}</span>
        </div>
        @endif
    </div>

    <h2>Repuestos solicitados</h2>
    <p style="white-space: pre-line;">{{ $solicitud->lista_repuestos }}</p>

    <div class="divider"></div>
    <p>Datos de contacto registrados: {{ $solicitud->email }} · {{ $solicitud->telefono }}</p>
@endsection
