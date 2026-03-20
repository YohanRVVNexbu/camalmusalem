<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use Symfony\Component\HttpFoundation\Response;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $request->user(),
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'flash' => [
                'success' => $request->session()->get('success'),
                'error' => $request->session()->get('error'),
            ],
        ];
    }

    /**
     * Rewrite storage URLs to match the current host (fixes ngrok/proxy access).
     */
    public function handle(Request $request, \Closure $next): Response
    {
        $response = parent::handle($request, $next);

        $currentHost = $request->getSchemeAndHttpHost();
        $localUrl = config('app.url');

        if ($currentHost !== $localUrl) {
            $content = $response->getContent();
            if ($content) {
                $response->setContent(
                    str_replace(
                        [str_replace('/', '\/', $localUrl), $localUrl],
                        [str_replace('/', '\/', $currentHost), $currentHost],
                        $content
                    )
                );
            }
        }

        return $response;
    }
}
