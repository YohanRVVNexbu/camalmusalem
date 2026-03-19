import { Head } from '@inertiajs/react';
import { Footer } from '@/components/landing/footer';
import { Navbar } from '@/components/landing/navbar';
import { WhatsappButton } from '@/components/landing/whatsapp-button';
import { Categories } from '@/components/seminuevos/categories';
import { Filters } from '@/components/seminuevos/filters';
import { Hero } from '@/components/seminuevos/hero';
import { ProductCard } from '@/components/seminuevos/product-card';
import { ProductListItem } from '@/components/seminuevos/product-list-item';
import { Toolbar, type ViewMode } from '@/components/seminuevos/toolbar';
import cardExample1 from '@images/seminuevos/card-example-1.png?format=webp';
import cardExample2 from '@images/seminuevos/card-example-2.png?format=webp';
import certificateBadge from '@images/seminuevos/certificate-toyota.png?format=webp';
import { Pagination } from '@/components/seminuevos/pagination';
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

    const vehicles = [
        { image: cardExample1, badge: 'Seminuevo', year: '2024', brand: 'BMW', name: 'Bmw x1 sdrive 18l 1.5 T\nConfort', km: '53.000 Km', transmission: 'AT', fuel: 'Híbrido', price: '$ 29.990.000' },
        { image: cardExample2, badge: 'Seminuevo', year: '2024', brand: 'TOYOTA', name: 'Toyota Yaris Cross XI\n1.5 ECVT Híbrido', km: '53.000 Km', transmission: 'AT', fuel: 'Eléctrico', originalPrice: '$ 22.590.000', price: '$ 21.990.000', certificateBadge },
        { image: cardExample1, badge: 'Seminuevo', year: '2023', brand: 'BMW', name: 'Bmw x1 sdrive 18l 1.5 T\nConfort', km: '45.000 Km', transmission: 'AT', fuel: 'Diesel', price: '$ 29.990.000' },
        { image: cardExample2, badge: 'Seminuevo', year: '2022', brand: 'TOYOTA', name: 'Toyota Corolla Cross\n2.0 SEG CVT', km: '32.000 Km', transmission: 'CVT', fuel: 'Gasolina', price: '$ 22.490.000', certificateBadge },
        { image: cardExample1, badge: 'Seminuevo', year: '2024', brand: 'TOYOTA', name: 'Toyota Hilux 2.8 SRX\n4x4 AT', km: '12.000 Km', transmission: 'AT', fuel: 'Diesel', originalPrice: '$ 36.990.000', price: '$ 35.990.000', certificateBadge },
        { image: cardExample2, badge: 'Seminuevo', year: '2023', brand: 'Honda', name: 'Honda CR-V 1.5T\nEX-L AWD', km: '28.000 Km', transmission: 'CVT', fuel: 'Gasolina', price: '$ 27.490.000' },
        { image: cardExample1, badge: 'Seminuevo', year: '2024', brand: 'TOYOTA', name: 'Toyota RAV4 2.5\nHybrid XLE', km: '18.000 Km', transmission: 'CVT', fuel: 'Híbrido', price: '$ 31.490.000', certificateBadge },
        { image: cardExample2, badge: 'Seminuevo', year: '2022', brand: 'Mitsubishi', name: 'Mitsubishi L200 2.4\nDI-D Katana', km: '41.000 Km', transmission: 'AT', fuel: 'Diesel', price: '$ 23.990.000' },
        { image: cardExample1, badge: 'Seminuevo', year: '2023', brand: 'TOYOTA', name: 'Toyota BZ4X\n100% Eléctrico', km: '9.500 Km', transmission: 'AT', fuel: 'Eléctrico', originalPrice: '$ 34.990.000', price: '$ 32.990.000', certificateBadge },
        { image: cardExample2, badge: 'Seminuevo', year: '2021', brand: 'Citroen', name: 'Citroen C5 Aircross\n1.6T Feel Pack', km: '52.000 Km', transmission: 'AT', fuel: 'Gasolina', price: '$ 18.990.000' },
        { image: cardExample1, badge: 'Seminuevo', year: '2024', brand: 'TOYOTA', name: 'Toyota Land Cruiser\nPrado VX', km: '8.000 Km', transmission: 'AT', fuel: 'Diesel', price: '$ 48.990.000', certificateBadge },
        { image: cardExample2, badge: 'Seminuevo', year: '2023', brand: 'TOYOTA', name: 'Toyota Yaris 1.5\nSport GLi', km: '22.000 Km', transmission: 'MT', fuel: 'Gasolina', price: '$ 12.990.000', certificateBadge },
        { image: cardExample1, badge: 'Seminuevo', year: '2022', brand: 'BMW', name: 'BMW Serie 3 320i\nSport Line', km: '38.000 Km', transmission: 'AT', fuel: 'Gasolina', price: '$ 33.490.000' },
        { image: cardExample2, badge: 'Seminuevo', year: '2024', brand: 'TOYOTA', name: 'Toyota Camry 2.5\nHybrid LE', km: '5.000 Km', transmission: 'CVT', fuel: 'Híbrido', price: '$ 28.990.000', certificateBadge },
        { image: cardExample1, badge: 'Seminuevo', year: '2023', brand: 'Hyundai', name: 'Hyundai Tucson 2.0\nGLS AT', km: '25.000 Km', transmission: 'AT', fuel: 'Gasolina', price: '$ 22.990.000' },
        { image: cardExample2, badge: 'Seminuevo', year: '2022', brand: 'TOYOTA', name: 'Toyota Fortuner 2.8\n4x4 SRV', km: '35.000 Km', transmission: 'AT', fuel: 'Diesel', price: '$ 39.990.000', certificateBadge },
        { image: cardExample1, badge: 'Seminuevo', year: '2024', brand: 'Kia', name: 'Kia Sportage 1.6T\nGT-Line AWD', km: '10.000 Km', transmission: 'AT', fuel: 'Gasolina', originalPrice: '$ 27.990.000', price: '$ 26.490.000' },
        { image: cardExample2, badge: 'Seminuevo', year: '2023', brand: 'TOYOTA', name: 'Toyota Corolla 1.8\nHybrid SEG', km: '15.000 Km', transmission: 'CVT', fuel: 'Híbrido', price: '$ 24.990.000', certificateBadge },
        { image: cardExample1, badge: 'Seminuevo', year: '2021', brand: 'Nissan', name: 'Nissan X-Trail 2.5\nExclusive CVT', km: '48.000 Km', transmission: 'CVT', fuel: 'Gasolina', price: '$ 19.990.000' },
        { image: cardExample2, badge: 'Seminuevo', year: '2024', brand: 'TOYOTA', name: 'Toyota SW4 2.8 SRX\n4x4 AT', km: '6.000 Km', transmission: 'AT', fuel: 'Diesel', price: '$ 45.990.000', certificateBadge },
        { image: cardExample1, badge: 'Seminuevo', year: '2023', brand: 'Mazda', name: 'Mazda CX-5 2.0\nGT AWD', km: '20.000 Km', transmission: 'AT', fuel: 'Gasolina', price: '$ 26.990.000' },
        { image: cardExample2, badge: 'Seminuevo', year: '2022', brand: 'TOYOTA', name: 'Toyota Hilux 2.4\nDX 4x2', km: '55.000 Km', transmission: 'MT', fuel: 'Diesel', price: '$ 21.490.000', certificateBadge },
        { image: cardExample1, badge: 'Seminuevo', year: '2024', brand: 'Suzuki', name: 'Suzuki Vitara 1.4T\nGLX AllGrip', km: '7.500 Km', transmission: 'AT', fuel: 'Gasolina', originalPrice: '$ 20.990.000', price: '$ 19.490.000' },
        { image: cardExample2, badge: 'Seminuevo', year: '2023', brand: 'TOYOTA', name: 'Toyota RAV4 Prime\nPlug-in Hybrid', km: '11.000 Km', transmission: 'CVT', fuel: 'Híbrido', price: '$ 38.990.000', certificateBadge },
        { image: cardExample1, badge: 'Seminuevo', year: '2022', brand: 'Chevrolet', name: 'Chevrolet Tracker 1.2T\nPremier AT', km: '30.000 Km', transmission: 'AT', fuel: 'Gasolina', price: '$ 17.490.000' },
        { image: cardExample2, badge: 'Seminuevo', year: '2021', brand: 'TOYOTA', name: 'Toyota C-HR 1.8\nHybrid EV', km: '42.000 Km', transmission: 'CVT', fuel: 'Híbrido', price: '$ 23.490.000', certificateBadge },
        { image: cardExample1, badge: 'Seminuevo', year: '2024', brand: 'Volkswagen', name: 'Volkswagen Taos 1.4T\nHighline DSG', km: '8.500 Km', transmission: 'AT', fuel: 'Gasolina', price: '$ 25.990.000' },
        { image: cardExample2, badge: 'Seminuevo', year: '2023', brand: 'TOYOTA', name: 'Toyota Prius 2.0\nHybrid XLE', km: '14.000 Km', transmission: 'CVT', fuel: 'Híbrido', originalPrice: '$ 30.990.000', price: '$ 29.490.000', certificateBadge },
        { image: cardExample1, badge: 'Seminuevo', year: '2022', brand: 'Ford', name: 'Ford Ranger 3.2\nLimited 4x4', km: '37.000 Km', transmission: 'AT', fuel: 'Diesel', price: '$ 28.990.000' },
        { image: cardExample2, badge: 'Seminuevo', year: '2024', brand: 'TOYOTA', name: 'Toyota GR86 2.4\nAT Premium', km: '3.000 Km', transmission: 'AT', fuel: 'Gasolina', price: '$ 32.990.000', certificateBadge },
    ];

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
                            <div className="relative">
                                {/* Grid view */}
                                <div className={`flex flex-wrap items-start gap-5 transition-all duration-500 ease-in-out ${viewMode === 'grid' ? 'opacity-100' : 'pointer-events-none absolute inset-0 opacity-0'}`}>
                                    {paginatedVehicles.map((v, i) => (
                                        <ProductCard key={`grid-${i}`} {...v} />
                                    ))}
                                </div>
                                {/* List view */}
                                <div className={`flex flex-col gap-5 transition-all duration-500 ease-in-out ${viewMode === 'list' ? 'opacity-100' : 'pointer-events-none absolute inset-0 opacity-0'}`}>
                                    {paginatedVehicles.map((v, i) => (
                                        <ProductListItem key={`list-${i}`} {...v} />
                                    ))}
                                </div>
                            </div>
                            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                        </div>
                    </div>
                </div>

                {footer && <Footer data={footer} />}
                <WhatsappButton />
            </div>
        </>
    );
}
