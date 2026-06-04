<?php

return [

    'site_name' => env('SEO_SITE_NAME', 'Super Sécurité'),

    'default_description' => env(
        'SEO_DEFAULT_DESCRIPTION',
        'Super Sécurité — sécurité privée à Conakry : gardiennage, surveillance de sites industriels et miniers, sécurité événementielle. Disponible 24h/24, 7j/7.',
    ),

    'locale' => env('SEO_LOCALE', 'fr_FR'),

    'language' => env('SEO_LANGUAGE', 'fr'),

    'twitter_site' => env('SEO_TWITTER_SITE'),

    'default_og_image' => '/web-app-manifest-512x512.png',

    'og_image' => [
        'width' => 512,
        'height' => 512,
        'type' => 'image/png',
    ],

    'geo' => [
        'region' => 'GN',
        'placename' => 'Conakry',
    ],

    'organization' => [
        'name' => 'Super Sécurité',
        'legal_name' => 'Super Sécurité',
        'alternate_name' => 'SuperSécurité',
        'slogan' => 'Le meilleur pour votre sécurité',
        'founding_date' => '2020',
        'founder' => null,
        'founder_job_title' => null,
        'description' => 'Super Sécurité est une entreprise de sécurité privée à Conakry (Guinée) : gardiennage, surveillance industrielle et minière, vidéosurveillance et sécurité événementielle, 24h/24 et 7j/7.',
        'area_served' => 'Guinée',
        'address_country' => 'GN',
        'address_locality' => 'Conakry',
        'address_street' => 'Lambanyi, en face de Cis Media',
        'geo_latitude' => '9.6412',
        'geo_longitude' => '-13.5784',
        'opening_hours' => 'Mo-Su 00:00-24:00',
    ],

    'services' => [
        [
            'name' => 'Gardiennage et surveillance',
            'description' => 'Agents de sécurité qualifiés pour protéger locaux, bureaux, résidences et chantiers, jour et nuit.',
            'path' => '/#gardiennage',
            'meta_title' => 'Gardiennage et surveillance Conakry | Super Sécurité',
            'meta_description' => 'Gardiennage et surveillance à Conakry : agents professionnels pour bureaux, résidences, chantiers et zones sensibles.',
            'og_image' => '/web-app-manifest-512x512.png',
            'og_image_alt' => 'Gardiennage et surveillance — Super Sécurité Conakry',
            'faqs' => [
                [
                    'question' => 'Proposez-vous du gardiennage 24h/24 ?',
                    'answer' => 'Oui, nos équipes assurent une présence continue 24h/24 et 7j/7 selon vos besoins.',
                ],
            ],
        ],
        [
            'name' => 'Sécurité des sites industriels et miniers',
            'description' => 'Surveillance rigoureuse des installations sensibles avec protocoles de sécurité stricts.',
            'path' => '/#industriel',
            'meta_title' => 'Sécurité industrielle et minière | Super Sécurité Guinée',
            'meta_description' => 'Sécurité des sites industriels et miniers en Guinée : équipes formées aux protocoles les plus exigeants.',
            'og_image' => '/web-app-manifest-512x512.png',
            'og_image_alt' => 'Sécurité industrielle — Super Sécurité',
            'faqs' => [],
        ],
        [
            'name' => 'Sécurité événementielle',
            'description' => 'Gestion complète de la sécurité pour événements publics, privés, sportifs et culturels.',
            'path' => '/#evenementiel',
            'meta_title' => 'Sécurité événementielle Conakry | Super Sécurité',
            'meta_description' => 'Sécurité événementielle à Conakry : experts pour événements sportifs, culturels et privés.',
            'og_image' => '/web-app-manifest-512x512.png',
            'og_image_alt' => 'Sécurité événementielle — Super Sécurité',
            'faqs' => [],
        ],
    ],

    'faqs' => [
        [
            'question' => 'Intervenez-vous en urgence ?',
            'answer' => 'Oui, Super Sécurité assure une disponibilité 24h/24 et 7j/7 avec une équipe réactive pour vos besoins urgents.',
        ],
        [
            'question' => 'Quels types de sites sécurisez-vous ?',
            'answer' => 'Résidences, bureaux, chantiers, zones minières, sites industriels et événements publics ou privés.',
        ],
        [
            'question' => 'Comment obtenir un devis ?',
            'answer' => 'Contactez-nous par téléphone au +224 612 13 13 14 ou par e-mail à contact@supersecurite.com.',
        ],
        [
            'question' => 'Où se trouve Super Sécurité à Conakry ?',
            'answer' => 'Nos bureaux sont situés à Lambanyi, en face de Cis Media — Conakry, République de Guinée. Un plan d\'accès interactif est disponible sur la page contact.',
        ],
    ],

    'knows_about' => [
        'Super Sécurité',
        'sécurité privée Conakry',
        'gardiennage Guinée',
        'surveillance site industriel',
        'sécurité minière Guinée',
        'sécurité événementielle Conakry',
        'agents de sécurité Conakry',
        'vidéosurveillance Guinée',
        'télésurveillance Conakry',
        'Super Sécurité Lambanyi',
        'sécurité privée Lambanyi Conakry',
        'plan accès Super Sécurité',
    ],

    'legal_pages' => [
        [
            'path' => '/politique-de-confidentialite',
            'meta_title' => 'Politique de confidentialité | Super Sécurité',
            'meta_description' => 'Politique de confidentialité de Super Sécurité : données personnelles, cookies et droits des utilisateurs.',
            'robots' => 'index, follow',
        ],
        [
            'path' => '/mentions-legales',
            'meta_title' => 'Mentions légales | Super Sécurité',
            'meta_description' => 'Mentions légales Super Sécurité : éditeur du site, contact et hébergement.',
            'robots' => 'index, follow',
        ],
    ],

    'case_studies' => [],

    'pages' => [
        [
            'path' => '/',
            'meta_title' => 'Super Sécurité | Sécurité privée à Conakry, Guinée',
            'meta_description' => 'Super Sécurité : gardiennage, surveillance industrielle, sécurité événementielle. Experts disponibles 24h/24 et 7j/7 à Conakry.',
            'schema_type' => 'WebPage',
            'changefreq' => 'weekly',
            'priority' => 1.0,
            'image' => '/web-app-manifest-512x512.png',
            'sources' => [
                'resources/js/pages/marketing/home.tsx',
                'config/seo.php',
            ],
        ],
        [
            'path' => '/a-propos',
            'meta_title' => 'Pourquoi Super Sécurité | Sécurité privée à Conakry',
            'meta_description' => 'Découvrez pourquoi choisir Super Sécurité : expérience, réactivité, disponibilité 24/7 et équipe certifiée en Guinée.',
            'schema_type' => 'AboutPage',
            'changefreq' => 'monthly',
            'priority' => 0.8,
            'image' => '/web-app-manifest-512x512.png',
            'og_image_alt' => 'Pourquoi choisir Super Sécurité — Conakry',
            'sources' => [
                'resources/js/pages/marketing/about.tsx',
            ],
        ],
        [
            'path' => '/contact',
            'meta_title' => 'Contact & plan d\'accès | Super Sécurité — Lambanyi, Conakry',
            'meta_description' => 'Contactez Super Sécurité à Lambanyi (face Cis Media), Conakry : +224 612 13 13 14, contact@supersecurite.com. Formulaire, FAQ et plan Google Maps.',
            'schema_type' => 'ContactPage',
            'changefreq' => 'monthly',
            'priority' => 0.9,
            'image' => '/web-app-manifest-512x512.png',
            'og_image_alt' => 'Contact et localisation Super Sécurité — Lambanyi, Conakry',
            'sources' => [
                'resources/js/pages/marketing/contact.tsx',
                'resources/js/components/marketing/contact-map-section.tsx',
                'config/seo.php',
            ],
        ],
    ],

    'robots_disallow' => [
        '/dashboard',
        '/analytics',
        '/users',
        '/login',
        '/register',
        '/forgot-password',
        '/reset-password',
        '/verify-email',
        '/two-factor-challenge',
        '/confirm-password',
        '/settings',
        '/api',
    ],

    'ai_crawlers' => [
        'GPTBot',
        'ChatGPT-User',
        'OAI-SearchBot',
        'anthropic-ai',
        'ClaudeBot',
        'PerplexityBot',
        'Google-Extended',
    ],

];
