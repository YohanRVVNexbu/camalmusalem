<?php

namespace App\Mail;

use App\Models\KintoSolicitud;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class KintoSolicitudMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public KintoSolicitud $solicitud) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Solicitud de arriendo Kinto — Toyota Musalem',
        );
    }

    public function content(): Content
    {
        return new Content(view: 'emails.kinto-solicitud', with: ['solicitud' => $this->solicitud]);
    }
}
