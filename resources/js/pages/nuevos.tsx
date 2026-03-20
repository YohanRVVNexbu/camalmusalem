import { Head } from '@inertiajs/react';
import { Footer } from '@/components/landing/footer';
import { Navbar } from '@/components/landing/navbar';
import { Filters } from '@/components/seminuevos/filters';
import { Toolbar, type ViewMode } from '@/components/seminuevos/toolbar';
import { Pagination } from '@/components/seminuevos/pagination';
import { ProductCard } from '@/components/seminuevos/product-card';
import { ProductListItem } from '@/components/seminuevos/product-list-item';
import { vehicles } from '@/data/vehicles';
import { useEffect, useMemo, useState } from 'react';
import cardNuevos1 from '@images/nuevos/card_nuevos_1.png?format=webp';
import cardNuevos2 from '@images/nuevos/card_nuevos_2.png?format=webp';
import cardNuevos3 from '@images/nuevos/card_nuevos_3.png?format=webp';
import cardNuevos4 from '@images/nuevos/card_nuevos_4.png?format=webp';
import logoCard1 from '@images/nuevos/logo_card_1.png?format=webp';
import logoCard2 from '@images/nuevos/loco_card_2.png?format=webp';
import logoCard3 from '@images/nuevos/logo_card_3.png?format=webp';
import logoCard4 from '@images/nuevos/logo_card_4.png?format=webp';

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

const heroCards = [
    { image: cardNuevos1, logo: logoCard1, electric: true, price: '$39.990.000' },
    { image: cardNuevos2, logo: logoCard2, electric: false, price: '$28.990.000' },
    { image: cardNuevos3, logo: logoCard3, electric: false, price: '$22.490.000' },
    { image: cardNuevos4, logo: logoCard4, electric: false, price: '$35.590.000' },
];

export default function Nuevos({ data, footer }: { data: any; footer: any }) {
    const [cardsVisible, setCardsVisible] = useState(false);
    const [contentVisible, setContentVisible] = useState(false);
    const [filtersVisible, setFiltersVisible] = useState(true);
    const [viewMode, setViewMode] = useState<ViewMode>('grid');
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const t1 = setTimeout(() => setCardsVisible(true), 200);
        const t2 = setTimeout(() => setContentVisible(true), 700);
        return () => { clearTimeout(t1); clearTimeout(t2); };
    }, []);

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
                <div style={{ padding: '60px 60px 200px 60px' }}>
                    {/* Title section */}
                    <section className="mt-20 flex flex-col items-center">
                        <h1 className="text-center text-[40px] font-semibold leading-[150%] text-black">
                            Cotiza tu Toyota 0 KM
                        </h1>
                        <p className="text-center text-base leading-[150%] text-black">
                            Musalem, líder Toyota en la región de Coquimbo.
                        </p>

                        {/* Hero cards */}
                        <div className="mt-10 flex gap-5">
                            {heroCards.map((card, i) => (
                                <div
                                    key={i}
                                    className={`group relative h-115 w-78.75 shrink-0 overflow-hidden rounded-[30px] transition-all duration-700 ease-out hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] ${
                                        cardsVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
                                    }`}
                                    style={{ transitionDelay: cardsVisible && !contentVisible ? `${i * 100}ms` : '0ms' }}
                                >
                                    <div
                                        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-500 ease-out group-hover:scale-105"
                                        style={{
                                            backgroundImage: `radial-gradient(84.02% 84.02% at 50% 48.04%, rgba(0, 0, 0, 0.00) 0%, rgba(0, 0, 0, 0.30) 100%), url(${card.image})`,
                                        }}
                                    />
                                    <div className="relative flex h-full flex-col items-center justify-between">
                                    <div
                                        className={`mt-2.5 flex w-65 flex-col items-center transition-all duration-600 ease-out ${
                                            contentVisible ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'
                                        }`}
                                        style={{ transitionDelay: contentVisible ? `${i * 80}ms` : '0ms' }}
                                    >
                                        <div className="flex h-37 w-full items-center justify-center">
                                            <img
                                                src={card.logo}
                                                alt=""
                                                className="max-h-full max-w-full object-contain"
                                            />
                                        </div>
                                        {card.electric && <ElectricBadge />}
                                    </div>
                                    <div
                                        className={`mb-3 flex flex-col items-center gap-3 transition-all duration-600 ease-out group-hover:-translate-y-6 ${
                                            contentVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                                        }`}
                                        style={{ transitionDelay: contentVisible ? `${i * 80}ms` : '0ms' }}
                                    >
                                        <div className="inline-flex flex-col items-center gap-1">
                                            <span className="text-center text-base leading-none text-white">Desde</span>
                                            <span className="text-[28px] leading-none text-white">{card.price}</span>
                                        </div>
                                        <a
                                            href="#"
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
                    </section>

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
                                    {paginatedVehicles.map((v) => (
                                        <ProductCard key={`grid-${v.id}`} {...v} href={`/nuevos/${v.id}`} />
                                    ))}
                                </div>
                                {/* List view */}
                                <div className={`flex flex-col gap-5 transition-all duration-500 ease-in-out ${viewMode === 'list' ? 'opacity-100' : 'pointer-events-none absolute inset-0 opacity-0'}`}>
                                    {paginatedVehicles.map((v) => (
                                        <ProductListItem key={`list-${v.id}`} {...v} href={`/nuevos/${v.id}`} />
                                    ))}
                                </div>
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
