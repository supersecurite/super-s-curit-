<?php

namespace App\Seo;

use App\Support\BusinessLocation;
use Illuminate\Http\Request;

class StructuredDataBuilder
{
    public function __construct(private SeoPageRegistry $registry) {}

    /**
     * @return array<string, mixed>
     */
    public function build(Request $request): array
    {
        $siteUrl = rtrim((string) config('app.url'), '/');
        $path = $this->registry->canonicalPath($request);
        $canonical = $siteUrl.($path === '/' ? '/' : $path);
        $pageMeta = $this->registry->resolve($request);
        $organization = config('seo.organization');
        $orgId = "{$siteUrl}/#organization";
        $businessId = "{$siteUrl}/#business";
        $websiteId = "{$siteUrl}/#website";
        $webpageId = "{$canonical}#webpage";
        $services = config('seo.services', []);
        $defaultImage = url(config('seo.default_og_image'));
        $email = config('super-securite.email');
        $phone = config('super-securite.phone');

        $graph = [
            $this->organizationNode($siteUrl, $orgId, $defaultImage, $organization, $email, $phone),
            $this->professionalServiceNode($siteUrl, $businessId, $orgId, $defaultImage, $organization, $email, $phone, $services),
            $this->websiteNode($siteUrl, $websiteId, $orgId),
            $this->servicesItemListNode($siteUrl, $services, $orgId),
            $this->webPageNode($canonical, $webpageId, $websiteId, $orgId, $pageMeta),
            $this->breadcrumbNode($canonical, $webpageId, $siteUrl, $path, $services),
        ];

        $faqs = $this->registry->faqsForPath($path);

        if ($faqs !== []) {
            $graph[] = $this->faqPageNode($canonical, $faqs);
        }

        if (! empty($organization['founder'])) {
            array_splice($graph, 1, 0, [$this->founderNode($siteUrl, $orgId, $organization)]);
        }

        if ($path === '/contact') {
            $graph[] = $this->placeNode($siteUrl, $organization);
        }

        return [
            '@context' => 'https://schema.org',
            '@graph' => array_values(array_filter($graph)),
        ];
    }

    /**
     * @param  array<string, mixed>  $organization
     * @return array<string, mixed>
     */
    private function organizationNode(
        string $siteUrl,
        string $orgId,
        string $defaultImage,
        array $organization,
        string $email,
        string $phone,
    ): array {
        $sameAs = array_values(array_filter([
            config('super-securite.social.facebook'),
            config('super-securite.social.twitter'),
            config('super-securite.social.youtube'),
            config('super-securite.social.instagram'),
            config('super-securite.social.linkedin'),
            config('super-securite.social.github'),
        ]));

        $node = [
            '@type' => 'Organization',
            '@id' => $orgId,
            'name' => $organization['name'],
            'legalName' => $organization['legal_name'],
            'alternateName' => $organization['alternate_name'],
            'slogan' => $organization['slogan'],
            'foundingDate' => $organization['founding_date'],
            'url' => $siteUrl,
            'logo' => [
                '@type' => 'ImageObject',
                '@id' => "{$siteUrl}/#logo",
                'url' => $defaultImage,
                'caption' => "{$organization['name']} — sécurité privée",
            ],
            'image' => [
                '@type' => 'ImageObject',
                'url' => $defaultImage,
            ],
            'description' => $organization['description'],
            'email' => $email,
            'telephone' => $phone,
            'contactPoint' => $this->contactPoints($email, $phone, $siteUrl),
            'areaServed' => [
                [
                    '@type' => 'Country',
                    'name' => 'Guinée',
                ],
                [
                    '@type' => 'AdministrativeArea',
                    'name' => 'Conakry',
                ],
            ],
            'address' => [
                '@type' => 'PostalAddress',
                'streetAddress' => $organization['address_street'],
                'addressLocality' => $organization['address_locality'],
                'addressCountry' => $organization['address_country'],
            ],
            'hasMap' => BusinessLocation::directionsUrl(),
        ];

        $rccm = config('super-securite.rccm');

        if ($rccm) {
            $node['identifier'] = [
                '@type' => 'PropertyValue',
                'name' => 'RCCM',
                'value' => $rccm,
            ];
        }

        if ($sameAs !== []) {
            $node['sameAs'] = $sameAs;
        }

        $knowsAbout = config('seo.knows_about', []);

        if ($knowsAbout !== []) {
            $node['knowsAbout'] = $knowsAbout;
        }

        return $node;
    }

    /**
     * @param  array<string, mixed>  $organization
     * @return array<string, mixed>
     */
    private function founderNode(string $siteUrl, string $orgId, array $organization): array
    {
        return [
            '@type' => 'Person',
            '@id' => "{$siteUrl}/#founder",
            'name' => $organization['founder'],
            'jobTitle' => $organization['founder_job_title'],
            'worksFor' => ['@id' => $orgId],
            'url' => "{$siteUrl}/a-propos",
        ];
    }

