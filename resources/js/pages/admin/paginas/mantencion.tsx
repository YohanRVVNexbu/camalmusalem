import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Separator } from '@/components/ui/separator';
import AdminLayout from '@/layouts/admin-layout';
import { ResponsiveMediaField, SectionCard, SectionProp, TextField, TextareaField, VisibilityField, resetSection, submitSection } from './_section';
import defaultHeroImg from '@images/mantencion/hero-imagen.png?format=webp';
import defaultReservaImg from '@images/mantencion/image_third_section.jpg?format=webp';
import defaultStep2Img from '@images/mantencion/image_step2.png?format=webp';
import defaultStep4Img from '@images/mantencion/image_step4.png?format=webp';
import { uploadImageBase64 } from '@/lib/image-upload';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function MantencionPage({ sections }: { sections: Record<string, SectionProp> }) {
    const { flash } = usePage<{ flash: { success?: string } }>().props;
    const page = 'mantencion';

    return (
        <AdminLayout breadcrumbs={[
            { title: 'Dashboard', href: '/admin' },
            { title: 'Páginas', href: '/admin/paginas' },
            { title: 'Agendar Mantención', href: '#' },
        ]}>
            <Head title="Admin — Mantención" />
            <div className="flex flex-col gap-4 p-4">
                <h1 className="text-2xl font-semibold">Agendar Mantención</h1>
                {flash?.success && (
                    <div className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700">{flash.success}</div>
                )}
                <HeroSection page={page} s={sections['mantencion_hero']} />
                <CarruselSection page={page} s={sections['mantencion_carrusel']} />
                <ReservaSection page={page} s={sections['mantencion_reserva']} />
            </div>
        </AdminLayout>
    );
}

function HeroSection({ page, s }: { page: string; s: SectionProp }) {
    const [data, setData] = useState(s.data);
    const [visible, setVisible] = useState(s.is_visible);
    const [desktopFile, setDesktopFile] = useState<File | null>(null);
    const [mobileFile, setMobileFile] = useState<File | null>(null);
    const [processing, setProcessing] = useState(false);
    const set = (k: string, v: any) => setData((d: any) => ({ ...d, [k]: v }));

    return (
        <SectionCard page={page} sectionKey="mantencion_hero" label="Hero" isVisible={visible}
            processing={processing}
            onSubmit={(e) => { e.preventDefault(); submitSection(page, 'mantencion_hero', data, visible, { hero_image: desktopFile, hero_image_mobile: mobileFile }, setProcessing); }}
            onReset={() => resetSection(page, 'mantencion_hero')}>
            <VisibilityField checked={visible} onChange={setVisible} />
            <Separator />
            <ResponsiveMediaField
                label="Hero (imagen o video)"
                currentDesktopUrl={data.hero_image ?? ''}
                currentMobileUrl={data.hero_image_mobile ?? ''}
                defaultDesktopUrl={defaultHeroImg}
                onChangeDesktop={setDesktopFile}
                onChangeMobile={setMobileFile}
            />
            <TextField label="Título" value={data.title ?? ''} onChange={(v) => set('title', v)} />
            <TextareaField label="Descripción" value={data.description ?? ''} onChange={(v) => set('description', v)} rows={3} />
        </SectionCard>
    );
}

type ImageCard = { type: 'image'; desktop: string; mobile: string };
type TextCard = { type: 'text'; titulo: string; subtitulo: string; desc: string };
type Card = ImageCard | TextCard;

