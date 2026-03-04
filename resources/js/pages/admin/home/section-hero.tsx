import { router } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';

type Props = {
    data: {
        background_video: string;
        subtitle: string;
        title: string;
        description: string;
        primary_button: { text: string; href: string };
        secondary_button: { text: string; href: string };
    };
    isVisible: boolean;
};

export function SectionHero({ data: initialData, isVisible: initialVisible }: Props) {
    const [data, setData] = useState(initialData);
    const [isVisible, setIsVisible] = useState(initialVisible);
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [processing, setProcessing] = useState(false);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        const formData: any = { data, is_visible: isVisible, _method: 'PUT' };
        if (videoFile) formData.background_video = videoFile;

        router.post('/admin/home/hero', formData, {
            onFinish: () => setProcessing(false),
            forceFormData: true,
        });
    };

    return (
        <form onSubmit={submit} className="flex flex-col gap-6">
            <div className="flex items-center space-x-3">
                <Checkbox id="hero_visible" checked={isVisible} onCheckedChange={(v) => setIsVisible(!!v)} />
                <Label htmlFor="hero_visible">Sección visible</Label>
            </div>

            <Separator />

            <div className="grid gap-2">
                <Label>Video de fondo</Label>
                {data.background_video && (
                    <video src={data.background_video} className="h-32 rounded object-cover" muted controls />
                )}
                <Input type="file" accept="video/mp4,video/webm" onChange={(e) => setVideoFile(e.target.files?.[0] ?? null)} />
            </div>

            <div className="grid gap-2">
                <Label>Subtítulo</Label>
                <Input value={data.subtitle} onChange={(e) => setData({ ...data, subtitle: e.target.value })} />
            </div>

            <div className="grid gap-2">
                <Label>Título (usar \n para saltos de línea)</Label>
                <Textarea value={data.title} onChange={(e) => setData({ ...data, title: e.target.value })} />
            </div>

            <div className="grid gap-2">
                <Label>Descripción</Label>
                <Textarea value={data.description} onChange={(e) => setData({ ...data, description: e.target.value })} />
            </div>

            <Separator />
            <h4 className="text-base font-semibold text-foreground">Botón primario</h4>
            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label>Texto</Label>
                    <Input value={data.primary_button.text} onChange={(e) => setData({ ...data, primary_button: { ...data.primary_button, text: e.target.value } })} />
                </div>
                <div className="grid gap-2">
                    <Label>Enlace</Label>
                    <Input value={data.primary_button.href} onChange={(e) => setData({ ...data, primary_button: { ...data.primary_button, href: e.target.value } })} />
                </div>
            </div>

            <h4 className="text-base font-semibold text-foreground">Botón secundario</h4>
            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label>Texto</Label>
                    <Input value={data.secondary_button.text} onChange={(e) => setData({ ...data, secondary_button: { ...data.secondary_button, text: e.target.value } })} />
                </div>
                <div className="grid gap-2">
                    <Label>Enlace</Label>
                    <Input value={data.secondary_button.href} onChange={(e) => setData({ ...data, secondary_button: { ...data.secondary_button, href: e.target.value } })} />
                </div>
            </div>

            <Button type="submit" disabled={processing} className="w-fit">
                {processing ? 'Guardando...' : 'Guardar cambios'}
            </Button>
        </form>
    );
}
