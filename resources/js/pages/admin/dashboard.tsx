import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';

const SECTIONS = [
    { title: 'Página de inicio', description: 'Hero, secciones, footer', href: '/admin/home', icon: '🏠' },
    { title: 'Vehículos nuevos', description: 'Catálogo, versiones, especificaciones', href: '/admin/vehicles', icon: '🚗' },
    { title: 'Seminuevos', description: 'Stock de vehículos usados', href: '/admin/seminuevos', icon: '🔄' },
    { title: 'Repuestos', description: 'Catálogo de repuestos y piezas', href: '/admin/repuestos', icon: '🔧' },
    { title: 'Accesorios y Merch', description: 'Tienda de accesorios y ropa', href: '/admin/accesorios', icon: '👕' },
    { title: 'Noticias', description: 'Blog y novedades Toyota', href: '/admin/noticias', icon: '📰' },
    { title: 'Páginas', description: 'Contenido de páginas del sitio', href: '/admin/paginas', icon: '📄' },
    { title: 'Usuarios', description: 'Administradores del sistema', href: '/admin/users', icon: '👤' },
];

export default function AdminDashboard() {
    return (
        <AdminLayout breadcrumbs={[{ title: 'Dashboard', href: '/admin' }]}>
            <Head title="Admin - Dashboard" />
            <div className="flex flex-col gap-6 p-4">
                <div>
                    <h1 className="text-2xl font-semibold">Panel de Administración</h1>
                    <p className="text-muted-foreground">Bienvenido al panel de administración de Camal Musalem.</p>
                </div>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                    {SECTIONS.map((s) => (
                        <Link
                            key={s.href}
                            href={s.href}
                            className="flex flex-col gap-2 rounded-xl border bg-card p-5 transition hover:border-foreground/30 hover:shadow-sm"
                        >
                            <span className="text-2xl">{s.icon}</span>
                            <div>
                                <div className="font-semibold">{s.title}</div>
                                <div className="text-sm text-muted-foreground">{s.description}</div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
}