function CarruselSection({ page, s }: { page: string; s: SectionProp }) {
    const [data, setData] = useState(s.data);
    const [visible, setVisible] = useState(s.is_visible);
    const [processing, setProcessing] = useState(false);
    const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);

    const cards: Card[] = Array.isArray(data.cards) ? data.cards : [];
    const setCards = (next: Card[]) => setData((d: any) => ({ ...d, cards: next }));

    const addImage = () => setCards([...cards, { type: 'image', desktop: '', mobile: '' }]);
    const addText = () => setCards([...cards, { type: 'text', titulo: '', subtitulo: '', desc: '' }]);
    const removeCard = (i: number) => setCards(cards.filter((_, j) => j !== i));
    const moveCard = (i: number, dir: -1 | 1) => {
        const j = i + dir;
        if (j < 0 || j >= cards.length) return;
        const next = [...cards];
        [next[i], next[j]] = [next[j], next[i]];
        setCards(next);
    };
    const updateCard = (i: number, patch: Partial<Card>) => {
        const next = [...cards];
        next[i] = { ...next[i], ...patch } as Card;
        setCards(next);
    };

    const uploadImage = async (i: number, file: File | null, slot: 'desktop' | 'mobile') => {
        if (!file) return;
        setUploadingIdx(i);
        try {
            const url = await uploadImageBase64(file, 'paginas/mantencion_carrusel');
            updateCard(i, { [slot]: url } as Partial<ImageCard>);
        } catch (err) {
            toast.error('No se pudo subir la imagen.');
            console.error(err);
        } finally {
            setUploadingIdx(null);
        }
    };

    return (
        <SectionCard page={page} sectionKey="mantencion_carrusel" label="Carrusel 'Servicio técnico Musalem'" isVisible={visible}
            processing={processing}
            onSubmit={(e) => {
                e.preventDefault();
                // Las imágenes ya están subidas (Base64) y guardadas como URLs
                // dentro de cards. No hay files para mandar — solo el JSON.
                submitSection(page, 'mantencion_carrusel', data, visible, {}, setProcessing);
            }}
            onReset={() => resetSection(page, 'mantencion_carrusel')}>
            <VisibilityField checked={visible} onChange={setVisible} />
            <Separator />
            <p className="text-sm font-medium text-foreground">Cabecera del carrusel</p>
            <TextField label="Título" value={data.carousel_title ?? ''} onChange={(v) => setData((d: any) => ({ ...d, carousel_title: v }))} />
            <TextareaField label="Descripción" value={data.carousel_description ?? ''} onChange={(v) => setData((d: any) => ({ ...d, carousel_description: v }))} rows={3} />
            <Separator />
            <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-foreground">Cards del carrusel ({cards.length})</p>
                <div className="flex gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={addImage}>+ Imagen</Button>
                    <Button type="button" variant="outline" size="sm" onClick={addText}>+ Texto</Button>
                </div>
            </div>
            <p className="text-xs text-muted-foreground">Podés agregar, eliminar y reordenar libremente. Los cards se muestran en el carrusel del público en el mismo orden de esta lista.</p>

            {cards.length === 0 && (
                <div className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
                    No hay cards aún. Agregá una imagen o un texto con los botones de arriba.
                </div>
            )}

            {cards.map((c, i) => (
                <div key={i} className="grid gap-3 rounded-md border bg-muted/20 p-4">
                    <div className="flex items-center justify-between">
                        <span className="rounded-full bg-background px-2 py-0.5 text-xs font-semibold uppercase">{c.type === 'image' ? 'Imagen' : 'Texto'} · #{i + 1}</span>
                        <div className="flex items-center gap-1">
                            <Button type="button" variant="outline" size="sm" onClick={() => moveCard(i, -1)} disabled={i === 0} title="Mover arriba">↑</Button>
                            <Button type="button" variant="outline" size="sm" onClick={() => moveCard(i, 1)} disabled={i === cards.length - 1} title="Mover abajo">↓</Button>
                            <Button type="button" variant="outline" size="sm" onClick={() => { if (confirm('¿Eliminar este card?')) removeCard(i); }} className="text-destructive hover:text-destructive" title="Eliminar">✕</Button>
                        </div>
                    </div>
                    {c.type === 'image' ? (
                        <div className="grid gap-3 sm:grid-cols-2">
                            <div className="grid gap-1.5">
                                <label className="text-xs font-medium">Desktop</label>
                                {c.desktop && <img src={c.desktop} alt="" className="h-24 w-full rounded-md object-cover" />}
                                <input type="file" accept="image/*" disabled={uploadingIdx === i} onChange={(e) => uploadImage(i, e.target.files?.[0] ?? null, 'desktop')} className="text-xs" />
                            </div>
                            <div className="grid gap-1.5">
                                <label className="text-xs font-medium">Mobile (opcional)</label>
                                {c.mobile && <img src={c.mobile} alt="" className="h-24 w-full rounded-md object-cover" />}
                                <input type="file" accept="image/*" disabled={uploadingIdx === i} onChange={(e) => uploadImage(i, e.target.files?.[0] ?? null, 'mobile')} className="text-xs" />
                            </div>
                            {uploadingIdx === i && <p className="col-span-full text-xs text-muted-foreground">Subiendo imagen…</p>}
                        </div>
                    ) : (
                        <>
                            <TextField label="Título" value={c.titulo} onChange={(v) => updateCard(i, { titulo: v })} />
                            <TextField label="Subtítulo" value={c.subtitulo} onChange={(v) => updateCard(i, { subtitulo: v })} />
                            <TextareaField label="Descripción" value={c.desc} onChange={(v) => updateCard(i, { desc: v })} rows={3} />
                        </>
                    )}
                </div>
            ))}
        </SectionCard>
    );
}

