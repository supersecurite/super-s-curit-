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

    public static function isShort(?string $url): bool
    {
        if ($url === null || trim($url) === '') {
            return false;
        }

        return preg_match('/^https?:\/\/(?:www\.)?youtube\.com\/shorts\//', trim($url)) === 1;
    }

    public static function isValid(?string $url): bool
    {
        return self::parseId($url) !== null;
    }

    public static function embedUrl(string $videoId, bool $autoplay = false, bool $isShort = false): string
    {
        $params = [
            'autoplay' => $autoplay ? 1 : 0,
            'rel' => 0,
            'modestbranding' => 1,
            'playsinline' => 1,
            'iv_load_policy' => 3,
        ];

        if ($isShort) {
            $params['loop'] = 1;
            $params['playlist'] = $videoId;
        }

        return 'https://www.youtube-nocookie.com/embed/'.$videoId.'?'.http_build_query($params);
    }

    public static function thumbnailUrl(string $videoId): string
    {
        return "https://img.youtube.com/vi/{$videoId}/hqdefault.jpg";
    }

    public static function watchUrl(string $videoId): string
    {
        return "https://www.youtube.com/watch?v={$videoId}";
    }

    /**
     * @return array<string, mixed>|null
     */
    public static function toPublicArray(
        string $youtubeUrl,
        string $title,
        ?string $description = null,
        int $id = 0,
    ): ?array {
        $videoId = self::parseId($youtubeUrl);

        if ($videoId === null) {
            return null;
        }

        $isShort = self::isShort($youtubeUrl);

        return [
            'id' => $id,
            'service_id' => null,
            'service_label' => 'Vidéo',
            'title' => $title,
            'description' => $description,
            'youtube_url' => $youtubeUrl,
            'youtube_id' => $videoId,
            'thumbnail_url' => self::thumbnailUrl($videoId),
            'embed_url' => self::embedUrl($videoId, false, $isShort),
            'is_short' => $isShort,
            'sort_order' => 0,
        ];
    }
}
