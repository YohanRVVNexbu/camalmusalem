import { Head } from '@inertiajs/react';
import { Footer } from '@/components/landing/footer';
import { Navbar } from '@/components/landing/navbar';
import NuevosFilters, { FilterGroupKey, FilterOptions, FilterSelection, emptyFilterSelection } from '@/components/nuevos/filters';
import { Toolbar, type ViewMode } from '@/components/seminuevos/toolbar';
import { Pagination } from '@/components/seminuevos/pagination';
import { NuevosProductCard } from '@/components/nuevos/product-card';
import { NuevosListItem } from '@/components/nuevos/product-list-item';
import { Modal360 } from '@/components/nuevos/modal-360';
import { Car } from 'lucide-react';
import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';

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
    return v.versions?.[0]?.price || 'Consultar';
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

export default function Nuevos({ data, footer, vehicles = [], heroCards: heroCardsProp, filterOptions }: { data: any; footer: any; vehicles: VehicleWithFilter[]; heroCards?: HeroCardVehicle[]; filterOptions?: FilterOptions }) {
    const [cardsVisible, setCardsVisible] = useState(false);
    const [contentVisible, setContentVisible] = useState(false);
    const [filtersVisible, setFiltersVisible] = useState(true);
    const [viewMode, setViewMode] = useState<ViewMode>('grid');
    const [currentPage, setCurrentPage] = useState(1);
    const [modal360, setModal360] = useState<{ open: boolean; name: string; subtitle: string }>({ open: false, name: '', subtitle: '' });

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
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        setScrollSnaps(emblaApi.scrollSnapList());
        emblaApi.on('select', onSelect);
        emblaApi.on('reInit', onSelect);
        onSelect();
        return () => {
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

    const filteredVehicles = useMemo(() => {
        const any = (arr: string[]) => arr.length === 0;
        return vehicles.filter((v) => {
            const f = v._filter;
            if (!f) return true;
            if (!any(filterSelection.gama) && !filterSelection.gama.includes(f.body_type ?? '')) return false;
            if (!any(filterSelection.modelo) && !filterSelection.modelo.includes(f.model_slug)) return false;
            if (!any(filterSelection.combustible) && !f.powertrains.some((p) => filterSelection.combustible.includes(p))) return false;
            if (!any(filterSelection.transmision) && !f.transmissions.some((t) => filterSelection.transmision.includes(t))) return false;
            if (!any(filterSelection.traccion) && !f.drivetrains.some((d) => filterSelection.traccion.includes(d))) return false;

            return true;
        });
    }, [vehicles, filterSelection]);

    // Paginación dinámica: calcula cuántas filas entran en el alto de los filtros.
    // Ajusta itemsPerPage para que la grilla no sobrepase la altura del sidebar.
    const filtersRef = useRef<HTMLDivElement | null>(null);
    const [filtersHeight, setFiltersHeight] = useState(0);

    useEffect(() => {
        if (!filtersRef.current) return;
        const el = filtersRef.current;
        const obs = new ResizeObserver(([entry]) => setFiltersHeight(entry.contentRect.height));
        obs.observe(el);
        setFiltersHeight(el.offsetHeight);
        return () => obs.disconnect();
    }, [filtersVisible]);

    const GRID_COLS = 4;
    const GRID_ROW_HEIGHT = 340; // card + gap aprox
    const LIST_ROW_HEIGHT = 196; // list item + gap aprox

    const itemsPerPage = useMemo(() => {
        if (filtersHeight < 100) {
            return viewMode === 'grid' ? GRID_COLS * 2 : 4;
        }
        if (viewMode === 'grid') {
            const rows = Math.max(1, Math.floor(filtersHeight / GRID_ROW_HEIGHT));
            return rows * GRID_COLS;
        }
        return Math.max(1, Math.floor(filtersHeight / LIST_ROW_HEIGHT));
    }, [filtersHeight, viewMode]);
    const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage);
    const paginatedVehicles = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredVehicles.slice(start, start + itemsPerPage);
    }, [currentPage, itemsPerPage, filteredVehicles]);

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
                                                    <span className="text-center text-2xl font-semibold uppercase leading-none text-white drop-shadow">
                                                        {card.name}
                                                    </span>
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
                                                                    <span className="text-center text-2xl font-semibold uppercase leading-none text-white drop-shadow">
                                                                        {card.name}
                                                                    </span>
                                                                    {(card.force_electric_badge ?? vehicleElectric(card)) && <ElectricBadge />}
                                                                </div>
                                                                <div className="mb-3 flex flex-col items-center gap-3">
                                                                    <div className="inline-flex flex-col items-center gap-1">
                                                                        <span className="text-center text-base leading-none text-white">Desde</span>
                                                                        <span className="text-[28px] leading-none text-white">{vehiclePrice(card)}</span>
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

                                    {/* Pagination */}
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
                                </div>
                            </>
                        )}
                    </section>

                    <Toolbar filtersVisible={filtersVisible} onToggleFilters={() => setFiltersVisible(!filtersVisible)} viewMode={viewMode} onChangeViewMode={handleViewModeChange} />

                    {/* Grid section: filters + products */}
                    <div data-products className="mt-10 flex items-stretch gap-5 overflow-hidden">
                        <div
                            ref={filtersRef}
                            className={`shrink-0 transition-all duration-500 ease-in-out ${
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
                                        <div key="grid" className="flex flex-wrap items-start gap-5 animate-in fade-in slide-in-from-bottom-2 duration-400">
                                            {paginatedVehicles.map((v) => (
                                                <NuevosProductCard
                                                    key={`grid-${v.id}`}
                                                    image={v.hero_image ?? ''}
                                                    name={v.name}
                                                    electric={vehicleElectric(v)}
                                                    tags={vehicleTags(v)}
                                                    price={vehiclePrice(v)}
                                                    href={vehicleHref(v)}
                                                    on360Click={() => setModal360({ open: true, name: v.name, subtitle: v.subtitle ?? '' })}
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
                                                    on360Click={() => setModal360({ open: true, name: v.name, subtitle: v.subtitle ?? '' })}
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
            />
        </>
    );
}
