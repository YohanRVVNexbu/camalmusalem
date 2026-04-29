<?php

namespace App\Mail;

use App\Models\SolicitudEncargoRepuesto;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class SolicitudEncargoRepuestoMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public SolicitudEncargoRepuesto $solicitud) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Solicitud de encargo de repuestos — Toyota Musalem',
        );
    }

    public function content(): Content
    {
        return new Content(view: 'emails.solicitud-encargo-repuesto', with: ['solicitud' => $this->solicitud]);
    }
}
