import { Head, Link } from '@inertiajs/react';
import {
    Car, ClipboardList, FileText, Key, KeySquare, ListChecks, ListTree,
    Mail, MapPin, MessageSquare, Newspaper, Package, Receipt, RefreshCw,
    Shield, Shirt, Tag, Users, Wrench,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import AdminLayout from '@/layouts/admin-layout';

type Card = { title: string; description: string; href: string; icon: LucideIcon };
type Group = { label: string; description: string; items: Card[] };

const GROUPS: Group[] = [
    {
        label: 'Catálogo',
        description: 'Productos y publicaciones que se muestran en el sitio público.',
        items: [
            { title: 'Vehículos nuevos', description: 'Modelos, versiones y especificaciones', href: '/admin/vehicle-models', icon: Car },
            { title: 'Seminuevos',       description: 'Stock de vehículos usados',           href: '/admin/seminuevos',      icon: RefreshCw },
            { title: 'Arriendos KINTO',  description: 'Vehículos para arriendo por hora/día', href: '/admin/rentals',         icon: Key },
            { title: 'Repuestos',        description: 'Catálogo de repuestos y piezas',      href: '/admin/repuestos',       icon: Wrench },
            { title: 'Accesorios',       description: 'Tienda de accesorios',                href: '/admin/accesorios',      icon: Shirt },
            { title: 'Merch',            description: 'Tienda de merch oficial',             href: '/admin/merch',           icon: Package },
            { title: 'Noticias',         description: 'Blog y novedades Toyota',             href: '/admin/noticias',        icon: Newspaper },
        ],
    },
    {
        label: 'Mantenedores',
        description: 'Configuración de datos transversales del sitio.',
        items: [
            { title: 'Marcas',                href: '/admin/brands',                description: 'Marcas asociadas al concesionario',  icon: Tag },
            { title: 'Sucursales',            href: '/admin/branches',              description: 'Ubicaciones, mapas y contacto',      icon: MapPin },
            { title: 'Formulario Mantención', href: '/admin/formulario-mantencion', description: 'Servicios y modelos del agendamiento', icon: Wrench },
            { title: 'Equipamiento',          href: '/admin/features',              description: 'Features disponibles por versión',   icon: ListChecks },
            { title: 'Listas editables',      href: '/admin/lookups',               description: 'Tipos de carrocería, tracción, etc.', icon: ListTree },
        ],
    },
    {
        label: 'Solicitudes',
        description: 'Mensajes y cotizaciones enviadas desde los formularios del sitio.',
        items: [
            { title: 'Contactos',                href: '/admin/contactos',               description: 'Formulario de contacto general',  icon: Mail },
            { title: 'Prevención del Delito',    href: '/admin/prevencion-delito',       description: 'Denuncias del modelo MPD',        icon: Shield },
            { title: 'Mantenciones',             href: '/admin/mantenciones',            description: 'Agendamientos de mantención',     icon: MessageSquare },
            { title: 'Solicitudes Kinto',        href: '/admin/kinto-solicitudes',       description: 'Reservas de arriendo KINTO',      icon: KeySquare },
            { title: 'Cotizaciones vehículos',   href: '/admin/cotizaciones-vehiculos',  description: 'Cotizaciones de nuevos y seminuevos', icon: Receipt },
            { title: 'Cotizaciones accesorios',  href: '/admin/cotizaciones-accesorios', description: 'Cotizaciones de accesorios',      icon: Receipt },
            { title: 'Cotizaciones repuestos',   href: '/admin/cotizaciones-repuestos',  description: 'Cotizaciones de repuestos',       icon: Receipt },
            { title: 'Encargos repuestos',       href: '/admin/solicitudes-encargo',     description: 'Encargos especiales de repuestos', icon: ClipboardList },
        ],
    },
    {
        label: 'Sistema',
        description: 'Contenido editorial y administración de usuarios.',
        items: [
            { title: 'Páginas',  href: '/admin/paginas', description: 'Contenido de todas las páginas del sitio', icon: FileText },
            { title: 'Usuarios', href: '/admin/users',   description: 'Administradores del sistema',              icon: Users },
        ],
    },
];

export default function AdminDashboard() {
    return (
        <AdminLayout breadcrumbs={[{ title: 'Dashboard', href: '/admin' }]}>
            <Head title="Admin - Dashboard" />
            <div className="flex flex-col gap-8 p-4">
                <div>
                    <h1 className="text-2xl font-semibold">Panel de Administración</h1>
                    <p className="text-muted-foreground">Bienvenido al panel de administración de Camal Musalem.</p>
                </div>

                {GROUPS.map((group) => (
                    <section key={group.label} className="flex flex-col gap-3">
                        <div>
                            <h2 className="text-lg font-semibold">{group.label}</h2>
                            <p className="text-sm text-muted-foreground">{group.description}</p>
                        </div>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {group.items.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="flex items-start gap-3 rounded-xl border bg-card p-4 transition hover:border-foreground/30 hover:shadow-sm"
                                >
                                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground">
                                        <item.icon className="size-5" />
                                    </span>
                                    <div className="min-w-0 flex-1">
                                        <div className="font-medium leading-tight">{item.title}</div>
                                        <div className="mt-1 line-clamp-2 text-sm text-muted-foreground">{item.description}</div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                ))}
            </div>
        </AdminLayout>
    );
}
