interface BranchesSectionProps {
    image1: string;
    image2: string;
    title?: string;
    background?: string;
    backgroundStyle?: string;
    textColor?: string;
}

const branches = [
    {
        name: 'La Serena',
        address: 'Av. Francisco de Aguirre #70',
        phones: {
            sucursal: '(51) 2 543 775',
            repuestos: '(51) 2 543 775',
            servicioTecnico: ['(51) 2 544 710', '(51) 2 544 711'],
        },
    },
    {
        name: 'Ovalle',
        address: 'Ariztía #358',
        phones: {
            sucursal: '(53) 2 433 277',
            repuestos: '(53) 2 433 223',
            servicioTecnico: ['(53) 2 433 229'],
        },
    },
];

const cardStyle = {
    background: 'linear-gradient(to left, rgba(0,0,0,0.2), rgba(0,0,0,0.2))',
    backdropFilter: 'blur(30px)',
};

export function BranchesSection({ image1, image2, title, background, backgroundStyle, textColor }: BranchesSectionProps) {
    const bg = backgroundStyle ? '' : (background ?? 'bg-black');
    const color = textColor ?? 'text-white';
    const heading = title ?? 'Visítanos en\nnuestras sucursales';
    const images = [image1, image2];

    return (
        <div className={`flex flex-col items-center gap-10 px-15 py-20 ${bg}`} style={backgroundStyle ? { background: backgroundStyle } : undefined}>
            <h2 className={`text-center text-[32px] leading-[120%] ${color}`}>
                {heading.split('\n').map((line, i, arr) => (
                    <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
                ))}
            </h2>
            <div className="flex w-full gap-5">
                {branches.map((branch, i) => (
                    <div key={branch.name} className="group relative flex-1 overflow-hidden rounded-[20px]">
                        <img src={images[i]} alt={`Sucursal ${branch.name}`} className="h-135 w-full object-cover" />

                        {/* Card acordeón */}
                        <div
                            className="absolute bottom-5 left-5 w-92.25 overflow-hidden rounded-2xl p-5 transition-all duration-500 ease-in-out"
                            style={cardStyle}
                        >
                            <div className="flex flex-col gap-4">
                                {/* Nombre */}
                                <span className="text-xl font-semibold uppercase leading-none text-white" style={{ fontFamily: '"Toyota Type"' }}>
                                    {branch.name}
                                </span>

                                {/* Dirección */}
                                <div className="flex items-center justify-between">
                                    <span className="text-sm leading-none text-white" style={{ fontFamily: '"Toyota Type"' }}>
                                        {branch.address}
                                    </span>
                                    {/* Ver en Google Maps — visible solo en hover */}
                                    <span
                                        className="max-w-0 overflow-hidden whitespace-nowrap text-xs font-semibold leading-[120%] text-white opacity-0 transition-all duration-500 group-hover:max-w-xs group-hover:opacity-100"
                                        style={{ fontFamily: '"Toyota Type"' }}
                                    >
                                        Ver en Google Maps
                                    </span>
                                </div>

                                {/* Contenido expandible */}
                                <div className="grid grid-rows-[0fr] transition-all duration-500 ease-in-out group-hover:grid-rows-[1fr]">
                                    <div className="overflow-hidden">
                                        <div className="flex flex-col gap-4 pt-0">
                                            {/* Ver teléfonos */}
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-semibold leading-none text-white" style={{ fontFamily: '"Toyota Type"' }}>
                                                    Ver teléfonos sucursal
                                                </span>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="17" viewBox="0 0 18 17" fill="none">
                                                    <path d="M0.390625 8H17.1648" stroke="white" />
                                                    <path d="M8.39062 0V16.7742" stroke="white" />
                                                </svg>
                                            </div>

                                            {/* Teléfono sucursal */}
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm leading-none text-white" style={{ fontFamily: '"Toyota Type"' }}>Teléfono sucursal:</span>
                                                <span className="text-sm leading-none text-white" style={{ fontFamily: '"Toyota Type"' }}>{branch.phones.sucursal}</span>
                                            </div>

                                            {/* Teléfono repuestos */}
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm leading-none text-white" style={{ fontFamily: '"Toyota Type"' }}>Teléfono Repuestos:</span>
                                                <span className="text-sm leading-none text-white" style={{ fontFamily: '"Toyota Type"' }}>{branch.phones.repuestos}</span>
                                            </div>

                                            {/* Teléfono servicio técnico */}
                                            <div className="flex items-start justify-between">
                                                <span className="text-sm leading-none text-white" style={{ fontFamily: '"Toyota Type"' }}>Teléfono Servicio Técnico:</span>
                                                <div className="flex flex-col gap-2.5 items-end">
                                                    {branch.phones.servicioTecnico.map((tel) => (
                                                        <span key={tel} className="text-sm leading-none text-white" style={{ fontFamily: '"Toyota Type"' }}>{tel}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Ver detalles — se oculta en hover */}
                                <div className="grid grid-rows-[1fr] transition-all duration-500 ease-in-out group-hover:grid-rows-[0fr]">
                                    <div className="overflow-hidden">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-semibold leading-none text-white" style={{ fontFamily: '"Toyota Type"' }}>
                                                Ver detalles sucursal
                                            </span>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="17" viewBox="0 0 18 17" fill="none">
                                                <path d="M0.390625 8H17.1648" stroke="white" />
                                                <path d="M8.39062 0V16.7742" stroke="white" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
