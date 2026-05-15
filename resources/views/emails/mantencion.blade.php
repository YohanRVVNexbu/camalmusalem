@extends('emails.layout')

@section('subject', 'Confirmación de agendamiento')

@section('content')
    <h2>¡Hola, {{ $mantencion->nombre }}!</h2>
    <p>Recibimos tu solicitud de agendamiento de servicio técnico. Un asesor de Musalem se pondrá en contacto contigo para confirmar tu cita.</p>

    <div class="summary">
        <div class="summary-row">
            <span class="summary-label">Servicio</span>
            <span class="summary-value">{{ $mantencion->servicio }}</span>
        </div>
        <div class="summary-row">
            <span class="summary-label">Taller</span>
            <span class="summary-value">{{ $mantencion->taller === 'la-serena' ? 'Musalem La Serena' : 'Musalem Ovalle' }}</span>
        </div>
        <div class="summary-row">
            <span class="summary-label">Fecha</span>
            <span class="summary-value">{{ \Carbon\Carbon::parse($mantencion->fecha)->translatedFormat('d \d\e F \d\e Y') }}, {{ $mantencion->hora }} hrs.</span>
        </div>
        <div class="summary-row">
            <span class="summary-label">Vehículo</span>
            <span class="summary-value">{{ $mantencion->modelo }} {{ $mantencion->anio }} — {{ $mantencion->patente }}</span>
        </div>
    </div>

    @if ($mantencion->comentario)
        <h2>Comentarios</h2>
        <p style="white-space: pre-line;">{{ $mantencion->comentario }}</p>
    @endif

    <h2>Datos de contacto</h2>
    <div class="summary">
        <div class="summary-row">
            <span class="summary-label">Nombre</span>
            <span class="summary-value">{{ $mantencion->nombre }}</span>
        </div>
        <div class="summary-row">
            <span class="summary-label">Email</span>
            <span class="summary-value">{{ $mantencion->correo }}</span>
        </div>
        <div class="summary-row">
            <span class="summary-label">Teléfono</span>
            <span class="summary-value">{{ $mantencion->telefono }}</span>
        </div>
        @if (! empty($mantencion->rut))
        <div class="summary-row">
            <span class="summary-label">RUT</span>
            <span class="summary-value">{{ $mantencion->rut }}</span>
        </div>
        @endif
    </div>
@endsection
