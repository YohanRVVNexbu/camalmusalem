<?php

namespace App\Mail;

use App\Models\MantencionAgendamiento;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class MantencionMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public MantencionAgendamiento $mantencion) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Confirmación de agendamiento — Toyota Musalem',
        );
    }

    public function content(): Content
    {
        return new Content(view: 'emails.mantencion', with: ['mantencion' => $this->mantencion]);
    }
}
