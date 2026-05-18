# Camal Musalem — Notas para Claude

Concesionario Toyota Musalem (Región de Coquimbo, Chile). Sitio público + panel
administrativo. Stack:

- **Laravel 12** + **PHP 8.4** + **MySQL**
- **Inertia.js** (no API REST clásica)
- **React 19** + **TypeScript** + **Vite**
- **Tailwind CSS 4**
- **react-leaflet + Leaflet** (mapas con tiles CartoDB Voyager)
- **embla-carousel-react**, **react-day-picker**, **sonner** (toasts)

Dominio local: `camalmusalem.test`. Repo: `YohanRVVNexbu/camalmusalem` (rama `main`).

## Idioma y reglas operativas

- UI siempre en **español chileno**.
- **Después de CADA cambio frontend**: `npm run build`. No hay excepciones.
- Los precios se guardan **solo con dígitos** en BD (string o int). El formato
  CLP (`$18.990.000`) se aplica **solo al renderizar**, vía `formatCLP()` en
  [resources/js/lib/format.ts](resources/js/lib/format.ts).
- Los warnings P1005 del IDE sobre `Eloquent::where()` / `orderBy()` /
  `pluck()` son **falsos positivos** del plugin Laravel — no son errores reales.

## Estructura clave

### Frontend

- Páginas públicas: `resources/js/pages/*.tsx` (welcome, nuevos, seminuevos,
  contacto, nosotros, kinto, programas, noticias, shorts, valores-mantencion).
- Subrutas en carpetas: `pages/nuevos/{show,cotizar}.tsx`,
  `pages/seminuevos/{show,cotizar,compare}.tsx`,
  `pages/post-venta/{accesorios,accesorio-show,accesorio-cotizar,
  repuestos,repuesto-show,repuesto-cotizar,agendar-mantencion}.tsx`,
  `pages/noticias/show.tsx`.
- Componentes landing: `resources/js/components/landing/`
- Componentes admin: `resources/js/components/admin/`
- Hooks: `useIsMobile()` en `hooks/use-mobile.tsx`, `useInView()` en
  `hooks/use-in-view.ts`.
- Helpers media: [lib/media.ts](resources/js/lib/media.ts) con
  `isVideoUrl()` y `pickResponsiveImage(desktop, mobile, isMobile)`.

### Backend

- Controllers públicos: `app/Http/Controllers/` (PagesController,
  NuevosController, SeminuevosController, PostVentaController, HomeController,
  PrevencionDelitoController).
- Controllers admin: `app/Http/Controllers/Admin/`.
- Servicios: `app/Services/` (SiteSettingsService, CatalogPresenter,
  YouTubeService).
- Modelos: `app/Models/`.
- Middleware `HandleInertiaRequests`: comparte globalmente `branchesShared` y
  `contactCtaBanner` con TODAS las vistas — los controllers no tienen que
  pasarlos manualmente.

### Storage

- Imágenes uploaded por admin: `storage/app/public/` (servido vía
  `/storage/...`). Subdirectorios por sección: `home/`, `paginas/`, `branches/`,
  `seminuevos/`, etc.
- Defaults: `storage/app/public/defaults/` — `SiteSettingsService::deleteOldFile`
  protege estos archivos para que NUNCA se borren incluso si el admin
  reemplaza la imagen.

## Mantenedores admin (paneles CRUD)

Ruta base: `/admin`. Sidebar configurado en
[admin-sidebar.tsx](resources/js/components/admin/admin-sidebar.tsx).

