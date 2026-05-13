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

type Props = {
    data: {
        label: string;
        title: string;
        description: string;
        button_text: string;
        button_href: string;
        logo: string;
        images: string[];
    };
    isVisible: boolean;
};

export function SectionShorts({ data: initialData, isVisible: initialVisible }: Props) {
    const [data, setData] = useState(initialData);
    const [isVisible, setIsVisible] = useState(initialVisible);
    const [files, setFiles] = useState<Record<string, File>>({});
    const [processing, setProcessing] = useState(false);

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

        router.post('/admin/home/shorts', fd, {
            onFinish: () => setProcessing(false),
            forceFormData: true,
        });
    };

    return (
        <form onSubmit={submit} className="flex flex-col gap-6">
            <div className="flex items-center space-x-3">
                <Checkbox id="shorts_visible" checked={isVisible} onCheckedChange={(v) => setIsVisible(!!v)} />
                <Label htmlFor="shorts_visible">Sección visible</Label>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label>Etiqueta</Label>
                    <Input value={data.label} onChange={(e) => setData({ ...data, label: e.target.value })} />
                </div>
                <div className="grid gap-2">
                    <Label>Texto botón</Label>
                    <Input value={data.button_text} onChange={(e) => setData({ ...data, button_text: e.target.value })} />
                </div>
            </div>

            <div className="grid gap-2">
                <Label>Título</Label>
                <Textarea value={data.title} onChange={(e) => setData({ ...data, title: e.target.value })} />
            </div>

            <div className="grid gap-2">
                <Label>Descripción</Label>
                <Input value={data.description} onChange={(e) => setData({ ...data, description: e.target.value })} />
            </div>

            <div className="grid gap-2">
                <Label>Logo Shorts</Label>
                {files.logo ? (
                    <img src={URL.createObjectURL(files.logo)} className="h-16 rounded object-contain ring-2 ring-primary" alt="" />
                ) : data.logo ? (
                    <img src={data.logo} className="h-16 rounded object-contain" alt="" />
                ) : null}
                <Input type="file" accept="image/*" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setFiles({ ...files, logo: file });
                }} />
            </div>

            <Separator />
            <h4 className="text-base font-semibold text-foreground">Imágenes del carrusel</h4>
            <div className="grid grid-cols-4 gap-4">
                {data.images.map((img, i) => (
                    <div key={i} className="grid gap-2">
                        <Label>Imagen {i + 1}</Label>
                        {files[`images.${i}`] ? (
                            <img src={URL.createObjectURL(files[`images.${i}`])} className="h-32 w-full rounded object-cover ring-2 ring-primary" alt="" />
                        ) : img ? (
                            <img src={img} className="h-32 w-full rounded object-cover" alt="" />
                        ) : null}
                        <Input type="file" accept="image/*" onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) setFiles({ ...files, [`images.${i}`]: file });
                        }} />
                    </div>
                ))}
            </div>

            <div className="flex items-center gap-3">
                <Button type="submit" disabled={processing} className="w-fit">
                    {processing ? 'Guardando...' : 'Guardar cambios'}
                </Button>
                <ResetSectionButton section="shorts" />
            </div>
        </form>
    );
}
