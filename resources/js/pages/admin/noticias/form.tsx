import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Bold, Italic, List, ListOrdered, Heading2, Minus, Trash2, Plus, ChevronUp, ChevronDown, GripVertical, Image as ImageIcon, Type, LayoutGrid } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { uploadImageBase64 } from '@/lib/image-upload';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import AdminLayout from '@/layouts/admin-layout';

// ─── Types ──────────────────────────────────────────────────────────────────

type HeroSection   = { id: string; type: 'hero';    images: string[] };
type TextSection   = { id: string; type: 'text';    content: string };
type GallerySection = { id: string; type: 'gallery'; images: string[] };
type Section = HeroSection | TextSection | GallerySection;

type Noticia = {
    id?: number;
    title: string;
    categoria: string | null;
    excerpt: string | null;
    published_at: string | null;
    is_visible: boolean;
    order: number;
    sections: Section[] | null;
};

// ─── TipTap editor ──────────────────────────────────────────────────────────

function RichTextEditor({ value, onChange }: { value: string; onChange: (v: string) => void }) {
    const editor = useEditor({
        extensions: [StarterKit],
        content: value,
        onUpdate: ({ editor }) => onChange(editor.getHTML()),
        editorProps: {
            attributes: {
                class: 'min-h-[200px] p-3 focus:outline-none prose prose-sm max-w-none',
            },
        },
    });

    if (!editor) return null;

    const btn = (active: boolean, action: () => void, icon: React.ReactNode, title: string) => (
        <button
            type="button"
            onClick={action}
            title={title}
            className={`flex size-8 items-center justify-center rounded transition ${active ? 'bg-foreground text-background' : 'hover:bg-muted'}`}
        >
            {icon}
        </button>
    );

    return (
        <div className="overflow-hidden rounded-md border">
            {/* Toolbar */}
            <div className="flex items-center gap-1 border-b bg-muted/40 px-2 py-1">
                {btn(editor.isActive('heading', { level: 2 }), () => editor.chain().focus().toggleHeading({ level: 2 }).run(), <Heading2 className="size-4" />, 'Título')}
                {btn(editor.isActive('bold'), () => editor.chain().focus().toggleBold().run(), <Bold className="size-4" />, 'Negrita')}
                {btn(editor.isActive('italic'), () => editor.chain().focus().toggleItalic().run(), <Italic className="size-4" />, 'Cursiva')}
                <div className="mx-1 h-4 w-px bg-border" />
                {btn(editor.isActive('bulletList'), () => editor.chain().focus().toggleBulletList().run(), <List className="size-4" />, 'Lista')}
                {btn(editor.isActive('orderedList'), () => editor.chain().focus().toggleOrderedList().run(), <ListOrdered className="size-4" />, 'Lista numerada')}
                <div className="mx-1 h-4 w-px bg-border" />
                {btn(false, () => editor.chain().focus().setHorizontalRule().run(), <Minus className="size-4" />, 'Separador')}
            </div>
            <EditorContent editor={editor} />
        </div>
    );
}

// ─── Section card ────────────────────────────────────────────────────────────

function uid() { return Math.random().toString(36).slice(2); }

function ImageSectionEditor({
    label,
    images,
    uploading,
    onRemoveExisting,
    onAddFiles,
}: {
    label: string;
    images: string[];
    uploading: boolean;
    onRemoveExisting: (url: string) => void;
    onAddFiles: (files: File[]) => void;
}) {
    const hint = label === 'Imágenes del hero'
        ? 'Si subes más de una imagen, se mostrará como carrusel.'
        : 'Si hay más de 2 imágenes, se mostrará como carrusel.';

    return (
        <div className="flex flex-col gap-3">
            <Label>{label}</Label>

            {images.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {images.map((url) => (
                        <div key={url} className="relative">
                            <img src={url} className="h-28 w-36 rounded-lg object-cover" alt="" />
                            <button
                                type="button"
                                onClick={() => onRemoveExisting(url)}
                                className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-destructive text-white text-xs"
                            >✕</button>
                        </div>
                    ))}
                </div>
            )}

            <Input
                type="file"
                accept="image/*"
                multiple
                disabled={uploading}
                onChange={(e) => {
                    onAddFiles(Array.from(e.target.files ?? []));
                    e.target.value = '';
                }}
            />
            {uploading && <p className="text-xs text-muted-foreground">Subiendo imágenes…</p>}
            <p className="text-xs text-muted-foreground">{hint}</p>
        </div>
    );
}

// ─── Main form ───────────────────────────────────────────────────────────────

const CATEGORIAS = ['Noticias', 'Reconocimientos', 'Mundo Toyota', 'Concursos', 'Camal Musalem'];

