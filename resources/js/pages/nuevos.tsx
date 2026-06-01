import { Head } from '@inertiajs/react';
import useEmblaCarousel from 'embla-carousel-react';
import { Car, X } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Footer } from '@/components/landing/footer';
import { Navbar } from '@/components/landing/navbar';
import type { FilterGroupKey, FilterOptions, FilterSelection } from '@/components/nuevos/filters';
import NuevosFilters, { emptyFilterSelection } from '@/components/nuevos/filters';
import { Modal360 } from '@/components/nuevos/modal-360';
import { NuevosProductCard } from '@/components/nuevos/product-card';
import { NuevosListItem } from '@/components/nuevos/product-list-item';
import { Pagination } from '@/components/seminuevos/pagination';
import { Toolbar } from '@/components/seminuevos/toolbar';
import type { PerPage, SortMode, ViewMode } from '@/components/seminuevos/toolbar';
import { PillButton } from '@/components/ui/pill-button';
import { formatCLP } from '@/lib/format';

type Version = {
    name: string;
    price: string;
    electric: boolean;
};

type Vehicle = {
    id: number;
    name: string;
    slug: string | null;
    full_name: string | null;
    subtitle: string | null;
    type: string | null;
    fuel: string | null;
    hero_image: string | null;
    versions: Version[];
    // "Desde": precio MENOR entre versiones con bono total aplicado, y el bono
    // de esa versión (dígitos crudos como string). Calculado en el backend.
    desde_price?: string | null;
    desde_bono?: string | null;
};

function ChevronIcon({ className }: { className?: string }) {
    return (
        <svg
            width="12"
            height="24"
            viewBox="0 0 12 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <path
                d="M1.5 1.5L10.5 12L1.5 22.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function CompareIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="15" viewBox="0 0 26 15" fill="none">
            <g clipPath="url(#clip0_431_19971)">
                <path d="M13.6537 4.16814C13.6525 4.61995 13.2941 4.90725 12.8899 4.89148C12.4857 4.8757 12.1813 4.56023 12.1807 4.13716L12.1783 1.42635C9.66541 1.57619 7.27183 2.51698 5.38035 4.10561L7.30566 5.91282C7.603 6.19224 7.61131 6.62601 7.32643 6.90318C7.04155 7.18035 6.58278 7.19781 6.27001 6.90431L4.33817 5.09484C2.66688 6.8829 1.67336 9.14529 1.50718 11.5575L5.55781 11.5558C5.99522 11.5558 6.31927 11.8358 6.33648 12.2268C6.3525 12.5851 6.05753 12.9501 5.61597 12.9507L0.75522 12.9524C0.295852 12.9529 0.00919265 12.598 0.0103796 12.2307C0.0269976 5.43229 5.84684 0.0157305 12.8887 0.00052019C19.9579 -0.0146901 25.8062 5.40975 25.8264 12.2307C25.8276 12.6014 25.5415 12.9518 25.0815 12.9518L20.2795 12.9535C19.8374 12.9535 19.5133 12.6696 19.4997 12.2752C19.486 11.8809 19.8225 11.5553 20.2772 11.5558L24.3284 11.5587C24.1634 9.15599 23.1865 6.91726 21.5081 5.10048L19.6564 6.87332C19.3715 7.14654 18.9329 7.15894 18.6367 6.91163C18.3797 6.697 18.2688 6.23167 18.5643 5.94493L20.4617 4.10674C18.5768 2.54008 16.2307 1.58408 13.6608 1.42409L13.6525 4.16814H13.6537Z" fill="black"/>
                <path d="M14.7254 10.828C15.3409 11.6555 15.4317 12.6318 14.8518 13.4774C14.3283 14.2396 13.3075 14.6559 12.2772 14.3877C11.3644 14.15 10.7187 13.4114 10.5537 12.4386C10.2486 10.6404 10.0474 8.85568 9.8504 7.03721C9.81183 6.67836 9.97088 6.38147 10.2967 6.24684C10.6457 6.10262 10.9834 6.23895 11.2303 6.53076C12.4297 7.94701 13.6067 9.32382 14.7254 10.8285V10.828ZM13.5859 11.7355C12.9508 10.8618 12.3289 10.0596 11.6018 9.23594C11.695 10.3142 11.8481 11.2837 12.0303 12.2915C12.0974 12.6639 12.3389 12.9467 12.6559 13.0351C13.044 13.1439 13.4138 12.9805 13.5995 12.7354C13.8292 12.4318 13.8173 12.0532 13.5865 11.7361L13.5859 11.7355Z" fill="black"/>
            </g>
            <defs>
                <clipPath id="clip0_431_19971">
                    <rect width="25.159" height="14.8544" fill="white"/>
                </clipPath>
            </defs>
        </svg>
    );
}

