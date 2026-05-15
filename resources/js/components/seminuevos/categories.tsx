import { Link } from '@inertiajs/react';
import { CompareIcon } from '@/components/icons/compare-icon';
import { PillButton } from '@/components/ui/pill-button';

export const SEMINUEVO_CATEGORIES = [
    'Camionetas',
    'Híbridos',
    'Eléctricos',
    'Menos de $10mm',
    'Año 2024 +',
] as const;

export type SeminuevoCategory = typeof SEMINUEVO_CATEGORIES[number];

export function Categories({
    active,
    onChange,
}: {
    active: SeminuevoCategory | null;
    onChange: (cat: SeminuevoCategory | null) => void;
}) {
    return (
        <div className="hidden items-center justify-between gap-3.5 lg:flex">
            <div className="flex min-w-0 flex-1 items-center gap-3.5 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden">
                <span className="shrink-0 text-base leading-none text-black">
                    Categorías destacadas:
                </span>
                {SEMINUEVO_CATEGORIES.map((cat) => {
                    const isActive = active === cat;
                    return (
                        <PillButton
                            key={cat}
                            variant={isActive ? 'solid' : 'outline'}
                            onClick={() => onChange(isActive ? null : cat)}
                        >
                            {cat}
                        </PillButton>
                    );
                })}
            </div>
            <Link
                href="/seminuevos/comparar?from=/seminuevos"
                className="hidden h-11 shrink-0 cursor-pointer items-center gap-2.5 rounded-[60px] bg-black px-5 py-2.5 text-sm leading-none text-white transition hover:bg-black/85 lg:flex"
            >
                <CompareIcon className="text-white" />
                Comparar
            </Link>
        </div>
    );
}