| Mantenedor | Ruta | Notas |
|---|---|---|
| Vehículos nuevos | `/admin/vehicle-models` y `/admin/vehicle-versions` | Catálogo de venta |
| Seminuevos | `/admin/seminuevos` | Incluye campo `vu_code` único + `price` + `down_payment` (Precio con Financiamiento) |
| Arriendos KINTO | `/admin/rentals` | Vinculados a VehicleModel + branches |
| Accesorios | `/admin/accesorios` | |
| Merch | `/admin/merch` | |
| Repuestos | `/admin/repuestos` | |
| Noticias | `/admin/noticias` | TipTap editor + secciones tipadas |
| Marcas | `/admin/brands` | |
| **Sucursales** | `/admin/branches` | Con mapa Leaflet interactivo, lat/lng, geocoding Nominatim, imagen |
| **Formulario Mantención** | `/admin/formulario-mantencion` | Tabs: Servicios + Modelos de vehículo (independientes del catálogo) |
| Equipamiento (features) | `/admin/features` | |
| Listas editables (lookups) | `/admin/lookups` | body_type, drivetrain, powertrain_type, transmission_type |
| **Páginas** | `/admin/paginas` | Editor por página + sección |
| **Banner Contáctanos (global)** | `/admin/paginas/banner-cta` | Aparece en 9 vistas, una sola fuente |
| **Botón WhatsApp (flotante)** | `/admin/paginas/whatsapp` | Solo en home. Toggle + teléfono + mensaje pre-cargado |
| **Inicio** | `/admin/home` | Hero, About (vehículos), Features, Seminuevos, Programas, Shorts, Footer |

### Páginas administrables vía `/admin/paginas/`

Cada página tiene secciones independientes con flag `is_visible`:

- **Nuevos** (`nuevos_page`)
- **Kinto** (`kinto_hero`, `kinto_pasos`, `kinto_vehiculos`)
- **Nosotros** (`nosotros_hero`, `nosotros_historia`, `nosotros_mision`,
  `nosotros_vision`, `nosotros_equipo`, `nosotros_reconocimientos`)
- **Contacto** (`contacto_info`)
- **Programas** (`programas_hero`, `programas_grid`)
- **Noticias** (`noticias_hero`)
- **Shorts** (`shorts_hero`)
- **Seminuevos** (`seminuevos_hero`)
- **Repuestos** (`repuestos_hero`)
- **Accesorios** (`accesorios_hero`)
- **Mantención** (`mantencion_hero`)

## Convenciones importantes

### Visibilidad de secciones

Cada SiteSection tiene `is_visible: bool`. Los controllers públicos retornan
`null` cuando una sección está oculta, y las vistas envuelven el render con
`{section && (<Component ... />)}`. Implementado en TODOS los controllers
(PagesController, NuevosController, SeminuevosController, PostVentaController).
La home usa `SiteSection::getVisibleSections()` que ya filtra.

### Imágenes responsive

Casi todas las secciones tipo hero soportan **desktop + mobile** separados.
Convención:
- Campo principal: `hero_image`, `image`, `banner_image`, `form_image`, etc.
- Variante mobile: `hero_image_mobile`, `image_mobile`, etc. (siempre con
  sufijo `_mobile`).
- Componente admin reutilizable:
  [admin/paginas/_section.tsx → ResponsiveMediaField](resources/js/pages/admin/paginas/_section.tsx).
- Helper frontend: `pickResponsiveImage(desktop, mobile, isMobile)`.
- Fallback: si `mobile` está vacío, usa `desktop`.

### Redes sociales del footer

Catálogo en [lib/social-networks.tsx](resources/js/lib/social-networks.tsx)
con 10 redes (Instagram, Facebook, X, TikTok, YouTube, LinkedIn, WhatsApp,
Pinterest, Threads, Telegram), cada una con su ícono SVG. El admin del footer
permite **agregar/quitar** dinámicamente desde un dropdown.

### Mapas (Leaflet + CartoDB Voyager)

Componente reutilizable
[components/landing/branch-map.tsx](resources/js/components/landing/branch-map.tsx)
para mostrar una sucursal con pin Toyota rojo (`#EB0A1E`) anchored al
bottom-center. Tiles CartoDB Voyager (`{s}.basemaps.cartocdn.com/rastertiles/voyager`).

Admin picker:
[components/admin/branch-map-picker.tsx](resources/js/components/admin/branch-map-picker.tsx)
permite buscar dirección (Nominatim API), click para colocar pin, arrastrar
para ajustar. Auto-genera `maps_url` formato `https://www.google.com/maps?q=lat,lng`.