function ElectricBadge() {
    return (
        <span
            className="inline-flex h-8.5 items-center justify-center gap-1.5 rounded-[60px] px-2.5"
            style={{ background: 'rgba(0, 0, 0, 0.40)', backdropFilter: 'blur(5px)' }}
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="11" height="14" viewBox="0 0 11 14" fill="none">
                <path d="M4.79427 8.74999L0.612796 8.22499C0.318741 8.18999 0.127487 8.03249 0.0390351 7.75249C-0.0494168 7.47249 0.0124525 7.23333 0.224643 7.03499L7.44077 0.175C7.49958 0.116667 7.57015 0.0730333 7.65249 0.0440999C7.73482 0.0151666 7.84656 0.000466666 7.98771 0C8.22295 0 8.40245 0.0991666 8.52618 0.2975C8.64992 0.495833 8.65275 0.699999 8.53465 0.909999L6.20573 5.25L10.3872 5.775C10.6813 5.81 10.8725 5.9675 10.961 6.2475C11.0494 6.52749 10.9875 6.76666 10.7754 6.96499L3.55923 13.825C3.50042 13.8833 3.42985 13.9272 3.34751 13.9566C3.26518 13.986 3.15344 14.0005 3.01229 14C2.77705 14 2.59755 13.9008 2.47381 13.7025C2.35008 13.5042 2.34725 13.3 2.46535 13.09L4.79427 8.74999Z" fill="white"/>
            </svg>
            <span className="text-sm leading-none text-white">100% Eléctrico</span>
        </span>
    );
}

function vehicleHref(v: Vehicle) {
    return `/nuevos/${v.slug ?? v.id}`;
}

function vehicleTags(v: Vehicle): string[] {
    return [v.type, v.fuel].filter(Boolean) as string[];
}

function vehiclePrice(v: Vehicle): string {
    // Preferimos el precio "Desde" (menor entre versiones con bono aplicado)
    // que calcula el backend. Fallback al precio de la primera versión.
    const raw = v.desde_price ?? v.versions?.[0]?.price;
    if (! raw) return 'Consultar';
    // El backend guarda solo dígitos (`52990000`); el formato CLP `$52.990.000`
    // se aplica al renderizar. Si por algún motivo el valor ya viene formateado,
    // formatCLP() es idempotente y normaliza igual.
    return formatCLP(raw);
}

// Texto del bono incluido ("Incluye bono $3.000.000") o null si no hay bono.
function vehicleBono(v: Vehicle): string | null {
    if (! v.desde_bono) return null;
    return `Incluye bono ${formatCLP(v.desde_bono)}`;
}

function vehicleElectric(v: Vehicle): boolean {
    return v.versions?.[0]?.electric ?? false;
}

type HeroCardVehicle = Vehicle & { force_electric_badge?: boolean };

type VehicleWithFilter = Vehicle & {
    _filter?: {
        body_type: string | null;
        model_slug: string;
        powertrains: string[];
        transmissions: string[];
        drivetrains: string[];
    };
};

