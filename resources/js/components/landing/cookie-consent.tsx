import { useEffect } from 'react';
import * as CookieConsent from 'vanilla-cookieconsent';
import 'vanilla-cookieconsent/dist/cookieconsent.css';

/**
 * Banner de consentimiento de cookies (vanilla-cookieconsent v3).
 *
 * - Categorías: necesarias (siempre on) / analíticas / marketing.
 * - Integra Google Consent Mode v2: GA arranca denegado (ver app.blade.php) y
 *   solo se activa si el usuario acepta analíticas.
 * - Registra cada decisión en BD (POST /cookies/consentimiento) como auditoría.
 * - Los textos son editables desde /admin/paginas/cookies (llegan vía props).
 *
 * Se reabre desde el footer con window.openCookiePreferences().
 */
export type CookieTexts = {
    title?: string;
    description?: string;
    accept_label?: string;
    reject_label?: string;
    settings_label?: string;
    save_label?: string;
    prefs_title?: string;
    necessary_title?: string;
    necessary_desc?: string;
    analytics_title?: string;
    analytics_desc?: string;
    marketing_title?: string;
    marketing_desc?: string;
    policy_url?: string;
    policy_link_label?: string;
    policy_version?: string;
};

let initialized = false;

// Sincroniza Google Consent Mode con las categorías aceptadas.
function syncGoogleConsent() {
    const analytics = CookieConsent.acceptedCategory('analytics');
    const marketing = CookieConsent.acceptedCategory('marketing');
    const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
    if (typeof gtag === 'function') {
        gtag('consent', 'update', {
            analytics_storage: analytics ? 'granted' : 'denied',
            ad_storage: marketing ? 'granted' : 'denied',
            ad_user_data: marketing ? 'granted' : 'denied',
            ad_personalization: marketing ? 'granted' : 'denied',
        });
    }
    // Señal global para que los embeds (YouTube, etc.) sepan si pueden cargar.
    (window as unknown as { __cookieMarketing?: boolean }).__cookieMarketing = marketing;
    window.dispatchEvent(new CustomEvent('cookie-consent-changed', { detail: { analytics, marketing } }));
}

// Registra la decisión en BD (solo en la primera vez y en cambios, no en cada carga).
function logConsent(policyVersion: string) {
    const analytics = CookieConsent.acceptedCategory('analytics');
    const marketing = CookieConsent.acceptedCategory('marketing');
    const cookie = CookieConsent.getCookie() as { consentId?: string } | undefined;
    const action = analytics && marketing ? 'accept_all' : !analytics && !marketing ? 'reject_all' : 'custom';
    const csrf = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content ?? '';

    fetch('/cookies/consentimiento', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrf,
            Accept: 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'same-origin',
        body: JSON.stringify({
            consent_uuid: cookie?.consentId ?? null,
            action,
            categories: { analytics, marketing },
            policy_version: policyVersion,
            url: window.location.pathname,
        }),
    }).catch(() => {
        /* el consentimiento ya quedó en la cookie del cliente; el log es best-effort */
    });
}

export function CookieConsentBanner({ texts }: { texts: CookieTexts | null }) {
    useEffect(() => {
        if (!texts || initialized) return;
        // No mostramos el banner en el panel admin / auth.
        const path = window.location.pathname;
        if (/^\/(admin|login|register|dashboard|settings|forgot-password|reset-password)/.test(path)) {
            return;
        }
        initialized = true;

        const t = texts;
        const policyVersion = t.policy_version ?? '1';

        CookieConsent.run({
            guiOptions: {
                consentModal: { layout: 'box wide', position: 'bottom left', flipButtons: false, equalWeightButtons: false },
                preferencesModal: { layout: 'box', position: 'right', flipButtons: false, equalWeightButtons: true },
            },
            // Al subir la versión de política, se invalida el consentimiento
            // previo y el banner reaparece (re-consentimiento).
            revision: Number(policyVersion) || 1,
            categories: {
                necessary: { enabled: true, readOnly: true },
                analytics: {},
                marketing: {},
            },
            language: {
                default: 'es',
                translations: {
                    es: {
                        consentModal: {
                            title: t.title ?? 'Usamos cookies',
                            description: t.description ?? '',
                            acceptAllBtn: t.accept_label ?? 'Aceptar todo',
                            acceptNecessaryBtn: t.reject_label ?? 'Rechazar',
                            showPreferencesBtn: t.settings_label ?? 'Configurar',
                            footer: t.policy_url
                                ? `<a href="${t.policy_url}">${t.policy_link_label ?? 'Política de Cookies'}</a>`
                                : '',
                        },
                        preferencesModal: {
                            title: t.prefs_title ?? 'Preferencias de cookies',
                            acceptAllBtn: t.accept_label ?? 'Aceptar todo',
                            acceptNecessaryBtn: t.reject_label ?? 'Rechazar',
                            savePreferencesBtn: t.save_label ?? 'Guardar preferencias',
                            closeIconLabel: 'Cerrar',
                            sections: [
                                { title: t.necessary_title ?? 'Cookies necesarias', description: t.necessary_desc ?? '', linkedCategory: 'necessary' },
                                { title: t.analytics_title ?? 'Cookies analíticas', description: t.analytics_desc ?? '', linkedCategory: 'analytics' },
                                { title: t.marketing_title ?? 'Cookies de marketing', description: t.marketing_desc ?? '', linkedCategory: 'marketing' },
                                ...(t.policy_url
                                    ? [{ title: t.policy_link_label ?? 'Más información', description: `<a href="${t.policy_url}">${t.policy_link_label ?? 'Política de Cookies'}</a>` }]
                                    : []),
                            ],
                        },
                    },
                },
            },
            // Primera decisión y cambios → sincroniza gtag + registra en BD.
            onFirstConsent: () => { syncGoogleConsent(); logConsent(policyVersion); },
            onChange: () => { syncGoogleConsent(); logConsent(policyVersion); },
            // En cada carga, si ya había consentimiento, restaura el estado en
            // gtag (sin registrar de nuevo en BD).
            onConsent: () => { syncGoogleConsent(); },
        });

        // El footer reabre el panel de preferencias.
        (window as unknown as { openCookiePreferences?: () => void }).openCookiePreferences = () =>
            CookieConsent.showPreferences();
    }, [texts]);

    return null;
}
