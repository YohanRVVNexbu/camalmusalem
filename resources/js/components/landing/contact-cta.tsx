interface ContactCtaProps {
    backgroundImage: string;
}

export function ContactCta({ backgroundImage }: ContactCtaProps) {
    return (
        <div className="flex flex-col items-center bg-[#EAEAF1] p-15">
            <div
                className="flex w-full flex-col items-start justify-end rounded-[30px] p-7.5"
                style={{
                    backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 100%), url(${backgroundImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    height: '340px',
                }}
            >
                <div className="flex flex-col gap-7.5">
                    <p className="w-90 text-2xl leading-[120%] text-white">
                        Contáctanos para recibir asesoría personalizada
                    </p>
                    <a
                        href="/contacto"
                        className="flex w-fit cursor-pointer items-center gap-2.5 rounded-[60px] bg-white p-1 pl-3.5 text-base leading-none text-black transition hover:bg-white/90"
                    >
                        Contactar ventas
                        <span className="flex size-10 items-center justify-center rounded-full bg-black">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="9" viewBox="0 0 12 9" fill="none">
                                <path d="M1.39844 4.34961H11.3984M11.3984 4.34961L7.64844 0.599609M11.3984 4.34961L7.64844 8.09961" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </span>
                    </a>
                </div>
            </div>
        </div>
    );
}
