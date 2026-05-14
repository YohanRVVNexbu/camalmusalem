@extends('emails.layout')

@section('subject', 'Recibimos tu mensaje')

@section('content')
    <h2>¡Hola, {{ $contacto->nombre }}!</h2>
    <p>Recibimos tu mensaje y un asesor de Toyota Musalem se pondrá en contacto contigo a la brevedad.</p>

    <div class="summary">
        <div class="summary-row">
            <span class="summary-label">Asunto</span>
            <span class="summary-value">{{ $contacto->asunto }}</span>
        </div>
        <div class="summary-row">
            <span class="summary-label">Email</span>
            <span class="summary-value">{{ $contacto->email }}</span>
        </div>
        @if ($contacto->telefono)
        <div class="summary-row">
            <span class="summary-label">Teléfono</span>
            <span class="summary-value">{{ $contacto->telefono }}</span>
        </div>
        @endif
        @if ($contacto->rut)
        <div class="summary-row">
            <span class="summary-label">RUT</span>
            <span class="summary-value">{{ $contacto->rut }}</span>
        </div>
        @endif
    </div>

    <h2>Tu mensaje</h2>
    <p style="white-space: pre-line;">{{ $contacto->mensaje }}</p>

    <div class="divider"></div>
    <p>Gracias por escribirnos.</p>
@endsection
