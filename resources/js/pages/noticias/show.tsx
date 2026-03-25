import { Head, Link } from '@inertiajs/react';
import { Footer } from '@/components/landing/footer';
import { Navbar } from '@/components/landing/navbar';
import { useEffect } from 'react';
import { useInView } from '@/hooks/use-in-view';
import { NoticiaCard, type NoticiaItem } from '@/components/landing/noticia-card';
import card1Img from '@images/noticias/card_1.png?format=webp';
import card2Img from '@images/noticias/card_2.png?format=webp';

const relacionadas: NoticiaItem[] = [
    { id: 2, categoria: 'Noticias', fecha: '05/12/25', titulo: 'Nueva sucursal Camal Musalem abre sus puertas en La Serena', descripcion: 'La empresa refuerza su presencia en la Región de Coquimbo con una nueva instalación de última generación', img: '' },
    { id: 3, categoria: 'Reconocimientos', fecha: '28/11/25', titulo: 'Camal Musalem recibe premio a la excelencia en servicio Toyota Chile', descripcion: 'Por segundo año consecutivo, la concesionaria obtiene el reconocimiento más importante del sector automotriz', img: '' },
    { id: 5, categoria: 'Mundo Toyota', fecha: '15/11/25', titulo: 'Toyota presenta la nueva generación del RAV4 híbrido para Latinoamérica', descripcion: 'El SUV más vendido del mundo llega renovado con mayor autonomía y tecnología de punta', img: '' },
];

type Noticia = {
    slug: string;
    titulo: string;
    categoria: string;
    fecha: string;
    imagen: string | null;
    descripcion: string;
    contenido: string;
};

function ArrowLeft() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="14" viewBox="0 0 18 14" fill="none">
            <path d="M17.25 6.75L1.25 6.75M1.25 6.75L7.25 12.75M1.25 6.75L7.25 0.75" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    );
}

export default function NoticiaShow({ footer, noticia }: { footer: any; noticia: Noticia }) {
    const inView = useInView(0.05);

    useEffect(() => {
        const html = document.documentElement;
        const prev = html.style.backgroundColor;
        html.style.backgroundColor = '#EAEAF1';
        return () => { html.style.backgroundColor = prev; };
    }, []);

    return (
        <div className="min-h-screen bg-[#EAEAF1]">
            <Head title={`${noticia.titulo} — Toyota Musalem`} />
            <Navbar variant="white" />

            <main className="flex flex-col bg-[#EAEAF1]">
                <section ref={inView.ref} className="flex flex-col gap-8 px-15 pb-20 pt-32">
                    <div className={`flex flex-col gap-8 transition-all duration-700 ease-out ${inView.visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}>

                        {/* Navegación */}
                        <div className="flex items-center justify-between">
                            {/* Volver */}
                            <Link
                                href="/noticias"
                                className="flex h-9.5 cursor-pointer items-center gap-2.5 rounded-[60px] border border-black py-2.5 pl-2.5 pr-5 transition-opacity hover:opacity-70"
                            >
                                <span className="flex size-6 items-center justify-center rounded-full">
                                    <ArrowLeft />
                                </span>
                                <span className="text-sm leading-none text-black" style={{ fontFamily: '"Toyota Type"' }}>
                                    Volver
                                </span>
                            </Link>

                            {/* Compartir (invisible, reserva espacio) */}
                            <div className="flex h-9.5 items-center gap-2.5 rounded-[60px] border border-black px-5 py-2.5 opacity-0">
                                <span className="size-6" />
                                <span className="text-sm leading-none text-black" style={{ fontFamily: '"Toyota Type"' }}>
                                    Compartir
                                </span>
                            </div>
                        </div>

                        {/* Título */}
                        <h1
                            className="text-center text-[48px] font-normal leading-[120%] text-black"
                            style={{ fontFamily: '"Toyota Type"', fontFeatureSettings: '"liga" off, "clig" off' }}
                        >
                            {noticia.titulo}
                        </h1>

                        {/* Imagen */}
                        <div
                            className="flex h-120.75 flex-col items-start justify-end gap-2.5 self-stretch rounded-[30px] p-7.5"
                            style={{
                                background: noticia.imagen
                                    ? `linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.20) 100%), url(${noticia.imagen}) lightgray 50% / cover no-repeat`
                                    : 'linear-gradient(180deg, #c8c8c8 0%, #a0a0a0 100%)',
                            }}
                        />

                        {/* Categoría, fecha y contenido */}
                        <div className="flex flex-col gap-8 px-50">
                            {/* Categoría y fecha */}
                            <div className="flex gap-2.5">
                                <span className="rounded-[3px] p-1.25 text-sm leading-none text-black/60" style={{ fontFamily: '"Toyota Type"' }}>
                                    {noticia.categoria}
                                </span>
                                <span className="rounded-[3px] p-1.25 text-sm leading-none text-black/60" style={{ fontFamily: '"Toyota Type"' }}>
                                    {noticia.fecha}
                                </span>
                            </div>

                            {/* Contenido WYSIWYG */}
                            <div
                                className="wysiwyg-content text-black"
                                style={{ fontFamily: '"Toyota Type"' }}
                                dangerouslySetInnerHTML={{ __html: noticia.contenido }}
                            />

                            {/* Cards de imágenes */}
                            <div className="flex gap-5">
                                {[card1Img, card2Img].map((img, i) => (
                                    <div
                                        key={i}
                                        className="flex h-120.75 flex-1 flex-col items-start justify-end gap-2.5 rounded-[30px] p-7.5"
                                        style={{
                                            background: `linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.20) 100%), url(${img}) lightgray 50% / cover no-repeat`,
                                        }}
                                    />
                                ))}
                            </div>

                            {/* Texto adicional */}
                            <div
                                className="wysiwyg-content text-black"
                                style={{ fontFamily: '"Toyota Type"' }}
                                dangerouslySetInnerHTML={{
                                    __html: `<p><strong>Principales presentaciones y avances de vehículos</strong></p>
