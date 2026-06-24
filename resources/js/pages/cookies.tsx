import { Head } from '@inertiajs/react';
import { useEffect } from 'react';
import { Footer } from '@/components/landing/footer';
import { Navbar } from '@/components/landing/navbar';

type CookiesPolicy = {
    title?: string;
    updated_label?: string;
    content?: string;
};

export default function CookiesPolicyPage({
    footer,
    cookies_policy,
}: {
    footer: any | null;
    cookies_policy: CookiesPolicy | null;
}) {
    useEffect(() => {
        const html = document.documentElement;
        const prev = html.style.backgroundColor;
        html.style.backgroundColor = '#fff';
        return () => { html.style.backgroundColor = prev; };
    }, []);

    const title = cookies_policy?.title || 'Política de Cookies';

    return (
        <div className="min-h-screen bg-white">
            <Head title={`${title} — Toyota Musalem`} />
            <Navbar variant="white" />

            <main className="mx-auto max-w-3xl px-5 pt-30 pb-20 lg:px-8 lg:pt-40">
                <h1 className="text-3xl font-semibold leading-tight text-black lg:text-5xl" style={{ fontFamily: '"Toyota Type"' }}>
                    {title}
                </h1>
                {cookies_policy?.updated_label && (
                    <p className="mt-3 text-sm text-black/50" style={{ fontFamily: '"Toyota Type"' }}>
                        {cookies_policy.updated_label}
                    </p>
                )}

                <div
                    className="mt-8 whitespace-pre-line text-base leading-relaxed text-black/80"
                    style={{ fontFamily: '"Toyota Type"' }}
                >
                    {cookies_policy?.content}
                </div>

                <button
                    type="button"
                    onClick={() => (window as unknown as { openCookiePreferences?: () => void }).openCookiePreferences?.()}
                    className="mt-10 inline-flex h-11 cursor-pointer items-center rounded-full bg-black px-6 text-sm font-medium text-white transition hover:bg-black/85"
                    style={{ fontFamily: '"Toyota Type"' }}
                >
                    Configurar mis cookies
                </button>
            </main>

            {footer && (
                <div className="bg-white">
                    <Footer data={footer} />
                </div>
            )}
        </div>
    );
}
