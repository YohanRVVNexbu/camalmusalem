import { Head, Link } from '@inertiajs/react';
import { Footer } from '@/components/landing/footer';
import { Navbar } from '@/components/landing/navbar';
import { vehicles, type Vehicle } from '@/data/vehicles';
import { SpeedometerIcon } from '@/components/icons/speedometer-icon';
import { TransmissionIcon } from '@/components/icons/transmission-icon';
import { FuelElectricIcon } from '@/components/icons/fuel-electric-icon';
import { FuelGasIcon } from '@/components/icons/fuel-gas-icon';
import { FuelHybridIcon } from '@/components/icons/fuel-hybrid-icon';
import certificateImg from '@images/seminuevos/certificate-toyota.png?format=webp';
import ejemploVideo from '@images/seminuevos/ejemplo-video.png?format=webp';
import vehiculoComparacion1 from '@images/seminuevos/vehiculo-comparacion-1.png?format=webp';
import vehiculoComparacion2 from '@images/seminuevos/vehiculo-comparacion-2.png?format=webp';

// Model data for the compare modal filters
const modelData: Record<string, { versions: string[]; image: string }> = {
    'BZ4X': {
        versions: ['Limited 4x2 ($44.990.000)', 'Limited AWD ($46.990.000)'],
        image: vehiculoComparacion1,
    },
    'Corolla': {
        versions: ['1.8 CVT 4p SEG HEV ($28.990.000)'],
        image: vehiculoComparacion2,
    },
};

// Specs data per model for comparison table
type SpecRow = { label: string; tall?: boolean };
type SpecSection = { title: string; rows: SpecRow[] };

const compareSections: SpecSection[] = [
    {
        title: 'Principales',
        rows: [
            { label: 'Estado del vehículo' },
            { label: 'Fabricando en' },
            { label: 'Tipo de híbrido' },
        ],
    },
    {
        title: 'Motor',
        rows: [
            { label: 'Combustible' },
            { label: 'Cilindrada' },
            { label: 'Potencia' },
            { label: 'Torque' },
            { label: 'Alimentación' },
            { label: 'Cilindros' },
            { label: 'Válvula' },
            { label: 'Catalítico' },
            { label: 'Sistema start / stop' },
            { label: 'Potencia total sistema híbrido' },
        ],
    },
    {
        title: 'Performance',
        rows: [
            { label: 'Aceleración 0-100 km/h' },
            { label: 'Rendimiento en ciudad' },
            { label: 'Rendimiento en ruta' },
            { label: 'Rendimiento mixto' },
            { label: 'Velocidad máxima' },
        ],
    },
    {
        title: 'Transmisión y chasis',
        rows: [
            { label: 'Motor - tracción' },
            { label: 'Transmisión' },
            { label: 'Neumáticos delanteros' },
            { label: 'Neumáticos traseros' },
            { label: 'Frenos (delanteros - traseros)' },
            { label: 'Suspensión delantera', tall: true },
            { label: 'Suspensión trasera', tall: true },
        ],
    },
    {
        title: 'Confort',
        rows: [
            { label: 'Aire acondicionado' },
            { label: 'Alarma de luces encendidas' },
            { label: 'Asientos delanteros' },
            { label: 'Asientos traseros' },
            { label: 'Tapizados' },
            { label: 'Cierre de puertas', tall: true },
            { label: 'Vidrios (delanteros - traseros)' },
            { label: 'Espejos exteriores' },
            { label: 'Espejo interior' },
            { label: 'Luces delanteras' },
            { label: 'Neblineros' },
            { label: 'Computadora a bordo' },
            { label: 'Control de velocidad crucero' },
            { label: 'Dirección asistida' },
            { label: 'Llantas' },
            { label: 'Encendido del motor' },
            { label: 'Limpialuneta' },
            { label: 'Palanca de cambios' },
            { label: 'Sunroof' },
            { label: 'Volante' },
            { label: 'Apertura de baúl' },
            { label: 'Sensores de estacionamiento' },
            { label: 'Cámara de visión' },
        ],
    },
    {
        title: 'Seguridad',
        rows: [
            { label: 'ABS' },
            { label: 'Distribución electrónica frenado' },
            { label: 'Asistencia frenado emergencia' },
            { label: 'Airbags' },
            { label: 'Alarma para asientos infantiles' },
            { label: 'Anclaje para asientos infantiles' },
            { label: 'Cinturones de seguridad' },
        ],
    },
    {
        title: 'Comunicación y entretenimiento',
        rows: [
            { label: 'Sistema de audio' },
            { label: 'Parlantes' },
            { label: 'Conexión auxiliar (Ipod y Mp3)' },
            { label: 'Conexión USB' },
            { label: 'Interfaz bluetooth' },
            { label: 'Pantalla' },
            { label: 'MirrorLink' },
        ],
    },
];

