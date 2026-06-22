<?php

namespace App\Http\Controllers;

use App\Models\VehicleVersion;
use App\Services\Salesforce\DealerExpApiClient;
use Illuminate\Http\JsonResponse;

/**
 * Devuelve los colores disponibles de una versión de vehículo nuevo,
 * consultando el API de Mulesoft (GET vehicle-versions/{optionCode}/colors).
 * Lo usa el formulario de cotización para mostrar un selector de color.
 *
 * Resiliente: si Salesforce está deshabilitado o falla, devuelve lista vacía
 * (el formulario simplemente no muestra el selector).
 */
class VehiculoColorController extends Controller
{
    public function index(VehicleVersion $version): JsonResponse
    {
        $raw = DealerExpApiClient::fromConfig()->getColors((string) $version->option_code);

        $colors = collect($raw)
            ->filter(fn ($c) => ($c['isActive'] ?? false) === true)
            ->map(fn ($c) => [
                'externalColor'     => trim((string) ($c['externalColor'] ?? '')),
                'externalCodeColor' => trim((string) ($c['extenalCodeColor'] ?? $c['externalCodeColor'] ?? '')),
                'internalColor'     => trim((string) ($c['internalColor'] ?? '')),
            ])
            ->filter(fn ($c) => $c['externalColor'] !== '')
            ->unique('externalColor')
            ->values()
            ->all();

        return response()->json(['colors' => $colors]);
    }
}
