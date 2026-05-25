import { Link, usePage } from '@inertiajs/react';
import { AlertTriangle } from 'lucide-react';

import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import type { AppLayoutProps } from '@/types';

export default function AdminLayout({
    children,
    breadcrumbs = [],
}: AppLayoutProps) {
    const { maintenanceActive } = usePage<{ maintenanceActive?: boolean }>().props;

    return (
        <AppShell variant="sidebar">
            <AdminSidebar />
            <AppContent variant="sidebar" className="overflow-x-hidden">
                <AppSidebarHeader breadcrumbs={breadcrumbs} />
                {maintenanceActive && (
                    <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-red-300 bg-red-100 px-4 py-2 text-sm text-red-900">
                        <span className="flex items-center gap-2">
                            <AlertTriangle className="size-4 shrink-0" />
                            <span>
                                <strong>Modo mantenimiento activo.</strong> El sitio público muestra la pantalla de mantenimiento.
                                Tú sigues viendo todo porque estás autenticado.
                            </span>
                        </span>
                        <Link
                            href="/admin/mantenimiento"
                            className="shrink-0 rounded-md border border-red-300 bg-white px-3 py-1 font-medium text-red-700 transition hover:bg-red-50"
                        >
                            Desactivar
                        </Link>
                    </div>
                )}
                {children}
            </AppContent>
        </AppShell>
    );
}
