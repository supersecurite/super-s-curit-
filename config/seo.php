<?php

return [

    'site_name' => env('SEO_SITE_NAME', 'ARISTECH'),

    'default_description' => env(
        'SEO_DEFAULT_DESCRIPTION',
        'ARISTECH conçoit des sites WordPress, boutiques WooCommerce et applications web sur mesure en Guinée et à l\'international.',
    ),

    'locale' => env('SEO_LOCALE', 'fr_FR'),

    'language' => env('SEO_LANGUAGE', 'fr'),

    'twitter_site' => env('SEO_TWITTER_SITE'),

    'default_og_image' => '/images/aristech/aristech.jpeg',

    'organization' => [
        'name' => 'ARISTECH',
        'legal_name' => 'ARISTECH',
        'founder' => 'Aristide Gnimassou',
        'description' => 'Studio de développement web et mobile — WordPress, WooCommerce, Shopify et applications sur mesure.',
        'area_served' => 'Guinée',
        'address_country' => 'GN',
    ],

    'pages' => [
        [
            'path' => '/',
            'changefreq' => 'weekly',
            'priority' => 1.0,
        ],
        [
            'path' => '/a-propos',
            'changefreq' => 'monthly',
            'priority' => 0.8,
        ],
        [
            'path' => '/contact',
            'changefreq' => 'monthly',
            'priority' => 0.9,
        ],
    ],

    'robots_disallow' => [
        '/dashboard',
        '/login',
        '/register',
        '/forgot-password',
        '/reset-password',
        '/verify-email',
        '/two-factor-challenge',
        '/confirm-password',
        '/settings',
    ],

];
