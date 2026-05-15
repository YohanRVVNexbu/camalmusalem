@extends('emails.layout')

@section('subject', 'Recibimos tu denuncia — Ley de Prevención del Delito')

@section('content')
    <h2>¡Hola, {{ $denuncia->nombre }}!</h2>
    <p>
        Recibimos tu denuncia/consulta en el marco de la Ley 20.393 sobre
        Prevención del Delito. El Encargado de Prevención de Delitos de Toyota
        Musalem revisará tu mensaje a la brevedad y, en caso de requerirse,
        se pondrá en contacto contigo.
    </p>

    <div class="summary">
        <div class="summary-row">
            <span class="summary-label">Asunto</span>
            <span class="summary-value">{{ $denuncia->asunto }}</span>
        </div>
        <div class="summary-row">
            <span class="summary-label">Email</span>
            <span class="summary-value">{{ $denuncia->email }}</span>
        </div>
        @if ($denuncia->telefono)
        <div class="summary-row">
            <span class="summary-label">Teléfono</span>
            <span class="summary-value">{{ $denuncia->telefono }}</span>
        </div>
        @endif
        @if ($denuncia->rut)
        <div class="summary-row">
            <span class="summary-label">RUT</span>
            <span class="summary-value">{{ $denuncia->rut }}</span>
        </div>
        @endif
    </div>

    <h2>Tu mensaje</h2>
    <p style="white-space: pre-line;">{{ $denuncia->mensaje }}</p>

    <div class="divider"></div>
    <p>Tu denuncia será tratada con la mayor confidencialidad.</p>
@endsection
