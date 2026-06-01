<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BodyType;
use App\Models\Brand;
use App\Models\VehicleModel;
use App\Services\SiteSettingsService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Throwable;

class VehicleModelController extends Controller
{
    public function __construct(private SiteSettingsService $settings) {}

    public function index()
    {
        $models = VehicleModel::with('brand')
            ->withCount('versions')
            ->orderBy('display_order')
            ->orderBy('name')
            ->get();

        return Inertia::render('admin/vehicle-models/index', [
            'models' => $models,
            'bodyTypes' => $this->bodyTypes(),
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/vehicle-models/form', [
            'model' => null,
            'brands' => Brand::where('is_active', true)->orderBy('name')->get(['id', 'name']),
            'bodyTypes' => $this->bodyTypes(),
        ]);
    }

    private function bodyTypes(): array
    {
        return BodyType::where('is_active', true)
            ->orderBy('display_order')
            ->pluck('name_es', 'code')
            ->all();
    }

    public function store(Request $request)
    {
        $data = $this->validated($request);
        $data['slug'] = Str::slug($data['name']);
        unset($data['datasheet_file']);
        $data['shorts'] = $this->normalizeShorts($data['shorts'] ?? []);

        $detailContent = $this->resolveDetailContent($request, null);
        if ($detailContent !== null) {
            $data['detail_content'] = $detailContent;
        }

        $model = VehicleModel::create($data);

        if ($request->hasFile('hero_image')) {
            $model->update([
                'hero_image' => $this->settings->uploadFile($request->file('hero_image'), 'vehicle-models/'.$model->id),
            ]);
        }

        if ($request->hasFile('detail_hero_image')) {
            $model->update([
                'detail_hero_image' => $this->settings->uploadFile($request->file('detail_hero_image'), 'vehicle-models/'.$model->id),
            ]);
        }

        if ($request->hasFile('datasheet_file')) {
            $model->update([
                'datasheet_file' => $this->settings->uploadFile($request->file('datasheet_file'), 'vehicle-models/'.$model->id.'/datasheets'),
            ]);
        }

        $this->processDetailUploads($request, $model);

        if ($request->boolean('add_version_after')) {
            return redirect('/admin/vehicle-versions/create?model_id='.$model->id)
                ->with('success', 'Vehículo creado. Ahora agrega su ficha técnica.');
        }

        return redirect('/admin/vehicle-models')->with('success', 'Vehículo creado correctamente.');
    }

    public function edit(VehicleModel $vehicleModel)
    {
        $vehicleModel->load(['versions' => fn ($q) => $q->orderBy('display_order')->orderBy('model_year', 'desc')]);

        return Inertia::render('admin/vehicle-models/form', [
            'model' => $vehicleModel,
            'brands' => Brand::where('is_active', true)->orderBy('name')->get(['id', 'name']),
            'bodyTypes' => $this->bodyTypes(),
            'versions' => $vehicleModel->versions->map(fn ($v) => [
                'id' => $v->id,
                'trim_name' => $v->trim_name,
                'model_year' => $v->model_year,
                'powertrain_type' => $v->powertrain_type,
                'drivetrain' => $v->drivetrain,
                'msrp_clp' => $v->msrp_clp,
                'is_active' => $v->is_active,
            ]),
        ]);
    }

    public function update(Request $request, VehicleModel $vehicleModel)
    {
        $data = $this->validated($request);
        $data['slug'] = Str::slug($data['name']);
        unset($data['datasheet_file']);
        $data['shorts'] = $this->normalizeShorts($data['shorts'] ?? []);

        if ($request->hasFile('hero_image')) {
            $this->settings->deleteOldFile($vehicleModel->hero_image);
            $data['hero_image'] = $this->settings->uploadFile($request->file('hero_image'), 'vehicle-models/'.$vehicleModel->id);
        } elseif ($request->boolean('hero_image_remove')) {
            $this->settings->deleteOldFile($vehicleModel->hero_image);
            $data['hero_image'] = null;
        }

        if ($request->hasFile('detail_hero_image')) {
            $this->settings->deleteOldFile($vehicleModel->detail_hero_image);
            $data['detail_hero_image'] = $this->settings->uploadFile($request->file('detail_hero_image'), 'vehicle-models/'.$vehicleModel->id);
        } elseif ($request->boolean('detail_hero_image_remove')) {
            $this->settings->deleteOldFile($vehicleModel->detail_hero_image);
            $data['detail_hero_image'] = null;
        }

        if ($request->hasFile('datasheet_file')) {
            $this->settings->deleteOldFile($vehicleModel->datasheet_file);
            $data['datasheet_file'] = $this->settings->uploadFile($request->file('datasheet_file'), 'vehicle-models/'.$vehicleModel->id.'/datasheets');
        } elseif ($request->boolean('datasheet_file_remove')) {
            $this->settings->deleteOldFile($vehicleModel->datasheet_file);
            $data['datasheet_file'] = null;
        }

        $detailContent = $this->resolveDetailContent($request, $vehicleModel);
        if ($detailContent !== null) {
            $data['detail_content'] = $detailContent;
        }

        $vehicleModel->update($data);

        $this->processDetailUploads($request, $vehicleModel);

        return back()->with('success', 'Vehículo actualizado correctamente.');
    }

