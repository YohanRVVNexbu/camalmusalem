import { GridIcon } from '@/components/icons/grid-icon';
import { ListIcon } from '@/components/icons/list-icon';
import { PillButton } from '@/components/ui/pill-button';

export type ViewMode = 'grid' | 'list';
export type SortMode = '' | 'price-asc' | 'price-desc' | 'year-desc' | 'year-asc' | 'km-asc';

export const PER_PAGE_OPTIONS = [15, 25, 50, 100] as const;
export type PerPage = typeof PER_PAGE_OPTIONS[number];

type ToolbarProps = {
    filtersVisible: boolean;
    onToggleFilters: () => void;
    viewMode: ViewMode;
    onChangeViewMode: (mode: ViewMode) => void;
    sortMode?: SortMode;
    onChangeSort?: (mode: SortMode) => void;
    perPage?: PerPage;
    onChangePerPage?: (n: PerPage) => void;
};

export function Toolbar({
    filtersVisible,
    onToggleFilters,
    viewMode,
    onChangeViewMode,
    sortMode = '',
    onChangeSort,
    perPage,
    onChangePerPage,
}: ToolbarProps) {
    return (
        <div className="mt-10 hidden items-center justify-between lg:flex">
            {/* Left: toggle filters */}
            <PillButton variant="solid" onClick={onToggleFilters}>
                {filtersVisible ? 'Esconder filtros' : 'Mostrar filtros'}
            </PillButton>

            {/* Right: view toggle + per-page + sort */}
            <div className="flex items-center gap-2.5">
                <div className="flex items-center gap-2.5">
                    <button
                        onClick={() => onChangeViewMode('grid')}
                        className={`flex size-10 cursor-pointer items-center justify-center rounded-md transition ${
                            viewMode === 'grid'
                                ? 'bg-black/10 shadow-[0_2px_6px_rgba(0,0,0,0.25)]'
                                : 'bg-[#EAEAF1] hover:bg-black/5'
                        }`}
                    >
                        <GridIcon className="text-black" />
                    </button>
                    <button
                        onClick={() => onChangeViewMode('list')}
                        className={`flex size-10 cursor-pointer items-center justify-center rounded-md transition ${
                            viewMode === 'list'
                                ? 'bg-black/10 shadow-[0_2px_6px_rgba(0,0,0,0.25)]'
                                : 'bg-[#EAEAF1] hover:bg-black/5'
                        }`}
                    >
                        <ListIcon className="text-black" />
                    </button>
                </div>
                {/* Mostrar por página */}
                {perPage !== undefined && onChangePerPage && (
                    <div className="relative">
                        <select
                            value={perPage}
                            onChange={(e) => onChangePerPage(Number(e.target.value) as PerPage)}
                            className="cursor-pointer appearance-none rounded-[60px] border border-black bg-[#EAEAF1] py-2.5 pl-5 pr-10 text-base leading-none text-black outline-none"
                            aria-label="Vehículos por página"
                        >
                            {PER_PAGE_OPTIONS.map((n) => (
                                <option key={n} value={n}>Mostrar {n}</option>
                            ))}
                        </select>
                        <svg className="pointer-events-none absolute right-5 top-1/2 size-4 -translate-y-1/2 text-black" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m6 9 6 6 6-6" />
                        </svg>
                    </div>
                )}
                <div className="relative">
                    <select
                        value={sortMode}
                        onChange={(e) => onChangeSort?.(e.target.value as SortMode)}
                        className="w-65 cursor-pointer appearance-none rounded-[60px] border border-black bg-[#EAEAF1] px-5 py-2.5 text-base leading-none text-black outline-none"
                    >
                        <option value="">Ordenar por</option>
                        <option value="price-asc">Precio: menor a mayor</option>
                        <option value="price-desc">Precio: mayor a menor</option>
                        <option value="year-desc">Año: más reciente</option>
                        <option value="year-asc">Año: más antiguo</option>
                        <option value="km-asc">Km: menor a mayor</option>
                    </select>
                    <svg className="pointer-events-none absolute right-5 top-1/2 size-4 -translate-y-1/2 text-black" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m6 9 6 6 6-6" />
                    </svg>
                </div>
            </div>
        </div>
    );
}