export default function Nuevos({ data, footer, vehicles = [], heroCards: heroCardsProp, filterOptions }: { data: any | null; footer: any | null; vehicles: VehicleWithFilter[]; heroCards?: HeroCardVehicle[]; filterOptions?: FilterOptions }) {
    const [cardsVisible, setCardsVisible] = useState(false);
    const [contentVisible, setContentVisible] = useState(false);
    const [filtersVisible, setFiltersVisible] = useState(true);
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const [viewMode, setViewMode] = useState<ViewMode>('grid');
    const [currentPage, setCurrentPage] = useState(1);
    const [modal360, setModal360] = useState<{ open: boolean; name: string; subtitle: string; frames: string[]; href: string }>({ open: false, name: '', subtitle: '', frames: [], href: '#' });

    // Extrae los frames del visor 360 de un vehículo: usa el primer color
    // que tenga fotos cargadas. Si ninguno tiene, devuelve [] y el modal
    // muestra el estado "sin imágenes 360".
    const get360Frames = (v: any): string[] => {
        const colors = v?.detail_content?.viewer_360?.colors ?? [];
        for (const c of colors) {
            if (Array.isArray(c?.photos) && c.photos.length >= 2) return c.photos;
        }
        return [];
    };

    const open360 = (v: any) => setModal360({
        open: true,
        name: v.name,
        subtitle: v.subtitle ?? '',
        frames: get360Frames(v),
        href: vehicleHref(v),
    });

    // Bloquear scroll del body cuando el drawer está abierto
    useEffect(() => {
        document.body.style.overflow = mobileFiltersOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [mobileFiltersOpen]);

    // Carousel para hero cards mobile
    const [emblaRef, emblaApi] = useEmblaCarousel({ align: 'center', slidesToScroll: 1 });
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

    const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
    const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi]);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setSelectedIndex(emblaApi.selectedScrollSnap());
        setScrollSnaps(emblaApi.scrollSnapList());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        emblaApi.on('select', onSelect);
        emblaApi.on('reInit', onSelect);
        const id = setTimeout(onSelect, 0);
        return () => {
            clearTimeout(id);
            emblaApi.off('select', onSelect);
            emblaApi.off('reInit', onSelect);
        };
    }, [emblaApi, onSelect]);

    useEffect(() => {
        const t1 = setTimeout(() => setCardsVisible(true), 200);
        const t2 = setTimeout(() => setContentVisible(true), 700);
        return () => { clearTimeout(t1); clearTimeout(t2); };
    }, []);

    const heroCards: HeroCardVehicle[] = heroCardsProp && heroCardsProp.length > 0
        ? heroCardsProp
        : vehicles.slice(0, 4);

    // Filtros
    const [filterSelection, setFilterSelection] = useState<FilterSelection>(emptyFilterSelection);
    const toggleFilter = (group: FilterGroupKey, code: string, checked: boolean) => {
        setCurrentPage(1);
        setFilterSelection((prev) => ({
            ...prev,
            [group]: checked
                ? [...prev[group], code]
                : prev[group].filter((c) => c !== code),
        }));
    };
    const clearFilters = () => {
        setFilterSelection(emptyFilterSelection);
        setActiveCategory(null);
        setSortMode('');
    };

    // Categorías destacadas y orden
    const NUEVOS_CATEGORIES = ['Camionetas', 'SUVs', 'Híbridos', 'Eléctricos'] as const;
    type NuevosCategory = typeof NUEVOS_CATEGORIES[number];
    const [activeCategory, setActiveCategory] = useState<NuevosCategory | null>(null);
    const [sortMode, setSortMode] = useState<SortMode>('');
    const [perPage, setPerPage] = useState<PerPage>(15);

    const matchesNuevosCategory = (v: VehicleWithFilter, cat: NuevosCategory): boolean => {
        const f = v._filter;
        const bodyType = (f?.body_type ?? '').toLowerCase();
        const powertrains = f?.powertrains ?? [];
        switch (cat) {
            case 'Camionetas':
                return bodyType.includes('camion') || bodyType.includes('pickup');
            case 'SUVs':
                return bodyType === 'suv' || bodyType.includes('suv');
            case 'Híbridos':
                return powertrains.some((p) => p === 'hev' || p === 'phev' || p.toLowerCase().includes('hybrid') || p.toLowerCase().includes('hibrid'));
            case 'Eléctricos':
                return powertrains.some((p) => p === 'bev' || p.toLowerCase().includes('elec'));
            default:
                return true;
        }
    };

    const filteredVehicles = useMemo(() => {
        const any = (arr: string[]) => arr.length === 0;
        const priceOf = (v: Vehicle) => Number(String(v.versions?.[0]?.price ?? '').replace(/[^0-9]/g, '')) || 0;
        let list = vehicles.filter((v) => {
            const f = v._filter;
            if (!f) return true;
            if (!any(filterSelection.gama) && !filterSelection.gama.includes(f.body_type ?? '')) return false;
            if (!any(filterSelection.modelo) && !filterSelection.modelo.includes(f.model_slug)) return false;
            if (!any(filterSelection.combustible) && !f.powertrains.some((p) => filterSelection.combustible.includes(p))) return false;
            if (!any(filterSelection.transmision) && !f.transmissions.some((t) => filterSelection.transmision.includes(t))) return false;
            if (!any(filterSelection.traccion) && !f.drivetrains.some((d) => filterSelection.traccion.includes(d))) return false;
            if (activeCategory && !matchesNuevosCategory(v, activeCategory)) return false;
            return true;
        });

        if (sortMode === 'price-asc') list = [...list].sort((a, b) => priceOf(a) - priceOf(b));
        else if (sortMode === 'price-desc') list = [...list].sort((a, b) => priceOf(b) - priceOf(a));
        // year/km no aplican a vehículos nuevos (sin esos campos en CatalogPresenter)

        return list;
    }, [vehicles, filterSelection, activeCategory, sortMode]);

    useEffect(() => {
        setCurrentPage(1);
    }, [activeCategory, sortMode]);


    const totalPages = Math.max(1, Math.ceil(filteredVehicles.length / perPage));
    const paginatedVehicles = useMemo(() => {
        const start = (currentPage - 1) * perPage;
        return filteredVehicles.slice(start, start + perPage);
    }, [currentPage, perPage, filteredVehicles]);

    useEffect(() => {
        setCurrentPage(1);
    }, [perPage]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        document.querySelector('[data-products]')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const handleViewModeChange = (mode: ViewMode) => {
        setViewMode(mode);
        setCurrentPage(1);
    };

    return (
        <>
            <Head title="Vehículos Nuevos" />
            <div className="min-h-screen bg-[#EAEAF1]">
                <Navbar variant="white" />
                <div className="px-0 pt-20 pb-20 lg:px-15 lg:pt-15 lg:pb-50">
                    {/* Title section */}
                    <section className="flex flex-col items-center gap-5 self-stretch px-5 py-5 lg:mt-20 lg:gap-0 lg:px-0 lg:py-0">
                        <div className="flex flex-col items-center justify-center gap-0 self-stretch">
                            <h1 className="text-center text-2xl font-semibold leading-normal text-black lg:text-[40px] lg:leading-[150%]" style={{ fontFamily: '"Toyota Type"' }}>
                                Cotiza tu Toyota 0 KM
                            </h1>
                            <p className="relative self-stretch text-center text-base font-normal leading-normal text-black lg:self-auto lg:leading-[150%]" style={{ fontFamily: '"Toyota Type"' }}>
                                Musalem, líder Toyota en la región de Coquimbo.
                            </p>
                        </div>

                        {/* Hero cards — Desktop: 4 cards en fila, Mobile: carousel */}
                        {heroCards.length > 0 && (
                            <>
                                {/* Desktop view */}
                                <div className="mt-10 hidden gap-5 lg:flex">
                                    {heroCards.map((card, i) => (
                                        <div
                                            key={card.id}
                                            className={`group relative h-115 w-78.75 shrink-0 overflow-hidden rounded-[30px] transition-all duration-700 ease-out hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] ${
                                                cardsVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
                                            }`}
                                            style={{ transitionDelay: cardsVisible && !contentVisible ? `${i * 100}ms` : '0ms' }}
                                        >
                                            {card.hero_image ? (
                                                <div
                                                    className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-500 ease-out group-hover:scale-105"
                                                    style={{
                                                        backgroundImage: `radial-gradient(84.02% 84.02% at 50% 48.04%, rgba(0, 0, 0, 0.00) 0%, rgba(0, 0, 0, 0.30) 100%), url(${card.hero_image})`,
                                                    }}
                                                />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center bg-linear-to-b from-black/10 to-black/40">
                                                    <Car className="h-24 w-24 text-white/40" strokeWidth={1.25} />
                                                </div>
                                            )}
                                            <div className="relative flex h-full flex-col items-center justify-between">
                                                <div
                                                    className={`mt-6 flex w-65 flex-col items-center gap-3 transition-all duration-600 ease-out ${
                                                        contentVisible ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'
                                                    }`}
                                                    style={{ transitionDelay: contentVisible ? `${i * 80}ms` : '0ms' }}
                                                >
                                                    {(card.force_electric_badge ?? vehicleElectric(card)) && <ElectricBadge />}
                                                </div>
                                                <div
                                                    className={`mb-3 flex flex-col items-center gap-3 transition-all duration-600 ease-out group-hover:-translate-y-6 ${
                                                        contentVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                                                    }`}
                                                    style={{ transitionDelay: contentVisible ? `${i * 80}ms` : '0ms' }}
                                                >
                                                    <div className="inline-flex flex-col items-center gap-1">
                                                        <span className="text-center text-base leading-none text-white">Desde</span>
                                                        <span className="text-[28px] leading-none text-white">{vehiclePrice(card)}</span>
                                                        {vehicleBono(card) && (
                                                            <span className="text-center text-sm font-semibold leading-none text-white">{vehicleBono(card)}</span>
                                                        )}
                                                    </div>
                                                    <a
                                                        href={vehicleHref(card)}
                                                        className="flex h-10 w-67.75 origin-center scale-x-50 cursor-pointer items-center justify-between rounded-[60px] bg-white p-1 opacity-0 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:bg-white/85 group-hover:scale-x-100 group-hover:opacity-100"
                                                    >
                                                        <span className="pl-4 text-sm leading-none text-black">Ver detalles</span>
                                                        <span className="flex size-7.5 shrink-0 items-center justify-center rounded-[60px] border border-black bg-black transition-transform duration-300 hover:scale-110" style={{ backdropFilter: 'blur(15px)' }}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="11" viewBox="0 0 14 11" fill="none">
                                                                <path d="M0.5 5.5L13.5 5.5M13.5 5.5L8.625 10.5M13.5 5.5L8.625 0.5" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
                                                            </svg>
                                                        </span>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Mobile carousel */}
                                <div className="w-full lg:hidden">
                                    <div className="overflow-hidden px-5">
                                        <div ref={emblaRef} className="overflow-hidden">
                                            <div className="flex">
                                                {heroCards.map((card) => (
                                                    <div key={card.id} className="min-w-0 flex-[0_0_100%] pl-0 pr-5">
                                                        <div className="relative h-115 w-full overflow-hidden rounded-[30px]">
                                                            {card.hero_image ? (
                                                                <div
                                                                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                                                                    style={{
                                                                        backgroundImage: `radial-gradient(84.02% 84.02% at 50% 48.04%, rgba(0, 0, 0, 0.00) 0%, rgba(0, 0, 0, 0.30) 100%), url(${card.hero_image})`,
                                                                    }}
                                                                />
                                                            ) : (
                                                                <div className="absolute inset-0 flex items-center justify-center bg-linear-to-b from-black/10 to-black/40">
                                                                    <Car className="h-24 w-24 text-white/40" strokeWidth={1.25} />
                                                                </div>
                                                            )}
                                                            <div className="relative flex h-full flex-col items-center justify-between">
                                                                <div className="mt-6 flex w-65 flex-col items-center gap-3">
                                                                    {(card.force_electric_badge ?? vehicleElectric(card)) && <ElectricBadge />}
                                                                </div>
                                                                <div className="mb-3 flex flex-col items-center gap-3">
                                                                    <div className="inline-flex flex-col items-center gap-1">
                                                                        <span className="text-center text-base leading-none text-white">Desde</span>
                                                                        <span className="text-[28px] leading-none text-white">{vehiclePrice(card)}</span>
                                                                        {vehicleBono(card) && (
                                                                            <span className="text-center text-sm font-semibold leading-none text-white">{vehicleBono(card)}</span>
                                                                        )}
                                                                    </div>
                                                                    <a
                                                                        href={vehicleHref(card)}
                                                                        className="flex h-10 w-67.75 cursor-pointer items-center justify-between rounded-[60px] bg-white p-1 transition-all duration-300 hover:bg-white/85"
                                                                    >
                                                                        <span className="pl-4 text-sm leading-none text-black">Ver detalles</span>
                                                                        <span className="flex size-7.5 shrink-0 items-center justify-center rounded-[60px] border border-black bg-black" style={{ backdropFilter: 'blur(15px)' }}>
                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="11" viewBox="0 0 14 11" fill="none">
                                                                                <path d="M0.5 5.5L13.5 5.5M13.5 5.5L8.625 10.5M13.5 5.5L8.625 0.5" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
                                                                            </svg>
                                                                        </span>
                                                                    </a>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Paginador carousel */}
                                    <div className="mt-5 flex items-center justify-between px-5">
                                        <button
                                            onClick={scrollPrev}
                                            className="flex size-10 rotate-180 items-center justify-center rounded-[60px] bg-black/20 backdrop-blur-[10px]"
                                            aria-label="Anterior"
                                        >
                                            <ChevronIcon className="h-6 w-3 text-black" />
                                        </button>

                                        <div className="flex items-end justify-center gap-5">
                                            {scrollSnaps.map((_, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => scrollTo(index)}
                                                    className={`rounded-[20px] transition-all ${
                                                        index === selectedIndex
                                                            ? 'h-2.5 w-15 bg-black'
                                                            : 'h-2.5 w-2.5 bg-black/40'
                                                    }`}
                                                    aria-label={`Ir a slide ${index + 1}`}
                                                />
                                            ))}
                                        </div>

                                        <button
                                            onClick={scrollNext}
                                            className="flex size-10 items-center justify-center rounded-[60px] bg-black/20 backdrop-blur-[10px]"
                                            aria-label="Siguiente"
                                        >
                                            <ChevronIcon className="h-6 w-3 text-black" />
                                        </button>
                                    </div>

                                    {/* Botones mobile: Filtros + Comparar */}
                                    <div className="mt-5 flex flex-col gap-2.5 px-5">
                                        <button
                                            onClick={() => setMobileFiltersOpen(true)}
                                            className="flex h-11 items-center justify-center self-stretch rounded-[60px] bg-black px-5"
                                        >
                                            <span className="pb-1 text-base leading-none text-white" style={{ fontFamily: '"Toyota Type"' }}>Filtros</span>
                                        </button>
                                        <a
                                            href="/comparar"
                                            className="flex h-11 items-center justify-center gap-2.5 self-stretch rounded-[60px] border border-black/80 px-5"
                                        >
                                            <CompareIcon />
                                            <span className="pb-1 text-sm leading-none text-black" style={{ fontFamily: '"Toyota Type"' }}>Comparar</span>
                                        </a>
                                    </div>
                                </div>
                            </>
                        )}
                    </section>

                    {/* Categorías destacadas (desktop) */}
                    <div className="mt-10 hidden items-center gap-3.5 overflow-x-auto pb-1 lg:flex [&::-webkit-scrollbar]:hidden">
                        <span className="shrink-0 text-base leading-none text-black">Categorías destacadas:</span>
                        {NUEVOS_CATEGORIES.map((cat) => {
                            const isActive = activeCategory === cat;
                            return (
                                <PillButton
                                    key={cat}
                                    variant={isActive ? 'solid' : 'outline'}
                                    onClick={() => setActiveCategory(isActive ? null : cat)}
                                >
                                    {cat}
                                </PillButton>
                            );
                        })}
                    </div>

                    <Toolbar
                        filtersVisible={filtersVisible}
                        onToggleFilters={() => setFiltersVisible(!filtersVisible)}
                        viewMode={viewMode}
                        onChangeViewMode={handleViewModeChange}
                        sortMode={sortMode}
                        onChangeSort={setSortMode}
                        perPage={perPage}
                        onChangePerPage={setPerPage}
                    />

                    {/* Grid section: filters + products */}
                    <div data-products className="mt-10 flex items-stretch gap-5 overflow-hidden">
                        <div
                            className={`hidden shrink-0 transition-all duration-500 ease-in-out lg:block ${
                                filtersVisible
                                    ? 'w-69.5 opacity-100'
                                    : '-ml-74.5 w-69.5 opacity-0'
                            }`}
                        >
                            {filterOptions && (
                                <NuevosFilters
                                    options={filterOptions}
                                    selection={filterSelection}
                                    onChange={toggleFilter}
                                />
                            )}
                        </div>
                        <div className="flex flex-1 flex-col justify-between transition-all duration-500 ease-in-out">
                            {filteredVehicles.length === 0 ? (
                                <div className="flex flex-1 items-center justify-center py-20 text-black/40">
                                    {vehicles.length === 0
                                        ? 'No hay vehículos disponibles en este momento.'
                                        : 'No hay vehículos que coincidan con los filtros seleccionados.'}
                                </div>
                            ) : (
                                <div>
                                    {viewMode === 'grid' ? (
                                        <div key="grid" className="flex flex-col gap-5 animate-in fade-in slide-in-from-bottom-2 duration-400 lg:flex-row lg:flex-wrap lg:items-start">
                                            {paginatedVehicles.map((v) => (
                                                <NuevosProductCard
                                                    key={`grid-${v.id}`}
                                                    image={v.hero_image ?? ''}
                                                    name={v.name}
                                                    electric={vehicleElectric(v)}
                                                    tags={vehicleTags(v)}
                                                    price={vehiclePrice(v)}
                                                    href={vehicleHref(v)}
                                                    on360Click={() => open360(v)}
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <div key="list" className="flex flex-col gap-5 animate-in fade-in slide-in-from-bottom-2 duration-400">
                                            {paginatedVehicles.map((v) => (
                                                <NuevosListItem
                                                    key={`list-${v.id}`}
                                                    image={v.hero_image ?? ''}
                                                    name={v.name}
                                                    electric={vehicleElectric(v)}
                                                    tags={vehicleTags(v)}
                                                    price={vehiclePrice(v)}
                                                    href={vehicleHref(v)}
                                                    on360Click={() => open360(v)}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                        </div>
                    </div>
                </div>

                {footer && <Footer data={footer} />}
            </div>

            <Modal360
                open={modal360.open}
                onClose={() => setModal360({ ...modal360, open: false })}
                name={modal360.name}
                subtitle={modal360.subtitle}
                frames={modal360.frames}
                detailHref={modal360.href}
            />

            {/* Drawer de filtros mobile */}
            <div
                className={`fixed inset-0 z-50 flex w-screen flex-col overflow-hidden bg-white transition-transform duration-300 ease-out lg:hidden ${
                    mobileFiltersOpen ? 'translate-y-0' : 'translate-y-full'
                }`}
            >
                {/* Header */}
                <div className="flex w-full shrink-0 items-center justify-between px-5 pb-5 pt-15 shadow-[0_4px_10px_rgba(0,0,0,0.05)]">
                    <span className="text-base font-bold uppercase leading-none text-black" style={{ fontFamily: '"Toyota Type"' }}>
                        Filtros
                    </span>
                    <button
                        onClick={() => setMobileFiltersOpen(false)}
                        className="flex size-[54px] items-center justify-center rounded-[30px] border border-black/10 bg-white"
                        aria-label="Cerrar filtros"
                    >
                        <X className="size-6 text-black" />
                    </button>
                </div>

                {/* Contenido scrolleable */}
                <div className="min-h-0 flex-1 overflow-y-auto">
                    <div className="w-full px-5 py-5 pb-15">
                        {filterOptions && (
                            <NuevosFilters
                                options={filterOptions}
                                selection={filterSelection}
                                onChange={toggleFilter}
                            />
                        )}
                    </div>
                </div>

                {/* Footer con acciones */}
                <div className="flex shrink-0 flex-col gap-2.5 bg-white px-2.5 pb-10 pt-5 shadow-[0_-3px_20px_rgba(0,0,0,0.05)]">
                    <button
                        onClick={clearFilters}
                        className="flex h-12 items-center justify-center self-stretch rounded-[60px] border border-black bg-white px-1"
                    >
                        <span className="text-base leading-none text-black" style={{ fontFamily: '"Toyota Type"' }}>Limpiar filtros</span>
                    </button>
                    <button
                        onClick={() => setMobileFiltersOpen(false)}
                        className="flex h-12 items-center justify-center self-stretch rounded-[60px] bg-black px-1"
                    >
                        <span className="text-base leading-none text-white" style={{ fontFamily: '"Toyota Type"' }}>
                            {filteredVehicles.length} Modelos disponibles
                        </span>
                    </button>
                </div>
            </div>
        </>
    );
}
