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
                    'question' => 'Pourquoi faire appel à une société de sécurité privée en Guinée ?',
                    'answer' => 'Faire appel à une société de sécurité privée permet de protéger vos locaux, vos équipements, vos collaborateurs et vos visiteurs. En Guinée, les entreprises font souvent face à des enjeux de contrôle d\'accès, de surveillance des installations et de prévention des actes de malveillance.',
                ],
                [
                    'question' => 'Quels types d\'entreprises peuvent bénéficier de vos services ?',
                    'answer' => 'Nous accompagnons les PME, grandes entreprises, banques, commerces, entrepôts, usines, bureaux administratifs, institutions internationales et organisations opérant en Guinée.',
                ],
                [
                    'question' => 'Comment vos agents assurent-ils la sécurité des sites ?',
                    'answer' => 'Nos agents assurent le contrôle des accès, les rondes de surveillance, l\'accueil sécuritaire des visiteurs, le suivi des mouvements sur site et l\'application des consignes de sécurité définies avec le client.',
                ],
                [
                    'question' => 'Vos agents sont-ils formés ?',
                    'answer' => 'Oui. Tous nos agents reçoivent une formation adaptée aux exigences du métier de la sécurité privée et sont régulièrement supervisés afin de garantir un haut niveau de professionnalisme.',
                ],
                [
                    'question' => 'Intervenez-vous en dehors de Conakry ?',
                    'answer' => 'Oui. Super Sécurité intervient sur l\'ensemble du territoire guinéen selon les besoins de ses clients.',
                ],
                [
                    'question' => 'Comment obtenir un devis pour la sécurité de mon entreprise ?',
                    'answer' => 'Nos équipes réalisent une évaluation de vos besoins afin de proposer une solution personnalisée et un devis adapté à votre activité.',
                ],
                [
                    'question' => 'Pourquoi choisir une société de sécurité à Conakry pour protéger son entreprise ?',
                    'answer' => 'Conakry concentre une grande partie de l\'activité économique de la Guinée, avec de nombreux bureaux, commerces, entrepôts et sites industriels. Faire appel à une société de sécurité implantée localement permet de bénéficier d\'une meilleure réactivité, d\'une connaissance du terrain et d\'un accompagnement adapté aux réalités sécuritaires de la capitale guinéenne.',
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
                    'question' => 'Pourquoi faire appel à une société de sécurité pour protéger son domicile ?',
                    'answer' => 'La présence d\'agents de sécurité contribue à dissuader les intrusions, à contrôler les accès et à renforcer la sécurité des occupants et des biens.',
                ],
                [
                    'question' => 'Quels types de résidences protégez-vous ?',
                    'answer' => 'Nous assurons la sécurité des villas, résidences privées, immeubles résidentiels, résidences diplomatiques et logements de cadres ou d\'expatriés.',
                ],
                [
                    'question' => 'Les agents sont-ils présents de jour comme de nuit ?',
                    'answer' => 'Oui. Selon les besoins du client, nous pouvons mettre en place une présence permanente ou des horaires adaptés.',
                ],
                [
                    'question' => 'Vos agents contrôlent-ils les visiteurs ?',
                    'answer' => 'Oui. Nos agents peuvent assurer l\'identification des visiteurs, le contrôle des entrées et sorties ainsi que le respect des consignes de sécurité du propriétaire.',
                ],
                [
                    'question' => 'Puis-je bénéficier d\'un service de sécurité temporaire ?',
                    'answer' => 'Oui. Nous proposons aussi des prestations ponctuelles pour des absences prolongées ou des périodes à risque.',
                ],
                [
                    'question' => 'Comment déterminer le nombre d\'agents nécessaires ?',
                    'answer' => 'Nos équipes réalisent une évaluation du domicile afin de recommander un dispositif adapté à sa configuration et aux risques identifiés.',
                ],
                [
                    'question' => 'Comment protéger efficacement sa villa ou sa résidence à Conakry ?',
                    'answer' => 'La protection d\'une résidence à Conakry repose sur plusieurs éléments : contrôle des accès, présence d\'agents de sécurité qualifiés, surveillance des visiteurs et application de procédures adaptées. Une solution de sécurité professionnelle permet de renforcer la tranquillité des occupants et de prévenir les risques d\'intrusion ou de vol.',
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
            'faqs' => [
                [
                    'question' => 'Pourquoi sécuriser un chantier en Guinée ?',
                    'answer' => 'Les chantiers sont fréquemment exposés aux vols de matériaux, aux dégradations et aux intrusions. Une surveillance professionnelle permet de protéger les investissements et de limiter les interruptions de travaux.',
                ],
                [
                    'question' => 'Quels types de chantiers protégez-vous ?',
                    'answer' => 'Nous intervenons sur les chantiers de construction, les projets industriels, les infrastructures publiques, les projets miniers et les programmes immobiliers.',
                ],
                [
                    'question' => 'Que font vos agents sur un chantier ?',
                    'answer' => 'Ils assurent le contrôle des accès, la surveillance des matériaux et équipements, les rondes de sécurité et la gestion des entrées et sorties du personnel.',
                ],
                [
                    'question' => 'La surveillance est-elle assurée en dehors des heures de travail ?',
                    'answer' => 'Oui. Nous proposons une surveillance de nuit, les week-ends et les jours fériés afin de garantir une protection continue.',
                ],
                [
                    'question' => 'Pouvez-vous intervenir rapidement sur un nouveau chantier ?',
                    'answer' => 'Oui. Nos équipes peuvent être déployées rapidement selon la localisation et les besoins du projet.',
                ],
                [
                    'question' => 'Comment réduire les pertes liées aux vols sur les chantiers ?',
                    'answer' => 'La mise en place d\'un dispositif de sécurité adapté, associé à des contrôles d\'accès et à une surveillance régulière, constitue la solution la plus efficace pour limiter les pertes et sécuriser les actifs du chantier.',
                ],
                [
                    'question' => 'Comment sécuriser un chantier de construction à Conakry et dans les grandes villes de Guinée ?',
                    'answer' => 'Les chantiers de construction sont souvent exposés aux vols de matériaux, aux intrusions et aux actes de vandalisme. La mise en place d\'un dispositif de sécurité adapté, comprenant le contrôle des accès, des rondes régulières et une surveillance en dehors des heures de travail, permet de protéger efficacement les investissements et d\'assurer la continuité des travaux.',
                ],
            ],
        ],
        [
            'name' => 'Zones minières',
            'description' => 'Surveillance rigoureuse des sites miniers avec équipes formées aux protocoles les plus stricts.',
            'path' => '/zones-minieres',
            'meta_title' => 'Sécurité zones minières | Super Sécurité — Conakry et région',
            'meta_description' => 'Sécurité des zones minières à Conakry et région : équipes formées aux protocoles les plus exigeants.',
            'og_image' => '/images/super-securite/services/Side-view-of-young-black-man-in-workwear-and-safety.jpg',
            'og_image_alt' => 'Sécurité zones minières — Super Sécurité Conakry et région',
            'faqs' => [
                [
                    'question' => 'Pourquoi la sécurité est-elle essentielle sur un site minier en Guinée ?',
                    'answer' => 'Les sites miniers concentrent des équipements de grande valeur, des matières premières et un important flux de personnel. Une sécurité professionnelle permet de réduire les risques de vol, d\'intrusion, de sabotage et d\'incidents opérationnels.',
                ],
                [
                    'question' => 'Avez-vous de l\'expérience dans le secteur minier ?',
                    'answer' => 'Oui. Nos équipes sont formées aux contraintes spécifiques des sites miniers et aux exigences des entreprises opérant dans ce secteur stratégique en Guinée.',
                ],
                [
                    'question' => 'Quels services de sécurité proposez-vous pour les mines ?',
                    'answer' => 'Nous assurons le contrôle d\'accès, la surveillance des installations, la protection des équipements, la gestion des visiteurs, les rondes de sécurité et la supervision opérationnelle.',
                ],
                [
                    'question' => 'Intervenez-vous dans les zones minières éloignées ?',
                    'answer' => 'Oui. Nous pouvons déployer des équipes dans les différentes régions minières de Guinée, notamment à Boké, Boffa, Siguiri, Kankan et dans d\'autres zones d\'exploitation.',
                ],
                [
                    'question' => 'Comment assurez-vous le suivi des agents sur les sites miniers ?',
                    'answer' => 'Nos superviseurs effectuent des contrôles réguliers et des rapports de suivi peuvent être transmis aux responsables du site.',
                ],
                [
                    'question' => 'Pouvez-vous fournir un dispositif de sécurité 24h/24 ?',
                    'answer' => 'Oui. Nous mettons en place des équipes organisées en rotation afin d\'assurer une couverture permanente des sites miniers.',
                ],
                [
                    'question' => 'Quelle société de sécurité choisir pour un site minier à Boké ou Boffa ?',
                    'answer' => 'Les régions de Boké et Boffa abritent certaines des plus importantes exploitations minières de Guinée. La sécurisation de ces sites nécessite une expertise spécifique, une capacité de déploiement en zones éloignées et une parfaite maîtrise des exigences du secteur minier. Super Sécurité accompagne les acteurs miniers avec des solutions adaptées à la protection des installations, du personnel et des équipements.',
                ],
            ],
        ],
    ],

    'faqs' => [
        [
            'question' => 'Pourquoi faire appel à une société de sécurité privée en Guinée ?',
            'answer' => 'Faire appel à une société de sécurité privée permet de protéger vos locaux, vos équipements, vos collaborateurs et vos visiteurs. En Guinée, les entreprises font souvent face à des enjeux de contrôle d\'accès, de surveillance des installations et de prévention des actes de malveillance.',
        ],
        [
            'question' => 'Quels types d\'entreprises peuvent bénéficier de vos services ?',
            'answer' => 'Nous accompagnons les PME, grandes entreprises, banques, commerces, entrepôts, usines, bureaux administratifs, institutions internationales et organisations opérant en Guinée.',
        ],
        [
            'question' => 'Comment vos agents assurent-ils la sécurité des sites ?',
            'answer' => 'Nos agents assurent le contrôle des accès, les rondes de surveillance, l\'accueil sécuritaire des visiteurs, le suivi des mouvements sur site et l\'application des consignes de sécurité définies avec le client.',
        ],
        [
            'question' => 'Vos agents sont-ils formés ?',
            'answer' => 'Oui. Tous nos agents reçoivent une formation adaptée aux exigences du métier de la sécurité privée et sont régulièrement supervisés afin de garantir un haut niveau de professionnalisme.',
        ],
        [
            'question' => 'Intervenez-vous en dehors de Conakry ?',
            'answer' => 'Oui. Super Sécurité intervient sur l\'ensemble du territoire guinéen selon les besoins de ses clients.',
        ],
        [
            'question' => 'Comment obtenir un devis pour la sécurité de mon entreprise ?',
            'answer' => 'Nos équipes réalisent une évaluation de vos besoins afin de proposer une solution personnalisée et un devis adapté à votre activité.',
        ],
        [
            'question' => 'Pourquoi choisir une société de sécurité à Conakry pour protéger son entreprise ?',
            'answer' => 'Conakry concentre une grande partie de l\'activité économique de la Guinée, avec de nombreux bureaux, commerces, entrepôts et sites industriels. Faire appel à une société de sécurité implantée localement permet de bénéficier d\'une meilleure réactivité, d\'une connaissance du terrain et d\'un accompagnement adapté aux réalités sécuritaires de la capitale guinéenne.',
        ],
        [
            'question' => 'Pourquoi la sécurité est-elle essentielle sur un site minier en Guinée ?',
            'answer' => 'Les sites miniers concentrent des équipements de grande valeur, des matières premières et un important flux de personnel. Une sécurité professionnelle permet de réduire les risques de vol, d\'intrusion, de sabotage et d\'incidents opérationnels.',
        ],
        [
            'question' => 'Avez-vous de l\'expérience dans le secteur minier ?',
            'answer' => 'Oui. Nos équipes sont formées aux contraintes spécifiques des sites miniers et aux exigences des entreprises opérant dans ce secteur stratégique en Guinée.',
        ],
        [
            'question' => 'Quels services de sécurité proposez-vous pour les mines ?',
            'answer' => 'Nous assurons le contrôle d\'accès, la surveillance des installations, la protection des équipements, la gestion des visiteurs, les rondes de sécurité et la supervision opérationnelle.',
        ],
        [
            'question' => 'Intervenez-vous dans les zones minières éloignées ?',
            'answer' => 'Oui. Nous pouvons déployer des équipes dans les différentes régions minières de Guinée, notamment à Boké, Boffa, Siguiri, Kankan et dans d\'autres zones d\'exploitation.',
        ],
        [
            'question' => 'Comment assurez-vous le suivi des agents sur les sites miniers ?',
            'answer' => 'Nos superviseurs effectuent des contrôles réguliers et des rapports de suivi peuvent être transmis aux responsables du site.',
        ],
        [
            'question' => 'Pouvez-vous fournir un dispositif de sécurité 24h/24 ?',
            'answer' => 'Oui. Nous mettons en place des équipes organisées en rotation afin d\'assurer une couverture permanente des sites miniers.',
        ],
        [
            'question' => 'Quelle société de sécurité choisir pour un site minier à Boké ou Boffa ?',
            'answer' => 'Les régions de Boké et Boffa abritent certaines des plus importantes exploitations minières de Guinée. La sécurisation de ces sites nécessite une expertise spécifique, une capacité de déploiement en zones éloignées et une parfaite maîtrise des exigences du secteur minier. Super Sécurité accompagne les acteurs miniers avec des solutions adaptées à la protection des installations, du personnel et des équipements.',
        ],
        [
            'question' => 'Pourquoi faire appel à une société de sécurité pour protéger son domicile ?',
            'answer' => 'La présence d\'agents de sécurité contribue à dissuader les intrusions, à contrôler les accès et à renforcer la sécurité des occupants et des biens.',
        ],
        [
            'question' => 'Quels types de résidences protégez-vous ?',
            'answer' => 'Nous assurons la sécurité des villas, résidences privées, immeubles résidentiels, résidences diplomatiques et logements de cadres ou d\'expatriés.',
        ],
        [
            'question' => 'Les agents sont-ils présents de jour comme de nuit ?',
            'answer' => 'Oui. Selon les besoins du client, nous pouvons mettre en place une présence permanente ou des horaires adaptés.',
        ],
        [
            'question' => 'Vos agents contrôlent-ils les visiteurs ?',
            'answer' => 'Oui. Nos agents peuvent assurer l\'identification des visiteurs, le contrôle des entrées et sorties ainsi que le respect des consignes de sécurité du propriétaire.',
        ],
        [
            'question' => 'Puis-je bénéficier d\'un service de sécurité temporaire ?',
            'answer' => 'Oui. Nous proposons aussi des prestations ponctuelles pour des absences prolongées ou des périodes à risque.',
        ],
        [
            'question' => 'Comment déterminer le nombre d\'agents nécessaires ?',
            'answer' => 'Nos équipes réalisent une évaluation du domicile afin de recommander un dispositif adapté à sa configuration et aux risques identifiés.',
        ],
        [
            'question' => 'Comment protéger efficacement sa villa ou sa résidence à Conakry ?',
            'answer' => 'La protection d\'une résidence à Conakry repose sur plusieurs éléments : contrôle des accès, présence d\'agents de sécurité qualifiés, surveillance des visiteurs et application de procédures adaptées. Une solution de sécurité professionnelle permet de renforcer la tranquillité des occupants et de prévenir les risques d\'intrusion ou de vol.',
        ],
        [
            'question' => 'Pourquoi sécuriser un chantier en Guinée ?',
            'answer' => 'Les chantiers sont fréquemment exposés aux vols de matériaux, aux dégradations et aux intrusions. Une surveillance professionnelle permet de protéger les investissements et de limiter les interruptions de travaux.',
        ],
        [
            'question' => 'Quels types de chantiers protégez-vous ?',
            'answer' => 'Nous intervenons sur les chantiers de construction, les projets industriels, les infrastructures publiques, les projets miniers et les programmes immobiliers.',
        ],
        [
            'question' => 'Que font vos agents sur un chantier ?',
            'answer' => 'Ils assurent le contrôle des accès, la surveillance des matériaux et équipements, les rondes de sécurité et la gestion des entrées et sorties du personnel.',
        ],
        [
            'question' => 'La surveillance est-elle assurée en dehors des heures de travail ?',
            'answer' => 'Oui. Nous proposons une surveillance de nuit, les week-ends et les jours fériés afin de garantir une protection continue.',
        ],
        [
            'question' => 'Pouvez-vous intervenir rapidement sur un nouveau chantier ?',
            'answer' => 'Oui. Nos équipes peuvent être déployées rapidement selon la localisation et les besoins du projet.',
        ],
        [
            'question' => 'Comment réduire les pertes liées aux vols sur les chantiers ?',
            'answer' => 'La mise en place d\'un dispositif de sécurité adapté, associé à des contrôles d\'accès et à une surveillance régulière, constitue la solution la plus efficace pour limiter les pertes et sécuriser les actifs du chantier.',
        ],
        [
            'question' => 'Comment sécuriser un chantier de construction à Conakry et dans les grandes villes de Guinée ?',
            'answer' => 'Les chantiers de construction sont souvent exposés aux vols de matériaux, aux intrusions et aux actes de vandalisme. La mise en place d\'un dispositif de sécurité adapté, comprenant le contrôle des accès, des rondes régulières et une surveillance en dehors des heures de travail, permet de protéger efficacement les investissements et d\'assurer la continuité des travaux.',
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
