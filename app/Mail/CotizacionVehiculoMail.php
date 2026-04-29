<?php

namespace App\Mail;

use App\Models\CotizacionVehiculo;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class CotizacionVehiculoMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public CotizacionVehiculo $cotizacion) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Cotización de vehículo — Toyota Musalem',
        );
    }

    public function content(): Content
    {
        return new Content(view: 'emails.cotizacion-vehiculo', with: ['cotizacion' => $this->cotizacion]);
    }
}
