import { ElectricIcon } from '@/components/icons/electric-icon';
import { HybridIcon } from '@/components/icons/hybrid-icon';
import { Check, ChevronDown, Minus, Plus } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export type SeminuevoFilterState = {
    brands: string[];
    yearFrom: number | null;
    yearTo: number | null;
    kmFrom: number | null;
    kmTo: number | null;
    priceFrom: number | null;
    priceTo: number | null;
    transmissions: string[];
    fuels: string[];
    colors: string[];
};

export const emptySeminuevoFilterState: SeminuevoFilterState = {
    brands: [],
    yearFrom: null, yearTo: null,
    kmFrom: null, kmTo: null,
    priceFrom: null, priceTo: null,
    transmissions: [], fuels: [], colors: [],
};

export type FilterOptionLists = {
    brands: string[];
    years: number[];
    transmissions: string[];
    fuels: string[];
    colors: string[];
};

function FilterAccordion({
    title,
    defaultOpen = true,
    children,
}: {
    title: string;
    defaultOpen?: boolean;
    children: React.ReactNode;
}) {
    const [open, setOpen] = useState(defaultOpen);
    const contentRef = useRef<HTMLDivElement>(null);
    const [height, setHeight] = useState<number | undefined>(defaultOpen ? undefined : 0);

    useEffect(() => {
        if (!contentRef.current) return;
        if (open) {
            setHeight(contentRef.current.scrollHeight);
            const timer = setTimeout(() => setHeight(undefined), 300);
            return () => clearTimeout(timer);
        } else {
            setHeight(contentRef.current.scrollHeight);
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setHeight(0);
                });
            });
        }
    }, [open]);

    return (
        <div className="flex flex-col gap-5">
            <button
                onClick={() => setOpen(!open)}
                className="flex cursor-pointer items-center justify-between"
            >
                <span className="text-base font-semibold uppercase leading-none text-black">
                    {title}
                </span>
                <span className="flex size-6.5 items-center justify-center transition-transform duration-300">
                    {open ? <Minus className="size-4 text-black" /> : <Plus className="size-4 text-black" />}
                </span>
            </button>
            <div
                ref={contentRef}
                className="overflow-hidden transition-[height] duration-300 ease-in-out"
                style={{ height: height !== undefined ? `${height}px` : 'auto' }}
            >
                {children}
            </div>
        </div>
    );
}

function FilterCheckbox({
    label,
    icon,
    checked,
    onChange,
}: {
    label: string;
    icon?: React.ReactNode;
    checked: boolean;
    onChange: (next: boolean) => void;
}) {
    return (
        <button
            onClick={() => onChange(!checked)}
            className="flex cursor-pointer items-center gap-2.5"
        >
            <span
                className={`flex size-4.5 shrink-0 items-center justify-center rounded-sm border transition ${
                    checked
                        ? 'border-black bg-black'
                        : 'border-black/40 bg-white hover:border-black/70'
                }`}
            >
                {checked && <Check className="size-3 text-white" strokeWidth={3} />}
            </span>
            {icon && <span className="text-black">{icon}</span>}
            <span className="text-sm leading-none text-black">{label}</span>
        </button>
    );
}

