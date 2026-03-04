import { Head } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';

export default function AdminDashboard() {
    return (
        <AdminLayout
            breadcrumbs={[
                { title: 'Dashboard', href: '/admin' },
            ]}
        >
            <Head title="Admin - Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <h1 className="text-2xl font-semibold">
                    Panel de Administración
                </h1>
                <p className="text-muted-foreground">
                    Bienvenido al panel de administración de CamalMusalem.
                </p>
            </div>
        </AdminLayout>
    );
}