    /**
     * Sube UNA foto del visor 360 a un color específico.
     *
     * Endpoint separado del store/update para evitar el problema del
     * límite `MaxReqBodySize` del LiteSpeed Web Server. En vez de mandar
     * 12 fotos en un único POST gigante (que LSWS rechaza con 403 si
     * supera ~10 MB), el frontend hace 12 POSTs chicos secuenciales,
     * cada uno con una sola foto.
     *
     * Solo guarda el archivo en storage y devuelve la URL pública.
     * NO actualiza el `detail_content` del modelo — eso lo hace el form
     * general al guardar (porque el orden de las fotos puede cambiar y
     * la verdad del orden vive en el state de React hasta el submit).
     */
    public function uploadPhoto360(Request $request, VehicleModel $vehicleModel)
    {
        // ID corto para rastrear este request en logs cuando hay batches.
        $reqId = Str::random(6);
        $startMs = microtime(true);

        Log::info("[photo360 {$reqId}] START", [
            'vehicle_model_id' => $vehicleModel->id,
            'memory_mb' => round(memory_get_usage(true) / 1024 / 1024, 1),
            'memory_peak_mb' => round(memory_get_peak_usage(true) / 1024 / 1024, 1),
            'has_file' => $request->hasFile('file'),
            'file_size_kb' => $request->hasFile('file') ? round($request->file('file')->getSize() / 1024, 1) : null,
            'file_mime' => $request->hasFile('file') ? $request->file('file')->getMimeType() : null,
            'session_id_short' => substr($request->session()->getId(), 0, 8),
        ]);

        try {
            $request->validate([
                'file' => ['required', 'file', 'image', 'max:51200'], // 50 MB
            ]);
            Log::info("[photo360 {$reqId}] validated", ['elapsed_ms' => round((microtime(true) - $startMs) * 1000)]);

            // Liberamos el session lock antes de tocar disco. El driver
            // `database` de Laravel mantiene la fila locked durante todo el
            // request — si subimos varias fotos rápido, los siguientes se
            // quedan esperando ese lock.
            $request->session()->save();
            Log::info("[photo360 {$reqId}] session saved", ['elapsed_ms' => round((microtime(true) - $startMs) * 1000)]);

            // Guardamos el archivo TAL CUAL viene del cliente, sin pasar por
            // SiteSettingsService::optimize. El JS ya hace compresión
            // adaptativa con WebP (resources/js/lib/image-compress.ts) y manda
            // archivos ≤ 5 MB.
            $file = $request->file('file');
            $extension = strtolower($file->getClientOriginalExtension() ?: ($file->guessExtension() ?? 'webp'));
            $name = Str::random(40).'.'.$extension;
            $directory = 'vehicle-models/'.$vehicleModel->id;

            $beforeStoreMs = microtime(true);
            $path = $file->storeAs($directory, $name, 'public');
            $storeElapsed = round((microtime(true) - $beforeStoreMs) * 1000);

            Log::info("[photo360 {$reqId}] OK", [
                'path' => $path,
                'extension' => $extension,
                'store_ms' => $storeElapsed,
                'total_ms' => round((microtime(true) - $startMs) * 1000),
                'memory_after_mb' => round(memory_get_usage(true) / 1024 / 1024, 1),
                'memory_peak_after_mb' => round(memory_get_peak_usage(true) / 1024 / 1024, 1),
            ]);

            return response()->json([
                'url' => '/storage/'.$path,
                'debug_request_id' => $reqId,
            ]);
        } catch (Throwable $e) {
            Log::error("[photo360 {$reqId}] FAILED", [
                'exception' => get_class($e),
                'message' => $e->getMessage(),
                'file' => $e->getFile() . ':' . $e->getLine(),
                'total_ms' => round((microtime(true) - $startMs) * 1000),
                'memory_mb' => round(memory_get_usage(true) / 1024 / 1024, 1),
            ]);
            throw $e;
        }
    }