function FilterRangeSelect({
    label,
    placeholder,
    options,
    value,
    onChange,
    disabled = false,
}: {
    label: string;
    placeholder: string;
    options: Array<{ value: number; label: string }>;
    value: number | null;
    onChange: (v: number | null) => void;
    disabled?: boolean;
}) {
    return (
        <div className="flex flex-col gap-2.5">
            <span className="text-sm leading-none text-black">{label}</span>
            <div className={`relative ${disabled ? 'opacity-20' : ''}`}>
                <select
                    disabled={disabled}
                    value={value ?? ''}
                    onChange={(e) => onChange(e.target.value === '' ? null : Number(e.target.value))}
                    className="h-10 w-full cursor-pointer appearance-none rounded-[60px] border border-black bg-[#EAEAF1] px-5 text-sm leading-none text-black outline-none"
                >
                    <option value="">{placeholder}</option>
                    {options.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-5 top-1/2 size-3.5 -translate-y-1/2 text-black" />
            </div>
        </div>
    );
}

// Helpers para generar opciones de los rangos numéricos.
const KM_STEPS = [10000, 20000, 50000, 80000, 100000, 150000, 200000];
const PRICE_STEPS = [5000000, 10000000, 15000000, 20000000, 30000000, 50000000];

export function Filters({
    variant = 'sidebar',
    state,
    onChange,
    options,
}: {
    variant?: 'sidebar' | 'drawer';
    state: SeminuevoFilterState;
    onChange: (next: SeminuevoFilterState) => void;
    options: FilterOptionLists;
}) {
    const containerClass = variant === 'sidebar'
        ? 'flex w-69.5 shrink-0 flex-col gap-5 overflow-hidden rounded-[20px] border border-black/10 bg-white p-5'
        : 'flex w-full min-w-0 flex-col gap-5';

    const toggle = <K extends 'brands' | 'transmissions' | 'fuels' | 'colors'>(
        group: K,
        value: string,
    ) => {
        const list = state[group];
        const next = list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
        onChange({ ...state, [group]: next });
    };

    const yearOptions = options.years.map((y) => ({ value: y, label: String(y) }));
    const kmOptions = KM_STEPS.map((k) => ({ value: k, label: k.toLocaleString('es-CL') + ' km' }));
    const priceOptions = PRICE_STEPS.map((p) => ({ value: p, label: '$' + p.toLocaleString('es-CL') }));

    const hasActiveFilters = state.brands.length > 0
        || state.yearFrom !== null || state.yearTo !== null
        || state.kmFrom !== null || state.kmTo !== null
        || state.priceFrom !== null || state.priceTo !== null
        || state.transmissions.length > 0
        || state.fuels.length > 0
        || state.colors.length > 0;

    return (
        <div className={containerClass}>
            {variant === 'sidebar' && <>
                <div className="flex items-center justify-between">
                    <span className="text-base font-semibold uppercase leading-none text-black">
                        Filtros
                    </span>
                    {hasActiveFilters && (
                        <button
                            type="button"
                            onClick={() => onChange(emptySeminuevoFilterState)}
                            className="cursor-pointer text-xs leading-none text-black/60 underline underline-offset-2 transition hover:text-black"
                        >
                            Limpiar
                        </button>
                    )}
                </div>
                <hr className="border-black/10" />
            </>}

            {/* Marca */}
            {options.brands.length > 0 && (
                <>
                    <FilterAccordion title="Marca">
                        <div className="flex flex-col gap-3">
                            {options.brands.map((b) => (
                                <FilterCheckbox
                                    key={b}
                                    label={b}
                                    checked={state.brands.includes(b)}
                                    onChange={() => toggle('brands', b)}
                                />
                            ))}
                        </div>
                    </FilterAccordion>
                    <hr className="border-black/10" />
                </>
            )}

            {/* Año */}
            {yearOptions.length > 0 && (
                <>
                    <FilterAccordion title="Año">
                        <div className="flex flex-col gap-5">
                            <FilterRangeSelect
                                label="Desde"
                                placeholder="Seleccionar año"
                                options={yearOptions}
                                value={state.yearFrom}
                                onChange={(v) => onChange({ ...state, yearFrom: v })}
                            />
                            <FilterRangeSelect
                                label="Hasta"
                                placeholder="Seleccionar año"
                                options={yearOptions.filter((o) => state.yearFrom === null || o.value >= state.yearFrom)}
                                value={state.yearTo}
                                onChange={(v) => onChange({ ...state, yearTo: v })}
                                disabled={state.yearFrom === null}
                            />
                        </div>
                    </FilterAccordion>
                    <hr className="border-black/10" />
                </>
            )}

            {/* Kilometraje */}
            <FilterAccordion title="Kilometraje">
                <div className="flex flex-col gap-5">
                    <FilterRangeSelect
                        label="Desde"
                        placeholder="Desde"
                        options={kmOptions}
                        value={state.kmFrom}
                        onChange={(v) => onChange({ ...state, kmFrom: v })}
                    />
                    <FilterRangeSelect
                        label="Hasta"
                        placeholder="Hasta"
                        options={kmOptions.filter((o) => state.kmFrom === null || o.value >= state.kmFrom)}
                        value={state.kmTo}
                        onChange={(v) => onChange({ ...state, kmTo: v })}
                        disabled={state.kmFrom === null}
                    />
                </div>
            </FilterAccordion>

            <hr className="border-black/10" />

            {/* Precio */}
            <FilterAccordion title="Precio">
                <div className="flex flex-col gap-5">
                    <FilterRangeSelect
                        label="Desde"
                        placeholder="Desde"
                        options={priceOptions}
                        value={state.priceFrom}
                        onChange={(v) => onChange({ ...state, priceFrom: v })}
                    />
                    <FilterRangeSelect
                        label="Hasta"
                        placeholder="Hasta"
                        options={priceOptions.filter((o) => state.priceFrom === null || o.value >= state.priceFrom)}
                        value={state.priceTo}
                        onChange={(v) => onChange({ ...state, priceTo: v })}
                        disabled={state.priceFrom === null}
                    />
                </div>
            </FilterAccordion>

            {/* Transmisión */}
            {options.transmissions.length > 0 && (
                <>
                    <hr className="border-black/10" />
                    <FilterAccordion title="Transmisión">
                        <div className="flex flex-col gap-3">
                            {options.transmissions.map((t) => (
                                <FilterCheckbox
                                    key={t}
                                    label={t}
                                    checked={state.transmissions.includes(t)}
                                    onChange={() => toggle('transmissions', t)}
                                />
                            ))}
                        </div>
                    </FilterAccordion>
                </>
            )}

            {/* Combustible */}
            {options.fuels.length > 0 && (
                <>
                    <hr className="border-black/10" />
                    <FilterAccordion title="Tipo de combustible">
                        <div className="flex flex-col gap-3">
                            {options.fuels.map((f) => {
                                const fl = f.toLowerCase();
                                const icon = fl.includes('eléctrico') || fl.includes('electrico')
                                    ? <ElectricIcon className="size-3.5" />
                                    : fl.includes('híbrido') || fl.includes('hibrido')
                                        ? <HybridIcon className="size-3.5" />
                                        : undefined;
                                return (
                                    <FilterCheckbox
                                        key={f}
                                        label={f}
                                        icon={icon}
                                        checked={state.fuels.includes(f)}
                                        onChange={() => toggle('fuels', f)}
                                    />
                                );
                            })}
                        </div>
                    </FilterAccordion>
                </>
            )}

            {/* Color */}
            {options.colors.length > 0 && (
                <>
                    <hr className="border-black/10" />
                    <FilterAccordion title="Color" defaultOpen={false}>
                        <div className="flex flex-col gap-3">
                            {options.colors.map((c) => (
                                <FilterCheckbox
                                    key={c}
                                    label={c}
                                    checked={state.colors.includes(c)}
                                    onChange={() => toggle('colors', c)}
                                />
                            ))}
                        </div>
                    </FilterAccordion>
                </>
            )}
        </div>
    );
}
