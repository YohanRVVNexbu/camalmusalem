import { router } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

type Props = {
    data: {
        title: string;
        button_text: string;
        button_href: string;
        mundo_toyota: {
            title_line1: string;
            title_line2: string;
            description: string;
            subtitle: string;
            button_text: string;
            button_href: string;
            image: string;
        };
        promo_image: string;
        cards: { title: string; description: string; image: string; href: string }[];
        bottom_image: string;
    };
    isVisible: boolean;
};

export function SectionProgramas({ data: initialData, isVisible: initialVisible }: Props) {
    const [data, setData] = useState(initialData);
    const [isVisible, setIsVisible] = useState(initialVisible);
    const [files, setFiles] = useState<Record<string, File>>({});
    const [processing, setProcessing] = useState(false);

    const updateMundoToyota = (field: string, value: string) => {
        setData({ ...data, mundo_toyota: { ...data.mundo_toyota, [field]: value } });
    };

    const updateCard = (index: number, field: string, value: string) => {
        const cards = [...data.cards];
        cards[index] = { ...cards[index], [field]: value };
        setData({ ...data, cards });
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        router.post('/admin/home/programas', { data, is_visible: isVisible, _method: 'PUT', ...files }, {
            onFinish: () => setProcessing(false),
            forceFormData: true,
        });
    };

    return (
        <form onSubmit={submit} className="flex flex-col gap-6">
            <div className="flex items-center space-x-3">
                <Checkbox id="prog_visible" checked={isVisible} onCheckedChange={(v) => setIsVisible(!!v)} />
                <Label htmlFor="prog_visible">Sección visible</Label>
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

            <Separator />
            <h4 className="text-base font-semibold text-foreground">Mundo Toyota</h4>
            <div className="rounded-lg border p-4">
                <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label>Título línea 1</Label>
                            <Input value={data.mundo_toyota.title_line1} onChange={(e) => updateMundoToyota('title_line1', e.target.value)} />
                        </div>
                        <div className="grid gap-2">
                            <Label>Título línea 2 (rojo)</Label>
                            <Input value={data.mundo_toyota.title_line2} onChange={(e) => updateMundoToyota('title_line2', e.target.value)} />
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label>Descripción</Label>
                        <Input value={data.mundo_toyota.description} onChange={(e) => updateMundoToyota('description', e.target.value)} />
                    </div>
                    <div className="grid gap-2">
                        <Label>Subtítulo</Label>
                        <Input value={data.mundo_toyota.subtitle} onChange={(e) => updateMundoToyota('subtitle', e.target.value)} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label>Texto botón</Label>
                            <Input value={data.mundo_toyota.button_text} onChange={(e) => updateMundoToyota('button_text', e.target.value)} />
                        </div>
                        <div className="grid gap-2">
                            <Label>Enlace botón</Label>
                            <Input value={data.mundo_toyota.button_href} onChange={(e) => updateMundoToyota('button_href', e.target.value)} />
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label>Imagen</Label>
                        {data.mundo_toyota.image && <img src={data.mundo_toyota.image} className="h-24 rounded object-cover" alt="" />}
                        <Input type="file" accept="image/*" onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) setFiles({ ...files, 'mundo_toyota.image': file });
                        }} />
                    </div>
                </div>
            </div>

            <div className="grid gap-2">
                <Label>Imagen promo (inferior izquierda)</Label>
                {data.promo_image && <img src={data.promo_image} className="h-24 rounded object-cover" alt="" />}
                <Input type="file" accept="image/*" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setFiles({ ...files, promo_image: file });
                }} />
            </div>

            <Separator />
            <h4 className="text-base font-semibold text-foreground">Tarjetas derecha</h4>
            {data.cards.map((card, i) => (
                <div key={i} className="rounded-lg border p-4">
                    <h4 className="mb-4 text-sm font-medium">Tarjeta {i + 1}</h4>
                    <div className="grid gap-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>Título</Label>
                                <Input value={card.title} onChange={(e) => updateCard(i, 'title', e.target.value)} />
                            </div>
                            <div className="grid gap-2">
                                <Label>Enlace</Label>
                                <Input value={card.href} onChange={(e) => updateCard(i, 'href', e.target.value)} />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label>Descripción</Label>
                            <Input value={card.description} onChange={(e) => updateCard(i, 'description', e.target.value)} />
                        </div>
                        <div className="grid gap-2">
                            <Label>Imagen</Label>
                            {card.image && <img src={card.image} className="h-24 rounded object-cover" alt="" />}
                            <Input type="file" accept="image/*" onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) setFiles({ ...files, [`cards.${i}.image`]: file });
                            }} />
                        </div>
                    </div>
                </div>
            ))}

            <div className="grid gap-2">
                <Label>Imagen inferior (KINTO)</Label>
                {data.bottom_image && <img src={data.bottom_image} className="h-24 rounded object-cover" alt="" />}
                <Input type="file" accept="image/*" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setFiles({ ...files, bottom_image: file });
                }} />
            </div>

            <Button type="submit" disabled={processing} className="w-fit">
                {processing ? 'Guardando...' : 'Guardar cambios'}
            </Button>
        </form>
    );
}
