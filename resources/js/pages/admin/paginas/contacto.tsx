import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Plus, X as XIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import AdminLayout from '@/layouts/admin-layout';
import {
    ResponsiveMediaField, SectionCard, SectionProp, TextField,
    VisibilityField, resetSection, submitSection,
} from './_section';
import defaultFormImg from '@images/contacto/form_image.png?format=webp';

type HorarioItem = { label: string; value: string };

/**
 * Normaliza data antigua (`{horario_lv, horario_sab}`) al nuevo shape
 * (`{horarios: HorarioItem[]}`) para que el admin no se rompa si la
 * migración no se aplicó.
 */
function normalizeHorarios(raw: any): HorarioItem[] {
    if (raw && Array.isArray(raw.horarios)) {
        return raw.horarios.map((h: any) => ({
            label: String(h?.label ?? ''),
            value: String(h?.value ?? ''),
        }));
    }
    const legacy: HorarioItem[] = [];
    if (raw?.horario_lv) legacy.push({ label: 'Lunes a Viernes', value: String(raw.horario_lv) });
    if (raw?.horario_sab) legacy.push({ label: 'Sábado / Domingo', value: String(raw.horario_sab) });
    return legacy;
}

export default function ContactoPage({ sections }: { sections: Record<string, SectionProp> }) {
    const { flash } = usePage<{ flash: { success?: string } }>().props;
    const page = 'contacto';

    return (
        <AdminLayout breadcrumbs={[
            { title: 'Dashboard', href: '/admin' },
            { title: 'Páginas', href: '/admin/paginas' },
            { title: 'Contacto', href: '#' },
        ]}>
            <Head title="Admin — Contacto" />
            <div className="flex flex-col gap-4 p-4">
                <h1 className="text-2xl font-semibold">Contacto</h1>
                {flash?.success && (
                    <div className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700">
                        {flash.success}
                    </div>
                )}
                <ContactoInfoSection page={page} s={sections['contacto_info']} />
            </div>
        </AdminLayout>
    );
}

function ContactoInfoSection({ page, s }: { page: string; s: SectionProp }) {
    const [data, setData] = useState({
        ...s.data,
        horarios: normalizeHorarios(s.data),
    });
    const [visible, setVisible] = useState(s.is_visible);
    const [desktopFile, setDesktopFile] = useState<File | null>(null);
    const [mobileFile, setMobileFile] = useState<File | null>(null);
    const [processing, setProcessing] = useState(false);
    const set = (k: string, v: any) => setData((d: any) => ({ ...d, [k]: v }));

    const updateHorario = (i: number, patch: Partial<HorarioItem>) => {
        const next: HorarioItem[] = [...data.horarios];
        next[i] = { ...next[i], ...patch };
        set('horarios', next);
    };
    const addHorario = () => set('horarios', [...data.horarios, { label: '', value: '' }]);
    const removeHorario = (i: number) => set('horarios', data.horarios.filter((_: HorarioItem, j: number) => j !== i));

    return (
        <SectionCard
            page={page}
            sectionKey="contacto_info"
            label="Información y formulario"
            isVisible={visible}
            processing={processing}
            onSubmit={(e) => {
                e.preventDefault();
                submitSection(page, 'contacto_info', data, visible, { form_image: desktopFile, form_image_mobile: mobileFile }, setProcessing);
            }}
            onReset={() => resetSection(page, 'contacto_info')}
        >
            <VisibilityField checked={visible} onChange={setVisible} />
            <Separator />
            <ResponsiveMediaField
                label="Imagen lateral (formulario)"
                currentDesktopUrl={data.form_image ?? ''}
                currentMobileUrl={data.form_image_mobile ?? ''}
                defaultDesktopUrl={defaultFormImg}
                onChangeDesktop={setDesktopFile}
                onChangeMobile={setMobileFile}
            />

            <Separator />
            <div className="flex items-center justify-between">
                <div>
                    <h4 className="text-base font-semibold">Horarios de atención</h4>
                    <p className="text-xs text-muted-foreground">
                        Lista editable. Estos horarios se muestran en <code>/contacto</code>,
                        en agendamiento de mantención y en el formulario de repuestos.
                    </p>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={addHorario}>
                    <Plus className="mr-1 size-4" /> Agregar horario
                </Button>
            </div>
            {data.horarios.length === 0 ? (
                <p className="text-sm text-muted-foreground">Aún no hay horarios. Agregá al menos uno.</p>
            ) : (
                <div className="flex flex-col gap-3">
                    {data.horarios.map((h: HorarioItem, i: number) => (
                        <div key={i} className="grid grid-cols-[1fr_2fr_auto] gap-3 items-end">
                            <div className="grid gap-2">
                                <Label className="text-xs">Etiqueta</Label>
                                <Input
                                    value={h.label}
                                    onChange={(e) => updateHorario(i, { label: e.target.value })}
                                    placeholder="Ej: Lunes a Jueves"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label className="text-xs">Horario</Label>
                                <Input
                                    value={h.value}
                                    onChange={(e) => updateHorario(i, { value: e.target.value })}
                                    placeholder="09:00 a 13:30 - 14:45 a 18:30"
                                />
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeHorario(i)}
                                className="text-destructive hover:text-destructive"
                                title="Quitar horario"
                            >
                                <XIcon className="size-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            )}

            <Separator />
            <TextField label="Correo electrónico" value={data.email ?? ''} onChange={(v) => set('email', v)} />

            <Separator />
            <p className="text-sm font-medium text-muted-foreground">Textos del formulario</p>
            <TextField label="Título del formulario" value={data.form_title ?? ''} onChange={(v) => set('form_title', v)} />
            <TextField label="Subtítulo" value={data.form_subtitle ?? ''} onChange={(v) => set('form_subtitle', v)} />
            <TextField label="Descripción" value={data.form_desc ?? ''} onChange={(v) => set('form_desc', v)} />
        </SectionCard>
    );
}
