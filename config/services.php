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

    /*
     * Canal de denuncias / Compliance.
     *
     * Las denuncias de Ley 20.393 (Prevención del Delito) y Ley 21.643
     * (Ley Karin) las recibe internamente el Encargado de Prevención del
     * Delito de Toyota Musalem. El correo se configura en .env y NO se
     * commitea — es información sensible que solo la administración
     * conoce y suele cambiar cuando rota el cargo.
     *
     * Si la abogada define recipientes distintos por ley (p. ej. Karin a
     * un Comité de Convivencia), se agregan más entradas y los mailables
     * eligen según `tipo` de la denuncia.
     */
    'compliance' => [
        'encargado_email'      => env('COMPLIANCE_ENCARGADO_EMAIL'),
        'encargado_email_karin' => env('COMPLIANCE_ENCARGADO_EMAIL_KARIN'), // opcional, default = encargado_email
    ],

    /*
     * SendGrid (API HTTP, no SMTP).
     *
     * Usamos la API HTTP en vez de SMTP porque muchos hostings compartidos
     * (incluyendo Nexbu / CloudLinux) interceptan las conexiones SMTP
     * salientes y las redirigen a su propio MTA, lo que rompe el handshake
     * TLS contra smtp.sendgrid.net.
     *
     * Para activar en .env:
     *   MAIL_MAILER=sendgrid
     *   SENDGRID_API_KEY=SG.xxxxxx
     */
    'sendgrid' => [
        'api_key' => env('SENDGRID_API_KEY'),
    ],

];
