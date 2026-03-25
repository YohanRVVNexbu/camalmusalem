import { Head, Link } from '@inertiajs/react';
import { Footer } from '@/components/landing/footer';
import { Navbar } from '@/components/landing/navbar';
import { useEffect } from 'react';
import { useInView } from '@/hooks/use-in-view';

type Noticia = {
    slug: string;
    titulo: string;
    categoria: string;
    fecha: string;
    imagen: string | null;
    descripcion: string;
    contenido: string;
};

export default function NoticiaShow({ footer, noticia }: { footer: any; noticia: Noticia }) {
    const heroInView = useInView(0.1);
    const contentInView = useInView(0.1);

    useEffect(() => {
        const html = document.documentElement;
        const prev = html.style.backgroundColor;
        html.style.backgroundColor = '#fff';
        return () => { html.style.backgroundColor = prev; };
    }, []);

    return (
        <div className="min-h-screen bg-white">
            <Head title={`${noticia.titulo} — Toyota Musalem`} />
            <Navbar variant="white" />

            <main className="flex flex-col bg-white">

                {/* Hero */}
                <section ref={heroInView.ref}>
                    <div
                        className={`flex h-165 flex-col items-start justify-end gap-5 rounded-b-[30px] px-10 py-15 transition-all duration-700 ease-out ${heroInView.visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}
                        style={{
                            background: noticia.imagen
                                ? `linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(0,0,0,0.80) 100%), linear-gradient(0deg, rgba(0,0,0,0.20) 0%, rgba(0,0,0,0.20) 100%), url(${noticia.imagen}) lightgray 50% / cover no-repeat`
                                : 'linear-gradient(180deg, #1a1a1a 0%, #000 100%)',
                        }}
                    >
                        {/* Badges */}
                        <div className="flex gap-2.5">
                            <span className="rounded-[3px] bg-white/20 px-1.25 py-1.25 text-sm leading-none text-white backdrop-blur-sm" style={{ fontFamily: '"Toyota Type"' }}>
                                {noticia.categoria}
                            </span>
                            <span className="rounded-[3px] bg-white/20 px-1.25 py-1.25 text-sm leading-none text-white backdrop-blur-sm" style={{ fontFamily: '"Toyota Type"' }}>
                                {noticia.fecha}
                            </span>
                        </div>
                        <h1
                            className="max-w-3xl text-[48px] font-normal leading-[110%] text-white"
                            style={{ fontFamily: '"Toyota Type"', fontFeatureSettings: '"liga" off, "clig" off' }}
                        >
                            {noticia.titulo}
                        </h1>
                    </div>
                </section>

                {/* Contenido */}
                <section ref={contentInView.ref} className="px-15 py-20">
                    <div className={`mx-auto max-w-3xl flex flex-col gap-8 transition-all duration-700 ease-out ${contentInView.visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>

                        {/* Descripción destacada */}
                        <p
                            className="text-xl leading-[140%] text-black/70"
                            style={{ fontFamily: '"Toyota Type"' }}
                        >
                            {noticia.descripcion}
                        </p>

                        <hr className="border-black/10" />

                        {/* Contenido principal */}
                        <div
                            className="text-base leading-[160%] text-black"
                            style={{ fontFamily: '"Toyota Type"' }}
                        >
                            {noticia.contenido}
                        </div>

                        {/* Volver */}
                        <Link
                            href="/noticias"
                            className="flex w-fit items-center gap-3 rounded-[60px] border border-black px-6 py-3 text-base leading-none text-black transition-colors hover:bg-black hover:text-white"
                            style={{ fontFamily: '"Toyota Type"' }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="14" viewBox="0 0 18 14" fill="none" className="rotate-180">
                                <path d="M0.75 6.75L16.75 6.75M16.75 6.75L10.75 12.75M16.75 6.75L10.75 0.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Volver a noticias
                        </Link>
                    </div>
                </section>

            </main>

            <div className="bg-white">
                <Footer data={footer} />
            </div>
        </div>
    );
}
