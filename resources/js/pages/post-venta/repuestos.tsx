import { Head } from '@inertiajs/react';
import { Footer } from '@/components/landing/footer';
import { Navbar } from '@/components/landing/navbar';
import navHero from '@images/navbar/repuestos.png?format=webp';

const categorias = [
    {
        titulo: 'Motor y transmisión',
        items: ['Filtros de aceite y aire', 'Correas y cadenas de distribución', 'Bujías y bobinas', 'Embragues y clutch', 'Juntas y retenes'],
    },
    {
        titulo: 'Frenos y suspensión',
        items: ['Pastillas y discos de freno', 'Tambores y zapatas', 'Amortiguadores', 'Resortes y muelles', 'Rótulas y brazos de control'],
    },
    {
        titulo: 'Sistema eléctrico',
        items: ['Baterías convencionales', 'Baterías híbridas/eléctricas', 'Alternadores y partidor', 'Sensores y actuadores', 'Faros y luces'],
    },
    {
        titulo: 'Carrocería',
        items: ['Parabrisas y vidrios', 'Espejos laterales', 'Manillas y cerraduras', 'Parachoques y molduras', 'Guardafangos y puertas'],
    },
    {
        titulo: 'Refrigeración y escape',
        items: ['Radiadores y termostatos', 'Bombas de agua', 'Escapes y catalizadores', 'Mangueras de radiador', 'Ventiladores'],
    },
    {
        titulo: 'Dirección',
        items: ['Cremalleras de dirección', 'Bombas hidráulicas', 'Terminales y rotulas', 'Columnas de dirección', 'Líquido de dirección asistida'],
    },
];

const ventajas = [
    { titulo: 'Repuestos originales', desc: 'Garantizamos que cada pieza cumple con las especificaciones de fábrica Toyota.' },
    { titulo: 'Compatibilidad verificada', desc: 'Buscamos el repuesto correcto según el año, modelo y versión de tu vehículo.' },
    { titulo: 'Stock disponible', desc: 'Amplio inventario de repuestos para los modelos más populares de la región.' },
    { titulo: 'Técnicos certificados', desc: 'Instalación por mecánicos con certificación Toyota para garantizar el trabajo.' },
];

export default function Repuestos({ footer }: { footer: any }) {
    return (
        <>
            <Head title="Repuestos — Toyota Musalem" />
            <Navbar variant="white" />

            <main className="flex flex-col">

                {/* Hero */}
                <section
                    className="relative flex items-end justify-start overflow-hidden"
                    style={{ minHeight: '520px', marginTop: '72px' }}
                >
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${navHero})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                    <div className="relative z-10 flex flex-col gap-4 px-15 pb-16">
                        <span className="text-sm font-medium uppercase tracking-widest text-white/70">Post Venta</span>
                        <h1 className="text-[52px] font-semibold leading-none text-white">Repuestos</h1>
                        <p className="max-w-lg text-lg leading-relaxed text-white/80">
                            Repuestos originales Toyota para mantener tu vehículo con el máximo rendimiento y seguridad.
                        </p>
                        <a
                            href="#categorias"
                            className="mt-4 flex w-fit items-center gap-2.5 rounded-[60px] bg-white px-6 py-3 text-sm font-medium text-black transition hover:bg-white/90"
                        >
                            Ver repuestos
                            <span className="flex size-6 items-center justify-center rounded-full bg-black">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="9" viewBox="0 0 12 9" fill="none">
                                    <path d="M1.39844 4.34961H11.3984M11.3984 4.34961L7.64844 0.599609M11.3984 4.34961L7.64844 8.09961" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </span>
                        </a>
                    </div>
                </section>

                {/* Ventajas */}
                <section className="bg-[#EAEAF1] px-15 py-20">
                    <div className="flex flex-col gap-10">
                        <h2 className="text-[32px] font-semibold leading-none text-black">¿Por qué repuestos originales?</h2>
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                            {ventajas.map((v) => (
                                <div key={v.titulo} className="flex flex-col gap-3 rounded-[20px] bg-white p-7">
                                    <h3 className="text-base font-semibold text-black">{v.titulo}</h3>
                                    <p className="text-sm leading-relaxed text-black/60">{v.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Categorías */}
                <section id="categorias" className="bg-white px-15 py-20">
                    <div className="flex flex-col gap-10">
                        <div className="flex flex-col gap-2">
                            <h2 className="text-[32px] font-semibold leading-none text-black">Catálogo de repuestos</h2>
                            <p className="text-base text-black/50">Encuentra el repuesto que necesitas según la categoría del sistema de tu Toyota.</p>
                        </div>
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                            {categorias.map((cat) => (
                                <div key={cat.titulo} className="flex flex-col gap-4 rounded-[20px] border border-black/10 p-7 transition hover:border-black/30">
                                    <h3 className="text-base font-semibold text-black">{cat.titulo}</h3>
                                    <ul className="flex flex-col gap-2">
                                        {cat.items.map((item) => (
                                            <li key={item} className="flex items-center gap-2 text-sm text-black/60">
                                                <span className="size-1.5 shrink-0 rounded-full bg-black/30" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="bg-black px-15 py-20">
                    <div className="flex flex-col items-center gap-6 text-center">
                        <h2 className="text-[32px] font-semibold leading-none text-white">¿No encuentras lo que buscas?</h2>
                        <p className="max-w-md text-base leading-relaxed text-white/60">
                            Cotiza el repuesto que necesitas directamente con nuestro equipo de post venta.
                        </p>
                        <a
                            href="https://wa.me/56912345678"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2.5 rounded-[60px] bg-white px-6 py-3 text-sm font-medium text-black transition hover:bg-white/90"
                        >
                            Cotizar por WhatsApp
                            <span className="flex size-6 items-center justify-center rounded-full bg-black">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="9" viewBox="0 0 12 9" fill="none">
                                    <path d="M1.39844 4.34961H11.3984M11.3984 4.34961L7.64844 0.599609M11.3984 4.34961L7.64844 8.09961" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </span>
                        </a>
                    </div>
                </section>

            </main>

            <Footer data={footer} />
        </>
    );
}
