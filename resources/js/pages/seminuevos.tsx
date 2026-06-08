import { X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Head } from '@inertiajs/react';
import { Footer } from '@/components/landing/footer';
import { Navbar } from '@/components/landing/navbar';
import { Categories, type SeminuevoCategory } from '@/components/seminuevos/categories';
import { Filters, emptySeminuevoFilterState, type SeminuevoFilterState } from '@/components/seminuevos/filters';
import { Hero } from '@/components/seminuevos/hero';
import { Pagination } from '@/components/seminuevos/pagination';
import { ProductCard } from '@/components/seminuevos/product-card';
import { ProductListItem } from '@/components/seminuevos/product-list-item';
import { Toolbar } from '@/components/seminuevos/toolbar';
import type { PerPage, SortMode, ViewMode } from '@/components/seminuevos/toolbar';
import certificateImg from '@images/seminuevos/certificate-toyota.png?format=webp';

type Seminuevo = {
    id: number;
    slug: string | null;
    brand: string;
    model: string;
    year: number;
    km: number;
    price: string;
    price_offer?: string | null;
    certified?: boolean;
    fuel: string;
    transmission: string;
    color: string;
    description: string;
    gallery: string[];
    body_type?: string | null;
};

function formatKm(km: number) {
    return km.toLocaleString('es-CL') + ' km';
}

function matchesCategory(v: Seminuevo, category: SeminuevoCategory): boolean {
    const fuel = v.fuel.toLowerCase();
    const priceN = Number(String(v.price).replace(/[^0-9]/g, ''));
    switch (category) {
        case 'Camionetas':
            return (v.body_type ?? '').toLowerCase().includes('camion')
                || (v.body_type ?? '').toLowerCase().includes('pickup')
                || v.model.toLowerCase().includes('hilux');
        case 'Híbridos':
            return fuel.includes('híbrido') || fuel.includes('hibrido');
        case 'Eléctricos':
            return fuel.includes('eléctrico') || fuel.includes('electrico');
        case 'Menos de $10mm':
            return priceN > 0 && priceN < 10_000_000;
        case 'Año 2024 +':
            return v.year >= 2024;
        default:
            return true;
    }
}

