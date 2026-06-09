<!DOCTYPE html>
<html lang="es-CL">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="robots" content="noindex,nofollow">
    <title>Página no encontrada · Camal Musalem</title>
    <link rel="icon" type="image/png" href="{{ asset('favicon.png') }}?v=2">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body {
            height: 100%;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            background: #0a0a0a;
            color: #fff;
            -webkit-font-smoothing: antialiased;
        }
        .wrap {
            min-height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 24px;
            background:
                radial-gradient(circle at 50% 0%, rgba(235,10,30,0.15), transparent 60%),
                #0a0a0a;
        }
        .card {
            max-width: 560px;
            text-align: center;
        }
        .logo { height: 30px; width: auto; margin-bottom: 36px; opacity: 0.95; }
        .code {
            font-size: clamp(64px, 14vw, 120px);
            font-weight: 700;
            line-height: 1;
            letter-spacing: -0.02em;
            background: linear-gradient(180deg, #fff 0%, rgba(255,255,255,0.55) 100%);
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .accent { height: 4px; width: 56px; background: #EB0A1E; border-radius: 999px; margin: 18px auto 26px; }
        h1 {
            font-size: clamp(22px, 4vw, 32px);
            line-height: 1.15;
            font-weight: 600;
            margin-bottom: 14px;
        }
        p {
            font-size: clamp(15px, 2vw, 17px);
            line-height: 1.6;
            color: rgba(255,255,255,0.7);
            margin-bottom: 34px;
        }
        .btn {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            padding: 12px 24px;
            background: #EB0A1E;
            border-radius: 999px;
            font-size: 14px;
            font-weight: 600;
            text-decoration: none;
            color: #fff;
            transition: background 0.2s;
        }
        .btn:hover { background: #c50819; }
        .btn svg { width: 16px; height: 16px; }
        .foot {
            margin-top: 48px;
            font-size: 12px;
            color: rgba(255,255,255,0.4);
        }
    </style>
</head>
<body>
    <div class="wrap">
        <div class="card">
            <img class="logo" src="{{ asset('images/logo_blanco.png') }}" alt="Toyota Musalem">
            <div class="code">404</div>
            <div class="accent"></div>
            <h1>Página no encontrada</h1>
            <p>
                La página que buscas no existe o fue movida.
                Vuelve al inicio para seguir navegando.
            </p>
            <a href="{{ url('/') }}" class="btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/>
                </svg>
                Volver al inicio
            </a>
            <p class="foot">Camal Musalem · Concesionario Toyota Región de Coquimbo</p>
        </div>
    </div>
</body>
</html>
