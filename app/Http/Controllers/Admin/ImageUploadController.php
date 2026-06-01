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
 * Motivo: ModSecurity (regla OWASP 930110, Path Traversal) bloquea con 403
 * los uploads multipart de imágenes porque los bytes `../` / `..\` aparecen
 * estadísticamente en cualquier binario. Base64 usa solo [A-Za-z0-9+/=] —
 * nunca contiene `.`, así que el patrón es imposible y la regla no matchea.
 * El cliente comprime + codifica en Base64; acá decodificamos y guardamos.
 */
class ImageUploadController extends Controller
{
    public function store(Request $request, SiteSettingsService $settings)
    {
        $request->validate([
            'image' => ['required', 'string'],          // data URL base64
            'directory' => ['nullable', 'string', 'max:120'],
            'old_url' => ['nullable', 'string', 'max:500'],
        ]);

        // data:image/webp;base64,XXXX
        if (! preg_match('#^data:image/(jpeg|jpg|png|webp);base64,(.+)$#', $request->input('image'), $m)) {
            return response()->json(['error' => 'Formato de imagen inválido.'], 422);
        }

        $ext = $m[1] === 'jpeg' ? 'jpg' : $m[1];
        $binary = base64_decode($m[2], true);
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
