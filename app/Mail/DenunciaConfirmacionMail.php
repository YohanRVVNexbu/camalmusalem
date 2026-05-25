<?php

namespace App\Mail;

use App\Models\Denuncia;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

/**
 * Confirmación que se envía al denunciante (solo si proporcionó email)
 * con el tracking code para que consulte el estado de su denuncia.
 *
 * No se envía nada si la denuncia es anónima (no hay email destinatario).
 *
 * El asunto es neutro a propósito — si el correo aterriza en una bandeja
 * compartida o se previsualiza en un dispositivo ajeno, no revela que la
 * persona presentó una denuncia. El contenido sí menciona Toyota Musalem
 * y el código de seguimiento porque el denunciante necesita esa info,
 * pero NO repite el contenido de la denuncia (no se necesita reflejarla
 * de vuelta).
 */
class DenunciaConfirmacionMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Denuncia $denuncia) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Recibimos tu mensaje — Toyota Musalem',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.denuncia-confirmacion',
            with: [
                'denuncia'  => $this->denuncia,
                'tipoLabel' => $this->denuncia->tipoLabel(),
                'tracking'  => $this->denuncia->tracking_code,
            ],
        );
    }
}
