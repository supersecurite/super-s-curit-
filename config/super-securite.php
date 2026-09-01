<?php

return [

    'email' => env('SUPER_SECURITE_CONTACT_EMAIL', 'contact@supersecurite.com'),

    'company_legal_name' => env('SUPER_SECURITE_COMPANY_LEGAL_NAME', 'Super Sécurité sarl'),

    'share_capital' => env('SUPER_SECURITE_SHARE_CAPITAL', '10 000 000 GNF'),

    'website' => env('SUPER_SECURITE_WEBSITE', 'www.supersecurite.com'),

    'website_url' => env('SUPER_SECURITE_WEBSITE_URL', 'https://www.supersecurite.com'),

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
        'linkedin' => env('SUPER_SECURITE_LINKEDIN_URL', 'https://www.linkedin.com/company/super-s%C3%A9curit%C3%A9/?viewAsMember=false'),
        'github' => env('SUPER_SECURITE_GITHUB_URL'),
    ],

    'mail_to' => env('SUPER_SECURITE_MAIL_TO', env('SUPER_SECURITE_CONTACT_EMAIL', 'contact@supersecurite.com')),

    'rccm' => env('SUPER_SECURITE_RCCM', 'GN.TCC.2022.14296'),

    'mail' => [
        'logo_url' => env('SUPER_SECURITE_MAIL_LOGO_URL'),
        'address_short' => env('SUPER_SECURITE_MAIL_ADDRESS_SHORT', 'Lambanyi (en face CIS Média)'),
        'header_bg' => env('SUPER_SECURITE_MAIL_HEADER_BG', '#c4161d'),
        'footer_bg' => env('SUPER_SECURITE_MAIL_FOOTER_BG', '#7a0e14'),
        'accent_color' => env('SUPER_SECURITE_MAIL_ACCENT_COLOR', '#ed1c24'),
        'legal_footer' => env('SUPER_SECURITE_MAIL_LEGAL_FOOTER'),
    ],

    'zone_label' => env('SUPER_SECURITE_ZONE_LABEL', 'Conakry et région'),

    'hours_short' => env('SUPER_SECURITE_HOURS_SHORT', '24h/24 · 7j/7'),

    'hours_long' => env('SUPER_SECURITE_HOURS_LONG', '24h/24 et 7j/7'),

    'about_youtube_url' => env(
        'SUPER_SECURITE_ABOUT_YOUTUBE_URL',
        'https://www.youtube.com/watch?v=pHDNrHLb1P4',
    ),

    /*
    |--------------------------------------------------------------------------
    | Verrouillage de session par inactivité
    |--------------------------------------------------------------------------
    */
    'inactivity_lock' => [
        'enabled' => env('SUPER_SECURITE_INACTIVITY_LOCK_ENABLED', true),
        'timeout_minutes' => (int) env('SUPER_SECURITE_INACTIVITY_LOCK_MINUTES', 15),
    ],

    'access_logs' => [
        'retention_days' => (int) env('ACCESS_LOGS_RETENTION_DAYS', 365),
    ],

];