    /**
     * @param  array<string, mixed>  $organization
     * @return array<string, mixed>
     */
    private function placeNode(string $siteUrl, array $organization): array
    {
        return [
            '@type' => 'Place',
            '@id' => "{$siteUrl}/contact#place",
            'name' => $organization['name'].' — '.$organization['address_locality'],
            'description' => 'Localisation des bureaux '.($organization['alternate_name'] ?? $organization['name']).' à Conakry.',
            'url' => "{$siteUrl}/contact#plan-acces",
            'hasMap' => BusinessLocation::directionsUrl(),
            'containedInPlace' => [
                '@type' => 'City',
                'name' => $organization['address_locality'],
                'addressCountry' => $organization['address_country'],
            ],
            'address' => [
                '@type' => 'PostalAddress',
                'streetAddress' => $organization['address_street'],
                'addressLocality' => $organization['address_locality'],
                'addressCountry' => $organization['address_country'],
            ],
            'geo' => [
                '@type' => 'GeoCoordinates',
                'latitude' => $organization['geo_latitude'],
                'longitude' => $organization['geo_longitude'],
            ],
            'additionalProperty' => [
                '@type' => 'PropertyValue',
                'name' => 'Adresse complète',
                'value' => config('super-securite.address'),
            ],
            'mainEntityOfPage' => ['@id' => "{$siteUrl}/contact#webpage"],
        ];
    }

    /**
     * @param  array<string, mixed>  $organization
     * @param  list<array{name: string, description: string, path: string}>  $services
     * @return array<string, mixed>
     */
    private function professionalServiceNode(
        string $siteUrl,
        string $businessId,
        string $orgId,
        string $defaultImage,
        array $organization,
        string $email,
        string $phone,
        array $services,
    ): array {
        return [
            '@type' => 'ProfessionalService',
            '@id' => $businessId,
            'name' => $organization['name'],
            'alternateName' => $organization['alternate_name'],
            'url' => $siteUrl,
            'image' => $defaultImage,
            'description' => $organization['description'],
            'email' => $email,
            'telephone' => $phone,
            'priceRange' => '$$',
            'openingHours' => $organization['opening_hours'],
            'areaServed' => $organization['area_served'],
            'contactPoint' => $this->contactPoints($email, $phone, $siteUrl),
            'address' => [
                '@type' => 'PostalAddress',
                'streetAddress' => $organization['address_street'],
                'addressLocality' => $organization['address_locality'],
                'addressCountry' => $organization['address_country'],
            ],
            'geo' => [
                '@type' => 'GeoCoordinates',
                'latitude' => $organization['geo_latitude'],
                'longitude' => $organization['geo_longitude'],
            ],
            'hasMap' => BusinessLocation::directionsUrl(),
            'parentOrganization' => ['@id' => $orgId],
            'hasOfferCatalog' => [
                '@type' => 'OfferCatalog',
                'name' => 'Services '.$organization['name'],
                'itemListElement' => $this->offerCatalogItems($services, $orgId, $organization['area_served'], $siteUrl),
            ],
        ];
    }

    /**
     * @return list<array<string, mixed>>
     */
    private function contactPoints(string $email, string $phone, string $siteUrl): array
    {
        return [
            [
                '@type' => 'ContactPoint',
                'contactType' => 'customer service',
                'telephone' => $phone,
                'email' => $email,
                'availableLanguage' => ['French', 'English'],
                'areaServed' => 'Worldwide',
            ],
            [
                '@type' => 'ContactPoint',
                'contactType' => 'sales',
                'url' => "{$siteUrl}/contact",
                'email' => $email,
                'availableLanguage' => ['French'],
            ],
        ];
    }

    /**
     * @param  list<array{name: string, description: string, path: string}>  $services
     * @return list<array<string, mixed>>
     */
    private function offerCatalogItems(array $services, string $orgId, string $areaServed, string $siteUrl): array
    {
        return collect($services)
            ->values()
            ->map(fn (array $service, int $index): array => [
                '@type' => 'ListItem',
                'position' => $index + 1,
                'item' => [
                    '@type' => 'Offer',
                    'url' => "{$siteUrl}{$service['path']}",
                    'itemOffered' => [
                        '@type' => 'Service',
                        'name' => $service['name'],
                        'description' => $service['description'],
                        'url' => "{$siteUrl}{$service['path']}",
                        'provider' => ['@id' => $orgId],
                        'areaServed' => $areaServed,
                    ],
                ],
            ])
            ->all();
    }

