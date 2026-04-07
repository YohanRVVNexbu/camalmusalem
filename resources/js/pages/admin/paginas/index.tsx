import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';

type Page = { slug: string; title: string; icon: string };

const FIXED_PAGES = [
    { slug: null, title: 'Página de inicio', icon: '🏠', href: '/admin/home' },
];

export default function PaginasIndex({ pages }: { pages: Page[] }) {
    return (
        <AdminLayout breadcrumbs={[{ title: 'Dashboard', href: '/admin' }, { title: 'Páginas', href: '/admin/paginas' }]}>
            <Head title="Admin — Páginas" />
            <div className="flex flex-col gap-6 p-4">
                <div>
                    <h1 className="text-2xl font-semibold">Gestionar páginas</h1>
                    <p className="text-muted-foreground">Edita el contenido de cada página del sitio: imágenes, títulos, textos y secciones.</p>
                </div>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                    {FIXED_PAGES.map((p) => (
                        <Link
                            key={p.href}
                            href={p.href}
                            className="flex flex-col gap-2 rounded-xl border bg-card p-5 transition hover:border-foreground/30 hover:shadow-sm"
                        >
                            <span className="text-2xl">{p.icon}</span>
                            <div className="font-semibold">{p.title}</div>
                        </Link>
                    ))}
                    {pages.map((p) => (
                        <Link
                            key={p.slug}
                            href={`/admin/paginas/${p.slug}`}
                            className="flex flex-col gap-2 rounded-xl border bg-card p-5 transition hover:border-foreground/30 hover:shadow-sm"
                        >
                            <span className="text-2xl">{p.icon}</span>
                            <div className="font-semibold">{p.title}</div>
                        </Link>
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
}
