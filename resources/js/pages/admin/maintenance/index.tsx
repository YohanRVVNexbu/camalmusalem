import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { AlertTriangle, Check, Power } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import AdminLayout from '@/layouts/admin-layout';

type Maintenance = {
    is_active: boolean;
    data: {
        title: string;
        description: string;
        eta: string;
        contact_email: string;
        image: string;
        image_mobile: string;
        show_logo: boolean;
    };
};

export default function MaintenanceAdmin({ maintenance }: { maintenance: Maintenance }) {
    const { flash } = usePage<{ flash: { success?: string; error?: string } }>().props;

    const [isActive, setIsActive] = useState(maintenance.is_active);
    const [data, setData] = useState(maintenance.data);
    const [desktopFile, setDesktopFile] = useState<File | null>(null);
    const [mobileFile, setMobileFile] = useState<File | null>(null);
    const [processing, setProcessing] = useState(false);

    const set = (k: keyof typeof data, v: any) => setData((d) => ({ ...d, [k]: v }));

    const submit = (nextActive?: boolean) => {
        setProcessing(true);
        const targetActive = typeof nextActive === 'boolean' ? nextActive : isActive;

        const fd = new FormData();
        fd.append('is_active', targetActive ? '1' : '0');
        fd.append('title', data.title);
        fd.append('description', data.description);
        fd.append('eta', data.eta);
        fd.append('contact_email', data.contact_email);
        fd.append('show_logo', data.show_logo ? '1' : '0');
        if (desktopFile) fd.append('image', desktopFile);
        if (mobileFile) fd.append('image_mobile', mobileFile);

        router.post('/admin/mantenimiento', fd, {
            forceFormData: true,
            onSuccess: () => {
                setIsActive(targetActive);
                setDesktopFile(null);
                setMobileFile(null);
            },
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <AdminLayout breadcrumbs={[
            { title: 'Dashboard', href: '/admin' },
            { title: 'Modo mantenimiento', href: '/admin/mantenimiento' },
        ]}>
            <Head title="Admin — Modo mantenimiento" />

            <div className="flex flex-col gap-6 p-4">
                <header>
                    <h1 className="text-2xl font-semibold">Modo mantenimiento</h1>
                    <p className="text-sm text-muted-foreground">
                        Cuando está activado, los visitantes públicos ven una pantalla de mantenimiento. Tú como admin
                        sigues viendo el sitio normalmente — puedes navegar y desactivarlo cuando termines.
                    </p>
                </header>

                {flash?.success && (
                    <div className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700">{flash.success}</div>
                )}

                {/* Estado actual + toggle grande */}
                <section className={`rounded-lg border-2 p-6 ${isActive ? 'border-red-300 bg-red-50' : 'border-green-200 bg-green-50/50'}`}>
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex items-start gap-4">
                            <div className={`flex size-12 shrink-0 items-center justify-center rounded-full ${isActive ? 'bg-red-600 text-white' : 'bg-green-600 text-white'}`}>
                                {isActive ? <AlertTriangle className="size-6" /> : <Check className="size-6" />}
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold">
                                    {isActive ? 'Sitio público en mantenimiento' : 'Sitio público operativo'}
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    {isActive
                                        ? 'Los clientes ven la pantalla de mantenimiento. Solo los admins pueden navegar el sitio.'
                                        : 'Los clientes pueden navegar el sitio normalmente.'}
                                </p>
                            </div>
                        </div>
                        <Button
                            type="button"
                            disabled={processing}
                            onClick={() => submit(!isActive)}
                            variant={isActive ? 'outline' : 'destructive'}
                            size="lg"
                            className="gap-2"
                        >
                            <Power className="size-4" />
                            {isActive ? 'Desactivar mantenimiento' : 'Activar mantenimiento'}
                        </Button>
                    </div>
                </section>

                {/* Configuración del mensaje */}
                <section className="rounded-lg border bg-card p-6">
                    <h2 className="mb-4 text-base font-semibold">Mensaje que verán los clientes</h2>

                    <form
                        onSubmit={(e) => { e.preventDefault(); submit(); }}
                        className="flex flex-col gap-4"
                    >
                        <div className="grid gap-2">
                            <Label htmlFor="title">Título</Label>
                            <Input id="title" value={data.title} onChange={(e) => set('title', e.target.value)} required />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="description">Descripción</Label>
                            <Textarea id="description" value={data.description} onChange={(e) => set('description', e.target.value)} rows={4} required />
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="eta">Estimación de regreso (opcional)</Label>
                                <Input id="eta" value={data.eta} onChange={(e) => set('eta', e.target.value)} placeholder="Ej: 18:00 hrs, mañana, en 30 minutos…" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="contact_email">Email de contacto (opcional)</Label>
                                <Input id="contact_email" type="email" value={data.contact_email} onChange={(e) => set('contact_email', e.target.value)} placeholder="info@camalmusalem.cl" />
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Checkbox id="show_logo" checked={data.show_logo} onCheckedChange={(v) => set('show_logo', !!v)} />
                            <Label htmlFor="show_logo">Mostrar logo Toyota Musalem</Label>
                        </div>

                        <Separator />

                        <div className="grid gap-4 md:grid-cols-2">
                            <ImageUpload
                                label="Imagen de fondo — desktop (opcional)"
                                currentUrl={data.image}
                                onChange={setDesktopFile}
                            />
                            <ImageUpload
                                label="Imagen de fondo — mobile (opcional)"
                                currentUrl={data.image_mobile}
                                onChange={setMobileFile}
                                hint="Si la dejas vacía, se usa la imagen desktop."
                            />
                        </div>

                        <div className="flex items-center gap-3 pt-2">
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Guardando…' : 'Guardar cambios'}
                            </Button>
                            <p className="text-xs text-muted-foreground">
                                Guardar no activa el mantenimiento — usa el botón rojo de arriba para activar/desactivar.
                            </p>
                        </div>
                    </form>
                </section>
            </div>
        </AdminLayout>
    );
}

function ImageUpload({
    label, currentUrl, onChange, hint,
}: {
    label: string;
    currentUrl: string;
    onChange: (file: File | null) => void;
    hint?: string;
}) {
    const [picked, setPicked] = useState<File | null>(null);
    const previewUrl = picked ? URL.createObjectURL(picked) : currentUrl;

    return (
        <div className="grid gap-2">
            <Label>{label}</Label>
            {previewUrl ? (
                <img src={previewUrl} alt="" className="h-40 w-full rounded-lg object-cover" />
            ) : (
                <div className="flex h-40 w-full items-center justify-center rounded-lg border border-dashed text-xs text-muted-foreground">
                    Sin imagen
                </div>
            )}
            <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                    const f = e.target.files?.[0] ?? null;
                    setPicked(f);
                    onChange(f);
                }}
            />
            {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
        </div>
    );
}
