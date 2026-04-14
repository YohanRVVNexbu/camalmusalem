import { Minus, Plus } from 'lucide-react';
import { useState } from 'react';

export type FilterOption = {
    code: string;
    label: string;
};

export type FilterGroupKey = 'gama' | 'modelo' | 'combustible' | 'transmision' | 'traccion';

export type FilterOptions = {
    gama: FilterOption[];
    modelo: FilterOption[];
    combustible: FilterOption[];
    transmision: FilterOption[];
    traccion: FilterOption[];
};

export type FilterSelection = Record<FilterGroupKey, string[]>;

export const emptyFilterSelection: FilterSelection = {
    gama: [], modelo: [], combustible: [], transmision: [], traccion: [],
};

type Props = {
    options: FilterOptions;
    selection: FilterSelection;
    onChange: (group: FilterGroupKey, code: string, checked: boolean) => void;
};

type GroupConfig = {
    key: FilterGroupKey;
    title: string;
    items: FilterOption[];
    uppercase?: boolean;
};

function FilterCard({
    config,
    selection,
    onToggle,
}: {
    config: GroupConfig;
    selection: string[];
    onToggle: (code: string, checked: boolean) => void;
}) {
    const [open, setOpen] = useState(true);
    const Icon = open ? Minus : Plus;

    return (
        <div className="w-full overflow-hidden rounded-2xl border border-black/10 bg-white p-5">
            <div className="flex flex-col gap-5">
                <button
                    type="button"
                    className="flex w-full items-center justify-between"
                    onClick={() => setOpen((v) => !v)}
                    aria-expanded={open}
                >
                    <span className="text-left text-base font-semibold uppercase leading-none text-black">
                        {config.title}
                    </span>
                    <Icon className="size-[26px] text-black" strokeWidth={1.5} />
                </button>

                {open && (
                    <div className="flex flex-col gap-3">
                        {config.items.length === 0 && (
                            <span className="text-xs text-black/40">Sin opciones</span>
                        )}
                        {config.items.map((item) => {
                            const checked = selection.includes(item.code);
                            return (
                                <label
                                    key={item.code}
                                    className="flex cursor-pointer items-center gap-2.5"
                                >
                                    <input
                                        type="checkbox"
                                        checked={checked}
                                        onChange={(e) => onToggle(item.code, e.target.checked)}
                                        className="size-[18px] shrink-0 cursor-pointer rounded border border-black/80 bg-[#EDEDED] accent-black"
                                    />
                                    <span
                                        className={`text-left text-sm leading-none text-black ${config.uppercase ? 'uppercase' : ''}`}
                                    >
                                        {item.label}
                                    </span>
                                </label>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

export default function NuevosFilters({ options, selection, onChange }: Props) {
    const groups: GroupConfig[] = [
        { key: 'gama', title: 'Gama', items: options.gama },
        { key: 'modelo', title: 'Modelo', items: options.modelo, uppercase: true },
        { key: 'combustible', title: 'Tipo de combustible', items: options.combustible, uppercase: true },
        { key: 'transmision', title: 'Transmisión', items: options.transmision, uppercase: true },
        { key: 'traccion', title: 'Tracción', items: options.traccion, uppercase: true },
    ];

    return (
        <div className="flex w-full flex-col gap-5">
            {groups.map((g) => (
                <FilterCard
                    key={g.key}
                    config={g}
                    selection={selection[g.key]}
                    onToggle={(code, checked) => onChange(g.key, code, checked)}
                />
            ))}
        </div>
    );
}
