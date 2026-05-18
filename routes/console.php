<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

/*
 * Recovery scheduler para la integración Salesforce:
 *
 * Las cotizaciones de vehículos nuevos se envían sincrónicamente a Salesforce
 * cuando el cliente postea el formulario. Si esa llamada falla (timeout, 5xx,
 * dealer_id faltante, credenciales corregidas después, etc.), el comando
 * `salesforce:sync-pending` corre cada 15 minutos y reintenta las que quedaron
 * en estado `pending` o `failed`.
 *
 * Para que esto funcione en producción debe haber un cron que dispare
 * `php artisan schedule:run` cada minuto:
 *   * * * * * cd /path/to/project && php artisan schedule:run >> /dev/null 2>&1
 */
Schedule::command('salesforce:sync-pending')
    ->everyFifteenMinutes()
    ->withoutOverlapping()
    ->runInBackground();
