<?php

namespace App\Services\Salesforce;

use App\Models\Branch;
use App\Models\CotizacionVehiculo;
use App\Models\VehicleVersion;
use Illuminate\Support\Facades\Log;
use Throwable;

/**
 * Sincroniza una cotización local hacia Salesforce vía Mulesoft.
 *
 * Se invoca desde dos lugares:
 *  1. CotizacionVehiculoController::store (sync inmediato cuando el cliente
 *     envía el formulario público).
 *  2. salesforce:sync-pending (comando scheduled que reintenta cotizaciones
 *     que quedaron en `pending` o `failed`).
 *
 * El método `syncOne()` actualiza el estado de la cotización siempre — no
 * importa si la API responde bien o mal. Los callers controlan si quieren
 * dejar que las excepciones suban o capturarlas.
 */
class CotizacionSyncService
{
    public function __construct(private readonly DealerExpApiClient $client) {}

    /**
     * Intenta sincronizar la cotización con Salesforce. Devuelve `true` en
     * caso de éxito y `false` cuando se marca como `failed` (no se sincroniza
     * por dato faltante, error de validación o respuesta de error). Tira
     * excepción solo en errores reintentables (5xx, timeouts) para que el
     * scheduler los identifique y vuelva a intentar más tarde.
     */
    public function syncOne(CotizacionVehiculo $cot): bool
    {
        // Solo cotizaciones de vehículos NUEVOS van a Salesforce.
        if ($cot->tipo !== 'nuevo') {
            return false;
        }

        if (! $this->client->isEnabled()) {
            $this->markFailed($cot, 'Integración Salesforce deshabilitada en .env');
            return false;
        }

        $branch = $cot->branch_id ? Branch::find($cot->branch_id) : null;
        if (! $branch || ! $branch->salesforce_dealer_id) {
            $this->markFailed($cot, 'Sucursal sin salesforce_dealer_id configurado.');
            return false;
        }

        if (! $this->client->hasCredentialsFor($branch->salesforce_dealer_id)) {
            $this->markFailed($cot, "No hay credenciales Salesforce configuradas para el dealer {$branch->salesforce_dealer_id} ({$branch->name}).");
            return false;
        }

        $version = $cot->version_id ? VehicleVersion::find($cot->version_id) : null;
        if (! $version || ! $version->option_code) {
            $this->markFailed($cot, 'Versión sin option_code (campo requerido por Salesforce).');
            return false;
        }

        $payload = $this->buildPayload($cot, $version, $branch);

        try {
            $response = $this->client->createQuote($branch->salesforce_dealer_id, $payload);
            $this->markSynced($cot, $response);
            return true;
        } catch (DealerExpApiException $e) {
            $cot->increment('sync_attempts');
            // Guardamos el body completo de la respuesta de error (cuando viene),
            // así el admin puede ver el detalle exacto en lugar de solo el mensaje.
            $cot->update([
                'sync_last_error' => substr($e->getMessage(), 0, 1000),
                'salesforce_response' => $e->responseBody ?: ['_error_status' => $e->httpStatus],
            ]);

            if (! $e->retryable) {
                $this->markFailed($cot, $e->getMessage());
                return false;
            }

            // Error reintentable (5xx, timeout, OAuth caído). Marcamos como
            // pending para que el scheduler lo retome y dejamos que la
            // excepción suba — el caller decide qué hacer con ella (logear,
            // ignorar, etc.).
            $cot->update(['sync_status' => 'pending']);
            throw $e;
        } catch (Throwable $e) {
            $cot->increment('sync_attempts');
            $cot->update([
                'sync_status'     => 'pending',
                'sync_last_error' => substr($e->getMessage(), 0, 1000),
            ]);
            Log::error('Salesforce sync: error inesperado', [
                'cotizacion_id' => $cot->id,
                'error'         => $e->getMessage(),
            ]);
            throw $e;
        }
    }

