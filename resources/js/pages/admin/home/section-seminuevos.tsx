import { router } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';

type Vehicle = {
    image: string;
    badge: string;
    year: string;
    brand: string;
    name: string;
    km: string;
    transmission: string;
    fuel: string;
    price: string;
};

type Props = {
    data: {
        title: string;
        description: string;
        button_text: string;
        button_href: string;
        vehicles: Vehicle[];
    };
    isVisible: boolean;
};

export function SectionSeminuevos({ data: initialData, isVisible: initialVisible }: Props) {
    const [data, setData] = useState(initialData);
    const [isVisible, setIsVisible] = useState(initialVisible);
    const [files, setFiles] = useState<Record<string, File>>({});
    const [processing, setProcessing] = useState(false);

    const updateVehicle = (index: number, field: keyof Vehicle, value: string) => {
        const vehicles = [...data.vehicles];
        vehicles[index] = { ...vehicles[index], [field]: value };
        setData({ ...data, vehicles });
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        router.post('/admin/home/seminuevos', { data, is_visible: isVisible, _method: 'PUT', ...files }, {
            onFinish: () => setProcessing(false),
            forceFormData: true,
        });
    };

    return (
        <form onSubmit={submit} className="flex flex-col gap-6">
            <div className="flex items-center space-x-3">
                <Checkbox id="semi_visible" checked={isVisible} onCheckedChange={(v) => setIsVisible(!!v)} />
                <Label htmlFor="semi_visible">Sección visible</Label>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label>Título</Label>
                    <Input value={data.title} onChange={(e) => setData({ ...data, title: e.target.value })} />
                </div>
                <div className="grid gap-2">
                    <Label>Texto botón</Label>
                    <Input value={data.button_text} onChange={(e) => setData({ ...data, button_text: e.target.value })} />
                </div>
            </div>

            <div className="grid gap-2">
                <Label>Descripción</Label>
                <Input value={data.description} onChange={(e) => setData({ ...data, description: e.target.value })} />
            </div>

            <div className="grid gap-2">
                <Label>Enlace botón</Label>
                <Input value={data.button_href} onChange={(e) => setData({ ...data, button_href: e.target.value })} />
            </div>

            {data.vehicles.map((vehicle, i) => (
                <div key={i} className="rounded-lg border p-4">
                    <h4 className="mb-4 text-base font-semibold text-foreground">Vehículo {i + 1}</h4>
                    <div className="grid gap-4">
                        <div className="grid grid-cols-3 gap-4">
                            <div className="grid gap-2">
                                <Label>Badge</Label>
                                <Input value={vehicle.badge} onChange={(e) => updateVehicle(i, 'badge', e.target.value)} />
                            </div>
                            <div className="grid gap-2">
                                <Label>Año</Label>
                                <Input value={vehicle.year} onChange={(e) => updateVehicle(i, 'year', e.target.value)} />
                            </div>
                            <div className="grid gap-2">
                                <Label>Marca</Label>
                                <Input value={vehicle.brand} onChange={(e) => updateVehicle(i, 'brand', e.target.value)} />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label>Nombre</Label>
                            <Textarea value={vehicle.name} onChange={(e) => updateVehicle(i, 'name', e.target.value)} />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="grid gap-2">
                                <Label>Kilometraje</Label>
                                <Input value={vehicle.km} onChange={(e) => updateVehicle(i, 'km', e.target.value)} />
                            </div>
                            <div className="grid gap-2">
                                <Label>Transmisión</Label>
                                <Input value={vehicle.transmission} onChange={(e) => updateVehicle(i, 'transmission', e.target.value)} />
                            </div>
                            <div className="grid gap-2">
                                <Label>Combustible</Label>
                                <Input value={vehicle.fuel} onChange={(e) => updateVehicle(i, 'fuel', e.target.value)} />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label>Precio</Label>
                            <Input value={vehicle.price} onChange={(e) => updateVehicle(i, 'price', e.target.value)} />
                        </div>
                        <div className="grid gap-2">
                            <Label>Imagen</Label>
                            {vehicle.image && <img src={vehicle.image} className="h-24 rounded object-cover" alt="" />}
                            <Input type="file" accept="image/*" onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) setFiles({ ...files, [`vehicles.${i}.image`]: file });
                            }} />
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
