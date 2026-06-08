import { useForm, usePage } from '@inertiajs/react';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Paperclip, X as XIcon } from 'lucide-react';

import { formatRut, isValidRut } from '@/lib/rut';
import { formatTelefono, isValidTelefono } from '@/lib/format';

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
    /**
     * Variante del formulario:
     *  - 'simple'   → form actual (Ley Karin, hasta que llegue su doc oficial)
     *  - 'completo' → form alineado al "Formulario de Denuncia MUSALEM"
     *                 (Ley 20.393 + Ley 19.913). Muestra las 5 secciones del
     *                 documento oficial con todos los campos extras.
     */
    variant?: 'simple' | 'completo';
    /** Catálogos extra que solo aplican a variant='completo'. */
    relacionesEmpresa?: Record<string, string>;
    frecuencias?: Record<string, string>;
    montos?: Record<string, string>;
    evidencia?: Record<string, string>;
    reportadoAntes?: Record<string, string>;
    otrosSaben?: Record<string, string>;
};

const MAX_ADJUNTOS = 5;
const MAX_SIZE_MB = 5;

export function DenunciaForm({
    submitUrl,
    title,
    subtitle,
    intro,
    categorias,
    permiteAnonima = true,
    variant = 'simple',
    relacionesEmpresa = {},
    frecuencias = {},
    montos = {},
    evidencia = {},
    reportadoAntes = {},
    otrosSaben = {},
}: Props) {
    const isCompleto = variant === 'completo';
    const { flash } = usePage<{ flash: { success?: string; error?: string; tracking_code?: string } }>().props;

    const { data, setData, post, processing, errors, reset } = useForm({
        modalidad: 'identificada' as 'identificada' | 'reserva' | 'anonima',
        categoria: '',
        categoria_otro: '',
        asunto: '',
        nombre: '',
        email: '',
        telefono: '',
        rut: '',
        relacion_empresa: '',
        relacion_empresa_otro: '',
        reserva_total: false,
        denunciado_nombre: '',
        denunciado_cargo: '',
        denunciado_sucursal: '',
        denunciado_area: '',
        hechos_fecha: '',
        hechos_periodo_desde: '',
        hechos_periodo_hasta: '',
        hechos_continua: false,
        hechos_fechas_desconocidas: false,
        hechos_lugar: '',
        hechos_testigos: '',
        hechos_descripcion: '',
        frecuencia: '',
        monto_estimado: '',
        evidencia_descripcion: '',
        tiene_evidencia: '',
        reportado_antes: '',
        reportado_a_quien: '',
        otros_saben: '',
        recibir_actualizaciones: false,
        observaciones: '',
        declaracion_veracidad: false,
        privacidad: false,
        _website: '',
        adjuntos: [] as File[],
    });

    const [adjuntosError, setAdjuntosError] = useState<string | null>(null);
    const isAnonima = data.modalidad === 'anonima';

    const handleAdjuntos = (e: ChangeEvent<HTMLInputElement>) => {
        const incoming = Array.from(e.target.files ?? []);
        e.target.value = '';
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

    const trackingCode = flash?.tracking_code;

    return (
        <form onSubmit={submit} className="flex w-full flex-col gap-8">
            <div className="flex flex-col gap-3">
                <h1 className="text-2xl font-semibold text-black lg:text-3xl" style={{ fontFamily: '"Toyota Type"' }}>{title}</h1>
                <p className="text-sm text-black/70 lg:text-base" style={{ fontFamily: '"Toyota Type"' }}>{subtitle}</p>
                <p className="text-sm text-black/70 lg:text-base" style={{ fontFamily: '"Toyota Type"' }}>{intro}</p>
            </div>

            {trackingCode && (
                <div className="rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
                    <p className="mb-1 font-medium">Denuncia recibida</p>
                    <p>Tu código de seguimiento es <strong className="font-mono">{trackingCode}</strong>. Guárdalo para consultar el estado más adelante.</p>
                </div>
            )}

            {/* Honeypot */}
            <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }}>
                <label htmlFor="_website">No rellenar</label>
                <input id="_website" type="text" name="_website" value={data._website} onChange={(e) => setData('_website', e.target.value)} tabIndex={-1} autoComplete="off" />
            </div>

            {/* Modalidad de la denuncia (siempre visible) */}
            <fieldset className="flex flex-col gap-3">
                <legend className="text-sm font-medium text-black" style={{ fontFamily: '"Toyota Type"' }}>Modalidad de la denuncia</legend>
                <div className="grid gap-4 lg:grid-cols-3 lg:gap-5">
                    {([
                        { v: 'identificada', t: 'Identificada', d: 'Compartes tu identidad con quienes investigan.' },
                        { v: 'reserva',      t: 'Con reserva de identidad', d: 'Te identificas pero tu nombre solo lo verá el investigador.' },
                        ...(permiteAnonima ? [{ v: 'anonima', t: 'Anónima', d: 'No entregas datos personales. Dificulta la investigación.' }] : []),
                    ] as { v: 'identificada' | 'reserva' | 'anonima'; t: string; d: string }[]).map(({ v, t, d }) => (
                        <label key={v} className={`cursor-pointer rounded-xl border p-4 transition ${data.modalidad === v ? 'border-black bg-black text-white' : 'border-black/15 bg-white text-black hover:border-black/40'}`} style={{ fontFamily: '"Toyota Type"' }}>
                            <input type="radio" name="modalidad" value={v} checked={data.modalidad === v} onChange={() => setData('modalidad', v)} className="sr-only" />
                            <span className="block text-sm font-medium">{t}</span>
                            <span className={`mt-1 block text-xs ${data.modalidad === v ? 'text-white/80' : 'text-black/60'}`}>{d}</span>
                        </label>
                    ))}
                </div>
                {errors.modalidad && <span className="text-xs text-red-500">{errors.modalidad}</span>}
            </fieldset>

            {/* ─── SECCIÓN 1: Clasificación del tipo de denuncia ─── */}
            <SectionHeader title="1. Clasificación del tipo de denuncia" />
            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-black" style={{ fontFamily: '"Toyota Type"' }}>Tipo de infracción que desea denunciar *</label>
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
            {isCompleto && data.categoria === 'otro' && (
                <Field label='Especifique "Otro"' error={errors.categoria_otro}>
                    <Input value={data.categoria_otro} onChange={(v) => setData('categoria_otro', v)} placeholder="Indica el tipo de infracción que quieres reportar" />
                </Field>
            )}

            {/* ─── SECCIÓN 2: Información del denunciante ─── */}
            <SectionHeader title="2. Información del denunciante" subtitle={isCompleto ? 'Esta sección es confidencial. Si haces la denuncia de forma anónima, puedes omitirla — aunque la capacidad de seguimiento será más limitada.' : undefined} />

            {!isAnonima && (
                <div className="grid gap-4 lg:grid-cols-2">
                    <Field label="Nombre completo *" error={errors.nombre}>
                        <Input value={data.nombre} onChange={(v) => setData('nombre', v)} required placeholder="Ej: Juan Pérez González" />
                    </Field>
                    <Field label="Email *" error={errors.email}>
                        <Input type="email" value={data.email} onChange={(v) => setData('email', v)} required placeholder="tu@correo.cl" />
                    </Field>
                    <Field label="Teléfono" error={errors.telefono || (data.telefono && !isValidTelefono(data.telefono) ? 'Ingresa un teléfono válido (ej: +56 9 1234 5678).' : undefined)}>
                        <Input type="tel" value={data.telefono} onChange={(v) => setData('telefono', formatTelefono(v))} placeholder="+56 9 1234 5678" />
                    </Field>
                    <Field label="RUT" error={errors.rut || (data.rut && !isValidRut(data.rut) ? 'Ingresa un RUT válido (ej: 12.345.678-9).' : undefined)}>
                        <Input value={data.rut} onChange={(v) => setData('rut', formatRut(v))} maxLength={12} placeholder="12.345.678-9" />
                    </Field>
                </div>
            )}

            {isCompleto && (
                <>
                    <fieldset className="flex flex-col gap-3">
                        <legend className="text-sm font-medium text-black" style={{ fontFamily: '"Toyota Type"' }}>Relación con la empresa *</legend>
                        <div className="grid gap-2 lg:grid-cols-5">
                            {Object.entries(relacionesEmpresa).map(([v, label]) => (
                                <RadioCard key={v} name="relacion_empresa" value={v} checked={data.relacion_empresa === v} label={label} onChange={() => setData('relacion_empresa', v)} />
                            ))}
                        </div>
                        {errors.relacion_empresa && <span className="text-xs text-red-500">{errors.relacion_empresa}</span>}
                    </fieldset>
                    {data.relacion_empresa === 'otro' && (
                        <Field label='Especifique "Otro"' error={errors.relacion_empresa_otro}>
                            <Input value={data.relacion_empresa_otro} onChange={(v) => setData('relacion_empresa_otro', v)} placeholder="Tu relación con la empresa" />
                        </Field>
                    )}
                    {!isAnonima && (
                        <label className="flex items-start gap-3 rounded-2xl border border-black/10 bg-black/5 p-4 text-sm text-black" style={{ fontFamily: '"Toyota Type"' }}>
                            <input type="checkbox" checked={data.reserva_total} onChange={(e) => setData('reserva_total', e.target.checked)} className="mt-1 size-4 shrink-0" />
                            <span>
                                <strong>Solicito que mi identidad se mantenga en reserva total</strong> — Solo el Encargado de Prevención del Delito tendrá acceso a mi identidad. El equipo investigador trabajará sin conocer mis datos.
                            </span>
                        </label>
                    )}
                </>
            )}

            {/* ─── SECCIÓN 3: Información sobre la denuncia ─── */}
            <SectionHeader title={isCompleto ? '3. Información sobre la denuncia' : 'Hechos denunciados'} />

            <Field label='Descripción detallada de los hechos * (mínimo 50 caracteres)' error={errors.hechos_descripcion}>
                <textarea
                    value={data.hechos_descripcion}
                    onChange={(e) => setData('hechos_descripcion', e.target.value)}
                    rows={6}
                    required
                    minLength={50}
                    placeholder={isCompleto ? 'Sea lo más específico posible. Incluya quién, qué, cómo, cuándo y dónde ocurrió.' : 'Cuenta lo más detallado posible qué ocurrió: cómo, cuándo, dónde, con quién, frecuencia, contexto.'}
                    className="w-full resize-none rounded-2xl border border-black/15 bg-white p-4 text-sm text-black outline-none focus:border-black"
                    style={{ fontFamily: '"Toyota Type"' }}
                />
            </Field>

            {isCompleto ? (
                <>
                    <p className="text-sm font-medium text-black" style={{ fontFamily: '"Toyota Type"' }}>Fecha de los hechos *</p>
                    <div className="grid gap-4 lg:grid-cols-3">
                        <Field label="Fecha exacta" error={errors.hechos_fecha}>
                            <Input type="date" value={data.hechos_fecha} onChange={(v) => setData('hechos_fecha', v)} />
                        </Field>
                        <Field label="Período desde" error={errors.hechos_periodo_desde}>
                            <Input type="date" value={data.hechos_periodo_desde} onChange={(v) => setData('hechos_periodo_desde', v)} />
                        </Field>
                        <Field label="Período hasta" error={errors.hechos_periodo_hasta}>
                            <Input type="date" value={data.hechos_periodo_hasta} onChange={(v) => setData('hechos_periodo_hasta', v)} />
                        </Field>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Checkbox checked={data.hechos_continua} onChange={(v) => setData('hechos_continua', v)} label="La conducta es continua o recurrente" />
                        <Checkbox checked={data.hechos_fechas_desconocidas} onChange={(v) => setData('hechos_fechas_desconocidas', v)} label="Desconozco las fechas exactas" />
                    </div>
                </>
            ) : (
                <div className="grid gap-4 lg:grid-cols-2">
                    <Field label="Fecha de los hechos" error={errors.hechos_fecha}>
                        <Input type="date" value={data.hechos_fecha} onChange={(v) => setData('hechos_fecha', v)} />
                    </Field>
                    <Field label="Lugar" error={errors.hechos_lugar}>
                        <Input value={data.hechos_lugar} onChange={(v) => setData('hechos_lugar', v)} placeholder="Ej: Oficina de ventas, sucursal La Serena" />
                    </Field>
                </div>
            )}

            {isCompleto && (
                <Field label="Lugar donde ocurrieron los hechos *" error={errors.hechos_lugar}>
                    <Input value={data.hechos_lugar} onChange={(v) => setData('hechos_lugar', v)} placeholder="Sucursal, área, dirección o ubicación específica" required />
                </Field>
            )}

            <Field label={isCompleto ? 'Personas involucradas — nombres, roles y calidad (presunto autor, testigo, cómplice)' : 'Testigos (si los hay)'} error={errors.hechos_testigos}>
                <textarea
                    value={data.hechos_testigos}
                    onChange={(e) => setData('hechos_testigos', e.target.value)}
                    rows={3}
                    placeholder={isCompleto ? 'Ej:\nJuan Pérez — Gerente comercial (presunto autor)\nMaría García — Jefa de administración (testigo)' : 'Nombres, cargos o cualquier información relevante.'}
                    className="w-full resize-none rounded-2xl border border-black/15 bg-white p-4 text-sm text-black outline-none focus:border-black"
                    style={{ fontFamily: '"Toyota Type"' }}
                />
            </Field>

            {isCompleto ? (
                <Field label="Área o departamento involucrado" error={errors.denunciado_area}>
                    <Input value={data.denunciado_area} onChange={(v) => setData('denunciado_area', v)} placeholder="Ej: Finanzas, Ventas, Servicio Técnico" />
                </Field>
            ) : (
                <fieldset className="flex flex-col gap-4">
                    <legend className="text-sm font-medium text-black" style={{ fontFamily: '"Toyota Type"' }}>Datos del denunciado (si los conoces)</legend>
                    <div className="grid gap-4 lg:grid-cols-3">
                        <Field label="Nombre" error={errors.denunciado_nombre}>
                            <Input value={data.denunciado_nombre} onChange={(v) => setData('denunciado_nombre', v)} placeholder="Nombre y apellido" />
                        </Field>
                        <Field label="Cargo / relación" error={errors.denunciado_cargo}>
                            <Input value={data.denunciado_cargo} onChange={(v) => setData('denunciado_cargo', v)} placeholder="Ej: Jefe de taller" />
                        </Field>
                        <Field label="Sucursal / área" error={errors.denunciado_sucursal}>
                            <Input value={data.denunciado_sucursal} onChange={(v) => setData('denunciado_sucursal', v)} placeholder="Ej: La Serena" />
                        </Field>
                    </div>
                </fieldset>
            )}

            {isCompleto && (
                <>
                    <fieldset className="flex flex-col gap-3">
                        <legend className="text-sm font-medium text-black" style={{ fontFamily: '"Toyota Type"' }}>Frecuencia de la conducta *</legend>
                        <div className="grid gap-2 lg:grid-cols-4">
                            {Object.entries(frecuencias).map(([v, label]) => (
                                <RadioCard key={v} name="frecuencia" value={v} checked={data.frecuencia === v} label={label} onChange={() => setData('frecuencia', v)} />
                            ))}
                        </div>
                    </fieldset>
                    <fieldset className="flex flex-col gap-3">
                        <legend className="text-sm font-medium text-black" style={{ fontFamily: '"Toyota Type"' }}>Estimación de montos involucrados (si aplica)</legend>
                        <div className="grid gap-2 lg:grid-cols-5">
                            {Object.entries(montos).map(([v, label]) => (
                                <RadioCard key={v} name="monto_estimado" value={v} checked={data.monto_estimado === v} label={label} onChange={() => setData('monto_estimado', v)} />
                            ))}
                        </div>
                    </fieldset>
                </>
            )}

            {/* ─── SECCIÓN 4: Documentación de respaldo ─── */}
            <SectionHeader title={isCompleto ? '4. Documentación de respaldo' : 'Adjuntar evidencia (opcional)'} subtitle={isCompleto ? 'Documentación útil: correos relacionados, contratos o facturas sospechosas, registros contables, fotografías, capturas de pantalla u otros antecedentes que estimes pertinentes.' : undefined} />

            {isCompleto && (
                <>
                    <Field label="Descripción de la documentación adjunta" error={errors.evidencia_descripcion}>
                        <textarea
                            value={data.evidencia_descripcion}
                            onChange={(e) => setData('evidencia_descripcion', e.target.value)}
                            rows={3}
                            placeholder="Indica qué adjuntas y cómo se relaciona con los hechos denunciados."
                            className="w-full resize-none rounded-2xl border border-black/15 bg-white p-4 text-sm text-black outline-none focus:border-black"
                            style={{ fontFamily: '"Toyota Type"' }}
                        />
                    </Field>
                    <fieldset className="flex flex-col gap-3">
                        <legend className="text-sm font-medium text-black" style={{ fontFamily: '"Toyota Type"' }}>¿Cuenta con evidencia física o digital?</legend>
                        <div className="grid gap-2 lg:grid-cols-3">
                            {Object.entries(evidencia).map(([v, label]) => (
                                <RadioCard key={v} name="tiene_evidencia" value={v} checked={data.tiene_evidencia === v} label={label} onChange={() => setData('tiene_evidencia', v)} />
                            ))}
                        </div>
                    </fieldset>
                </>
            )}

            <div className="flex flex-col gap-3">
                <p className="text-xs text-black/60" style={{ fontFamily: '"Toyota Type"' }}>
                    Hasta {MAX_ADJUNTOS} archivos, {MAX_SIZE_MB} MB cada uno. Formatos: PDF, JPG, PNG, DOC, XLS.
                </p>
                <label className="flex h-24 cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-black/30 bg-white text-sm text-black/70 transition hover:border-black hover:text-black" style={{ fontFamily: '"Toyota Type"' }}>
                    <Paperclip className="size-4" />
                    Adjuntar archivos
                    <input type="file" multiple onChange={handleAdjuntos} accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx,.xls,.xlsx,.ppt,.pptx" className="hidden" />
                </label>
                {data.adjuntos.length > 0 && (
                    <ul className="flex flex-col gap-2">
                        {data.adjuntos.map((f, i) => (
                            <li key={i} className="flex items-center justify-between gap-3 rounded-xl bg-black/5 px-4 py-2 text-sm">
                                <span className="truncate" style={{ fontFamily: '"Toyota Type"' }}>{f.name}</span>
                                <button type="button" onClick={() => removeAdjunto(i)} className="text-black/60 hover:text-red-600"><XIcon className="size-4" /></button>
                            </li>
                        ))}
                    </ul>
                )}
                {adjuntosError && <span className="text-xs text-red-500">{adjuntosError}</span>}
            </div>

            {/* ─── SECCIÓN 5: Información adicional (solo completo) ─── */}
            {isCompleto && (
                <>
                    <SectionHeader title="5. Información adicional" />
                    <fieldset className="flex flex-col gap-3">
                        <legend className="text-sm font-medium text-black" style={{ fontFamily: '"Toyota Type"' }}>¿Ha reportado esta situación anteriormente?</legend>
                        <div className="flex flex-col gap-2">
                            {Object.entries(reportadoAntes).map(([v, label]) => (
                                <RadioCard key={v} name="reportado_antes" value={v} checked={data.reportado_antes === v} label={label} onChange={() => setData('reportado_antes', v)} />
                            ))}
                        </div>
                    </fieldset>
                    {(data.reportado_antes === 'internamente' || data.reportado_antes === 'externamente') && (
                        <Field label="¿A quién?" error={errors.reportado_a_quien}>
                            <Input value={data.reportado_a_quien} onChange={(v) => setData('reportado_a_quien', v)} placeholder="Indica a qué persona, área o autoridad" />
                        </Field>
                    )}
                    <fieldset className="flex flex-col gap-3">
                        <legend className="text-sm font-medium text-black" style={{ fontFamily: '"Toyota Type"' }}>¿Tiene conocimiento de si otras personas están al tanto de esta situación?</legend>
                        <div className="grid gap-2 lg:grid-cols-3">
                            {Object.entries(otrosSaben).map(([v, label]) => (
                                <RadioCard key={v} name="otros_saben" value={v} checked={data.otros_saben === v} label={label} onChange={() => setData('otros_saben', v)} />
                            ))}
                        </div>
                    </fieldset>
                    {!isAnonima && (
                        <Checkbox checked={data.recibir_actualizaciones} onChange={(v) => setData('recibir_actualizaciones', v)} label="Deseo recibir información sobre el estado de la investigación al correo electrónico que indiqué." />
                    )}
                    <Field label="Observaciones adicionales o comentarios" error={errors.observaciones}>
                        <textarea
                            value={data.observaciones}
                            onChange={(e) => setData('observaciones', e.target.value)}
                            rows={3}
                            className="w-full resize-none rounded-2xl border border-black/15 bg-white p-4 text-sm text-black outline-none focus:border-black"
                            style={{ fontFamily: '"Toyota Type"' }}
                        />
                    </Field>
                </>
            )}

            {/* Declaraciones */}
            <div className="flex flex-col gap-3 rounded-2xl border border-black/10 bg-black/5 p-5">
                <Checkbox required checked={data.declaracion_veracidad} onChange={(v) => setData('declaracion_veracidad', v)} label="Declaro bajo juramento que la información proporcionada es verídica y conozco las consecuencias legales de una denuncia maliciosa." />
                {errors.declaracion_veracidad && <span className="text-xs text-red-500">{errors.declaracion_veracidad}</span>}
                <Checkbox required checked={data.privacidad} onChange={(v) => setData('privacidad', v)} label="He leído y acepto la política de tratamiento confidencial de mis datos personales (Ley 19.628)." />
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

// ───────────────────────── Sub-componentes ─────────────────────────

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
    return (
        <div className="flex flex-col gap-1 border-t border-black/10 pt-6">
            <h2 className="text-base font-semibold uppercase tracking-wide text-black lg:text-lg" style={{ fontFamily: '"Toyota Type"' }}>{title}</h2>
            {subtitle && <p className="text-xs text-black/60 lg:text-sm" style={{ fontFamily: '"Toyota Type"' }}>{subtitle}</p>}
        </div>
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

function Input({ value, onChange, type = 'text', placeholder, required, maxLength }: {
    value: string;
    onChange: (v: string) => void;
    type?: string;
    placeholder?: string;
    required?: boolean;
    maxLength?: number;
}) {
    return (
        <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            required={required}
            placeholder={placeholder}
            maxLength={maxLength}
            className="h-11 w-full rounded-2xl border border-black/15 bg-white px-4 text-sm text-black outline-none focus:border-black"
            style={{ fontFamily: '"Toyota Type"' }}
        />
    );
}

function Checkbox({ checked, onChange, label, required }: { checked: boolean; onChange: (v: boolean) => void; label: string; required?: boolean }) {
    return (
        <label className="flex items-start gap-3 text-sm text-black" style={{ fontFamily: '"Toyota Type"' }}>
            <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} required={required} className="mt-1 size-4 shrink-0" />
            <span>{label}</span>
        </label>
    );
}

function RadioCard({ name, value, checked, label, onChange }: {
    name: string;
    value: string;
    checked: boolean;
    label: string;
    onChange: () => void;
}) {
    return (
        <label className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-xs transition ${checked ? 'border-black bg-black text-white' : 'border-black/15 bg-white text-black hover:border-black/40'}`} style={{ fontFamily: '"Toyota Type"' }}>
            <input type="radio" name={name} value={value} checked={checked} onChange={onChange} className="sr-only" />
            <span>{label}</span>
        </label>
    );
}