Usado en:
- Kinto público (paso 1 del formulario)
- Mantención público (paso 1 — "Servicio y horario")
- Branches admin form

### Banner Contáctanos global

Componente [contact-cta-banner.tsx](resources/js/components/landing/contact-cta-banner.tsx).
Texto, botón, link e imagen (desktop+mobile) controlados desde
`/admin/paginas/banner-cta`. Compartido vía `HandleInertiaRequests` → todos
los controllers lo reciben automáticamente. Aparece en: programas, kinto,
seminuevos/show, nuevos/show, agendar-mantencion, accesorios, accesorio-show,
repuestos, repuesto-show.

### Visítanos en nuestras sucursales

[branches-section.tsx](resources/js/components/landing/branches-section.tsx)
lee de `branchesShared` (Inertia middleware). Renderiza un card por sucursal
activa con nombre, dirección, teléfonos, link a maps e imagen. **No recibe
imágenes desde afuera** — usa `branch.image_path` con fallback estático.

### Filtros, categorías destacadas, orden y paginación

Vistas `/nuevos` y `/seminuevos` tienen toolbar unificado
([toolbar.tsx](resources/js/components/seminuevos/toolbar.tsx)) con:
- Toggle mostrar/ocultar filtros
- Grid / list view
- **Selector "Mostrar 15/25/50/100"** por página (`PerPage` type)
- **Ordenar por**: precio asc/desc, año asc/desc, km asc

Filtros funcionales en seminuevos
([filters.tsx](resources/js/components/seminuevos/filters.tsx)):
controlado, opciones derivadas del data real (marcas, años, transmisiones,
combustibles, colores). Tiene botón "Limpiar" cuando hay filtros activos.

Categorías destacadas:
- **Seminuevos**: Camionetas, Híbridos, Eléctricos, Menos de $10mm, Año 2024+
- **Nuevos**: Camionetas, SUVs, Híbridos, Eléctricos

### Cards de producto responsive

[nuevos/product-card.tsx](resources/js/components/nuevos/product-card.tsx) y
[seminuevos/product-card.tsx](resources/js/components/seminuevos/product-card.tsx)
tienen **dos layouts hermanos**:
- Mobile: horizontal (imagen izq, contenido der) — altura fija `h-65`
- Desktop: vertical centrado — altura fija (`lg:h-90` nuevos, `lg:h-130`
  seminuevos)

Precio/CTA siempre al fondo del card con `mt-auto`. Título con `line-clamp-2`
para que nombres largos no rompan el alto.

### Modal 360 (Vehículos nuevos)

[components/nuevos/modal-360.tsx](resources/js/components/nuevos/modal-360.tsx)
bloquea scroll del body mientras está abierto (compensa scrollbar para evitar
saltos). Layout responsive: full-screen en mobile, max-w-250 en desktop.

### Indicador VU (seminuevos)

Campo `vu_code` en seminuevos. Editable desde admin (input de texto). En la
vista pública aparece como badge negro `VU · {codigo}` junto al título — solo
si el cliente ingresa un valor.

### PDF ficha técnica (nuevos)

Campo `datasheet_url` en `vehicle_models`. URL externa (Toyota oficial, Drive,
S3, etc.). Si está completa, en `nuevos/show.tsx` aparece el botón "Descargar
ficha técnica" (en el hero) que abre el PDF en pestaña nueva. Vacío = botón
oculto.

## Comparador de vehículos

Ruta `/seminuevos/comparar?ids=s-1,v-2` permite comparar **Seminuevos**
(`s-{id}`) y **Vehículos Nuevos** (`v-{version_id}`) en una misma tabla.

### Service unificado

[VehiculoComparadorService](app/Services/VehiculoComparadorService.php)
normaliza ambos tipos al mismo shape:

```php
[
    'id'        => 's-1' | 'v-2',         // identificador unificado
    'tipo'      => 'seminuevo' | 'nuevo',
    'estado'    => 'Semi Nuevo' | 'Nuevo',
    'brand', 'model', 'version', 'year', 'price',
    'image', 'slug', 'href',
    'km', 'transmision_short', 'fuel_short',
    'specs'     => ['Potencia' => '140 hp @ 6200 rpm', ...],
    'equipment' => ['Bluetooth' => 'Sí', ...],
]
```

