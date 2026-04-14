import { Car } from 'lucide-react';
import { useState, useEffect } from 'react';

type Props = {
    src: string;
    alt: string;
    className?: string;
};

export default function VehicleImage({ src, alt, className }: Props) {
    const [failed, setFailed] = useState(!src);

    useEffect(() => {
        setFailed(!src);
    }, [src]);

    if (failed) {
        return (
            <div className={`flex items-center justify-center ${className ?? ''}`}>
                <Car className="h-2/3 w-2/3 text-black/20" strokeWidth={1.25} />
            </div>
        );
    }

    return (
        <img
            src={src}
            alt={alt}
            className={className}
            onError={() => setFailed(true)}
        />
    );
}
