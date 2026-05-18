<?php

namespace App\Services\Salesforce;

use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * Cliente para la API de Mulesoft / Salesforce Dealer Experience de Toyota Chile.
 *
 * Documentación:
 *  - "Documentos de Integración - PATCH Create Opportunities WEB Dealer"
 *  - Postman collection "Musalem UAT La SERENA"
 *
 * Flujo:
 *  1. getToken() pide un Bearer token al endpoint OAuth (Client Credentials)
 *     y lo cachea durante 50 minutos. Si el token cacheado expira o devuelve
 *     401, lo refresca automáticamente.
 *  2. createQuote() hace el PATCH al endpoint `/dealers/{dealerId}/quote` con
 *     el payload mapeado al schema Salesforce.
 *
 * Las credenciales (client_id, client_secret) se cargan desde `.env` vía
 * `config('services.salesforce_dealer.*')`. Si `SALESFORCE_ENABLED=false`,
 * el cliente lanza una excepción especial que el Job interpreta como "skip"
 * (útil para entornos donde todavía no hay credenciales).
 */
class DealerExpApiClient
{
    private const TOKEN_CACHE_KEY = 'salesforce_dealer:access_token';
    private const TOKEN_TTL_SECONDS = 3000; // 50 min; los tokens OAuth de Mulesoft duran ~1h

    public function __construct(
        private readonly string $oauthUrl,
        private readonly string $apiBaseUrl,
        private readonly ?string $clientId,
        private readonly ?string $clientSecret,
        private readonly string $scope,
        private readonly bool $enabled,
    ) {}

    public static function fromConfig(): self
    {
        $cfg = config('services.salesforce_dealer');

        return new self(
            oauthUrl:     $cfg['oauth_url'],
            apiBaseUrl:   $cfg['api_base_url'],
            clientId:     $cfg['client_id'] ?? null,
            clientSecret: $cfg['client_secret'] ?? null,
            scope:        $cfg['scope'] ?? 'DEALER',
            enabled:      (bool) ($cfg['enabled'] ?? false),
        );
    }

    public function isEnabled(): bool
    {
        return $this->enabled && $this->clientId && $this->clientSecret;
    }

    /**
     * PATCH /dealers/{dealerId}/quote
     * Crea una oportunidad + account + quote + quoteLineItem en Salesforce.
     *
     * @return array Decoded JSON response. Si meta.status !== 'succeed', tira excepción.
     */
    public function createQuote(string $dealerId, array $payload): array
    {
        $this->ensureEnabled();

        $token = $this->getToken();
        $url = rtrim($this->apiBaseUrl, '/').'/'.$dealerId.'/quote';

        $response = $this->sendPatch($url, $token, $payload);

        // El endpoint puede invalidar el token cacheado (rotación). Si recibimos
        // 401, forzamos refresh y reintentamos UNA vez antes de tirar excepción.
        if ($response->status() === 401) {
            $this->forgetToken();
            $token = $this->getToken();
            $response = $this->sendPatch($url, $token, $payload);
        }

        return $this->parseResponse($response);
    }

    private function sendPatch(string $url, string $token, array $payload): Response
    {
        return Http::withHeaders($this->commonHeaders($token))
            ->timeout(30)
            ->connectTimeout(10)
            ->patch($url, $payload);
    }

    private function parseResponse(Response $response): array
    {
        $body = $response->json();
        $status = $response->status();

        if ($status >= 500) {
            throw new DealerExpApiException(
                "Salesforce respondió 5xx ({$status}). Reintentable.",
                $status, is_array($body) ? $body : null, retryable: true,
            );
        }

        if ($status === 401) {
            throw new DealerExpApiException(
                'Token Salesforce inválido o expirado tras refresh.',
                401, is_array($body) ? $body : null, retryable: false,
            );
        }

        if ($status === 415) {
            throw new DealerExpApiException(
                'Content-Type no aceptado por Salesforce (415).',
                415, is_array($body) ? $body : null, retryable: false,
            );
        }

        if ($status >= 400) {
            $msg = data_get($body, 'meta.messages.0.description', "Bad Request ({$status})");
            throw new DealerExpApiException(
                "Salesforce rechazó la cotización: {$msg}",
                $status, is_array($body) ? $body : null, retryable: false,
            );
        }

        // 200 OK / 201 Created / 204 No Content
        // Si meta.status existe y no es 'succeed', considerar error de negocio.
        if (is_array($body) && data_get($body, 'meta.status') === 'failed') {
            $msg = data_get($body, 'meta.messages.0.description', 'Operación fallida');
            throw new DealerExpApiException(
                "Salesforce devolvió meta.status=failed: {$msg}",
                $status, $body, retryable: false,
            );
        }

        return is_array($body) ? $body : ['_raw' => $response->body()];
    }

    /**
     * Obtiene un Bearer token, cacheado durante 50 min. La API exige que el
     * token se envíe en cada llamada (no hay refresh token rotativo, solo se
     * pide uno nuevo cuando expira).
     */
    public function getToken(): string
    {
        return Cache::remember(self::TOKEN_CACHE_KEY, self::TOKEN_TTL_SECONDS, function () {
            return $this->fetchToken();
        });
    }

    public function forgetToken(): void
    {
        Cache::forget(self::TOKEN_CACHE_KEY);
    }

    private function fetchToken(): string
    {
        $response = Http::withHeaders([
            'client_id'     => $this->clientId,
            'client_secret' => $this->clientSecret,
            'grant_type'    => 'CLIENT_CREDENTIALS',
            'scope'         => $this->scope,
        ])
            ->timeout(15)
            ->post($this->oauthUrl);

        if ($response->failed()) {
            Log::error('Salesforce OAuth falló', [
                'status' => $response->status(),
                'body'   => $response->body(),
            ]);
            throw new DealerExpApiException(
                'No se pudo obtener token OAuth de Salesforce.',
                $response->status(), null, retryable: true,
            );
        }

        $token = $response->json('access_token');
        if (! $token) {
            throw new DealerExpApiException(
                'Respuesta OAuth sin access_token.',
                $response->status(), $response->json(), retryable: false,
            );
        }

        return (string) $token;
    }

    private function commonHeaders(string $token): array
    {
        return [
            'client_id'     => $this->clientId,
            'client_secret' => $this->clientSecret,
            'Authorization' => 'Bearer '.$token,
            'Content-Type'  => 'application/json',
            'Accept'        => 'application/json',
        ];
    }

    private function ensureEnabled(): void
    {
        if (! $this->isEnabled()) {
            throw new DealerExpApiException(
                'Integración Salesforce deshabilitada o sin credenciales.',
                0, null, retryable: false,
            );
        }
    }
}
