<?php

use App\Http\Middleware\AdminMiddleware;
use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\MaintenanceMode;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Illuminate\Support\Facades\Route;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
        then: function () {
            Route::middleware('web')
                ->prefix('admin')
                ->group(base_path('routes/admin.php'));
        },
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->encryptCookies(except: ['appearance', 'sidebar_state']);

        $middleware->web(append: [
            HandleAppearance::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
            MaintenanceMode::class,
        ]);

        $middleware->alias([
            'admin' => AdminMiddleware::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        // El admin es 100% dinámico/autenticado — nunca debe cachearse. Un
        // GET de prueba contra /admin/upload-image quedó cacheado por
        // LiteSpeed (LSCache) en el origen y se sirvió después ante POSTs
        // reales, dando 405 "GET not supported" pese a que el navegador
        // mandaba POST. Esto corre para CUALQUIER excepción (incluida la de
        // ruteo, que ocurre antes de que exista una ruta/middleware de grupo
        // — por eso no alcanza con ponerlo solo en AdminMiddleware).
        // X-LiteSpeed-Cache-Control es el header que LSCache respeta por
        // encima de cualquier regla de caché configurada en el panel.
        $exceptions->respond(function ($response, \Throwable $e, $request) {
            if ($request->is('admin') || $request->is('admin/*')) {
                $response->headers->set('X-LiteSpeed-Cache-Control', 'no-cache');
                $response->headers->set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
            }

            return $response;
        });
    })->create();
