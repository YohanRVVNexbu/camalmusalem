import { Head } from '@inertiajs/react';
import { Footer } from '@/components/landing/footer';
import { Navbar } from '@/components/landing/navbar';
import { useEffect } from 'react';
import heroImg from '@images/prices/hero_image.png?format=webp';

const columns = [
    'KM', 'Yaris', 'Yaris Cross', 'Raize', 'Corolla', 'Corolla\nCross', 'Rav4',
    'Hilux 4*2', 'Hilux/\nFortuner 4*4', 'Rush', '4Runner', 'Prius', 'Prado',
];

const rows = [
    ['10.000 KM', '$209.990', '$229.990', '$209.990', '$224.990', '$269.990', '$279.990', '$340.000', '$340.000', '$254.990', '$309.990', '$264.990', '$404.990'],
    ['20.000 KM', '$224.990', '$264.990', '$224.990', '$264.990', '$304.990', '$309.990', '$444.000', '$444.000', '$304.990', '$304.990', '$374.990', '$454.990'],
    ['30.000 KM', '$209.990', '$229.990', '$209.990', '$224.990', '$269.990', '$279.990', '$340.000', '$340.000', '$254.990', '$309.990', '$264.990', '$404.990'],
    ['40.000 KM', '$299.990', '$339.990', '$299.990', '$314.990', '$389.990', '$494.990', '$600.000', '$690.000', '$384.990', '$649.990', '$344.990', '$429.990'],
    ['50.000 KM', '$209.990', '$229.990', '$209.990', '$224.990', '$269.990', '$279.990', '$340.000', '$340.000', '$254.990', '$309.990', '$264.990', '$404.990'],
    ['60.000 KM', '$224.990', '$264.990', '$224.990', '$264.990', '$304.990', '$309.990', '$444.000', '$444.000', '$304.990', '$304.990', '$374.990', '$454.990'],
    ['70.000 KM', '$209.990', '$229.990', '$209.990', '$224.990', '$269.990', '$279.990', '$340.000', '$340.000', '$254.990', '$309.990', '$264.990', '$404.990'],
    ['80.000 KM', '$299.990', '$339.990', '$299.990', '$314.990', '$389.990', '$494.990', '$600.000', '$690.000', '$384.990', '$649.990', '$344.990', '$429.990'],
    ['90.000 KM', '$209.990', '$229.990', '$209.990', '$224.990', '$269.990', '$279.990', '$340.000', '$340.000', '$254.990', '$309.990', '$264.990', '$404.990'],
    ['100.000 KM', '$299.990', '$339.990', '$299.990', '$314.990', '$389.990', '$494.990', '$600.000', '$690.000', '$384.990', '$649.990', '$344.990', '$429.990'],
];

export default function ValoresMantencion({ footer }: { footer: any }) {
    useEffect(() => {
        const html = document.documentElement;
        const prev = html.style.backgroundColor;
        html.style.backgroundColor = '#EAEAF1';
        return () => { html.style.backgroundColor = prev; };
    }, []);

    return (
        <div className="min-h-screen bg-[#EAEAF1]">
            <Head title="Valores Mantención 2026 — Toyota Musalem" />
            <Navbar variant="white" />

            <main className="flex flex-col bg-[#EAEAF1]">

                {/* Hero */}
                <section className="bg-[#EAEAF1] pb-20">
                    <div
                        className="relative h-119.25 shrink-0 overflow-hidden rounded-b-[30px]"
                        style={{
                            backgroundImage: `url(${heroImg})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                        }}
                    >
                        <div
                            className="absolute inset-0"
                            style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.60) 100%)' }}
                        />
                        <div
                            className="absolute inset-0"
                            style={{ background: 'rgba(0,0,0,0.20)' }}
                        />
                        <span
                            className="absolute left-1/2 text-center text-[48px] leading-[100%] font-normal text-white"
                            style={{
                                top: 'calc(50% + 31.5px)',
                                translate: '-50%',
                                fontFamily: '"Toyota Type"',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            Valores mantención 2026
                        </span>
                    </div>
                </section>

                {/* Tabla de precios */}
                <section className="px-15 pb-20">
                    <div className="rounded-[30px] bg-white p-2.5 flex flex-col gap-2.5">

                        {/* Header */}
                        <div className="flex rounded-[20px] overflow-hidden">
                            {columns.map((col, i) => (
                                <div
                                    key={i}
                                    className="flex-1 bg-black px-2.5 py-3 flex items-center"
                                >
                                    <span className={`whitespace-pre-line text-white leading-none ${i === 0 ? 'text-base' : 'text-sm'}`} style={{ fontFamily: '"Toyota Type"' }}>
                                        {col}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Rows */}
                        <div className="flex flex-col gap-1">
                            {rows.map((row, rowIdx) => {
                                const isGray = rowIdx % 2 === 0;
                                return (
                                    <div
                                        key={rowIdx}
                                        className={`flex h-9.5 rounded-[20px] overflow-hidden ${isGray ? 'bg-[#EAEAF1]' : 'border border-black/20'}`}
                                    >
                                        {row.map((cell, colIdx) => (
                                            <div
                                                key={colIdx}
                                                className="flex-1 px-2.5 py-3 flex items-center"
                                            >
                                                <span className="text-sm leading-none text-black" style={{ fontFamily: '"Toyota Type"' }}>
                                                    {cell}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

            </main>

            <div className="bg-[#EAEAF1]">
                <Footer data={footer} />
            </div>
        </div>
    );
}
