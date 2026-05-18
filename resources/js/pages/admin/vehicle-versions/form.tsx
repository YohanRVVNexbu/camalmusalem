import { Head, Link, router, usePage } from '@inertiajs/react';
import { Plus, Trash2, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import AdminLayout from '@/layouts/admin-layout';

type ModelLite = { id: number; name: string; brand_name: string };

type FeatureItem = { id: number; code: string; name_es: string; category: string };
type FeaturesByCategory = Record<string, FeatureItem[]>;

type Color = {
    id?: number;
    name: string;
    hex: string | null;
    type: string;
    is_available: boolean;
};

type VersionPayload = {
    id?: number;
    vehicle_model_id: number | null;
    trim_name: string;
    model_year: number;
    powertrain_type: string;
    drivetrain: string;
    transmission_type: string | null;
    transmission_speeds: number | null;
    msrp_clp: number | null;
    bono_marca: number | null;
    bono_financiamiento_r9: number | null;
    bono_financiamiento_tradicional: number | null;
    sales_code: string | null;
    material_code: string | null;
    option_code: string | null;
    description: string | null;
    is_active: boolean;
    display_order: number;
    hero_image: string | null;
    engine: Record<string, any> | null;
    electric: Record<string, any> | null;
    dimensions: Record<string, any> | null;
    capacities: Record<string, any> | null;
    performance: Record<string, any> | null;
    chassis: Record<string, any> | null;
    feature_ids: number[];
    colors: Color[];
};

type Enums = {
    powertrain: Record<string, string>;
    drivetrain: Record<string, string>;
    transmission: Record<string, string>;
    color_type: Record<string, string>;
    fuel_type: Record<string, string>;
    category_labels: Record<string, string>;
};

type Suggestions = {
    engine: Record<string, string[]>;
    electric: Record<string, string[]>;
    chassis: Record<string, string[]>;
    colors: Record<string, string[]>;
};

type Props = {
    version: VersionPayload | null;
    models: ModelLite[];
    features: FeaturesByCategory;
    enums: Enums;
    suggestions: Suggestions;
    prefill_model_id?: number | null;
};

type SectionKey = 'basico' | 'motor' | 'electrico' | 'dimensiones' | 'capacidades' | 'rendimiento' | 'chasis' | 'equipamiento' | 'colores';

const SECTIONS: { key: SectionKey; label: string }[] = [
    { key: 'basico', label: 'Datos básicos' },
    { key: 'motor', label: 'Motor' },
    { key: 'electrico', label: 'Eléctrico / Batería' },
    { key: 'dimensiones', label: 'Dimensiones' },
    { key: 'capacidades', label: 'Capacidades' },
    { key: 'rendimiento', label: 'Rendimiento' },
    { key: 'chasis', label: 'Chasis' },
    { key: 'equipamiento', label: 'Equipamiento' },
    { key: 'colores', label: 'Colores' },
];

const empty = (): VersionPayload => ({
    vehicle_model_id: null,
    trim_name: '',
    model_year: new Date().getFullYear(),
    powertrain_type: 'gasoline',
    drivetrain: 'fwd',
    transmission_type: null,
    transmission_speeds: null,
    msrp_clp: null,
    bono_marca: null,
    bono_financiamiento_r9: null,
    bono_financiamiento_tradicional: null,
    sales_code: null,
    material_code: null,
    option_code: null,
    description: null,
    is_active: true,
    display_order: 0,
    hero_image: null,
    engine: {}, electric: {}, dimensions: {}, capacities: {},
    performance: {}, chassis: {},
    feature_ids: [],
    colors: [],
});

export default function VehicleVersionForm({ version, models, features, enums, suggestions, prefill_model_id }: Props) {
    const { flash } = usePage<{ flash: { success?: string } }>().props;
    const isEdit = !!version?.id;

    const [data, setData] = useState<VersionPayload>(() => {
        if (!version) {
            const base = empty();
            if (prefill_model_id) base.vehicle_model_id = prefill_model_id;

            return base;
        }

        return {
            ...empty(),
            ...version,
            engine: version.engine ?? {},
            electric: version.electric ?? {},
            dimensions: version.dimensions ?? {},
            capacities: version.capacities ?? {},
            performance: version.performance ?? {},
            chassis: version.chassis ?? {},
            feature_ids: version.feature_ids ?? [],
            colors: version.colors ?? [],
        };
    });
    const [heroFile, setHeroFile] = useState<File | null>(null);
    const [removeHero, setRemoveHero] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [section, setSection] = useState<SectionKey>('basico');

    const showElectric = useMemo(
        () => ['hybrid', 'phev', 'bev'].includes(data.powertrain_type),
        [data.powertrain_type],
    );

    const setSatField = (sec: 'engine' | 'electric' | 'dimensions' | 'capacities' | 'performance' | 'chassis', field: string, value: any) => {
        setData({ ...data, [sec]: { ...(data[sec] ?? {}), [field]: value } });
    };

    const toggleFeature = (id: number) => {
        setData({
            ...data,
            feature_ids: data.feature_ids.includes(id)
                ? data.feature_ids.filter((i) => i !== id)
                : [...data.feature_ids, id],
        });
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        const fd = new FormData();
        fd.append('vehicle_model_id', String(data.vehicle_model_id ?? ''));
        fd.append('trim_name', data.trim_name);
        fd.append('model_year', String(data.model_year));
        fd.append('powertrain_type', data.powertrain_type);
        fd.append('drivetrain', data.drivetrain);
        if (data.transmission_type) fd.append('transmission_type', data.transmission_type);
        if (data.transmission_speeds) fd.append('transmission_speeds', String(data.transmission_speeds));
        if (data.msrp_clp) fd.append('msrp_clp', String(data.msrp_clp));
        if (data.bono_marca) fd.append('bono_marca', String(data.bono_marca));
        if (data.bono_financiamiento_r9) fd.append('bono_financiamiento_r9', String(data.bono_financiamiento_r9));
        if (data.bono_financiamiento_tradicional) fd.append('bono_financiamiento_tradicional', String(data.bono_financiamiento_tradicional));
        if (data.sales_code) fd.append('sales_code', data.sales_code);
        if (data.material_code) fd.append('material_code', data.material_code);
        if (data.option_code) fd.append('option_code', data.option_code);
        if (data.description) fd.append('description', data.description);
        fd.append('is_active', data.is_active ? '1' : '0');
        fd.append('display_order', String(data.display_order));

        (['engine', 'electric', 'dimensions', 'capacities', 'performance', 'chassis'] as const).forEach((sec) => {
            const payload = data[sec] ?? {};
            Object.entries(payload).forEach(([k, v]) => {
                if (v !== null && v !== undefined && v !== '') {
                    fd.append(`${sec}[${k}]`, String(v));
                }
            });
        });

        data.feature_ids.forEach((id) => fd.append('feature_ids[]', String(id)));

        data.colors.forEach((c, i) => {
            if (c.id) fd.append(`colors[${i}][id]`, String(c.id));
            fd.append(`colors[${i}][name]`, c.name);
            if (c.hex) fd.append(`colors[${i}][hex]`, c.hex);
            fd.append(`colors[${i}][type]`, c.type);
            fd.append(`colors[${i}][is_available]`, c.is_available ? '1' : '0');
        });

        if (heroFile) fd.append('hero_image', heroFile);
        if (removeHero && !heroFile) fd.append('hero_image_remove', '1');
        if (isEdit) fd.append('_method', 'PUT');

        router.post(
            isEdit ? `/admin/vehicle-versions/${version!.id}` : '/admin/vehicle-versions',
            fd,
            { forceFormData: true, onFinish: () => setProcessing(false) },
        );
    };

    // Generic helpers for satellite fields
    const Field = ({ label, value, onChange, type = 'text', placeholder, suggest }: any) => {
        const hasSuggest = Array.isArray(suggest) && suggest.length > 0;
        const listId = hasSuggest ? `dl-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined;
        return (
            <div className="grid gap-1.5">
                <Label className="text-xs">{label}</Label>
                <Input
                    type={type}
                    value={value ?? ''}
                    onChange={(e) => onChange(type === 'number' ? (e.target.value === '' ? null : Number(e.target.value)) : e.target.value || null)}
                    placeholder={placeholder}
                    list={listId}
                />
                {hasSuggest && (
                    <datalist id={listId}>
                        {suggest.map((s: string) => <option key={s} value={s} />)}
                    </datalist>
                )}
            </div>
        );
    };

    const SectionNav = () => (
        <div className="flex flex-wrap gap-1 border-b pb-2">
            {SECTIONS.map((s) => {
                if (s.key === 'electrico' && !showElectric) return null;
                return (
                    <Button
                        key={s.key}
                        type="button"
                        variant={section === s.key ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setSection(s.key)}
                    >
                        {s.label}
                    </Button>
                );
            })}
        </div>
    );

    return (
        <AdminLayout breadcrumbs={[
            { title: 'Dashboard', href: '/admin' },
            { title: 'Vehículos nuevos', href: '/admin/vehicle-models' },
            ...(data.vehicle_model_id ? [{
                title: models.find((m) => m.id === data.vehicle_model_id)?.name ?? 'Vehículo',
                href: `/admin/vehicle-models/${data.vehicle_model_id}/edit`,
            }] : []),
            { title: isEdit ? `Ficha: ${version?.trim_name ?? ''}` : 'Nueva ficha técnica', href: '#' },
        ]}>
            <Head title={`Admin — ${isEdit ? 'Editar' : 'Crear'} versión`} />
            <div className="flex flex-col gap-4 p-4 max-w-5xl">
                <h1 className="text-2xl font-semibold">{isEdit ? `Editar: ${version!.trim_name}` : 'Nueva versión'}</h1>

                {flash?.success && (
                    <div className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700">{flash.success}</div>
                )}

                <form onSubmit={submit} className="flex flex-col gap-5">
                    <SectionNav />

                    {section === 'basico' && (
                        <div className="grid gap-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-1.5">
                                    <Label>Modelo *</Label>
                                    <Select
                                        value={data.vehicle_model_id ? String(data.vehicle_model_id) : ''}
                                        onValueChange={(v) => setData({ ...data, vehicle_model_id: Number(v) })}
                                    >
                                        <SelectTrigger><SelectValue placeholder="Seleccionar modelo…" /></SelectTrigger>
                                        <SelectContent>
                                            {models.map((m) => (
                                                <SelectItem key={m.id} value={String(m.id)}>{m.brand_name} {m.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-1.5">
                                    <Label>Trim / Nombre versión *</Label>
                                    <Input value={data.trim_name} onChange={(e) => setData({ ...data, trim_name: e.target.value })} placeholder="Ej: SRV 4x4 2.8 AT" required />
                                </div>
                                <div className="grid gap-1.5">
                                    <Label>Año *</Label>
                                    <Input type="number" value={data.model_year} onChange={(e) => setData({ ...data, model_year: Number(e.target.value) })} required />
                                </div>
                                <div className="grid gap-1.5">
                                    <Label>Código ventas</Label>
                                    <Input value={data.sales_code ?? ''} onChange={(e) => setData({ ...data, sales_code: e.target.value || null })} placeholder="Opcional" />
                                </div>
                                <div className="grid gap-1.5">
                                    <Label>Material (key import)</Label>
                                    <Input value={data.material_code ?? ''} onChange={(e) => setData({ ...data, material_code: e.target.value || null })} placeholder="Ej: 70002066" />
                                    <p className="text-xs text-muted-foreground">Código numérico SAP. Key única del import masivo del Excel.</p>
                                </div>
                                <div className="grid gap-1.5">
                                    <Label>Opción (Salesforce)</Label>
                                    <Input value={data.option_code ?? ''} onChange={(e) => setData({ ...data, option_code: e.target.value || null })} placeholder="Ej: BZ4XLTD42-25PC" />
                                    <p className="text-xs text-muted-foreground">Código alfanumérico ("número antiguo de material") que viaja a Salesforce en cada cotización. Sin esto, la sincronización falla.</p>
                                </div>
                                <div className="grid gap-1.5">
                                    <Label>Propulsión *</Label>
                                    <Select value={data.powertrain_type} onValueChange={(v) => setData({ ...data, powertrain_type: v })}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {Object.entries(enums.powertrain).map(([k, l]) => (
                                                <SelectItem key={k} value={k}>{l}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-1.5">
                                    <Label>Tracción *</Label>
                                    <Select value={data.drivetrain} onValueChange={(v) => setData({ ...data, drivetrain: v })}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {Object.entries(enums.drivetrain).map(([k, l]) => (
                                                <SelectItem key={k} value={k}>{l}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-1.5">
                                    <Label>Transmisión</Label>
                                    <Select value={data.transmission_type ?? ''} onValueChange={(v) => setData({ ...data, transmission_type: v || null })}>
                                        <SelectTrigger><SelectValue placeholder="Seleccionar…" /></SelectTrigger>
                                        <SelectContent>
                                            {Object.entries(enums.transmission).map(([k, l]) => (
                                                <SelectItem key={k} value={k}>{l}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-1.5">
                                    <Label>N° velocidades</Label>
                                    <Input type="number" min={1} max={12} value={data.transmission_speeds ?? ''} onChange={(e) => setData({ ...data, transmission_speeds: e.target.value === '' ? null : Number(e.target.value) })} />
                                </div>
                                <div className="grid gap-1.5 col-span-2">
                                    <Label>Precio lista (CLP)</Label>
                                    <Input type="number" value={data.msrp_clp ?? ''} onChange={(e) => setData({ ...data, msrp_clp: e.target.value === '' ? null : Number(e.target.value) })} placeholder="Ej: 32990000" />
                                </div>
                                <div className="grid gap-1.5">
                                    <Label>Bono Marca (CLP)</Label>
                                    <Input type="number" value={data.bono_marca ?? ''} onChange={(e) => setData({ ...data, bono_marca: e.target.value === '' ? null : Number(e.target.value) })} placeholder="Ej: 1500000" />
                                </div>
                                <div className="grid gap-1.5">
                                    <Label>Bono Financiamiento R9 (CLP)</Label>
                                    <Input type="number" value={data.bono_financiamiento_r9 ?? ''} onChange={(e) => setData({ ...data, bono_financiamiento_r9: e.target.value === '' ? null : Number(e.target.value) })} placeholder="Ej: 800000" />
                                </div>
                                <div className="grid gap-1.5 col-span-2">
                                    <Label>Bono Financiamiento Tradicional (CLP)</Label>
                                    <Input type="number" value={data.bono_financiamiento_tradicional ?? ''} onChange={(e) => setData({ ...data, bono_financiamiento_tradicional: e.target.value === '' ? null : Number(e.target.value) })} placeholder="Ej: 500000" />
                                </div>
                                <div className="grid gap-1.5 col-span-4">
                                    <Label>Precios calculados</Label>
                                    <div className="rounded-md border bg-muted/40 px-3 py-2 text-xs text-muted-foreground space-y-0.5">
                                        {[
                                            { label: 'Precio Lista', val: data.msrp_clp },
                                            { label: 'Precio Bono Marca', val: data.msrp_clp && data.bono_marca ? data.msrp_clp - data.bono_marca : null },
                                            { label: 'Precio Bono R9', val: data.msrp_clp && data.bono_marca && data.bono_financiamiento_r9 ? data.msrp_clp - data.bono_marca - data.bono_financiamiento_r9 : null },
                                            { label: 'Precio Bono Financiamiento Trad.', val: data.msrp_clp && data.bono_marca && data.bono_financiamiento_tradicional ? data.msrp_clp - data.bono_marca - data.bono_financiamiento_tradicional : null },
                                        ].map(r => r.val !== null && r.val !== undefined ? (
                                            <div key={r.label} className="flex justify-between"><span>{r.label}</span><span className="font-medium text-foreground">${r.val.toLocaleString('es-CL')}</span></div>
                                        ) : null)}
                                    </div>
                                </div>
                                <div className="grid gap-1.5 col-span-2">
                                    <Label>Descripción</Label>
                                    <Textarea rows={3} value={data.description ?? ''} onChange={(e) => setData({ ...data, description: e.target.value || null })} />
                                </div>
                                <div className="grid gap-1.5">
                                    <Label>Orden</Label>
                                    <Input type="number" value={data.display_order} onChange={(e) => setData({ ...data, display_order: Number(e.target.value) })} />
                                </div>
                                <div className="flex items-center gap-3 pt-5">
                                    <Checkbox id="is_active" checked={data.is_active} onCheckedChange={(v) => setData({ ...data, is_active: !!v })} />
                                    <Label htmlFor="is_active">Activa</Label>
                                </div>
                            </div>

                            <div className="grid gap-1.5">
                                <Label>Imagen hero de la versión</Label>
                                {heroFile ? (
                                    <div className="relative w-fit">
                                        <img src={URL.createObjectURL(heroFile)} className="h-32 w-auto rounded-lg object-cover" alt="" />
                                        <button type="button" onClick={() => setHeroFile(null)} className="absolute -right-2 -top-2 flex size-6 items-center justify-center rounded-full bg-destructive text-white" title="Quitar selección">
                                            <X className="size-3.5" />
                                        </button>
                                    </div>
                                ) : data.hero_image && !removeHero ? (
                                    <div className="relative w-fit">
                                        <img src={data.hero_image} className="h-32 w-auto rounded-lg object-cover" alt="" />
                                        <button type="button" onClick={() => setRemoveHero(true)} className="absolute -right-2 -top-2 flex size-6 items-center justify-center rounded-full bg-destructive text-white" title="Eliminar imagen">
                                            <X className="size-3.5" />
                                        </button>
                                    </div>
                                ) : removeHero ? (
                                    <p className="text-sm text-destructive">Imagen marcada para eliminar al guardar.{' '}
                                        <button type="button" className="underline" onClick={() => setRemoveHero(false)}>Cancelar</button>
                                    </p>
                                ) : null}
                                <Input type="file" accept="image/*" onChange={(e) => { setHeroFile(e.target.files?.[0] ?? null); setRemoveHero(false); }} />
                            </div>
                        </div>
                    )}

                    {section === 'motor' && (
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                            <Field label="Código motor" value={data.engine?.engine_code} onChange={(v: any) => setSatField('engine', 'engine_code', v)} placeholder="Ej: 1GD-FTV" suggest={suggestions.engine.engine_code} />
                            <Field label="N° cilindros" type="number" value={data.engine?.cylinders} onChange={(v: any) => setSatField('engine', 'cylinders', v)} />
                            <Field label="Configuración" value={data.engine?.layout} onChange={(v: any) => setSatField('engine', 'layout', v)} placeholder="Ej: en línea" suggest={suggestions.engine.layout} />
                            <Field label="Cilindrada (cc)" type="number" value={data.engine?.displacement_cc} onChange={(v: any) => setSatField('engine', 'displacement_cc', v)} />
                            <Field label="Relación compresión" value={data.engine?.compression_ratio} onChange={(v: any) => setSatField('engine', 'compression_ratio', v)} placeholder="Ej: 15.6:1" suggest={suggestions.engine.compression_ratio} />
                            <Field label="Alimentación" value={data.engine?.fuel_system} onChange={(v: any) => setSatField('engine', 'fuel_system', v)} placeholder="Ej: Common-Rail Turbo" suggest={suggestions.engine.fuel_system} />
                            <Field label="Potencia (HP)" type="number" value={data.engine?.hp} onChange={(v: any) => setSatField('engine', 'hp', v)} />
                            <Field label="Potencia @ RPM" type="number" value={data.engine?.hp_rpm} onChange={(v: any) => setSatField('engine', 'hp_rpm', v)} />
                            <Field label="Torque (Nm)" type="number" value={data.engine?.torque_nm} onChange={(v: any) => setSatField('engine', 'torque_nm', v)} />
                            <Field label="Torque RPM min" type="number" value={data.engine?.torque_rpm_min} onChange={(v: any) => setSatField('engine', 'torque_rpm_min', v)} />
                            <Field label="Torque RPM max" type="number" value={data.engine?.torque_rpm_max} onChange={(v: any) => setSatField('engine', 'torque_rpm_max', v)} />
                            <div className="grid gap-1.5">
                                <Label className="text-xs">Combustible</Label>
                                <Select value={data.engine?.fuel_type ?? ''} onValueChange={(v) => setSatField('engine', 'fuel_type', v || null)}>
                                    <SelectTrigger><SelectValue placeholder="—" /></SelectTrigger>
                                    <SelectContent>
                                        {Object.entries(enums.fuel_type).map(([k, l]) => (
                                            <SelectItem key={k} value={k}>{l}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <Field label="Norma emisiones" value={data.engine?.emissions_standard} onChange={(v: any) => setSatField('engine', 'emissions_standard', v)} placeholder="Ej: Euro 5" suggest={suggestions.engine.emissions_standard} />
                            <Field label="Octanaje recomendado" value={data.engine?.octane_recommended} onChange={(v: any) => setSatField('engine', 'octane_recommended', v)} />
                        </div>
                    )}

                    {section === 'electrico' && showElectric && (
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                            <Field label="Tipo motor eléctrico" value={data.electric?.motor_type} onChange={(v: any) => setSatField('electric', 'motor_type', v)} suggest={suggestions.electric.motor_type} />
                            <Field label="Motor delantero (kW)" type="number" value={data.electric?.motor_front_kw} onChange={(v: any) => setSatField('electric', 'motor_front_kw', v)} />
                            <Field label="Motor trasero (kW)" type="number" value={data.electric?.motor_rear_kw} onChange={(v: any) => setSatField('electric', 'motor_rear_kw', v)} />
                            <Field label="Potencia combinada (kW)" type="number" value={data.electric?.combined_kw} onChange={(v: any) => setSatField('electric', 'combined_kw', v)} />
                            <Field label="Potencia combinada (HP)" type="number" value={data.electric?.combined_hp} onChange={(v: any) => setSatField('electric', 'combined_hp', v)} />
                            <Field label="Torque combinado (Nm)" type="number" value={data.electric?.combined_torque_nm} onChange={(v: any) => setSatField('electric', 'combined_torque_nm', v)} />
                            <Field label="Tipo batería" value={data.electric?.battery_type} onChange={(v: any) => setSatField('electric', 'battery_type', v)} placeholder="Li-ion" suggest={suggestions.electric.battery_type} />
                            <Field label="Capacidad batería (kWh)" type="number" value={data.electric?.battery_kwh} onChange={(v: any) => setSatField('electric', 'battery_kwh', v)} />
                            <Field label="Celdas" type="number" value={data.electric?.battery_cells} onChange={(v: any) => setSatField('electric', 'battery_cells', v)} />
                            <Field label="Voltaje (V)" type="number" value={data.electric?.battery_voltage} onChange={(v: any) => setSatField('electric', 'battery_voltage', v)} />
                            <Field label="Autonomía WLTC (km)" type="number" value={data.electric?.range_wltc_km} onChange={(v: any) => setSatField('electric', 'range_wltc_km', v)} />
                            <Field label="Carga AC (kW)" type="number" value={data.electric?.ac_charge_kw} onChange={(v: any) => setSatField('electric', 'ac_charge_kw', v)} />
                            <Field label="Carga DC (kW)" type="number" value={data.electric?.dc_charge_kw} onChange={(v: any) => setSatField('electric', 'dc_charge_kw', v)} />
                            <Field label="Tiempo carga AC (min)" type="number" value={data.electric?.ac_charge_minutes} onChange={(v: any) => setSatField('electric', 'ac_charge_minutes', v)} />
                            <Field label="Tiempo carga DC (min)" type="number" value={data.electric?.dc_charge_minutes} onChange={(v: any) => setSatField('electric', 'dc_charge_minutes', v)} />
                            <Field label="Conector carga" value={data.electric?.charge_connector} onChange={(v: any) => setSatField('electric', 'charge_connector', v)} placeholder="Tipo 2 CCS2" suggest={suggestions.electric.charge_connector} />
                        </div>
                    )}

                    {section === 'dimensiones' && (
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                            <Field label="Largo (mm)" type="number" value={data.dimensions?.length_mm} onChange={(v: any) => setSatField('dimensions', 'length_mm', v)} />
                            <Field label="Ancho (mm)" type="number" value={data.dimensions?.width_mm} onChange={(v: any) => setSatField('dimensions', 'width_mm', v)} />
                            <Field label="Alto (mm)" type="number" value={data.dimensions?.height_mm} onChange={(v: any) => setSatField('dimensions', 'height_mm', v)} />
                            <Field label="Distancia ejes (mm)" type="number" value={data.dimensions?.wheelbase_mm} onChange={(v: any) => setSatField('dimensions', 'wheelbase_mm', v)} />
                            <Field label="Despeje (mm)" type="number" value={data.dimensions?.ground_clearance_mm} onChange={(v: any) => setSatField('dimensions', 'ground_clearance_mm', v)} />
                            <Field label="Ángulo ataque (°)" type="number" value={data.dimensions?.approach_angle} onChange={(v: any) => setSatField('dimensions', 'approach_angle', v)} />
                            <Field label="Ángulo salida (°)" type="number" value={data.dimensions?.departure_angle} onChange={(v: any) => setSatField('dimensions', 'departure_angle', v)} />
                            <Field label="Ángulo ventral (°)" type="number" value={data.dimensions?.breakover_angle} onChange={(v: any) => setSatField('dimensions', 'breakover_angle', v)} />
                            <Field label="Vadeo (mm)" type="number" value={data.dimensions?.wading_mm} onChange={(v: any) => setSatField('dimensions', 'wading_mm', v)} />
                            <Field label="Coef. aerodinámico" type="number" value={data.dimensions?.drag_coefficient} onChange={(v: any) => setSatField('dimensions', 'drag_coefficient', v)} placeholder="Ej: 0.28" />
                            <Field label="Radio de giro (mm)" type="number" value={data.dimensions?.turning_radius_mm} onChange={(v: any) => setSatField('dimensions', 'turning_radius_mm', v)} />
                        </div>
                    )}

                    {section === 'capacidades' && (
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                            <Field label="Peso bruto (kg)" type="number" value={data.capacities?.gvwr_kg} onChange={(v: any) => setSatField('capacities', 'gvwr_kg', v)} />
                            <Field label="Peso en vacío (kg)" type="number" value={data.capacities?.curb_weight_kg} onChange={(v: any) => setSatField('capacities', 'curb_weight_kg', v)} />
                            <Field label="N° asientos" type="number" value={data.capacities?.seats} onChange={(v: any) => setSatField('capacities', 'seats', v)} />
                            <Field label="N° filas de asientos" type="number" value={data.capacities?.seat_rows} onChange={(v: any) => setSatField('capacities', 'seat_rows', v)} />
                            <Field label="Maletero (L)" type="number" value={data.capacities?.trunk_l} onChange={(v: any) => setSatField('capacities', 'trunk_l', v)} />
                            <Field label="Estanque combustible (L)" type="number" value={data.capacities?.fuel_tank_l} onChange={(v: any) => setSatField('capacities', 'fuel_tank_l', v)} />
                            <Field label="Estanque UREA (L)" type="number" value={data.capacities?.urea_tank_l} onChange={(v: any) => setSatField('capacities', 'urea_tank_l', v)} />
                            <Field label="Remolque con freno (kg)" type="number" value={data.capacities?.towing_braked_kg} onChange={(v: any) => setSatField('capacities', 'towing_braked_kg', v)} />
                            <Field label="Remolque sin freno (kg)" type="number" value={data.capacities?.towing_unbraked_kg} onChange={(v: any) => setSatField('capacities', 'towing_unbraked_kg', v)} />
                            <Field label="Carga útil (kg)" type="number" value={data.capacities?.payload_kg} onChange={(v: any) => setSatField('capacities', 'payload_kg', v)} />
                        </div>
                    )}

                    {section === 'rendimiento' && (
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                            <Field label="Consumo ciudad (km/l)" type="number" value={data.performance?.city_kml} onChange={(v: any) => setSatField('performance', 'city_kml', v)} />
                            <Field label="Consumo carretera (km/l)" type="number" value={data.performance?.highway_kml} onChange={(v: any) => setSatField('performance', 'highway_kml', v)} />
                            <Field label="Consumo mixto (km/l)" type="number" value={data.performance?.combined_kml} onChange={(v: any) => setSatField('performance', 'combined_kml', v)} />
                            <Field label="Emisiones CO₂ (g/km)" type="number" value={data.performance?.co2_gkm} onChange={(v: any) => setSatField('performance', 'co2_gkm', v)} />
                            <Field label="0-100 km/h (s)" type="number" value={data.performance?.acceleration_0_100_s} onChange={(v: any) => setSatField('performance', 'acceleration_0_100_s', v)} />
                            <Field label="Velocidad máxima (km/h)" type="number" value={data.performance?.top_speed_kmh} onChange={(v: any) => setSatField('performance', 'top_speed_kmh', v)} />
                            <Field label="Etiqueta eficiencia" value={data.performance?.energy_efficiency_label} onChange={(v: any) => setSatField('performance', 'energy_efficiency_label', v)} placeholder="A, B, C…" />
                            <Field label="Código informe 3CV" value={data.performance?.report_code} onChange={(v: any) => setSatField('performance', 'report_code', v)} />
                        </div>
                    )}

                    {section === 'chasis' && (
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                            <Field label="Dirección" value={data.chassis?.steering_type} onChange={(v: any) => setSatField('chassis', 'steering_type', v)} placeholder="Asistida eléctrica" suggest={suggestions.chassis.steering_type} />
                            <Field label="Suspensión delantera" value={data.chassis?.front_suspension} onChange={(v: any) => setSatField('chassis', 'front_suspension', v)} suggest={suggestions.chassis.front_suspension} />
                            <Field label="Suspensión trasera" value={data.chassis?.rear_suspension} onChange={(v: any) => setSatField('chassis', 'rear_suspension', v)} suggest={suggestions.chassis.rear_suspension} />
                            <Field label="Frenos delanteros" value={data.chassis?.front_brakes} onChange={(v: any) => setSatField('chassis', 'front_brakes', v)} suggest={suggestions.chassis.front_brakes} />
                            <Field label="Frenos traseros" value={data.chassis?.rear_brakes} onChange={(v: any) => setSatField('chassis', 'rear_brakes', v)} suggest={suggestions.chassis.rear_brakes} />
                            <Field label="Freno estacionamiento" value={data.chassis?.parking_brake} onChange={(v: any) => setSatField('chassis', 'parking_brake', v)} suggest={suggestions.chassis.parking_brake} />
                            <Field label="Neumático delantero" value={data.chassis?.front_tire} onChange={(v: any) => setSatField('chassis', 'front_tire', v)} placeholder="265/65R17" suggest={suggestions.chassis.front_tire} />
                            <Field label="Neumático trasero" value={data.chassis?.rear_tire} onChange={(v: any) => setSatField('chassis', 'rear_tire', v)} suggest={suggestions.chassis.rear_tire} />
                            <Field label="Tamaño llanta (pulg.)" type="number" value={data.chassis?.wheel_size_in} onChange={(v: any) => setSatField('chassis', 'wheel_size_in', v)} />
                            <Field label="Material llanta" value={data.chassis?.wheel_material} onChange={(v: any) => setSatField('chassis', 'wheel_material', v)} placeholder="aleación" suggest={suggestions.chassis.wheel_material} />
                        </div>
                    )}

                    {section === 'equipamiento' && (
                        <div className="grid gap-4">
                            <div className="text-sm text-muted-foreground">
                                Marca las características que trae esta versión. Si falta alguna, créala en <Link href="/admin/features" className="underline">Equipamiento</Link>.
                                <span className="ml-2 font-medium">{data.feature_ids.length} seleccionadas</span>
                            </div>
                            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                                {Object.keys(features).map((cat) => (
                                    <div key={cat} className="rounded-lg border p-3">
                                        <div className="text-xs font-semibold uppercase text-muted-foreground mb-2">
                                            {enums.category_labels[cat] ?? cat}
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            {features[cat].map((f) => (
                                                <label key={f.id} className="flex cursor-pointer items-start gap-2 text-sm">
                                                    <Checkbox
                                                        checked={data.feature_ids.includes(f.id)}
                                                        onCheckedChange={() => toggleFeature(f.id)}
                                                    />
                                                    <span>{f.name_es}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {section === 'colores' && (
                        <div className="grid gap-3">
                            <div className="flex items-center justify-between">
                                <Label className="font-semibold">Colores disponibles ({data.colors.length})</Label>
                                <Button type="button" variant="outline" size="sm" onClick={() => setData({ ...data, colors: [...data.colors, { name: '', hex: '#FFFFFF', type: 'solid', is_available: true }] })}>
                                    <Plus className="size-3 mr-1" /> Agregar color
                                </Button>
                            </div>
                            {data.colors.length === 0 && (
                                <div className="rounded-md border border-dashed p-4 text-center text-sm text-muted-foreground">
                                    Sin colores. Agrega al menos uno.
                                </div>
                            )}
                            {data.colors.map((c, i) => (
                                <div key={i} className="grid grid-cols-[1fr_160px_160px_100px_40px] gap-2 items-end">
                                    <div className="grid gap-1.5">
                                        <Label className="text-xs">Nombre</Label>
                                        <Input
                                            value={c.name}
                                            onChange={(e) => {
                                                const colors = [...data.colors];
                                                colors[i] = { ...colors[i], name: e.target.value };
                                                setData({ ...data, colors });
                                            }}
                                            placeholder="Ej: Blanco Perla"
                                            list="dl-color-name"
                                        />
                                        <datalist id="dl-color-name">
                                            {suggestions.colors.name.map((s) => <option key={s} value={s} />)}
                                        </datalist>
                                    </div>
                                    <div className="grid gap-1.5">
                                        <Label className="text-xs">Hex</Label>
                                        <div className="flex gap-1">
                                            <Input
                                                type="color"
                                                value={c.hex ?? '#FFFFFF'}
                                                onChange={(e) => {
                                                    const colors = [...data.colors];
                                                    colors[i] = { ...colors[i], hex: e.target.value };
                                                    setData({ ...data, colors });
                                                }}
                                                className="w-12 p-1"
                                            />
                                            <Input
                                                value={c.hex ?? ''}
                                                onChange={(e) => {
                                                    const colors = [...data.colors];
                                                    colors[i] = { ...colors[i], hex: e.target.value || null };
                                                    setData({ ...data, colors });
                                                }}
                                                className="font-mono text-xs"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid gap-1.5">
                                        <Label className="text-xs">Tipo</Label>
                                        <Select
                                            value={c.type}
                                            onValueChange={(v) => {
                                                const colors = [...data.colors];
                                                colors[i] = { ...colors[i], type: v };
                                                setData({ ...data, colors });
                                            }}
                                        >
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                {Object.entries(enums.color_type).map(([k, l]) => (
                                                    <SelectItem key={k} value={k}>{l}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="flex items-center gap-2 pb-2">
                                        <Checkbox
                                            checked={c.is_available}
                                            onCheckedChange={(v) => {
                                                const colors = [...data.colors];
                                                colors[i] = { ...colors[i], is_available: !!v };
                                                setData({ ...data, colors });
                                            }}
                                        />
                                        <Label className="text-xs">Disponible</Label>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setData({ ...data, colors: data.colors.filter((_, j) => j !== i) })}
                                    >
                                        <Trash2 className="size-4 text-destructive" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}

                    <Separator />

                    <div className="flex gap-3">
                        <Button type="submit" disabled={processing || !data.vehicle_model_id || !data.trim_name}>
                            {processing ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear versión'}
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/admin/vehicle-versions">Cancelar</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