    /**
     * @param  list<array{name: string, description: string, path: string}>  $services
     * @return array<string, mixed>
     */
    private function servicesItemListNode(string $siteUrl, array $services, string $orgId): array
    {
        return [
            '@type' => 'ItemList',
            '@id' => "{$siteUrl}/#services",
            'name' => 'Services '.config('seo.organization.name'),
            'itemListElement' => collect($services)
                ->values()
                ->map(fn (array $service, int $index): array => [
                    '@type' => 'ListItem',
                    'position' => $index + 1,
                    'name' => $service['name'],
                    'url' => "{$siteUrl}{$service['path']}",
                    'item' => [
                        '@type' => 'Service',
                        '@id' => "{$siteUrl}{$service['path']}#service",
                        'name' => $service['name'],
                        'description' => $service['description'],
                        'url' => "{$siteUrl}{$service['path']}",
                        'provider' => ['@id' => $orgId],
                    ],
                ])
                ->all(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function websiteNode(string $siteUrl, string $websiteId, string $orgId): array
    {
        return [
            '@type' => 'WebSite',
            '@id' => $websiteId,
            'url' => $siteUrl,
            'name' => config('seo.site_name'),
            'alternateName' => config('seo.organization.alternate_name'),
            'description' => config('seo.organization.description'),
            'inLanguage' => config('seo.language'),
            'publisher' => ['@id' => $orgId],
        ];
    }

    /**
     * @param  list<array{name: string, description: string, path: string}>  $services
     * @return array<string, mixed>
     */
    /**
     * @param  array{title: string, description: string, schema_type: string}  $pageMeta
     */
    private function webPageNode(
        string $canonical,
        string $webpageId,
        string $websiteId,
        string $orgId,
        array $pageMeta,
    ): array {
        $schemaType = $pageMeta['schema_type'];

        $node = [
            '@type' => $schemaType,
            '@id' => $webpageId,
            'url' => $canonical,
            'name' => $pageMeta['title'],
            'description' => $pageMeta['description'],
            'isPartOf' => ['@id' => $websiteId],
            'about' => ['@id' => $orgId],
            'inLanguage' => config('seo.language'),
            'primaryImageOfPage' => array_filter([
                '@type' => 'ImageObject',
                'url' => $pageMeta['og_image'],
                'caption' => $pageMeta['og_image_alt'] ?? null,
            ], fn (mixed $value): bool => $value !== null),
        ];

        if ($schemaType === 'ContactPage') {
            $node['mainEntity'] = ['@id' => "{$canonical}#business"];
        }

        return $node;
    }

    /**
     * @param  list<array{name: string, description: string, path: string}>  $services
     * @return array<string, mixed>
     */
    private function breadcrumbNode(
        string $canonical,
        string $webpageId,
        string $siteUrl,
        string $path,
        array $services,
    ): array {
        $breadcrumbs = [
            ['name' => 'Accueil', 'path' => '/'],
        ];

        if ($path === '/a-propos') {
            $breadcrumbs[] = ['name' => 'À propos', 'path' => '/a-propos'];
        } elseif ($path === '/contact') {
            $breadcrumbs[] = ['name' => 'Contact', 'path' => '/contact'];
        } elseif (str_starts_with($path, '/politique-de-confidentialite')) {
            $breadcrumbs[] = ['name' => 'Confidentialité', 'path' => '/politique-de-confidentialite'];
        } elseif (str_starts_with($path, '/mentions-legales')) {
            $breadcrumbs[] = ['name' => 'Mentions légales', 'path' => '/mentions-legales'];
        } else {
            $service = collect($services)->firstWhere('path', $path);

            if ($service !== null) {
                $breadcrumbs[] = ['name' => $service['name'], 'path' => $service['path']];
            }
        }

        return [
            '@type' => 'BreadcrumbList',
            '@id' => "{$canonical}#breadcrumb",
            'itemListElement' => collect($breadcrumbs)
                ->values()
                ->map(fn (array $crumb, int $index): array => [
                    '@type' => 'ListItem',
                    'position' => $index + 1,
                    'name' => $crumb['name'],
                    'item' => $crumb['path'] === '/'
                        ? "{$siteUrl}/"
                        : "{$siteUrl}{$crumb['path']}",
                ])
                ->all(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    /**
     * @param  list<array{question: string, answer: string}>  $faqs
     */
    private function faqPageNode(string $canonical, array $faqs): array
    {
        return [
            '@type' => 'FAQPage',
            '@id' => "{$canonical}#faq",
            'mainEntity' => collect($faqs)
                ->map(fn (array $faq): array => [
                    '@type' => 'Question',
                    'name' => $faq['question'],
                    'acceptedAnswer' => [
                        '@type' => 'Answer',
                        'text' => $faq['answer'],
                    ],
                ])
                ->all(),
        ];
    }
}
