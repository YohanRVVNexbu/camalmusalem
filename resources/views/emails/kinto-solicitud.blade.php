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

    <div class="divider"></div>
    <p>Datos de contacto registrados: {{ $solicitud->correo }} · {{ $solicitud->telefono }}</p>
@endsection
