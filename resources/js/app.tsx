import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'sonner';
import '../css/app.css';
import { initializeTheme } from '@/hooks/use-appearance';
import { CookieConsentBanner, type CookieTexts } from '@/components/landing/cookie-consent';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) =>
        resolvePageComponent(
            `./pages/${name}.tsx`,
            import.meta.glob('./pages/**/*.tsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        // Los textos del banner de cookies son globales y estáticos: los leemos
        // del initial page (este componente se monta fuera del contexto Inertia).
        const cookieTexts = (props.initialPage.props as { cookieConsent?: CookieTexts | null }).cookieConsent ?? null;

        root.render(
            <StrictMode>
                <App {...props} />
                <Toaster position="bottom-right" richColors closeButton />
                <CookieConsentBanner texts={cookieTexts} />
            </StrictMode>,
        );
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();
