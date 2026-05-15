<?php

namespace App\Mail;

use App\Models\PrevencionDelito;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class PrevencionDelitoMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public PrevencionDelito $denuncia) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Recibimos tu denuncia — Toyota Musalem (Ley de Prevención del Delito)',
        );
    }

    public function content(): Content
    {
        return new Content(view: 'emails.prevencion-delito', with: ['denuncia' => $this->denuncia]);
    }
}