    /**
     * Sube UN archivo (video o imagen) de la sección Multimedia.
     *
     * Mismo patrón que uploadPhoto360: endpoint dedicado, un archivo por
     * request, devuelve la URL. El form principal después solo manda las
     * URLs como texto, evitando que un video pesado rompa el MaxReqBodySize
     * del LSWS si fuera en el POST grande.
     *
     * Los videos NO se optimizan (Intervention no procesa video). Las
     * imágenes ya vienen comprimidas del cliente. Guardamos tal cual.
     */
    public function uploadMedia(Request $request, VehicleModel $vehicleModel)
    {
        $request->validate([
            'file' => ['required', 'file', 'mimes:jpg,jpeg,png,webp,mp4,webm,mov,m4v', 'max:153600'], // 150 MB
        ]);

        $request->session()->save();

        $file = $request->file('file');
        $extension = strtolower($file->getClientOriginalExtension() ?: ($file->guessExtension() ?? 'bin'));
        $name = Str::random(40).'.'.$extension;
        $directory = 'vehicle-models/'.$vehicleModel->id.'/multimedia';
        $path = $file->storeAs($directory, $name, 'public');

        return response()->json([
            'url' => '/storage/'.$path,
            'is_video' => in_array($extension, ['mp4', 'webm', 'mov', 'm4v'], true),
        ]);
    }

    public function destroy(VehicleModel $vehicleModel)
    {
        if ($vehicleModel->versions()->exists()) {
            return back()->with('error', 'No se puede eliminar: el modelo tiene versiones asociadas.');
        }

        $this->settings->deleteOldFile($vehicleModel->hero_image);
        $this->settings->deleteOldFile($vehicleModel->detail_hero_image);
        $this->settings->deleteOldFile($vehicleModel->datasheet_file);
        $vehicleModel->delete();

        return redirect('/admin/vehicle-models')->with('success', 'Modelo eliminado.');
    }

    private function validated(Request $request): array
    {
        return $request->validate([
            'brand_id' => ['required', 'exists:brands,id'],
            'name' => ['required', 'string', 'max:255'],
            'body_type' => ['nullable', 'string', 'exists:body_types,code'],
            'segment' => ['nullable', 'string', 'max:100'],
            'generation' => ['nullable', 'string', 'max:100'],
            'description' => ['nullable', 'string'],
            'datasheet_url' => ['nullable', 'url', 'max:500'],
            'datasheet_file' => ['nullable', 'file', 'mimes:pdf', 'max:20480'],
            'is_active' => ['boolean'],
            'display_order' => ['integer'],
            // Shorts específicos del vehículo: lista de { url, thumbnail }.
            'shorts' => ['nullable', 'array'],
            'shorts.*.url' => ['nullable', 'string', 'max:500'],
            'shorts.*.thumbnail' => ['nullable', 'string', 'max:500'],
        ]);
    }

    /**
     * Limpia la lista de shorts: solo items con url no vacía, preservando
     * el orden. thumbnail puede ser null (YouTube genera la suya sola).
     */
    private function normalizeShorts(array $items): array
    {
        $out = [];
        foreach ($items as $it) {
            $url = $it['url'] ?? null;
            if (is_string($url) && $url !== '') {
                $out[] = [
                    'url' => $url,
                    'thumbnail' => (isset($it['thumbnail']) && $it['thumbnail'] !== '') ? $it['thumbnail'] : null,
                ];
            }
        }
        return $out;
    }

