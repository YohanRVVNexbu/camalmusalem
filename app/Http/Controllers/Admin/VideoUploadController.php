<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\SiteSettingsService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

/**
 * Subida de videos vía Base64 (JSON), no multipart.
 *
 * El proxy de Cloudflare (plan Free/Pro) corta cualquier request mayor a
 * 100 MB. Cuando el form principal mandaba todos los videos juntos como
 * multipart, sumaban fácilmente más de 100 MB y Cloudflare respondía 413.
 *
 * Esta ruta recibe UN video por request → cada subida queda chica e
 * individual. Además, Base64 sortea el WAF (regla OWASP 930110) por la
 * misma razón que las imágenes: el alfabeto Base64 no contiene `.`, así
 * que el patrón `../` no aparece.
 */
class VideoUploadController extends Controller
{
    // Cloudflare corta en 100 MB. Dejamos un margen para el overhead Base64
    // (~33%) y headers — aceptamos hasta 70 MB de binario real.
    private const MAX_BYTES = 70 * 1024 * 1024;

    public function store(Request $request, SiteSettingsService $settings)
    {
        $request->validate([
            'video' => ['required', 'string'],
            'directory' => ['nullable', 'string', 'max:120'],
            'old_url' => ['nullable', 'string', 'max:500'],
        ]);

        if (! preg_match('#^data:video/(mp4|webm|quicktime|ogg);base64,(.+)$#', $request->input('video'), $m)) {
            return response()->json(['error' => 'Formato de video inválido. Usa MP4, WebM, MOV u OGG.'], 422);
        }

        $ext = match ($m[1]) {
            'mp4' => 'mp4',
            'webm' => 'webm',
            'quicktime' => 'mov',
            'ogg' => 'ogv',
        };

        $binary = base64_decode($m[2], true);
        if ($binary === false) {
            return response()->json(['error' => 'Base64 inválido.'], 422);
        }
        if (strlen($binary) > self::MAX_BYTES) {
            return response()->json(['error' => 'El video supera los 70 MB. Comprimilo a menor bitrate antes de subirlo.'], 422);
        }

        $directory = preg_replace('#[^A-Za-z0-9/_-]#', '', (string) $request->input('directory', 'videos'));
        $directory = trim(str_replace('..', '', $directory), '/') ?: 'videos';

        if ($request->filled('old_url')) {
            $settings->deleteOldFile($request->input('old_url'));
        }

        $name = Str::random(40).'.'.$ext;
        $path = $directory.'/'.$name;
        Storage::disk('public')->put($path, $binary);

        return response()->json(['url' => '/storage/'.$path]);
    }
}
