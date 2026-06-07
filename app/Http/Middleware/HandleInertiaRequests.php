<?php

namespace App\Http\Middleware;

use App\Enums\ArticleStatus;
use App\Enums\SecurityAgentApplicationStatus;
use App\Models\Article;
use App\Models\SecurityAgentApplication;
use App\Models\SecurityTip;
use App\Models\User;
use App\Seo\SeoPageRegistry;
use App\Support\BusinessLocation;
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
        $pageMeta = null;

        $registry = app(SeoPageRegistry::class);
        $pageFaqs = [];

        if ($this->shouldSharePageMeta($request)) {
            $pageMeta = $registry->resolve($request);
            $pageFaqs = $registry->faqsForPath($registry->canonicalPath($request));
        }

        return [
            ...parent::share($request),
            'pageMeta' => $pageMeta,
            'pageFaqs' => $pageFaqs,
            'name' => config('app.name'),
            'auth' => [
                'user' => $request->user() ? $this->formatAuthUser($request->user()) : null,
            ],
            'articlesPendingCount' => $request->user()?->isAdmin()
                ? Article::query()->where('status', ArticleStatus::PendingApproval)->count()
                : 0,
            'securityTipsPendingCount' => $request->user()?->isAdmin()
                ? SecurityTip::query()->where('status', ArticleStatus::PendingApproval)->count()
                : 0,
            'securityAgentApplicationsPendingCount' => $request->user()?->isAdmin()
                ? SecurityAgentApplication::query()->where('status', SecurityAgentApplicationStatus::Pending)->count()
                : 0,
            'featuredSecurityTips' => SecurityTip::query()
                ->published()
                ->where('featured', true)
                ->orderByDesc('published_at')
                ->limit(3)
                ->get()
                ->map(fn (SecurityTip $securityTip) => $securityTip->toPublicArray())
                ->values()
                ->all(),
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'superSecurite' => [
                'email' => config('super-securite.email'),
                'phone' => config('super-securite.phone'),
                'phone_secondary' => config('super-securite.phone_secondary'),
                'phone_href' => config('super-securite.phone_href'),
                'address' => config('super-securite.address'),
                'rccm' => config('super-securite.rccm'),
                'social' => config('super-securite.social'),
                'map' => [
                    ...BusinessLocation::coordinates(),
                    'embedUrl' => BusinessLocation::embedUrl(),
                    'directionsUrl' => BusinessLocation::directionsUrl(),
                ],
            ],
            'seo' => [
                'siteName' => config('seo.site_name'),
                'siteUrl' => rtrim((string) config('app.url'), '/'),
                'locale' => config('seo.locale'),
                'language' => config('seo.language'),
                'twitterSite' => config('seo.twitter_site'),
                'defaultImage' => url(config('seo.default_og_image')),
                'ogImage' => config('seo.og_image'),
                'geo' => config('seo.geo'),
                'sameAs' => array_values(array_filter([
                    config('super-securite.social.facebook'),
                    config('super-securite.social.twitter'),
                    config('super-securite.social.youtube'),
                    config('super-securite.social.instagram'),
                    config('super-securite.social.linkedin'),
                    config('super-securite.social.github'),
                ])),
                'services' => config('seo.services'),
                'knowsAbout' => config('seo.knows_about'),
                'organization' => [
                    'name' => config('seo.organization.name'),
                    'legalName' => config('seo.organization.legal_name'),
                    'alternateName' => config('seo.organization.alternate_name'),
                    'slogan' => config('seo.organization.slogan'),
                    'foundingDate' => config('seo.organization.founding_date'),
                    'founder' => config('seo.organization.founder'),
                    'founderJobTitle' => config('seo.organization.founder_job_title'),
                    'description' => config('seo.organization.description'),
                    'email' => config('super-securite.email'),
                    'phone' => config('super-securite.phone'),
                    'areaServed' => config('seo.organization.area_served'),
                    'addressCountry' => config('seo.organization.address_country'),
                    'addressLocality' => config('seo.organization.address_locality'),
                    'addressStreet' => config('seo.organization.address_street'),
                    'geoLatitude' => config('seo.organization.geo_latitude'),
                    'geoLongitude' => config('seo.organization.geo_longitude'),
                    'openingHours' => config('seo.organization.opening_hours'),
                    'rccm' => config('super-securite.rccm'),
                ],
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
            ],
            'tracking' => [
                'visitor_uuid' => $request->cookie('super_securite_vid'),
            ],
        ];
    }

    private function shouldSharePageMeta(Request $request): bool
    {
        if (! $request->isMethod('GET')) {
            return false;
        }

        $requestPath = '/'.ltrim($request->path(), '/');

        foreach (config('seo.robots_disallow', []) as $blockedPath) {
            $normalized = rtrim($blockedPath, '/');

            if ($requestPath === $normalized || str_starts_with($requestPath, $normalized.'/')) {
                return false;
            }
        }

        return true;
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
