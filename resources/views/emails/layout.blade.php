<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('subject', 'Toyota Musalem')</title>
    <style>
        body { margin: 0; padding: 0; font-family: 'Helvetica Neue', Arial, sans-serif; background: #EAEAF1; color: #000; }
        .wrap { max-width: 600px; margin: 0 auto; padding: 32px 16px; }
        .card { background: #fff; border-radius: 20px; padding: 32px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
        .header { background: #000; color: #fff; padding: 24px 32px; border-radius: 20px 20px 0 0; }
        .header h1 { margin: 0; font-size: 22px; font-weight: 600; }
        .body { padding: 24px 32px; background: #fff; border-radius: 0 0 20px 20px; }
        h2 { font-size: 18px; font-weight: 600; margin: 0 0 12px; color: #000; }
        p { margin: 0 0 12px; line-height: 1.5; color: #333; font-size: 14px; }
        .summary { background: #EAEAF1; border-radius: 12px; padding: 16px 20px; margin: 16px 0; }
        .summary-row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid rgba(0,0,0,0.06); font-size: 14px; }
        .summary-row:last-child { border-bottom: 0; }
        .summary-label { color: rgba(0,0,0,0.6); }
        .summary-value { color: #000; font-weight: 500; text-align: right; }
        .footer { padding: 16px 32px; text-align: center; font-size: 12px; color: rgba(0,0,0,0.5); }
        .footer a { color: rgba(0,0,0,0.7); text-decoration: none; }
        .divider { height: 1px; background: rgba(0,0,0,0.08); margin: 16px 0; }
    </style>
</head>
<body>
    <div class="wrap">
        <div class="header">
            <h1>Toyota Musalem</h1>
        </div>
        <div class="body">
            @yield('content')
        </div>
        <div class="footer">
            <p>Este correo fue generado automáticamente, por favor no respondas a esta dirección.</p>
            <p><a href="https://camalmusalem.cl">camalmusalem.cl</a></p>
        </div>
    </div>
</body>
</html>
