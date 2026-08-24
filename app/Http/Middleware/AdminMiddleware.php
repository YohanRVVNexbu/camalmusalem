<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        if (! $request->user() || ! $request->user()->is_admin) {
            return redirect()->route('admin.login');
        }

        $response = $next($request);

        // El admin es 100% dinámico/autenticado — nunca debe cachearse. Un
        // GET de prueba contra /admin/upload-image quedó cacheado por
        // LiteSpeed (LSCache) en el origen y se sirvió después ante POSTs
        // reales, dando 405 "GET not supported" pese a que el navegador
        // mandaba POST. X-LiteSpeed-Cache-Control es el header que LSCache
        // respeta por encima de cualquier regla de caché configurada en el
        // panel del hosting.
        $response->headers->set('X-LiteSpeed-Cache-Control', 'no-cache');
        $response->headers->set('Cache-Control', 'no-store, no-cache, must-revalidate, private');

        return $response;
    }
}
