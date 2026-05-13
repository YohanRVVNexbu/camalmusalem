import { router } from '@inertiajs/react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ResetSectionButton({ section }: { section: string }) {
    const onClick = () => {
        if (!confirm('¿Restaurar esta sección a los valores por defecto? Se perderán los textos e imágenes que hayas modificado.')) return;
        router.post(`/admin/home/${section}/reset`, {});
    };

    return (
        <Button type="button" variant="outline" onClick={onClick} className="gap-1.5">
            <RotateCcw className="size-3.5" />
            Restaurar defaults
        </Button>
    );
}
