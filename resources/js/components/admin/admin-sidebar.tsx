import { Link, router, usePage } from '@inertiajs/react';
import { Car, ChevronDown, ChevronsUpDown, ClipboardList, FileText, Key, KeySquare, LayoutGrid, ListChecks, ListTree, LogOut, Mail, MapPin, MessageSquare, Newspaper, Package, Power, Receipt, RefreshCw, Shield, Shirt, Tag, UserCog, Users, Wrench } from 'lucide-react';
import { useState } from 'react';
import logoBlanco from '@images/logo_blanco.png?format=webp';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar';
import { UserInfo } from '@/components/user-info';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { useIsMobile } from '@/hooks/use-mobile';
import type { NavItem } from '@/types';

const dashboardItem: NavItem = { title: 'Dashboard', href: '/admin', icon: LayoutGrid };

const catalogoItems: NavItem[] = [
    { title: 'Vehículos nuevos', href: '/admin/vehicle-models',  icon: Car },
    { title: 'Seminuevos',       href: '/admin/seminuevos',      icon: RefreshCw },
    { title: 'Arriendos KINTO',  href: '/admin/rentals',         icon: Key },
    { title: 'Repuestos',        href: '/admin/repuestos',       icon: Wrench },
    { title: 'Accesorios',       href: '/admin/accesorios',      icon: Shirt },
    { title: 'Merch',            href: '/admin/merch',           icon: Package },
    { title: 'Noticias',         href: '/admin/noticias',        icon: Newspaper },
];

const mantenedoresItems: NavItem[] = [
    { title: 'Marcas',                 href: '/admin/brands',                 icon: Tag },
    { title: 'Sucursales',             href: '/admin/branches',               icon: MapPin },
    { title: 'Formulario Mantención',  href: '/admin/formulario-mantencion',  icon: Wrench },
    { title: 'Equipamiento',           href: '/admin/features',               icon: ListChecks },
    { title: 'Listas editables',       href: '/admin/lookups',                icon: ListTree },
];

const solicitudesItems: NavItem[] = [
    { title: 'Contactos',                  href: '/admin/contactos',                 icon: Mail },
    { title: 'Denuncias (Compliance)',     href: '/admin/compliance/denuncias',      icon: Shield },
    { title: 'Mantenciones',               href: '/admin/mantenciones',              icon: MessageSquare },
    { title: 'Solicitudes Kinto',          href: '/admin/kinto-solicitudes',         icon: KeySquare },
    { title: 'Cotizaciones vehículos',     href: '/admin/cotizaciones-vehiculos',    icon: Receipt },
    { title: 'Cotizaciones accesorios',    href: '/admin/cotizaciones-accesorios',   icon: Receipt },
    { title: 'Cotizaciones repuestos',     href: '/admin/cotizaciones-repuestos',    icon: Receipt },
    { title: 'Encargos repuestos',         href: '/admin/solicitudes-encargo',       icon: ClipboardList },
];

const sistemaItems: NavItem[] = [
    { title: 'Páginas',             href: '/admin/paginas',       icon: FileText },
    { title: 'Modo mantenimiento',  href: '/admin/mantenimiento', icon: Power },
    { title: 'Usuarios',            href: '/admin/users',         icon: Users },
];

type GroupProps = {
    label: string;
    items: NavItem[];
    isCurrentUrl: (href: string) => boolean;
    defaultOpen?: boolean;
};

function CollapsibleNavGroup({ label, items, isCurrentUrl, defaultOpen = false }: GroupProps) {
    const hasActive = items.some((i) => isCurrentUrl(i.href));
    const [open, setOpen] = useState(defaultOpen || hasActive);

    return (
        <Collapsible open={open} onOpenChange={setOpen} className="group/collapsible">
            <SidebarGroup className="px-2 py-0">
                <CollapsibleTrigger className="w-full">
                    <SidebarGroupLabel className="flex w-full cursor-pointer items-center justify-between hover:text-sidebar-foreground">
                        <span>{label}</span>
                        <ChevronDown className="size-4 transition-transform duration-200 group-data-[state=closed]/collapsible:-rotate-90" />
                    </SidebarGroupLabel>
                </CollapsibleTrigger>
                <CollapsibleContent className="data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down overflow-hidden">
                    <SidebarMenu>
                        {items.map((item) => (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton
                                    asChild
                                    isActive={isCurrentUrl(item.href)}
                                    tooltip={{ children: item.title }}
                                >
                                    <Link href={item.href} prefetch>
                                        {item.icon && <item.icon />}
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </CollapsibleContent>
            </SidebarGroup>
        </Collapsible>
    );
}

function AdminNavUser() {
    const { auth } = usePage().props;
    const { state } = useSidebar();
    const isMobile = useIsMobile();

    const handleLogout = () => {
        router.post('/admin/logout');
    };

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="group text-sidebar-accent-foreground data-[state=open]:bg-sidebar-accent"
                        >
                            <UserInfo user={auth.user} />
                            <ChevronsUpDown className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                        align="end"
                        side={isMobile ? 'bottom' : state === 'collapsed' ? 'left' : 'bottom'}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                <UserInfo user={auth.user} showEmail={true} />
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild className="cursor-pointer">
                            <Link href={`/admin/users/${auth.user.id}/edit`}>
                                <UserCog className="mr-2" />
                                Mi perfil
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
                            <LogOut className="mr-2" />
                            Cerrar sesión
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}

export function AdminSidebar() {
    const { isCurrentUrl } = useCurrentUrl();

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/admin" prefetch>
                                <img src={logoBlanco} alt="Toyota Musalem" className="h-8 w-auto object-contain" />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                {/* Dashboard fijo */}
                <SidebarGroup className="px-2 py-0">
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                asChild
                                isActive={isCurrentUrl(dashboardItem.href)}
                                tooltip={{ children: dashboardItem.title }}
                            >
                                <Link href={dashboardItem.href} prefetch>
                                    <dashboardItem.icon />
                                    <span>{dashboardItem.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>

                <CollapsibleNavGroup label="Catálogo"      items={catalogoItems}      isCurrentUrl={isCurrentUrl} defaultOpen />
                <CollapsibleNavGroup label="Mantenedores"  items={mantenedoresItems}  isCurrentUrl={isCurrentUrl} />
                <CollapsibleNavGroup label="Solicitudes"   items={solicitudesItems}   isCurrentUrl={isCurrentUrl} />
                <CollapsibleNavGroup label="Sistema"       items={sistemaItems}       isCurrentUrl={isCurrentUrl} />
            </SidebarContent>

            <SidebarFooter>
                <AdminNavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
