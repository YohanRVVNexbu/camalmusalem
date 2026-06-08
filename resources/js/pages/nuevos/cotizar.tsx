import { Head, Link, router, usePage } from '@inertiajs/react';
import { toast } from 'sonner';
import { Footer } from '@/components/landing/footer';
import { Navbar } from '@/components/landing/navbar';
import { useEffect, useState } from 'react';
import { formatRut, isValidRut } from '@/lib/rut';
import { formatCLP, formatTelefono, isValidTelefono } from '@/lib/format';

type PricingRow = { label: string; value: string };

type Version = {
    id: number;
    name: string;
    price?: string | null;
    pricing?: PricingRow[];
};

type Vehicle = {
    id: number;
    slug: string | null;
    name: string;
    full_name?: string | null;
    price?: string | null;
    hero_image?: string | null;
    versions?: Version[];
};

type BranchOption = { id: number; name: string; city?: string | null };

export default function NuevoCotizar({ vehicle, footer }: { vehicle: Vehicle; footer: any | null }) {
    const { branchesShared } = usePage<{ branchesShared: BranchOption[] }>().props;
    const branches = branchesShared ?? [];

    const [nombre, setNombre] = useState('');
    const [telefono, setTelefono] = useState('');
    const [email, setEmail] = useState('');
    const [rut, setRut] = useState('');
    const [comentarios, setComentarios] = useState('');
    const [branchId, setBranchId] = useState<number | ''>(branches.length === 1 ? branches[0].id : '');
    const [acepta, setAcepta] = useState(false);
    const [enviado, setEnviado] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [website, setWebsite] = useState(''); // honeypot

    useEffect(() => {
        const html = document.documentElement;
        const prev = html.style.backgroundColor;
        html.style.backgroundColor = '#fff';
        return () => { html.style.backgroundColor = prev; };
    }, []);

    // Versión preseleccionada vía ?version=ID. Si no hay match, cae al
     // primer trim disponible — mantiene el comportamiento anterior.
    const versionIdFromUrl = (() => {
        if (typeof window === 'undefined') return null;
        const v = new URLSearchParams(window.location.search).get('version');
        return v ? Number(v) || null : null;
    })();
    const activeVersion = (
        versionIdFromUrl
            ? vehicle.versions?.find((v) => v.id === versionIdFromUrl)
            : null
    ) ?? vehicle.versions?.[0];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (submitting) return;
        if (branches.length > 1 && !branchId) {
            toast.error('Selecciona la sucursal de tu interés.');
            return;
        }
        if (!acepta) {
            toast.error('Debes aceptar la política de privacidad para continuar.');
            return;
        }
        setSubmitting(true);
        router.post('/cotizaciones/vehiculo', {
            tipo: 'nuevo',
            vehicle_id: vehicle.id,
            version_id: activeVersion?.id ?? null,
            branch_id: branchId || null,
            nombre,
            email,
            telefono,
            rut,
            comentarios,
            privacidad: acepta,
            _website: website,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setEnviado(true);
                setSubmitting(false);
            },
            onError: () => {
                setSubmitting(false);
                toast.error('Hubo un problema al enviar. Revisa los campos e intenta nuevamente.');
            },
        });
    };

    const backHref = `/nuevos/${vehicle.slug ?? vehicle.id}`;
    const titleDisplay = activeVersion?.name || vehicle.full_name || vehicle.name;
    const pricingRows = activeVersion?.pricing ?? [];

    return (
        <>
            <Head title={`Cotizar ${titleDisplay} — Toyota Musalem`} />
            <div className="min-h-screen overflow-x-hidden bg-white">
                <Navbar variant="white" />

                <div className="px-5 pt-25 pb-10 lg:px-15 lg:pt-30 lg:pb-20">
                    {/* Volver */}
                    <Link
                        href={backHref}
                        className="inline-flex h-9.5 cursor-pointer items-center gap-2.5 rounded-[60px] border border-black py-2.5 pr-5 pl-2.5 text-sm leading-none text-black transition hover:bg-black/5"
                        style={{ fontFamily: '"Toyota Type"' }}
                    >
                        <span className="flex size-6 items-center justify-center rounded-full bg-black">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="9" viewBox="0 0 12 9" fill="none">
                                <path d="M10.6016 4.34961H0.601563M0.601563 4.34961L4.35156 8.09961M0.601563 4.34961L4.35156 0.599609" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </span>
                        Volver
                    </Link>

                    {/* Two columns: stack en mobile, lado a lado en desktop */}
                    <div className="mt-5 flex flex-col items-stretch gap-5 lg:flex-row lg:items-stretch">

                        {/* Left: Form card — en mobile va segundo */}
                        <div className="order-2 flex flex-1 flex-col items-center justify-center self-stretch rounded-[20px] bg-[#EAEAF1] p-5 lg:order-1 lg:p-10">
                            {!enviado ? (
                                <form onSubmit={handleSubmit} className="flex flex-col items-end justify-center gap-10 self-stretch">
                                    {/* Honeypot — invisible para humanos, bots lo rellenan */}
                                    <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }}>
                                        <label htmlFor="_website">No rellenar</label>
                                        <input id="_website" type="text" name="_website" value={website} onChange={(e) => setWebsite(e.target.value)} tabIndex={-1} autoComplete="off" />
                                    </div>
                                    <div className="flex flex-col items-start justify-start gap-5 self-stretch">

                                        {/* Title */}
                                        <h1 className="text-2xl font-semibold leading-none text-black" style={{ fontFamily: '"Toyota Type"' }}>
                                            Cotizar vehículo
                                        </h1>

                                        <div className="flex flex-col items-start justify-start gap-5 self-stretch">
                                            {/* Sucursal de interés */}
                                            {branches.length > 1 && (
                                                <div className="flex w-full flex-col items-start gap-2.5">
                                                    <label className="text-sm leading-none text-black" style={{ fontFamily: '"Toyota Type"' }}>
                                                        Sucursal de interés
                                                    </label>
                                                    <div className="flex w-full flex-wrap gap-2.5">
                                                        {branches.map((b) => (
                                                            <button
                                                                key={b.id}
                                                                type="button"
                                                                onClick={() => setBranchId(b.id)}
                                                                className={`flex h-10 cursor-pointer items-center rounded-[60px] border px-5 text-sm leading-none transition ${
                                                                    branchId === b.id
                                                                        ? 'border-black bg-black text-white'
                                                                        : 'border-transparent bg-white text-black hover:border-black/20'
                                                                }`}
                                                                style={{ fontFamily: '"Toyota Type"' }}
                                                            >
                                                                {b.name}{b.city ? ` · ${b.city}` : ''}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Nombre completo */}
                                            <div className="flex flex-col items-start justify-start gap-2.5 self-stretch">
                                                <label className="text-sm leading-none text-black" style={{ fontFamily: '"Toyota Type"' }}>
                                                    Nombre completo
                                                </label>
                                                <input
                                                    type="text"
                                                    value={nombre}
                                                    onChange={(e) => setNombre(e.target.value)}
                                                    placeholder="Ingresa tu nombre completo"
                                                    className="h-10 w-full rounded-[60px] border border-transparent bg-white px-5 text-sm leading-none text-black outline-none placeholder:text-black/60 focus:border-black/20"
                                                    style={{ fontFamily: '"Toyota Type"' }}
                                                    required
                                                />
                                            </div>

                                            {/* Email + Teléfono */}
                                            <div className="flex flex-col gap-5 self-stretch lg:flex-row lg:items-center">
                                                <div className="flex flex-1 flex-col items-start gap-2.5">
                                                    <label className="text-sm leading-none text-black" style={{ fontFamily: '"Toyota Type"' }}>
                                                        Email
                                                    </label>
                                                    <input
                                                        type="email"
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                        placeholder="Correo electrónico"
                                                        className="h-10 w-full rounded-[60px] border border-transparent bg-white px-5 text-sm leading-none text-black outline-none placeholder:text-black/60 focus:border-black/20"
                                                        style={{ fontFamily: '"Toyota Type"' }}
                                                        required
                                                    />
                                                </div>
                                                <div className="flex flex-1 flex-col items-start gap-2.5">
                                                    <label className="text-sm leading-none text-black" style={{ fontFamily: '"Toyota Type"' }}>
                                                        Teléfono
                                                    </label>
                                                    <input
                                                        type="tel"
                                                        value={telefono}
                                                        onChange={(e) => setTelefono(formatTelefono(e.target.value))}
                                                        placeholder="+56 9 1234 5678"
                                                        className="h-10 w-full rounded-[60px] border border-transparent bg-white px-5 text-sm leading-none text-black outline-none placeholder:text-black/60 focus:border-black/20"
                                                        style={{ fontFamily: '"Toyota Type"' }}
                                                        required
                                                    />
                                                    {telefono && !isValidTelefono(telefono) && (
                                                        <span className="text-xs text-red-500">Ingresa un teléfono válido (ej: +56 9 1234 5678).</span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* RUT */}
                                            <div className="flex w-full flex-col items-start gap-2.5">
                                                <label className="text-sm leading-none text-black" style={{ fontFamily: '"Toyota Type"' }}>
                                                    RUT
                                                </label>
                                                <input
                                                    type="text"
                                                    inputMode="text"
                                                    value={rut}
                                                    onChange={(e) => setRut(formatRut(e.target.value))}
                                                    placeholder="12.345.678-9"
                                                    maxLength={12}
                                                    className="h-10 w-full rounded-[60px] border border-transparent bg-white px-5 text-sm leading-none text-black outline-none placeholder:text-black/60 focus:border-black/20"
                                                    style={{ fontFamily: '"Toyota Type"' }}
                                                    required
                                                />
                                                {rut && !isValidRut(rut) && (
                                                    <span className="text-xs text-red-500">Ingresa un RUT válido (ej: 12.345.678-9).</span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Comentarios */}
                                        <div className="flex flex-col items-start gap-2.5 self-stretch">
                                            <label className="self-stretch text-sm leading-[120%] text-black" style={{ fontFamily: '"Toyota Type"' }}>
                                                Comentarios
                                            </label>
                                            <textarea
                                                value={comentarios}
                                                onChange={(e) => setComentarios(e.target.value)}
                                                placeholder="Si tienes algún comentario adicional déjalo aquí"
                                                className="h-28.5 w-full resize-none rounded-[20px] border border-transparent bg-white p-5 text-sm leading-none text-black outline-none placeholder:text-black/60 focus:border-black/20"
                                                style={{ fontFamily: '"Toyota Type"' }}
                                            />
                                        </div>

                                        {/* Checkbox */}
                                        <label className="flex cursor-pointer items-center gap-2.5">
                                            <div className="relative shrink-0">
                                                <input
                                                    type="checkbox"
                                                    checked={acepta}
                                                    onChange={(e) => setAcepta(e.target.checked)}
                                                    className="size-4.5 cursor-pointer appearance-none rounded border border-black/80 bg-[#EAEAF1] checked:bg-black"
                                                    required
                                                />
                                                {acepta && (
                                                    <svg className="pointer-events-none absolute inset-0 m-auto" width="10" height="8" viewBox="0 0 10 8" fill="none">
                                                        <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                )}
                                            </div>
                                            <span className="text-sm leading-none text-black" style={{ fontFamily: '"Toyota Type"' }}>
                                                Acepto recibir comunicaciones de parte de Musalem.{' '}
                                                <a href="#" className="underline">Revisa nuestras políticas de privacidad.</a>
                                            </span>
                                        </label>
                                    </div>

                                    {/* Submit button */}
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="flex h-12 w-full cursor-pointer items-center justify-center rounded-[60px] bg-black text-base leading-none text-white transition hover:bg-black/85 disabled:opacity-60 lg:w-50"
                                        style={{ fontFamily: '"Toyota Type"' }}
                                    >
                                        {submitting ? 'Enviando…' : 'Enviar solicitud'}
                                    </button>
                                </form>
                            ) : (
                                <div className="flex flex-col items-start gap-5 self-stretch">
                                    <div className="flex size-14 items-center justify-center rounded-full bg-black">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <path d="M5 12L10 17L19 8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                    <h2 className="text-2xl font-semibold leading-[120%] text-black lg:text-[28px] lg:leading-none" style={{ fontFamily: '"Toyota Type"' }}>
                                        ¡Solicitud enviada!
                                    </h2>
                                    <p className="text-sm leading-[120%] text-black/60 lg:text-base" style={{ fontFamily: '"Toyota Type"' }}>
                                        Hemos recibido tu cotización. Un asesor de Toyota Musalem se pondrá en contacto contigo a la brevedad.
                                    </p>
                                    <Link
                                        href="/nuevos"
                                        className="flex h-12 w-full cursor-pointer items-center justify-center rounded-[60px] bg-black px-8 text-base leading-none text-white transition hover:bg-black/85 lg:w-auto"
                                        style={{ fontFamily: '"Toyota Type"' }}
                                    >
                                        Volver a nuevos
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Right: Summary card — en mobile va primero */}
                        <div className="order-1 flex flex-1 flex-col items-center gap-5 self-stretch overflow-hidden rounded-[20px] bg-[#EAEAF1] p-5 lg:order-2 lg:px-7.5 lg:pt-5 lg:pb-7.5">
                            {/* Vehicle info card (white) */}
                            <div className="flex w-full max-w-130 shrink-0 flex-col items-center gap-3 overflow-hidden rounded-[20px] bg-white p-5 lg:gap-5">
                                <span className="text-center text-xl font-semibold uppercase leading-[120%] text-black lg:text-[28px] lg:leading-none" style={{ fontFamily: '"Toyota Type"' }}>
                                    {titleDisplay}
                                </span>
                                {vehicle.hero_image && (
                                    <img
                                        src={vehicle.hero_image}
                                        alt={titleDisplay}
                                        className="aspect-5/3 w-full max-w-100 rounded-[10px] object-cover"
                                    />
                                )}
                            </div>

                            {/* Pricing rows */}
                            {pricingRows.length > 0 && (
                                <div className="flex w-full flex-col items-start gap-3 self-stretch rounded-[10px] bg-white p-4 lg:gap-3.5 lg:bg-[#EAEAF1] lg:p-5">
                                    {pricingRows.map((row, i) => (
                                        <div key={row.label} className="flex items-center justify-between gap-3 self-stretch">
                                            <span className="text-sm leading-[120%] text-black" style={{ fontFamily: '"Toyota Type"' }}>
                                                {row.label}
                                            </span>
                                            <span
                                                className={`shrink-0 text-right text-sm leading-[120%] text-black lg:text-base ${i === 0 ? 'font-semibold' : 'font-normal'}`}
                                                style={{ fontFamily: '"Toyota Type"' }}
                                            >
                                                {formatCLP(row.value)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Fallback simple price si no hay rows */}
                            {pricingRows.length === 0 && vehicle.price && (
                                <div className="flex items-center justify-between self-stretch rounded-[10px] bg-white p-4 lg:p-5">
                                    <span className="text-sm leading-none text-black" style={{ fontFamily: '"Toyota Type"' }}>Precio:</span>
                                    <span className="text-base font-semibold leading-[120%] text-black" style={{ fontFamily: '"Toyota Type"' }}>
                                        {formatCLP(vehicle.price)}
                                    </span>
                                </div>
                            )}
                        </div>

                    </div>
                </div>

                <div className="bg-white">
                    {footer && <Footer data={footer} />}
                </div>
            </div>
        </>
    );
}
