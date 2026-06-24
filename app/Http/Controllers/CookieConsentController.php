<?php

namespace App\Http\Controllers;

use App\Models\CookieConsent;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;

/**
 * Registra (audita) el consentimiento de cookies del visitante.
 *
 * El banner del frontend hace POST aquí cada vez que el usuario acepta/rechaza.
 * Guardamos una fila como respaldo legal. La IP se anonimiza con hash (nunca se
 * almacena en claro). Es resiliente: si algo falla, responde 200 igual para no
 * romper la experiencia — el consentimiento real vive además en la cookie del
 * cliente, así que el registro en BD es solo auditoría.
 */
class CookieConsentController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        // Anti-flood: máximo 20 registros por IP cada 10 min (el usuario puede
        // cambiar de opinión varias veces, pero no miles).
        $key = 'cookie-consent:'.$request->ip();
        if (RateLimiter::tooManyAttempts($key, 20)) {
            return response()->json(['ok' => true]); // silencioso, no bloqueamos
        }
        RateLimiter::hit($key, 600);

        try {
            $data = $request->validate([
                'consent_uuid'   => ['nullable', 'string', 'max:64'],
                'action'         => ['required', 'string', 'in:accept_all,reject_all,custom'],
                'categories'     => ['required', 'array'],
                'categories.*'   => ['boolean'],
                'policy_version' => ['nullable', 'string', 'max:20'],
                'url'            => ['nullable', 'string', 'max:512'],
            ]);

            CookieConsent::create([
                'consent_uuid'   => $data['consent_uuid'] ?? null,
                'action'         => $data['action'],
                // Las necesarias siempre van true (no son opcionales).
                'categories'     => array_merge($data['categories'], ['necessary' => true]),
                'policy_version' => $data['policy_version'] ?? '1',
                'ip_hash'        => $this->anonymizeIp($request->ip()),
                'user_agent'     => mb_substr((string) $request->userAgent(), 0, 512),
                'url'            => $data['url'] ?? $request->headers->get('referer'),
            ]);
        } catch (\Throwable $e) {
            // No bloqueamos: la cookie del cliente ya guardó el consentimiento.
            report($e);
        }

        return response()->json(['ok' => true]);
    }

    /**
     * Hash irreversible de la IP, con la APP_KEY como sal. Permite detectar
     * duplicados / contar sin almacenar un dato personal en claro.
     */
    private function anonymizeIp(?string $ip): ?string
    {
        if (! $ip) {
            return null;
        }

        return hash('sha256', $ip.'|'.config('app.key'));
    }
}
