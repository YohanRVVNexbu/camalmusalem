import { router } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { ResetSectionButton } from '@/components/admin/reset-section-button';
import { appendNested, dotToBracket } from '@/lib/form-data';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type Vehicle = {
    name: string;
    subtitle: string;
    headline: string;
    image: string;
    video: string | null;
    background_image: string | null;
    duration: number | null;
    vehicle_model_id: number | null;
};

type VehicleModelLite = { id: number; name: string; slug: string; brand_name: string | null };

type Props = {
    data: { cta_text: string; vehicles: Vehicle[] };
    isVisible: boolean;
    extra?: { vehicle_models: VehicleModelLite[] };
};

export function SectionAbout({ data: initialData, isVisible: initialVisible, extra }: Props) {
    const vehicleModels = extra?.vehicle_models ?? [];
    const [data, setData] = useState(initialData);
    const [isVisible, setIsVisible] = useState(initialVisible);
    const [files, setFiles] = useState<Record<string, File>>({});
    const [processing, setProcessing] = useState(false);

    const updateVehicle = (index: number, field: keyof Vehicle, value: any) => {
        const vehicles = [...data.vehicles];
        vehicles[index] = { ...vehicles[index], [field]: value };
        setData({ ...data, vehicles });
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        const fd = new FormData();
        fd.append('_method', 'PUT');
        fd.append('is_visible', isVisible ? '1' : '0');
        appendNested(fd, 'data', data);
        Object.entries(files).forEach(([key, file]) => {
            fd.append(dotToBracket(key), file);
        });

        router.post('/admin/home/about', fd, {
            onFinish: () => setProcessing(false),
            forceFormData: true,
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
                        <div className="grid grid-cols-3 gap-4">
                            <div className="grid gap-2">
                                <Label>Imagen (miniatura)</Label>
                                {files[`vehicles.${i}.image`] ? (
                                    <img src={URL.createObjectURL(files[`vehicles.${i}.image`])} className="h-20 rounded object-contain ring-2 ring-primary" alt="" />
                                ) : vehicle.image ? (
                                    <img src={vehicle.image} className="h-20 rounded object-contain" alt="" />
                                ) : null}
                                <Input type="file" accept="image/*" onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) setFiles({ ...files, [`vehicles.${i}.image`]: file });
                                }} />
                            </div>
                            <div className="grid gap-2">
                                <Label>Video</Label>
                                {files[`vehicles.${i}.video`] ? (
                                    <video src={URL.createObjectURL(files[`vehicles.${i}.video`])} className="h-20 rounded ring-2 ring-primary" muted controls />
                                ) : vehicle.video ? (
                                    <video src={vehicle.video} className="h-20 rounded" muted controls />
                                ) : null}
                                <Input type="file" accept="video/mp4,video/webm" onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) setFiles({ ...files, [`vehicles.${i}.video`]: file });
                                }} />
                            </div>
                            <div className="grid gap-2">
                                <Label>Imagen de fondo (sin video)</Label>
                                {files[`vehicles.${i}.background_image`] ? (
                                    <img src={URL.createObjectURL(files[`vehicles.${i}.background_image`])} className="h-20 rounded object-cover ring-2 ring-primary" alt="" />
                                ) : vehicle.background_image ? (
                                    <img src={vehicle.background_image} className="h-20 rounded object-cover" alt="" />
                                ) : null}
                                <Input type="file" accept="image/*" onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) setFiles({ ...files, [`vehicles.${i}.background_image`]: file });
                                }} />
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
