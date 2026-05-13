/**
 * Shared helpers for page section editors.
 * Each page editor imports these to avoid repetition.
 */
import { router, usePage } from '@inertiajs/react';
import { ChevronDown, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export type SectionProp = {
    section: string;
    data: Record<string, any>;
    default_data: Record<string, any> | null;
    is_visible: boolean;
};

// ── Generic section wrapper (collapsible card + reset button) ──────────────────
export function SectionCard({
    page,
    sectionKey,
    label,
    isVisible,
    onSubmit,
    processing,
    children,
    onReset,
}: {
    page: string;
    sectionKey: string;
    label: string;
    isVisible: boolean;
    onSubmit: (e: React.FormEvent) => void;
    processing: boolean;
    children: React.ReactNode;
    onReset: () => void;
}) {
    const { flash } = usePage<{ flash: { success?: string } }>().props;

    return (
        <Collapsible>
            <Card>
                <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer">
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                {label}
                                <Badge variant={isVisible ? 'default' : 'secondary'}>
                                    {isVisible ? 'Visible' : 'Oculta'}
                                </Badge>
                            </CardTitle>
                            <ChevronDown className="size-5 transition-transform [[data-state=open]_&]:rotate-180" />
                        </div>
                    </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <CardContent>
                        <form onSubmit={onSubmit} className="flex flex-col gap-6">
                            {children}
                            <div className="flex items-center gap-3">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Guardando...' : 'Guardar cambios'}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={onReset}
                                    className="gap-1.5"
                                >
                                    <RotateCcw className="size-3.5" />
                                    Restaurar defaults
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </CollapsibleContent>
            </Card>
        </Collapsible>
    );
}

// ── Visibility toggle ──────────────────────────────────────────────────────────
export function VisibilityField({
    checked,
    onChange,
}: {
    checked: boolean;
    onChange: (v: boolean) => void;
}) {
    return (
        <div className="flex items-center gap-3">
            <Checkbox checked={checked} onCheckedChange={(v) => onChange(!!v)} />
            <Label>Publicado</Label>
        </div>
    );
}

// ── Detect if URL points to a video by extension ──────────────────────────────
export function isVideoUrl(url: string | null | undefined): boolean {
    if (!url) return false;
    return /\.(mp4|webm|mov|m4v|ogg)(\?|$)/i.test(url);
}

// ── Media field (image OR video) with preview ─────────────────────────────────
export function MediaField({
    label,
    currentUrl,
    defaultUrl,
    onChange,
    hint,
}: {
    label: string;
    currentUrl: string;
    defaultUrl?: string;
    onChange: (file: File | null) => void;
    hint?: string;
}) {
    const [pickedFile, setPickedFile] = useState<File | null>(null);

    const previewUrl = pickedFile ? URL.createObjectURL(pickedFile) : (currentUrl || defaultUrl);
    const isVideo = pickedFile
        ? pickedFile.type.startsWith('video/')
        : isVideoUrl(currentUrl || defaultUrl);

    return (
        <div className="grid gap-2">
            <Label>{label}</Label>
            {previewUrl && (
                <div className="relative">
                    {isVideo ? (
                        <video src={previewUrl} className="h-40 w-full rounded-lg object-cover" muted controls playsInline />
                    ) : (
                        <img src={previewUrl} className="h-40 w-full rounded-lg object-cover" alt="" />
                    )}
                    {pickedFile && (
                        <span className="absolute bottom-2 left-2 rounded bg-primary/80 px-2 py-0.5 text-xs text-white">
                            Nuevo {isVideo ? 'video' : 'archivo'} seleccionado
                        </span>
                    )}
                    {!pickedFile && !currentUrl && defaultUrl && (
                        <span className="absolute bottom-2 left-2 rounded bg-black/60 px-2 py-0.5 text-xs text-white">
                            Default
                        </span>
                    )}
                </div>
            )}
            <Input
                type="file"
                accept="image/*,video/*"
                onChange={(e) => {
                    const f = e.target.files?.[0] ?? null;
                    setPickedFile(f);
                    onChange(f);
                }}
            />
            <p className="text-xs text-muted-foreground">{hint ?? 'Acepta imágenes (.jpg, .png, .webp, etc.) o videos (.mp4, .webm).'}</p>
        </div>
    );
}

// ── Image-only field (preserved for cases where only image makes sense) ──────
export function ImageField({
    label,
    currentUrl,
    defaultUrl,
    onChange,
}: {
    label: string;
    currentUrl: string;
    defaultUrl?: string;
    onChange: (file: File | null) => void;
}) {
    const [pickedFile, setPickedFile] = useState<File | null>(null);
    const previewUrl = pickedFile ? URL.createObjectURL(pickedFile) : (currentUrl || defaultUrl);
    return (
        <div className="grid gap-2">
            <Label>{label}</Label>
            {previewUrl && (
                <div className="relative">
                    <img src={previewUrl} className="h-40 w-full rounded-lg object-cover" alt="" />
                    {pickedFile && (
                        <span className="absolute bottom-2 left-2 rounded bg-primary/80 px-2 py-0.5 text-xs text-white">
                            Nueva imagen seleccionada
                        </span>
                    )}
                    {!pickedFile && !currentUrl && defaultUrl && (
                        <span className="absolute bottom-2 left-2 rounded bg-black/60 px-2 py-0.5 text-xs text-white">
                            Imagen actual (default)
                        </span>
                    )}
                </div>
            )}
            <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                    const f = e.target.files?.[0] ?? null;
                    setPickedFile(f);
                    onChange(f);
                }}
            />
        </div>
    );
}

// ── Text field ─────────────────────────────────────────────────────────────────
export function TextField({
    label,
    value,
    onChange,
    placeholder,
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
}) {
    return (
        <div className="grid gap-2">
            <Label>{label}</Label>
            <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
        </div>
    );
}

// ── Textarea field ─────────────────────────────────────────────────────────────
export function TextareaField({
    label,
    value,
    onChange,
    rows = 4,
    placeholder,
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    rows?: number;
    placeholder?: string;
}) {
    return (
        <div className="grid gap-2">
            <Label>{label}</Label>
            <Textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                rows={rows}
                placeholder={placeholder}
            />
        </div>
    );
}

// ── Submit helper ──────────────────────────────────────────────────────────────
export function submitSection(
    page: string,
    section: string,
    data: Record<string, any>,
    isVisible: boolean,
    files: Record<string, File | null>,
    setProcessing: (v: boolean) => void,
) {
    setProcessing(true);
    const fd = new FormData();
    fd.append('is_visible', isVisible ? '1' : '0');

    // Append all data fields
    appendData(fd, 'data', data);

    // Append file uploads (flat keys matching data path)
    Object.entries(files).forEach(([key, file]) => {
        if (file) fd.append(key, file);
    });

    router.post(`/admin/paginas/${page}/${section}`, fd, {
        forceFormData: true,
        onFinish: () => setProcessing(false),
    });
}

// ── Reset helper ───────────────────────────────────────────────────────────────
export function resetSection(page: string, section: string) {
    router.post(`/admin/paginas/${page}/${section}/reset`, {});
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function appendData(fd: FormData, prefix: string, value: any) {
    if (value === null || value === undefined) {
        fd.append(prefix, '');
    } else if (Array.isArray(value)) {
        value.forEach((item, i) => appendData(fd, `${prefix}[${i}]`, item));
    } else if (typeof value === 'object') {
        Object.entries(value).forEach(([k, v]) => appendData(fd, `${prefix}[${k}]`, v));
    } else {
        fd.append(prefix, String(value));
    }
}