Métodos:
- `resolve($unifiedId)` — `"s-1"` o `"v-2"` → array normalizado (o `null`).
- `resolveMany($csv)` — `"s-1,v-2"` → array. Filtra silenciosamente IDs
  inválidos.
- `catalogo()` — todo el stock disponible (Seminuevos `is_visible=true` +
  VehicleVersions `is_active=true`) en versión compacta sin specs completos,
  para que el modal arme los dropdowns.

Constante `SECTIONS` define las 6 secciones de la tabla con sus labels. **Las
labels son la "clave"** que el frontend usa para buscar en
`vehicle.specs[label]` — deben matchear exactamente con los keys que devuelve
cada mapper.

### Controller y frontend

`SeminuevosController::compare()` retorna `preselected`, `catalog`, `sections`,
`footer`. Si `?ids` está vacío, `preselected = []` y arranca en modo "elegir
vehículos".

[compare.tsx](resources/js/pages/seminuevos/compare.tsx) es 100% data-driven:
- Filtros del modal (Estado / Marca / Modelo / Versión) se calculan desde
  `catalog` con `useMemo` — no hay valores hardcoded.
- Sección "Equipamiento" tiene labels dinámicas: **unión** de keys de los
  vehículos seleccionados (vehículos sin esa feature muestran `—`).
- Al comparar, navega vía `router.visit('/seminuevos/comparar?ids=...')` —
  server-render trae specs completos.
- Cambios de selección actualizan la URL `?ids=...` (sharing-friendly).

### Botones "Comparar" en show

- **Seminuevos** ([seminuevos/show.tsx](resources/js/pages/seminuevos/show.tsx)):
  href `?ids=s-${seminuevo.id}` (2 botones — mobile + desktop).
- **Nuevos** ([nuevos/show.tsx](resources/js/pages/nuevos/show.tsx)): por
  ahora navegan al comparador SIN preselect porque la página sigue siendo mock
  (`vehicleData` inline). Cuando se conecte al backend, cambiar href a
  `?ids=v-${ver.id}` (hay TODO marcado en el JSX).

### Campos del admin

[admin/vehicle-versions/form.tsx](resources/js/pages/admin/vehicle-versions/form.tsx)
ya tiene **todos los campos** que la comparación necesita (engine,
performance, dimensions, chassis, fuel, transmission, traction, etc.). El
cliente solo necesita completarlos por vehículo.

Equipamiento por tipo:
- **Seminuevos**: campo `specs.equipment[]` (JSON con `{label, value}`)
  editable en admin de seminuevos.
- **Nuevos**: relación `BelongsToMany` con `Feature` → cada feature aporta
  `name_es` como label.

### Pendientes del comparador

1. Posible refactor de ruta a `/comparar` (porque compara también Nuevos) con
   redirect 301 desde `/seminuevos/comparar`.
2. Botón "Compartir" en el header no hace nada todavía — sugerencia:
   `navigator.share({url})` con fallback `navigator.clipboard.writeText`. La
   URL ya es sharing-friendly porque el estado vive en `?ids=...`.
3. Si querés mostrar error 404 cuando se pasa un id inválido, hay que cambiar
   la política de `resolveMany` (hoy filtra silenciosamente).

## Lista de tareas del cliente

Ver [musalem-tareas.csv](musalem-tareas.csv) — checklist importable a Google
Sheets para tracking.

## Comandos comunes

```bash
# Frontend
npm run build              # OBLIGATORIO después de cada cambio frontend
npm run dev                # Vite dev server con HMR

# Backend
php artisan migrate         # Migrar
php artisan tinker         # REPL
php artisan route:list      # Ver rutas
php artisan optimize:clear  # Limpiar cache
```

## Convenciones de commits

Los mensajes son cortos en español y describen el "qué" + "por qué". Cuando
agrego un commit Co-Authored-By, uso "Claude Opus 4.7 (1M context)".