<p>El evento realizado en Tokio destacó por la presentación de la nueva estrategia global de Toyota Motor Corporation, que reorganiza su estructura en torno a cinco marcas: Toyota, Lexus, GR, Century y Daihatsu, como parte de su evolución hacia una empresa integral de movilidad. Estos cambios impactarán en el futuro al mercado chileno, donde la marca ya lidera varios segmentos claves, incluyendo el de vehículos cero y bajas emisiones.</p>
<p>Entre los destacados de Toyota en el Japan Mobility Show 2025, se presentaron diversos conceptos y estudios de vehículos que anticipan el futuro de la marca dentro de su estrategia de movilidad. La nueva propuesta para la línea Century, que la compañía está desarrollando como una submarca de lujo independiente, debutó con el Century "One of One" Concept, un SUV coupé de gran amplitud interior y puertas correderas, orientado al segmento del ultralujo.</p>
<p>Además, Toyota exhibió una amplia gama de tecnologías y soluciones de movilidad personal, logística, asistencia y "movilidad ampliada" más allá del automóvil tradicional, incluyendo vehículos modulares, plataformas compartidas y movilidad urbana ligera. Entre los modelos más sobresalientes figuró el FJ Cruiser 2026, reinterpretación moderna del icónico todoterreno, que combina un diseño robusto con sistemas de propulsión más limpios y eficientes.</p>
<p>Por su parte, Lexus presentó su visión de movilidad premium y conectada con el LS Concept, una minivan de lujo de seis ruedas que propone una nueva experiencia de transporte de alto nivel, junto a su ecosistema "Discover", diseñado para integrar servicios, conectividad y personalización. Estas presentaciones reflejaron la estrategia integral del Grupo Toyota, que busca ofrecer soluciones diversas bajo una misma visión de movilidad global.</p>
<p><strong>Evaluación y compra: modelos híbridos Toyota para el uso diario en Chile</strong><br/>Evalúa y compra tu híbrido Toyota en Chile: ahorro de combustible, eficiencia diaria, menor impacto ambiental y respaldo de marca. Conoce modelos y opciones de financiamiento autos híbridos.</p>`
                                }}
                            />

                        </div>

                    </div>
                </section>
            </main>

            {/* Te podrían interesar */}
            <section className="flex flex-col items-center gap-10 px-15 pb-20">
                <h2
                    className="self-stretch text-[32px] font-normal leading-[120%] text-black"
                    style={{ fontFamily: '"Toyota Type"' }}
                >
                    Te podrían interesar
                </h2>
                <div className="grid w-full grid-cols-3 gap-5">
                    {relacionadas.map((n) => (
                        <NoticiaCard key={n.id} noticia={n} />
                    ))}
                </div>
            </section>

            <div className="bg-[#EAEAF1]">
                <Footer data={footer} />
            </div>
        </div>
    );
}
