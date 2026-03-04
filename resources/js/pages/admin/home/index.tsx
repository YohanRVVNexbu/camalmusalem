import { Head, usePage } from '@inertiajs/react';
import { ChevronDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import AdminLayout from '@/layouts/admin-layout';
import { SectionHero } from './section-hero';
import { SectionFeatures } from './section-features';
import { SectionAbout } from './section-about';
import { SectionSeminuevos } from './section-seminuevos';
import { SectionProgramas } from './section-programas';
import { SectionShorts } from './section-shorts';
import { SectionFooter } from './section-footer';

const SECTION_LABELS: Record<string, string> = {
    hero: 'Hero',
    features: 'Categorías',
    about: 'Vehículos Destacados',
    seminuevos: 'Seminuevos',
    programas: 'Programas Toyota',
    shorts: 'Shorts',
    footer: 'Footer',
};

const SECTION_COMPONENTS: Record<string, React.ComponentType<{ data: any; isVisible: boolean }>> = {
    hero: SectionHero,
    features: SectionFeatures,
    about: SectionAbout,
    seminuevos: SectionSeminuevos,
    programas: SectionProgramas,
    shorts: SectionShorts,
    footer: SectionFooter,
};

type SectionData = {
    id: number;
    section: string;
    data: any;
    is_visible: boolean;
    order: number;
};

type Props = {
    sections: Record<string, SectionData>;
};

export default function HomeContent({ sections }: Props) {
    const { flash } = usePage<{ flash: { success?: string; error?: string } }>().props;

    return (
        <AdminLayout
            breadcrumbs={[
                { title: 'Dashboard', href: '/admin' },
                { title: 'Página de inicio', href: '/admin/home' },
            ]}
        >
            <Head title="Admin - Página de inicio" />

            <div className="flex flex-col gap-4 p-4">
                <h1 className="text-2xl font-semibold">Gestionar página de inicio</h1>

                {flash?.success && (
                    <div className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-400">
                        {flash.success}
                    </div>
                )}

                {Object.entries(sections).map(([key, section]) => {
                    const Component = SECTION_COMPONENTS[key];
                    if (!Component) return null;

                    return (
                        <Collapsible key={key}>
                            <Card>
                                <CollapsibleTrigger asChild>
                                    <CardHeader className="cursor-pointer">
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="flex items-center gap-2">
                                                {SECTION_LABELS[key] ?? key}
                                                <Badge variant={section.is_visible ? 'default' : 'secondary'}>
                                                    {section.is_visible ? 'Visible' : 'Oculta'}
                                                </Badge>
                                            </CardTitle>
                                            <ChevronDown className="size-5 transition-transform [[data-state=open]_&]:rotate-180" />
                                        </div>
                                    </CardHeader>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <CardContent>
                                        <Component
                                            data={section.data}
                                            isVisible={section.is_visible}
                                        />
                                    </CardContent>
                                </CollapsibleContent>
                            </Card>
                        </Collapsible>
                    );
                })}
            </div>
        </AdminLayout>
    );
}
