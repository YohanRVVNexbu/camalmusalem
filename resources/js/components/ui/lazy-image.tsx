import { useState, type ImgHTMLAttributes } from 'react';

/**
 * <img> con skeleton (shimmer gris) + fade-in al cargar.
 *
 * - Por defecto loading="lazy" → el navegador no descarga la imagen hasta que
 *   está cerca del viewport. Para imágenes above-the-fold (hero), pasar
 *   `eager` en true y opcionalmente `fetchPriority="high"`.
 * - Cuando `src` cambia, vuelve a mostrar el skeleton hasta que carga la nueva.
 *
 * NO convierte formatos ni manipula los bytes → seguro para PNG con
 * transparencia, GIFs, etc.
 */
type LazyImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'loading'> & {
    src: string;
    alt: string;
    /** Por defecto false (lazy). En true → loading="eager" + decoding="sync". */
    eager?: boolean;
    /** Clases extra para el wrapper (el contenedor con el skeleton). */
    wrapperClassName?: string;
};

export function LazyImage({
    src,
    alt,
    eager = false,
    fetchPriority,
    className = '',
    wrapperClassName = '',
    onLoad,
    onError,
    ...rest
}: LazyImageProps) {
    // Reset del flag cuando cambia el src — sin esto, al navegar entre slugs
    // la "nueva" imagen aparece sin transición.
    const [loaded, setLoaded] = useState(false);
    const [currentSrc, setCurrentSrc] = useState(src);
    if (src !== currentSrc) {
        setCurrentSrc(src);
        setLoaded(false);
    }

    // Si el caller pasa una clase de posicionamiento (absolute/fixed/sticky)
    // en wrapperClassName, NO sumamos `relative` por arriba — porque hacerlo
    // genera el conflicto CSS `relative absolute` y rompe el layout (la imagen
    // queda invisible). En cualquier otro caso, el wrapper necesita
    // `position: relative` para que el skeleton absolute sit on top.
    const hasOwnPositioning = /\b(absolute|fixed|sticky)\b/.test(wrapperClassName);
    const wrapperPos = hasOwnPositioning ? '' : 'relative';

    return (
        <div className={`${wrapperPos} ${wrapperClassName}`}>
            {!loaded && (
                <div
                    aria-hidden
                    className="absolute inset-0 animate-pulse bg-neutral-200/70"
                />
            )}
            <img
                src={src}
                alt={alt}
                loading={eager ? 'eager' : 'lazy'}
                decoding={eager ? 'sync' : 'async'}
                fetchPriority={fetchPriority ?? (eager ? 'high' : 'auto')}
                className={`${className} transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={(e) => { setLoaded(true); onLoad?.(e); }}
                onError={(e) => { setLoaded(true); onError?.(e); }}
                {...rest}
            />
        </div>
    );
}
