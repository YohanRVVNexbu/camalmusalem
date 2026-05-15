<?php

use App\Models\SiteSection;
use Illuminate\Database\Migrations\Migration;

/**
 * Normaliza los enlaces del footer:
 *  - legal_links: pasa de string[] a {label,href}[] para que cada item
 *    apunte a una URL administrable.
 *  - nav_links: actualiza los anchors (#vehiculos, etc.) a paths absolutos
 *    que funcionan desde cualquier página.
 */
return new class extends Migration {
    public function up(): void
    {
        $footer = SiteSection::where('section', 'footer')->first();
        if (! $footer) return;

        $data = $footer->data ?? [];

        $hrefFor = function (string $label): string {
            $l = mb_strtolower($label);
            return match (true) {
                str_contains($l, 'prevenci')                              => '/prevencion-delito',
                str_contains($l, 'aviso legal'), str_contains($l, 'compliance') => '#',
                str_contains($l, 'mapa del sitio')                        => '#',
                str_contains($l, 'bases legales')                         => '#',
                str_contains($l, 'ley 20.393'), str_contains($l, '20393')  => '#',
                default                                                   => '#',
            };
        };

        // legal_links: string[] → {label, href}[]
        $legal = $data['legal_links'] ?? [];
        $data['legal_links'] = collect($legal)->map(function ($item) use ($hrefFor) {
            if (is_array($item) && isset($item['label'])) {
                return $item; // ya migrado
            }
            $label = is_string($item) ? $item : (string) $item;
            return ['label' => $label, 'href' => $hrefFor($label)];
        })->values()->all();

        // nav_links: cambiar anchors a paths absolutos
        $navMap = [
            '#vehiculos'  => '/nuevos',
            '#seminuevos' => '/seminuevos',
            '#postventa'  => '/post-venta/agendar-mantencion',
            '#contacto'   => '/contacto',
        ];
        $data['nav_links'] = collect($data['nav_links'] ?? [])->map(function ($link) use ($navMap) {
            $href = $link['href'] ?? '';
            $link['href'] = $navMap[$href] ?? $href;
            return $link;
        })->values()->all();

        $footer->update(['data' => $data]);

        // También actualiza el default_data para que un reset traiga los nuevos
        // formatos en vez del antiguo.
        if ($footer->default_data) {
            $def = $footer->default_data;
            $def['legal_links'] = collect($def['legal_links'] ?? [])->map(function ($item) use ($hrefFor) {
                if (is_array($item) && isset($item['label'])) return $item;
                $label = is_string($item) ? $item : (string) $item;
                return ['label' => $label, 'href' => $hrefFor($label)];
            })->values()->all();
            $def['nav_links'] = collect($def['nav_links'] ?? [])->map(function ($link) use ($navMap) {
                $href = $link['href'] ?? '';
                $link['href'] = $navMap[$href] ?? $href;
                return $link;
            })->values()->all();
            $footer->update(['default_data' => $def]);
        }
    }

    public function down(): void
    {
        // No revert: el cambio es defensivo y compatible hacia atrás.
    }
};