    /**
     * Construye el payload JSON exacto que espera el endpoint
     * `PATCH /dealers/{dealerId}/quote` de Mulesoft.
     *
     * El nombre de la sucursal se incrusta en `quote.description` además del
     * dealer ID que va en la URL. Esto sirve como respaldo: si Toyota asigna
     * un solo dealer ID para múltiples sucursales físicas, el asesor que abra
     * la oportunidad en Salesforce igual ve qué sucursal eligió el cliente.
     */
    private function buildPayload(CotizacionVehiculo $cot, VehicleVersion $version, Branch $branch): array
    {
        $descripcionPartes = [
            "Cotización web Toyota Musalem — Sucursal: {$branch->name}",
        ];
        if ($cot->comentarios) {
            $descripcionPartes[] = "Comentarios cliente: {$cot->comentarios}";
        }

        return [
            'client' => [
                'fullName'      => $cot->nombre,
                'email'         => $cot->email,
                // Salesforce espera el RUT SIN puntos y CON guión:
                //   "26.256.475-4"  →  "26256475-4"
                // Lo guardamos formateado en BD para mostrarlo lindo al
                // admin, pero al API lo mandamos limpio.
                'rut'           => $this->normalizeRutForSalesforce($cot->rut),
                'phone'         => $cot->telefono,
                'originAccount' => 'Web concesionario',
            ],
            'opportunity' => [
                'source' => 'Web concesionario',
            ],
            'quote' => [
                'name'        => 'Cotización web — '.($cot->vehicle_nombre ?: 'Vehículo nuevo'),
                'paymentType' => 'Otros Creditos',
                'description' => implode(' | ', $descripcionPartes),
            ],
            'products' => [
                [
                    // Salesforce espera el código alfanumérico (col E "Opción"
                    // del Excel — "Número antiguo de material" en SAP), tipo
                    // `BZ4XLTD42-25PC`. NO el ID numérico SAP (`70002066`),
                    // ese se usa solo internamente como key de import.
                    'version'      => $version->option_code,
                    'price'        => (int) ($version->msrp_clp ?? 0),
                    'typeMaterial' => 'vehicle',
                ],
            ],
        ];
    }

    /**
     * Normaliza el RUT para Salesforce: saca puntos y conserva el guión y
     * el dígito verificador (que puede ser número o letra "K").
     *
     * Entradas y salidas:
     *   "26.256.475-4"  →  "26256475-4"
     *   "12345678-K"    →  "12345678-K"
     *   "12.345.678-k"  →  "12345678-K"   (mayúscula del DV)
     *   "  26.256.475-4  "  →  "26256475-4" (trim)
     */
    private function normalizeRutForSalesforce(?string $rut): string
    {
        if (! $rut) {
            return '';
        }
        $clean = strtoupper(trim($rut));
        // Saca todo excepto dígitos, guión y la letra K (dígito verificador).
        $clean = preg_replace('/[^0-9K\-]/', '', $clean);
        // Si tiene guión, conserva el formato cuerpo-DV. Si no tiene, lo arma.
        if (str_contains($clean, '-')) {
            return $clean;
        }
        if (strlen($clean) < 2) {
            return $clean;
        }
        return substr($clean, 0, -1).'-'.substr($clean, -1);
    }

    private function markSynced(CotizacionVehiculo $cot, array $response): void
    {
        $opportunityId = data_get($response, 'data.opportunity.id')
            ?? data_get($response, 'opportunityId')
            ?? null;

        $quoteId = data_get($response, 'data.quote.id')
            ?? data_get($response, 'quoteId')
            ?? null;

        $cot->update([
            'sync_status'                => 'synced',
            'synced_at'                  => now(),
            'salesforce_opportunity_id'  => $opportunityId,
            'salesforce_quote_id'        => $quoteId,
            'salesforce_response'        => $response,
            'sync_last_error'            => null,
        ]);
    }

    private function markFailed(CotizacionVehiculo $cot, string $reason): void
    {
        // El detalle técnico va al log del servidor; en el panel solo se muestra
        // un mensaje genérico ("Hubo un error al enviar el formulario").
        Log::warning('Salesforce sync falló', [
            'cotizacion_id' => $cot->id,
            'branch_id'     => $cot->branch_id,
            'version_id'    => $cot->version_id,
            'reason'        => $reason,
        ]);

        $cot->update([
            'sync_status'     => 'failed',
            'sync_last_error' => substr($reason, 0, 1000),
        ]);
    }
}
