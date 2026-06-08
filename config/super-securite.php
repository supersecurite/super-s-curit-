<?php

return [

    'email' => env('SUPER_SECURITE_CONTACT_EMAIL', 'contact@supersecurite.com'),

    'phone' => env('SUPER_SECURITE_CONTACT_PHONE', '+224 612 13 13 14'),

    'phone_secondary' => env('SUPER_SECURITE_CONTACT_PHONE_SECONDARY', '+224 612 13 13 15'),

    'phone_href' => env('SUPER_SECURITE_CONTACT_PHONE_HREF', 'tel:+224612131314'),

    'address' => env(
        'SUPER_SECURITE_ADDRESS',
        'Lambanyi (en face de Cis Media) – Conakry – Rép. de Guinée',
    ),

    'map' => [
        'latitude' => env('SUPER_SECURITE_MAP_LAT', '9.644482'),
        'longitude' => env('SUPER_SECURITE_MAP_LNG', '-13.609500'),
        'zoom' => (int) env('SUPER_SECURITE_MAP_ZOOM', 16),
    ],

    'social' => [
        'facebook' => env('SUPER_SECURITE_FACEBOOK_URL', 'https://www.facebook.com/supersecurite'),
        'twitter' => env('SUPER_SECURITE_TWITTER_URL'),
        'youtube' => env('SUPER_SECURITE_YOUTUBE_URL'),
        'instagram' => env('SUPER_SECURITE_INSTAGRAM_URL', 'https://www.instagram.com/supersecurite'),
        'linkedin' => env('SUPER_SECURITE_LINKEDIN_URL'),
        'github' => env('SUPER_SECURITE_GITHUB_URL'),
    ],

    'mail_to' => env('SUPER_SECURITE_MAIL_TO', env('SUPER_SECURITE_CONTACT_EMAIL', 'contact@supersecurite.com')),

    'rccm' => env('SUPER_SECURITE_RCCM'),

    'zone_label' => env('SUPER_SECURITE_ZONE_LABEL', 'Conakry et région'),

    'hours_short' => env('SUPER_SECURITE_HOURS_SHORT', '24h/24 · 7j/7'),

    'hours_long' => env('SUPER_SECURITE_HOURS_LONG', '24h/24 et 7j/7'),

];
