<?php

namespace App\Support;

class MarketingMediaUrl
{
    public static function resolve(?string $image): ?string
    {
        if ($image === null || trim($image) === '') {
            return null;
        }

        $image = trim($image);

        if (str_starts_with($image, 'http://') || str_starts_with($image, 'https://')) {
            return $image;
        }

        if (str_starts_with($image, '/')) {
            return $image;
        }

        if (str_starts_with($image, 'images/')) {
            return '/'.$image;
        }

        return '/storage/'.$image;
    }

    public static function source(?string $image): ?string
    {
        if ($image === null || trim($image) === '') {
            return null;
        }

        $image = trim($image);

        if (str_starts_with($image, 'http://') || str_starts_with($image, 'https://')) {
            return 'external';
        }

        if (str_starts_with($image, '/') || str_starts_with($image, 'images/')) {
            return 'public';
        }

        return 'storage';
    }
}
