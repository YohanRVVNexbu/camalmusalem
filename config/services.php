<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'youtube' => [
        'api_key' => env('YOUTUBE_API_KEY'),
        'channel_id' => env('YOUTUBE_CHANNEL_ID', 'UCJbpxwdBAxYBxyWMvz2LvBg'),
    ],

    /*
     * Integración Salesforce Toyota (Mulesoft Dealer Experience API).
     * Crea oportunidades en Salesforce cuando un cliente cotiza un vehículo
     * nuevo desde la web. Documentación: "Documentos de Integración - PATCH
     * Create Opportunities WEB Dealer" + Postman collection UAT.
     *
     * UAT (qas): host *-qas-eh5zuw.na8zri.usa-e1.cloudhub.io
     * PRD: cuando se entregue, solo cambiar las URLs y credenciales en .env.
     */
    'salesforce_dealer' => [
        'oauth_url'     => env('SALESFORCE_OAUTH_URL', 'https://oauth-provider-api-qas-eh5zuw.na8zri.usa-e1.cloudhub.io/api/v1/token'),
        'api_base_url'  => env('SALESFORCE_API_BASE_URL', 'https://dealer-exp-api-qas-eh5zuw.na8zri.usa-e1.cloudhub.io/api/dealers'),
        'client_id'     => env('SALESFORCE_CLIENT_ID'),
        'client_secret' => env('SALESFORCE_CLIENT_SECRET'),
        'scope'         => env('SALESFORCE_SCOPE', 'DEALER'),
        'enabled'       => env('SALESFORCE_ENABLED', false),
    ],

];
