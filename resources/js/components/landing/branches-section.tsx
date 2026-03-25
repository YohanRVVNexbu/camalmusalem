interface BranchesSectionProps {
    image1: string;
    image2: string;
}

export function BranchesSection({ image1, image2 }: BranchesSectionProps) {
    return (
        <div className="flex flex-col items-center gap-10 bg-black px-15 py-20">
            <h2 className="text-center text-[32px] leading-[120%] text-white">
                Visítanos en
                <br />
                nuestras sucursales
            </h2>
            <div className="flex w-full gap-5">
                <div className="relative flex-1 overflow-hidden rounded-[20px]">
                    <img src={image1} alt="Sucursal La Serena" className="h-85 w-full object-cover" />
                    <div
                        className="absolute bottom-5 left-5 flex w-92.25 flex-col gap-2.5 rounded-2xl p-5"
                        style={{ background: 'linear-gradient(0deg, rgba(0,0,0,0.20) 0%, rgba(0,0,0,0.20) 100%), rgba(255,255,255,0.20)', backdropFilter: 'blur(30px)' }}
                    >
                        <span className="text-xl font-semibold uppercase leading-none text-white">La Serena</span>
                        <span className="text-sm leading-none text-white">Av. Francisco de Aguirre #70</span>
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold leading-none text-white">Ver detalles sucursal</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="17" viewBox="0 0 18 17" fill="none">
                                <path d="M0.390625 8H17.1648" stroke="white" />
                                <path d="M8.39062 0V16.7742" stroke="white" />
                            </svg>
                        </div>
                    </div>
                </div>
                <div className="relative flex-1 overflow-hidden rounded-[20px]">
                    <img src={image2} alt="Sucursal Ovalle" className="h-85 w-full object-cover" />
                    <div
                        className="absolute bottom-5 left-5 flex w-92.25 flex-col gap-2.5 rounded-2xl p-5"
                        style={{ background: 'linear-gradient(0deg, rgba(0,0,0,0.20) 0%, rgba(0,0,0,0.20) 100%), rgba(255,255,255,0.20)', backdropFilter: 'blur(30px)' }}
                    >
                        <span className="text-xl font-semibold uppercase leading-none text-white">Ovalle</span>
                        <span className="text-sm leading-none text-white">Ariztía #358</span>
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold leading-none text-white">Ver detalles sucursal</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="17" viewBox="0 0 18 17" fill="none">
                                <path d="M0.390625 8H17.1648" stroke="white" />
                                <path d="M8.39062 0V16.7742" stroke="white" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
