<?php

namespace App\Seo;

use App\Models\Article;
use App\Models\SecurityTip;

class SitemapEntries
{
    /**
     * @return list<array<string, mixed>>
     */
    public static function all(): array
    {
        $pages = config('seo.pages', []);
        $legal = collect(config('seo.legal_pages', []))
            ->map(fn (array $page): array => [
                ...$page,
                'changefreq' => $page['changefreq'] ?? 'yearly',
                'priority' => $page['priority'] ?? 0.3,
                'image' => config('seo.default_og_image'),
                'sources' => ['config/seo.php'],
            ])
            ->all();

        $servicePages = collect(config('seo.services', []))
            ->map(fn (array $service): array => [
                'path' => $service['path'],
                'changefreq' => 'monthly',
                'priority' => 0.9,
                'image' => $service['og_image'] ?? config('seo.default_og_image'),
                'sources' => ['config/seo.php'],
            ])
            ->all();

        $articlePages = Article::query()
            ->published()
            ->orderByDesc('published_at')
            ->get()
            ->map(fn (Article $article): array => [
                'path' => '/actualites/'.$article->slug,
                'changefreq' => 'monthly',
                'priority' => 0.7,
                'image' => $article->image_url ?? config('seo.default_og_image'),
                'sources' => ['database/articles'],
                'lastmod' => $article->updated_at?->toAtomString(),
            ])
            ->all();

        $securityTipPages = SecurityTip::query()
            ->published()
            ->orderByDesc('published_at')
            ->get()
            ->map(fn (SecurityTip $securityTip): array => [
                'path' => '/conseils-securite/'.$securityTip->slug,
                'changefreq' => 'monthly',
                'priority' => 0.7,
                'image' => $securityTip->image_url ?? config('seo.default_og_image'),
                'sources' => ['database/security_tips'],
                'lastmod' => $securityTip->updated_at?->toAtomString(),
            ])
            ->all();

        $existingPaths = collect($pages)->pluck('path')->all();

        $merged = $pages;

        foreach ([...$servicePages, ...$legal, ...$articlePages, ...$securityTipPages] as $entry) {
            if (! in_array($entry['path'], $existingPaths, true)) {
                $merged[] = $entry;
                $existingPaths[] = $entry['path'];
            }
        }

        return $merged;
    }
}
