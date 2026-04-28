import { router } from '@inertiajs/react';
import { Download, FileSpreadsheet, Upload, X } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

type Props = {
    exportUrl: string;
    importUrl: string;
    templateUrl: string;
    entityLabel: string;
    label?: string;
};

export function ImportExportBar({ exportUrl, importUrl, templateUrl, entityLabel, label }: Props) {
    const [open, setOpen]           = useState(false);
    const [file, setFile]           = useState<File | null>(null);
    const [dragging, setDragging]   = useState(false);
    const [processing, setProcessing] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const acceptFile = (f: File | null) => {
        if (!f) return;
        const ext = f.name.split('.').pop()?.toLowerCase();
        if (ext === 'xlsx' || ext === 'xls') setFile(f);
    };

    const onDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setDragging(false);
        acceptFile(e.dataTransfer.files?.[0] ?? null);
    }, []);

    const onDragOver = (e: React.DragEvent) => { e.preventDefault(); setDragging(true); };
    const onDragLeave = () => setDragging(false);

    const handleImport = () => {
        if (!file) return;
        setProcessing(true);
        const formData = new FormData();
        formData.append('file', file);
        router.post(importUrl, formData, {
            forceFormData: true,
            onFinish: () => {
                setProcessing(false);
                setOpen(false);
                setFile(null);
            },
        });
    };

    const reset = () => {
        setFile(null);
        if (inputRef.current) inputRef.current.value = '';
    };

    return (
        <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
                <a href={exportUrl}>
                    <Download className="mr-1.5 size-4" />
                    {label ? `Exportar ${label}` : 'Exportar'}
                </a>
            </Button>

            <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) reset(); }}>
                <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                        <Upload className="mr-1.5 size-4" />
                        {label ? `Importar ${label}` : 'Importar'}
                    </Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Importar {label ?? entityLabel}</DialogTitle>
                        <DialogDescription>
                            Sube un archivo <strong>.xlsx</strong> con el formato de la plantilla.
                            Los registros existentes se actualizarán por SKU/código; los nuevos se crearán.
                        </DialogDescription>
                    </DialogHeader>

                    {/* Drop zone */}
                    <div
                        onDrop={onDrop}
                        onDragOver={onDragOver}
                        onDragLeave={onDragLeave}
                        onClick={() => !file && inputRef.current?.click()}
                        className={[
                            'relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-10 transition-colors',
                            file
                                ? 'border-green-400 bg-green-50 dark:bg-green-950/20'
                                : dragging
                                ? 'border-primary bg-primary/5 cursor-copy'
                                : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/40 cursor-pointer',
                        ].join(' ')}
                    >
                        <input
                            ref={inputRef}
                            type="file"
                            accept=".xlsx,.xls"
                            className="sr-only"
                            onChange={(e) => acceptFile(e.target.files?.[0] ?? null)}
                        />

                        {file ? (
                            <>
                                <FileSpreadsheet className="size-10 text-green-600" />
                                <div className="text-center">
                                    <p className="text-sm font-medium text-green-700 dark:text-green-400">{file.name}</p>
                                    <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); reset(); }}
                                    className="absolute right-3 top-3 rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                                >
                                    <X className="size-4" />
                                </button>
                            </>
                        ) : (
                            <>
                                <div className={['rounded-full p-3 transition-colors', dragging ? 'bg-primary/10' : 'bg-muted'].join(' ')}>
                                    <Upload className={['size-6 transition-colors', dragging ? 'text-primary' : 'text-muted-foreground'].join(' ')} />
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-medium">
                                        {dragging ? 'Suelta el archivo aquí' : 'Arrastra tu archivo aquí'}
                                    </p>
                                    <p className="text-xs text-muted-foreground">o haz clic para seleccionar</p>
                                </div>
                                <p className="text-xs text-muted-foreground">.xlsx · .xls</p>
                            </>
                        )}
                    </div>

                    <DialogFooter className="flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <a
                            href={templateUrl}
                            className="text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
                        >
                            Descargar plantilla vacía
                        </a>
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                            <Button onClick={handleImport} disabled={!file || processing}>
                                {processing ? 'Importando…' : 'Importar'}
                            </Button>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
