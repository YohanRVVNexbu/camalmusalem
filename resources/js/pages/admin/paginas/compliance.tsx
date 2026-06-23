import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Plus, X as XIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import AdminLayout from '@/layouts/admin-layout';

import {
    ResponsiveMediaField, SectionCard, SectionProp, TextField, TextareaField,
    VisibilityField, resetSection, submitSection,
} from './_section';

export default function CompliancePage({ sections }: { sections: Record<string, SectionProp> }) {
    const { flash } = usePage<{ flash: { success?: string } }>().props;
    const page = 'compliance';

    return (
        <AdminLayout breadcrumbs={[
            { title: 'Dashboard', href: '/admin' },
            { title: 'Páginas', href: '/admin/paginas' },
            { title: 'Compliance', href: '#' },
        ]}>
            <Head title="Admin — Compliance" />
            <div className="flex flex-col gap-4 p-4">
                <h1 className="text-2xl font-semibold">Compliance (legales)</h1>
                <p className="text-sm text-muted-foreground">
                    Página pública en <code>/compliance</code>. Aquí editas el hero, las descargas de manuales/políticas y los textos de los canales de denuncia.
                </p>
                {flash?.success && (
                    <div className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700">
                        {flash.success}
                    </div>
                )}

                <HeroSection page={page} s={sections['compliance_hero']} />
                <DescargasSection page={page} s={sections['compliance_descargas']} />
                <CanalesSection page={page} s={sections['compliance_canales']} />
            </div>
        </AdminLayout>
    );
}

function HeroSection({ page, s }: { page: string; s: SectionProp }) {
    const [data, setData] = useState(s.data);
    const [visible, setVisible] = useState(s.is_visible);
    const [desktopFile, setDesktopFile] = useState<File | null>(null);
    const [mobileFile, setMobileFile] = useState<File | null>(null);
    const [processing, setProcessing] = useState(false);
    const set = (k: string, v: any) => setData((d: any) => ({ ...d, [k]: v }));

    return (
        <SectionCard page={page} sectionKey="compliance_hero" label="Hero / cabecera" isVisible={visible}
            processing={processing}
            onSubmit={(e) => { e.preventDefault(); submitSection(page, 'compliance_hero', data, visible, { image: desktopFile, image_mobile: mobileFile }, setProcessing); }}
            onReset={() => resetSection(page, 'compliance_hero')}>
            <VisibilityField checked={visible} onChange={setVisible} />
            <Separator />
            <TextField label="Eyebrow (etiqueta arriba del título)" value={data.eyebrow ?? ''} onChange={(v) => set('eyebrow', v)} placeholder="Toyota Musalem" />
            <TextField label="Título" value={data.title ?? ''} onChange={(v) => set('title', v)} placeholder="Compliance" />
            <TextareaField label="Descripción" value={data.description ?? ''} onChange={(v) => set('description', v)} rows={4} />
            <ResponsiveMediaField
                label="Imagen del hero (opcional, se mostrará detrás del texto)"
                currentDesktopUrl={data.image ?? ''}
                currentMobileUrl={data.image_mobile ?? ''}
                onChangeDesktop={setDesktopFile}
                onChangeMobile={setMobileFile}
            />
        </SectionCard>
    );
}

