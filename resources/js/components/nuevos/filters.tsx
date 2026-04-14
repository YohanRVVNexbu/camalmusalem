import { Check, Minus, Plus } from 'lucide-react';
import { useState } from 'react';
import { ElectricIcon } from '@/components/icons/electric-icon';
import { HybridIcon } from '@/components/icons/hybrid-icon';

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
    iconFor?: (code: string) => React.ReactNode | null;
};

function fuelIconFor(code: string): React.ReactNode | null {
    if (code === 'bev') return <ElectricIcon className="size-3.5 text-black" />;
    if (code === 'hybrid' || code === 'phev') return <HybridIcon className="size-3.5 text-black" />;
    return null;
}

function FilterCard({
    config,
    selection,
    onToggle,
    variant,
}: {
    config: GroupConfig;
    selection: string[];
    onToggle: (code: string, checked: boolean) => void;
    variant: 'filled' | 'outline';
}) {
    const [open, setOpen] = useState(true);
    const Icon = open ? Minus : Plus;
    const cardClass = variant === 'filled'
        ? 'bg-white border-black/10'
        : 'border-black/40';

    return (
        <div className={`w-full overflow-hidden rounded-2xl border p-5 ${cardClass}`}>
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
                    <Icon className="size-6.5 text-black transition-transform duration-300" strokeWidth={1.5} />
                </button>

                <div
                    className="grid transition-[grid-template-rows,opacity,margin] duration-300 ease-out"
                    style={{
                        gridTemplateRows: open ? '1fr' : '0fr',
                        opacity: open ? 1 : 0,
                        marginTop: open ? undefined : '-1.25rem',
                    }}
                >
                    <div className="overflow-hidden">
                        <div className="flex flex-col gap-3">
                            {config.items.length === 0 && (
                                <span className="text-xs text-black/40">Sin opciones</span>
                            )}
                            {config.items.map((item) => {
                                const checked = selection.includes(item.code);
                                const icon = config.iconFor?.(item.code);
                                return (
                                    <label
                                        key={item.code}
                                        className="flex cursor-pointer items-center gap-2.5"
                                    >
                                        <span className="relative flex size-4.5 shrink-0 items-center justify-center overflow-hidden rounded border border-black/80 bg-[#EDEDED]">
                                            <input
                                                type="checkbox"
                                                checked={checked}
                                                onChange={(e) => onToggle(item.code, e.target.checked)}
                                                className="absolute inset-0 size-full cursor-pointer appearance-none"
                                                tabIndex={open ? 0 : -1}
                                            />
                                            {checked && <Check className="size-3 text-black" strokeWidth={3} />}
                                        </span>
                                        {icon && <span className="shrink-0">{icon}</span>}
                                        <span
                                            className={`text-left text-sm leading-none text-black ${config.uppercase ? 'uppercase' : ''}`}
                                        >
                                            {item.label}
                                        </span>
                                    </label>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function NuevosFilters({ options, selection, onChange }: Props) {
    const groups: GroupConfig[] = [
        { key: 'gama', title: 'Gama', items: options.gama },
        { key: 'modelo', title: 'Modelo', items: options.modelo, uppercase: true },
        { key: 'combustible', title: 'Tipo de combustible', items: options.combustible, uppercase: true, iconFor: fuelIconFor },
        { key: 'transmision', title: 'Transmisión', items: options.transmision, uppercase: true },
        { key: 'traccion', title: 'Tracción', items: options.traccion, uppercase: true },
    ];

    return (
        <div className="flex w-full flex-col gap-5">
            {groups.map((g, i) => (
                <FilterCard
                    key={g.key}
                    config={g}
                    selection={selection[g.key]}
                    onToggle={(code, checked) => onChange(g.key, code, checked)}
                    variant={i === 0 ? 'filled' : 'outline'}
                />
            ))}
        </div>
    );
}
