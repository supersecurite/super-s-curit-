<?php

namespace App\Seo;

use App\Models\Article;
use App\Models\SecurityTip;
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
     *     schema_type: string,
     * }
     */
    public function resolve(Request $request): array
    {
        $siteUrl = rtrim((string) config('app.url'), '/');
        $path = $this->canonicalPath($request);
        $canonical = $siteUrl.($path === '/' ? '/' : $path);
        $meta = $this->metaForPath($path);
        $ogImagePath = $meta['og_image'] ?? config('seo.default_og_image');

        return [
            'title' => $meta['title'],
            'description' => $meta['description'],
            'canonical' => $canonical,
            'robots' => $meta['robots'] ?? 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
            'og_image' => str_starts_with($ogImagePath, 'http') ? $ogImagePath : $siteUrl.$ogImagePath,
            'og_image_type' => $this->mimeTypeForPath($ogImagePath),
            'og_image_alt' => $meta['og_image_alt'] ?? config('seo.site_name').' — sécurité privée à Conakry, Guinée',
            'og_type' => $meta['og_type'] ?? 'website',
            'path' => $path,
            'schema_type' => $meta['schema_type'] ?? 'WebPage',
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
        $service = collect(config('seo.services', []))->firstWhere('path', $path);

        if ($service !== null) {
            return [
                'title' => $service['meta_title'],
                'description' => $service['meta_description'],
                'og_image' => $service['og_image'] ?? config('seo.default_og_image'),
                'og_image_alt' => $service['og_image_alt'] ?? null,
                'schema_type' => 'WebPage',
            ];
        }

        $page = collect(config('seo.pages', []))->firstWhere('path', $path);

        if ($page !== null && isset($page['meta_title'])) {
            return [
                'title' => $page['meta_title'],
                'description' => $page['meta_description'],
                'og_image' => $page['og_image'] ?? $page['image'] ?? config('seo.default_og_image'),
                'og_image_alt' => $page['og_image_alt'] ?? null,
                'schema_type' => $page['schema_type'] ?? 'WebPage',
            ];
        }

        $caseStudy = collect(config('seo.case_studies', []))->firstWhere('path', $path);

        if ($caseStudy !== null) {
            return [
                'title' => $caseStudy['meta_title'],
                'description' => $caseStudy['meta_description'],
                'og_image' => $caseStudy['image'] ?? config('seo.default_og_image'),
                'og_image_alt' => ($caseStudy['title'] ?? '').' — réalisation Super Sécurité Guinée',
                'schema_type' => 'WebPage',
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

        $legal = collect(config('seo.legal_pages', []))->firstWhere('path', $path);

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
            'description' => config('seo.default_description'),
            'og_image' => config('seo.default_og_image'),
            'schema_type' => 'WebPage',
        ];
    }

    /**
     * @return list<array{question: string, answer: string}>
     */
    public function faqsForPath(string $path): array
    {
        if ($path === '/contact') {
            return config('seo.faqs', []);
        }

        $service = collect(config('seo.services', []))->firstWhere('path', $path);

        if ($service !== null && ! empty($service['faqs'])) {
            return $service['faqs'];
        }

        return [];
    }

    public function canonicalPath(Request $request): string
    {
        $path = '/'.ltrim($request->path(), '/');

        return $path === '/' ? '/' : rtrim($path, '/');
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
