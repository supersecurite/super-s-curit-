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

    /**
     * iframe Maps : `q=` place le marqueur (contrairement à `ll=` qui ne fait que centrer).
     */
    public static function embedUrl(): string
    {
        $coordinates = self::coordinates();
        $latLng = $coordinates['latitude'].','.$coordinates['longitude'];
        $address = trim((string) config('super-securite.address'));
        $query = rawurlencode($address !== '' ? $address.' @'.$latLng : $latLng);

        return 'https://maps.google.com/maps?q='.$query
            .'&hl=fr&z='.$coordinates['zoom']
            .'&output=embed';
    }

    public static function directionsUrl(): string
    {
        $coordinates = self::coordinates();
        $query = rawurlencode($coordinates['latitude'].','.$coordinates['longitude']);

        return 'https://www.google.com/maps/search/?api=1&query='.$query;
    }
}