function ReservaSection({ page, s }: { page: string; s: SectionProp }) {
    const [data, setData] = useState(s.data);
    const [visible, setVisible] = useState(s.is_visible);
    const [imgFile, setImgFile] = useState<File | null>(null);
    const [imgMobileFile, setImgMobileFile] = useState<File | null>(null);
    const [step2File, setStep2File] = useState<File | null>(null);
    const [step2MobileFile, setStep2MobileFile] = useState<File | null>(null);
    const [step4File, setStep4File] = useState<File | null>(null);
    const [step4MobileFile, setStep4MobileFile] = useState<File | null>(null);
    const [processing, setProcessing] = useState(false);
    const set = (k: string, v: any) => setData((d: any) => ({ ...d, [k]: v }));

    return (
        <SectionCard page={page} sectionKey="mantencion_reserva" label="Reserva tu hora (textos e imágenes del formulario)" isVisible={visible}
            processing={processing}
            onSubmit={(e) => {
                e.preventDefault();
                submitSection(page, 'mantencion_reserva', data, visible, {
                    image: imgFile,
                    image_mobile: imgMobileFile,
                    step2_image: step2File,
                    step2_image_mobile: step2MobileFile,
                    step4_image: step4File,
                    step4_image_mobile: step4MobileFile,
                }, setProcessing);
            }}
            onReset={() => resetSection(page, 'mantencion_reserva')}>
            <VisibilityField checked={visible} onChange={setVisible} />
            <Separator />
            <p className="text-sm font-medium text-foreground">Bloque "Reserva tu hora"</p>
            <TextField label="Título" value={data.title ?? ''} onChange={(v) => set('title', v)} />
            <TextareaField label="Descripción" value={data.description ?? ''} onChange={(v) => set('description', v)} rows={3} />
            <TextField label="Texto del botón" value={data.button_text ?? ''} onChange={(v) => set('button_text', v)} />
            <ResponsiveMediaField
                label="Imagen del bloque (la del horario)"
                currentDesktopUrl={data.image ?? ''}
                currentMobileUrl={data.image_mobile ?? ''}
                defaultDesktopUrl={defaultReservaImg}
                onChangeDesktop={setImgFile}
                onChangeMobile={setImgMobileFile}
            />
            <Separator />
            <p className="text-sm font-medium text-foreground">Imágenes del wizard (al avanzar pasos del formulario)</p>
            <ResponsiveMediaField
                label="Pasos 1, 2 y 3 (datos del vehículo / contacto)"
                currentDesktopUrl={data.step2_image ?? ''}
                currentMobileUrl={data.step2_image_mobile ?? ''}
                defaultDesktopUrl={defaultStep2Img}
                onChangeDesktop={setStep2File}
                onChangeMobile={setStep2MobileFile}
            />
            <ResponsiveMediaField
                label="Paso 4 (resumen / confirmar)"
                currentDesktopUrl={data.step4_image ?? ''}
                currentMobileUrl={data.step4_image_mobile ?? ''}
                defaultDesktopUrl={defaultStep4Img}
                onChangeDesktop={setStep4File}
                onChangeMobile={setStep4MobileFile}
            />
        </SectionCard>
    );
}
