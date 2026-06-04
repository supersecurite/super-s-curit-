<?php

namespace App\Support;

final class BusinessLocation
{
    /**
     * @return array{latitude: string, longitude: string, zoom: int}
     */
    public static function coordinates(): array
    {
        return [
            'latitude' => (string) config('super-securite.map.latitude'),
            'longitude' => (string) config('super-securite.map.longitude'),
            'zoom' => (int) config('super-securite.map.zoom', 16),
        ];
    }

    public static function embedUrl(): string
    {
        $coordinates = self::coordinates();
        $query = rawurlencode((string) config('super-securite.address'));

        return 'https://maps.google.com/maps?q='.$query
            .'&hl=fr&z='.$coordinates['zoom']
            .'&output=embed';
    }

    public static function directionsUrl(): string
    {
        $query = rawurlencode((string) config('super-securite.address'));

        return 'https://www.google.com/maps/search/?api=1&query='.$query;
    }
}
