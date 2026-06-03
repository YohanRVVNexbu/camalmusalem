import { Car } from 'lucide-react';
import { useState, useEffect } from 'react';

type Props = {
    src: string;
    alt: string;
    className?: string;
    /** Above-the-fold → cargar de inmediato. Por defecto false (lazy). */
    eager?: boolean;
};

export default function VehicleImage({ src, alt, className, eager = false }: Props) {
    const [failed, setFailed] = useState(!src);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        setFailed(!src);
        setLoaded(false);
    }, [src]);

    if (failed) {
        return (
            <div className={`flex items-center justify-center ${className ?? ''}`}>
                <Car className="h-2/3 w-2/3 text-black/20" strokeWidth={1.25} />
            </div>
        );
    }

    // Mantenemos el layout original (className aplicada al <img>) y solo
    // sumamos los atributos del browser para lazy + fade-in suave por opacidad.
    // No envuelvo en un div porque el contenedor padre ya define el tamaño y
    // los consumidores dependen de eso.
    return (
        <img
            src={src}
            alt={alt}
            loading={eager ? 'eager' : 'lazy'}
            decoding={eager ? 'sync' : 'async'}
            fetchPriority={eager ? 'high' : 'auto'}
            className={`${className ?? ''} transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setLoaded(true)}
            onError={() => setFailed(true)}
        />
    );
}
