import { router } from '@inertiajs/react';
import { FileSpreadsheet, RefreshCw, Upload, X } from 'lucide-react';
import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';

/**
 * Sube el archivo "Cross Reference" de Toyota tal cual y sincroniza los precios
 * por SKU (lee solo la pestaña "Data"). Solo actualiza productos que ya existen
 * en accesorios/repuestos/merch; no crea nuevos (la fuente no trae categoría).
 */
export function CrossReferenceSync() {
    const [open, setOpen] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [processing, setProcessing] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const accept = (f: File | null) => {
        if (!f) return;
        const ext = f.name.split('.').pop()?.toLowerCase();
        if (ext === 'xlsx' || ext === 'xls') setFile(f);
    };

    const handle = () => {
        if (!file) return;
        setProcessing(true);
        const fd = new FormData();
        fd.append('file', file);
        router.post('/admin/cross-reference/import', fd, {
            forceFormData: true,
            onFinish: () => { setProcessing(false); setOpen(false); setFile(null); },
        });
    };

    return (
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setFile(null); if (inputRef.current) inputRef.current.value = ''; } }}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <RefreshCw className="mr-1.5 size-4" />
                    Sincronizar precios (Toyota)
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Sincronizar precios desde Cross Reference</DialogTitle>
                    <DialogDescription>
                        Sube el archivo <strong>Cross Reference.xlsx</strong> de Toyota tal cual. Se lee la
                        pestaña <strong>"Data"</strong> y se actualiza el <strong>precio por SKU</strong> de los
                        productos que ya existen (accesorios, repuestos y merch). No crea productos nuevos.
                    </DialogDescription>
                </DialogHeader>

                <div
                    onClick={() => !file && inputRef.current?.click()}
                    className={[
                        'relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-10 transition-colors',
                        file ? 'border-green-400 bg-green-50 dark:bg-green-950/20' : 'cursor-pointer border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/40',
                    ].join(' ')}
                >
                    <input ref={inputRef} type="file" accept=".xlsx,.xls" className="sr-only" onChange={(e) => accept(e.target.files?.[0] ?? null)} />
                    {file ? (
                        <>
                            <FileSpreadsheet className="size-10 text-green-600" />
                            <div className="text-center">
                                <p className="text-sm font-medium text-green-700 dark:text-green-400">{file.name}</p>
                                <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
                            </div>
                            <button type="button" onClick={(e) => { e.stopPropagation(); setFile(null); if (inputRef.current) inputRef.current.value = ''; }} className="absolute right-3 top-3 rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground">
                                <X className="size-4" />
                            </button>
                        </>
                    ) : (
                        <>
                            <div className="rounded-full bg-muted p-3">
                                <Upload className="size-6 text-muted-foreground" />
                            </div>
                            <p className="text-sm font-medium">Arrastra o haz clic para seleccionar</p>
                            <p className="text-xs text-muted-foreground">Cross Reference.xlsx (Toyota)</p>
                        </>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                    <Button onClick={handle} disabled={!file || processing}>
                        {processing ? 'Sincronizando…' : 'Sincronizar precios'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
