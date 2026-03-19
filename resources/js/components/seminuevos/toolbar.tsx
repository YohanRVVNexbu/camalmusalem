import { GridIcon } from '@/components/icons/grid-icon';
import { ListIcon } from '@/components/icons/list-icon';
import { PillButton } from '@/components/ui/pill-button';

export type ViewMode = 'grid' | 'list';

type ToolbarProps = {
    filtersVisible: boolean;
    onToggleFilters: () => void;
    viewMode: ViewMode;
    onChangeViewMode: (mode: ViewMode) => void;
};

export function Toolbar({ filtersVisible, onToggleFilters, viewMode, onChangeViewMode }: ToolbarProps) {

    return (
        <div className="mt-10 flex items-center justify-between">
            {/* Left: toggle filters */}
            <PillButton variant="solid" onClick={onToggleFilters}>
                {filtersVisible ? 'Esconder filtros' : 'Mostrar filtros'}
            </PillButton>

            {/* Right: view toggle + sort */}
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
                <div className="relative">
                    <select
                        className="w-65 cursor-pointer appearance-none rounded-[60px] border border-black bg-[#EAEAF1] px-5 py-2.5 text-base leading-none text-black outline-none"
                        defaultValue=""
                    >
                        <option value="" disabled>Ordenar:</option>
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
