import { router } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

type Location = { title: string; items: string[] };

type Props = {
    data: {
        logo: string;
        social_links: Record<string, string>;
        nav_links: { label: string; href: string }[];
        locations: Location[];
        legal_links: string[];
        copyright: string;
    };
    isVisible: boolean;
};

export function SectionFooter({ data: initialData, isVisible: initialVisible }: Props) {
    const [data, setData] = useState(initialData);
    const [isVisible, setIsVisible] = useState(initialVisible);
    const [files, setFiles] = useState<Record<string, File>>({});
    const [processing, setProcessing] = useState(false);

    const updateSocial = (key: string, value: string) => {
        setData({ ...data, social_links: { ...data.social_links, [key]: value } });
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

        router.post('/admin/home/footer', { data, is_visible: isVisible, _method: 'PUT', ...files }, {
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
                {data.logo && <img src={data.logo} className="h-12 rounded object-contain" alt="" />}
                <Input type="file" accept="image/*" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setFiles({ ...files, logo: file });
                }} />
            </div>

            <Separator />
            <h4 className="text-base font-semibold text-foreground">Redes sociales</h4>
            <div className="grid grid-cols-2 gap-4">
                {Object.entries(data.social_links).map(([key, url]) => (
                    <div key={key} className="grid gap-2">
                        <Label className="capitalize">{key}</Label>
                        <Input value={url} onChange={(e) => updateSocial(key, e.target.value)} />
                    </div>
                ))}
            </div>

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
            <div className="grid gap-2">
                <Label>Copyright</Label>
                <Input value={data.copyright} onChange={(e) => setData({ ...data, copyright: e.target.value })} />
            </div>

            <Button type="submit" disabled={processing} className="w-fit">
                {processing ? 'Guardando...' : 'Guardar cambios'}
            </Button>
        </form>
    );
}
