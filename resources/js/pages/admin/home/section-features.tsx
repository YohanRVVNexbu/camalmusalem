import { router } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

type Card = {
    title: string;
    description: string;
    button_label: string;
    href: string;
    image: string;
    video: string;
};

type Props = {
    data: { heading: string; cards: Card[] };
    isVisible: boolean;
};

export function SectionFeatures({ data: initialData, isVisible: initialVisible }: Props) {
    const [data, setData] = useState(initialData);
    const [isVisible, setIsVisible] = useState(initialVisible);
    const [files, setFiles] = useState<Record<string, File>>({});
    const [processing, setProcessing] = useState(false);

    const updateCard = (index: number, field: keyof Card, value: string) => {
        const cards = [...data.cards];
        cards[index] = { ...cards[index], [field]: value };
        setData({ ...data, cards });
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        const formData: any = { data, is_visible: isVisible, _method: 'PUT', ...files };

        router.post('/admin/home/features', formData, {
            onFinish: () => setProcessing(false),
            forceFormData: true,
        });
    };

    return (
        <form onSubmit={submit} className="flex flex-col gap-6">
            <div className="flex items-center space-x-3">
                <Checkbox id="features_visible" checked={isVisible} onCheckedChange={(v) => setIsVisible(!!v)} />
                <Label htmlFor="features_visible">Sección visible</Label>
            </div>

            <Separator />

            <div className="grid gap-2">
                <Label>Título principal</Label>
                <Input value={data.heading} onChange={(e) => setData({ ...data, heading: e.target.value })} />
            </div>

            {data.cards.map((card, i) => (
                <div key={i} className="rounded-lg border p-4">
                    <h4 className="mb-4 text-base font-semibold text-foreground">Tarjeta {i + 1}: {card.title}</h4>
                    <div className="grid gap-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>Título</Label>
                                <Input value={card.title} onChange={(e) => updateCard(i, 'title', e.target.value)} />
                            </div>
                            <div className="grid gap-2">
                                <Label>Texto botón</Label>
                                <Input value={card.button_label} onChange={(e) => updateCard(i, 'button_label', e.target.value)} />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label>Descripción</Label>
                            <Input value={card.description} onChange={(e) => updateCard(i, 'description', e.target.value)} />
                        </div>
                        <div className="grid gap-2">
                            <Label>Enlace</Label>
                            <Input value={card.href} onChange={(e) => updateCard(i, 'href', e.target.value)} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>Imagen</Label>
                                {card.image && <img src={card.image} className="h-24 rounded object-cover" alt="" />}
                                <Input type="file" accept="image/*" onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) setFiles({ ...files, [`cards.${i}.image`]: file });
                                }} />
                            </div>
                            <div className="grid gap-2">
                                <Label>Video (hover)</Label>
                                {card.video && <video src={card.video} className="h-24 rounded object-cover" muted controls />}
                                <Input type="file" accept="video/mp4,video/webm" onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) setFiles({ ...files, [`cards.${i}.video`]: file });
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
