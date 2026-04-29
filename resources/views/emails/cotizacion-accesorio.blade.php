@extends('emails.layout')

@section('subject', 'Cotización de accesorio')

@section('content')
    <h2>¡Hola, {{ $cotizacion->nombre }}!</h2>
    <p>Recibimos tu cotización del accesorio que te interesa. Un asesor de Toyota Musalem se pondrá en contacto contigo a la brevedad.</p>

    <div class="summary">
        <div class="summary-row">
            <span class="summary-label">Producto</span>
            <span class="summary-value">{{ $cotizacion->accesorio_nombre }}</span>
        </div>
        @if ($cotizacion->accesorio_precio)
        <div class="summary-row">
            <span class="summary-label">Precio referencial</span>
            <span class="summary-value">{{ $cotizacion->accesorio_precio }}</span>
        </div>
        @endif
        <div class="summary-row">
            <span class="summary-label">Sucursal</span>
            <span class="summary-value">{{ $cotizacion->sucursal }}</span>
        </div>
    </div>

    @if ($cotizacion->comentarios)
        <h2>Tus comentarios</h2>
        <p style="white-space: pre-line;">{{ $cotizacion->comentarios }}</p>
    @endif

    <div class="divider"></div>
    <p>Datos de contacto registrados: {{ $cotizacion->email }} · {{ $cotizacion->telefono }}</p>
@endsection
