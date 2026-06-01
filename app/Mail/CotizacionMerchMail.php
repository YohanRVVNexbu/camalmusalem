<?php

namespace App\Mail;

use App\Models\CotizacionMerch;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class CotizacionMerchMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public CotizacionMerch $cotizacion) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Cotización de merch — Toyota Musalem',
        );
    }

    public function content(): Content
    {
        return new Content(view: 'emails.cotizacion-merch', with: ['cotizacion' => $this->cotizacion]);
    }
}
