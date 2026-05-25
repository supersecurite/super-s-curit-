<?php

namespace App\Http\Middleware;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Middleware;

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
                'user' => $request->user() ? $this->formatAuthUser($request->user()) : null,
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'aristech' => [
                'email' => config('aristech.email'),
                'phone' => config('aristech.phone'),
                'phone_href' => config('aristech.phone_href'),
                'social' => config('aristech.social'),
            ],
            'seo' => [
                'siteName' => config('seo.site_name'),
                'siteUrl' => rtrim((string) config('app.url'), '/'),
                'locale' => config('seo.locale'),
                'language' => config('seo.language'),
                'twitterSite' => config('seo.twitter_site'),
                'defaultImage' => url(config('seo.default_og_image')),
                'organization' => [
                    'name' => config('seo.organization.name'),
                    'legalName' => config('seo.organization.legal_name'),
                    'founder' => config('seo.organization.founder'),
                    'description' => config('seo.organization.description'),
                    'email' => config('aristech.email'),
                    'phone' => config('aristech.phone'),
                    'areaServed' => config('seo.organization.area_served'),
                    'addressCountry' => config('seo.organization.address_country'),
                ],
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
            ],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function formatAuthUser(User $user): array
    {
        return [
            'id' => $user->id,
            'uuid' => $user->uuid,
            'name' => $user->name,
            'email' => $user->email,
            'phone' => $user->phone,
            'role' => $user->role->value,
            'role_label' => $user->role->label(),
            'is_admin' => $user->isAdmin(),
            'email_verified_at' => $user->email_verified_at,
            'two_factor_enabled' => $user->two_factor_secret !== null,
            'created_at' => $user->created_at,
            'updated_at' => $user->updated_at,
        ];
    }
}
