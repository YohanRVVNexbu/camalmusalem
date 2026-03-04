import { Form, Head, Link, usePage } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AdminLayout from '@/layouts/admin-layout';
import type { User } from '@/types';

type Props = {
    user: User;
};

export default function UsersEdit({ user }: Props) {
    const { auth } = usePage<{ auth: { user: User } }>().props;
    const isSelf = user.id === auth.user.id;

    return (
        <AdminLayout
            breadcrumbs={[
                { title: 'Dashboard', href: '/admin/dashboard' },
                { title: 'Usuarios', href: '/admin/users' },
                { title: 'Editar', href: `/admin/users/${user.id}/edit` },
            ]}
        >
            <Head title={`Admin - Editar ${user.name}`} />

            <div className="flex flex-col gap-4 p-4">
                <h1 className="text-2xl font-semibold">
                    Editar usuario{isSelf && ' (tú)'}
                </h1>

                <div className="max-w-lg">
                    <Form
                        action={`/admin/users/${user.id}`}
                        method="put"
                        className="flex flex-col gap-6"
                    >
                        {({ processing, errors }) => (
                            <>
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Nombre</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        required
                                        autoFocus
                                        defaultValue={user.name}
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="email">Correo electrónico</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        required
                                        defaultValue={user.email}
                                    />
                                    <InputError message={errors.email} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="password">Nueva contraseña</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        name="password"
                                        placeholder="Dejar vacío para mantener actual"
                                    />
                                    <InputError message={errors.password} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="password_confirmation">Confirmar nueva contraseña</Label>
                                    <Input
                                        id="password_confirmation"
                                        type="password"
                                        name="password_confirmation"
                                        placeholder="Repetir nueva contraseña"
                                    />
                                </div>

                                {!isSelf && (
                                    <div className="flex items-center space-x-3">
                                        <Checkbox
                                            id="is_admin"
                                            name="is_admin"
                                            value="1"
                                            defaultChecked={!!user.is_admin}
                                        />
                                        <Label htmlFor="is_admin">Es administrador</Label>
                                    </div>
                                )}

                                {isSelf && (
                                    <input type="hidden" name="is_admin" value="1" />
                                )}

                                <div className="flex gap-3">
                                    <Button type="submit" disabled={processing}>
                                        {processing && <Spinner />}
                                        Guardar cambios
                                    </Button>
                                    <Button variant="outline" asChild>
                                        <Link href="/admin/users">Cancelar</Link>
                                    </Button>
                                </div>
                            </>
                        )}
                    </Form>
                </div>
            </div>
        </AdminLayout>
    );
}
