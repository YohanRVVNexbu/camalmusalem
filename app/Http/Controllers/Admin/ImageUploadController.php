<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\SiteSettingsService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

/**
 * Subida de imágenes vía Base64 (JSON), no multipart.
 *
 * Motivo original: ModSecurity (regla OWASP 930110, Path Traversal) bloquea
 * con 403 los uploads multipart porque los bytes `../` aparecen
 * estadísticamente en cualquier binario. Base64 usa solo [A-Za-z0-9+/=] — sin
 * `.` — así que ese patrón nunca matchea.
 *
 * Formato del payload — SIN el prefijo `data:mime;base64,`: otra regla del
 * WAF (probablemente OWASP CRS, detección de payloads tipo "PHP object
 * injection"/data-URI) bloquea cualquier request cuyo body contenga el
 * substring literal `;base64,` o un MIME-type (`image/jpeg`), sin importar el
 * tamaño — confirmado con pruebas: 2KB con ese substring ya lo bloquea, 260KB
 * sin él pasa limpio. El WAF no devuelve 403 limpio: neutraliza la request
 * (Laravel la recibe como si fuera GET), lo que se veía como
 * "MethodNotAllowedHttpException" sin relación aparente con el body.
 * Por eso mandamos el base64 puro (`data`) y la extensión aparte (`ext`,
 * código corto tipo "jpg", nunca un MIME-type con "/").
 */
class ImageUploadController extends Controller
{
    public function store(Request $request, SiteSettingsService $settings)
    {
        $request->validate([
            'data' => ['required', 'string'],            // base64 puro, sin prefijo data URI
            'ext' => ['required', 'string', 'in:jpg,jpeg,png,webp'],
            'directory' => ['nullable', 'string', 'max:120'],
            'old_url' => ['nullable', 'string', 'max:500'],
        ]);

        $ext = $request->input('ext') === 'jpeg' ? 'jpg' : $request->input('ext');
        $binary = base64_decode($request->input('data'), true);
        if ($binary === false) {
            return response()->json(['error' => 'Base64 inválido.'], 422);
        }
        if (strlen($binary) > 50 * 1024 * 1024) {
            return response()->json(['error' => 'La imagen supera los 50 MB.'], 422);
        }

        // Directorio: solo caracteres seguros (sin `..`, sin esquemas raros).
        $directory = preg_replace('#[^A-Za-z0-9/_-]#', '', (string) $request->input('directory', 'paginas'));
        $directory = trim(str_replace('..', '', $directory), '/') ?: 'paginas';

        // Borrar la imagen anterior si se está reemplazando (deleteOldFile
        // protege los defaults para que nunca se borren).
        if ($request->filled('old_url')) {
            $settings->deleteOldFile($request->input('old_url'));
        }

        $name = Str::random(40).'.'.$ext;
        $path = $directory.'/'.$name;
        Storage::disk('public')->put($path, $binary);

        return response()->json(['url' => '/storage/'.$path]);
    }
}
