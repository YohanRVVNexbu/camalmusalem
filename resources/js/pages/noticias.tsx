import { Head, Link } from '@inertiajs/react';
import { Footer } from '@/components/landing/footer';
import { Navbar } from '@/components/landing/navbar';
import { useEffect, useState } from 'react';
import { useInView } from '@/hooks/use-in-view';
import heroImg from '@images/noticias/hero_image.png?format=webp';

const categorias = ['Todas', 'Noticias', 'Concursos', 'Reconocimientos', 'Camal Musalem', 'Mundo Toyota'];

const noticias = [
    { id: 1, categoria: 'Mundo Toyota', fecha: '11/12/25', titulo: 'Toyota protagoniza el Japan Mobility Show 2025 con su visión de movilidad global', descripcion: 'En el evento realizado en Tokio destacó la presentación de la nueva estrategia global de Toyota Motor Corporation', img: '' },
    { id: 2, categoria: 'Noticias', fecha: '05/12/25', titulo: 'Nueva sucursal Camal Musalem abre sus puertas en La Serena', descripcion: 'La empresa refuerza su presencia en la Región de Coquimbo con una nueva instalación de última generación', img: '' },
    { id: 3, categoria: 'Reconocimientos', fecha: '28/11/25', titulo: 'Camal Musalem recibe premio a la excelencia en servicio Toyota Chile', descripcion: 'Por segundo año consecutivo, la concesionaria obtiene el reconocimiento más importante del sector automotriz', img: '' },
    { id: 4, categoria: 'Concursos', fecha: '20/11/25', titulo: 'Participa y gana un servicio técnico gratuito para tu Toyota', descripcion: 'Sigue los pasos del concurso en nuestras redes sociales y llévate un servicio completo sin costo', img: '' },
    { id: 5, categoria: 'Mundo Toyota', fecha: '15/11/25', titulo: 'Toyota presenta la nueva generación del RAV4 híbrido para Latinoamérica', descripcion: 'El SUV más vendido del mundo llega renovado con mayor autonomía y tecnología de punta', img: '' },
    { id: 6, categoria: 'Camal Musalem', fecha: '10/11/25', titulo: 'Nuestro equipo de servicio técnico certifica nuevos estándares Toyota', descripcion: 'Los técnicos de Camal Musalem completaron la capacitación internacional exigida por Toyota Chile S.A.', img: '' },
    { id: 7, categoria: 'Noticias', fecha: '01/11/25', titulo: 'Nuevos horarios de atención en sucursal Ovalle para la temporada de verano', descripcion: 'A partir de diciembre, la sucursal de Ovalle extiende su horario de atención para mayor comodidad de nuestros clientes', img: '' },
    { id: 8, categoria: 'Mundo Toyota', fecha: '25/10/25', titulo: 'Toyota lidera ventas de vehículos híbridos en Chile por tercer año consecutivo', descripcion: 'Los modelos híbridos de Toyota representan el 40% de las ventas totales de la marca en el mercado chileno', img: '' },
    { id: 9, categoria: 'Concursos', fecha: '18/10/25', titulo: '¡Ganadores del concurso Musalem Fest 2025!', descripcion: 'Conoce a los afortunados ganadores de nuestro gran concurso anual y cómo reclamar sus premios', img: '' },
];

function NoticiaCard({ noticia }: { noticia: typeof noticias[0] }) {
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

export default function Noticias({ footer }: { footer: any }) {
    const heroInView = useInView(0.1);
    const [categoriaActiva, setCategoriaActiva] = useState('Todas');

    useEffect(() => {
        const html = document.documentElement;
        const prev = html.style.backgroundColor;
        html.style.backgroundColor = '#fff';
        return () => { html.style.backgroundColor = prev; };
    }, []);

    return (
        <div className="min-h-screen bg-white">
            <Head title="Noticias — Toyota Musalem" />
            <Navbar variant="white" />

            <main className="flex flex-col bg-white">

                {/* Hero */}
                <section ref={heroInView.ref}>
                    <div
                        className={`flex h-165 flex-col items-start justify-end gap-10 rounded-b-[30px] px-10 py-15 transition-all duration-700 ease-out ${heroInView.visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}
                        style={{
                            background: `linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(0,0,0,0.80) 100%), linear-gradient(0deg, rgba(0,0,0,0.20) 0%, rgba(0,0,0,0.20) 100%), url(${heroImg}) lightgray 50% / cover no-repeat`,
                        }}
                    >
                        <span
                            className="text-[48px] font-normal leading-[100%] text-white"
                            style={{ fontFamily: '"Toyota Type"', fontFeatureSettings: '"liga" off, "clig" off' }}
                        >
                            Noticias / Blog Musalem
                        </span>
                    </div>
                </section>

                {/* Filtros */}
                <section className="flex flex-col gap-5 px-15 py-20">
                    {/* Header */}
                    <div className="flex items-center justify-between self-stretch">
                        <span className="text-[32px] leading-[120%] text-black" style={{ fontFamily: '"Toyota Type"' }}>
                            Lo último en Musalem
                        </span>
                        <div className="relative flex h-11 w-65 items-center justify-between rounded-[60px] border border-black bg-[#EAEAF1] px-5 py-2.5">
                            <span className="pb-1 text-base leading-none text-black" style={{ fontFamily: '"Toyota Type"' }}>
                                Ordenar:
                            </span>
                            <svg width="5" height="8" viewBox="0 0 5 8" fill="none">
                                <path d="M1 1L4 4L1 7" stroke="black" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <select className="absolute inset-0 cursor-pointer opacity-0">
                                <option>Más recientes</option>
                                <option>Más antiguos</option>
                            </select>
                        </div>
                    </div>

                    {/* Categorías */}
                    <div className="flex flex-row items-center gap-3.5">
                        <span className="text-base leading-none text-black" style={{ fontFamily: '"Toyota Type"' }}>
                            Categorías:
                        </span>
                        {categorias.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setCategoriaActiva(cat)}
                                className={`cursor-pointer rounded-[60px] border px-5 py-2.5 text-base leading-none transition-colors ${
                                    categoriaActiva === cat
                                        ? 'border-black/80 bg-black text-white/80'
                                        : 'border-black/80 bg-transparent text-black/80 hover:bg-black/10'
                                }`}
                                style={{ fontFamily: '"Toyota Type"' }}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </section>

                {/* Grid noticias */}
                <section className="px-15 pb-20">
                    <div className="grid grid-cols-3 gap-5">
                        {noticias.map((noticia) => (
                            <NoticiaCard key={noticia.id} noticia={noticia} />
                        ))}
                    </div>

                    {/* Paginador */}
                    <div className="mt-15 flex items-center justify-center gap-2.5">
                        {[1, 2, 3, 4].map((page) => (
                            <button
                                key={page}
                                className={`flex size-10 items-center justify-center rounded-full border border-black text-base leading-none transition-colors ${
                                    page === 1 ? 'bg-black text-white' : 'bg-white text-black hover:bg-black/5'
                                }`}
                                style={{ fontFamily: '"Toyota Type"' }}
                            >
                                {page}
                            </button>
                        ))}
                    </div>
                </section>

            </main>

            <div className="bg-white">
                <Footer data={footer} />
            </div>
        </div>
    );
}
