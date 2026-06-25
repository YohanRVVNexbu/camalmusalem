@extends('emails.layout')

@section('subject', 'Cotización de vehículo')

@section('content')
    <h2>¡Hola, {{ $cotizacion->nombre }}!</h2>
    <p>Recibimos tu cotización del {{ $cotizacion->tipo === 'nuevo' ? 'vehículo nuevo' : 'seminuevo' }} que te interesa. Un asesor de Toyota Musalem se pondrá en contacto contigo a la brevedad.</p>

    <div class="summary">
        <div class="summary-row">
            <span class="summary-label">Vehículo</span>
            <span class="summary-value">{{ $cotizacion->vehicle_nombre }}</span>
        </div>
        @if ($cotizacion->color)
        <div class="summary-row">
            <span class="summary-label">Color de interés</span>
            <span class="summary-value">{{ $cotizacion->color }}</span>
        </div>
        @endif
        @if ($cotizacion->vehicle_precio)
        <div class="summary-row">
            <span class="summary-label">{{ $cotizacion->tipo === 'nuevo' ? 'Precio desde' : 'Precio referencial' }}</span>
            <span class="summary-value">{{ $cotizacion->vehicle_precio }}</span>
        </div>
        @endif
        <div class="summary-row">
            <span class="summary-label">Tipo</span>
            <span class="summary-value">{{ $cotizacion->tipo === 'nuevo' ? 'Vehículo nuevo' : 'Seminuevo' }}</span>
        </div>
    </div>

    @if ($cotizacion->comentarios)
        <h2>Tus comentarios</h2>
        <p style="white-space: pre-line;">{{ $cotizacion->comentarios }}</p>
    @endif

    <h2>Datos de contacto</h2>
    <div class="summary">
        <div class="summary-row">
            <span class="summary-label">Nombre</span>
            <span class="summary-value">{{ $cotizacion->nombre }}</span>
        </div>
        <div class="summary-row">
            <span class="summary-label">Email</span>
            <span class="summary-value">{{ $cotizacion->email }}</span>
        </div>
        <div class="summary-row">
            <span class="summary-label">Teléfono</span>
            <span class="summary-value">{{ $cotizacion->telefono }}</span>
        </div>
        @if ($cotizacion->rut)
        <div class="summary-row">
            <span class="summary-label">RUT</span>
            <span class="summary-value">{{ $cotizacion->rut }}</span>
        </div>
        @endif
    </div>
@endsection
