import { ElectricIcon } from '@/components/icons/electric-icon';
import { HybridIcon } from '@/components/icons/hybrid-icon';
import { Check, ChevronDown, Minus, Plus } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

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

function FilterCheckbox({ label, icon }: { label: string; icon?: React.ReactNode }) {
    const [checked, setChecked] = useState(false);

    return (
        <button
            onClick={() => setChecked(!checked)}
            className="flex cursor-pointer items-center gap-2.5"
        >
            <span
                className={`flex size-4.5 shrink-0 items-center justify-center rounded border transition ${
                    checked
                        ? 'border-black bg-white shadow-[0_0_0_2px_rgba(0,0,0,0.8)]'
                        : 'border-black/80 bg-[#EAEAF1]'
                }`}
            >
                {checked && <Check className="size-3 text-black" strokeWidth={3} />}
            </span>
            {icon && <span className="text-black">{icon}</span>}
            <span className="text-sm leading-none text-black">{label}</span>
        </button>
    );
}

function FilterSelect({ label, placeholder, disabled = false }: { label: string; placeholder: string; disabled?: boolean }) {
    return (
        <div className="flex flex-col gap-2.5">
            <span className="text-sm leading-none text-black">{label}</span>
            <div className={`relative ${disabled ? 'opacity-20' : ''}`}>
                <select
                    disabled={disabled}
                    className="h-10 w-full cursor-pointer appearance-none rounded-[60px] border border-black bg-[#EAEAF1] px-5 text-sm leading-none text-black outline-none"
                    defaultValue=""
                >
                    <option value="" disabled>{placeholder}</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-5 top-1/2 size-3.5 -translate-y-1/2 text-black" />
            </div>
        </div>
    );
}

export function Filters() {
    return (
        <div className="flex w-69.5 shrink-0 flex-col gap-5 overflow-hidden rounded-[20px] border border-black/10 bg-white p-5">
            {/* Header */}
            <div className="flex items-center justify-between">
                <span className="text-base font-semibold uppercase leading-none text-black">
                    Filtros
                </span>
            </div>

            <hr className="border-black/10" />

            {/* Marca */}
            <FilterAccordion title="Marca">
                <div className="flex flex-col gap-3">
                    <FilterCheckbox label="BMW" />
                    <FilterCheckbox label="Citroen" />
                    <FilterCheckbox label="Honda" />
                    <FilterCheckbox label="Mitsubishi" />
                    <FilterCheckbox label="Toyota" />
                </div>
            </FilterAccordion>

            <hr className="border-black/10" />

            {/* Año */}
            <FilterAccordion title="Año">
                <div className="flex flex-col gap-5">
                    <FilterSelect label="Desde" placeholder="Seleccionar año" />
                    <FilterSelect label="Hasta" placeholder="Seleccionar año" disabled />
                </div>
            </FilterAccordion>

            <hr className="border-black/10" />

            {/* Kilometraje */}
            <FilterAccordion title="Kilometraje">
                <div className="flex flex-col gap-5">
                    <FilterSelect label="Desde" placeholder="Desde" />
                    <FilterSelect label="Hasta" placeholder="Hasta" disabled />
                </div>
            </FilterAccordion>

            <hr className="border-black/10" />

            {/* Precio */}
            <FilterAccordion title="Precio">
                <div className="flex flex-col gap-5">
                    <FilterSelect label="Desde" placeholder="Desde" />
                    <FilterSelect label="Hasta" placeholder="Hasta" disabled />
                </div>
            </FilterAccordion>

            <hr className="border-black/10" />

            {/* Gama */}
            <FilterAccordion title="Gama">
                <div className="flex flex-col gap-3">
                    <FilterCheckbox label="Automóviles" />
                    <FilterCheckbox label="Camionetas y comerciales" />
                    <FilterCheckbox label="Sedan" />
                    <FilterCheckbox label="SUVs" />
                </div>
            </FilterAccordion>

            <hr className="border-black/10" />

            {/* Transmisión */}
            <FilterAccordion title="Transmisión">
                <div className="flex flex-col gap-3">
                    <FilterCheckbox label="AT" />
                    <FilterCheckbox label="CVT" />
                    <FilterCheckbox label="ECVT" />
                    <FilterCheckbox label="MT" />
                </div>
            </FilterAccordion>

            <hr className="border-black/10" />

            {/* Tipo de combustible */}
            <FilterAccordion title="Tipo de combustible">
                <div className="flex flex-col gap-3">
                    <FilterCheckbox label="Eléctrico" icon={<ElectricIcon className="size-3.5" />} />
                    <FilterCheckbox label="Híbrido" icon={<HybridIcon className="size-3.5" />} />
                    <FilterCheckbox label="Diesel" />
                    <FilterCheckbox label="Gasolina" />
                </div>
            </FilterAccordion>

            <hr className="border-black/10" />

            {/* Color - collapsed by default */}
            <FilterAccordion title="Color" defaultOpen={false}>
                <div className="flex flex-col gap-3">
                    <FilterCheckbox label="Blanco" />
                    <FilterCheckbox label="Negro" />
                    <FilterCheckbox label="Gris" />
                    <FilterCheckbox label="Rojo" />
                    <FilterCheckbox label="Azul" />
                </div>
            </FilterAccordion>
        </div>
    );
}
