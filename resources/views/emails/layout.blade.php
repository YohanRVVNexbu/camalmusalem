<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('subject', 'Toyota Musalem')</title>
    <style>
        /* Reset básico para clientes de correo */
        body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
        body { margin: 0 !important; padding: 0 !important; width: 100% !important; font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #EAEAF1; color: #000; }

        /* Layout */
        .wrap { max-width: 600px; margin: 0 auto; padding: 24px 16px; }
        .card { background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); }

        /* Header con logo */
        .header { background: #000; padding: 28px 32px; text-align: center; }
        .header img { display: block; margin: 0 auto; height: 32px; width: auto; }
        .accent-bar { height: 4px; background: #EB0A1E; }

        /* Body */
        .body { padding: 32px; background: #ffffff; }
        h1 { font-size: 22px; font-weight: 700; margin: 0 0 16px; color: #000; line-height: 1.3; }
        h2 { font-size: 16px; font-weight: 600; margin: 24px 0 12px; color: #000; text-transform: uppercase; letter-spacing: 0.5px; }
        p { margin: 0 0 12px; line-height: 1.6; color: #333; font-size: 14px; }
        a { color: #EB0A1E; text-decoration: none; }
        a:hover { text-decoration: underline; }

        /* Resumen tipo tabla */
        .summary { background: #F5F5F8; border-left: 3px solid #EB0A1E; border-radius: 8px; padding: 18px 22px; margin: 16px 0; }
        .summary-row { display: table; width: 100%; padding: 8px 0; border-bottom: 1px solid rgba(0,0,0,0.06); font-size: 14px; }
        .summary-row:last-child { border-bottom: 0; padding-bottom: 0; }
        .summary-row:first-child { padding-top: 0; }
        .summary-label { display: table-cell; color: rgba(0,0,0,0.55); padding-right: 16px; vertical-align: top; width: 40%; }
        .summary-value { display: table-cell; color: #000; font-weight: 500; text-align: right; vertical-align: top; }

        /* Divisor */
        .divider { height: 1px; background: rgba(0,0,0,0.08); margin: 24px 0; border: 0; }

        /* Botón CTA opcional */
        .button { display: inline-block; background: #000; color: #ffffff !important; padding: 12px 24px; border-radius: 60px; font-size: 14px; font-weight: 600; text-decoration: none; margin: 12px 0; }

        /* Footer */
        .footer { padding: 20px 32px 24px; text-align: center; font-size: 12px; color: rgba(0,0,0,0.5); }
        .footer p { margin: 4px 0; font-size: 12px; color: rgba(0,0,0,0.5); }
        .footer a { color: rgba(0,0,0,0.7); }

        /* Mobile */
        @media only screen and (max-width: 480px) {
            .wrap { padding: 12px 8px; }
            .header { padding: 22px 20px; }
            .body { padding: 24px 20px; }
            .summary { padding: 14px 16px; }
            h1 { font-size: 20px; }
        }
    </style>
</head>
<body>
    <div class="wrap">
        <div class="card">
            @php
                // URL absoluta del logo (basada en APP_URL). NO usar base64
                // data: — Gmail y Outlook BLOQUEAN las imágenes inline data:
                // y se ven rotas. Una URL https pública sí se carga en todos
                // los clientes. Requiere que public/images/logo_blanco.png sea
                // accesible y que APP_URL esté bien seteado en producción.
                $logoSrc = asset('images/logo_blanco.png');
            @endphp
            <div class="header">
                <img src="{{ $logoSrc }}" alt="Toyota Musalem" />
            </div>
            <div class="accent-bar"></div>
            <div class="body">
                @yield('content')
            </div>
        </div>
    </div>
</body>
</html>
