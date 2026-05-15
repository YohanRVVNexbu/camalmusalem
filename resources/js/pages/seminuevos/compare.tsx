import { Head, Link, router } from '@inertiajs/react';
import { formatCLP } from '@/lib/format';
import { Footer } from '@/components/landing/footer';
import { Navbar } from '@/components/landing/navbar';
import { SpeedometerIcon } from '@/components/icons/speedometer-icon';
import { TransmissionIcon } from '@/components/icons/transmission-icon';
import { FuelElectricIcon } from '@/components/icons/fuel-electric-icon';
import { FuelGasIcon } from '@/components/icons/fuel-gas-icon';
import { FuelHybridIcon } from '@/components/icons/fuel-hybrid-icon';
import { ShareIcon } from '@/components/icons/share-icon';
import certificateImg from '@images/seminuevos/certificate-toyota.png?format=webp';
import ejemploVideo from '@images/seminuevos/ejemplo-video.png?format=webp';
import { X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

// ── Tipos ─────────────────────────────────────────────────────────────────────
type Vehiculo = {
    id: string;               // "s-1" | "v-2"
    tipo: 'seminuevo' | 'nuevo';
    estado: 'Nuevo' | 'Semi Nuevo';
    brand: string;
    model: string;
    version: string;
    year: number;
    price: number;
    image: string | null;
    slug: string | null;
    href: string;
    km?: string;
    transmision_short?: string;
    fuel_short?: string;
    specs: Record<string, string>;
    equipment: Record<string, string>;
};

type CatalogItem = Pick<Vehiculo, 'id'|'tipo'|'estado'|'brand'|'model'|'version'|'year'|'price'|'image'|'slug'|'href'>;

type Sections = Record<string, string[]>;

type Props = {
    preselected: Vehiculo[];
    catalog: CatalogItem[];
    sections: Sections;
    footer: any | null;
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function FadeInSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setTimeout(() => setVisible(true), delay);
                    observer.unobserve(el);
                }
            },
            { threshold: 0.1 },
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [delay]);

    return (
        <div ref={ref} className={`transition-all duration-700 ease-out ${visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            {children}
        </div>
    );
}

function FuelIcon({ fuel, className = '' }: { fuel: string; className?: string }) {
    const lower = (fuel ?? '').toLowerCase();
    if (lower.includes('eléctrico') || lower.includes('electrico') || lower.includes('bev')) return <FuelElectricIcon className={className} />;
    if (lower.includes('híbrido') || lower.includes('hibrido') || lower.includes('hev') || lower.includes('phev')) return <FuelHybridIcon className={className} />;
    return <FuelGasIcon className={className} />;
}

function ChevronDownSmall({ className = '' }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="6" height="10" viewBox="0 0 6 10" fill="none" className={className}>
            <path d="M1 1L5 5L1 9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function FilterSelect({
    label, placeholder, disabled = false, options, value, onChange,
}: {
    label: string; placeholder: string; disabled?: boolean; options: string[]; value: string; onChange: (val: string) => void;
}) {
    const [open, setOpen] = useState(false);
    return (
        <div className={`relative flex flex-1 flex-col gap-2.5 ${disabled ? 'pointer-events-none opacity-40' : ''}`}>
            <span className="text-sm leading-none text-black">{label}</span>
            <button onClick={() => setOpen(!open)}
                className="flex h-10 cursor-pointer items-center justify-between rounded-[60px] border border-black bg-[#EAEAF1] px-5">
                <span className="text-sm leading-none text-black">{value || placeholder}</span>
                <ChevronDownSmall className="text-black" />
            </button>
            {open && (
                <div className="absolute top-full z-10 mt-1 flex w-full flex-col rounded-2xl border border-black/10 bg-white py-1 shadow-lg max-h-64 overflow-y-auto">
                    {options.length === 0 && (
                        <span className="px-5 py-2.5 text-sm text-black/40">Sin opciones</span>
                    )}
                    {options.map((opt) => (
                        <button key={opt}
                            onClick={() => { onChange(opt); setOpen(false); }}
                            className={`cursor-pointer px-5 py-2.5 text-left text-sm leading-none transition hover:bg-[#EAEAF1] ${value === opt ? 'font-semibold text-black' : 'text-black/80'}`}>
                            {opt}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

// ── Card del modal (preview de un vehículo seleccionado) ──────────────────────
function ModalCard({ vehicle, onRemove }: { vehicle?: CatalogItem; onRemove: () => void }) {
    const [visible, setVisible] = useState(false);
    const [display, setDisplay] = useState<CatalogItem | undefined>(vehicle);
    const prevIdRef = useRef<string | null>(vehicle?.id ?? null);

    useEffect(() => {
        const newId = vehicle?.id ?? null;
        const prevId = prevIdRef.current;
        if (newId && !prevId) {
            setDisplay(vehicle);
            requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
        } else if (!newId && prevId) {
            setVisible(false);
            setTimeout(() => setDisplay(undefined), 400);
        } else if (newId && prevId && newId !== prevId) {
            setVisible(false);
            setTimeout(() => {
                setDisplay(vehicle);
                requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
            }, 250);
        } else if (newId && newId === prevId) {
            setDisplay(vehicle);
            setVisible(true);
        }
        prevIdRef.current = newId;
    }, [vehicle?.id, vehicle]);

    return (
        <div className={`flex h-75 w-75 shrink-0 flex-col items-center justify-between overflow-hidden rounded-[20px] bg-[#EAEAF1] px-2.5 pt-2.5 pb-7.5 transition-all duration-400 ease-out ${display && visible ? 'scale-100 opacity-100' : display ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`}>
            {display ? (
                <>
                    <div className="flex items-center justify-end self-stretch">
                        <button onClick={() => { setVisible(false); setTimeout(onRemove, 350); }}
                            className="cursor-pointer transition hover:opacity-70">
                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                                <path d="M15 1.875C7.6875 1.875 1.875 7.6875 1.875 15C1.875 22.3125 7.6875 28.125 15 28.125C22.3125 28.125 28.125 22.3125 28.125 15C28.125 7.6875 22.3125 1.875 15 1.875ZM15 26.25C8.8125 26.25 3.75 21.1875 3.75 15C3.75 8.8125 8.8125 3.75 15 3.75C21.1875 3.75 26.25 8.8125 26.25 15C26.25 21.1875 21.1875 26.25 15 26.25Z" fill="black" fillOpacity="0.8" />
                                <path d="M20.0625 21.5625L15 16.5L9.9375 21.5625L8.4375 20.0625L13.5 15L8.4375 9.9375L9.9375 8.4375L15 13.5L20.0625 8.4375L21.5625 9.9375L16.5 15L21.5625 20.0625L20.0625 21.5625Z" fill="black" fillOpacity="0.8" />
                            </svg>
                        </button>
                    </div>
                    {display.image
                        ? <img src={display.image} alt={`${display.brand} ${display.model}`} className={`h-25.5 w-55.5 object-cover transition-all delay-100 duration-400 ${visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} />
                        : <div className="h-25.5 w-55.5 bg-black/5 rounded flex items-center justify-center text-xs text-black/30">Sin imagen</div>}
                    <div className={`flex flex-col items-center gap-2.5 self-stretch transition-all delay-200 duration-400 ${visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                        <span className="text-2xl font-semibold uppercase leading-none text-black">{display.brand} {display.model}</span>
                        <span className="text-sm uppercase leading-none text-black text-center">{display.version}</span>
                        <span className="text-center text-2xl font-semibold uppercase leading-none text-black">
                            {display.price > 0 ? formatCLP(display.price) : '—'}
                        </span>
                    </div>
                </>
            ) : (
                <div className="h-full w-full" />
            )}
        </div>
    );
}

// ── Card del listado inicial (antes de entrar al modo comparar) ───────────────
function CompareCard({ vehicle, onRemove }: { vehicle: Vehiculo; onRemove: () => void }) {
    return (
        <div className="flex flex-col rounded-[20px] bg-white">
            <div className="relative overflow-hidden rounded-t-[20px]">
                {vehicle.image
                    ? <img src={vehicle.image} alt={`${vehicle.brand} ${vehicle.model}`} className="h-55 w-full object-cover" />
                    : <div className="h-55 w-full bg-black/5 flex items-center justify-center text-sm text-black/30">Sin imagen</div>}
                <span className="absolute left-4 top-4 rounded-full bg-black/50 px-3 py-1.5 text-sm leading-none text-white backdrop-blur-[10px]">
                    {vehicle.estado}
                </span>
                {vehicle.tipo === 'seminuevo' && (
                    <img src={certificateImg} alt="Certificado Toyota" className="absolute bottom-4 left-4 w-20 object-contain" />
                )}
                <button onClick={onRemove}
                    className="absolute right-4 top-4 flex size-8 cursor-pointer items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-[10px] transition hover:bg-black/70">
                    <X className="size-4" />
                </button>
            </div>
            <div className="flex flex-col gap-4 p-5">
                <div className="flex flex-col gap-1">
                    <span className="text-xs leading-none text-black/60">{vehicle.year}</span>
                    <h3 className="text-lg font-bold uppercase leading-tight text-black">{vehicle.brand} {vehicle.model}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                    {vehicle.km && (
                        <span className="flex items-center gap-1 rounded-md bg-[#EAEAF1] px-2 py-1.5 text-sm leading-none text-black/60">
                            <SpeedometerIcon className="size-4 text-black" /> {vehicle.km}
                        </span>
                    )}
                    {vehicle.transmision_short && (
                        <span className="flex items-center gap-1 rounded-md bg-[#EAEAF1] px-2 py-1.5 text-sm leading-none text-black/60">
                            <TransmissionIcon className="size-4 text-black" /> {vehicle.transmision_short}
                        </span>
                    )}
                    {vehicle.fuel_short && (
                        <span className="flex items-center gap-1 rounded-md bg-[#EAEAF1] px-2 py-1.5 text-sm leading-none text-black/60">
                            <FuelIcon fuel={vehicle.fuel_short} className="size-4 text-black" /> {vehicle.fuel_short}
                        </span>
                    )}
                </div>
                <div className="rounded-[10px] bg-[#EAEAF1] p-3">
                    <span className="text-xl font-semibold uppercase leading-none text-black">
                        {vehicle.price > 0 ? formatCLP(vehicle.price) : '—'}
                    </span>
                </div>
                <Link href={vehicle.href}
                    className="flex h-11 items-center justify-center rounded-[60px] bg-black text-sm leading-none text-white transition hover:bg-black/85">
                    Ver detalle
                </Link>
            </div>
        </div>
    );
}

// ── Página principal ──────────────────────────────────────────────────────────
export default function Compare({ preselected, catalog, sections, footer }: Props) {
    // Vehículos cargados (inicial = preselected del backend).
    const [selected, setSelected] = useState<Vehiculo[]>(preselected ?? []);
    const [comparing, setComparing] = useState((preselected?.length ?? 0) > 0);
    const [compareVehicles, setCompareVehicles] = useState<Vehiculo[]>(preselected ?? []);

    // Modal
    const [selectorOpen, setSelectorOpen] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalSelected, setModalSelected] = useState<Vehiculo[]>([]);

    // Filtros del modal (derivados del catálogo, no hardcoded)
    const [filterEstado, setFilterEstado] = useState('');
    const [filterMarca, setFilterMarca] = useState('');
    const [filterModelo, setFilterModelo] = useState('');
    const [filterVersion, setFilterVersion] = useState('');

    // Volver
    const backUrl = typeof window !== 'undefined'
        ? (new URLSearchParams(window.location.search).get('from') || '/seminuevos')
        : '/seminuevos';

    // ── Opciones de filtros derivadas del catálogo (no hardcoded) ────────────
    const estadosDisponibles = useMemo(() => {
        const set = new Set(catalog.map(c => c.estado));
        return Array.from(set);
    }, [catalog]);

    const marcasDisponibles = useMemo(() => {
        const filtered = filterEstado ? catalog.filter(c => c.estado === filterEstado) : catalog;
        return Array.from(new Set(filtered.map(c => c.brand).filter(Boolean)));
    }, [catalog, filterEstado]);

    const modelosDisponibles = useMemo(() => {
        const filtered = catalog.filter(c =>
            (!filterEstado || c.estado === filterEstado) &&
            (!filterMarca || c.brand === filterMarca)
        );
        return Array.from(new Set(filtered.map(c => c.model).filter(Boolean)));
    }, [catalog, filterEstado, filterMarca]);

    const versionesDisponibles = useMemo(() => {
        return catalog.filter(c =>
            (!filterEstado || c.estado === filterEstado) &&
            (!filterMarca || c.brand === filterMarca) &&
            (!filterModelo || c.model === filterModelo)
        );
    }, [catalog, filterEstado, filterMarca, filterModelo]);

    // Equipamiento dinámico: union de labels desde los vehículos que se están
    // comparando (cada uno aporta su set de equipment).
    const equipmentLabels = useMemo(() => {
        const labels = new Set<string>();
        for (const v of compareVehicles) {
            Object.keys(v.equipment ?? {}).forEach(l => labels.add(l));
        }
        return Array.from(labels).sort();
    }, [compareVehicles]);

    // ── Acciones ──────────────────────────────────────────────────────────────
    const openModal = () => {
        setSelectorOpen(true);
        requestAnimationFrame(() => requestAnimationFrame(() => setModalVisible(true)));
    };
    const closeModal = (clearFilters = true) => {
        setModalVisible(false);
        setTimeout(() => {
            setSelectorOpen(false);
            if (clearFilters) {
                setFilterEstado('');
                setFilterMarca('');
                setFilterModelo('');
                setFilterVersion('');
            }
        }, 300);
    };

    // Cuando el usuario selecciona una versión, hidratamos el item completo
    // del catálogo y lo metemos en modalSelected (sin specs por ahora —
    // se traerán al confirmar comparar).
    const onVersionChange = (versionLabel: string) => {
        setFilterVersion(versionLabel);
        const target = versionesDisponibles.find(c => versionPretty(c) === versionLabel);
        if (!target) return;
        if (modalSelected.length >= 3 || modalSelected.find(m => m.id === target.id)) return;
        // Wrap como Vehiculo (con specs vacíos — al hacer Comparar pedimos al backend).
        setModalSelected(prev => [...prev, { ...target, specs: {}, equipment: {} } as Vehiculo]);
        setFilterEstado('');
        setFilterMarca('');
        setFilterModelo('');
        setFilterVersion('');
    };

    const handleCompare = () => {
        // Recargar la página con los ids para que el backend devuelva specs completos.
        const ids = modalSelected.map(v => v.id).join(',');
        if (!ids) return;
        closeModal(false);
        router.visit(`/seminuevos/comparar?ids=${ids}`, { preserveScroll: false });
    };

    const handleBackFromCompare = () => setComparing(false);
    const handleAddMoreVehicles = () => {
        setModalSelected([...compareVehicles]);
        setFilterEstado(''); setFilterMarca(''); setFilterModelo(''); setFilterVersion('');
        openModal();
    };
    const handleClearAll = () => {
        setCompareVehicles([]);
        setSelected([]);
        setModalSelected([]);
        setComparing(false);
        router.visit('/seminuevos/comparar', { preserveScroll: false });
    };
    const handleRemoveCompareVehicle = (idx: number) => {
        const next = compareVehicles.filter((_, i) => i !== idx);
        setCompareVehicles(next);
        if (next.length === 0) {
            setComparing(false);
            router.visit('/seminuevos/comparar', { preserveScroll: false });
        } else {
            const ids = next.map(v => v.id).join(',');
            router.visit(`/seminuevos/comparar?ids=${ids}`, { preserveScroll: true });
        }
    };

    // Sincroniza el modo "comparing" con la presencia de preselected
    useEffect(() => {
        if ((preselected?.length ?? 0) > 0) {
            setComparing(true);
            setCompareVehicles(preselected);
            setSelected(preselected);
        }
    }, [preselected]);

    // ── Render ────────────────────────────────────────────────────────────────
    const sectionEntries = Object.entries(sections);

    return (
        <>
            <Head title="Comparar Vehículos" />
            <div className="min-h-screen bg-[#EAEAF1]">
                <Navbar variant="white" />
                <div style={{ padding: '60px 60px 200px 60px' }}>
                    {/* Toolbar */}
                    <div className="mt-20 flex items-center justify-between">
                        {comparing ? (
                            <button onClick={handleBackFromCompare}
                                className="flex h-9.5 cursor-pointer items-center gap-2.5 rounded-[60px] border border-black py-2.5 pr-5 pl-2.5 text-sm leading-none text-black transition hover:bg-black/5">
                                <span className="flex size-6 items-center justify-center rounded-full bg-black">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="9" viewBox="0 0 12 9" fill="none">
                                        <path d="M10.6016 4.34961H0.601563M0.601563 4.34961L4.35156 8.09961M0.601563 4.34961L4.35156 0.599609" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </span>
                                Volver
                            </button>
                        ) : (
                            <Link href={backUrl}
                                className="flex h-9.5 cursor-pointer items-center gap-2.5 rounded-[60px] border border-black py-2.5 pr-5 pl-2.5 text-sm leading-none text-black transition hover:bg-black/5">
                                <span className="flex size-6 items-center justify-center rounded-full bg-black">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="9" viewBox="0 0 12 9" fill="none">
                                        <path d="M10.6016 4.34961H0.601563M0.601563 4.34961L4.35156 8.09961M0.601563 4.34961L4.35156 0.599609" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </span>
                                Volver
                            </Link>
                        )}
                        <button className="flex h-9.5 cursor-pointer items-center gap-2.5 rounded-[60px] border border-black px-5 py-2.5 text-sm leading-none text-black transition hover:bg-black hover:text-white">
                            <ShareIcon className="size-6 text-current" />
                            Compartir
                        </button>
                    </div>

                    {/* Title */}
                    <div className="mt-5 flex flex-col items-center">
                        <h1 className="text-center text-[40px] font-semibold leading-[150%] text-black">Comparar Vehículos</h1>
                        <p className="text-center text-base font-normal leading-[150%] text-black">Encuentra en Musalem tu próximo auto</p>
                    </div>

                    {/* Initial view */}
                    <div className={`transition-all duration-600 ease-in-out ${comparing ? 'pointer-events-none max-h-0 opacity-0' : 'max-h-500 opacity-100'}`}>
                        <div className="mt-8.75 flex flex-col items-center justify-center gap-5 self-stretch rounded-[20px] bg-white px-18.25 py-31 shadow-[2px_2px_10px_0_rgba(0,0,0,0.15)]">
                            <p className="text-center text-base font-normal leading-[150%] text-black">
                                Puedes seleccionar hasta 3 vehículos para comparar
                            </p>
                            <button onClick={openModal}
                                className="cursor-pointer rounded-[60px] bg-black px-5 py-3 text-base leading-none text-white transition hover:bg-black/85">
                                Añadir vehículo ({selected.length}/3)
                            </button>
                        </div>

                        {/* Cards si hay seleccionados pero aún no comparando */}
                        {selected.length > 0 && (
                            <div className="mt-10 grid grid-cols-3 gap-5">
                                {selected.map((v, i) => (
                                    <CompareCard key={v.id} vehicle={v} onRemove={() => setSelected(selected.filter((_, j) => j !== i))} />
                                ))}
                            </div>
                        )}

                        {/* Contact CTA */}
                        <div className="mt-15 flex flex-col items-start justify-end rounded-[30px] p-7.5"
                            style={{
                                backgroundImage: `linear-gradient(0deg, rgba(0,0,0,0.20) 0%, rgba(0,0,0,0.20) 100%), linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.60) 100%), url(${ejemploVideo})`,
                                backgroundSize: 'cover', backgroundPosition: 'center', height: '340px',
                            }}>
                            <div className="flex flex-col gap-7.5">
                                <p className="w-89.25 text-2xl leading-[120%] text-white">Contáctanos para recibir asesoría personalizada</p>
                                <a href="#" className="flex w-fit cursor-pointer items-center gap-2.5 rounded-[60px] bg-white p-1 pl-3.5 text-base leading-none text-black transition hover:bg-white/90">
                                    Contactar ventas
                                    <span className="flex size-10 items-center justify-center rounded-full bg-black">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="14" viewBox="0 0 18 14" fill="none">
                                            <path d="M0.75 6.75L16.75 6.75M16.75 6.75L10.75 12.75M16.75 6.75L10.75 0.75" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </span>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Comparison view */}
                    <div className={`transition-all duration-600 ease-in-out ${comparing ? 'mt-10 opacity-100' : 'pointer-events-none max-h-0 overflow-hidden opacity-0'}`}>
                        {/* Vehicle header cards */}
                        <div className="grid w-full grid-cols-4 gap-2.5">
                            {/* Actions card */}
                            <div className="flex flex-col items-center justify-center gap-2.5 overflow-hidden rounded-[20px] bg-white px-5 py-10 shadow-[2px_2px_10px_0_rgba(0,0,0,0.15)]">
                                <button onClick={handleAddMoreVehicles}
                                    className={`rounded-[60px] px-5 py-3 pb-4 text-base leading-none transition ${compareVehicles.length >= 3 ? 'bg-black/40 text-white' : 'cursor-pointer bg-black/40 text-white hover:bg-black/50'}`}
                                    disabled={compareVehicles.length >= 3}>
                                    Añadir vehículo ({compareVehicles.length}/3)
                                </button>
                                <button onClick={handleClearAll}
                                    className="cursor-pointer rounded-[60px] border border-black px-5 py-3 pb-4 text-base leading-none text-black transition hover:bg-black/5">
                                    Limpiar búsqueda
                                </button>
                            </div>

                            {/* Vehicle cards */}
                            {[0, 1, 2].map((i) => {
                                const v = compareVehicles[i];
                                if (v) {
                                    return (
                                        <div key={v.id} className="relative flex flex-col items-center gap-2.5 rounded-[20px] bg-white pt-5 pb-7.5 shadow-[2px_2px_10px_0_rgba(0,0,0,0.15)] transition-all duration-500">
                                            <button onClick={() => handleRemoveCompareVehicle(i)}
                                                className="absolute right-4 top-4 cursor-pointer transition hover:opacity-70">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                                                    <path d="M15 1.875C7.6875 1.875 1.875 7.6875 1.875 15C1.875 22.3125 7.6875 28.125 15 28.125C22.3125 28.125 28.125 22.3125 28.125 15C28.125 7.6875 22.3125 1.875 15 1.875ZM15 26.25C8.8125 26.25 3.75 21.1875 3.75 15C3.75 8.8125 8.8125 3.75 15 3.75C21.1875 3.75 26.25 8.8125 26.25 15C26.25 21.1875 21.1875 26.25 15 26.25Z" fill="black" fillOpacity="0.8" />
                                                    <path d="M20.0625 21.5625L15 16.5L9.9375 21.5625L8.4375 20.0625L13.5 15L8.4375 9.9375L9.9375 8.4375L15 13.5L20.0625 8.4375L21.5625 9.9375L16.5 15L21.5625 20.0625L20.0625 21.5625Z" fill="black" fillOpacity="0.8" />
                                                </svg>
                                            </button>
                                            {v.image
                                                ? <img src={v.image} alt={`${v.brand} ${v.model}`} className="mt-5 h-25.5 w-55.5 object-cover" />
                                                : <div className="mt-5 h-25.5 w-55.5 bg-black/5 flex items-center justify-center text-xs text-black/30">Sin imagen</div>}
                                            <span className="text-lg font-semibold uppercase leading-none text-black text-center">
                                                {v.brand} {v.model}
                                            </span>
                                            <span className="text-sm uppercase leading-none text-black/60 text-center px-2">{v.version}</span>
                                            <span className="text-xl font-semibold leading-none text-black">
                                                {v.price > 0 ? formatCLP(v.price) : '—'}
                                            </span>
                                            <Link href={v.href}
                                                className="mt-2 flex items-center gap-2 text-sm leading-none text-black/60 transition hover:text-black">
                                                Ir a ver vehículo
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="10" viewBox="0 0 14 10" fill="none">
                                                    <path d="M1 5H13M13 5L9 1M13 5L9 9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </Link>
                                        </div>
                                    );
                                }
                                return <div key={i} className="rounded-[20px] bg-white shadow-[2px_2px_10px_0_rgba(0,0,0,0.15)]" />;
                            })}
                        </div>

                        {/* Sections */}
                        <div className="mt-2.5 flex flex-col gap-2.5">
                            {sectionEntries.map(([title, rows], sectionIdx) => {
                                // Si la sección es "Equipamiento" usamos las labels dinámicas
                                const sectionRows = title === 'Equipamiento' ? equipmentLabels : rows;
                                const isLast = sectionIdx === sectionEntries.length - 1;
                                if (sectionRows.length === 0) return null;
                                return (
                                    <FadeInSection key={title} delay={100}>
                                        <div className="flex flex-col gap-2.5">
                                            <div className="flex items-center justify-center self-stretch rounded-[60px] bg-black px-5 py-3">
                                                <span className="pb-1 text-base leading-none text-white">{title}</span>
                                            </div>
                                            <div className="grid grid-cols-4 gap-2.5">
                                                {/* Labels */}
                                                <div className="flex flex-col gap-2.5 overflow-hidden rounded-[20px] bg-white p-5">
                                                    {sectionRows.map((label, rowIdx) => {
                                                        const isGray = rowIdx % 2 === 0;
                                                        return (
                                                            <div key={label}
                                                                className={`flex items-center px-5 h-9.5 rounded-[20px] ${isGray ? 'bg-[#EAEAF1]' : 'border border-black/20'}`}>
                                                                <span className="text-base font-semibold leading-none text-black">{label}</span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                                {/* Valores por vehículo */}
                                                {[0, 1, 2].map((i) => {
                                                    const v = compareVehicles[i];
                                                    return (
                                                        <div key={i} className="flex flex-col gap-2.5 overflow-hidden rounded-[20px] bg-white p-5">
                                                            {v ? sectionRows.map((label, rowIdx) => {
                                                                const isGray = rowIdx % 2 === 0;
                                                                const value = title === 'Equipamiento'
                                                                    ? (v.equipment[label] ?? '—')
                                                                    : (v.specs[label] ?? '—');
                                                                return (
                                                                    <div key={label}
                                                                        className={`flex items-center px-5 h-9.5 rounded-[20px] ${isGray ? 'bg-[#EAEAF1]' : 'border border-black/20'}`}>
                                                                        <span className="text-base leading-none text-black truncate">{value}</span>
                                                                    </div>
                                                                );
                                                            }) : (
                                                                sectionRows.map((label, rowIdx) => {
                                                                    const isGray = rowIdx % 2 === 0;
                                                                    return (
                                                                        <div key={label}
                                                                            className={`flex items-center px-5 h-9.5 rounded-[20px] ${isGray ? 'bg-[#EAEAF1]' : 'border border-black/20'}`} />
                                                                    );
                                                                })
                                                            )}
                                                            {isLast && v && (
                                                                <Link href={`/seminuevos/${v.slug ?? v.id}/cotizar`}
                                                                    className="cursor-pointer rounded-[60px] bg-black px-5 py-3 text-center text-base leading-none text-white transition hover:bg-black/85">
                                                                    <span className="pb-1">Quiero cotizar</span>
                                                                </Link>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </FadeInSection>
                                );
                            })}
                        </div>
                    </div>
                </div>
                {footer && <Footer data={footer} />}
            </div>

            {/* Modal selector */}
            {selectorOpen && (
                <div className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ${modalVisible ? 'bg-black/50' : 'bg-black/0'}`}
                    onClick={() => closeModal()}>
                    <div className={`relative flex w-303.5 flex-col items-center rounded-[20px] bg-white px-10 py-12 transition-all duration-300 ${modalVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
                        style={{ height: '684px' }}
                        onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => closeModal()}
                            className="absolute right-6 top-6 flex size-10 cursor-pointer items-center justify-center rounded-full transition hover:bg-[#EAEAF1]">
                            <X className="size-6 text-black" />
                        </button>
                        <h3 className="text-center text-2xl font-semibold leading-[150%] text-black">
                            Elige los vehículos que deseas comparar
                        </h3>

                        <div className="mt-12.5 flex w-full gap-5">
                            <FilterSelect label="Estado" placeholder="Seleccionar estado"
                                options={estadosDisponibles} value={filterEstado}
                                onChange={(val) => { setFilterEstado(val); setFilterMarca(''); setFilterModelo(''); setFilterVersion(''); }}
                            />
                            <FilterSelect label="Marca" placeholder="Seleccione una marca"
                                disabled={!filterEstado}
                                options={marcasDisponibles} value={filterMarca}
                                onChange={(val) => { setFilterMarca(val); setFilterModelo(''); setFilterVersion(''); }}
                            />
                            <FilterSelect label="Modelo" placeholder="Seleccione un modelo"
                                disabled={!filterMarca}
                                options={modelosDisponibles} value={filterModelo}
                                onChange={(val) => { setFilterModelo(val); setFilterVersion(''); }}
                            />
                            <FilterSelect label="Versión" placeholder="Seleccionar versión"
                                disabled={!filterModelo}
                                options={versionesDisponibles.map(v => versionPretty(v))}
                                value={filterVersion}
                                onChange={onVersionChange}
                            />
                        </div>

                        <div className="mt-10 flex gap-5">
                            {[0, 1, 2].map((i) => (
                                <ModalCard key={i}
                                    vehicle={modalSelected[i]}
                                    onRemove={() => setModalSelected(modalSelected.filter((_, idx) => idx !== i))}
                                />
                            ))}
                        </div>

                        <button onClick={handleCompare}
                            className={`mt-10 rounded-[60px] bg-black px-5 py-3 text-base leading-none text-white transition-all duration-500 ${modalSelected.length > 0 ? 'cursor-pointer opacity-100 hover:bg-black/85' : 'opacity-40'}`}
                            disabled={modalSelected.length === 0}>
                            Comparar ({modalSelected.length}/3)
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

function versionPretty(c: CatalogItem) {
    const price = c.price > 0 ? ` (${formatCLP(c.price)})` : '';
    return `${c.version}${price}`;
}
