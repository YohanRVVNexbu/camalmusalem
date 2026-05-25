<?php

namespace App\Console\Commands;

use App\Models\Branch;
use App\Models\CotizacionVehiculo;
use App\Models\VehicleVersion;
use Illuminate\Console\Command;

/**
 * Herramienta de diagnóstico rápido: muestra las últimas cotizaciones de
 * vehículos nuevos y su estado de sincronización con Salesforce.
 *
 * Útil cuando Globant pide:
 *  - La URL exacta a la que pegamos.
 *  - El correlationId de un intento específico.
 *  - El payload (request) y la respuesta del lado de Mulesoft.
 *
 * Uso:
 *   php artisan salesforce:inspect            (últimas 5 cotizaciones, resumen)
 *   php artisan salesforce:inspect --id=12    (detalle completo de la cotización #12)
 *   php artisan salesforce:inspect --last     (detalle completo de la última)
 *   php artisan salesforce:inspect --failed   (solo las fallidas)
 */
class SalesforceInspectCommand extends Command
{
    protected $signature = 'salesforce:inspect
        {--id= : Mostrar detalle completo de una cotización por ID local}
        {--last : Mostrar detalle completo de la última cotización de vehículo nuevo}
        {--failed : Filtrar solo las cotizaciones con sync_status=failed}
        {--limit=5 : Cantidad de filas a mostrar en el listado resumen}';

    protected $description = 'Inspecciona el estado de sincronización con Salesforce de las últimas cotizaciones (URL llamada, payload, respuesta, correlationId).';

    public function handle(): int
    {
        // Modo "detalle por ID"
        if ($id = $this->option('id')) {
            return $this->showDetail((int) $id);
        }

        // Modo "última cotización"
        if ($this->option('last')) {
            $last = CotizacionVehiculo::query()->where('tipo', 'nuevo')->latest('id')->first();
            if (! $last) {
                $this->warn('No hay cotizaciones de vehículos nuevos en la BD.');
                return self::SUCCESS;
            }
            return $this->showDetail((int) $last->id);
        }

        // Modo "listado resumen"
        $query = CotizacionVehiculo::query()
            ->with(['branch:id,name,salesforce_dealer_id', 'version:id,trim_name,option_code'])
            ->where('tipo', 'nuevo')
            ->orderByDesc('id')
            ->limit((int) $this->option('limit'));

        if ($this->option('failed')) {
            $query->where('sync_status', 'failed');
        }

        $rows = $query->get();
        if ($rows->isEmpty()) {
            $this->warn('No hay cotizaciones que coincidan con el filtro.');
            return self::SUCCESS;
        }

        $this->table(
            ['#', 'Creada', 'Cliente', 'Sucursal (dealer)', 'Opción', 'Status', 'Correlation ID'],
            $rows->map(function (CotizacionVehiculo $c) {
                $cid = $this->correlationId($c);
                return [
                    $c->id,
                    $c->created_at?->format('d-m H:i'),
                    str($c->nombre)->limit(18),
                    ($c->branch?->name ?? '—').' ('.($c->branch?->salesforce_dealer_id ?? '—').')',
                    $c->version?->option_code ?? '—',
                    $this->statusBadge($c->sync_status),
                    $cid ? str($cid)->limit(20) : '—',
                ];
            })->all()
        );

        $this->line('');
        $this->info('Para ver el detalle completo de una fila:  php artisan salesforce:inspect --id=<N>');
        $this->info('Para ver la última cotización:              php artisan salesforce:inspect --last');

        return self::SUCCESS;
    }