function DescargasSection({ page, s }: { page: string; s: SectionProp }) {
    const [data, setData] = useState({
        heading: s.data.heading ?? '',
        description: s.data.description ?? '',
        items: (s.data.items ?? []) as Array<{ titulo: string; descripcion?: string; file?: string }>,
    });
    const [visible, setVisible] = useState(s.is_visible);
    const [files, setFiles] = useState<Record<number, File | null>>({});
    const [processing, setProcessing] = useState(false);

    const updateItem = (i: number, key: 'titulo' | 'descripcion', value: string) => {
        const items = [...data.items];
        items[i] = { ...items[i], [key]: value };
        setData({ ...data, items });
    };

    const addItem = () => setData({ ...data, items: [...data.items, { titulo: '', descripcion: '', file: '' }] });
    const removeItem = (i: number) => setData({ ...data, items: data.items.filter((_, idx) => idx !== i) });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        // OJO: la key del archivo va SIN el prefijo `data` (igual que el resto
        // de las secciones con ítems: pasos.i.img, members.i.img, items.i.img).
        // Con `data[items][i][file]` el backend lo guardaba en data.data.items[i]
        // y la página pública nunca lo veía (mostraba "Próximamente").
        const fileMap: Record<string, File | null> = {};
        Object.entries(files).forEach(([idx, f]) => {
            if (f) fileMap[`items[${idx}][file]`] = f;
        });
        submitSection(page, 'compliance_descargas', data, visible, fileMap, setProcessing);
    };

    return (
        <SectionCard page={page} sectionKey="compliance_descargas" label="Descargas (manuales y políticas)" isVisible={visible}
            processing={processing}
            onSubmit={submit}
            onReset={() => resetSection(page, 'compliance_descargas')}>
            <VisibilityField checked={visible} onChange={setVisible} />
            <Separator />
            <TextField label="Heading" value={data.heading} onChange={(v) => setData({ ...data, heading: v })} />
            <TextareaField label="Descripción" value={data.description} onChange={(v) => setData({ ...data, description: v })} rows={2} />
            <Separator />
            <div className="flex items-center justify-between">
                <h4 className="text-base font-semibold">Documentos</h4>
                <Button type="button" variant="outline" size="sm" onClick={addItem}>
                    <Plus className="mr-1 size-4" />Agregar documento
                </Button>
            </div>
            {data.items.length === 0 ? (
                <p className="text-sm text-muted-foreground">Aún no hay documentos.</p>
            ) : (
                <div className="flex flex-col gap-4">
                    {data.items.map((item, i) => (
                        <div key={i} className="rounded-lg border p-4">
                            <div className="mb-3 flex items-center justify-between">
                                <span className="text-sm font-medium">Documento {i + 1}</span>
                                <Button type="button" variant="ghost" size="icon" onClick={() => removeItem(i)} className="text-destructive">
                                    <XIcon className="size-4" />
                                </Button>
                            </div>
                            <div className="grid gap-3">
                                <TextField label="Título" value={item.titulo ?? ''} onChange={(v) => updateItem(i, 'titulo', v)} />
                                <TextField label="Descripción / sub-título" value={item.descripcion ?? ''} onChange={(v) => updateItem(i, 'descripcion', v)} />
                                <div className="grid gap-2">
                                    <Label>Archivo PDF</Label>
                                    {item.file && (
                                        <a href={item.file} target="_blank" rel="noopener noreferrer" className="text-xs text-primary underline">
                                            Ver archivo actual
                                        </a>
                                    )}
                                    <Input
                                        type="file"
                                        accept=".pdf"
                                        onChange={(e) => setFiles({ ...files, [i]: e.target.files?.[0] ?? null })}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </SectionCard>
    );
}

function CanalesSection({ page, s }: { page: string; s: SectionProp }) {
    const [data, setData] = useState({
        heading: s.data.heading ?? '',
        description: s.data.description ?? '',
        canales: (s.data.canales ?? []) as Array<{ titulo: string; descripcion?: string; button_label?: string; button_href?: string }>,
        seguimiento: s.data.seguimiento ?? { titulo: '', descripcion: '', button_label: '', button_href: '/compliance/seguimiento' },
    });
    const [visible, setVisible] = useState(s.is_visible);
    const [processing, setProcessing] = useState(false);

    const updateCanal = (i: number, key: string, value: string) => {
        const canales = [...data.canales];
        canales[i] = { ...canales[i], [key]: value };
        setData({ ...data, canales });
    };

    return (
        <SectionCard page={page} sectionKey="compliance_canales" label="Canales de denuncia" isVisible={visible}
            processing={processing}
            onSubmit={(e) => { e.preventDefault(); submitSection(page, 'compliance_canales', data, visible, {}, setProcessing); }}
            onReset={() => resetSection(page, 'compliance_canales')}>
            <VisibilityField checked={visible} onChange={setVisible} />
            <Separator />
            <TextField label="Heading" value={data.heading} onChange={(v) => setData({ ...data, heading: v })} />
            <TextareaField label="Descripción" value={data.description} onChange={(v) => setData({ ...data, description: v })} rows={2} />
            <Separator />
            <h4 className="text-base font-semibold">Canales</h4>
            {data.canales.map((canal, i) => (
                <div key={i} className="rounded-lg border p-4">
                    <span className="mb-3 block text-sm font-medium">Canal {i + 1}</span>
                    <div className="grid gap-3">
                        <TextField label="Título" value={canal.titulo ?? ''} onChange={(v) => updateCanal(i, 'titulo', v)} />
                        <TextareaField label="Descripción" value={canal.descripcion ?? ''} onChange={(v) => updateCanal(i, 'descripcion', v)} rows={2} />
                        <div className="grid grid-cols-2 gap-3">
                            <TextField label="Texto del botón" value={canal.button_label ?? ''} onChange={(v) => updateCanal(i, 'button_label', v)} />
                            <TextField label="URL del botón" value={canal.button_href ?? ''} onChange={(v) => updateCanal(i, 'button_href', v)} />
                        </div>
                    </div>
                </div>
            ))}
            <Separator />
            <h4 className="text-base font-semibold">Bloque de seguimiento</h4>
            <div className="grid gap-3 rounded-lg border p-4">
                <TextField label="Título" value={data.seguimiento.titulo ?? ''} onChange={(v) => setData({ ...data, seguimiento: { ...data.seguimiento, titulo: v } })} />
                <TextareaField label="Descripción" value={data.seguimiento.descripcion ?? ''} onChange={(v) => setData({ ...data, seguimiento: { ...data.seguimiento, descripcion: v } })} rows={2} />
                <div className="grid grid-cols-2 gap-3">
                    <TextField label="Texto del botón" value={data.seguimiento.button_label ?? ''} onChange={(v) => setData({ ...data, seguimiento: { ...data.seguimiento, button_label: v } })} />
                    <TextField label="URL del botón" value={data.seguimiento.button_href ?? ''} onChange={(v) => setData({ ...data, seguimiento: { ...data.seguimiento, button_href: v } })} />
                </div>
            </div>
        </SectionCard>
    );
}
