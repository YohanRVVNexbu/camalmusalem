<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        {{-- Etiqueta de Google. Se inyecta solo si GOOGLE_TAG_ID está en el .env.
             Acepta GA4 / Google Ads (ID "G-…" / "AW-…", snippet gtag.js) o GTM
             (ID "GTM-…", contenedor). Va lo más arriba posible del <head>. --}}
        @if ($googleTagId = config('services.google_tag.id'))
            @if (str_starts_with($googleTagId, 'GTM-'))
        <!-- Google Tag Manager -->
        <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','{{ $googleTagId }}');</script>
        <!-- End Google Tag Manager -->
            @else
        <!-- Google tag (gtag.js) -->
        <script async src="https://www.googletagmanager.com/gtag/js?id={{ $googleTagId }}"></script>
        <script>
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '{{ $googleTagId }}');
        </script>
            @endif
        @endif

        {{-- Favicons con cache-busting. El ?v= se incrementa cuando cambia
             el archivo para forzar al navegador a refrescar (los favicons
             son ultra-cacheados — sin esto el cliente sigue viendo el viejo). --}}
        <link rel="icon" type="image/png" sizes="32x32" href="{{ asset('favicon.png') }}?v=2">
        <link rel="icon" type="image/png" sizes="16x16" href="{{ asset('favicon.png') }}?v=2">
        <link rel="shortcut icon" href="{{ asset('favicon.png') }}?v=2">
        <link rel="apple-touch-icon" sizes="180x180" href="{{ asset('favicon.png') }}?v=2">

        {{-- Inline script to detect system dark mode preference and apply it immediately --}}
        <script>
            (function() {
                const appearance = '{{ $appearance ?? "system" }}';

                if (appearance === 'system') {
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

                    if (prefersDark) {
                        document.documentElement.classList.add('dark');
                    }
                }
            })();
        </script>

        {{-- Inline style to set the HTML background color based on our theme in app.css --}}
        <style>
            html {
                background-color: oklch(1 0 0);
            }

            html.dark {
                background-color: oklch(0.145 0 0);
            }
        </style>

        <title inertia>{{ config('app.name', 'Camal Musalem') }}</title>


        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />

        @viteReactRefresh
        @vite(['resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        {{-- Google Tag Manager (noscript) — solo aplica a IDs GTM-…; debe ir
             inmediatamente tras <body>. gtag.js (G-…) no usa noscript. --}}
        @if (($googleTagId = config('services.google_tag.id')) && str_starts_with($googleTagId, 'GTM-'))
        <!-- Google Tag Manager (noscript) -->
        <noscript><iframe src="https://www.googletagmanager.com/ns.html?id={{ $googleTagId }}"
        height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
        <!-- End Google Tag Manager (noscript) -->
        @endif
        @inertia
    </body>
</html>