export default function NoticiaForm({ noticia }: { noticia: (Noticia & { id?: number }) | null }) {
    const { flash } = usePage<{ flash: { success?: string } }>().props;
    const isEdit = !!noticia?.id;

    // Normalize incoming sections (add id if missing)
    const normalizeSections = (secs: any[] | null): Section[] =>
        (secs ?? []).map((s) => {
            const { newFiles: _ignored, ...rest } = s ?? {};
            return { ...rest, id: rest.id ?? uid() };
        });

    const [title, setTitle] = useState(noticia?.title ?? '');
    const [categoria, setCategoria] = useState(noticia?.categoria ?? '');
    const [excerpt, setExcerpt] = useState(noticia?.excerpt ?? '');
    const localNow = () => {
        const now = new Date();
        return new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    };

    const [publishedAt, setPublishedAt] = useState(
        noticia?.published_at ? noticia.published_at.slice(0, 16) : localNow()
    );
    const [isVisible, setIsVisible] = useState(noticia?.is_visible ?? true);
    const [order, setOrder] = useState(noticia?.order ?? 0);
    const [sections, setSections] = useState<Section[]>(normalizeSections(noticia?.sections ?? null));
    const [processing, setProcessing] = useState(false);
    const [addingSection, setAddingSection] = useState(false);

    // ── Section mutations ──

    const addSection = (type: Section['type']) => {
        const id = uid();
        if (type === 'text') setSections((s) => [...s, { id, type: 'text', content: '' }]);
        else setSections((s) => [...s, { id, type, images: [] } as any]);
        setAddingSection(false);
    };

    const removeSection = (id: string) => setSections((s) => s.filter((sec) => sec.id !== id));

    const moveSection = (id: string, dir: -1 | 1) => {
        setSections((s) => {
            const idx = s.findIndex((sec) => sec.id === id);
            if (idx + dir < 0 || idx + dir >= s.length) return s;
            const next = [...s];
            [next[idx], next[idx + dir]] = [next[idx + dir], next[idx]];
            return next;
        });
    };

    const updateSection = (id: string, patch: Partial<Section>) =>
        setSections((s) => s.map((sec) => sec.id === id ? { ...sec, ...patch } as Section : sec));

    const removeImage = (id: string, url: string) =>
        setSections((s) => s.map((sec) => {
            if (sec.id !== id || sec.type === 'text') return sec;
            return { ...sec, images: sec.images.filter((u) => u !== url) } as any;
        }));

    const [uploadingSections, setUploadingSections] = useState<Record<string, boolean>>({});

    // Sube cada imagen vía Base64 al instante y la agrega como URL a la
    // sección. Sortea el bloqueo del WAF que rechaza con 403 los uploads
    // multipart de imágenes (mismo problema que el 360).
    const addFiles = async (id: string, files: File[]) => {
        if (files.length === 0) return;
        setUploadingSections((prev) => ({ ...prev, [id]: true }));
        try {
            for (const file of files) {
                try {
                    const url = await uploadImageBase64(file, `noticias/${noticia?.id ?? 'new'}`);
                    setSections((s) => s.map((sec) => {
                        if (sec.id !== id || sec.type === 'text') return sec;
                        return { ...sec, images: [...sec.images, url] } as any;
                    }));
                } catch (err) {
                    toast.error('No se pudo subir una imagen. ' + (err instanceof Error ? err.message : ''));
                }
            }
        } finally {
            setUploadingSections((prev) => ({ ...prev, [id]: false }));
        }
    };

    // ── Submit ──

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        // Las imágenes ya están subidas vía Base64 (URLs dentro de sec.images),
        // así que el form va como JSON normal, sin multipart.
        const sectionsJson = sections.map((sec) => {
            if (sec.type === 'text') return { id: sec.id, type: 'text', content: sec.content };
            return { id: sec.id, type: sec.type, images: sec.images };
        });
        const payload = {
            title,
            categoria,
            excerpt,
            published_at: publishedAt,
            is_visible: isVisible ? '1' : '0',
            order,
            sections: JSON.stringify(sectionsJson),
        };

        if (isEdit) {
            router.put(`/admin/noticias/${noticia!.id}`, payload, { onFinish: () => setProcessing(false) });
        } else {
            router.post('/admin/noticias', payload, { onFinish: () => setProcessing(false) });
        }
    };

    // ── Section labels/icons ──
    const SECTION_TYPES = [
        { type: 'hero' as const, label: 'Hero (imagen grande)', icon: <ImageIcon className="size-5" /> },
        { type: 'text' as const, label: 'Texto enriquecido', icon: <Type className="size-5" /> },
        { type: 'gallery' as const, label: 'Galería de imágenes', icon: <LayoutGrid className="size-5" /> },
    ];

    return (
        <AdminLayout breadcrumbs={[{ title: 'Dashboard', href: '/admin' }, { title: 'Noticias', href: '/admin/noticias' }, { title: isEdit ? 'Editar' : 'Crear', href: '#' }]}>
            <Head title={`Admin — ${isEdit ? 'Editar' : 'Crear'} noticia`} />
            <div className="flex flex-col gap-4 p-4">
                <h1 className="text-2xl font-semibold">{isEdit ? `Editar: ${noticia!.title}` : 'Nueva noticia'}</h1>
                {flash?.success && <div className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700">{flash.success}</div>}

                <form onSubmit={submit} className="flex flex-col gap-6">

                    {/* Publicado */}
                    <div className="flex items-center space-x-3">
                        <Checkbox checked={isVisible} onCheckedChange={(v) => setIsVisible(!!v)} />
                        <Label>Publicado</Label>
                    </div>

                    <Separator />

                    {/* Campos base */}
                    <div className="grid gap-2">
                        <Label>Título *</Label>
                        <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label>Categoría</Label>
                            <Select value={categoria} onValueChange={setCategoria}>
                                <SelectTrigger><SelectValue placeholder="Seleccionar…" /></SelectTrigger>
                                <SelectContent>
                                    {CATEGORIAS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label>Fecha de publicación</Label>
                            <Input type="datetime-local" value={publishedAt} onChange={(e) => setPublishedAt(e.target.value)} />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label>Extracto <span className="text-muted-foreground text-xs">(aparece en el listado)</span></Label>
                        <Input value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="Breve descripción…" />
                    </div>

                    <Separator />

                    {/* Secciones */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-base font-semibold">Contenido de la noticia</h2>
                        </div>

                        {sections.map((sec, idx) => (
                            <div key={sec.id} className="flex flex-col gap-3 rounded-lg border p-4">
                                {/* Section header */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <GripVertical className="size-4 text-muted-foreground" />
                                        <span className="text-sm font-medium capitalize">
                                            {sec.type === 'hero' ? 'Hero' : sec.type === 'text' ? 'Texto' : 'Galería'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <button type="button" onClick={() => moveSection(sec.id, -1)} disabled={idx === 0} className="flex size-7 items-center justify-center rounded hover:bg-muted disabled:opacity-30">
                                            <ChevronUp className="size-4" />
                                        </button>
                                        <button type="button" onClick={() => moveSection(sec.id, 1)} disabled={idx === sections.length - 1} className="flex size-7 items-center justify-center rounded hover:bg-muted disabled:opacity-30">
                                            <ChevronDown className="size-4" />
                                        </button>
                                        <button type="button" onClick={() => removeSection(sec.id)} className="flex size-7 items-center justify-center rounded hover:bg-destructive/10">
                                            <Trash2 className="size-4 text-destructive" />
                                        </button>
                                    </div>
                                </div>

                                {/* Section body */}
                                {sec.type === 'text' && (
                                    <RichTextEditor
                                        value={sec.content}
                                        onChange={(content) => updateSection(sec.id, { content } as any)}
                                    />
                                )}

                                {sec.type === 'hero' && (
                                    <ImageSectionEditor
                                        label="Imágenes del hero"
                                        images={sec.images}
                                        uploading={!!uploadingSections[sec.id]}
                                        onRemoveExisting={(url) => removeImage(sec.id, url)}
                                        onAddFiles={(files) => addFiles(sec.id, files)}
                                    />
                                )}

                                {sec.type === 'gallery' && (
                                    <ImageSectionEditor
                                        label="Imágenes de galería"
                                        images={sec.images}
                                        uploading={!!uploadingSections[sec.id]}
                                        onRemoveExisting={(url) => removeImage(sec.id, url)}
                                        onAddFiles={(files) => addFiles(sec.id, files)}
                                    />
                                )}
                            </div>
                        ))}

                        {/* Add section */}
                        {addingSection ? (
                            <div className="flex flex-col gap-2 rounded-lg border border-dashed p-4">
                                <p className="text-sm font-medium text-muted-foreground">Selecciona el tipo de sección:</p>
                                <div className="flex gap-3">
                                    {SECTION_TYPES.map(({ type, label, icon }) => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => addSection(type)}
                                            className="flex flex-1 flex-col items-center gap-2 rounded-lg border p-4 text-sm transition hover:border-foreground/40 hover:bg-muted"
                                        >
                                            {icon}
                                            <span>{label}</span>
                                        </button>
                                    ))}
                                </div>
                                <button type="button" onClick={() => setAddingSection(false)} className="mt-1 text-sm text-muted-foreground underline">Cancelar</button>
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={() => setAddingSection(true)}
                                className="flex items-center justify-center gap-2 rounded-lg border border-dashed py-4 text-sm text-muted-foreground transition hover:border-foreground/30 hover:text-foreground"
                            >
                                <Plus className="size-4" />
                                Agregar sección
                            </button>
                        )}
                    </div>

                    <Separator />

                    <div className="flex gap-3">
                        <Button type="submit" disabled={processing}>{processing ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear noticia'}</Button>
                        <Button variant="outline" asChild><Link href="/admin/noticias">Cancelar</Link></Button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
