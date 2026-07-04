<?php

namespace App\Support;

class YoutubeUrl
{
    public static function parseId(?string $url): ?string
    {
        if ($url === null || trim($url) === '') {
            return null;
        }

        $url = trim($url);

        $patterns = [
            '/^https?:\/\/(?:www\.)?youtu\.be\/([a-zA-Z0-9_-]{11})(?:\?.*)?$/',
            '/^https?:\/\/(?:www\.)?youtube\.com\/watch\?(?:[^&]+&)*v=([a-zA-Z0-9_-]{11})(?:&.*)?$/',
            '/^https?:\/\/(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]{11})(?:\?.*)?$/',
            '/^https?:\/\/(?:www\.)?youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})(?:\?.*)?$/',
        ];

        foreach ($patterns as $pattern) {
            if (preg_match($pattern, $url, $matches) === 1) {
                return $matches[1];
            }
        }

        return null;
    }

    public static function isValid(?string $url): bool
    {
        return self::parseId($url) !== null;
    }

    public static function embedUrl(string $videoId, bool $autoplay = true): string
    {
        $query = http_build_query([
            'autoplay' => $autoplay ? 1 : 0,
            'rel' => 0,
            'modestbranding' => 1,
        ]);

        return "https://www.youtube.com/embed/{$videoId}?{$query}";
    }

    public static function thumbnailUrl(string $videoId): string
    {
        return "https://img.youtube.com/vi/{$videoId}/hqdefault.jpg";
    }

    public static function watchUrl(string $videoId): string
    {
        return "https://www.youtube.com/watch?v={$videoId}";
    }
}
