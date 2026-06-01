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
 * Credenciales por dealer (PRD):
 *  En producción cada sucursal tiene su PROPIO client_id/client_secret. Por
 *  ejemplo La Serena (100068) usa un par y Ovalle (100069) usa otro. El cliente
 *  resuelve qué par usar a partir del `$dealerId` en cada llamada a createQuote().
 *
 *  En UAT/QAS había un solo par genérico que servía para ambos dealers; ese
 *  flujo sigue funcionando porque resolveCredentials() cae al par genérico
 *  cuando no hay credenciales específicas para el dealer.
 *
 * Flujo:
 *  1. getTokenFor($dealerId) pide un Bearer token al endpoint OAuth usando
 *     las credenciales del dealer, y lo cachea durante 50 minutos. Si el token
 *     cacheado devuelve 401, lo refresca automáticamente.
 *  2. createQuote() hace el PATCH al endpoint `/dealers/{dealerId}/quote` con
 *     el payload mapeado al schema Salesforce.
 *
 * Si `SALESFORCE_ENABLED=false` o no hay credenciales para el dealer pedido,
 * tira excepción especial que el caller interpreta como "skip" (útil para
 * entornos donde todavía no hay credenciales).
 */
class DealerExpApiClient
{
    private const TOKEN_CACHE_PREFIX = 'salesforce_dealer:access_token:';
    /**
     * Cache TTL del token OAuth. En UAT los tokens duraban ~1 hora pero en
     * PROD duran solo 300 segundos (5 min) según `expires_in`. Cacheamos
     * 240 seg (4 min) para dejar margen y evitar el round-trip extra que
     * causa el retry-on-401 cuando el token expira entre cotizaciones.
     */
    private const TOKEN_TTL_SECONDS = 240;

    /**
     * @param  array<string, array{client_id: ?string, client_secret: ?string}>  $dealers
     */
    public function __construct(
        private readonly string $oauthUrl,
        private readonly string $apiBaseUrl,
        private readonly string $scope,
        private readonly bool $enabled,
        private readonly ?string $defaultClientId,
        private readonly ?string $defaultClientSecret,
        private readonly array $dealers,
    ) {}

    public static function fromConfig(): self
    {
        $cfg = config('services.salesforce_dealer');

        return new self(
            oauthUrl:            $cfg['oauth_url'],
            apiBaseUrl:          $cfg['api_base_url'],
            scope:               $cfg['scope'] ?? 'DEALER',
            enabled:             (bool) ($cfg['enabled'] ?? false),
            defaultClientId:     $cfg['client_id'] ?? null,
            defaultClientSecret: $cfg['client_secret'] ?? null,
            dealers:             $cfg['dealers'] ?? [],
        );
    }

    public function isEnabled(): bool
    {
        return $this->enabled;
    }

    /**
     * Indica si tenemos credenciales válidas (genéricas o específicas) para
     * el dealer dado. El sync service usa esto para decidir si vale la pena
     * intentar la llamada o saltar la cotización.
     */
    public function hasCredentialsFor(string $dealerId): bool
    {
        try {
            $this->resolveCredentials($dealerId);
            return true;
        } catch (DealerExpApiException) {
            return false;
        }
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
        [$clientId, $clientSecret] = $this->resolveCredentials($dealerId);

        $token = $this->getTokenFor($dealerId, $clientId, $clientSecret);
        $url = rtrim($this->apiBaseUrl, '/').'/'.$dealerId.'/quote';

        $response = $this->sendPatch($url, $token, $clientId, $clientSecret, $payload);

        // El endpoint puede invalidar el token cacheado (rotación). Si recibimos
        // 401, forzamos refresh y reintentamos UNA vez antes de tirar excepción.
        if ($response->status() === 401) {
            $this->forgetTokenFor($dealerId);
            $token = $this->getTokenFor($dealerId, $clientId, $clientSecret);
            $response = $this->sendPatch($url, $token, $clientId, $clientSecret, $payload);
        }

        return $this->parseResponse($response);
    }

    /**
     * Resuelve el par client_id/client_secret a usar para un dealer dado.
     * Primero busca en el mapa `dealers.{dealerId}`, sino cae al genérico.
     *
     * @return array{0: string, 1: string}
     */
    private function resolveCredentials(string $dealerId): array
    {
        $specific = $this->dealers[$dealerId] ?? null;
        if (is_array($specific)
            && ! empty($specific['client_id'])
            && ! empty($specific['client_secret'])
        ) {
            return [(string) $specific['client_id'], (string) $specific['client_secret']];
        }

        if ($this->defaultClientId && $this->defaultClientSecret) {
            return [$this->defaultClientId, $this->defaultClientSecret];
        }

        throw new DealerExpApiException(
            "No hay credenciales Salesforce configuradas para el dealer {$dealerId} ".
            '(falta SALESFORCE_CLIENT_ID/SECRET genérico o específico de la sucursal).',
            0, null, retryable: false,
        );
    }

    private function sendPatch(string $url, string $token, string $clientId, string $clientSecret, array $payload): Response
    {
        return Http::withHeaders($this->commonHeaders($token, $clientId, $clientSecret))
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
     * Obtiene un Bearer token para el dealer dado, cacheado durante 50 min.
     * Cada dealer tiene su propio token porque cada uno usa credenciales
     * distintas — el token de un dealer NO sirve para llamar el endpoint
     * de otro.
     */
    public function getTokenFor(string $dealerId, string $clientId, string $clientSecret): string
    {
        $cacheKey = self::TOKEN_CACHE_PREFIX.$dealerId;

        return Cache::remember($cacheKey, self::TOKEN_TTL_SECONDS, function () use ($clientId, $clientSecret, $dealerId) {
            return $this->fetchToken($clientId, $clientSecret, $dealerId);
        });
    }

    public function forgetTokenFor(string $dealerId): void
    {
        Cache::forget(self::TOKEN_CACHE_PREFIX.$dealerId);
    }

    private function fetchToken(string $clientId, string $clientSecret, string $dealerId): string
    {
        $response = Http::withHeaders([
            'client_id'     => $clientId,
            'client_secret' => $clientSecret,
            'grant_type'    => 'CLIENT_CREDENTIALS',
            'scope'         => $this->scope,
        ])
            ->timeout(15)
            ->post($this->oauthUrl);

        if ($response->failed()) {
            Log::error('Salesforce OAuth falló', [
                'dealer_id' => $dealerId,
                'status'    => $response->status(),
                'body'      => $response->body(),
            ]);
            throw new DealerExpApiException(
                "No se pudo obtener token OAuth de Salesforce para dealer {$dealerId}.",
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

    private function commonHeaders(string $token, string $clientId, string $clientSecret): array
    {
        return [
            'client_id'     => $clientId,
            'client_secret' => $clientSecret,
            'Authorization' => 'Bearer '.$token,
            'Content-Type'  => 'application/json',
            'Accept'        => 'application/json',
        ];
    }

    private function ensureEnabled(): void
    {
        if (! $this->isEnabled()) {
            throw new DealerExpApiException(
                'Integración Salesforce deshabilitada (SALESFORCE_ENABLED=false).',
                0, null, retryable: false,
            );
        }
    }
}
