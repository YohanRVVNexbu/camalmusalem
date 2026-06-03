import { router } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { ResetSectionButton } from '@/components/admin/reset-section-button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { uploadImageBase64 } from '@/lib/image-upload';
import { uploadVideoBase64 } from '@/lib/video-upload';

type Vehicle = {
    name: string;
    subtitle: string;
    headline: string;
    image: string;
    video: string | null;
    video_mobile: string | null;
    background_image: string | null;
    background_image_mobile: string | null;
    duration: number | null;
    vehicle_model_id: number | null;
};

type VehicleModelLite = { id: number; name: string; slug: string; brand_name: string | null };

type Props = {
    data: { cta_text: string; vehicles: Vehicle[] };
    isVisible: boolean;
    extra?: { vehicle_models: VehicleModelLite[] };
};

// Campos del Vehicle que aceptan archivo/URL.
type MediaField = 'image' | 'video' | 'video_mobile' | 'background_image' | 'background_image_mobile';

export function SectionAbout({ data: initialData, isVisible: initialVisible, extra }: Props) {
    const vehicleModels = extra?.vehicle_models ?? [];
    const [data, setData] = useState(initialData);
    const [isVisible, setIsVisible] = useState(initialVisible);
    const [uploading, setUploading] = useState<Record<string, boolean>>({});
    const [processing, setProcessing] = useState(false);

    const updateVehicle = (index: number, field: keyof Vehicle, value: any) => {
        const vehicles = [...data.vehicles];
        vehicles[index] = { ...vehicles[index], [field]: value };
        setData({ ...data, vehicles });
    };

    const uploadKey = (i: number, field: MediaField) => `${i}.${field}`;
    const isUploading = (i: number, field: MediaField) => !!uploading[uploadKey(i, field)];
    const setUploadingFor = (i: number, field: MediaField, value: boolean) =>
        setUploading((prev) => ({ ...prev, [uploadKey(i, field)]: value }));

    const handlePickImage = async (i: number, field: 'image' | 'background_image' | 'background_image_mobile', file: File | null) => {
        if (!file) return;
        setUploadingFor(i, field, true);
        try {
            const url = await uploadImageBase64(file, 'home/about', data.vehicles[i][field] ?? null);
            updateVehicle(i, field, url);
        } catch (err) {
            toast.error('No se pudo subir la imagen. ' + (err instanceof Error ? err.message : ''));
        } finally {
            setUploadingFor(i, field, false);
        }
    };

    const handlePickVideo = async (i: number, field: 'video' | 'video_mobile', file: File | null) => {
        if (!file) return;
        setUploadingFor(i, field, true);
        try {
            // Si el campo apuntaba a un archivo subido por nosotros (path /storage/),
            // lo borramos. Si era una URL externa (YouTube/Vimeo/CDN del cliente), no.
            const oldUrl = data.vehicles[i][field];
            const ownsOld = oldUrl && oldUrl.startsWith('/storage/');
            const url = await uploadVideoBase64(file, 'home/about', ownsOld ? oldUrl : null);
            updateVehicle(i, field, url);
        } catch (err) {
            toast.error('No se pudo subir el video. ' + (err instanceof Error ? err.message : ''));
        } finally {
            setUploadingFor(i, field, false);
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        // Todos los archivos ya están subidos (las URLs viven en data). El form
        // principal viaja como JSON normal, sin multipart → no toca el límite
        // de Cloudflare ni el WAF.
        router.put(`/admin/home/about`, {
            is_visible: isVisible ? '1' : '0',
            data: data,
        }, {
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <form onSubmit={submit} className="flex flex-col gap-6">
            <div className="flex items-center space-x-3">
                <Checkbox id="about_visible" checked={isVisible} onCheckedChange={(v) => setIsVisible(!!v)} />
                <Label htmlFor="about_visible">Sección visible</Label>
            </div>

            <Separator />

            <div className="grid gap-2 max-w-md">
                <Label>Texto del botón (común a todos los slides)</Label>
                <Input value={data.cta_text} onChange={(e) => setData({ ...data, cta_text: e.target.value })} placeholder="Ej: Más detalles" />
                <p className="text-xs text-muted-foreground">El destino del botón se elige por slide más abajo.</p>
            </div>

            {data.vehicles.map((vehicle, i) => (
                <div key={i} className="rounded-lg border p-4">
                    <h4 className="mb-4 text-base font-semibold text-foreground">Vehículo {i + 1}: {vehicle.name}</h4>
                    <div className="grid gap-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>Nombre</Label>
                                <Input value={vehicle.name} onChange={(e) => updateVehicle(i, 'name', e.target.value)} />
                            </div>
                            <div className="grid gap-2">
                                <Label>Subtítulo</Label>
                                <Input value={vehicle.subtitle} onChange={(e) => updateVehicle(i, 'subtitle', e.target.value)} />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label>Titular</Label>
                            <Textarea value={vehicle.headline} onChange={(e) => updateVehicle(i, 'headline', e.target.value)} />
                        </div>
                        <div className="grid gap-2">
                            <Label>Vehículo enlazado (botón "Más detalles" lleva a su ficha)</Label>
                            <Select
                                value={vehicle.vehicle_model_id ? String(vehicle.vehicle_model_id) : 'none'}
                                onValueChange={(v) => updateVehicle(i, 'vehicle_model_id', v === 'none' ? null : Number(v))}
                            >
                                <SelectTrigger><SelectValue placeholder="— Sin enlace —" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">— Sin enlace (oculta el botón) —</SelectItem>
                                    {vehicleModels.map((m) => (
                                        <SelectItem key={m.id} value={String(m.id)}>
                                            {m.brand_name} {m.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <p className="text-xs text-muted-foreground">El botón redirige a /nuevos/{'{'}slug{'}'} del vehículo elegido.</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>Duración (seg, solo si no tiene video)</Label>
                                <Input type="number" value={vehicle.duration ?? ''} onChange={(e) => updateVehicle(i, 'duration', e.target.value ? Number(e.target.value) : null)} />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label>Imagen (miniatura)</Label>
                            {vehicle.image && (
                                <img src={vehicle.image} className="h-20 rounded object-contain" alt="" />
                            )}
                            <Input
                                type="file"
                                accept="image/*"
                                disabled={isUploading(i, 'image')}
                                onChange={(e) => handlePickImage(i, 'image', e.target.files?.[0] ?? null)}
                            />
                            {isUploading(i, 'image') && <p className="text-xs text-muted-foreground">Subiendo miniatura…</p>}
                        </div>

                        <div className="grid gap-3">
                            <Label>Video</Label>
                            <p className="text-xs text-muted-foreground">
                                Máximo 70 MB por archivo. Si pesa más, comprímelo antes (HandBrake / ffmpeg).
                            </p>
                            <div className="grid gap-4 md:grid-cols-2">
                                <VideoField
                                    label="Desktop"
                                    value={vehicle.video}
                                    uploading={isUploading(i, 'video')}
                                    onPick={(file) => handlePickVideo(i, 'video', file)}
                                    onClear={() => updateVehicle(i, 'video', null)}
                                />
                                <VideoField
                                    label="Mobile (opcional)"
                                    value={vehicle.video_mobile}
                                    uploading={isUploading(i, 'video_mobile')}
                                    onPick={(file) => handlePickVideo(i, 'video_mobile', file)}
                                    onClear={() => updateVehicle(i, 'video_mobile', null)}
                                    hint="Si lo dejas vacío, se usará el video desktop."
                                />
                            </div>
                        </div>

                        <div className="grid gap-3">
                            <Label>Imagen de fondo (sin video)</Label>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label className="text-sm font-normal text-muted-foreground">Desktop</Label>
                                    {vehicle.background_image && (
                                        <img src={vehicle.background_image} className="h-20 rounded object-cover" alt="" />
                                    )}
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        disabled={isUploading(i, 'background_image')}
                                        onChange={(e) => handlePickImage(i, 'background_image', e.target.files?.[0] ?? null)}
                                    />
                                    {isUploading(i, 'background_image') && <p className="text-xs text-muted-foreground">Subiendo imagen…</p>}
                                </div>
                                <div className="grid gap-2">
                                    <Label className="text-sm font-normal text-muted-foreground">Mobile (opcional)</Label>
                                    {vehicle.background_image_mobile && (
                                        <img src={vehicle.background_image_mobile} className="h-20 rounded object-cover" alt="" />
                                    )}
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        disabled={isUploading(i, 'background_image_mobile')}
                                        onChange={(e) => handlePickImage(i, 'background_image_mobile', e.target.files?.[0] ?? null)}
                                    />
                                    {isUploading(i, 'background_image_mobile') && <p className="text-xs text-muted-foreground">Subiendo imagen…</p>}
                                    <p className="text-xs text-muted-foreground">Si lo dejas vacío, se usará la imagen desktop.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            <div className="flex items-center gap-3">
                <Button type="submit" disabled={processing} className="w-fit">
                    {processing ? 'Guardando...' : 'Guardar cambios'}
                </Button>
                <ResetSectionButton section="about" />
            </div>
        </form>
    );
}

// ─── Subcomponente: Video upload ────────────────────────────────────────────
function VideoField({
    label,
    value,
    uploading,
    onPick,
    onClear,
    hint,
}: {
    label: string;
    value: string | null;
    uploading: boolean;
    onPick: (file: File | null) => void;
    onClear: () => void;
    hint?: string;
}) {
    return (
        <div className="grid gap-2">
            <Label className="text-sm font-normal text-muted-foreground">{label}</Label>
            {value && (
                <div className="flex items-center gap-2">
                    <video src={value} className="h-20 rounded" muted controls />
                    <Button type="button" variant="outline" size="sm" onClick={onClear}>
                        Quitar
                    </Button>
                </div>
            )}
            <Input
                type="file"
                accept="video/mp4,video/webm,video/quicktime,video/ogg"
                disabled={uploading}
                onChange={(e) => onPick(e.target.files?.[0] ?? null)}
            />
            {uploading && <p className="text-xs text-muted-foreground">Subiendo video…</p>}
            {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
        </div>
    );
}
