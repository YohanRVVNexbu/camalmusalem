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
        ];
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
