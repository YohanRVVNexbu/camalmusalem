import { CompareIcon } from '@/components/icons/compare-icon';
import { PillButton } from '@/components/ui/pill-button';

const categories = [
    'Camionetas',
    'Híbridos',
    'Eléctricos',
    'Menos de $10mm',
    'Año 2024 +',
];

export function Categories() {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3.5">
                <span className="text-base leading-none text-black">
                    Categorías destacadas:
                </span>
                {categories.map((cat) => (
                    <PillButton key={cat}>{cat}</PillButton>
                ))}
            </div>
            <PillButton variant="solid" className="flex h-11 items-center gap-2.5 text-sm">
                <CompareIcon className="text-white" />
                Comparar
            </PillButton>
        </div>
    );
}
