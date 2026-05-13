import { router } from '@inertiajs/react';
import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ResetSectionButton } from '@/components/admin/reset-section-button';
import { appendNested, dotToBracket } from '@/lib/form-data';

type GridItem = {
    id: string;
    type: 'mundo_toyota' | 'card' | 'image';
    x: number;
    y: number;
    w: number;
    h: number;
    content: Record<string, string | undefined>;
};

type Props = {
    data: {
        title: string;
        button_text: string;
        button_href: string;
        grid_items: GridItem[];
    };
    isVisible: boolean;
};

const TYPE_LABEL: Record<GridItem['type'], string> = {
    mundo_toyota: 'Mundo Toyota',
    card: 'Tarjeta con título',
    image: 'Imagen',
};

export function SectionProgramas({ data: initialData, isVisible: initialVisible }: Props) {
    const [data, setData] = useState(initialData);
    const [isVisible, setIsVisible] = useState(initialVisible);
    const [files, setFiles] = useState<Record<string, File>>({});
    const [processing, setProcessing] = useState(false);

    const updateField = (itemId: string, field: string, value: string) => {
        setData((prev) => ({
            ...prev,
            grid_items: prev.grid_items.map((item) =>
                item.id === itemId ? { ...item, content: { ...item.content, [field]: value } } : item,
            ),
        }));
    };

    const addItem = (type: 'card' | 'image') => {
        const id = `item-${Date.now()}`;
        const last = data.grid_items[data.grid_items.length - 1];
        const newItem: GridItem = {
            id,
            type,
            x: 0,
            y: (last?.y ?? 0) + (last?.h ?? 1),
            w: 2,
            h: type === 'card' ? 6 : 4,
            content: type === 'card'
                ? { title: '', description: '', image: '', href: '' }
                : { image: '', href: '' },
        };
        setData((prev) => ({ ...prev, grid_items: [...prev.grid_items, newItem] }));
    };

    const removeItem = (itemId: string) => {
        setData((prev) => ({
            ...prev,
            grid_items: prev.grid_items.filter((item) => item.id !== itemId),
        }));
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

        router.post('/admin/home/programas', fd, {
            onFinish: () => setProcessing(false),
            forceFormData: true,
        });
    };

    const ImagePicker = ({ itemIndex }: { itemIndex: number }) => {
        const fk = `grid_items.${itemIndex}.content.image`;
        const item = data.grid_items[itemIndex];
        const preview = files[fk] ? URL.createObjectURL(files[fk]) : item.content.image;
        return (
            <div className="grid gap-2">
                <Label className="text-xs">Imagen de fondo</Label>
                {preview ? (
                    <img src={preview} className={`h-24 w-full rounded object-cover ${files[fk] ? 'ring-2 ring-primary' : ''}`} alt="" />
                ) : (
                    <div className="flex h-24 w-full items-center justify-center rounded bg-muted text-xs text-muted-foreground">Sin imagen</div>
                )}
                <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setFiles({ ...files, [fk]: file });
                    }}
                />
            </div>
        );
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

            <div className="flex items-center justify-between">
                <div>
                    <h4 className="text-base font-semibold text-foreground">Tarjetas del grid</h4>
                    <p className="text-sm text-muted-foreground">Layout fijo: las "Mundo Toyota" y "Tarjeta con título" van arriba en una fila de 3; las "Imagen" abajo.</p>
                </div>
                <div className="flex gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={() => addItem('card')}>
                        <Plus className="mr-1 size-4" />
                        Tarjeta con título
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => addItem('image')}>
                        <Plus className="mr-1 size-4" />
                        Imagen
                    </Button>
                </div>
            </div>

            <div className="grid gap-4">
                {data.grid_items.map((item, i) => (
                    <div key={item.id} className="grid gap-4 rounded-lg border p-4">
                        <div className="flex items-center justify-between">
                            <span className="inline-flex rounded bg-muted px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                                {TYPE_LABEL[item.type]}
                            </span>
                            {item.type !== 'mundo_toyota' && (
                                <Button type="button" variant="ghost" size="icon" onClick={() => removeItem(item.id)} title="Eliminar">
                                    <Trash2 className="size-4 text-destructive" />
                                </Button>
                            )}
                        </div>

                        {item.type === 'mundo_toyota' && (
                            <div className="grid gap-4 md:grid-cols-[200px_1fr]">
                                <ImagePicker itemIndex={i} />
                                <div className="grid gap-3">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="grid gap-1.5">
                                            <Label className="text-xs">Título línea 1</Label>
                                            <Input value={item.content.title_line1 ?? ''} onChange={(e) => updateField(item.id, 'title_line1', e.target.value)} />
                                        </div>
                                        <div className="grid gap-1.5">
                                            <Label className="text-xs">Título línea 2 (rojo)</Label>
                                            <Input value={item.content.title_line2 ?? ''} onChange={(e) => updateField(item.id, 'title_line2', e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="grid gap-1.5">
                                        <Label className="text-xs">Descripción</Label>
                                        <Input value={item.content.description ?? ''} onChange={(e) => updateField(item.id, 'description', e.target.value)} />
                                    </div>
                                    <div className="grid gap-1.5">
                                        <Label className="text-xs">Subtítulo</Label>
                                        <Input value={item.content.subtitle ?? ''} onChange={(e) => updateField(item.id, 'subtitle', e.target.value)} />
                                    </div>
                                    <div className="grid gap-1.5">
                                        <Label className="text-xs">Texto del botón</Label>
                                        <Input value={item.content.button_text ?? ''} onChange={(e) => updateField(item.id, 'button_text', e.target.value)} />
                                    </div>
                                    <div className="grid gap-1.5">
                                        <Label className="text-xs">Enlace del botón (fallback / desktop)</Label>
                                        <Input value={item.content.button_href ?? ''} onChange={(e) => updateField(item.id, 'button_href', e.target.value)} placeholder="https://…" />
                                        <p className="text-[10px] text-muted-foreground">Si querés que el botón abra la tienda según el dispositivo, completá los dos campos de abajo. Este enlace se usa en desktop o si solo querés un destino único.</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="grid gap-1.5">
                                            <Label className="text-xs">Enlace Google Play (Android)</Label>
                                            <Input value={item.content.button_href_android ?? ''} onChange={(e) => updateField(item.id, 'button_href_android', e.target.value)} placeholder="https://play.google.com/…" />
                                        </div>
                                        <div className="grid gap-1.5">
                                            <Label className="text-xs">Enlace App Store (iOS)</Label>
                                            <Input value={item.content.button_href_ios ?? ''} onChange={(e) => updateField(item.id, 'button_href_ios', e.target.value)} placeholder="https://apps.apple.com/…" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {item.type === 'card' && (
                            <div className="grid gap-4 md:grid-cols-[200px_1fr]">
                                <ImagePicker itemIndex={i} />
                                <div className="grid gap-3">
                                    <div className="grid gap-1.5">
                                        <Label className="text-xs">Título</Label>
                                        <Input value={item.content.title ?? ''} onChange={(e) => updateField(item.id, 'title', e.target.value)} />
                                    </div>
                                    <div className="grid gap-1.5">
                                        <Label className="text-xs">Descripción</Label>
                                        <Input value={item.content.description ?? ''} onChange={(e) => updateField(item.id, 'description', e.target.value)} />
                                    </div>
                                    <div className="grid gap-1.5">
                                        <Label className="text-xs">Enlace (opcional, hace clickeable toda la tarjeta)</Label>
                                        <Input value={item.content.href ?? ''} onChange={(e) => updateField(item.id, 'href', e.target.value)} placeholder="/nuevos, https://…" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {item.type === 'image' && (
                            <div className="grid gap-4 md:grid-cols-[200px_1fr]">
                                <ImagePicker itemIndex={i} />
                                <div className="grid gap-3 self-start">
                                    <div className="grid gap-1.5">
                                        <Label className="text-xs">Enlace (opcional, hace clickeable la imagen)</Label>
                                        <Input value={item.content.href ?? ''} onChange={(e) => updateField(item.id, 'href', e.target.value)} placeholder="/nuevos, https://…" />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="flex items-center gap-3">
                <Button type="submit" disabled={processing} className="w-fit">
                    {processing ? 'Guardando...' : 'Guardar cambios'}
                </Button>
                <ResetSectionButton section="programas" />
            </div>
        </form>
    );
}
