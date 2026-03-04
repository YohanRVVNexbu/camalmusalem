import { router } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';

type Vehicle = {
    name: string;
    subtitle: string;
    headline: string;
    image: string;
    video: string | null;
    background_image: string | null;
    duration: number | null;
};

type Props = {
    data: { cta_text: string; cta_href: string; vehicles: Vehicle[] };
    isVisible: boolean;
};

export function SectionAbout({ data: initialData, isVisible: initialVisible }: Props) {
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

        router.post('/admin/home/about', { data, is_visible: isVisible, _method: 'PUT', ...files }, {
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

            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label>Texto CTA</Label>
                    <Input value={data.cta_text} onChange={(e) => setData({ ...data, cta_text: e.target.value })} />
                </div>
                <div className="grid gap-2">
                    <Label>Enlace CTA</Label>
                    <Input value={data.cta_href} onChange={(e) => setData({ ...data, cta_href: e.target.value })} />
                </div>
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
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>Duración (seg, solo si no tiene video)</Label>
                                <Input type="number" value={vehicle.duration ?? ''} onChange={(e) => updateVehicle(i, 'duration', e.target.value ? Number(e.target.value) : null)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="grid gap-2">
                                <Label>Imagen (miniatura)</Label>
                                {vehicle.image && <img src={vehicle.image} className="h-20 rounded object-contain" alt="" />}
                                <Input type="file" accept="image/*" onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) setFiles({ ...files, [`vehicles.${i}.image`]: file });
                                }} />
                            </div>
                            <div className="grid gap-2">
                                <Label>Video</Label>
                                {vehicle.video && <video src={vehicle.video} className="h-20 rounded" muted controls />}
                                <Input type="file" accept="video/mp4,video/webm" onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) setFiles({ ...files, [`vehicles.${i}.video`]: file });
                                }} />
                            </div>
                            <div className="grid gap-2">
                                <Label>Imagen de fondo (sin video)</Label>
                                {vehicle.background_image && <img src={vehicle.background_image} className="h-20 rounded object-cover" alt="" />}
                                <Input type="file" accept="image/*" onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) setFiles({ ...files, [`vehicles.${i}.background_image`]: file });
                                }} />
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            <Button type="submit" disabled={processing} className="w-fit">
                {processing ? 'Guardando...' : 'Guardar cambios'}
            </Button>
        </form>
    );
}
