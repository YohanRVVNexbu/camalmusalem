<?php

namespace App\Mail;

use App\Models\Denuncia;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

/**
 * Correo que se envía al Encargado de Compliance / abogada cuando llega
 * una nueva denuncia.
 *
 * Por solicitud del cliente (jun 2026), este correo SÍ incluye el detalle
 * completo de la denuncia en un PDF adjunto, más los archivos que haya
 * subido el denunciante. El destino (config services.compliance.encargado_email,
 * ej. compliance@camalmusalem.cl) es un casillero de acceso exclusivo de la
 * abogada, por lo que el contenido sensible viaja a un buzón controlado.
 *
 * El cuerpo del correo se mantiene breve; todo el contenido va en el PDF.
 * El detalle también sigue disponible en /admin/compliance/denuncias/{id}.
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

    /**
     * Adjuntos: (1) PDF con todo el contenido de la denuncia y (2) los
     * archivos que el denunciante haya subido (disco privado 'local').
     *
     * @return array<int, Attachment>
     */
    public function attachments(): array
    {
        $pdf = Pdf::loadView('pdf.denuncia', ['denuncia' => $this->denuncia]);

        $attachments = [
            Attachment::fromData(fn () => $pdf->output(), "denuncia-{$this->denuncia->tracking_code}.pdf")
                ->withMime('application/pdf'),
        ];

        foreach ($this->denuncia->adjuntos as $adjunto) {
            $attachments[] = Attachment::fromStorageDisk('local', $adjunto->path)
                ->as($adjunto->original_name)
                ->withMime($adjunto->mime_type ?? 'application/octet-stream');
        }

        return $attachments;
    }
}
