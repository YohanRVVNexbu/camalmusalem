<?php

namespace App\Mail;

use App\Models\Contacto;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ContactoMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Contacto $contacto) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Recibimos tu mensaje — Toyota Musalem',
        );
    }

    public function content(): Content
    {
        return new Content(view: 'emails.contacto', with: ['contacto' => $this->contacto]);
    }
}
