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
        'latitude' => env('SUPER_SECURITE_MAP_LAT', '9.6412'),
        'longitude' => env('SUPER_SECURITE_MAP_LNG', '-13.5784'),
        'zoom' => (int) env('SUPER_SECURITE_MAP_ZOOM', 16),
    ],

    'social' => [
        'facebook' => env('SUPER_SECURITE_FACEBOOK_URL'),
        'twitter' => env('SUPER_SECURITE_TWITTER_URL'),
        'youtube' => env('SUPER_SECURITE_YOUTUBE_URL'),
        'instagram' => env('SUPER_SECURITE_INSTAGRAM_URL'),
        'linkedin' => env('SUPER_SECURITE_LINKEDIN_URL'),
        'github' => env('SUPER_SECURITE_GITHUB_URL'),
    ],

    'mail_to' => env('SUPER_SECURITE_MAIL_TO', env('SUPER_SECURITE_CONTACT_EMAIL', 'contact@supersecurite.com')),

    'rccm' => env('SUPER_SECURITE_RCCM'),

];
