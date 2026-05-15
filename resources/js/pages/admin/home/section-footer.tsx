import { router } from '@inertiajs/react';
import { useState } from 'react';
import { Plus, X as XIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ResetSectionButton } from '@/components/admin/reset-section-button';
import { appendNested, dotToBracket } from '@/lib/form-data';
import { SOCIAL_NETWORKS, SOCIAL_NETWORKS_BY_KEY } from '@/lib/social-networks';

type Location = { title: string; items: string[] };
type LegalLink = { label: string; href: string };

type Props = {
    data: {
        logo: string;
        social_links: Record<string, string>;
        nav_links: { label: string; href: string }[];
        locations: Location[];
        /** Acepta formato nuevo {label,href} o legacy (string). Se normaliza al cargar. */
        legal_links: (string | LegalLink)[];
        copyright: string;
    };
    isVisible: boolean;
};

function normalizeLegalLinks(items: (string | LegalLink)[]): LegalLink[] {
    return items.map((item) =>
        typeof item === 'string'
            ? { label: item, href: /prevenci[óo]n.*del\s*delito/i.test(item) ? '/prevencion-delito' : '#' }
            : { label: item.label ?? '', href: item.href ?? '#' },
    );
}

export function SectionFooter({ data: initialData, isVisible: initialVisible }: Props) {
    const [data, setData] = useState({
        ...initialData,
        legal_links: normalizeLegalLinks(initialData.legal_links ?? []),
    });
    const [isVisible, setIsVisible] = useState(initialVisible);
    const [files, setFiles] = useState<Record<string, File>>({});
    const [processing, setProcessing] = useState(false);

    const updateLegalLink = (index: number, field: 'label' | 'href', value: string) => {
        const links = [...data.legal_links];
        links[index] = { ...links[index], [field]: value };
        setData({ ...data, legal_links: links });
    };

    const addLegalLink = () => {
        setData({ ...data, legal_links: [...data.legal_links, { label: '', href: '#' }] });
    };

    const removeLegalLink = (index: number) => {
        setData({ ...data, legal_links: data.legal_links.filter((_, i) => i !== index) });
    };

    const updateSocial = (key: string, value: string) => {
        setData({ ...data, social_links: { ...data.social_links, [key]: value } });
    };

    const addSocial = (key: string) => {
        setData({ ...data, social_links: { ...data.social_links, [key]: '' } });
    };

    const removeSocial = (key: string) => {
        const { [key]: _removed, ...rest } = data.social_links;
        setData({ ...data, social_links: rest });
    };

    const updateNavLink = (index: number, field: string, value: string) => {
        const links = [...data.nav_links];
        links[index] = { ...links[index], [field]: value };
        setData({ ...data, nav_links: links });
    };

    const updateLocation = (locIndex: number, field: string, value: any) => {
        const locations = [...data.locations];
        locations[locIndex] = { ...locations[locIndex], [field]: value };
        setData({ ...data, locations });
    };

    const updateLocationItem = (locIndex: number, itemIndex: number, value: string) => {
        const locations = [...data.locations];
        const items = [...locations[locIndex].items];
        items[itemIndex] = value;
        locations[locIndex] = { ...locations[locIndex], items };
        setData({ ...data, locations });
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

        router.post('/admin/home/footer', fd, {
            onFinish: () => setProcessing(false),
            forceFormData: true,
        });
    };

    return (
        <form onSubmit={submit} className="flex flex-col gap-6">
            <div className="flex items-center space-x-3">
                <Checkbox id="footer_visible" checked={isVisible} onCheckedChange={(v) => setIsVisible(!!v)} />
                <Label htmlFor="footer_visible">Sección visible</Label>
            </div>

            <Separator />

            <div className="grid gap-2">
                <Label>Logo</Label>
                {files.logo ? (
                    <img src={URL.createObjectURL(files.logo)} className="h-12 rounded object-contain ring-2 ring-primary" alt="" />
                ) : data.logo ? (
                    <img src={data.logo} className="h-12 rounded object-contain" alt="" />
                ) : null}
                <Input type="file" accept="image/*" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setFiles({ ...files, logo: file });
                }} />
            </div>

            <Separator />
            <div className="flex items-center justify-between">
                <h4 className="text-base font-semibold text-foreground">Redes sociales</h4>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={SOCIAL_NETWORKS.every((n) => n.key in data.social_links)}
                        >
                            <Plus className="mr-1 size-4" /> Agregar red
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {SOCIAL_NETWORKS.filter((n) => !(n.key in data.social_links)).map((n) => {
                            const Icon = n.Icon;
                            return (
                                <DropdownMenuItem key={n.key} onClick={() => addSocial(n.key)}>
                                    <span className="mr-2 inline-flex size-4 items-center justify-center">
                                        <Icon />
                                    </span>
                                    {n.label}
                                </DropdownMenuItem>
                            );
                        })}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            {Object.keys(data.social_links).length === 0 ? (
                <p className="text-sm text-muted-foreground">Aún no has agregado redes sociales.</p>
            ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {Object.entries(data.social_links).map(([key, url]) => {
                        const network = SOCIAL_NETWORKS_BY_KEY[key];
                        const Icon = network?.Icon;
                        const label = network?.label ?? key;
                        return (
                            <div key={key} className="grid gap-2">
                                <div className="flex items-center justify-between">
                                    <Label className="flex items-center gap-2">
                                        {Icon ? (
                                            <span className="inline-flex size-4 items-center justify-center">
                                                <Icon />
                                            </span>
                                        ) : null}
                                        {label}
                                    </Label>
                                    <button
                                        type="button"
                                        onClick={() => removeSocial(key)}
                                        className="text-muted-foreground transition hover:text-destructive"
                                        aria-label={`Quitar ${label}`}
                                    >
                                        <XIcon className="size-4" />
                                    </button>
                                </div>
                                <Input
                                    value={url}
                                    placeholder="https://..."
                                    onChange={(e) => updateSocial(key, e.target.value)}
                                />
                            </div>
                        );
                    })}
                </div>
            )}

            <Separator />
            <h4 className="text-base font-semibold text-foreground">Enlaces de navegación</h4>
            {data.nav_links.map((link, i) => (
                <div key={i} className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label>Texto</Label>
                        <Input value={link.label} onChange={(e) => updateNavLink(i, 'label', e.target.value)} />
                    </div>
                    <div className="grid gap-2">
                        <Label>Enlace</Label>
                        <Input value={link.href} onChange={(e) => updateNavLink(i, 'href', e.target.value)} />
                    </div>
                </div>
            ))}

            <Separator />
            <h4 className="text-base font-semibold text-foreground">Sucursales</h4>
            {data.locations.map((loc, locIndex) => (
                <div key={locIndex} className="rounded-lg border p-4">
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label>Nombre sucursal</Label>
                            <Input value={loc.title} onChange={(e) => updateLocation(locIndex, 'title', e.target.value)} />
                        </div>
                        {loc.items.map((item, itemIndex) => (
                            <div key={itemIndex} className="grid gap-2">
                                <Label>Línea {itemIndex + 1}</Label>
                                <Input value={item} onChange={(e) => updateLocationItem(locIndex, itemIndex, e.target.value)} />
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            <Separator />
            <div className="flex items-center justify-between">
                <h4 className="text-base font-semibold text-foreground">Enlaces legales</h4>
                <Button type="button" variant="outline" size="sm" onClick={addLegalLink}>
                    <Plus className="mr-1 size-4" /> Agregar enlace
                </Button>
            </div>
            {data.legal_links.length === 0 ? (
                <p className="text-sm text-muted-foreground">Aún no has agregado enlaces legales.</p>
            ) : (
                <div className="flex flex-col gap-3">
                    {data.legal_links.map((link, i) => (
                        <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-3 items-end">
                            <div className="grid gap-2">
                                <Label className="text-xs">Texto</Label>
                                <Input value={link.label} onChange={(e) => updateLegalLink(i, 'label', e.target.value)} placeholder="Ej: Aviso legal" />
                            </div>
                            <div className="grid gap-2">
                                <Label className="text-xs">Enlace (URL o ruta)</Label>
                                <Input value={link.href} onChange={(e) => updateLegalLink(i, 'href', e.target.value)} placeholder="https://… o /ruta" />
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeLegalLink(i)}
                                className="text-destructive hover:text-destructive"
                                title="Quitar enlace"
                            >
                                <XIcon className="size-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            )}

            <Separator />
            <div className="grid gap-2">
                <Label>Copyright</Label>
                <Input value={data.copyright} onChange={(e) => setData({ ...data, copyright: e.target.value })} />
            </div>

            <div className="flex items-center gap-3">
                <Button type="submit" disabled={processing} className="w-fit">
                    {processing ? 'Guardando...' : 'Guardar cambios'}
                </Button>
                <ResetSectionButton section="footer" />
            </div>
        </form>
    );
}
