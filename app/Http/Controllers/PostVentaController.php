<?php

namespace App\Http\Controllers;

use App\Models\Accesorio;
use App\Models\Repuesto;
use App\Models\SiteSection;
use Inertia\Inertia;


class PostVentaController extends Controller
{
    private function section(string $key): ?array
    {
        $section = SiteSection::where('section', $key)->first();
        if (! $section || ! $section->is_visible) {
            return null;
        }

        return $section->data ?? [];
    }

    public function agendarMantencion()
    {
        $branches = \App\Models\Branch::where('is_active', true)
            ->orderBy('display_order')
            ->get(['id', 'name', 'city', 'address', 'latitude', 'longitude'])
            ->map(fn ($b) => [
                'id' => $b->id, 'name' => $b->name, 'city' => $b->city,
                'address' => $b->address, 'latitude' => $b->latitude, 'longitude' => $b->longitude,
            ])
            ->all();

        $services = \App\Models\Service::where('is_active', true)
            ->orderBy('display_order')->orderBy('name')
            ->get(['id', 'name', 'slug'])
            ->all();

        $vehicleModels = \App\Models\MantencionVehicleModel::where('is_active', true)
            ->orderBy('display_order')->orderBy('name')
            ->get(['id', 'name'])
            ->all();

        return Inertia::render('post-venta/agendar-mantencion', [
            'footer'          => $this->section('footer'),
            'mantencion_hero' => $this->section('mantencion_hero'),
            'branches'        => $branches,
            'services'        => $services,
            'vehicle_models'  => $vehicleModels,
        ]);
    }

    public function accesorios()
    {
        return Inertia::render('post-venta/accesorios', [
            'footer'          => $this->section('footer'),
            'accesorios_hero' => $this->section('accesorios_hero'),
            'accesorios'      => Accesorio::where('is_visible', true)->orderBy('order')->orderBy('name')->get(),
        ]);
    }

    public function repuestos()
    {
        return Inertia::render('post-venta/repuestos', [
            'footer'         => $this->section('footer'),
            'repuestos_hero' => $this->section('repuestos_hero'),
            'repuestos'      => Repuesto::where('is_visible', true)->orderBy('order')->orderBy('name')->get(),
        ]);
    }

    public function accesorioShow(string $id)
    {
        return Inertia::render('post-venta/accesorio-show', [
            'accesorio' => Accesorio::where('is_visible', true)->findOrFail($id),
            'footer'    => $this->section('footer'),
        ]);
    }

    public function accesorioCotizar(string $id)
    {
        return Inertia::render('post-venta/accesorio-cotizar', [
            'accesorio' => Accesorio::where('is_visible', true)->findOrFail($id),
            'footer'    => $this->section('footer'),
        ]);
    }

    public function repuestoShow(string $id)
    {
        return Inertia::render('post-venta/repuesto-show', [
            'repuesto' => Repuesto::where('is_visible', true)->findOrFail($id),
            'footer'   => $this->section('footer'),
        ]);
    }

    public function repuestoCotizar(string $id)
    {
        return Inertia::render('post-venta/repuesto-cotizar', [
            'repuesto' => Repuesto::where('is_visible', true)->findOrFail($id),
            'footer'   => $this->section('footer'),
        ]);
    }
}
