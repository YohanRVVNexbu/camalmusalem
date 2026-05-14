import { Head, usePage } from '@inertiajs/react';
import { Zap } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import AdminLayout from '@/layouts/admin-layout';
import { ImageField, ResponsiveMediaField, SectionCard, SectionProp, TextField, TextareaField, VisibilityField, resetSection, submitSection } from './_section';

type VehicleLite = {
    id: number;
    name: string;
    brand_name: string;
    hero_image: string | null;
    is_electric: boolean;
};

type HeroCard = {
    vehicle_model_id: number | null;
    image_override: string | null;
    show_electric_badge: 'auto' | 'on' | 'off';
};

type Props = {
    sections: Record<string, SectionProp>;
    vehicle_models: VehicleLite[];
};

export default function NuevosPage({ sections, vehicle_models }: Props) {
    const { flash } = usePage<{ flash: { success?: string } }>().props;
    const page = 'nuevos';
    const s = sections['nuevos_page'];

    const initial = useMemo(() => {
        const cards: HeroCard[] = (s.data?.hero_cards ?? []).slice(0, 4);
        while (cards.length < 4) {
            cards.push({ vehicle_model_id: null, image_override: null, show_electric_badge: 'auto' });
        }

        return { ...s.data, hero_cards: cards };
    }, [s.data]);

    const [data, setData] = useState<any>(initial);
    const [visible, setVisible] = useState(s.is_visible);
    const [bannerFile, setBannerFile] = useState<File | null>(null);
    const [bannerMobileFile, setBannerMobileFile] = useState<File | null>(null);
    const [cardImages, setCardImages] = useState<Record<number, File | null>>({});
    const [processing, setProcessing] = useState(false);

    const set = (k: string, v: any) => setData((d: any) => ({ ...d, [k]: v }));

    const updateCard = (i: number, patch: Partial<HeroCard>) => {
        const cards = [...(data.hero_cards ?? [])];
        cards[i] = { ...cards[i], ...patch };
        set('hero_cards', cards);
    };

    const resolveVehicle = (id: number | null) => vehicle_models.find((m) => m.id === id) ?? null;

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const files: Record<string, File | null> = {
            banner_image: bannerFile,
            banner_image_mobile: bannerMobileFile,
        };
        Object.entries(cardImages).forEach(([idx, file]) => {
            files[`hero_cards.${idx}.image_override`] = file;
        });

        submitSection(page, 'nuevos_page', data, visible, files, setProcessing);
    };

    return (
        <AdminLayout breadcrumbs={[
            { title: 'Dashboard', href: '/admin' },
            { title: 'Páginas', href: '/admin/paginas' },
            { title: 'Vehículos Nuevos', href: '#' },
        ]}>
            <Head title="Admin — Vehículos Nuevos (landing)" />
            <div className="flex flex-col gap-4 p-4">
                <h1 className="text-2xl font-semibold">Vehículos Nuevos — Landing</h1>
                {flash?.success && (
                    <div className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700">{flash.success}</div>
                )}

                <SectionCard
                    page={page}
                    sectionKey="nuevos_page"
                    label="Landing de vehículos nuevos"
                    isVisible={visible}
                    processing={processing}
                    onSubmit={onSubmit}
                    onReset={() => resetSection(page, 'nuevos_page')}
                >
                    <VisibilityField checked={visible} onChange={setVisible} />
                    <Separator />

                    {/* Banner */}
                    <ResponsiveMediaField
                        label="Banner (imagen o video)"
                        currentDesktopUrl={data.banner_image ?? ''}
                        currentMobileUrl={data.banner_image_mobile ?? ''}
                        onChangeDesktop={setBannerFile}
                        onChangeMobile={setBannerMobileFile}
                    />
                    <TextField label="Título" value={data.title ?? ''} onChange={(v) => set('title', v)} />
                    <TextareaField label="Descripción" value={data.description ?? ''} onChange={(v) => set('description', v)} rows={3} />

                    <Separator />

                    {/* Hero cards */}
                    <div className="grid gap-3">
                        <div>
                            <Label className="text-sm font-semibold">Tarjetas destacadas ("Cotiza tu Toyota 0 KM")</Label>
                            <p className="text-xs text-muted-foreground">4 slots visibles al entrar a la landing. Elige qué vehículo mostrar en cada uno. Si dejas el slot vacío, no se muestra.</p>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            {(data.hero_cards ?? []).map((card: HeroCard, i: number) => {
                                const vehicle = resolveVehicle(card.vehicle_model_id);
                                const previewImage = cardImages[i]
                                    ? URL.createObjectURL(cardImages[i] as File)
                                    : (card.image_override || vehicle?.hero_image || '');

                                return (
                                    <div key={i} className="rounded-lg border p-3 flex flex-col gap-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-semibold text-muted-foreground">Slot #{i + 1}</span>
                                            {vehicle && (
                                                <span className="text-xs text-muted-foreground">{vehicle.brand_name} {vehicle.name}</span>
                                            )}
                                        </div>

                                        {/* Preview */}
                                        <div className="relative h-36 overflow-hidden rounded-md bg-muted flex items-center justify-center">
                                            {previewImage ? (
                                                <img src={previewImage} alt="" className="h-full w-full object-cover" />
                                            ) : (
                                                <span className="text-xs text-muted-foreground">Sin imagen</span>
                                            )}
                                            {(card.show_electric_badge === 'on' || (card.show_electric_badge === 'auto' && vehicle?.is_electric)) && (
                                                <span className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-xs text-white">
                                                    <Zap className="size-3" /> 100% Eléctrico
                                                </span>
                                            )}
                                        </div>

                                        {/* Vehicle picker */}
                                        <div className="grid gap-1.5">
                                            <Label className="text-xs">Vehículo</Label>
                                            <Select
                                                value={card.vehicle_model_id ? String(card.vehicle_model_id) : 'none'}
                                                onValueChange={(v) => updateCard(i, { vehicle_model_id: v === 'none' ? null : Number(v) })}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="— Ninguno —" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="none">— Ninguno (slot vacío) —</SelectItem>
                                                    {vehicle_models.map((m) => (
                                                        <SelectItem key={m.id} value={String(m.id)}>
                                                            {m.brand_name} {m.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Custom image override */}
                                        <div className="grid gap-1.5">
                                            <Label className="text-xs">Imagen personalizada (opcional)</Label>
                                            <Input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => setCardImages({ ...cardImages, [i]: e.target.files?.[0] ?? null })}
                                            />
                                            {card.image_override && !cardImages[i] && (
                                                <div className="text-xs text-muted-foreground">
                                                    Imagen actual sobrescrita.
                                                    <button
                                                        type="button"
                                                        className="ml-2 underline"
                                                        onClick={() => updateCard(i, { image_override: null })}
                                                    >Quitar override (usar imagen del modelo)</button>
                                                </div>
                                            )}
                                            {!card.image_override && vehicle?.hero_image && (
                                                <p className="text-xs text-muted-foreground">Se usa la imagen del modelo por defecto.</p>
                                            )}
                                        </div>

                                        {/* Electric badge */}
                                        <div className="grid gap-1.5">
                                            <Label className="text-xs">Badge "100% Eléctrico"</Label>
                                            <Select
                                                value={card.show_electric_badge}
                                                onValueChange={(v) => updateCard(i, { show_electric_badge: v as HeroCard['show_electric_badge'] })}
                                            >
                                                <SelectTrigger><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="auto">Automático (si es eléctrico)</SelectItem>
                                                    <SelectItem value="on">Forzar visible</SelectItem>
                                                    <SelectItem value="off">Forzar oculto</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </SectionCard>
            </div>
        </AdminLayout>
    );
}
