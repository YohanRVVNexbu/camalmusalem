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
import { vehicles } from '@/data/vehicles';
import { useMemo, useState } from 'react';

type SeminuevosData = {
    banner_image: string;
    title: string;
    description: string;
    filters: string[];
    vehicles: any[];
};

export default function Seminuevos({ data, footer }: { data: SeminuevosData; footer: any }) {
    const [filtersVisible, setFiltersVisible] = useState(true);
    const [viewMode, setViewMode] = useState<ViewMode>('grid');
    const [currentPage, setCurrentPage] = useState(1);

    const ITEMS_PER_PAGE_GRID = 9;
    const ITEMS_PER_PAGE_LIST = 6;

    const itemsPerPage = viewMode === 'grid' ? ITEMS_PER_PAGE_GRID : ITEMS_PER_PAGE_LIST;
    const totalPages = Math.ceil(vehicles.length / itemsPerPage);
    const paginatedVehicles = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return vehicles.slice(start, start + itemsPerPage);
    }, [currentPage, itemsPerPage]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        // Scroll to toolbar area
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
                            <div>
                                {viewMode === 'grid' ? (
                                    <div key="grid" className="flex flex-wrap items-start gap-5 animate-in fade-in slide-in-from-bottom-2 duration-400">
                                        {paginatedVehicles.map((v) => (
                                            <ProductCard key={`grid-${v.id}`} {...v} href={`/seminuevos/${v.id}`} />
                                        ))}
                                    </div>
                                ) : (
                                    <div key="list" className="flex flex-col gap-5 animate-in fade-in slide-in-from-bottom-2 duration-400">
                                        {paginatedVehicles.map((v) => (
                                            <ProductListItem key={`list-${v.id}`} {...v} href={`/seminuevos/${v.id}`} />
                                        ))}
                                    </div>
                                )}
                            </div>
                            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                        </div>
                    </div>
                </div>

                {footer && <Footer data={footer} />}
            </div>
        </>
    );
}
