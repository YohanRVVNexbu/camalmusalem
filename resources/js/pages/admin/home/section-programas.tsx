import { router } from '@inertiajs/react';
import { GridStack } from 'gridstack';
import 'gridstack/dist/gridstack.css';
import { Pencil, Plus, RotateCcw, Trash2, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

type GridItemContent = Record<string, string>;

type GridItem = {
    id: string;
    type: 'mundo_toyota' | 'card' | 'image';
    x: number;
    y: number;
    w: number;
    h: number;
    content: GridItemContent;
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

const DEFAULT_LAYOUT: Pick<GridItem, 'id' | 'x' | 'y' | 'w' | 'h'>[] = [
    { id: 'mundo-toyota', x: 0, y: 0, w: 2, h: 6 },
    { id: 'card-1', x: 2, y: 0, w: 2, h: 6 },
    { id: 'card-2', x: 4, y: 0, w: 2, h: 6 },
    { id: 'promo-image', x: 0, y: 6, w: 2, h: 4 },
    { id: 'bottom-image', x: 2, y: 6, w: 4, h: 4 },
];

function getItemLabel(item: GridItem): string {
    switch (item.type) {
        case 'mundo_toyota':
            return item.content.title_line2 || 'Mundo Toyota';
        case 'card':
            return item.content.title || 'Tarjeta';
        case 'image':
            return 'Imagen';
    }
}

function getItemBgColor(type: string): string {
    switch (type) {
        case 'mundo_toyota': return 'bg-red-900/40 border-red-500/50';
        case 'card': return 'bg-blue-900/40 border-blue-500/50';
        case 'image': return 'bg-emerald-900/40 border-emerald-500/50';
        default: return 'bg-gray-800 border-gray-600';
    }
}

export function SectionProgramas({ data: initialData, isVisible: initialVisible }: Props) {
    const [data, setData] = useState(initialData);
    const [isVisible, setIsVisible] = useState(initialVisible);
    const [files, setFiles] = useState<Record<string, File>>({});
    const [processing, setProcessing] = useState(false);
    const [editingItem, setEditingItem] = useState<string | null>(null);

    const gridRef = useRef<HTMLDivElement>(null);
    const gsRef = useRef<GridStack | null>(null);

    // Initialize gridstack
    useEffect(() => {
        if (!gridRef.current) return;

        const grid = GridStack.init({
            column: 6,
            cellHeight: 120,
            margin: 8,
            float: true,
            animate: true,
            columnOpts: { columnMax: 6 },
        }, gridRef.current);

        gsRef.current = grid;

        grid.on('change', () => {
            const nodes = grid.getGridItems().map((el) => {
                const node = el.gridstackNode;
                return node ? { id: node.id, x: Number(node.x), y: Number(node.y), w: Number(node.w), h: Number(node.h) } : null;
            }).filter(Boolean) as { id: string; x: number; y: number; w: number; h: number }[];

            setData((prev) => ({
                ...prev,
                grid_items: prev.grid_items.map((item) => {
                    const node = nodes.find((n) => n.id === item.id);
                    return node ? { ...item, x: node.x, y: node.y, w: node.w, h: node.h } : item;
                }),
            }));
        });

        return () => {
            grid.destroy(false);
            gsRef.current = null;
        };
    }, []);

    const updateItemContent = (itemId: string, field: string, value: string) => {
        setData((prev) => ({
            ...prev,
            grid_items: prev.grid_items.map((item) =>
                item.id === itemId ? { ...item, content: { ...item.content, [field]: value } } : item,
            ),
        }));
    };

    const addGridItem = (type: 'card' | 'image') => {
        const id = `item-${Date.now()}`;
        const newItem: GridItem = {
            id,
            type,
            x: 0,
            y: 100,
            w: 2,
            h: 1,
            content: type === 'card'
                ? { title: '', description: '', image: '', href: '#' }
                : { image: '' },
        };

        setData((prev) => ({
            ...prev,
            grid_items: [...prev.grid_items, newItem],
        }));

        // Add widget to gridstack after render
        setTimeout(() => {
            if (gsRef.current) {
                const el = gridRef.current?.querySelector(`[gs-id="${id}"]`);
                if (el) {
                    gsRef.current.makeWidget(el as HTMLElement);
                }
            }
        }, 50);

        setEditingItem(id);
    };

    const removeGridItem = (itemId: string) => {
        const el = gridRef.current?.querySelector(`[gs-id="${itemId}"]`);
        if (el && gsRef.current) {
            gsRef.current.removeWidget(el as HTMLElement, false);
        }
        setData((prev) => ({
            ...prev,
            grid_items: prev.grid_items.filter((item) => item.id !== itemId),
        }));
        if (editingItem === itemId) setEditingItem(null);
    };

    const resetLayout = () => {
        const grid = gsRef.current;
        if (!grid) return;

        grid.batchUpdate();
        data.grid_items.forEach((item) => {
            const def = DEFAULT_LAYOUT.find((d) => d.id === item.id);
            if (!def) return;
            const el = gridRef.current?.querySelector(`[gs-id="${item.id}"]`) as HTMLElement | null;
            if (el) {
                grid.update(el, { x: def.x, y: def.y, w: def.w, h: def.h });
            }
        });
        grid.batchUpdate(false);

        setData((prev) => ({
            ...prev,
            grid_items: prev.grid_items.map((item) => {
                const def = DEFAULT_LAYOUT.find((d) => d.id === item.id);
                return def ? { ...item, x: def.x, y: def.y, w: def.w, h: def.h } : item;
            }),
        }));
    };

    const editingData = editingItem ? data.grid_items.find((i) => i.id === editingItem) : null;

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

            {/* GRID BUILDER */}
            <div className="flex items-center justify-between">
                <div>
                    <h4 className="text-base font-semibold text-foreground">Grilla visual</h4>
                    <p className="text-sm text-muted-foreground">Arrastra y redimensiona los elementos. Haz clic en el lápiz para editar contenido.</p>
                </div>
                <div className="flex gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={resetLayout}>
                        <RotateCcw className="mr-1 size-4" />
                        Default
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => addGridItem('card')}>
                        <Plus className="mr-1 size-4" />
                        Tarjeta
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => addGridItem('image')}>
                        <Plus className="mr-1 size-4" />
                        Imagen
                    </Button>
                </div>
            </div>

            <div className="rounded-lg border border-border bg-black/20 p-2">
                <div ref={gridRef} className="grid-stack">
                    {data.grid_items.map((item) => (
                        <div
                            key={item.id}
                            className="grid-stack-item"
                            gs-id={item.id}
                            gs-x={String(item.x)}
                            gs-y={String(item.y)}
                            gs-w={String(item.w)}
                            gs-h={String(item.h)}
                            gs-min-w="1"
                            gs-min-h="1"
                        >
                            <div
                                className={`grid-stack-item-content group/item relative rounded-xl border ${getItemBgColor(item.type)}`}
                                style={{ overflow: 'hidden' }}
                            >
                                {/* Background image */}
                                {(item.content.image) && (
                                    <img
                                        src={item.content.image}
                                        alt=""
                                        className="pointer-events-none absolute inset-0 h-full w-full object-contain opacity-60"
                                    />
                                )}
                                <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent" />

                                {/* Content overlay */}
                                <div className="relative z-10 flex h-full flex-col justify-end p-3">
                                    <span className="mb-1 inline-block w-fit rounded bg-white/20 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-white">
                                        {item.type === 'mundo_toyota' ? 'Mundo Toyota' : item.type === 'card' ? 'Tarjeta' : 'Imagen'}
                                    </span>
                                    <p className="text-sm font-semibold leading-tight text-white">
                                        {getItemLabel(item)}
                                    </p>
                                </div>

                                {/* Action buttons */}
                                <div className="absolute top-2 right-2 z-20 flex gap-1 opacity-0 transition-opacity group-hover/item:opacity-100">
                                    <button
                                        type="button"
                                        className="rounded-md bg-white/90 p-1.5 text-gray-700 shadow hover:bg-white"
                                        onMouseDown={(e) => e.stopPropagation()}
                                        onClick={() => setEditingItem(item.id)}
                                    >
                                        <Pencil className="size-3.5" />
                                    </button>
                                    {item.type !== 'mundo_toyota' && (
                                        <button
                                            type="button"
                                            className="rounded-md bg-red-500 p-1.5 text-white shadow hover:bg-red-600"
                                            onMouseDown={(e) => e.stopPropagation()}
                                            onClick={() => removeGridItem(item.id)}
                                        >
                                            <Trash2 className="size-3.5" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* EDIT PANEL */}
            {editingData && (
                <div className="rounded-lg border border-primary/30 bg-card p-4">
                    <div className="mb-4 flex items-center justify-between">
                        <h4 className="text-base font-semibold text-foreground">
                            Editando: {getItemLabel(editingData)}
                        </h4>
                        <Button type="button" variant="ghost" size="sm" onClick={() => setEditingItem(null)}>
                            <X className="size-4" />
                        </Button>
                    </div>

                    {editingData.type === 'mundo_toyota' && (
                        <div className="grid gap-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label>Título línea 1</Label>
                                    <Input value={editingData.content.title_line1 || ''} onChange={(e) => updateItemContent(editingData.id, 'title_line1', e.target.value)} />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Título línea 2 (rojo)</Label>
                                    <Input value={editingData.content.title_line2 || ''} onChange={(e) => updateItemContent(editingData.id, 'title_line2', e.target.value)} />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label>Descripción</Label>
                                <Input value={editingData.content.description || ''} onChange={(e) => updateItemContent(editingData.id, 'description', e.target.value)} />
                            </div>
                            <div className="grid gap-2">
                                <Label>Subtítulo</Label>
                                <Input value={editingData.content.subtitle || ''} onChange={(e) => updateItemContent(editingData.id, 'subtitle', e.target.value)} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label>Texto botón</Label>
                                    <Input value={editingData.content.button_text || ''} onChange={(e) => updateItemContent(editingData.id, 'button_text', e.target.value)} />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Enlace botón</Label>
                                    <Input value={editingData.content.button_href || ''} onChange={(e) => updateItemContent(editingData.id, 'button_href', e.target.value)} />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label>Imagen</Label>
                                {editingData.content.image && <img src={editingData.content.image} className="h-24 rounded object-cover" alt="" />}
                                <Input type="file" accept="image/*" onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) setFiles({ ...files, [`grid_items.${data.grid_items.findIndex(i => i.id === editingData.id)}.content.image`]: file });
                                }} />
                            </div>
                        </div>
                    )}

                    {editingData.type === 'card' && (
                        <div className="grid gap-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label>Título</Label>
                                    <Input value={editingData.content.title || ''} onChange={(e) => updateItemContent(editingData.id, 'title', e.target.value)} />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Enlace</Label>
                                    <Input value={editingData.content.href || ''} onChange={(e) => updateItemContent(editingData.id, 'href', e.target.value)} />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label>Descripción</Label>
                                <Input value={editingData.content.description || ''} onChange={(e) => updateItemContent(editingData.id, 'description', e.target.value)} />
                            </div>
                            <div className="grid gap-2">
                                <Label>Imagen</Label>
                                {editingData.content.image && <img src={editingData.content.image} className="h-24 rounded object-cover" alt="" />}
                                <Input type="file" accept="image/*" onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) setFiles({ ...files, [`grid_items.${data.grid_items.findIndex(i => i.id === editingData.id)}.content.image`]: file });
                                }} />
                            </div>
                        </div>
                    )}

                    {editingData.type === 'image' && (
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label>Imagen</Label>
                                {editingData.content.image && <img src={editingData.content.image} className="h-24 rounded object-cover" alt="" />}
                                <Input type="file" accept="image/*" onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) setFiles({ ...files, [`grid_items.${data.grid_items.findIndex(i => i.id === editingData.id)}.content.image`]: file });
                                }} />
                            </div>
                        </div>
                    )}
                </div>
            )}

            <Button type="submit" disabled={processing} className="w-fit">
                {processing ? 'Guardando...' : 'Guardar cambios'}
            </Button>
        </form>
    );
}
