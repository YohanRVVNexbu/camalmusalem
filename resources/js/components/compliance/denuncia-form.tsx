import { useForm, usePage } from '@inertiajs/react';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Paperclip, X as XIcon } from 'lucide-react';

import { formatRut } from '@/lib/rut';

type Categoria = { value: string; label: string };

type Props = {
    /** URL del endpoint POST (depende del tipo de denuncia). */
    submitUrl: string;
    /** Texto del header del formulario (ej: "Denuncia Ley 20.393"). */
    title: string;
    /** Subtitle bajo el título (ej: "Canal de Denuncias — Prevención del Delito"). */
    subtitle: string;
    /** Descripción / contexto legal arriba del formulario. */
    intro: string;
    /** Catálogo de categorías para el select. */
    categorias: Categoria[];
    /** Permite habilitar/deshabilitar la opción anónima. Por defecto: true. */
    permiteAnonima?: boolean;
};

const MAX_ADJUNTOS = 5;
const MAX_SIZE_MB = 5;

export function DenunciaForm({ submitUrl, title, subtitle, intro, categorias, permiteAnonima = true }: Props) {
    const { flash } = usePage<{ flash: { success?: string; error?: string; tracking_code?: string } }>().props;

    const { data, setData, post, processing, errors, reset } = useForm({
        modalidad: 'identificada' as 'identificada' | 'reserva' | 'anonima',
        categoria: '',
        asunto: '',
        nombre: '',
        email: '',
        telefono: '',
        rut: '',
        denunciado_nombre: '',
        denunciado_cargo: '',
        denunciado_sucursal: '',
        hechos_fecha: '',
        hechos_lugar: '',
        hechos_testigos: '',
        hechos_descripcion: '',
        declaracion_veracidad: false,
        privacidad: false,
        _website: '', // honeypot
        adjuntos: [] as File[],
    });

    const [adjuntosError, setAdjuntosError] = useState<string | null>(null);
    const isAnonima = data.modalidad === 'anonima';

    const handleAdjuntos = (e: ChangeEvent<HTMLInputElement>) => {
        const incoming = Array.from(e.target.files ?? []);
        e.target.value = ''; // permite re-seleccionar el mismo archivo

        const merged = [...data.adjuntos, ...incoming];
        if (merged.length > MAX_ADJUNTOS) {
            setAdjuntosError(`Máximo ${MAX_ADJUNTOS} archivos.`);
            return;
        }
        const oversize = merged.find((f) => f.size > MAX_SIZE_MB * 1024 * 1024);
        if (oversize) {
            setAdjuntosError(`Cada archivo debe pesar menos de ${MAX_SIZE_MB} MB.`);
            return;
        }
        setAdjuntosError(null);
        setData('adjuntos', merged);
    };

    const removeAdjunto = (idx: number) => {
        setData('adjuntos', data.adjuntos.filter((_, i) => i !== idx));
    };

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post(submitUrl, {
            forceFormData: true,
            onSuccess: () => {
                reset();
                toast.success('¡Denuncia recibida! Será revisada con confidencialidad.');
            },
            onError: () => toast.error('Por favor revisa los campos e inténtalo nuevamente.'),
        });
    };

    useEffect(() => {
        if (flash?.error) toast.error(flash.error);
    }, [flash?.error]);

    // Si llegamos con tracking_code en flash, lo mostramos al usuario.
    const trackingCode = flash?.tracking_code;

    return (
        <form onSubmit={submit} className="flex w-full flex-col gap-8">
            <div className="flex flex-col gap-3">
                <h1 className="text-2xl font-semibold text-black lg:text-3xl" style={{ fontFamily: '"Toyota Type"' }}>
                    {title}
                </h1>
                <p className="text-sm text-black/70 lg:text-base" style={{ fontFamily: '"Toyota Type"' }}>
                    {subtitle}
                </p>
                <p className="text-sm text-black/70 lg:text-base" style={{ fontFamily: '"Toyota Type"' }}>
                    {intro}
                </p>
            </div>

            {trackingCode && (
                <div className="rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
                    <p className="mb-1 font-medium">Denuncia recibida</p>
                    <p>
                        Tu código de seguimiento es <strong className="font-mono">{trackingCode}</strong>.
                        Guárdalo para consultar el estado más adelante.
                    </p>
                </div>
            )}

            {/* Honeypot */}
            <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }}>
                <label htmlFor="_website">No rellenar</label>
                <input
                    id="_website"
                    type="text"
                    name="_website"
                    value={data._website}
                    onChange={(e) => setData('_website', e.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                />
            </div>

            {/* Modalidad */}
            <fieldset className="flex flex-col gap-3">
                <legend className="text-sm font-medium text-black" style={{ fontFamily: '"Toyota Type"' }}>
                    Modalidad de la denuncia
                </legend>
                <div className="grid gap-4 lg:grid-cols-3 lg:gap-5">
                    {([
                        { v: 'identificada', t: 'Identificada', d: 'Compartes tu identidad con quienes investigan.' },
                        { v: 'reserva',      t: 'Con reserva de identidad', d: 'Te identificas pero tu nombre solo lo verá el investigador.' },
                        ...(permiteAnonima ? [{ v: 'anonima', t: 'Anónima', d: 'No entregas datos personales. Dificulta la investigación.' }] : []),
                    ] as { v: 'identificada' | 'reserva' | 'anonima'; t: string; d: string }[]).map(({ v, t, d }) => (
                        <label
                            key={v}
                            className={`cursor-pointer rounded-xl border p-4 transition ${data.modalidad === v ? 'border-black bg-black text-white' : 'border-black/15 bg-white text-black hover:border-black/40'}`}
                            style={{ fontFamily: '"Toyota Type"' }}
                        >
                            <input
                                type="radio"
                                name="modalidad"
                                value={v}
                                checked={data.modalidad === v}
                                onChange={() => setData('modalidad', v)}
                                className="sr-only"
                            />
                            <span className="block text-sm font-medium">{t}</span>
                            <span className={`mt-1 block text-xs ${data.modalidad === v ? 'text-white/80' : 'text-black/60'}`}>
                                {d}
                            </span>
                        </label>
                    ))}
                </div>
                {errors.modalidad && <span className="text-xs text-red-500">{errors.modalidad}</span>}
            </fieldset>

            {/* Categoría */}
            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-black" style={{ fontFamily: '"Toyota Type"' }}>
                    Categoría de la denuncia *
                </label>
                <select
                    value={data.categoria}
                    onChange={(e) => setData('categoria', e.target.value)}
                    required
                    className="h-11 rounded-2xl border border-black/15 bg-white px-4 text-sm text-black outline-none focus:border-black"
                    style={{ fontFamily: '"Toyota Type"' }}
                >
                    <option value="">Selecciona una categoría</option>
                    {categorias.map((c) => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                </select>
                {errors.categoria && <span className="text-xs text-red-500">{errors.categoria}</span>}
            </div>

            {/* Identificación (oculta si es anónima) */}
            {!isAnonima && (
                <fieldset className="flex flex-col gap-4">
                    <legend className="text-sm font-medium text-black" style={{ fontFamily: '"Toyota Type"' }}>
                        Tus datos de contacto
                    </legend>
                    <div className="grid gap-4 lg:grid-cols-2">
                        <Field label="Nombre completo *" error={errors.nombre}>
                            <input
                                type="text"
                                value={data.nombre}
                                onChange={(e) => setData('nombre', e.target.value)}
                                required={!isAnonima}
                                placeholder="Ej: Juan Pérez González"
                                className="h-11 w-full rounded-2xl border border-black/15 bg-white px-4 text-sm text-black outline-none focus:border-black"
                                style={{ fontFamily: '"Toyota Type"' }}
                            />
                        </Field>
                        <Field label="Email *" error={errors.email}>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                required={!isAnonima}
                                placeholder="tu@correo.cl"
                                className="h-11 w-full rounded-2xl border border-black/15 bg-white px-4 text-sm text-black outline-none focus:border-black"
                                style={{ fontFamily: '"Toyota Type"' }}
                            />
                        </Field>
                        <Field label="Teléfono" error={errors.telefono}>
                            <input
                                type="tel"
                                value={data.telefono}
                                onChange={(e) => setData('telefono', e.target.value)}
                                placeholder="+569"
                                className="h-11 w-full rounded-2xl border border-black/15 bg-white px-4 text-sm text-black outline-none focus:border-black"
                                style={{ fontFamily: '"Toyota Type"' }}
                            />
                        </Field>
                        <Field label="RUT" error={errors.rut}>
                            <input
                                type="text"
                                value={data.rut}
                                onChange={(e) => setData('rut', formatRut(e.target.value))}
                                maxLength={12}
                                placeholder="12.345.678-9"
                                className="h-11 w-full rounded-2xl border border-black/15 bg-white px-4 text-sm text-black outline-none focus:border-black"
                                style={{ fontFamily: '"Toyota Type"' }}
                            />
                        </Field>
                    </div>
                </fieldset>
            )}

            {/* Denunciado */}
            <fieldset className="flex flex-col gap-4">
                <legend className="text-sm font-medium text-black" style={{ fontFamily: '"Toyota Type"' }}>
                    Datos del denunciado (si los conoces)
                </legend>
                <div className="grid gap-4 lg:grid-cols-3">
                    <Field label="Nombre" error={errors.denunciado_nombre}>
                        <input
                            type="text"
                            value={data.denunciado_nombre}
                            onChange={(e) => setData('denunciado_nombre', e.target.value)}
                            placeholder="Nombre y apellido"
                            className="h-11 w-full rounded-2xl border border-black/15 bg-white px-4 text-sm text-black outline-none focus:border-black"
                            style={{ fontFamily: '"Toyota Type"' }}
                        />
                    </Field>
                    <Field label="Cargo / relación" error={errors.denunciado_cargo}>
                        <input
                            type="text"
                            value={data.denunciado_cargo}
                            onChange={(e) => setData('denunciado_cargo', e.target.value)}
                            placeholder="Ej: Jefe de taller"
                            className="h-11 w-full rounded-2xl border border-black/15 bg-white px-4 text-sm text-black outline-none focus:border-black"
                            style={{ fontFamily: '"Toyota Type"' }}
                        />
                    </Field>
                    <Field label="Sucursal / área" error={errors.denunciado_sucursal}>
                        <input
                            type="text"
                            value={data.denunciado_sucursal}
                            onChange={(e) => setData('denunciado_sucursal', e.target.value)}
                            placeholder="Ej: La Serena"
                            className="h-11 w-full rounded-2xl border border-black/15 bg-white px-4 text-sm text-black outline-none focus:border-black"
                            style={{ fontFamily: '"Toyota Type"' }}
                        />
                    </Field>
                </div>
            </fieldset>

            {/* Hechos */}
            <fieldset className="flex flex-col gap-4">
                <legend className="text-sm font-medium text-black" style={{ fontFamily: '"Toyota Type"' }}>
                    Hechos denunciados
                </legend>
                <div className="grid gap-4 lg:grid-cols-2">
                    <Field label="Fecha de los hechos" error={errors.hechos_fecha}>
                        <input
                            type="date"
                            value={data.hechos_fecha}
                            onChange={(e) => setData('hechos_fecha', e.target.value)}
                            className="h-11 w-full rounded-2xl border border-black/15 bg-white px-4 text-sm text-black outline-none focus:border-black"
                            style={{ fontFamily: '"Toyota Type"' }}
                        />
                    </Field>
                    <Field label="Lugar" error={errors.hechos_lugar}>
                        <input
                            type="text"
                            value={data.hechos_lugar}
                            onChange={(e) => setData('hechos_lugar', e.target.value)}
                            placeholder="Ej: Oficina de ventas, sucursal La Serena"
                            className="h-11 w-full rounded-2xl border border-black/15 bg-white px-4 text-sm text-black outline-none focus:border-black"
                            style={{ fontFamily: '"Toyota Type"' }}
                        />
                    </Field>
                </div>
                <Field label="Testigos (si los hay)" error={errors.hechos_testigos}>
                    <textarea
                        value={data.hechos_testigos}
                        onChange={(e) => setData('hechos_testigos', e.target.value)}
                        rows={2}
                        placeholder="Nombres, cargos o cualquier información relevante."
                        className="w-full resize-none rounded-2xl border border-black/15 bg-white p-4 text-sm text-black outline-none focus:border-black"
                        style={{ fontFamily: '"Toyota Type"' }}
                    />
                </Field>
                <Field label="Descripción de los hechos * (mínimo 50 caracteres)" error={errors.hechos_descripcion}>
                    <textarea
                        value={data.hechos_descripcion}
                        onChange={(e) => setData('hechos_descripcion', e.target.value)}
                        rows={6}
                        required
                        minLength={50}
                        placeholder="Cuenta lo más detallado posible qué ocurrió: cómo, cuándo, dónde, con quién, frecuencia, contexto. Mientras más información entregues, mejor podremos investigar."
                        className="w-full resize-none rounded-2xl border border-black/15 bg-white p-4 text-sm text-black outline-none focus:border-black"
                        style={{ fontFamily: '"Toyota Type"' }}
                    />
                </Field>
            </fieldset>

            {/* Adjuntos */}
            <fieldset className="flex flex-col gap-3">
                <legend className="text-sm font-medium text-black" style={{ fontFamily: '"Toyota Type"' }}>
                    Adjuntar evidencia (opcional)
                </legend>
                <p className="text-xs text-black/60" style={{ fontFamily: '"Toyota Type"' }}>
                    Hasta {MAX_ADJUNTOS} archivos, {MAX_SIZE_MB} MB cada uno. Formatos aceptados: PDF, JPG, PNG, DOC, XLS.
                </p>
                <label
                    className="flex h-24 cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-black/30 bg-white text-sm text-black/70 transition hover:border-black hover:text-black"
                    style={{ fontFamily: '"Toyota Type"' }}
                >
                    <Paperclip className="size-4" />
                    Adjuntar archivos
                    <input
                        type="file"
                        multiple
                        onChange={handleAdjuntos}
                        accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                        className="hidden"
                    />
                </label>
                {data.adjuntos.length > 0 && (
                    <ul className="flex flex-col gap-2">
                        {data.adjuntos.map((f, i) => (
                            <li key={i} className="flex items-center justify-between gap-3 rounded-xl bg-black/5 px-4 py-2 text-sm">
                                <span className="truncate" style={{ fontFamily: '"Toyota Type"' }}>{f.name}</span>
                                <button type="button" onClick={() => removeAdjunto(i)} className="text-black/60 hover:text-red-600">
                                    <XIcon className="size-4" />
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
                {adjuntosError && <span className="text-xs text-red-500">{adjuntosError}</span>}
                {errors['adjuntos'] && <span className="text-xs text-red-500">{errors['adjuntos']}</span>}
            </fieldset>

            {/* Declaraciones */}
            <div className="flex flex-col gap-3 rounded-2xl border border-black/10 bg-black/5 p-5">
                <label className="flex items-start gap-3 text-sm text-black" style={{ fontFamily: '"Toyota Type"' }}>
                    <input
                        type="checkbox"
                        checked={data.declaracion_veracidad}
                        onChange={(e) => setData('declaracion_veracidad', e.target.checked)}
                        required
                        className="mt-1 size-4 shrink-0"
                    />
                    Declaro bajo juramento que la información proporcionada es verídica y conozco las consecuencias legales de una denuncia maliciosa.
                </label>
                {errors.declaracion_veracidad && <span className="text-xs text-red-500">{errors.declaracion_veracidad}</span>}

                <label className="flex items-start gap-3 text-sm text-black" style={{ fontFamily: '"Toyota Type"' }}>
                    <input
                        type="checkbox"
                        checked={data.privacidad}
                        onChange={(e) => setData('privacidad', e.target.checked)}
                        required
                        className="mt-1 size-4 shrink-0"
                    />
                    He leído y acepto la política de tratamiento confidencial de mis datos personales (Ley 19.628).
                </label>
                {errors.privacidad && <span className="text-xs text-red-500">{errors.privacidad}</span>}
            </div>

            <button
                type="submit"
                disabled={processing}
                className="inline-flex h-12 w-full items-center justify-center rounded-full bg-black px-6 text-white transition hover:bg-black/85 disabled:opacity-60 lg:w-auto lg:min-w-60"
                style={{ fontFamily: '"Toyota Type"' }}
            >
                {processing ? 'Enviando…' : 'Enviar denuncia'}
            </button>
        </form>
    );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-sm text-black" style={{ fontFamily: '"Toyota Type"' }}>{label}</label>
            {children}
            {error && <span className="text-xs text-red-500">{error}</span>}
        </div>
    );
}
