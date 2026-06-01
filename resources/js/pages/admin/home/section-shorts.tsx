import { router } from '@inertiajs/react';
import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { ResetSectionButton } from '@/components/admin/reset-section-button';
import { appendNested, dotToBracket } from '@/lib/form-data';
import { type ShortItem, shortThumbnail } from '@/lib/video-embed';

type Props = {
    data: {
        label: string;
        title: string;
        description: string;
        button_text: string;
        button_href: string;
        logo: string;
        images: string[];
        shorts?: ShortItem[];
    };
    isVisible: boolean;
};

export function SectionShorts({ data: initialData, isVisible: initialVisible }: Props) {
    const [data, setData] = useState({ ...initialData, shorts: initialData.shorts ?? [] });
    const [isVisible, setIsVisible] = useState(initialVisible);
    const [files, setFiles] = useState<Record<string, File>>({});
    const [processing, setProcessing] = useState(false);

    // ── Shorts manuales (URLs YouTube/Instagram/TikTok) ──────────────────
    const shorts = data.shorts ?? [];
    const addShort = () => setData({ ...data, shorts: [...shorts, { url: '', thumbnail: null }] });
    const updateShortUrl = (i: number, url: string) => {
        const s = [...shorts]; s[i] = { ...s[i], url }; setData({ ...data, shorts: s });
    };
    const removeShort = (i: number) => {
        setData({ ...data, shorts: shorts.filter((_, j) => j !== i) });
        // Limpiamos también un archivo pendiente de ese índice si existía.
        const f = { ...files }; delete f[`shorts.${i}.thumbnail`]; setFiles(f);
    };
    const moveShort = (i: number, dir: -1 | 1) => {
        const to = i + dir;
        if (to < 0 || to >= shorts.length) return;
        const s = [...shorts]; [s[i], s[to]] = [s[to], s[i]]; setData({ ...data, shorts: s });
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

            <div className="grid gap-2">
                <Label>Etiqueta</Label>
                <Input value={data.label} onChange={(e) => setData({ ...data, label: e.target.value })} />
            </div>

            <div className="grid gap-2">
                <Label>Título</Label>
                <Textarea value={data.title} onChange={(e) => setData({ ...data, title: e.target.value })} />
            </div>

            <div className="grid gap-2">
                <Label>Descripción</Label>
                <Input value={data.description} onChange={(e) => setData({ ...data, description: e.target.value })} />
            </div>

            <Separator />
            <div className="flex items-center justify-between">
                <div>
                    <h4 className="text-base font-semibold text-foreground">Shorts (videos)</h4>
                    <p className="text-xs text-muted-foreground">URLs de YouTube, Instagram o TikTok. YouTube saca la miniatura solo; para IG/TikTok subí una imagen. Reemplazan a las imágenes estáticas del carrusel.</p>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={addShort}>
                    <Plus className="mr-1 size-3" /> Agregar short
                </Button>
            </div>

            {shorts.length === 0 && (
                <p className="text-sm text-muted-foreground">Sin shorts cargados. Se mostrarán las imágenes estáticas de arriba como fallback.</p>
            )}

            {shorts.map((s, i) => {
                const pendingThumb = files[`shorts.${i}.thumbnail`];
                const preview = pendingThumb ? URL.createObjectURL(pendingThumb) : shortThumbnail(s);
                return (
                    <div key={i} className="grid gap-3 rounded-md border p-3 md:grid-cols-[120px_1fr_auto] md:items-start">
                        <div className="grid gap-1.5">
                            <Label className="text-xs">Miniatura</Label>
                            {preview && <img src={preview} className="h-24 w-full rounded object-cover" alt="" />}
                            <Input type="file" accept="image/*" onChange={(e) => {
                                const f = e.target.files?.[0];
                                if (f) setFiles({ ...files, [`shorts.${i}.thumbnail`]: f });
                            }} />
                            <span className="text-[10px] text-muted-foreground">YouTube: opcional (auto)</span>
                        </div>
                        <div className="grid gap-1.5">
                            <Label className="text-xs">URL del short</Label>
                            <Input value={s.url} onChange={(e) => updateShortUrl(i, e.target.value)} placeholder="https://www.youtube.com/shorts/... · instagram.com/reel/... · tiktok.com/@.../video/..." />
                        </div>
                        <div className="flex items-center gap-1 md:flex-col">
                            <Button type="button" variant="ghost" size="icon" onClick={() => moveShort(i, -1)} disabled={i === 0} title="Subir">↑</Button>
                            <Button type="button" variant="ghost" size="icon" onClick={() => moveShort(i, 1)} disabled={i === shorts.length - 1} title="Bajar">↓</Button>
                            <Button type="button" variant="ghost" size="icon" onClick={() => removeShort(i)} title="Quitar"><Trash2 className="size-4 text-destructive" /></Button>
                        </div>
                    </div>
                );
            })}

            <div className="flex items-center gap-3">
                <Button type="submit" disabled={processing} className="w-fit">
                    {processing ? 'Guardando...' : 'Guardar cambios'}
                </Button>
                <ResetSectionButton section="shorts" />
            </div>
        </form>
    );
}