    /**
     * Normaliza el detail_content enviado, preservando URLs de imagen
     * existentes si no se suben nuevos archivos.
     */
    private function resolveDetailContent(Request $request, ?VehicleModel $existing): ?array
    {
        if (! $request->has('detail_content')) {
            return null;
        }

        $payload = $request->input('detail_content', []);
        $stored = $existing?->detail_content ?? [];

        $highlights = $payload['highlights'] ?? [];
        $normalizedHighlights = [];
        foreach ($highlights as $i => $h) {
            $normalizedHighlights[] = [
                'image' => $h['image'] ?? ($stored['highlights'][$i]['image'] ?? null),
                'title' => $h['title'] ?? '',
                'text' => $h['text'] ?? '',
            ];
        }

        $colors = $payload['viewer_360']['colors'] ?? [];
        $normalizedColors = [];
        foreach ($colors as $i => $c) {
            $normalizedColors[] = [
                'name' => $c['name'] ?? '',
                'hex' => $c['hex'] ?? null,
                'photos' => $c['photos'] ?? ($stored['viewer_360']['colors'][$i]['photos'] ?? []),
            ];
        }

        $textBlocks = $payload['viewer_360']['text_blocks'] ?? [];
        $normalizedBlocks = [];
        foreach ($textBlocks as $b) {
            $normalizedBlocks[] = [
                'key' => $b['key'] ?? Str::slug($b['title'] ?? '', '_'),
                'title' => $b['title'] ?? '',
                'text' => $b['text'] ?? '',
            ];
        }

        // Multimedia: video (URL única) + imágenes (lista de URLs). Las URLs
        // llegan ya subidas vía el endpoint uploadMedia, así que solo las
        // preservamos. Filtramos vacíos para no guardar slots sucios.
        $mediaImages = array_values(array_filter(
            $payload['multimedia']['images'] ?? ($stored['multimedia']['images'] ?? []),
            fn ($url) => is_string($url) && $url !== '',
        ));
        $mediaVideo = $payload['multimedia']['video'] ?? ($stored['multimedia']['video'] ?? null);
        $mediaVideo = is_string($mediaVideo) && $mediaVideo !== '' ? $mediaVideo : null;

        return [
            'hero' => [
                'tagline' => $payload['hero']['tagline'] ?? $stored['hero']['tagline'] ?? 'Desde',
                'description' => $payload['hero']['description'] ?? $stored['hero']['description'] ?? '',
            ],
            'highlights' => $normalizedHighlights,
            'viewer_360' => [
                'heading' => $payload['viewer_360']['heading'] ?? ($stored['viewer_360']['heading'] ?? ''),
                'colors' => $normalizedColors,
                'text_blocks' => $normalizedBlocks,
            ],
            'multimedia' => [
                'video' => $mediaVideo,
                'images' => $mediaImages,
            ],
        ];
    }

    /**
     * Procesa uploads anidados bajo detail_content.* y reemplaza la URL
     * resultante en el JSON.
     *
     * El frontend envía los archivos con bracket-notation
     *   (`detail_content[viewer_360][colors][0][photos][0]`)
     * porque PHP convierte los puntos en nombres multipart a underscores,
     * lo que rompía el matching. Aquí aplanamos el array nested con
     * Arr::dot() para volver a la dot-notation que necesita `data_set()`.
     */
    private function processDetailUploads(Request $request, VehicleModel $model): void
    {
        $detail = $model->detail_content ?? [];
        $touched = false;

        // Subir un set completo de fotos 360 (típicamente 10) puede
        // exceder el memory_limit del LSAPI/FPM aunque el cPanel diga otro
        // valor (porque el .user.ini no siempre aplica al handler de
        // upload). Aseguramos un margen amplio aquí, antes de procesar la
        // primera imagen. `SiteSettingsService::optimize()` también lo
        // setea por si el servicio se usa fuera de este controller.
        ini_set('memory_limit', '1024M');
        @set_time_limit(300);

        // Tomamos solo los archivos bajo detail_content. allFiles() devuelve
        // un array anidado; Arr::dot() lo aplana a 'detail_content.viewer_360...'.
        $detailFiles = \Illuminate\Support\Arr::dot([
            'detail_content' => $request->allFiles()['detail_content'] ?? [],
        ]);

        foreach ($detailFiles as $key => $file) {
            if (! $file instanceof \Illuminate\Http\UploadedFile) {
                continue;
            }

            $path = substr($key, strlen('detail_content.'));
            $oldUrl = data_get($detail, $path);
            $this->settings->deleteOldFile($oldUrl);

            // Las fotos del visor 360° (viewer_360.colors.*.photos.*) se
            // suben SIN redimensionar — el usuario rota la galería y se
            // notan detalles. El resto (highlights, hero, etc.) se
            // redimensiona normal porque son imágenes estáticas.
            $preserveSize = str_starts_with($path, 'viewer_360.colors.')
                && str_contains($path, '.photos.');

            $url = $this->settings->uploadFile(
                $file,
                'vehicle-models/'.$model->id,
                preserveSize: $preserveSize,
            );

            data_set($detail, $path, $url);
            $touched = true;
        }

        if ($touched) {
            $model->update(['detail_content' => $detail]);
        }
    }
}
