<?php

/**
 * Surcharges SEO anglaises (mergeés sur config/seo.php via LocalizedSeo).
 */
return [

    'default_description' => 'Super Sécurité — private security in Conakry and region: business, residence, construction sites and mining areas. Available 24/7.',

    'organization' => [
        'slogan' => 'The best for your security',
        'description' => 'Super Sécurité is a private security company in Conakry and region: business security, residential, construction sites, mining areas and video surveillance, 24/7.',
    ],

    'pages' => [
        [
            'path' => '/',
            'meta_title' => 'Super Sécurité | Private security in Conakry and region',
            'meta_description' => 'Super Sécurité: business, residential, construction and mining security. Experts available 24/7 in Conakry and region.',
        ],
        [
            'path' => '/a-propos',
            'meta_title' => 'Why Super Sécurité | Private security in Conakry and region',
            'meta_description' => 'Discover why choose Super Sécurité: experience, responsiveness, 24/7 availability and a certified team in Conakry and region.',
            'og_image_alt' => 'Why choose Super Sécurité — Conakry',
        ],
        [
            'path' => '/actualites',
            'meta_title' => 'News | Super Sécurité — Private security in Conakry',
            'meta_description' => 'Latest Super Sécurité news: business, residential, construction, mining and security tips in Conakry and region.',
            'og_image_alt' => 'Super Sécurité news — Conakry',
        ],
        [
            'path' => '/devenir-agent',
            'meta_title' => 'Become a security guard | Super Sécurité — Conakry and region',
            'meta_description' => 'Apply as a security guard in Conakry and region. Join the Super Sécurité network for guarding and surveillance missions.',
            'og_image_alt' => 'Super Sécurité guard recruitment — Conakry and region',
        ],
        [
            'path' => '/conseils-securite',
            'meta_title' => 'Security tips | Super Sécurité — Conakry',
            'meta_description' => 'Practical security tips from Super Sécurité: prevention, guarding, surveillance and best practices to protect your premises in Conakry and region.',
            'og_image_alt' => 'Super Sécurité security tips — Conakry',
        ],
        [
            'path' => '/galerie',
            'meta_title' => 'Photo gallery | Super Sécurité — Field missions',
            'meta_description' => 'See Super Sécurité missions in pictures: business guarding, residential, construction sites and mining areas in Guinea.',
            'og_image_alt' => 'Super Sécurité gallery — field photos',
        ],
        [
            'path' => '/contact',
            'meta_title' => 'Contact & directions | Super Sécurité — Lambanyi, Conakry',
            'meta_description' => 'Contact Super Sécurité in Lambanyi (opposite Cis Media), Conakry: +224 612 13 13 14, contact@supersecurite.com. Form, FAQ and Google Maps.',
            'og_image_alt' => 'Contact and location Super Sécurité — Lambanyi, Conakry',
        ],
    ],

    'legal_pages' => [
        [
            'path' => '/politique-de-confidentialite',
            'meta_title' => 'Privacy policy | Super Sécurité',
            'meta_description' => 'Super Sécurité privacy policy: personal data, cookies and user rights.',
        ],
        [
            'path' => '/mentions-legales',
            'meta_title' => 'Legal notice | Super Sécurité',
            'meta_description' => 'Super Sécurité legal notice: publisher, contact and hosting.',
        ],
    ],

    'services' => [
        [
            'path' => '/entreprise',
            'name' => 'Business security',
            'description' => 'Guarding and surveillance for offices, shops and warehouses, with qualified officers available 24/7.',
            'meta_title' => 'Business security Conakry | Super Sécurité',
            'meta_description' => 'Business security in Conakry and region: guarding and surveillance for offices, shops and warehouses, 24/7.',
            'og_image_alt' => 'Business security — Super Sécurité Conakry',
            'faqs' => [
                [
                    'question' => 'Why hire a private security company in Guinea?',
                    'answer' => 'A private security company helps protect your premises, equipment, staff and visitors. In Guinea, businesses often face access control, site surveillance and crime prevention challenges.',
                ],
                [
                    'question' => 'Which types of businesses can benefit from your services?',
                    'answer' => 'We support SMEs, large companies, banks, shops, warehouses, factories, offices, international institutions and organisations operating in Guinea.',
                ],
                [
                    'question' => 'How do your officers secure sites?',
                    'answer' => 'Our officers handle access control, patrols, secure visitor reception, on-site movement monitoring and enforcement of security instructions agreed with the client.',
                ],
                [
                    'question' => 'Are your officers trained?',
                    'answer' => 'Yes. All our officers receive training suited to private security requirements and are regularly supervised to maintain a high professional standard.',
                ],
                [
                    'question' => 'Do you operate outside Conakry?',
                    'answer' => 'Yes. Super Sécurité operates across Guinea according to client needs.',
                ],
                [
                    'question' => 'How can I get a quote for my business security?',
                    'answer' => 'Our teams assess your needs to propose a tailored solution and a quote suited to your activity.',
                ],
            ],
        ],
        [
            'path' => '/residence',
            'name' => 'Residential security',
            'description' => 'Surveillance of villas, apartment buildings and residences with a deterrent presence and regular patrols.',
            'meta_title' => 'Residential security Conakry | Super Sécurité',
            'meta_description' => 'Residential guarding and surveillance in Conakry and region: villas, buildings and estates protected 24/7.',
            'og_image_alt' => 'Residential security — Super Sécurité Conakry',
            'faqs' => [
                [
                    'question' => 'Why hire security to protect a home?',
                    'answer' => 'Security officers help deter intrusions, control access and strengthen the safety of occupants and property.',
                ],
                [
                    'question' => 'Which types of residences do you protect?',
                    'answer' => 'We secure villas, private residences, residential buildings, diplomatic residences and housing for executives or expatriates.',
                ],
                [
                    'question' => 'Are officers present day and night?',
                    'answer' => 'Yes. Depending on client needs, we can provide permanent presence or adapted schedules.',
                ],
            ],
        ],
        [
            'path' => '/chantiers',
            'name' => 'Construction site security',
            'description' => 'Protection of construction sites: materials, access control and regular on-site patrols.',
            'meta_title' => 'Construction site security Conakry | Super Sécurité',
            'meta_description' => 'Secure your construction sites in Conakry and Guinea: access control, material protection and night/weekend surveillance.',
            'og_image_alt' => 'Construction site security — Super Sécurité Conakry',
            'faqs' => [
                [
                    'question' => 'Why secure a construction site in Guinea?',
                    'answer' => 'Sites are frequently exposed to material theft, damage and intrusion. Professional surveillance protects investments and limits work interruptions.',
                ],
                [
                    'question' => 'Which types of sites do you protect?',
                    'answer' => 'We work on construction sites, industrial projects, public infrastructure, mining projects and real-estate programmes.',
                ],
            ],
        ],
        [
            'path' => '/zones-minieres',
            'name' => 'Mining area security',
            'description' => 'Strict surveillance of mining sites with teams trained for the most demanding security protocols.',
            'meta_title' => 'Mining security Guinea | Super Sécurité',
            'meta_description' => 'Mining site security in Guinea: access control, facility protection and 24/7 operational supervision.',
            'og_image_alt' => 'Mining security — Super Sécurité Guinea',
            'faqs' => [
                [
                    'question' => 'Why is security essential on a mining site in Guinea?',
                    'answer' => 'Mining sites concentrate high-value equipment, raw materials and large personnel flows. Professional security reduces theft, intrusion, sabotage and operational incidents.',
                ],
                [
                    'question' => 'Do you have mining sector experience?',
                    'answer' => 'Yes. Our teams are trained for mining-site constraints and the requirements of companies in this strategic sector in Guinea.',
                ],
            ],
        ],
    ],

    'faqs' => [
        [
            'question' => 'Why hire a private security company in Guinea?',
            'answer' => 'A private security company helps protect your premises, equipment, staff and visitors. In Guinea, businesses often face access control, site surveillance and crime prevention challenges.',
        ],
        [
            'question' => 'Which types of businesses can benefit from your services?',
            'answer' => 'We support SMEs, large companies, banks, shops, warehouses, factories, offices, international institutions and organisations operating in Guinea.',
        ],
        [
            'question' => 'How do your officers secure sites?',
            'answer' => 'Our officers handle access control, patrols, secure visitor reception, on-site movement monitoring and enforcement of security instructions agreed with the client.',
        ],
        [
            'question' => 'Are your officers trained?',
            'answer' => 'Yes. All our officers receive training suited to private security requirements and are regularly supervised to maintain a high professional standard.',
        ],
        [
            'question' => 'Do you operate outside Conakry?',
            'answer' => 'Yes. Super Sécurité operates across Guinea according to client needs.',
        ],
        [
            'question' => 'How can I get a quote for my business security?',
            'answer' => 'Our teams assess your needs to propose a tailored solution and a quote suited to your activity.',
        ],
    ],

];
