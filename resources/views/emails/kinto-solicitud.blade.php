@extends('emails.layout')

@section('subject', 'Solicitud de arriendo Kinto')

@section('content')
    <h2>¡Hola, {{ $solicitud->nombre }}!</h2>
    <p>Recibimos tu solicitud de arriendo Kinto. Un asesor de Musalem se pondrá en contacto contigo para continuar la gestión.</p>

    <div class="summary">
        <div class="summary-row">
            <span class="summary-label">Sucursal</span>
            <span class="summary-value">{{ $solicitud->sucursal === 'la-serena' ? 'Musalem La Serena' : 'Musalem Ovalle' }}</span>
        </div>
        <div class="summary-row">
            <span class="summary-label">Fecha estimada</span>
            <span class="summary-value">{{ \Carbon\Carbon::parse($solicitud->fecha)->translatedFormat('d \d\e F \d\e Y') }}</span>
        </div>
        <div class="summary-row">
            <span class="summary-label">Duración</span>
            <span class="summary-value">{{ $solicitud->duracion }} {{ $solicitud->duracion_tipo === 'horas' ? ($solicitud->duracion === '1' ? 'hora' : 'horas') : ($solicitud->duracion === '1' ? 'día' : 'días') }}</span>
        </div>
        <div class="summary-row">
            <span class="summary-label">Vehículo</span>
            <span class="summary-value">{{ $solicitud->vehiculo === 'corolla-cross' ? 'Corolla Cross' : 'Rav4' }}</span>
        </div>
    </div>

    <h2>Datos de contacto</h2>
    <div class="summary">
        <div class="summary-row">
            <span class="summary-label">Nombre</span>
            <span class="summary-value">{{ $solicitud->nombre }}</span>
        </div>
        <div class="summary-row">
            <span class="summary-label">Email</span>
            <span class="summary-value">{{ $solicitud->correo }}</span>
        </div>
        <div class="summary-row">
            <span class="summary-label">Teléfono</span>
            <span class="summary-value">{{ $solicitud->telefono }}</span>
        </div>
        @if (! empty($solicitud->rut))
        <div class="summary-row">
            <span class="summary-label">RUT</span>
            <span class="summary-value">{{ $solicitud->rut }}</span>
        </div>
        @endif
    </div>
@endsection
