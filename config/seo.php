<?php

return [

    'site_name' => env('SEO_SITE_NAME', 'Super Sécurité'),

    'default_description' => env(
        'SEO_DEFAULT_DESCRIPTION',
        'Super Sécurité — sécurité privée à Conakry et région : entreprise, résidence, chantiers et zones minières. Disponible 24h/24, 7j/7.',
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
        'description' => 'Super Sécurité est une entreprise de sécurité privée à Conakry et région : sécurité entreprise, résidence, chantiers, zones minières et vidéosurveillance, 24h/24 et 7j/7.',
        'area_served' => config('super-securite.zone_label', 'Conakry et région'),
        'address_country' => 'GN',
        'address_locality' => 'Conakry',
        'address_street' => 'Lambanyi, en face de Cis Media',
        'geo_latitude' => '9.6412',
        'geo_longitude' => '-13.5784',
        'opening_hours' => 'Mo-Su 00:00-24:00',
    ],

    'services' => [
        [
            'name' => 'Sécurité entreprise',
            'description' => 'Gardiennage et surveillance pour bureaux, commerces et entrepôts, avec agents qualifiés disponibles 24h/24 et 7j/7.',
            'path' => '/entreprise',
            'meta_title' => 'Sécurité entreprise Conakry | Super Sécurité',
            'meta_description' => 'Sécurité entreprise à Conakry et région : gardiennage et surveillance pour bureaux, commerces et entrepôts, 24h/24 et 7j/7.',
            'og_image' => '/images/super-securite/services/IMG_9598.jpg',
            'og_image_alt' => 'Sécurité entreprise — Super Sécurité Conakry',
            'faqs' => [
                [
                    'question' => 'Intervenez-vous pour des bureaux et commerces ?',
                    'answer' => 'Oui, nous sécurisons bureaux, commerces, entrepôts et locaux professionnels à Conakry et région.',
                ],
            ],
        ],
        [
            'name' => 'Sécurité résidence',
            'description' => 'Surveillance de villas, immeubles et résidences avec une présence dissuasive et des rondes régulières.',
            'path' => '/residence',
            'meta_title' => 'Sécurité résidence Conakry | Super Sécurité',
            'meta_description' => 'Gardiennage et surveillance de résidences à Conakry et région : villas, immeubles et lotissements protégés 24h/24 et 7j/7.',
            'og_image' => '/images/super-securite/IMG_9008-scaled.jpg',
            'og_image_alt' => 'Sécurité résidence — Super Sécurité Conakry',
            'faqs' => [
                [
                    'question' => 'Proposez-vous du gardiennage de résidence 24h/24 et 7j/7 ?',
                    'answer' => 'Oui, nos équipes assurent une présence continue 24h/24 et 7j/7 selon vos besoins.',
                ],
            ],
        ],
        [
            'name' => 'Sécurité chantiers',
            'description' => 'Protection de chantiers BTP : contrôle des accès, patrouilles et sécurisation du matériel sur site.',
            'path' => '/chantiers',
            'meta_title' => 'Sécurité chantiers BTP | Super Sécurité — Conakry et région',
            'meta_description' => 'Sécurité de chantiers BTP à Conakry et région : protection du matériel, contrôle des accès et patrouilles sur site.',
            'og_image' => '/images/super-securite/services/Foreman-engineer-male-supervisor.jpg',
            'og_image_alt' => 'Sécurité chantiers — Super Sécurité Conakry et région',
            'faqs' => [],
        ],
        [
            'name' => 'Zones minières',
            'description' => 'Surveillance rigoureuse des sites miniers avec équipes formées aux protocoles les plus stricts.',
            'path' => '/zones-minieres',
            'meta_title' => 'Sécurité zones minières | Super Sécurité — Conakry et région',
            'meta_description' => 'Sécurité des zones minières à Conakry et région : équipes formées aux protocoles les plus exigeants.',
            'og_image' => '/images/super-securite/services/Side-view-of-young-black-man-in-workwear-and-safety.jpg',
            'og_image_alt' => 'Sécurité zones minières — Super Sécurité Conakry et région',
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
            'answer' => 'Résidences, bureaux, chantiers, zones minières et sites sensibles à Conakry et région.',
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
        'sécurité entreprise Conakry',
        'sécurité résidence Conakry',
        'sécurité chantier Guinée',
        'sécurité minière Guinée',
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

    'pages' => [
        [
            'path' => '/',
            'meta_title' => 'Super Sécurité | Sécurité privée à Conakry et région',
            'meta_description' => 'Super Sécurité : sécurité entreprise, résidence, chantiers et zones minières. Experts disponibles 24h/24 et 7j/7 à Conakry et région.',
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
            'meta_title' => 'Pourquoi Super Sécurité | Sécurité privée à Conakry et région',
            'meta_description' => 'Découvrez pourquoi choisir Super Sécurité : expérience, réactivité, disponibilité 24h/24 et 7j/7 et équipe certifiée à Conakry et région.',
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
            'path' => '/actualites',
            'meta_title' => 'Actualités | Super Sécurité — Sécurité privée à Conakry',
            'meta_description' => 'Découvrez les dernières actualités de Super Sécurité : entreprise, résidence, chantiers, zones minières et conseils sécurité à Conakry et région.',
            'schema_type' => 'CollectionPage',
            'changefreq' => 'weekly',
            'priority' => 0.8,
            'image' => '/web-app-manifest-512x512.png',
            'og_image_alt' => 'Actualités Super Sécurité — Conakry',
            'sources' => [
                'resources/js/pages/marketing/articles/index.tsx',
                'config/seo.php',
            ],
        ],
        [
            'path' => '/devenir-agent',
            'meta_title' => 'Devenir agent de sécurité | Super Sécurité — Conakry et région',
            'meta_description' => 'Inscrivez-vous comme agent de sécurité à Conakry et région. Rejoignez le réseau Super Sécurité pour des missions de gardiennage et surveillance.',
            'schema_type' => 'WebPage',
            'changefreq' => 'monthly',
            'priority' => 0.8,
            'image' => '/web-app-manifest-512x512.png',
            'og_image_alt' => 'Recrutement agents Super Sécurité — Conakry et région',
            'sources' => [
                'resources/js/pages/marketing/devenir-agent/index.tsx',
                'config/seo.php',
            ],
        ],
        [
            'path' => '/conseils-securite',
            'meta_title' => 'Conseils de sécurité | Super Sécurité — Conakry',
            'meta_description' => 'Conseils pratiques de Super Sécurité : prévention, gardiennage, surveillance et bonnes pratiques pour protéger vos locaux à Conakry et région.',
            'schema_type' => 'CollectionPage',
            'changefreq' => 'weekly',
            'priority' => 0.8,
            'image' => '/web-app-manifest-512x512.png',
            'og_image_alt' => 'Conseils de sécurité Super Sécurité — Conakry',
            'sources' => [
                'resources/js/pages/marketing/conseils-securite/index.tsx',
                'config/seo.php',
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
        '/articles',
        '/conseils',
        '/candidatures-agents',
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
