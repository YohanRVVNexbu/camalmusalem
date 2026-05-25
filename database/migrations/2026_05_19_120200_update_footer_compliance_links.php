<?php

use App\Models\SiteSection;
use Illuminate\Database\Migrations\Migration;

/**
 * Actualiza los enlaces legales del footer al mover el canal de denuncias
 * bajo /compliance:
 *
 *  - 'Compliance' (href '#')                       → /compliance
 *  - 'Ley de Prevención del delito' (/prevencion-delito) → 'Denuncia Ley 20.393' → /compliance/denuncia-prevencion-delito
 *  - 'Ley 20.393' (href '#')                       → eliminado (duplicado)
 *  - Agrega 'Denuncia Ley Karin' → /compliance/denuncia-ley-karin si no existe
 *
 * Es idempotente: si los enlaces ya están actualizados, no hace nada.
 * Misma normalización se aplica a `default_data` para que un reset traiga
 * los enlaces nuevos.
 */
return new class extends Migration {
    public function up(): void
    {
        foreach (['data', 'default_data'] as $bucket) {
            $this->normalize($bucket);
        }
    }

    public function down(): void
    {
        // No revert: cambio defensivo, los enlaces viejos no aportan valor.
    }

    private function normalize(string $bucket): void
    {
        $footer = SiteSection::where('section', 'footer')->first();
        if (! $footer) {
            return;
        }

        $payload = $footer->{$bucket};
        if (! is_array($payload)) {
            return;
        }

        $links = $payload['legal_links'] ?? [];
        $links = collect($links)->map(function ($item) {
            $label = is_array($item) ? ($item['label'] ?? '') : (string) $item;
            $href  = is_array($item) ? ($item['href']  ?? '#') : '#';

            // 'Ley de Prevención del delito' o variantes → 'Denuncia Ley 20.393' bajo /compliance
            if (preg_match('/prevenci[óo]n.*del.*delito/i', $label)) {
                return ['label' => 'Denuncia Ley 20.393', 'href' => '/compliance/denuncia-prevencion-delito'];
            }
            // 'Compliance' con href placeholder → enlazar a la landing
            if (mb_strtolower($label) === 'compliance' && in_array($href, ['#', '', null], true)) {
                return ['label' => 'Compliance', 'href' => '/compliance'];
            }
            // Enlace huérfano 'Ley 20.393' con href placeholder → eliminar (el de prevención lo reemplaza)
            if (preg_match('/^ley\s*20\.?393\s*$/i', trim($label)) && in_array($href, ['#', '', null], true)) {
                return null;
            }
            return ['label' => $label, 'href' => $href];
        })->filter()->values()->all();

        // Asegurar que la denuncia Ley Karin esté presente.
        $hasKarin = collect($links)->contains(fn ($l) => str_contains(mb_strtolower($l['label'] ?? ''), 'karin'));
        if (! $hasKarin) {
            $links[] = ['label' => 'Denuncia Ley Karin', 'href' => '/compliance/denuncia-ley-karin'];
        }

        // Asegurar que Compliance landing exista.
        $hasCompliance = collect($links)->contains(fn ($l) => trim(mb_strtolower($l['label'] ?? '')) === 'compliance');
        if (! $hasCompliance) {
            $links[] = ['label' => 'Compliance', 'href' => '/compliance'];
        }

        $payload['legal_links'] = $links;
        $footer->update([$bucket => $payload]);
    }
};
