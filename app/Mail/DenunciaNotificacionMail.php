<?php

namespace App\Mail;

use App\Models\Denuncia;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

/**
 * Correo que se envía al Encargado de Prevención del Delito cuando llega
 * una nueva denuncia.
 *
 * Decisión deliberada: este correo NO incluye el contenido de la
 * denuncia (descripción, denunciado, RUT, etc.). Solo notifica que hay
 * una nueva denuncia y enlaza al admin para verla.
 *
 * Razones:
 *  - El contenido puede ser sensible (datos de identidad del denunciante,
 *    nombres de implicados, hechos delicados).
 *  - Si el correo se reenvía por error, se intercepta, queda cacheado en
 *    un servidor SMTP intermedio, o el casillero del encargado se ve
 *    comprometido, no se expone la denuncia completa.
 *  - El asunto es neutro a propósito ("Nueva denuncia recibida —
 *    Compliance"), sin mencionar el tipo de ley ni nombres.
 *
 * El detalle vive en `/admin/compliance/denuncias/{id}` bajo auth.
 */
class DenunciaNotificacionMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Denuncia $denuncia) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Nueva denuncia recibida — Canal de Compliance',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.denuncia-notificacion',
            with: [
                'denuncia'   => $this->denuncia,
                'adminUrl'   => url("/admin/compliance/denuncias/{$this->denuncia->id}"),
                'tipoLabel'  => $this->denuncia->tipoLabel(),
                'modalidad'  => $this->denuncia->modalidad,
                'tracking'   => $this->denuncia->tracking_code,
            ],
        );
    }
}
