import { Link, router, usePage } from '@inertiajs/react';
import { Car, ChevronsUpDown, FileText, Home, LayoutGrid, ListChecks, LogOut, Mail, Newspaper, RefreshCw, Shirt, Tag, UserCog, Users, Wrench, Wrench as WrenchIcon, KeySquare } from 'lucide-react';
import logoBlanco from '@images/logo_blanco.png?format=webp';
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

const paginasItems: NavItem[] = [
    { title: 'Páginas', href: '/admin/paginas', icon: FileText },
];

const catalogoTecnicoItems: NavItem[] = [
    { title: 'Marcas',          href: '/admin/brands',   icon: Tag },
    { title: 'Equipamiento',    href: '/admin/features', icon: ListChecks },
];

const catalogoItems: NavItem[] = [
    { title: 'Vehículos nuevos', href: '/admin/vehicles',   icon: Car },
    { title: 'Seminuevos',       href: '/admin/seminuevos', icon: RefreshCw },
    { title: 'Repuestos',        href: '/admin/repuestos',  icon: Wrench },
    { title: 'Accesorios',       href: '/admin/accesorios', icon: Shirt },
    { title: 'Noticias',         href: '/admin/noticias',   icon: Newspaper },
    { title: 'Contactos',        href: '/admin/contactos',          icon: Mail },
    { title: 'Mantenciones',     href: '/admin/mantenciones',       icon: WrenchIcon },
    { title: 'Solicitudes Kinto',href: '/admin/kinto-solicitudes',  icon: KeySquare },
    { title: 'Usuarios',         href: '/admin/users',              icon: Users },
];

function NavGroup({ label, items, isCurrentUrl }: { label: string; items: NavItem[]; isCurrentUrl: (href: string) => boolean }) {
    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>{label}</SidebarGroupLabel>
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
        </SidebarGroup>
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
                {/* Dashboard */}
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

                {/* Administración de páginas */}
                <NavGroup label="Administración de páginas" items={paginasItems} isCurrentUrl={isCurrentUrl} />

                {/* Catálogo técnico (mantenedores) */}
                <NavGroup label="Catálogo técnico" items={catalogoTecnicoItems} isCurrentUrl={isCurrentUrl} />

                {/* Catálogo y contenido */}
                <NavGroup label="Catálogo y contenido" items={catalogoItems} isCurrentUrl={isCurrentUrl} />
            </SidebarContent>

            <SidebarFooter>
                <AdminNavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
