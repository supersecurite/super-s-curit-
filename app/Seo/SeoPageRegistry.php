<?php

namespace App\Seo;

use App\Models\Article;
use App\Models\SecurityTip;
use App\Support\LocaleUrl;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SeoPageRegistry
{
    /**
     * @return array{
     *     title: string,
     *     description: string,
     *     canonical: string,
     *     robots: string,
     *     og_image: string,
     *     og_image_type: string,
     *     og_image_alt: string,
     *     og_type: string,
     *     path: string,
     *     logical_path: string,
     *     schema_type: string,
     *     hreflang: array<string, string>,
     *     og_locale: string,
     *     og_locale_alternates: list<string>,
     * }
     */
    public function resolve(Request $request): array
    {
        $logicalPath = $this->logicalPath($request);
        $canonical = LocaleUrl::absolute($logicalPath);
        $meta = $this->metaForPath($logicalPath);
        $ogImagePath = $meta['og_image'] ?? config('seo.default_og_image');
        $siteUrl = rtrim((string) config('app.url'), '/');

        return [
            'title' => $meta['title'],
            'description' => $meta['description'],
            'canonical' => $canonical,
            'robots' => $meta['robots'] ?? 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
            'og_image' => str_starts_with($ogImagePath, 'http') ? $ogImagePath : $siteUrl.$ogImagePath,
            'og_image_type' => $this->mimeTypeForPath($ogImagePath),
            'og_image_alt' => $meta['og_image_alt'] ?? config('seo.site_name').' — sécurité privée à '.config('super-securite.zone_label', 'Conakry et région'),
            'og_type' => $meta['og_type'] ?? 'website',
            'path' => LocaleUrl::localizePath($logicalPath),
            'logical_path' => $logicalPath,
            'schema_type' => $meta['schema_type'] ?? 'WebPage',
            'hreflang' => LocaleUrl::alternateUrls($logicalPath),
            'og_locale' => LocalizedSeo::ogLocale(),
            'og_locale_alternates' => LocaleUrl::ogLocaleAlternates(),
        ];
    }

    /**
     * @return array{
     *     title: string,
     *     description: string,
     *     og_image?: string,
     *     og_image_alt?: string,
     *     og_type?: string,
     *     schema_type?: string,
     *     robots?: string|null
     * }
     */
    public function metaForPath(string $path): array
    {
        $path = LocaleUrl::stripLocalePrefix($path);

        $service = collect(LocalizedSeo::services())->firstWhere('path', $path);

        if ($service !== null) {
            return [
                'title' => $service['meta_title'],
                'description' => $service['meta_description'],
                'og_image' => $service['og_image'] ?? config('seo.default_og_image'),
                'og_image_alt' => $service['og_image_alt'] ?? null,
                'schema_type' => 'WebPage',
            ];
        }

        $page = collect(LocalizedSeo::pages())->firstWhere('path', $path);

        if ($page !== null && isset($page['meta_title'])) {
            return [
                'title' => $page['meta_title'],
                'description' => $page['meta_description'],
                'og_image' => $page['og_image'] ?? $page['image'] ?? config('seo.default_og_image'),
                'og_image_alt' => $page['og_image_alt'] ?? null,
                'schema_type' => $page['schema_type'] ?? 'WebPage',
            ];
        }

        if (preg_match('#^/actualites/([a-z0-9\-]+)$#', $path, $matches) === 1) {
            $article = Article::query()
                ->published()
                ->where('slug', $matches[1])
                ->first();

            if ($article !== null) {
                $description = $article->excerpt
                    ?? Str::limit(Article::extractTextFromContent($article->content), 160);

                return [
                    'title' => $article->title.' | '.config('seo.site_name'),
                    'description' => $description,
                    'og_image' => $article->image_url ?? config('seo.default_og_image'),
                    'og_image_alt' => $article->title.' — '.config('seo.site_name'),
                    'og_type' => 'article',
                    'schema_type' => 'Article',
                ];
            }
        }

        if (preg_match('#^/conseils-securite/([a-z0-9\-]+)$#', $path, $matches) === 1) {
            $securityTip = SecurityTip::query()
                ->published()
                ->where('slug', $matches[1])
                ->first();

            if ($securityTip !== null) {
                $description = $securityTip->excerpt
                    ?? Str::limit(SecurityTip::extractTextFromContent($securityTip->content), 160);

                return [
                    'title' => $securityTip->title.' | '.config('seo.site_name'),
                    'description' => $description,
                    'og_image' => $securityTip->image_url ?? config('seo.default_og_image'),
                    'og_image_alt' => $securityTip->title.' — '.config('seo.site_name'),
                    'og_type' => 'article',
                    'schema_type' => 'Article',
                ];
            }
        }

        $legal = collect(LocalizedSeo::legalPages())->firstWhere('path', $path);

        if ($legal !== null) {
            return [
                'title' => $legal['meta_title'],
                'description' => $legal['meta_description'],
                'og_image' => config('seo.default_og_image'),
                'schema_type' => 'WebPage',
                'robots' => $legal['robots'] ?? null,
            ];
        }

        return [
            'title' => config('seo.site_name'),
            'description' => LocalizedSeo::defaultDescription(),
            'og_image' => config('seo.default_og_image'),
            'schema_type' => 'WebPage',
        ];
    }

    /**
     * @return list<array{question: string, answer: string}>
     */
    public function faqsForPath(string $path): array
    {
        $path = LocaleUrl::stripLocalePrefix($path);

        if ($path === '/contact') {
            return LocalizedSeo::faqs();
        }

        return LocalizedSeo::serviceFaqs($path);
    }

    public function canonicalPath(Request $request): string
    {
        return LocaleUrl::localizePath($this->logicalPath($request));
    }

    public function logicalPath(Request $request): string
    {
        $path = '/'.ltrim($request->path(), '/');
        $path = $path === '/' ? '/' : rtrim($path, '/');

        return LocaleUrl::stripLocalePrefix($path);
    }

    public function mimeTypeForPath(string $relativePath): string
    {
        return match (strtolower(pathinfo($relativePath, PATHINFO_EXTENSION))) {
            'png' => 'image/png',
            'webp' => 'image/webp',
            'gif' => 'image/gif',
            default => config('seo.og_image.type', 'image/jpeg'),
        };
    }
}
