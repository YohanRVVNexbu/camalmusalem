import { Head } from '@inertiajs/react';
import { Footer } from '@/components/landing/footer';
import { Navbar } from '@/components/landing/navbar';
import { Categories } from '@/components/seminuevos/categories';
import { Filters } from '@/components/seminuevos/filters';
import { Hero } from '@/components/seminuevos/hero';
import { ProductCard } from '@/components/seminuevos/product-card';
import { ProductListItem } from '@/components/seminuevos/product-list-item';
import { Toolbar, type ViewMode } from '@/components/seminuevos/toolbar';
import { Pagination } from '@/components/seminuevos/pagination';
import { useMemo, useState } from 'react';

type Seminuevo = {
    id: number;
    slug: string | null;
    brand: string;
    model: string;
    year: number;
    km: number;
    price: string;
    fuel: string;
    transmission: string;
    color: string;
    description: string;
    gallery: string[];
};

function formatKm(km: number) {
    return km.toLocaleString('es-CL') + ' km';
}

export default function Seminuevos({ data, footer, seminuevos = [] }: { data: any; footer: any; seminuevos: Seminuevo[] }) {
    const [filtersVisible, setFiltersVisible] = useState(true);
    const [viewMode, setViewMode] = useState<ViewMode>('grid');
    const [currentPage, setCurrentPage] = useState(1);

    const ITEMS_PER_PAGE_GRID = 9;
    const ITEMS_PER_PAGE_LIST = 6;

    const itemsPerPage = viewMode === 'grid' ? ITEMS_PER_PAGE_GRID : ITEMS_PER_PAGE_LIST;
    const totalPages = Math.ceil(seminuevos.length / itemsPerPage);
    const paginated = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return seminuevos.slice(start, start + itemsPerPage);
    }, [currentPage, itemsPerPage, seminuevos]);

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
            <Head title="Seminuevos" />
            <div className="min-h-screen bg-[#EAEAF1]">
                <Navbar variant="white" />
                <div style={{ padding: '60px 60px 200px 60px' }}>
                    <Hero />
                    <Categories />
                    <Toolbar filtersVisible={filtersVisible} onToggleFilters={() => setFiltersVisible(!filtersVisible)} viewMode={viewMode} onChangeViewMode={handleViewModeChange} />

                    {/* Grid section: filters + products */}
                    <div data-products className="mt-10 flex items-stretch gap-5 overflow-hidden">
                        <div
                            className={`shrink-0 transition-all duration-500 ease-in-out ${
                                filtersVisible
                                    ? 'w-69.5 opacity-100'
                                    : '-ml-74.5 w-69.5 opacity-0'
                            }`}
                        >
                            <Filters />
                        </div>
                        <div className="flex flex-1 flex-col justify-between transition-all duration-500 ease-in-out">
                            {seminuevos.length === 0 ? (
                                <div className="flex flex-1 items-center justify-center py-20 text-black/40">
                                    No hay seminuevos disponibles en este momento.
                                </div>
                            ) : (
                                <div>
                                    {viewMode === 'grid' ? (
                                        <div key="grid" className="flex flex-wrap items-start gap-5 animate-in fade-in slide-in-from-bottom-2 duration-400">
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
                                                    price={v.price}
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
                                                    price={v.price}
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
        </>
    );
}
