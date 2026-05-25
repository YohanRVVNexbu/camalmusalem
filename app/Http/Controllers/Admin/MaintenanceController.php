<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteSection;
use App\Services\SiteSettingsService;
use Illuminate\Http\Request;
use Inertia\Inertia;

/**
 * Mantenedor del modo mantenimiento.
 *
 * Vive como mantenedor propio (no dentro de /admin/paginas) porque:
 *  - Es una operación de sistema, no de contenido — el admin lo activa
 *    cuando va a hacer un cambio que toma minutos/horas.
 *  - Cuando está activo, el admin layout muestra un banner persistente
 *    para que no quede olvidado: lo lógico es que se acceda y desactive
 *    desde el mismo lugar.
 *
 * El "interruptor" del modo es el flag `is_visible` de la SiteSection
 * `maintenance_mode` — misma convención del resto del proyecto.
 */
class MaintenanceController extends Controller
{
    public function __construct(private SiteSettingsService $settings) {}

    public function index()
    {
        $section = SiteSection::firstOrCreate(
            ['section' => 'maintenance_mode'],
            ['is_visible' => false, 'order' => 100, 'data' => $this->defaultData()],
        );

        return Inertia::render('admin/maintenance/index', [
            'maintenance' => [
                'is_active' => (bool) $section->is_visible,
                'data'      => array_merge($this->defaultData(), $section->data ?? []),
            ],
        ]);
    }

    public function update(Request $request)
    {
        $section = SiteSection::firstOrCreate(
            ['section' => 'maintenance_mode'],
            ['is_visible' => false, 'order' => 100, 'data' => $this->defaultData()],
        );

        $request->validate([
            'is_active'           => ['required', 'boolean'],
            'title'               => ['required', 'string', 'max:255'],
            'description'         => ['required', 'string', 'max:1000'],
            'eta'                 => ['nullable', 'string', 'max:255'],
            'contact_email'       => ['nullable', 'email', 'max:255'],
            'show_logo'           => ['required', 'boolean'],
            'image'               => ['nullable', 'image', 'max:5120'],
            'image_mobile'        => ['nullable', 'image', 'max:5120'],
        ]);

        $data = array_merge($section->data ?? [], [
            'title'         => $request->input('title'),
            'description'   => $request->input('description'),
            'eta'           => $request->input('eta') ?? '',
            'contact_email' => $request->input('contact_email') ?? '',
            'show_logo'     => $request->boolean('show_logo'),
        ]);

        if ($request->hasFile('image')) {
            $this->settings->deleteOldFile($data['image'] ?? null);
            $data['image'] = $this->settings->uploadFile($request->file('image'), 'paginas/maintenance');
        }
        if ($request->hasFile('image_mobile')) {
            $this->settings->deleteOldFile($data['image_mobile'] ?? null);
            $data['image_mobile'] = $this->settings->uploadFile($request->file('image_mobile'), 'paginas/maintenance');
        }

        $this->settings->updateSection('maintenance_mode', $data, $request->boolean('is_active'));

        $msg = $request->boolean('is_active')
            ? 'Modo mantenimiento ACTIVADO. El sitio público mostrará la pantalla de mantenimiento.'
            : 'Modo mantenimiento desactivado. El sitio está operando normalmente.';

        return back()->with('success', $msg);
    }

    private function defaultData(): array
    {
        return [
            'title'         => 'Estamos mejorando el sitio',
            'description'   => 'Volveremos en unos minutos. Gracias por tu paciencia.',
            'eta'           => '',
            'contact_email' => 'info@camalmusalem.cl',
            'image'         => '',
            'image_mobile'  => '',
            'show_logo'     => true,
        ];
    }
}
