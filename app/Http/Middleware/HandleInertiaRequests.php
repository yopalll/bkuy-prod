<?php

namespace App\Http\Middleware;

use App\Models\SiteInfo;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'ziggy' => fn () => [...(new \Tighten\Ziggy\Ziggy)->toArray(), 'location' => $request->url()],
            'auth' => [
                'user' => $request->user() ? [
                    'id' => $request->user()->id,
                    'name' => $request->user()->name,
                    'email' => $request->user()->email,
                    'role' => $request->user()->role,
                    'photo' => $request->user()->photo,
                    'email_verified_at' => $request->user()->email_verified_at,
                ] : null,
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
                'info' => fn () => $request->session()->get('info'),
                'warning' => fn () => $request->session()->get('warning'),
            ],
            'unreadNotificationsCount' => fn () => $request->user()
                ? $request->user()->unreadNotifications()->count()
                : 0,
            'siteInfo' => fn () => SiteInfo::pluck('value', 'key')
                ->only(['site_name', 'tagline', 'logo', 'logo_rocket', 'logo_text_image', 'favicon', 'footer_text', 'facebook', 'instagram', 'twitter', 'youtube', 'email', 'phone', 'address'])
                ->toArray(),
        ];
    }
}
