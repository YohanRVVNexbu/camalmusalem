import { Link } from '@inertiajs/react';

export type NoticiaItem = {
    id: number;
    categoria: string;
    fecha: string;
    titulo: string;
    descripcion: string;
    img: string;
};

export function NoticiaCard({ noticia }: { noticia: NoticiaItem }) {
    return (
        <div className="flex flex-col overflow-hidden rounded-[30px]">
            {/* Imagen */}
            <div
                className="h-60 w-full"
                style={{
                    background: noticia.img
                        ? `linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.20) 100%), url(${noticia.img}) lightgray 50% / cover no-repeat`
                        : 'linear-gradient(180deg, #c8c8c8 0%, #a0a0a0 100%)',
                }}
            />
            {/* Contenido */}
            <div className="flex flex-col gap-5 bg-white p-5">
                <div className="flex flex-col gap-5">
                    <div className="flex gap-2.5">
                        <span className="rounded-[3px] bg-[#EAEAF1] px-1.25 py-1.25 text-sm leading-none text-black/60" style={{ fontFamily: '"Toyota Type"' }}>
                            {noticia.categoria}
                        </span>
                        <span className="rounded-[3px] bg-[#EAEAF1] px-1.25 py-1.25 text-sm leading-none text-black/60" style={{ fontFamily: '"Toyota Type"' }}>
                            {noticia.fecha}
                        </span>
                    </div>
                    <h3 className="text-xl font-semibold leading-[120%] text-black" style={{ fontFamily: '"Toyota Type"' }}>
                        {noticia.titulo}
                    </h3>
                    <p className="text-base leading-[120%] text-black" style={{ fontFamily: '"Toyota Type"' }}>
                        {noticia.descripcion}
                    </p>
                </div>
                {/* Botón */}
                <Link
                    href={`/noticias/${noticia.id}`}
                    className="flex cursor-pointer items-center justify-between rounded-[60px] border border-transparent bg-black p-1 transition-opacity hover:opacity-80"
                >
                    <span className="pl-2.5 text-base leading-none text-white" style={{ fontFamily: '"Toyota Type"' }}>
                        Leer noticia
                    </span>
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="14" viewBox="0 0 18 14" fill="none">
                            <path d="M0.75 6.75L16.75 6.75M16.75 6.75L10.75 12.75M16.75 6.75L10.75 0.75" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </span>
                </Link>
            </div>
        </div>
    );
}
