<?php

namespace App\Http\Middleware;

use App\Models\Branch;
use App\Models\SiteSection;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $request->user(),
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'flash' => [
                'success' => $request->session()->get('success'),
                'error' => $request->session()->get('error'),
            ],
            'branchesShared' => fn () => Branch::where('is_active', true)
                ->orderBy('display_order')
                ->get([
                    'id', 'name', 'address', 'city', 'maps_url',
                    'latitude', 'longitude',
                    'phone_sucursal', 'phone_repuestos', 'phones_servicio_tecnico',
                    'image_path',
                ]),
            'contactCtaBanner' => fn () => $this->contactCtaBanner(),
            'whatsappButton'   => fn () => $this->whatsappButton(),
            'maintenanceActive' => fn () => $this->maintenanceActive(),
            'horariosAtencion' => fn () => $this->horariosAtencion(),
        ];
    }

    /**
     * Horario de atención editable desde /admin/paginas/contacto. Se
     * comparte globalmente para que todas las vistas que muestran
     * "Horario de atención" (contacto, mantención, repuestos) lean del
     * mismo lugar y queden sincronizadas cuando el admin lo cambia.
     *
     * @return array<int, array{label: string, value: string}>
     */
    private function horariosAtencion(): array
    {
        $section = SiteSection::where('section', 'contacto_info')->first();
        $data = $section?->data ?? [];

        // Formato nuevo: array `horarios`
        if (isset($data['horarios']) && is_array($data['horarios'])) {
            return array_values(array_filter(
                array_map(fn ($h) => [
                    'label' => (string) ($h['label'] ?? ''),
                    'value' => (string) ($h['value'] ?? ''),
                ], $data['horarios']),
                fn ($h) => $h['label'] !== '' || $h['value'] !== '',
            ));
        }

        // Backwards compat: estructura vieja con dos campos fijos
        $legacy = [];
        if (! empty($data['horario_lv'])) {
            $legacy[] = ['label' => 'Lunes a Viernes', 'value' => $data['horario_lv']];
        }
        if (! empty($data['horario_sab'])) {
            $legacy[] = ['label' => 'Sábado / Domingo', 'value' => $data['horario_sab']];
        }
        return $legacy;
    }

    private function maintenanceActive(): bool
    {
        $section = SiteSection::where('section', 'maintenance_mode')->first();

        return $section ? (bool) $section->is_visible : false;
    }

    private function contactCtaBanner(): ?array
    {
        $section = SiteSection::where('section', 'contact_cta_banner')->first();
        if (! $section || ! $section->is_visible) {
            return null;
        }

        return $section->data ?? [];
    }

    private function whatsappButton(): ?array
    {
        $section = SiteSection::where('section', 'whatsapp_button')->first();
        if (! $section || ! $section->is_visible) {
            return null;
        }

        return $section->data ?? [];
    }

}