    private function showDetail(int $id): int
    {
        $cot = CotizacionVehiculo::with(['branch', 'version'])->find($id);
        if (! $cot) {
            $this->error("No existe la cotización #{$id}.");
            return self::FAILURE;
        }

        $branch = $cot->branch ?? Branch::find($cot->branch_id);
        $version = $cot->version ?? VehicleVersion::find($cot->version_id);
        $dealerId = $branch?->salesforce_dealer_id;

        $url = $dealerId
            ? rtrim(config('services.salesforce_dealer.api_base_url'), '/')."/{$dealerId}/quote"
            : '(no calculable: sucursal sin salesforce_dealer_id)';

        $payload = [
            'client' => [
                'fullName'      => $cot->nombre,
                'email'         => $cot->email,
                // RUT normalizado al formato que espera Salesforce
                // (sin puntos, con guión). Salesforce rechaza el formato
                // chileno con puntos "26.256.475-4" — solo acepta "26256475-4".
                'rut'           => $this->normalizeRut($cot->rut),
                'phone'         => $cot->telefono,
                'originAccount' => 'Web concesionario',
            ],
            'opportunity' => ['source' => 'Web concesionario'],
            'quote' => [
                'name'        => 'Cotización web — '.($cot->vehicle_nombre ?: 'Vehículo nuevo'),
                'paymentType' => 'Otros Creditos',
                'description' => 'Cotización web Toyota Musalem — Sucursal: '.($branch?->name ?? '—'),
            ],
            'products' => [[
                'version'      => $version?->option_code,
                'price'        => (int) ($version?->msrp_clp ?? 0),
                'typeMaterial' => 'vehicle',
            ]],
        ];

        $this->line('');
        $this->line('<bg=blue;fg=white>  Cotización #'.$cot->id.'  </>  '.$cot->created_at?->format('Y-m-d H:i:s'));
        $this->line('');

        $this->line('<comment>Cliente:</> '.$cot->nombre.' / '.$cot->email.' / RUT '.$cot->rut);
        $this->line('<comment>Sucursal:</> '.($branch?->name ?? '—').'  (dealer_id: '.($dealerId ?? '—').')');
        $this->line('<comment>Versión:</>  '.($version?->trim_name ?? '?').'  (option_code: '.($version?->option_code ?? '—').')');
        $this->line('');

        $this->line('<fg=cyan>METHOD:</>  PATCH');
        $this->line('<fg=cyan>URL:</>     '.$url);
        $this->line('<fg=cyan>HEADERS:</> Content-Type: application/json | client_id: '.substr(config('services.salesforce_dealer.client_id') ?? '', 0, 12).'... | Authorization: Bearer <token oauth>');
        $this->line('');

        $this->line('<fg=cyan>REQUEST BODY:</>');
        $this->line(json_encode($payload, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        $this->line('');

        $cid = $this->correlationId($cot);
        $this->line('<fg=cyan>RESPONSE:</>');
        $this->line('Status: '.$this->statusBadge($cot->sync_status));
        if ($cid) {
            $this->line('Correlation ID: <fg=yellow>'.$cid.'</>');
        }
        if ($cot->salesforce_opportunity_id) {
            $this->line('Opportunity ID Salesforce: <fg=green>'.$cot->salesforce_opportunity_id.'</>');
        }
        if ($cot->salesforce_quote_id) {
            $this->line('Quote ID Salesforce:       <fg=green>'.$cot->salesforce_quote_id.'</>');
        }
        if ($cot->sync_last_error) {
            $this->line('<fg=red>Error:</> '.$cot->sync_last_error);
        }
        $this->line('');
        $this->line('<fg=cyan>RESPONSE BODY (de Mulesoft):</>');
        $this->line(json_encode($cot->salesforce_response, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) ?: '(vacío)');
        $this->line('');

        return self::SUCCESS;
    }

    private function correlationId(CotizacionVehiculo $c): ?string
    {
        return data_get($c->salesforce_response, 'correlationId');
    }

    /**
     * Misma normalización que aplica CotizacionSyncService antes de mandar el
     * payload a Salesforce: saca puntos, mantiene guión.
     */
    private function normalizeRut(?string $rut): string
    {
        if (! $rut) {
            return '';
        }
        $clean = strtoupper(trim($rut));
        $clean = preg_replace('/[^0-9K\-]/', '', $clean);
        if (str_contains($clean, '-')) {
            return $clean;
        }
        if (strlen($clean) < 2) {
            return $clean;
        }
        return substr($clean, 0, -1).'-'.substr($clean, -1);
    }

    private function statusBadge(string $status): string
    {
        return match ($status) {
            'synced'  => '<bg=green;fg=black> SYNCED </>',
            'failed'  => '<bg=red;fg=white> FAILED </>',
            'pending' => '<bg=yellow;fg=black> PENDING </>',
            default   => $status,
        };
    }
}
