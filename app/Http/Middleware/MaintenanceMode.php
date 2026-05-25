<?php

namespace App\Http\Middleware;

use App\Models\SiteSection;
use Closure;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

/**
 * Modo mantenimiento administrable. Cuando la sección `maintenance_mode`
 * tiene `is_visible=true`, los visitantes públicos ven la vista de
 * mantenimiento. Los admins logeados (y las rutas administrativas) NO se
 * ven afectadas — pueden seguir operando el sitio normalmente para
 * volver a habilitarlo.
 *
 * Bypass de:
 *  - Cualquier request bajo `/admin/*` (incluye login). El admin debe
 *    poder volver a entrar aunque el sitio público esté caído.
 *  - El health-check `/up` que define bootstrap/app.php.
 *  - Cualquier usuario autenticado con `is_admin=true`.
 *
 * Cuando dispara, responde con HTTP 503 + cabecera Retry-After (en
 * segundos) para que crawlers/CDNs entiendan que es un downtime
 * intencional y temporal, no un error definitivo.
 */
class MaintenanceMode
{
    public function handle(Request $request, Closure $next): Response
    {
        if ($this->shouldBypass($request)) {
            return $next($request);
        }

        $section = SiteSection::where('section', 'maintenance_mode')->first();
        if (! $section || ! $section->is_visible) {
            return $next($request);
        }

        $data = $section->data ?? [];

        return Inertia::render('maintenance', [
            'maintenance' => [
                'title'         => $data['title']         ?? 'Estamos mejorando el sitio',
                'description'   => $data['description']   ?? 'Volveremos en unos minutos.',
                'eta'           => $data['eta']           ?? '',
                'contact_email' => $data['contact_email'] ?? '',
                'image'         => $data['image']         ?? '',
                'image_mobile'  => $data['image_mobile']  ?? '',
                'show_logo'     => (bool) ($data['show_logo'] ?? true),
            ],
        ])
            ->toResponse($request)
            ->setStatusCode(503)
            ->withHeaders([
                'Retry-After' => 1800, // 30 min — orientativo para bots
            ]);
    }

    private function shouldBypass(Request $request): bool
    {
        if ($request->is('admin') || $request->is('admin/*')) {
            return true;
        }
        if ($request->is('up')) {
            return true;
        }
        $user = $request->user();
        if ($user && ($user->is_admin ?? false)) {
            return true;
        }

        return false;
    }
}
