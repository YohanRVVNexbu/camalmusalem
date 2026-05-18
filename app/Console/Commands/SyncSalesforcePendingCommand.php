<?php

namespace App\Console\Commands;

use App\Models\CotizacionVehiculo;
use App\Services\Salesforce\CotizacionSyncService;
use Illuminate\Console\Command;
use Throwable;

/**
 * Recovery scheduler: encuentra cotizaciones que NO se sincronizaron a
 * Salesforce y las reintenta.
 *
 * Casos que captura:
 *  - `pending`: el envío inicial falló por error reintentable (timeout, 5xx,
 *    OAuth caído). El controller las dejó en este estado.
 *  - `failed` con menos de N intentos: error de negocio o validación que el
 *    operador puede resolver (ej: cargar el dealer_id que faltaba, corregir
 *    credenciales, etc.). Después de la corrección, este comando las retoma.
 *
 * Por defecto:
 *  - Ignora cotizaciones de más de 7 días (no spam-eamos Salesforce con leads
 *    viejos que ya no son relevantes).
 *  - Máximo 10 intentos por cotización (después se queda como failed
 *    permanente — el admin puede reintentarla manualmente si quiere).
 *
 * Programar en `routes/console.php`:
 *   Schedule::command('salesforce:sync-pending')->everyFifteenMinutes();
 */
class SyncSalesforcePendingCommand extends Command
{
    protected $signature = 'salesforce:sync-pending
        {--limit=50 : Máximo de cotizaciones a procesar por corrida}
        {--max-age-days=7 : Edad máxima de las cotizaciones a reintentar (días)}
        {--max-attempts=10 : Máximo de intentos antes de dejar de reintentar}';

    protected $description = 'Reintenta sincronizar cotizaciones de vehículos nuevos pendientes/fallidas con Salesforce.';

    public function handle(CotizacionSyncService $service): int
    {
        $limit       = (int) $this->option('limit');
        $maxAgeDays  = (int) $this->option('max-age-days');
        $maxAttempts = (int) $this->option('max-attempts');

        $cotizaciones = CotizacionVehiculo::query()
            ->where('tipo', 'nuevo')
            ->whereIn('sync_status', ['pending', 'failed'])
            ->where('sync_attempts', '<', $maxAttempts)
            ->where('created_at', '>=', now()->subDays($maxAgeDays))
            ->orderBy('created_at')
            ->limit($limit)
            ->get();

        if ($cotizaciones->isEmpty()) {
            $this->info('No hay cotizaciones pendientes de sincronizar.');
            return self::SUCCESS;
        }

        $this->info("Procesando {$cotizaciones->count()} cotizaciones…");
        $ok = 0;
        $fail = 0;

        foreach ($cotizaciones as $cot) {
            try {
                $success = $service->syncOne($cot);
                if ($success) {
                    $ok++;
                    $this->line("  ✓ #{$cot->id} sincronizada");
                } else {
                    $fail++;
                    $this->line("  ✗ #{$cot->id} marcada como failed: {$cot->fresh()->sync_last_error}");
                }
            } catch (Throwable $e) {
                $fail++;
                $this->line("  ⚠ #{$cot->id} error reintentable: {$e->getMessage()}");
            }
        }

        $this->newLine();
        $this->info("Resultado: {$ok} sincronizadas, {$fail} fallidas.");

        return self::SUCCESS;
    }
}
