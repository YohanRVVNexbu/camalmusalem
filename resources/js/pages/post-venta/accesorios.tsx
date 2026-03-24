import { Head } from '@inertiajs/react';
import { Footer } from '@/components/landing/footer';
import { Navbar } from '@/components/landing/navbar';
import navHero from '@images/navbar/accesorios.png?format=webp';

const categorias = [
    {
        titulo: 'Accesorios exteriores',
        items: ['Deflectores de viento', 'Protector de maletero', 'Barras portaequipaje', 'Faldones laterales', 'Protector de parachoque'],
    },
    {
        titulo: 'Accesorios interiores',
        items: ['Alfombrillas originales', 'Tapizado de asientos', 'Organizador de maletero', 'Parasol para luneta', 'Cubierta de consola'],
    },
    {
        titulo: 'Tecnología y conectividad',
        items: ['Cámara de retroceso', 'Sensor de estacionamiento', 'Dashcam Toyota', 'Cargador inalámbrico', 'Módulo de Apple CarPlay'],
    },
    {
        titulo: 'Seguridad',
        items: ['Alarma homologada', 'Inmovilizador adicional', 'Kit de triángulos y chaleco', 'Bloqueo de ruedas', 'GPS tracker'],
    },
    {
        titulo: 'Merchandising Toyota',
        items: ['Poleras y chaquetas', 'Gorros y accesorios', 'Tazas y termos', 'Llaveros coleccionables', 'Maquetas Toyota'],
    },
    {
        titulo: 'Cuidado del vehículo',
        items: ['Kit de limpieza Toyota', 'Cera de protección', 'Lámina protectora de pintura', 'Fundas para asientos', 'Ambientadores originales'],
    },
];

export default function Accesorios({ footer }: { footer: any }) {
    return (
        <>
            <Head title="Accesorios y Merch — Toyota Musalem" />
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
                        <h1 className="text-[52px] font-semibold leading-none text-white">Accesorios y Merch</h1>
                        <p className="max-w-lg text-lg leading-relaxed text-white/80">
                            Personaliza tu Toyota con accesorios originales y lleva la marca contigo con nuestra línea de merchandising.
                        </p>
                        <a
                            href="#categorias"
                            className="mt-4 flex w-fit items-center gap-2.5 rounded-[60px] bg-white px-6 py-3 text-sm font-medium text-black transition hover:bg-white/90"
                        >
                            Ver catálogo
                            <span className="flex size-6 items-center justify-center rounded-full bg-black">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="9" viewBox="0 0 12 9" fill="none">
                                    <path d="M1.39844 4.34961H11.3984M11.3984 4.34961L7.64844 0.599609M11.3984 4.34961L7.64844 8.09961" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </span>
                        </a>
                    </div>
                </section>

                {/* Por qué accesorios originales */}
                <section className="bg-[#EAEAF1] px-15 py-20">
                    <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:gap-20">
                        <div className="flex flex-col gap-5 lg:w-1/2">
                            <h2 className="text-[32px] font-semibold leading-tight text-black">¿Por qué elegir accesorios originales Toyota?</h2>
                            <p className="text-base leading-relaxed text-black/60">
                                Los accesorios originales Toyota están diseñados específicamente para cada modelo, garantizando un ajuste perfecto,
                                mayor durabilidad y sin afectar la garantía de tu vehículo.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 lg:w-1/2">
                            {[
                                { titulo: 'Compatibilidad garantizada', desc: 'Diseñados para tu modelo específico.' },
                                { titulo: 'Garantía Toyota', desc: 'No afecta la garantía de fábrica.' },
                                { titulo: 'Calidad certificada', desc: 'Mismos estándares que tu vehículo.' },
                            ].map((b) => (
                                <div key={b.titulo} className="flex flex-col gap-3 rounded-[20px] bg-white p-6">
                                    <h3 className="text-sm font-semibold text-black">{b.titulo}</h3>
                                    <p className="text-sm leading-relaxed text-black/50">{b.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Categorías */}
                <section id="categorias" className="bg-white px-15 py-20">
                    <div className="flex flex-col gap-10">
                        <h2 className="text-[32px] font-semibold leading-none text-black">Categorías</h2>
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
                        <h2 className="text-[32px] font-semibold leading-none text-white">¿Buscas algo en particular?</h2>
                        <p className="max-w-md text-base leading-relaxed text-white/60">
                            Nuestros asesores te ayudarán a encontrar el accesorio ideal para tu Toyota.
                        </p>
                        <a
                            href="https://wa.me/56912345678"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2.5 rounded-[60px] bg-white px-6 py-3 text-sm font-medium text-black transition hover:bg-white/90"
                        >
                            Consultar por WhatsApp
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