export default function Seminuevos({ data, footer, seminuevos = [] }: { data: any | null; footer: any | null; seminuevos: Seminuevo[] }) {
    // El logo de certificado lo administra el cliente desde /admin/paginas/seminuevos.
    // Si no subió uno, usamos el sello estático por defecto.
    const certBadge = data?.certificate_badge || certificateImg;
    const [filtersVisible, setFiltersVisible] = useState(true);
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const [viewMode, setViewMode] = useState<ViewMode>('grid');
    const [currentPage, setCurrentPage] = useState(1);

    // Estado de filtros, categoría destacada, orden y elementos por página
    const [filterState, setFilterState] = useState<SeminuevoFilterState>(emptySeminuevoFilterState);
    const [activeCategory, setActiveCategory] = useState<SeminuevoCategory | null>(null);
    const [sortMode, setSortMode] = useState<SortMode>('');
    const [perPage, setPerPage] = useState<PerPage>(15);

    useEffect(() => {
        document.body.style.overflow = mobileFiltersOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [mobileFiltersOpen]);

    // Opciones del filtro derivadas del data real (no hardcodeadas).
    const filterOptions = useMemo(() => {
        const uniq = (arr: string[]) => Array.from(new Set(arr.filter(Boolean))).sort();
        const years = Array.from(new Set(seminuevos.map((v) => v.year))).sort((a, b) => b - a);
        return {
            brands: uniq(seminuevos.map((v) => v.brand)),
            years,
            transmissions: uniq(seminuevos.map((v) => v.transmission)),
            fuels: uniq(seminuevos.map((v) => v.fuel)),
            colors: uniq(seminuevos.map((v) => v.color)),
        };
    }, [seminuevos]);

    // Aplica filtros + categoría destacada + orden.
    const filteredSorted = useMemo(() => {
        const priceOf = (v: Seminuevo) => Number(String(v.price).replace(/[^0-9]/g, '')) || 0;
        let list = seminuevos.filter((v) => {
            if (filterState.brands.length && !filterState.brands.includes(v.brand)) return false;
            if (filterState.yearFrom !== null && v.year < filterState.yearFrom) return false;
            if (filterState.yearTo !== null && v.year > filterState.yearTo) return false;
            if (filterState.kmFrom !== null && v.km < filterState.kmFrom) return false;
            if (filterState.kmTo !== null && v.km > filterState.kmTo) return false;
            const p = priceOf(v);
            if (filterState.priceFrom !== null && p < filterState.priceFrom) return false;
            if (filterState.priceTo !== null && p > filterState.priceTo) return false;
            if (filterState.transmissions.length && !filterState.transmissions.includes(v.transmission)) return false;
            if (filterState.fuels.length && !filterState.fuels.includes(v.fuel)) return false;
            if (filterState.colors.length && !filterState.colors.includes(v.color)) return false;
            if (activeCategory && !matchesCategory(v, activeCategory)) return false;
            return true;
        });

        if (sortMode === 'price-asc') list = [...list].sort((a, b) => priceOf(a) - priceOf(b));
        else if (sortMode === 'price-desc') list = [...list].sort((a, b) => priceOf(b) - priceOf(a));
        else if (sortMode === 'year-desc') list = [...list].sort((a, b) => b.year - a.year);
        else if (sortMode === 'year-asc') list = [...list].sort((a, b) => a.year - b.year);
        else if (sortMode === 'km-asc') list = [...list].sort((a, b) => a.km - b.km);

        return list;
    }, [seminuevos, filterState, activeCategory, sortMode]);

    // Cualquier cambio de filtros/orden/perPage vuelve a la página 1.
    useEffect(() => {
        setCurrentPage(1);
    }, [filterState, activeCategory, sortMode, viewMode, perPage]);

    const totalPages = Math.max(1, Math.ceil(filteredSorted.length / perPage));
    const paginated = useMemo(() => {
        const start = (currentPage - 1) * perPage;
        return filteredSorted.slice(start, start + perPage);
    }, [currentPage, perPage, filteredSorted]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        document.querySelector('[data-products]')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const clearAllFilters = () => {
        setFilterState(emptySeminuevoFilterState);
        setActiveCategory(null);
        setSortMode('');
    };

    return (
        <>
            <Head title="Seminuevos" />
            <div className="min-h-screen bg-[#EAEAF1]">
                <Navbar variant="white" />
                <div className="px-5 pt-25 pb-20 lg:px-15 lg:pt-15 lg:pb-50">
                    <Hero
                        image={data?.banner_image}
                        imageMobile={data?.banner_image_mobile}
                        sectionTitle={data?.section_title}
                        title={data?.title}
                        description={data?.description}
                    />
                    <Categories active={activeCategory} onChange={setActiveCategory} />

                    {/* Botones mobile: Filtros + Comparar */}
                    <div className="mt-5 flex flex-col gap-2.5 lg:hidden">
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
                            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="15" viewBox="0 0 26 15" fill="none">
                                <g clipPath="url(#clip_semi_compare)">
                                    <path d="M13.6537 4.16814C13.6525 4.61995 13.2941 4.90725 12.8899 4.89148C12.4857 4.8757 12.1813 4.56023 12.1807 4.13716L12.1783 1.42635C9.66541 1.57619 7.27183 2.51698 5.38035 4.10561L7.30566 5.91282C7.603 6.19224 7.61131 6.62601 7.32643 6.90318C7.04155 7.18035 6.58278 7.19781 6.27001 6.90431L4.33817 5.09484C2.66688 6.8829 1.67336 9.14529 1.50718 11.5575L5.55781 11.5558C5.99522 11.5558 6.31927 11.8358 6.33648 12.2268C6.3525 12.5851 6.05753 12.9501 5.61597 12.9507L0.75522 12.9524C0.295852 12.9529 0.00919265 12.598 0.0103796 12.2307C0.0269976 5.43229 5.84684 0.0157305 12.8887 0.00052019C19.9579 -0.0146901 25.8062 5.40975 25.8264 12.2307C25.8276 12.6014 25.5415 12.9518 25.0815 12.9518L20.2795 12.9535C19.8374 12.9535 19.5133 12.6696 19.4997 12.2752C19.486 11.8809 19.8225 11.5553 20.2772 11.5558L24.3284 11.5587C24.1634 9.15599 23.1865 6.91726 21.5081 5.10048L19.6564 6.87332C19.3715 7.14654 18.9329 7.15894 18.6367 6.91163C18.3797 6.697 18.2688 6.23167 18.5643 5.94493L20.4617 4.10674C18.5768 2.54008 16.2307 1.58408 13.6608 1.42409L13.6525 4.16814H13.6537Z" fill="black"/>
                                    <path d="M14.7254 10.828C15.3409 11.6555 15.4317 12.6318 14.8518 13.4774C14.3283 14.2396 13.3075 14.6559 12.2772 14.3877C11.3644 14.15 10.7187 13.4114 10.5537 12.4386C10.2486 10.6404 10.0474 8.85568 9.8504 7.03721C9.81183 6.67836 9.97088 6.38147 10.2967 6.24684C10.6457 6.10262 10.9834 6.23895 11.2303 6.53076C12.4297 7.94701 13.6067 9.32382 14.7254 10.8285V10.828ZM13.5859 11.7355C12.9508 10.8618 12.3289 10.0596 11.6018 9.23594C11.695 10.3142 11.8481 11.2837 12.0303 12.2915C12.0974 12.6639 12.3389 12.9467 12.6559 13.0351C13.044 13.1439 13.4138 12.9805 13.5995 12.7354C13.8292 12.4318 13.8173 12.0532 13.5865 11.7361L13.5859 11.7355Z" fill="black"/>
                                </g>
                                <defs>
                                    <clipPath id="clip_semi_compare">
                                        <rect width="25.159" height="14.8544" fill="white"/>
                                    </clipPath>
                                </defs>
                            </svg>
                            <span className="pb-1 text-sm leading-none text-black" style={{ fontFamily: '"Toyota Type"' }}>Comparar</span>
                        </a>
                    </div>

                    <Toolbar
                        filtersVisible={filtersVisible}
                        onToggleFilters={() => setFiltersVisible(!filtersVisible)}
                        viewMode={viewMode}
                        onChangeViewMode={setViewMode}
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
                            <Filters state={filterState} onChange={setFilterState} options={filterOptions} />
                        </div>
                        <div className="flex flex-1 flex-col justify-between transition-all duration-500 ease-in-out">
                            {filteredSorted.length === 0 ? (
                                <div className="flex flex-1 items-center justify-center py-20 text-black/40">
                                    {seminuevos.length === 0
                                        ? 'No hay seminuevos disponibles en este momento.'
                                        : 'No se encontraron vehículos con los filtros aplicados.'}
                                </div>
                            ) : (
                                <div>
                                    {viewMode === 'grid' ? (
                                        <div key="grid" className="flex flex-col gap-5 animate-in fade-in slide-in-from-bottom-2 duration-400 lg:flex-row lg:flex-wrap lg:items-start">
                                            {paginated.map((v) => (
                                                <ProductCard
                                                    key={`grid-${v.id}`}
                                                    image={v.gallery?.[0] ?? ''}
                                                    badge={String(v.year)}
                                                    year={String(v.year)}
                                                    brand={v.brand}
                                                    name={v.model}
                                                    km={formatKm(v.km)}
                                                    transmission={v.transmission}
                                                    fuel={v.fuel}
                                                    price={v.price_offer || v.price}
                                                    originalPrice={v.price_offer ? v.price : undefined}
                                                    certificateBadge={v.certified ? certBadge : undefined}
                                                    href={`/seminuevos/${v.slug ?? v.id}`}
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <div key="list" className="flex flex-col gap-5 animate-in fade-in slide-in-from-bottom-2 duration-400">
                                            {paginated.map((v) => (
                                                <ProductListItem
                                                    key={`list-${v.id}`}
                                                    image={v.gallery?.[0] ?? ''}
                                                    badge={String(v.year)}
                                                    year={String(v.year)}
                                                    brand={v.brand}
                                                    name={v.model}
                                                    km={formatKm(v.km)}
                                                    transmission={v.transmission}
                                                    fuel={v.fuel}
                                                    price={v.price_offer || v.price}
                                                    originalPrice={v.price_offer ? v.price : undefined}
                                                    certificateBadge={v.certified ? certBadge : undefined}
                                                    href={`/seminuevos/${v.slug ?? v.id}`}
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

            {/* Drawer de filtros mobile */}
            <div
                className={`fixed inset-0 z-50 flex w-screen flex-col overflow-hidden bg-white transition-transform duration-300 ease-out lg:hidden ${
                    mobileFiltersOpen ? 'translate-y-0' : 'translate-y-full'
                }`}
            >
                <div className="flex w-full shrink-0 items-center justify-between px-5 pb-5 pt-15 shadow-[0_4px_10px_rgba(0,0,0,0.05)]">
                    <span className="text-base font-bold uppercase leading-none text-black" style={{ fontFamily: '"Toyota Type"' }}>
                        Filtros
                    </span>
                    <button
                        onClick={() => setMobileFiltersOpen(false)}
                        className="flex size-13.5 items-center justify-center rounded-[30px] border border-black/10 bg-white"
                        aria-label="Cerrar filtros"
                    >
                        <X className="size-6 text-black" />
                    </button>
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto">
                    <div className="w-full px-5 py-5 pb-15">
                        <Filters variant="drawer" state={filterState} onChange={setFilterState} options={filterOptions} />
                    </div>
                </div>

                <div className="flex shrink-0 flex-col gap-2.5 bg-white px-2.5 pb-10 pt-5 shadow-[0_-3px_20px_rgba(0,0,0,0.05)]">
                    <button
                        onClick={clearAllFilters}
                        className="flex h-12 items-center justify-center self-stretch rounded-[60px] border border-black bg-white px-1"
                    >
                        <span className="text-base leading-none text-black" style={{ fontFamily: '"Toyota Type"' }}>Limpiar filtros</span>
                    </button>
                    <button
                        onClick={() => setMobileFiltersOpen(false)}
                        className="flex h-12 items-center justify-center self-stretch rounded-[60px] bg-black px-1"
                    >
                        <span className="text-base leading-none text-white" style={{ fontFamily: '"Toyota Type"' }}>
                            {filteredSorted.length} Vehículos disponibles
                        </span>
                    </button>
                </div>
            </div>
        </>
    );
}