// Spec values per model+version key
const specValues: Record<string, Record<string, string>> = {
    'BZ4X|Limited 4x2': {
        'Estado del vehículo': 'Nuevo',
        'Fabricando en': 'China',
        'Tipo de híbrido': 'Hybrid (HEV)',
        'Combustible': 'Bencina - eléctrico',
        'Cilindrada': '1498 cc',
        'Potencia': '156 / n/d hp / rpm',
        'Torque': '235 / n/d / rpm',
        'Alimentación': 'Inyección directa',
        'Cilindros': '4',
        'Válvula': '16',
        'Catalítico': 'Si',
        'Sistema start / stop': 'No',
        'Potencia total sistema híbrido': '399 cv',
        'Aceleración 0-100 km/h': '-',
        'Rendimiento en ciudad': '7.3',
        'Rendimiento en ruta': '14.2',
        'Rendimiento mixto': '10.7',
        'Velocidad máxima': '-',
        'Motor - tracción': 'Delantero - Integral permanente',
        'Transmisión': 'Automática DHT',
        'Neumáticos delanteros': '235/60 R19',
        'Neumáticos traseros': '235/60 R19',
        'Frenos (delanteros - traseros)': 'Ventilados - Sólidos',
        'Suspensión delantera': 'Independiente tipo McPherson',
        'Suspensión trasera': 'Multi-link',
        'Aire acondicionado': 'Climatizador de cuatro zonas',
        'Alarma de luces encendidas': '-',
        'Asientos delanteros': 'Calefaccionables y ventilados',
        'Asientos traseros': 'Abatibles completos',
        'Tapizados': 'Cuero',
        'Cierre de puertas': 'Apertura y cierre por presencia\n(Keyless)',
        'Vidrios (delanteros - traseros)': 'Eléctricos - eléctricos',
        'Espejos exteriores': 'Abatibles automáticamente',
        'Espejo interior': 'Antideslumbrante automático',
        'Luces delanteras': 'Con encendido aumático',
        'Neblineros': 'Delanteros y traseros',
        'Computadora a bordo': 'Sí',
        'Control de velocidad crucero': 'Adaptativa',
        'Dirección asistida': 'Eléctrica',
        'Llantas': 'Aleación',
        'Encendido del motor': 'Con botón',
        'Limpialuneta': 'Sí',
        'Palanca de cambios': 'Con insertos de aluminio',
        'Sunroof': 'Eléctrico',
        'Volante': 'Con botón',
        'Apertura de baúl': 'Manual',
        'Sensores de estacionamiento': 'Delanteros y traseros',
        'Cámara de visión': 'Trasera',
        'ABS': 'Sí',
        'Distribución electrónica frenado': 'Sí',
        'Asistencia frenado emergencia': 'Sí',
        'Airbags': 'Conductor y acompañante',
        'Alarma para asientos infantiles': 'Sí',
        'Anclaje para asientos infantiles': 'Sí',
        'Cinturones de seguridad': 'Delantero 3 puntas pretensados',
        'Sistema de audio': 'Comandos de audio al volante',
        'Parlantes': '6',
        'Conexión auxiliar (Ipod y Mp3)': 'Sí',
        'Conexión USB': 'Sí',
        'Interfaz bluetooth': 'Sí',
        'Pantalla': 'Táctil de 14"',
        'MirrorLink': 'No',
    },
    'BZ4X|Limited AWD': {
        'Estado del vehículo': 'Nuevo',
        'Fabricando en': 'Alemania',
        'Tipo de híbrido': 'Plug-in Hybrid (PHEV)',
        'Combustible': 'Bencina - eléctrico',
        'Cilindrada': '1498 cc',
        'Potencia': '201 hp / rpm',
        'Torque': '5600 / n/d / rpm',
        'Alimentación': 'Inyección directa',
        'Cilindros': '4',
        'Válvula': '16',
        'Catalítico': '-',
        'Sistema start / stop': 'Si',
        'Potencia total sistema híbrido': '201 cv',
        'Aceleración 0-100 km/h': '9 s',
        'Rendimiento en ciudad': '-',
        'Rendimiento en ruta': '-',
        'Rendimiento mixto': '10.4',
        'Velocidad máxima': '-',
        'Motor - tracción': 'Delantero',
        'Transmisión': 'Automática DHT',
        'Neumáticos delanteros': '235/55 R18',
        'Neumáticos traseros': '235/55 R18',
        'Frenos (delanteros - traseros)': 'Ventilados - Sólidos',
        'Suspensión delantera': 'Independiente tipo McPherson',
        'Suspensión trasera': 'Barra de torsión y resortes helicoidales',
        'Aire acondicionado': 'Climatizador',
        'Alarma de luces encendidas': 'Si',
        'Asientos delanteros': 'Ajuste eléctrico solo conductor',
        'Asientos traseros': 'Abatibles 60/40',
        'Tapizados': 'Símil cuero',
        'Cierre de puertas': 'Apertura y cierre por presencia\n(Keyless)',
        'Vidrios (delanteros - traseros)': 'Eléctricos - eléctricos',
        'Espejos exteriores': 'Abatibles automáticamente',
        'Espejo interior': 'Antideslumbrante automático',
        'Luces delanteras': 'Con encendido aumático',
        'Neblineros': 'Traseros',
        'Computadora a bordo': 'Sí',
        'Control de velocidad crucero': 'Adaptativa',
        'Dirección asistida': 'Eléctrica',
        'Llantas': 'Aleación',
        'Encendido del motor': 'Con botón',
        'Limpialuneta': 'Sí',
        'Palanca de cambios': 'Con insertos de aluminio',
        'Sunroof': 'Eléctrico',
        'Volante': 'Con botón',
        'Apertura de baúl': 'Manual',
        'Sensores de estacionamiento': 'Delanteros y traseros',
        'Cámara de visión': '-',
        'ABS': 'Sí',
        'Distribución electrónica frenado': 'Sí',
        'Asistencia frenado emergencia': 'Sí',
        'Airbags': 'Conductor y acompañante',
        'Alarma para asientos infantiles': 'No',
        'Anclaje para asientos infantiles': 'No',
        'Cinturones de seguridad': 'Delantero 3 puntas pretensados',
        'Sistema de audio': 'Comandos de audio al volante',
        'Parlantes': '6',
        'Conexión auxiliar (Ipod y Mp3)': 'Sí',
        'Conexión USB': 'Sí',
        'Interfaz bluetooth': 'Sí',
        'Pantalla': 'Táctil de 14"',
        'MirrorLink': 'No',
    },
    'Corolla|1.8 CVT 4p SEG HEV': {
        'Estado del vehículo': 'Usado',
        'Fabricando en': 'Argentina',
        'Tipo de híbrido': 'N/A',
        'Combustible': 'Gasolina',
        'Cilindrada': '1498 cc',
        'Potencia': '221 hp / rpm',
        'Torque': '270 / n/d / rpm',
        'Alimentación': 'Inyección directa',
        'Cilindros': '-',
        'Válvula': '16',
        'Catalítico': 'Si',
        'Sistema start / stop': 'No',
        'Potencia total sistema híbrido': '-',
        'Aceleración 0-100 km/h': '-',
        'Rendimiento en ciudad': '25.9',
        'Rendimiento en ruta': '-',
        'Rendimiento mixto': '-',
        'Velocidad máxima': '-',
        'Motor - tracción': 'Delantero - Integral',
        'Transmisión': 'Automática 8 velocidades',
        'Neumáticos delanteros': '265/65 R17 AT',
        'Neumáticos traseros': '265/65 R17 AT',
        'Frenos (delanteros - traseros)': 'Ventilados - Sólidos',
        'Suspensión delantera': 'Independiente de doble brazo con resorte helicoidales',
        'Suspensión trasera': 'Ventilados - Sólidos',
        'Aire acondicionado': 'Climatizador bizona',
        'Alarma de luces encendidas': '-',
        'Asientos delanteros': 'Calefaccionables',
        'Asientos traseros': 'Abatibles 60/40',
        'Tapizados': 'Cuero',
        'Cierre de puertas': 'Centralizado con comando\na distancia',
        'Vidrios (delanteros - traseros)': 'Eléctricos - eléctricos',
        'Espejos exteriores': 'Abatibles automáticamente',
        'Espejo interior': 'Antideslumbrante manual',
        'Luces delanteras': 'Con encendido aumático',
        'Neblineros': 'Delanteros y traseros',
        'Computadora a bordo': 'Sí',
        'Control de velocidad crucero': 'Sí',
        'Dirección asistida': 'Eléctrica',
        'Llantas': 'Aleación',
        'Encendido del motor': 'Con botón',
        'Limpialuneta': 'Sí',
        'Palanca de cambios': 'Con insertos de aluminio',
        'Sunroof': 'Eléctrico',
        'Volante': 'Con botón',
        'Apertura de baúl': 'Manual',
        'Sensores de estacionamiento': 'Delanteros y traseros',
        'Cámara de visión': 'Trasera',
        'ABS': 'Sí',
        'Distribución electrónica frenado': 'Sí',
        'Asistencia frenado emergencia': 'Sí',
        'Airbags': 'Conductor y acompañante',
        'Alarma para asientos infantiles': 'No',
        'Anclaje para asientos infantiles': 'Sí',
        'Cinturones de seguridad': 'Delantero 3 puntas pretensados',
        'Sistema de audio': 'Comandos de audio al volante',
        'Parlantes': '8',
        'Conexión auxiliar (Ipod y Mp3)': 'Sí',
        'Conexión USB': 'Sí',
        'Interfaz bluetooth': 'Sí',
        'Pantalla': 'Táctil de 14"',
        'MirrorLink': 'Sí',
    },
};
import { ShareIcon } from '@/components/icons/share-icon';
import { X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

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
        <div
            ref={ref}
            className={`transition-all duration-700 ease-out ${visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
        >
            {children}
        </div>
    );
}

function FuelIcon({ fuel, className = '' }: { fuel: string; className?: string }) {
    const lower = fuel.toLowerCase();
    if (lower.includes('eléctrico') || lower.includes('electrico')) return <FuelElectricIcon className={className} />;
    if (lower.includes('híbrido') || lower.includes('hibrido')) return <FuelHybridIcon className={className} />;
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
    label,
    placeholder,
    disabled = false,
    options,
    value,
    onChange,
}: {
    label: string;
    placeholder: string;
    disabled?: boolean;
    options: string[];
    value: string;
    onChange: (val: string) => void;
}) {
    const [open, setOpen] = useState(false);

    return (
        <div className={`relative flex flex-1 flex-col gap-2.5 ${disabled ? 'pointer-events-none opacity-40' : ''}`}>
            <span className="text-sm leading-none text-black">{label}</span>
            <button
                onClick={() => setOpen(!open)}
                className="flex h-10 cursor-pointer items-center justify-between rounded-[60px] border border-black bg-[#EAEAF1] px-5"
            >
                <span className="text-sm leading-none text-black">{value || placeholder}</span>
                <ChevronDownSmall className="text-black" />
            </button>
            {open && (
                <div className="absolute top-full z-10 mt-1 flex w-full flex-col rounded-2xl border border-black/10 bg-white py-1 shadow-lg">
                    {options.map((opt) => (
                        <button
                            key={opt}
                            onClick={() => { onChange(opt); setOpen(false); }}
                            className={`cursor-pointer px-5 py-2.5 text-left text-sm leading-none transition hover:bg-[#EAEAF1] ${value === opt ? 'font-semibold text-black' : 'text-black/80'}`}
                        >
                            {opt}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

type ModalVehicle = { marca: string; modelo: string; version: string; precio: string; image: string };

function getVehicleId(v?: ModalVehicle) {
    return v ? `${v.modelo}-${v.version}` : null;
}

function ModalCard({ vehicle, onRemove }: { vehicle?: ModalVehicle; onRemove: () => void }) {
    const [visible, setVisible] = useState(false);
    const [displayVehicle, setDisplayVehicle] = useState<ModalVehicle | undefined>(vehicle);
    const prevIdRef = useRef<string | null>(getVehicleId(vehicle));

    useEffect(() => {
        const newId = getVehicleId(vehicle);
        const prevId = prevIdRef.current;

        if (newId && !prevId) {
            // Empty → vehicle: fade in
            setDisplayVehicle(vehicle);
            requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
        } else if (!newId && prevId) {
            // Vehicle → empty: fade out
            setVisible(false);
            setTimeout(() => setDisplayVehicle(undefined), 400);
        } else if (newId && prevId && newId !== prevId) {
            // Different vehicle: crossfade (fade out, swap, fade in)
            setVisible(false);
            setTimeout(() => {
                setDisplayVehicle(vehicle);
                requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
            }, 250);
        } else if (newId && newId === prevId) {
            // Same vehicle, ensure visible
            setDisplayVehicle(vehicle);
            setVisible(true);
        }

        prevIdRef.current = newId;
    }, [vehicle]);

    return (
        <div
            className={`flex h-75 w-75 shrink-0 flex-col items-center justify-between overflow-hidden rounded-[20px] bg-[#EAEAF1] px-2.5 pt-2.5 pb-7.5 transition-all duration-400 ease-out ${
                displayVehicle && visible ? 'scale-100 opacity-100' : displayVehicle ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
            }`}
        >
            {displayVehicle ? (
                <>
                    <div className="flex items-center justify-end self-stretch">
                        <button
                            onClick={() => {
                                setVisible(false);
                                setTimeout(onRemove, 350);
                            }}
                            className="cursor-pointer transition hover:opacity-70"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                                <path d="M15 1.875C7.6875 1.875 1.875 7.6875 1.875 15C1.875 22.3125 7.6875 28.125 15 28.125C22.3125 28.125 28.125 22.3125 28.125 15C28.125 7.6875 22.3125 1.875 15 1.875ZM15 26.25C8.8125 26.25 3.75 21.1875 3.75 15C3.75 8.8125 8.8125 3.75 15 3.75C21.1875 3.75 26.25 8.8125 26.25 15C26.25 21.1875 21.1875 26.25 15 26.25Z" fill="black" fillOpacity="0.8"/>
                                <path d="M20.0625 21.5625L15 16.5L9.9375 21.5625L8.4375 20.0625L13.5 15L8.4375 9.9375L9.9375 8.4375L15 13.5L20.0625 8.4375L21.5625 9.9375L16.5 15L21.5625 20.0625L20.0625 21.5625Z" fill="black" fillOpacity="0.8"/>
                            </svg>
                        </button>
                    </div>
                    <img
                        src={displayVehicle.image}
                        alt={`${displayVehicle.marca} ${displayVehicle.modelo}`}
                        className={`h-25.5 w-55.5 object-cover transition-all delay-100 duration-400 ${visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                    />
                    <div className={`flex flex-col items-center gap-2.5 self-stretch transition-all delay-200 duration-400 ${visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                        <span className="text-2xl font-semibold uppercase leading-none text-black">
                            {displayVehicle.marca} {displayVehicle.modelo}
                        </span>
                        <span className="text-sm uppercase leading-none text-black">
                            {displayVehicle.version}
                        </span>
                        <span className="text-center text-2xl font-semibold uppercase leading-none text-black">
                            {displayVehicle.precio}
                        </span>
                    </div>
                </>
            ) : (
                <div className="h-full w-full" />
            )}
        </div>
    );
}

function CompareCard({ vehicle, onRemove }: { vehicle: Vehicle; onRemove: () => void }) {
    return (
        <div className="flex flex-col rounded-[20px] bg-white">
            {/* Image */}
            <div className="relative overflow-hidden rounded-t-[20px]">
                <img src={vehicle.image} alt={vehicle.name} className="h-55 w-full object-cover" />
                <span className="absolute left-4 top-4 rounded-full bg-black/50 px-3 py-1.5 text-sm leading-none text-white backdrop-blur-[10px]">
                    {vehicle.badge}
                </span>
                {vehicle.certified && (
                    <img src={certificateImg} alt="Certificado Toyota" className="absolute bottom-4 left-4 w-20 object-contain" />
                )}
                <button
                    onClick={onRemove}
                    className="absolute right-4 top-4 flex size-8 cursor-pointer items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-[10px] transition hover:bg-black/70"
                >
                    <X className="size-4" />
                </button>
            </div>

            {/* Info */}
            <div className="flex flex-col gap-4 p-5">
                <div className="flex flex-col gap-1">
                    <span className="text-xs leading-none text-black/60">{vehicle.year}</span>
                    <h3 className="text-lg font-bold uppercase leading-tight text-black">{vehicle.name.replace('\n', ' ')}</h3>
                </div>

                {/* Specs pills */}
                <div className="flex flex-wrap gap-2">
                    <span className="flex items-center gap-1 rounded-md bg-[#EAEAF1] px-2 py-1.5 text-sm leading-none text-black/60">
                        <SpeedometerIcon className="size-4 text-black" />
                        {vehicle.km}
                    </span>
                    <span className="flex items-center gap-1 rounded-md bg-[#EAEAF1] px-2 py-1.5 text-sm leading-none text-black/60">
                        <TransmissionIcon className="size-4 text-black" />
                        {vehicle.transmission}
                    </span>
                    <span className="flex items-center gap-1 rounded-md bg-[#EAEAF1] px-2 py-1.5 text-sm leading-none text-black/60">
                        <FuelIcon fuel={vehicle.fuel} className="size-4 text-black" />
                        {vehicle.fuel}
                    </span>
                </div>

                {/* Specs table */}
                <div className="flex flex-col">
                    {[
                        ['Marca', vehicle.brand],
                        ['Año', vehicle.year],
                        ['Kilometraje', vehicle.km],
                        ['Transmisión', vehicle.transmission],
                        ['Combustible', vehicle.fuel],
                    ].map(([label, value], i, arr) => (
                        <div key={label}>
                            <div className="flex items-center justify-between py-2.5">
                                <span className="text-sm leading-none text-black/60">{label}</span>
                                <span className="text-sm font-semibold leading-none text-black/60">{value}</span>
                            </div>
                            {i < arr.length - 1 && <hr className="border-black/10" />}
                        </div>
                    ))}
                </div>

                {/* Price */}
                <div className="flex flex-col gap-1.5">
                    {vehicle.originalPrice && (
                        <span className="text-sm leading-none text-black/40 line-through">{vehicle.originalPrice}</span>
                    )}
                    <div className="rounded-[10px] bg-[#EAEAF1] p-3">
                        <span className="text-xl font-semibold uppercase leading-none text-black">{vehicle.price}</span>
                    </div>
                </div>

                {/* CTA */}
                <Link
                    href={`/seminuevos/${vehicle.id}`}
                    className="flex h-11 items-center justify-center rounded-[60px] bg-black text-sm leading-none text-white transition hover:bg-black/85"
                >
                    Ver detalle
                </Link>
            </div>
        </div>
    );
}

export default function Compare({ footer }: { footer: any }) {
    const [selected, setSelected] = useState<Vehicle[]>([]);
    const [selectorOpen, setSelectorOpen] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalSelected, setModalSelected] = useState<ModalVehicle[]>([]);
    const [comparing, setComparing] = useState(false);
    const [compareVehicles, setCompareVehicles] = useState<ModalVehicle[]>([]);

    // Modal filter state
    const [filterEstado, setFilterEstado] = useState('');
    const [filterMarca, setFilterMarca] = useState('');
    const [filterModelo, setFilterModelo] = useState('');
    const [filterVersion, setFilterVersion] = useState('');

    // Get the "from" query param to know where to go back
    const params = new URLSearchParams(window.location.search);
    const backUrl = params.get('from') || '/seminuevos';

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

    const addVehicle = (v: Vehicle) => {
        if (selected.length < 4 && !selected.find(s => s.id === v.id)) {
            setSelected([...selected, v]);
            closeModal();
        }
    };

    const removeVehicle = (id: number) => {
        setSelected(selected.filter(v => v.id !== id));
    };

    const handleCompare = () => {
        setCompareVehicles([...modalSelected]);
        closeModal(false);
        setTimeout(() => setComparing(true), 400);
    };

    const handleBackFromCompare = () => {
        setComparing(false);
    };

    const handleAddMoreVehicles = () => {
        // Reopen modal with current compareVehicles loaded
        setModalSelected([...compareVehicles]);
        setFilterEstado('');
        setFilterMarca('');
        setFilterModelo('');
        setFilterVersion('');
        openModal();
    };

    const handleClearAll = () => {
        setCompareVehicles([]);
        setModalSelected([]);
        setComparing(false);
    };

    const handleRemoveCompareVehicle = (index: number) => {
        const updated = compareVehicles.filter((_, i) => i !== index);
        setCompareVehicles(updated);
        if (updated.length === 0) {
            setComparing(false);
        }
    };

    const excludeIds = selected.map(v => v.id);

    return (
        <>
            <Head title="Comparar Vehículos" />
            <div className="min-h-screen bg-[#EAEAF1]">
                <Navbar variant="white" />
                <div style={{ padding: '60px 60px 200px 60px' }}>
                    {/* Top toolbar */}
                    <div className="mt-20 flex items-center justify-between">
                        {comparing ? (
                            <button
                                onClick={handleBackFromCompare}
                                className="flex h-9.5 cursor-pointer items-center gap-2.5 rounded-[60px] border border-black py-2.5 pr-5 pl-2.5 text-sm leading-none text-black transition hover:bg-black/5"
                            >
                                <span className="flex size-6 items-center justify-center rounded-full bg-black" style={{ backdropFilter: 'blur(9.375px)' }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="9" viewBox="0 0 12 9" fill="none">
                                        <path d="M10.6016 4.34961H0.601563M0.601563 4.34961L4.35156 8.09961M0.601563 4.34961L4.35156 0.599609" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </span>
                                Volver
                            </button>
                        ) : (
                            <Link
                                href={backUrl}
                                className="flex h-9.5 cursor-pointer items-center gap-2.5 rounded-[60px] border border-black py-2.5 pr-5 pl-2.5 text-sm leading-none text-black transition hover:bg-black/5"
                            >
                                <span className="flex size-6 items-center justify-center rounded-full bg-black" style={{ backdropFilter: 'blur(9.375px)' }}>
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

                    {/* Initial view: card + CTA */}
                    <div className={`transition-all duration-600 ease-in-out ${comparing ? 'pointer-events-none max-h-0 opacity-0' : 'max-h-500 opacity-100'}`}>
                        {/* Compare card */}
                        <div className="mt-8.75 flex flex-col items-center justify-center gap-5 self-stretch rounded-[20px] bg-white px-18.25 py-31 shadow-[2px_2px_10px_0_rgba(0,0,0,0.15)]">
                            <p className="text-center text-base font-normal leading-[150%] text-black">
                                Puedes seleccionar hasta 4 vehículos para comparar
                            </p>
                            <button
                                onClick={() => openModal()}
                                className="cursor-pointer rounded-[60px] bg-black px-5 py-3 text-base leading-none text-white transition hover:bg-black/85"
                            >
                                Añadir vehículo ({selected.length}/4)
                            </button>
                        </div>

                        {/* Contact CTA banner */}
                        <div
                            className="mt-15 flex flex-col items-start justify-end rounded-[30px] p-7.5"
                            style={{
                                backgroundImage: `linear-gradient(0deg, rgba(0,0,0,0.20) 0%, rgba(0,0,0,0.20) 100%), linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.60) 100%), url(${ejemploVideo})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                height: '340px',
                            }}
                        >
                            <div className="flex flex-col gap-7.5">
                                <p className="w-89.25 text-2xl leading-[120%] text-white">
                                    Contáctanos para recibir asesoría personalizada
                                </p>
                                <a
                                    href="#"
                                    className="flex w-fit cursor-pointer items-center gap-2.5 rounded-[60px] bg-white p-1 pl-3.5 text-base leading-none text-black transition hover:bg-white/90"
                                >
                                    Contactar ventas
                                    <span className="flex size-10 items-center justify-center rounded-full bg-black" style={{ backdropFilter: 'blur(15px)' }}>
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
                                <button
                                    onClick={handleAddMoreVehicles}
                                    className={`rounded-[60px] px-5 py-3 pb-4 text-base leading-none transition ${
                                        compareVehicles.length >= 3
                                            ? 'bg-black/40 text-white'
                                            : 'cursor-pointer bg-black/40 text-white hover:bg-black/50'
                                    }`}
                                    disabled={compareVehicles.length >= 3}
                                >
                                    Añadir vehículo ({compareVehicles.length}/3)
                                </button>
                                <button
                                    onClick={handleClearAll}
                                    className="cursor-pointer rounded-[60px] border border-black px-5 py-3 pb-4 text-base leading-none text-black transition hover:bg-black/5"
                                >
                                    Limpiar búsqueda
                                </button>
                            </div>

                            {/* Vehicle cards */}
                            {[0, 1, 2].map((i) => {
                                const v = compareVehicles[i];
                                if (v) {
                                    return (
                                        <div key={i} className="relative flex flex-col items-center gap-2.5 rounded-[20px] bg-white pt-5 pb-7.5 shadow-[2px_2px_10px_0_rgba(0,0,0,0.15)] transition-all duration-500">
                                            <button
                                                onClick={() => handleRemoveCompareVehicle(i)}
                                                className="absolute right-4 top-4 cursor-pointer transition hover:opacity-70"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                                                    <path d="M15 1.875C7.6875 1.875 1.875 7.6875 1.875 15C1.875 22.3125 7.6875 28.125 15 28.125C22.3125 28.125 28.125 22.3125 28.125 15C28.125 7.6875 22.3125 1.875 15 1.875ZM15 26.25C8.8125 26.25 3.75 21.1875 3.75 15C3.75 8.8125 8.8125 3.75 15 3.75C21.1875 3.75 26.25 8.8125 26.25 15C26.25 21.1875 21.1875 26.25 15 26.25Z" fill="black" fillOpacity="0.8"/>
                                                    <path d="M20.0625 21.5625L15 16.5L9.9375 21.5625L8.4375 20.0625L13.5 15L8.4375 9.9375L9.9375 8.4375L15 13.5L20.0625 8.4375L21.5625 9.9375L16.5 15L21.5625 20.0625L20.0625 21.5625Z" fill="black" fillOpacity="0.8"/>
                                                </svg>
                                            </button>
                                            <img src={v.image} alt={`${v.marca} ${v.modelo}`} className="mt-5 h-25.5 w-55.5 object-cover" />
                                            <span className="text-lg font-semibold uppercase leading-none text-black">
                                                {v.modelo === 'BZ4X' ? '⚡ ' : ''}{v.marca} {v.modelo}
                                            </span>
                                            <span className="text-sm uppercase leading-none text-black/60">{v.version}</span>
                                            <span className="text-xl font-semibold leading-none text-black">{v.precio}</span>
                                            <Link
                                                href="#"
                                                className="mt-2 flex items-center gap-2 text-sm leading-none text-black/60 transition hover:text-black"
                                            >
                                                Ir a ver vehículo
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="10" viewBox="0 0 14 10" fill="none">
                                                    <path d="M1 5H13M13 5L9 1M13 5L9 9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </Link>
                                        </div>
                                    );
                                }
                                return (
                                    <div key={i} className="rounded-[20px] bg-white shadow-[2px_2px_10px_0_rgba(0,0,0,0.15)]" />
                                );
                            })}
                        </div>

                        {/* Comparison table sections */}
                        <div className="mt-2.5 flex flex-col gap-2.5">
                            {compareSections.map((section, sectionIdx) => {
                                const isLastSection = sectionIdx === compareSections.length - 1;
                                return (
                                <FadeInSection key={section.title} delay={100}>
                                <div className="flex flex-col gap-2.5">
                                    {/* Section title pill */}
                                    <div className="flex items-center justify-center self-stretch rounded-[60px] bg-black px-5 py-3">
                                        <span className="pb-1 text-base leading-none text-white">{section.title}</span>
                                    </div>

                                    {/* Columns: labels + vehicle values */}
                                    <div className="grid grid-cols-4 gap-2.5">
                                        {/* Labels column */}
                                        <div className="flex flex-col gap-2.5 overflow-hidden rounded-[20px] bg-white p-5">
                                            {section.rows.map((row, rowIdx) => {
                                                const isGray = rowIdx % 2 === 0;
                                                return (
                                                    <div
                                                        key={row.label}
                                                        className={`flex items-center px-5 ${row.tall ? 'h-14.5 rounded-[60px]' : 'h-9.5 rounded-[20px]'} ${isGray ? 'bg-[#EAEAF1]' : 'border border-black/20'}`}
                                                    >
                                                        <span className="text-base font-semibold leading-none text-black">{row.label}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {/* Vehicle value columns */}
                                        {[0, 1, 2].map((i) => {
                                            const v = compareVehicles[i];
                                            const specKey = v ? `${v.modelo}|${v.version}` : '';
                                            const specs = specKey ? (specValues[specKey] ?? {}) : {};

                                            return (
                                                <div key={i} className="flex flex-col gap-2.5 overflow-hidden rounded-[20px] bg-white p-5">
                                                    {v ? section.rows.map((row, rowIdx) => {
                                                        const isGray = rowIdx % 2 === 0;
                                                        const value = specs[row.label] ?? '-';
                                                        return (
                                                            <div
                                                                key={row.label}
                                                                className={`flex items-center px-5 ${row.tall ? 'h-14.5 rounded-[60px]' : 'h-9.5 rounded-[20px]'} ${isGray ? 'bg-[#EAEAF1]' : 'border border-black/20'}`}
                                                            >
                                                                <span className="text-base leading-none text-black">{value}</span>
                                                            </div>
                                                        );
                                                    }) : (
                                                        section.rows.map((row, rowIdx) => {
                                                            const isGray = rowIdx % 2 === 0;
                                                            return (
                                                                <div
                                                                    key={row.label}
                                                                    className={`flex items-center px-5 ${row.tall ? 'h-14.5 rounded-[60px]' : 'h-9.5 rounded-[20px]'} ${isGray ? 'bg-[#EAEAF1]' : 'border border-black/20'}`}
                                                                />
                                                            );
                                                        })
                                                    )}
                                                    {isLastSection && v && (
                                                        <button className="cursor-pointer rounded-[60px] bg-black px-5 py-3 text-center text-base leading-none text-white transition hover:bg-black/85">
                                                            <span className="pb-1">Quiero cotizar</span>
                                                        </button>
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

            {/* Vehicle selector modal */}
            {selectorOpen && (
                <div
                    className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ${modalVisible ? 'bg-black/50' : 'bg-black/0'}`}
                    onClick={() => closeModal()}
                >
                    <div
                        className={`relative flex w-303.5 flex-col items-center rounded-[20px] bg-white px-10 py-12 transition-all duration-300 ${modalVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
                        style={{ height: '684px' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close button */}
                        <button
                            onClick={() => closeModal()}
                            className="absolute right-6 top-6 flex size-10 cursor-pointer items-center justify-center rounded-full transition hover:bg-[#EAEAF1]"
                        >
                            <X className="size-6 text-black" />
                        </button>

                        {/* Title */}
                        <h3 className="text-center text-2xl font-semibold leading-[150%] text-black">
                            Elige los vehículos que deseas comparar
                        </h3>

                        {/* Filters */}
                        <div className="mt-12.5 flex w-full gap-5">
                            <FilterSelect
                                label="Estado"
                                placeholder="Seleccionar estado"
                                options={['Nuevo', 'Semi Nuevo']}
                                value={filterEstado}
                                onChange={(val) => {
                                    setFilterEstado(val);
                                    setFilterMarca('');
                                    setFilterModelo('');
                                    setFilterVersion('');
                                }}
                            />
                            <FilterSelect
                                label="Marca"
                                placeholder="Seleccione una marca"
                                disabled={!filterEstado}
                                options={['Toyota']}
                                value={filterMarca}
                                onChange={(val) => {
                                    setFilterMarca(val);
                                    setFilterModelo('');
                                    setFilterVersion('');
                                }}
                            />
                            <FilterSelect
                                label="Modelo"
                                placeholder="Seleccione un modelo"
                                disabled={!filterMarca}
                                options={Object.keys(modelData)}
                                value={filterModelo}
                                onChange={(val) => {
                                    setFilterModelo(val);
                                    setFilterVersion('');
                                }}
                            />
                            <FilterSelect
                                label="Versión"
                                placeholder="Seleccionar versión"
                                disabled={!filterModelo}
                                options={filterModelo ? (modelData[filterModelo]?.versions ?? []) : []}
                                value={filterVersion}
                                onChange={(val) => {
                                    setFilterVersion(val);
                                    const data = modelData[filterModelo];
                                    if (modalSelected.length < 3 && data) {
                                        setModalSelected([...modalSelected, {
                                            marca: filterMarca,
                                            modelo: filterModelo,
                                            version: val.replace(/\s*\(.*\)/, ''),
                                            precio: val.match(/\((.*)\)/)?.[1] || '',
                                            image: data.image,
                                        }]);
                                        setFilterEstado('');
                                        setFilterMarca('');
                                        setFilterModelo('');
                                        setFilterVersion('');
                                    }
                                }}
                            />
                        </div>

                        {/* Vehicle cards */}
                        <div className="mt-10 flex gap-5">
                            {[0, 1, 2].map((i) => (
                                <ModalCard
                                    key={i}
                                    vehicle={modalSelected[i]}
                                    onRemove={() => setModalSelected(modalSelected.filter((_, idx) => idx !== i))}
                                />
                            ))}
                        </div>

                        {/* Compare button */}
                        <button
                            onClick={handleCompare}
                            className={`mt-10 rounded-[60px] bg-black px-5 py-3 text-base leading-none text-white transition-all duration-500 ${modalSelected.length > 0 ? 'cursor-pointer opacity-100 hover:bg-black/85' : 'opacity-40'}`}
                            disabled={modalSelected.length === 0}
                        >
                            Comparar ({modalSelected.length}/3)
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
